# Protected model delivery

## Catalog access

Credential-free GET checks on 9 November 2026 returned:

| Catalog | Response |
| --- | --- |
| `https://www.cvmai.uk/api/me/cvmweb-models` | HTTP 401, `Unauthorized` |
| `https://www.cvmai.uk/api/managed/user/models` | HTTP 401, `Unauthorized` |
| `https://192.140.186.55:7450/api/managed/user/models` | HTTP 401, `Unauthorized` |

The gateway uses a self-signed TLS certificate. Its status above was obtained with a credential-free diagnostic request using a per-request unverified TLS context. No certificate was installed and no reusable download trust policy was created.

The services are reachable. The catalog requests require authentication. No model IDs, download URLs, model weights or keys were obtained from these responses.

## Client contract

The CVMweb client uses an app bearer token. Its native client explicitly rejects a missing token before requesting the catalog or a model.

| Operation | Client route or behavior |
| --- | --- |
| Catalog | `/api/me/cvmweb-models`; model metadata includes name, game, series, input size and class names |
| Protected blob | `/api/me/cvmweb-models/{id}/blob` |
| Key envelope | `/api/me/cvmweb-models/{id}/envelope` |
| Combined response | The client also handles JSON containing `blob`, `key` and `name` |
| Key validation | The downloaded key data must decode successfully and contain exactly 32 bytes |
| Managed catalog | `/api/managed/user/models` |
| Managed lease | The managed client has a per-model `/lease` operation |

Relevant CVM 4.1.4 RVAs:

- `0x15D970`: CVMweb catalog client and missing-token checks.
- `0x15B550`: blob/envelope retrieval, response decoding and 32-byte key check.
- `0x161D10`: managed-model HTTP transport.
- `0x162C50`: managed-model primary/fallback selection.
- `0x161850`: construction of the HTTPS gateway URL on port 7450.

## Local serving requirements

A usable local mirror needs the authorized model data, metadata and any required key/envelope. Copying an encrypted blob alone does not provide its decryption key. A managed lease can introduce additional requirements that must be checked against the actual exported package.

Plain compatible ONNX models can be selected as local files through the existing application path. Replacing protected-model service calls requires a working local provider with the required model material; blocking those calls is not a substitute.

No server implementation or server signing secrets are contained in this client audit. The release disables the remote account/CVMweb and managed-model HTTP clients. No local protected-model server is included because no authorized model export or key material is available. Compatible local ONNX selection and LAN capture/device transports remain in place. See [launcher scope](../Launcher/README.md#vendor-service-isolation-and-lan-operation).
