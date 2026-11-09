// Public download destination, rendered inside the unchanged CVMAI shell.
function TB({lang:e}) {
  const [release,setRelease]=j.useState(null),[error,setError]=j.useState(false);
  j.useEffect(()=>{let active=true;fetch('/release.json',{cache:'no-store'}).then(r=>{if(!r.ok)throw new Error('release');return r.json()}).then(r=>{if(active)setRelease(r)}).catch(()=>{if(active)setError(true)});return()=>{active=false}},[]);
  const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const copy={...(SB[e]||SB.en),subtitle:'Get the assembled CVM AI 4.1.4 runtime and English instructions. The CVM AI launcher and environment files are included together; a trained detector is required separately.',factLauncher:'Launcher · included',factEnvironment:'Environment · included',envFaceSub:'Included in the package',infoLauncherSub:'Use Start CVM.cmd',infoEnvSub:'Libraries and tools in one package',sceneStableTag:'4.1.4 · Windows'};
  const size=release?.sizeBytes?(release.sizeBytes/1024/1024/1024).toFixed(2)+' GB':'';
  const url=release?.downloadUrl&&/^https?:\/\//.test(release.downloadUrl)?release.downloadUrl:null;
  const assetBase='https://github.com/terrafirma2021/CVMAI/releases/download/v4.1.4/';
  const assetLinks=(release?.parts||[]).map((part,index)=>`<a class="dlv-btn dlv-btn-sm" href="${assetBase+encodeURIComponent(part.file)}" rel="noopener">Part ${index+1} · ${(part.bytes/1024/1024/1024).toFixed(2)} GB ↓</a>`).join('');
  const directDownloads=url?`<div class="mt-6 flex flex-wrap gap-3" aria-label="Windows release files">${assetLinks}<a class="dlv-btn dlv-btn-sm" href="${assetBase}Extract-release.cmd" rel="noopener">Extraction helper ↓</a></div><p class="mt-4 text-sm leading-6 text-fg-muted">Download all three parts and <code>Extract-release.cmd</code> into the same folder, then run the helper to join, verify and extract. The compiled launcher is included; open <code>Start CVM.cmd</code> after extraction. No build step is needed.</p>`:'';
  const button=url?`<a class="dlv-btn dlv-btn-uv" href="${esc(url)}" rel="noopener">Open Windows release <span aria-hidden="true">↗</span></a>`:`<button class="dlv-btn dlv-btn-uv" disabled style="opacity:.55;cursor:not-allowed">${error?'Release information unavailable':'Application upload pending'}</button>`;
  const content=`<section class="mt-8 grid gap-5 lg:grid-cols-2" aria-label="Release downloads">
    <article class="dlv-glass rounded-[20px] p-6 sm:p-8">
      <p class="orbit-eyebrow">Windows package</p><h2 class="mt-3 font-display text-3xl font-bold text-fg">CVM AI 4.1.4</h2>
      <p class="mt-3 text-[15px] leading-7 text-fg-muted">The assembled Windows runtime, CVM AI launcher and English instructions in one package. A compatible trained detector is required separately.</p>
      <div class="my-6 flex flex-wrap gap-2"><span class="rounded-full border border-white/10 px-3 py-1.5 text-sm text-fg-muted">Windows x64</span><span class="rounded-full border border-white/10 px-3 py-1.5 text-sm text-fg-muted">${size||'Full runtime'}</span></div>
      ${button}${directDownloads}<p class="mt-4 text-sm leading-6 text-fg-subtle">${url?'Open the release files on GitHub, extract the complete package, then use Start CVM.cmd.':'The package is prepared locally. Its download will open when the release file is published.'}</p>
      ${release?.sha256?`<details class="mt-5 text-sm text-fg-muted"><summary class="cursor-pointer">Verify SHA-256</summary><code class="mt-3 block break-all rounded-xl bg-ink/50 p-3 text-xs">${esc(release.sha256)}</code></details>`:''}
    </article>
    <article class="dlv-glass rounded-[20px] p-6 sm:p-8">
      <p class="orbit-eyebrow">Setup &amp; reference</p><h2 class="mt-3 font-display text-3xl font-bold text-fg">English user guides</h2>
      <p class="mt-3 text-[15px] leading-7 text-fg-muted">Startup, capture, model selection, output, settings and troubleshooting. Read the two-PC setup and ONNX/TensorRT instructions online, or keep the guide for offline use.</p>
      <div class="mt-6 flex flex-wrap gap-3"><a class="dlv-btn dlv-btn-uv" href="/guides">Read the guide <span aria-hidden="true">↗</span></a><a class="dlv-btn dlv-btn-sm" href="/downloads/CVMAI-English-Guides.zip" download>Download guides ↓</a></div>
      <p class="mt-4 text-sm leading-6 text-fg-subtle">No sign-in is required for these documents.</p>
    </article>
  </section>
  <section class="dlv-glass mt-6 rounded-[20px] p-6 sm:p-8" aria-labelledby="release-start"><p class="orbit-eyebrow">First use</p><h2 id="release-start" class="mt-3 font-display text-2xl font-bold">Keep the whole runtime together</h2><p class="mt-3 text-[15px] leading-7 text-fg-muted">Extract the release and open <code>Start CVM.cmd</code>. Keep the <code>App</code> folder together. Configure the source, your trained model and output, then check each stage in the preview. The model directory is empty; <code>model.onnx</code> is a placeholder.</p><a class="mt-5 inline-flex min-h-11 items-center gap-2 font-display font-bold text-brand-orange" href="/guides/START%20HERE.txt">Open the quick checklist →</a></section>`;
  return t.jsxs('div',{className:'dlv-root pb-8 text-left',children:[t.jsx(Zw,{copy}),t.jsx('div',{dangerouslySetInnerHTML:{__html:content}})]});
}
