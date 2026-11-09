# C# launcher source

`Launcher` implements the fixed, 24-site loaded-image patch plan for CVM AI 4.1.4. The original application EXE remains unchanged on disk.

- [Protection, application checks and patch effects](Launcher/README.md)
- [Windows process creation and memory-write implementation](Launcher/Launcher.cs)
- [Exact instruction plan](Launcher/PatchData.cs) and [patch manifest](Launcher/patches.json)
- [Build script](Launcher/Build.ps1)
- [Validation](Launcher/validation.json)

These files are the launcher source. The CVM application and its vendor runtime dependencies remain binary components in `App`.

## Optional source checkout

The packaged release already contains the compiled launcher. A developer cloning the complete runtime needs Git LFS:

```powershell
git lfs install
git clone -c core.longpaths=true https://github.com/terrafirma2021/CVMAI.git
cd CVMAI
git lfs pull
```

The website lives at [CVM AI](https://terrafirma2021.github.io/CVMAI). Build it using `Website/requirements.txt`, `npm ci --prefix Website` and `python Website/build.py`.
