@echo off
setlocal
if not exist "%~dp0App\CVM AI.exe" goto missing
if not exist "%~dp0App\cvm-4.1.4.exe" goto missing
pushd "%~dp0App" || goto missing
start "" "CVM AI.exe"
popd
exit /b 0
:missing
echo The App folder is incomplete. Extract the complete CVM AI release and try again.
pause
exit /b 1
