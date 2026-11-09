# CVM AI 4.1.4 instruction patches

Launcher **1.1.0.0** applies **24 fixed patches** to the mapped image of the exact supported 4.1.4 EXE. The original EXE is not modified on disk. RVAs below are added to the child's actual image base. Byte strings are hexadecimal.

The C# implementation creates its own child suspended, validates the input file hash/PE identity and every original site before writing, applies the fixed replacements with temporary page permissions, restores protections, verifies writes and flushes the instruction cache before resuming. A mismatch prevents resumption. See [Launcher.cs](Launcher.cs) and [PatchData.cs](PatchData.cs).

## Vendor HTTP and usage patches

Seven scoped application call sites for `WinHttpOpen` are replaced with `xor eax, eax` plus padding (`31c090909090`). The resulting null session follows each client's existing failure/cleanup path before `WinHttpConnect`, request creation or sending. The clients cover account/CVMweb models, managed models, self-check, binary trust, error uploads, cloud parameters and usage census.

The usage dispatcher at `0x1A3430` is separately changed to return zero (`31c0c3909090`) before payload construction and reporting-thread creation. Account-worker startup at `0x121A40` also returns before starting that worker. These are application-code changes; the system WinHTTP/Winsock implementations and LAN socket transports are not hooked or blocked.

Local profile operations, compatible local ONNX/TensorRT paths, two-PC capture and device transports remain in place. Cloud parameter sync and protected-model delivery are unavailable. The launcher supplies no protected-model keys. No hosts-file patch, persistent firewall rule or system-DLL replacement is installed.

## Complete 24-site inventory

| Patch | RVA | Original bytes | Replacement bytes | Effect |
| --- | --- | --- | --- | --- |
| `direct-entry-parent-check` | `0x6DAF0D` | `e87e90aaff` | `b001909090` | Replace the call that checks the authorized parent name, parent-file hash allowlist and watermark. Its reason string is already initialized empty by the caller. |
| `no-launcher-pipe` | `0x6CD172` | `0f85ec000000` | `e9bd07000090` | Continue after the launcher-pipe read, seed and MAC checks; no inherited launcher pipe exists in a direct launch. |
| `do-not-start-account-worker` | `0x121A40` | `48895c241855` | `31c0c3909090` | Return false at the authorization-worker start function itself. All callers are prevented from creating the CVA1 worker; startup snapshot construction remains in its caller. |
| `local-config-after-snapshot` | `0x6CEE31` | `0f857d040000` | `e98e05000090` | After construction of the permission snapshot and return from the initial-accept helper, use the existing configuration load path without starting the account watchdog. Preserve all snapshot initialization and destructors. |
| `local-runtime-start` | `0x665280` | `48895c240848` | `b801000000c3` | Allow the before-processing local runtime check without queueing a verify request to the deliberately inactive account worker. |
| `local-runtime-permit` | `0x141F50` | `48895c241056` | `b801000000c3` | The permit accessor otherwise rejects the unpublished remote permit state; its callers consume a Boolean. |
| `no-enforcement-file-deletion` | `0x177670` | `48895c242055` | `b801000000c3` | Disable the script builder shared by the exit/enforcement cleanup wrappers. Return success before filesystem/script operations. |
| `local-domain-permission` | `0x141CF0` | `48895c240848` | `b801000000c3` | Shared Boolean domain check used by processing, actuators and startup/UI callbacks; local mode does not publish a remote lease. |
| `local-aggregate-permission` | `0x141EA0` | `48895c241056` | `b801000000c3` | Boolean aggregate accessor used when publishing permission state; no remote three-domain state is created in local mode. |
| `local-trt-status` | `0x1EED6C` | `0fb605c9d3190190` | `b801000000909090` | TRT status check reads a remote authorization-publication Boolean. Use the local permission result rather than that unpopulated remote flag. |
| `local-trt-build-check-1` | `0x1F1A53` | `0fb605e2a6190190` | `b801000000909090` | The ONNX/TensorRT builder interprets the same remote flag as cancellation. Preserve the builder while removing that remote-state prerequisite. |
| `local-trt-build-check-2` | `0x1F210D` | `0fb60528a0190190` | `b801000000909090` | Second remote-state cancellation check in the same ONNX/TensorRT builder. |
| `local-ui-auto-start` | `0x321664` | `0f85b6000000` | `e9b700000090` | Allow the auto-start handler to continue without the UI account-login Boolean; retain its normal processing-state checks. |
| `local-ui-start-load` | `0x320DAD` | `0f85d1000000` | `e9d200000090` | Allow the start/load handler to continue without the UI account-login Boolean; retain model/configuration validation. |
| `show-local-start-stop` | `0x36D992` | `0fb69eb8150000` | `b3019090909090` | Keep Start/Stop visible in the status refresh independently of the UI account-login Boolean. |
| `hide-unused-account-login` | `0x36D9F1` | `0f94c3` | `30db90` | Hide the account-login button in that same refresh routine for this local build. |
| `no-vendor-http-app-auth` | `0x15A3FA` | `ff1510c38100` | `31c090909090` | Replace this vendor client WinHttpOpen call with a null session result. Preserve URL parsing, initialized outputs, native failure handling and destructors; no Connect/OpenRequest/SendRequest path is entered. |
| `no-vendor-http-managed-model` | `0x1620E6` | `ff1524468100` | `31c090909090` | Replace this vendor client WinHttpOpen call with a null session result. Preserve URL parsing, initialized outputs, native failure handling and destructors; no Connect/OpenRequest/SendRequest path is entered. |
| `no-vendor-http-selfcheck` | `0x176008` | `ff1502078000` | `31c090909090` | Replace this vendor client WinHttpOpen call with a null session result. Preserve URL parsing, initialized outputs, native failure handling and destructors; no Connect/OpenRequest/SendRequest path is entered. |
| `no-vendor-http-binary-trust` | `0x1865F2` | `ff1518017f00` | `31c090909090` | Replace this vendor client WinHttpOpen call with a null session result. Preserve URL parsing, initialized outputs, native failure handling and destructors; no Connect/OpenRequest/SendRequest path is entered. |
| `no-vendor-http-error-report` | `0x1966D9` | `ff1531007e00` | `31c090909090` | Replace this vendor client WinHttpOpen call with a null session result. Preserve URL parsing, initialized outputs, native failure handling and destructors; no Connect/OpenRequest/SendRequest path is entered. |
| `no-vendor-http-parameters` | `0x19B84C` | `ff15beae7d00` | `31c090909090` | Replace this vendor client WinHttpOpen call with a null session result. Preserve URL parsing, initialized outputs, native failure handling and destructors; no Connect/OpenRequest/SendRequest path is entered. |
| `no-vendor-http-usage-census` | `0x1A313F` | `ff15cb357d00` | `31c090909090` | Replace this vendor client WinHttpOpen call with a null session result. Preserve URL parsing, initialized outputs, native failure handling and destructors; no Connect/OpenRequest/SendRequest path is entered. |
| `no-usage-report-dispatch` | `0x1A3430` | `48895c24084c` | `31c0c3909090` | Return zero at the usage-report dispatcher before the payload builder, report deduplication state and detached reporting thread are entered. |

The machine-readable plan is [patches.json](patches.json). Validation evidence is in [validation.json](validation.json) and [native-validation.json](native-validation.json). This inventory documents the identified application paths; it is not a claim that every untested dependency is network-silent.
