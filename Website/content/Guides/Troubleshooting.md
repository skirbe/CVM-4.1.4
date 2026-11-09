# Troubleshooting

Find the earliest failing stage: **startup -> picture -> boxes -> selection -> output -> saved settings**. Later controls cannot repair missing inputs earlier in the flow.

| Symptom | Check first | Next action |
| --- | --- | --- |
| No window immediately after launch | Whether initialization is still running | Allow initialization to finish. Read any reported file/version error before starting another copy |
| Launcher says the file/version is unsupported | Main EXE identity | Restore the original matching 4.1.4 EXE beside `CVM AI.exe`; restore both application files from the same release |
| Missing `cvm-4.1.4.exe` or runtime file | Folder contents and entry point | Start the supplied `CVM AI.exe` beside its matched main EXE and complete runtime |
| Missing MSVCP/VCRUNTIME/CONCRT DLL | Microsoft C++ runtime | Provide the appropriate Visual C++ x64 runtime; keep bundled vendor DLLs in place |
| Qt platform/plugin error | `platforms/qwindows.dll` and matching Qt libraries | Restore the original runtime layout; do not move plugins beside random executables |
| A vendor capture backend reports an SDK/DLL missing | That device's driver/SDK | Configure the matching vendor dependency or use the appropriate source; this is not a general model problem |
| Blank or frozen preview | Capture source and format | Select the correct source/region. Check OBS sender/receiver ports/address, or card device and supported format |
| Only DML and TRT appear in Target Detect | Backend vs model format | These are the two inference backends: DML for compatible ONNX; TRT for NVIDIA TensorRT/engine use. Select the model file separately |
| TensorRT engine cannot load | Engine/GPU/runtime compatibility | Use an engine built for the intended environment or the compatible source ONNX; renaming an engine is not conversion |
| Model file cannot be opened | Actual file and configured path | Select a compatible trained file. `model.onnx` is a placeholder and App/models is empty |
| Conversion/engine build fails | Source model, family, shape and runtime compatibility | Validate the original ONNX path first. Check the build error; do not rename the extension or use a protected model as an ordinary ONNX file |
| Picture but no boxes | Model loaded, family/input shape/classes/confidence | Check model/export details, load classes and inspect preview. Temporarily lower confidence only as a diagnostic |
| Boxes have nonsense sizes/classes | Decoder family or incompatible export | Match the actual output layout; do not guess class IDs from another model |
| Several boxes on one object | NMS and detector output | Adjust overlap suppression while watching distinct nearby objects remain visible |
| Boxes but nothing selected | Allowed classes, FOV and active group/key | Show the FOV and selection marker; check the detection is eligible under this profile |
| Wrong object selected or selection jumps | Class filters, FOV, priority and switching | Restrict to relevant classes/region; inspect tracking and head/body pairings |
| Selected target but no movement | Activation key, output type and connection | Check the active key, simulated mode, real device status and actual COM/IP settings |
| Wrong direction or scale | Output mapping and device settings | Check controlled output first, before changing detection or PID values |
| Slow or inconsistent tracking | Source FPS, inference latency and output | Identify the slow stage; then adjust speed/damping only if the input/output chain is stable |
| Overshoot or oscillation | Speed, damping and prediction | Reduce excessive speed/prediction; adjust one control at a time with optional curves/randomization off |
| Aim jumps vertically | Head/body class pairing, aim point, recoil | Verify each separately; disable optional fusion/recoil while isolating the cause |
| Triggerbot does not act | Trigger-zone preview, eligible class, key and output | Confirm zone alignment before changing delays or repeated-click timing |
| Recoil does nothing | Mode, script contents and activation conditions | Check Require Target/ADS and choose a script containing valid movement data |
| Changed settings have no effect | Edited group/key vs active group/key | Select the intended profile, apply/save it and verify which one is active |
| Settings disappear after restart | Save action, location and writable folder | Reopen from the same folder and inspect the config file timestamp. Back up the current configuration before replacing it |
| Disk space grows quickly | Data collection and generated caches | Stop collection when finished. Review generated data before deleting anything |

## Reporting a problem usefully

Record the version, selected group/key, capture method, backend, model filename/family/input size, output method and the exact error text. State the last checkpoint that worked: picture, boxes, selection or output. A short description of that boundary is more useful than changing many settings at once.

Do not include authorization-export contents, device keys or tickets in a shared problem report. Use a copy of the configuration with those fields removed if sharing settings.

## If saving is the only problem

1. Stop processing and choose the intended group/key.
2. Save and check whether the configuration file was created or updated in App.
3. Confirm the folder is writable and that you reopen that same runtime copy.
4. Back up the file before resetting or trying a fresh configuration.
5. Restore only a configuration compatible with this 4.1.4 runtime.
