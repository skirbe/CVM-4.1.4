# Files and maintenance

## Keep the application together

`App` contains the launcher, main application and required runtime dependencies. Keep its DLLs, Qt plugins, Python files and data folders in their supplied locations. Move or back up the complete folder rather than individual executables.

## Your files

| Location or type | Purpose | Maintenance |
| --- | --- | --- |
| `App/models/` | Your trained detectors | Add compatible weights and keep their paths stable |
| `.onnx` | Local exported detector for DML or a supported TRT build | Match the expected model family and input/output layout |
| `.engine` | Local TensorRT detector used with TRT | Match the GPU/runtime and retain the model/build context |
| `.cvm` / `.cvmcache` | Protected model and related cache | Retain matching files and model-specific authorization |
| `App/arm_config.json` | Saved application settings | Back up before resetting or replacing |
| `App/recoil_scripts/` | Your recoil profiles | Script mode requires actual movement data |
| `App/qx_model_library/` / `.cvmscurve` | Movement or prediction data | These are separate from detector weights |
| Runtime caches | Generated acceleration data | Rebuild only when needed for the model/runtime |

The `Source` folder contains launcher code and technical documentation. It is useful for inspection or rebuilding; it is not a replacement for the binary application dependencies in `App`.

## Back up and move

Stop processing and close the application before making a backup. Keep your configuration, models, custom scripts and curves. Treat any device keys or authorization files as private.

Move the complete release folder when relocating the application. Select model and data paths again if their locations changed, then save the configuration.

## Update

Extract an update into a separate folder and retain a backup of your current setup. Use matching application and dependency files. Restore only compatible settings, models and profiles, then verify the pipeline before relying on the new copy.
