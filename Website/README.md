# CVM AI website

Live website: **https://terrafirma2021.github.io/CVMAI/**

The site uses the original CVMAI frontend, logo, fonts, graphics and animations, with a Windows release download page and an integrated English guide. Its application downloads are GitHub release assets; the desktop runtime is not embedded in the Pages deployment.

## Build and preview

The build uses Python 3, the pinned Markdown dependency and Node.js/npm for safe asset-path rewriting. From the repository root:

```powershell
python -m pip install -r Website/requirements.txt
npm ci --prefix Website
python Website/build.py
python Website/serve.py --port 4317
```

Open `http://127.0.0.1:4317/CVMAI/`. This serves the website only.

## Deployment

`.github/workflows/website.yml` builds `Website/dist` and deploys it with GitHub Pages when `main` is pushed. The workflow checks out website source without fetching the large desktop Git LFS objects. Repository Settings → Pages uses **GitHub Actions** as its publishing source.

`site.config.json` declares the public URL. `github_pages.py` and `prefix-assets.cjs` adapt asset, API snapshot and navigation paths to the `/CVMAI/` project prefix. Physical index pages cover direct guide/download/hardware links. The original captured files in `source` remain the build input.

## Update content

| File | Edit |
| --- | --- |
| `content/README.md`, `content/Guides/*.md` | User-facing English guide |
| `content/START HERE.txt` | Quick checklist |
| `release.json` | Release URL, archive size, SHA-256 and numbered parts |
| `downloads-component.js` | Release download interface |
| `guide-component.js`, `guide.css` | Guide navigation and presentation |

Run the build after content changes. It generates the online chapter data, offline `USER GUIDE.html` and downloadable English guide ZIP together. Keep the corresponding root `Guides` and offline manual synchronized when packaging a Windows release.

The source includes anonymous public data snapshots for the frontend. Account/payment services and the private model library are not implemented here. The header links to the GitHub repository, and the download page links directly to its release files.
