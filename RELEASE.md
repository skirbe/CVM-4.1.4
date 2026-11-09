# Windows release: ready-to-run package

Use the [CVM AI 4.1.4 Windows release](https://github.com/terrafirma2021/CVMAI/releases/tag/v4.1.4). The C# launcher is already compiled as `App/CVM AI.exe`; normal users do not need to build source code.

## Download these files

| Asset | Purpose |
| --- | --- |
| `CVMAI-4.1.4-Windows-x64.zip.001` | Archive part 1 |
| `CVMAI-4.1.4-Windows-x64.zip.002` | Archive part 2 |
| `CVMAI-4.1.4-Windows-x64.zip.003` | Archive part 3 |
| `Extract-release.cmd` | Join, verify and extract the three parts |
| `SHA256SUMS.txt` | Optional manual archive/part verification |
| `README.txt` | Instructions beside the downloads |

Put the three parts and extraction helper in one writable folder. Run `Extract-release.cmd` and wait for the completion message. The helper refuses to overwrite an existing `CVM AI 4.1.4` directory; use a new folder for an update. Allow room for the downloaded parts, joined ZIP and extracted application.

GitHub splits the large release into numbered assets to fit its per-file limit. Its automatic **Source code** ZIP is not the packaged Windows runtime; Git LFS-managed files can be pointers in a source archive.

## Start and set up

1. Open the extracted `CVM AI 4.1.4` directory and run **`Start CVM.cmd`**. It launches the compiled `App/CVM AI.exe`. Keep it beside the matching main EXE and all bundled dependencies.
2. Configure desktop capture, your capture card or the compatible OBS UDP/TCP sender/receiver route. A two-PC sender targets the CVM PC's LAN IP on the matching protocol/port.
3. Supply your own compatible `.onnx` or `.engine` detector. Choose its model family, input resolution and classes. Select DML for compatible ONNX inference or TRT for NVIDIA TensorRT.
4. Configure the output device and activation key. Start and verify picture, detection boxes, target selection and output in that order.
5. Save your profile, stop processing and close. Reopen from the same folder to check settings were retained.

Read [the complete setup guide](Guides/Setup.md) or the included `USER GUIDE.html` for prerequisites, model/backend details and two-PC checks. Required system/device components depend on your selected graphics, capture and output hardware. Detector weights are not included.

## Package contents

`App` contains the complete runtime and compiled launcher; `Guides` and `USER GUIDE.html` contain the English instructions. `Source/Launcher` provides the C# implementation, build script, explained patch plan and validation reports. Building it is optional.

## Network behavior

The identified vendor account/model services, cloud sync, remote trust checks, error uploads and usage reporting are disabled. LAN capture/device traffic remains enabled. No hosts-file patch or global firewall block is installed.


Website: [CVM AI](https://terrafirma2021.github.io/CVMAI). The [online setup guide](https://terrafirma2021.github.io/CVMAI/guides#setup) matches the packaged English guide.
