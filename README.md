# CVM AI 4.1.4

[Website](https://terrafirma2021.github.io/CVMAI) · [Download Windows release](https://github.com/terrafirma2021/CVMAI/releases/tag/v4.1.4) · [Online setup guide](https://terrafirma2021.github.io/CVMAI/guides#setup)

CVM AI takes a video source, runs a compatible trained detector, selects a target and sends calculated movement through the configured output device. It runs as a Windows x64 desktop application and can receive video over a local network for a two-PC setup.

**The launcher is already compiled and included. Open `Start CVM.cmd` to run it.** Users do not need Visual Studio, a compiler, Git or a separate Python installation for the packaged application. Windows Sandbox is not required.

## Download and extract

Open the [Windows release](https://github.com/terrafirma2021/CVMAI/releases/tag/v4.1.4). Download these four files into the same writable folder:

```text
CVMAI-4.1.4-Windows-x64.zip.001
CVMAI-4.1.4-Windows-x64.zip.002
CVMAI-4.1.4-Windows-x64.zip.003
Extract-release.cmd
```

Run `Extract-release.cmd`. It joins the three parts, verifies the complete archive and extracts `CVM AI 4.1.4`. Keep the numbered parts unchanged until extraction succeeds. Allow space for the downloaded parts, the joined archive and the extracted runtime. Use a new folder when upgrading; the helper refuses to overwrite an existing `CVM AI 4.1.4` folder.

GitHub's automatically generated **Source code** ZIP is not the packaged Windows download and can contain Git LFS pointer files instead of large runtime binaries.

## Before the first run

| Requirement | What to prepare |
| --- | --- |
| Windows x64 | Extract to a location your account can write to; retain the entire `App` folder |
| Launcher runtime | Windows .NET Framework 4.x; use the [Microsoft .NET Framework runtime page](https://dotnet.microsoft.com/en-us/download/dotnet-framework/net48) if Windows reports it missing |
| Application runtime | If MSVCP/VCRUNTIME/CONCRT files are reported missing, install the x64 package from [Microsoft's Visual C++ Redistributable page](https://learn.microsoft.com/en-us/cpp/windows/latest-supported-vc-redist/) |
| Graphics/device support | Install the graphics driver and any driver/SDK required by the capture or output hardware you select |
| Detector | Supply your own compatible `.onnx` model or TensorRT `.engine`; trained detector weights are not included |
| Video source | Desktop capture, a capture card or a sender compatible with CVM's selected OBS UDP/TCP transport |
| Output | The supported serial, network or other output device you intend to use |

## First working configuration

1. Open `Start CVM.cmd`. It runs the supplied `App/CVM AI.exe` launcher beside the matched main executable. Start with one parameter group and leave automatic actions, macros, recoil and optional curves off.
2. Configure the **video source**. For a two-PC network source, match the sender's destination to the CVM PC's LAN address and match the protocol/port at both ends. For a capture card, select the actual device and a supported resolution/pixel format.
3. Put your model in `App/models` and select that actual file. Match the model family, input resolution and class mapping to its export information.
4. Select the **inference backend**: `DML` for compatible ONNX inference through DirectML, or `TRT` for NVIDIA TensorRT. A `.engine` requires a compatible TensorRT/GPU environment. These are backends, not model-format choices.
5. Configure the **output device**, its COM port or LAN address/port as applicable, and the activation key for the active group/key profile.
6. Click **Start**. Check the pipeline in order: an updating picture, sensible detection boxes, the intended selected target, then controlled output. Stop at the first stage that fails.
7. Click **Save**, stop processing, close and reopen from the same folder. Confirm that the selected profile and paths were retained.

See [Setup and first use](Guides/Setup.md) for the full two-PC checklist, model/backend choices and first-run checks.

## Model formats and backends

| File | How it is used |
| --- | --- |
| `.onnx` | Local exported detector, using a compatible family/input/output layout; usable through DML or as a TensorRT build source where supported |
| `.engine` | Local prebuilt TensorRT engine, used with TRT and a compatible GPU/runtime |
| `.cvm` | Protected format; needs matching model key/authorization material that this release does not supply |

`.cvmcache` is related protected cache data. Curve/prediction files such as `.cvmscurve` are separate from detector weights. PyTorch `.pt`/`.pth` training weights need a compatible export; changing an extension does not convert them.

## Folder layout

```text
CVM AI 4.1.4/
  Start CVM.cmd          Normal entry point
  START HERE.txt        Short first-run checklist
  USER GUIDE.html       Full English guide, readable offline
  README.md             This introduction
  App/
    CVM AI.exe          Compiled launcher, ready to run
    cvm-4.1.4.exe       Matched original application
    models/             Your detector files
    arm_config.json     Created/saved application configuration
    ...                 Required DLLs, plugins and runtime data
  Guides/               English Markdown instructions
  Source/Launcher/      C# source, optional build script and patch documentation
```

Keep `App` together. Do not start the protected main executable directly or move the launcher away from it. Back up your settings, models and custom profiles before replacing an installation.

## Network behavior

The identified vendor account/model services, cloud parameter sync, remote trust checks, error uploads and usage reporting are disabled. Usage payload collection is disabled too. LAN capture and device connections remain enabled; no hosts-file change or global firewall rule is installed. Use local profiles and local ONNX/engine files. Protected cloud models are not included.

## Tested scope

Native Windows startup and UI responsiveness were observed on 9 November 2026. Sandbox regression checks also covered saving, reopening, clean exit and TCP/UDP loopback. Full two-PC capture, real-model inference, engine building and physical device output still need validation with the intended hardware/model.

## Guides

| Guide | Use it for |
| --- | --- |
| [Setup](Guides/Setup.md) | Extraction, one/two-PC sources, models, output and first-run checks |
| [Settings](Guides/Settings.md) | What each control changes |
| [Troubleshooting](Guides/Troubleshooting.md) | Finding the earliest failing stage |
| [Files and maintenance](Guides/Files%20and%20maintenance.md) | Configuration, models and backups |

Open `USER GUIDE.html` for the same English manual without an internet connection. The C# launcher is supplied both as a compiled executable and as readable source; CVM and its vendor dependencies remain binary components.

## Source

The compiled launcher is ready to use. Its optional C# source, build instructions and technical validation reports are in [Source/Launcher](Source/Launcher/README.md). The website source is in `Website`.
