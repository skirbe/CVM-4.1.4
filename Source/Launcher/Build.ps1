param([string]$OutputPath=(Join-Path $PSScriptRoot 'CVM AI.exe'))
$ErrorActionPreference='Stop'
$compiler=Join-Path $env:WINDIR 'Microsoft.NET\Framework64\v4.0.30319\csc.exe'
if (-not (Test-Path -LiteralPath $compiler)) {throw 'The Windows .NET Framework x64 compiler is required.'}
$arguments=@('/nologo','/target:winexe','/platform:x64','/optimize+','/checked+','/debug-','/reference:System.Windows.Forms.dll',('/win32manifest:'+(Join-Path $PSScriptRoot 'app.manifest')),('/out:'+$OutputPath),(Join-Path $PSScriptRoot 'Launcher.cs'),(Join-Path $PSScriptRoot 'PatchData.cs'))
if (Test-Path -LiteralPath (Join-Path $PSScriptRoot 'CVMAI.ico')) {$arguments+=('/win32icon:'+(Join-Path $PSScriptRoot 'CVMAI.ico'))}
& $compiler @arguments
if ($LASTEXITCODE -ne 0) {throw 'Launcher compilation failed.'}
Get-FileHash -LiteralPath $OutputPath -Algorithm SHA256
