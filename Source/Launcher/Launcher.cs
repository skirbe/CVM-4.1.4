using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.IO;
using System.Reflection;
using System.Runtime.InteropServices;
using System.Security.Cryptography;
using System.Text;
using System.Windows.Forms;

[assembly: AssemblyTitle("CVM AI Launcher")]
[assembly: AssemblyDescription("Version-pinned local launcher for the supplied CVM 4.1.4 executable")]
[assembly: AssemblyVersion("1.1.0.0")]
[assembly: AssemblyFileVersion("1.1.0.0")]

internal sealed class Patch {
    internal readonly string Id;
    internal readonly int Rva;
    internal readonly byte[] Before, After;
    internal Patch(string id, int rva, string before, string after) {
        Id=id; Rva=rva; Before=Hex(before); After=Hex(after);
        if (Before.Length!=After.Length || Before.Length==0) throw new InvalidOperationException("Invalid embedded patch.");
    }
    private static byte[] Hex(string value) {
        byte[] bytes=new byte[value.Length/2];
        for (int i=0;i<bytes.Length;i++) bytes[i]=Convert.ToByte(value.Substring(i*2,2),16);
        return bytes;
    }
}

internal static partial class Program {
    private const string Target="cvm-4.1.4.exe";
    private const string ExpectedHash="928468742916dbbfd4f1aebd08fa92d8e90e9db05de9abfe12b78a7863f41bd2";
    private const uint CreateSuspended=4, CreateNoWindow=0x08000000, ExecuteReadWrite=0x40;
    private static string reportPath;
    private static bool quiet;

    [STAThread]
    private static int Main(string[] args) {
        PROCESS_INFORMATION process=new PROCESS_INFORMATION();
        bool resumed=false;
        string state="error";
        int applied=0;
        try {
            bool verify=false;
            for (int i=0;i<args.Length;i++) {
                if (args[i]=="--quiet") quiet=true;
                else if (args[i]=="--verify-only") verify=true;
                else if (args[i]=="--report" && i+1<args.Length) reportPath=Path.GetFullPath(args[++i]);
                else throw new ArgumentException("Supported options: --verify-only, --quiet, --report FILE.");
            }
            if (IntPtr.Size!=8) throw new InvalidOperationException("Use 64-bit Windows.");
            string directory=Path.GetDirectoryName(Assembly.GetExecutingAssembly().Location);
            string target=Path.Combine(directory,Target);
            if (!File.Exists(target)) throw new FileNotFoundException("Put CVM AI.exe beside "+Target+" in the complete runtime folder.");

            // Keep this input open without write/delete sharing until startup is
            // prepared. Never write or replace the original executable.
            using (FileStream input=new FileStream(target,FileMode.Open,FileAccess.Read,FileShare.Read)) {
                string hash;
                using (SHA256 algorithm=SHA256.Create()) hash=BitConverter.ToString(algorithm.ComputeHash(input)).Replace("-","").ToLowerInvariant();
                if (hash!=ExpectedHash) throw new InvalidOperationException("This is not the supported CVM 4.1.4 file. Nothing was started. Restore the original matching executable.");
                byte[] image=new byte[(int)input.Length]; input.Position=0;
                int count=0;
                while (count<image.Length) {int read=input.Read(image,count,image.Length-count);if (read==0) throw new EndOfStreamException();count+=read;}
                ValidateDisk(image);
                if (verify) {Report("verified",0,0,null);return 0;}

                STARTUPINFO startup=new STARTUPINFO(); startup.cb=(uint)Marshal.SizeOf(typeof(STARTUPINFO));
                StringBuilder command=new StringBuilder("\""+target+"\"");
                if (!CreateProcessW(target,command,IntPtr.Zero,IntPtr.Zero,false,CreateSuspended|CreateNoWindow,IntPtr.Zero,directory,ref startup,out process)) Fail("Cannot create the CVM process");
                long imageBase=ImageBase(process.hProcess,image);

                // Validate the entire plan before the first write. Only the
                // newly created, suspended child can be modified by this tool.
                foreach (Patch patch in Patches) {
                    byte[] before=Read(process.hProcess,imageBase+patch.Rva,patch.Before.Length);
                    if (!Equal(before,patch.Before)) throw new InvalidOperationException("Unexpected loaded instructions at "+patch.Id+". CVM was not resumed.");
                }
                foreach (Patch patch in Patches) {
                    IntPtr address=new IntPtr(imageBase+patch.Rva);
                    UIntPtr size=new UIntPtr((uint)patch.After.Length), written;
                    uint previous;
                    if (!VirtualProtectEx(process.hProcess,address,size,ExecuteReadWrite,out previous)) Fail("Cannot prepare "+patch.Id);
                    bool writeOK=false, restoreOK=false;
                    try {
                        writeOK=WriteProcessMemory(process.hProcess,address,patch.After,size,out written) && written.ToUInt64()==(ulong)patch.After.Length;
                    } finally {
                        uint unused;
                        restoreOK=VirtualProtectEx(process.hProcess,address,size,previous,out unused);
                    }
                    if (!writeOK || !restoreOK) throw new InvalidOperationException("Could not safely apply "+patch.Id+". CVM was not resumed.");
                    if (!Equal(Read(process.hProcess,imageBase+patch.Rva,patch.After.Length),patch.After)) throw new InvalidOperationException("Verification failed at "+patch.Id+". CVM was not resumed.");
                    if (!FlushInstructionCache(process.hProcess,address,size)) Fail("Cannot synchronize "+patch.Id);
                    applied++;
                }
                if (ResumeThread(process.hThread)!=1) throw new InvalidOperationException("Could not resume the prepared CVM process.");
                resumed=true; state="started";
                Report(state,process.dwProcessId,applied,null);
            }
            return 0;
        } catch (Exception exception) {
            if (!resumed && process.hProcess!=IntPtr.Zero) TerminateProcess(process.hProcess,1);
            try {Report(state,process.dwProcessId,applied,exception.Message);} catch {}
            if (!quiet) MessageBox.Show(exception.Message,"CVM AI Launcher",MessageBoxButtons.OK,MessageBoxIcon.Error);
            return 1;
        } finally {
            if (process.hThread!=IntPtr.Zero) CloseHandle(process.hThread);
            if (process.hProcess!=IntPtr.Zero) CloseHandle(process.hProcess);
        }
    }

    private static void ValidateDisk(byte[] image) {
        int nt=BitConverter.ToInt32(image,0x3c), optional=nt+24;
        if (image[0]!='M' || image[1]!='Z' || BitConverter.ToUInt32(image,nt)!=0x4550 || BitConverter.ToUInt16(image,nt+4)!=0x8664 || BitConverter.ToUInt16(image,optional)!=0x20b) throw new InvalidOperationException("Unexpected x64 executable headers.");
        int sections=BitConverter.ToUInt16(image,nt+6), table=optional+BitConverter.ToUInt16(image,nt+20);
        foreach (Patch patch in Patches) {
            int offset=-1;
            for (int i=0;i<sections;i++) {
                int section=table+i*40, start=BitConverter.ToInt32(image,section+12), size=BitConverter.ToInt32(image,section+16);
                if (patch.Rva>=start && patch.Rva+patch.Before.Length<=start+size) {offset=BitConverter.ToInt32(image,section+20)+patch.Rva-start;break;}
            }
            if (offset<0) throw new InvalidOperationException("Unsupported image layout.");
            for (int n=0;n<patch.Before.Length;n++) if (image[offset+n]!=patch.Before[n]) throw new InvalidOperationException("Original instruction mismatch: "+patch.Id);
        }
    }

    private static long ImageBase(IntPtr process,byte[] disk) {
        PROCESS_BASIC_INFORMATION info;uint length;
        int status=NtQueryInformationProcess(process,0,out info,(uint)Marshal.SizeOf(typeof(PROCESS_BASIC_INFORMATION)),out length);
        if (status!=0 || info.PebBaseAddress==IntPtr.Zero) throw new InvalidOperationException("Cannot identify this child's mapped image.");
        long address=BitConverter.ToInt64(Read(process,info.PebBaseAddress.ToInt64()+0x10,8),0);
        byte[] dos=Read(process,address,64);
        int nt=BitConverter.ToInt32(dos,0x3c);
        if (dos[0]!='M' || dos[1]!='Z' || nt!=BitConverter.ToInt32(disk,0x3c)) throw new InvalidOperationException("Unexpected child image header.");
        byte[] pe=Read(process,address+nt,64);
        if (BitConverter.ToUInt32(pe,0)!=0x4550 || BitConverter.ToUInt32(pe,8)!=BitConverter.ToUInt32(disk,nt+8)) throw new InvalidOperationException("Unexpected child image identity.");
        return address;
    }

    private static byte[] Read(IntPtr process,long address,int size) {
        byte[] data=new byte[size];UIntPtr count;
        if (!ReadProcessMemory(process,new IntPtr(address),data,new UIntPtr((uint)size),out count) || count.ToUInt64()!=(ulong)size) Fail("Cannot verify the child's image");
        return data;
    }
    private static bool Equal(byte[] a,byte[] b) {if(a.Length!=b.Length)return false;for(int i=0;i<a.Length;i++)if(a[i]!=b[i])return false;return true;}
    private static void Fail(string message) {throw new Win32Exception(Marshal.GetLastWin32Error(),message);}
    private static string Quote(string text) {return "\""+(text??"").Replace("\\","\\\\").Replace("\"","\\\"").Replace("\r","\\r").Replace("\n","\\n").Replace("\t","\\t")+"\"";}
    private static void Report(string state,uint child,int applied,string error) {
        if (reportPath==null)return;
        string json="{\"state\":"+Quote(state)+",\"child_pid\":"+child+",\"patch_count\":"+applied+",\"supported_sha256\":"+Quote(ExpectedHash)+",\"disk_modified\":false,\"error\":"+(error==null?"null":Quote(error))+"}";
        File.WriteAllText(reportPath,json,new UTF8Encoding(false));
    }

    [StructLayout(LayoutKind.Sequential)] private struct PROCESS_BASIC_INFORMATION {internal IntPtr ExitStatus,PebBaseAddress,AffinityMask,BasePriority,UniqueProcessId,InheritedFromUniqueProcessId;}
    [StructLayout(LayoutKind.Sequential)] private struct PROCESS_INFORMATION {internal IntPtr hProcess,hThread;internal uint dwProcessId,dwThreadId;}
    [StructLayout(LayoutKind.Sequential,CharSet=CharSet.Unicode)] private struct STARTUPINFO {internal uint cb;internal string lpReserved,lpDesktop,lpTitle;internal uint dwX,dwY,dwXSize,dwYSize,dwXCountChars,dwYCountChars,dwFillAttribute,dwFlags;internal ushort wShowWindow,cbReserved2;internal IntPtr lpReserved2,hStdInput,hStdOutput,hStdError;}
    [DllImport("kernel32.dll",CharSet=CharSet.Unicode,SetLastError=true)] private static extern bool CreateProcessW(string file,StringBuilder command,IntPtr processAttributes,IntPtr threadAttributes,bool inheritHandles,uint flags,IntPtr environment,string directory,ref STARTUPINFO startup,out PROCESS_INFORMATION process);
    [DllImport("ntdll.dll")] private static extern int NtQueryInformationProcess(IntPtr process,int kind,out PROCESS_BASIC_INFORMATION info,uint size,out uint returned);
    [DllImport("kernel32.dll",SetLastError=true)] private static extern bool ReadProcessMemory(IntPtr process,IntPtr address,byte[] bytes,UIntPtr size,out UIntPtr read);
    [DllImport("kernel32.dll",SetLastError=true)] private static extern bool WriteProcessMemory(IntPtr process,IntPtr address,byte[] bytes,UIntPtr size,out UIntPtr written);
    [DllImport("kernel32.dll",SetLastError=true)] private static extern bool VirtualProtectEx(IntPtr process,IntPtr address,UIntPtr size,uint protection,out uint previous);
    [DllImport("kernel32.dll",SetLastError=true)] private static extern bool FlushInstructionCache(IntPtr process,IntPtr address,UIntPtr size);
    [DllImport("kernel32.dll",SetLastError=true)] private static extern uint ResumeThread(IntPtr thread);
    [DllImport("kernel32.dll",SetLastError=true)] private static extern bool TerminateProcess(IntPtr process,uint exitCode);
    [DllImport("kernel32.dll")] private static extern bool CloseHandle(IntPtr handle);
}
