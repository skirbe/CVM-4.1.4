# CVM AI 4.1.4 launcher

`CVM AI.exe` applies 24 authorization, startup and vendor-service changes to the loaded CVM image. The protected executable remains unchanged on disk. The source is [Launcher.cs](Launcher.cs); the exact instructions are in [PatchData.cs](PatchData.cs) and [patches.json](patches.json).

## Patch inventory

[PATCHES.md](PATCHES.md) lists all 24 sites with exact original/replacement bytes and effects, including all seven vendor HTTP clients and the separate usage-dispatch patch. The compiled C# plan is [PatchData.cs](PatchData.cs); [patches.json](patches.json) is the matching machine-readable plan.

## Target and protection

The target is the Windows x64 `cvm-4.1.4.exe` with SHA-256:

```text
928468742916dbbfd4f1aebd08fa92d8e90e9db05de9abfe12b78a7863f41bd2
```

CVM uses **Themida protection with an on-disk image-integrity check**, plus application-level launcher and account checks. This implementation keeps Themida's input file intact and changes the application checks in the mapped process image. It does not unpack or remove Themida.

## CVM checks and patch effects

All addresses below are **RVAs**: offsets from the process image base, not absolute addresses or file offsets.

| Check | CVM behavior | Change |
| --- | --- | --- |
| Parent identity | The parent verifier checks launcher name, parent-file SHA-256 against an authorization allowlist, and a watermark trailer with payload-integrity checks. | At `0x6DAF0D`, replace the verifier call with `mov al, 1` and padding. Its caller receives success without invoking the verifier at `0x183F90`. |
| Launcher IPC | Startup expects a launcher pipe handshake, including seed and MAC checks. | At `0x6CD172`, branch past that handshake. No launcher pipe, seed or MAC is fabricated. |
| Account startup and watchdog | Startup launches the account worker and uses its authorization state to control progress. | At the worker startup entry `0x121A40`, return zero before starting the worker. At `0x6CEE31`, select the existing configuration-load path after permission-snapshot construction. The account watchdog startup path is skipped. |
| Before-processing authorization | The processing-start verifier requests authorization through the account worker. | At `0x665280`, return `1` with `mov eax, 1; ret`. |
| Shared permissions | Domain, aggregate and permit accessors consume remote authorization state. | At `0x141CF0`, `0x141EA0` and `0x141F50`, return `1`. Their callers receive the local permission result. |
| TensorRT authorization state | Status/build code reads the authorization-publication flag at RVA `0x138C13C`. | At `0x1EED6C`, `0x1F1A53` and `0x1F210D`, replace those reads with `eax = 1`. The engine builder itself is retained. |
| Start/Load and Auto-start UI gates | The handlers require the UI account-login Boolean. | At `0x320DAD` and `0x321664`, branch past those account gates while retaining the subsequent model, configuration and processing checks. |
| UI visibility | Status refresh uses account state to choose Start/Stop and login-button visibility. | At `0x36D992`, set `bl = 1` for Start/Stop. At `0x36D9F1`, clear `bl` for the login button. |
| Enforcement cleanup | A shared routine builds and launches a cleanup script from enforcement/exit paths. | At `0x177670`, return `1` before the routine performs script or filesystem operations. |

The configuration-load error branch, snapshot construction/destruction, capture and detector implementations, model validation, protected-model decryption and ordinary shutdown remain in place. This launcher supplies no model-decryption keys or server account session.

## Vendor service isolation and LAN operation

The launcher changes these application call sites to return a null WinHTTP session. Each caller takes its existing failure/cleanup path before connecting or sending a request. System WinHTTP and Winsock implementations are unchanged.

| Client | WinHttpOpen call RVA |
| --- | --- |
| Account and CVMweb models | `0x15A3FA` |
| Managed models | `0x1620E6` |
| Remote self-check | `0x176008` |
| Remote binary trust | `0x1865F2` |
| Error reports | `0x1966D9` |
| Cloud parameters | `0x19B84C` |
| Usage reports | `0x1A313F` |

At `0x1A3430`, the usage dispatcher returns before building the payload or creating the reporting thread. The native payload includes account/Discord identifiers, CVM version, capture/input selection and CPU/GPU/board/OS/memory information. Its transport targets `http://192.140.186.55:7445/usage-profile`; the producer and transport are both disabled.

Cloud parameter synchronization and protected-model downloads are unavailable. Local profile Save/reopen and compatible local model loading paths are retained. No protected model files or decryption keys are supplied.

The patch does not alter socket APIs, capture implementations or device transports. LAN traffic for a two-PC setup remains enabled. It installs no hosts entry, firewall rule, system-DLL hook or global network block. This is a fixed patch of the identified vendor clients, not a claim that every untested dependency is network-silent.

## Implementation sequence

1. Open the target read-only, check its SHA-256 and x64 PE headers, and verify the original bytes for every patch using the PE section table.
2. Call `CreateProcessW` with `CREATE_SUSPENDED`. The child has not run its application entry point.
3. Obtain the child's PEB with `NtQueryInformationProcess`; read `PEB + 0x10` to obtain the actual image base. Addresses are calculated as `imageBase + RVA`, so the launcher does not assume the preferred base address.
4. Verify the mapped PE identity and **all 24 original instruction sequences before the first write**.
5. For each site, change protection with `VirtualProtectEx`, write with `WriteProcessMemory`, restore the previous protection, read back the bytes and call `FlushInstructionCache`.
6. Resume the primary thread with `ResumeThread` only after every change passes verification. The launcher then closes its handles and exits.

A file mismatch prevents process creation. A preparation failure after creation terminates that suspended child before it is resumed. The target filename and patch plan are fixed; the launcher cannot attach to an arbitrary process.

## Compiled release and optional build

The Windows package includes the compiled `App/CVM AI.exe` launcher. Users run `Start CVM.cmd`; the following build instructions are only for rebuilding from source. Windows Sandbox is not a launcher dependency.

## Build and run

From `Source/Launcher`, using the Windows .NET Framework x64 compiler:

```powershell
.\Build.ps1
Copy-Item -LiteralPath '.\CVM AI.exe' -Destination '..\..\App\CVM AI.exe'
```

Use `Start CVM.cmd` in the release root, or `App/CVM AI.exe`. Keep the launcher beside the matching main EXE and retain the complete `App` folder. The manifest requests ordinary user execution.

`--verify-only --quiet --report FILE` checks the on-disk target and instruction plan without creating CVM. `--report FILE` is optional for a normal launch; successful launches otherwise create no launcher log.

## Verified scope

[validation.json](validation.json) records isolated Windows Sandbox checks: all 24 memory changes matched, the UI opened, Save and profile reopening worked, shutdown returned exit code `0`, and the on-disk target hash stayed unchanged. Missing and wrong-version targets were rejected without creating a child.

Native TCP and UDP loopback echo probes succeeded inside the patched CVM process. The guest had networking enabled, external outbound traffic blocked and a verified blocked-connection audit control. No external connection events were observed for the tested application sessions. This tests socket availability; physical device output, real LAN capture, detector inference and TensorRT engine building remain unverified.

A compatible trained local detector is required separately.

Native Windows startup and a responsive CVM window were also observed in two launch checks on 9 November 2026. See [native-validation.json](native-validation.json). This is separate from the Sandbox regressions and does not establish trained-model inference or physical device behavior. Static analysis and compilation were performed on the host; CVM execution tests used Sandbox until the authorized native startup checks.
