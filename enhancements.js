(() => {
  const owner = 'yasinaa2026-hash';
  const $ = (s, root = document) => root.querySelector(s);
  const $$ = (s, root = document) => [...root.querySelectorAll(s)];

  const repos = [
    ['codethd','Tools','https://yasinaa2026-hash.github.io/codethd/'],
    ['codeyau','Websites','https://yasinaa2026-hash.github.io/codeyau/'],
    ['Learning-English','Education','https://yasinaa2026-hash.github.io/Learning-English/'],
    ['godh123','Apps'],['Minecraft','Games'],['-12','Experiments'],['-pronunciation','Education'],
    ['Flashcards','Education'],['html','Websites'],['calculator','Tools'],['opencode','Tools'],
    ['Quran-Reels-Generator','Apps'],['-Learning-programming','Education']
  ];

  function repoUrl(name){ return `https://github.com/${owner}/${encodeURIComponent(name)}`; }

  function addPulseSection(){
    const strip = $('.signal-strip');
    if(!strip || $('#snpPulse')) return;
    const section = document.createElement('section');
    section.className = 'spx-section container';
    section.id = 'snpPulse';
    section.innerHTML = `
      <div class="spx-grid">
        <article class="spx-card">
          <span class="spx-label">GitHub pulse</span>
          <h3>Building in public.</h3>
          <p>Recent public activity from the connected GitHub account appears here automatically.</p>
          <div class="spx-pulse"><i></i><span id="spxPulseState">Syncing activity…</span></div>
          <div class="spx-events" id="spxEvents"></div>
        </article>
        <article class="spx-card">
          <span class="spx-label">Live experiences</span>
          <h3 id="spxLiveApps">0 apps</h3>
          <p>Public projects that can be opened and tried directly, separate from their repositories.</p>
          <button class="spx-focus-btn" id="spxTryLive">Try a live project ↗</button>
        </article>
        <article class="spx-card">
          <span class="spx-label">Immersive mode</span>
          <h3>Open snp as a workspace.</h3>
          <p>A focused project explorer for people who want to browse your work like a developer tool.</p>
          <button class="spx-focus-btn" id="spxFocusBtn">Launch workspace ⌘</button>
        </article>
      </div>`;
    strip.insertAdjacentElement('afterend', section);

    const live = repos.filter(r => r[2]).length;
    $('#spxLiveApps').textContent = `${live} live apps`;
    $('#spxTryLive').onclick = () => {
      const liveRepo = repos.find(r => r[2]);
      if(liveRepo) window.open(liveRepo[2], '_blank', 'noopener,noreferrer');
    };
    $('#spxFocusBtn').onclick = openWorkspace;
    loadGithubPulse();
  }

  async function loadGithubPulse(){
    const state = $('#spxPulseState');
    const events = $('#spxEvents');
    if(!state || !events) return;
    try{
      const response = await fetch(`https://api.github.com/users/${owner}/events/public?per_page=6`, {headers:{Accept:'application/vnd.github+json'}});
      if(!response.ok) throw new Error('GitHub unavailable');
      const data = await response.json();
      if(!Array.isArray(data) || data.length === 0){
        state.textContent = 'No recent public events';
        events.innerHTML = '<div class="spx-event"><span>•</span><div><b>Keep building</b><small>New activity will appear here.</small></div></div>';
        return;
      }
      state.textContent = `${data.length} recent public events`;
      events.innerHTML = data.map(event => {
        const repo = event.repo?.name?.split('/').pop() || 'GitHub';
        const type = event.type.replace('Event','').replace('Push','Code push').replace('Create','Created').replace('Watch','Starred');
        const when = new Date(event.created_at).toLocaleDateString(undefined,{month:'short',day:'numeric'});
        return `<div class="spx-event"><span>◦</span><div><b>${escapeHtml(type)} · ${escapeHtml(repo)}</b><small>${escapeHtml(event.repo?.name || '')}</small></div><time>${when}</time></div>`;
      }).join('');
    }catch(err){
      state.textContent = 'GitHub pulse is offline';
      events.innerHTML = '<div class="spx-event"><span>↻</span><div><b>Activity unavailable</b><small>Projects and live demos are still available.</small></div></div>';
    }
  }

  function escapeHtml(value){
    return String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]));
  }

  function setupCursor(){
    if(!matchMedia('(pointer:fine)').matches || $('#snpCursorDot')) return;
    const dot = document.createElement('div');
    const ring = document.createElement('div');
    dot.className = 'snp-cursor-dot'; ring.className = 'snp-cursor-ring';
    document.body.append(dot, ring);
    document.body.classList.add('snp-cursor-on');
    let x = 0, y = 0, rx = 0, ry = 0;
    window.addEventListener('pointermove', e => { x = e.clientX; y = e.clientY; dot.style.opacity = '1'; ring.style.opacity = '1'; }, {passive:true});
    const loop = () => { rx += (x-rx)*.16; ry += (y-ry)*.16; dot.style.transform=`translate(${x}px,${y}px) translate(-50%,-50%)`; ring.style.transform=`translate(${rx}px,${ry}px) translate(-50%,-50%)`; requestAnimationFrame(loop); };
    loop();
    document.addEventListener('pointerdown',()=>document.body.classList.add('snp-cursor-active'));
    document.addEventListener('pointerup',()=>document.body.classList.remove('snp-cursor-active'));
    document.addEventListener('pointerleave',()=>{dot.style.opacity='0';ring.style.opacity='0';});
  }

  function improveTilt(){
    if(!matchMedia('(pointer:fine)').matches) return;
    $$('.project-card,.spotlight').forEach(card => {
      if(card.dataset.spxTilt) return;
      card.dataset.spxTilt='1';
      card.addEventListener('pointermove', e => {
        const rect = card.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - .5;
        const y = (e.clientY - rect.top) / rect.height - .5;
        card.style.setProperty('--rx', `${(-y*3).toFixed(2)}deg`);
        card.style.setProperty('--ry', `${(x*3).toFixed(2)}deg`);
      });
      card.addEventListener('pointerleave',()=>{card.style.setProperty('--rx','0deg');card.style.setProperty('--ry','0deg');});
    });
  }

  function setupLivePreview(){
    const dialog = $('#projectDialog');
    const content = $('#dialogContent');
    if(!dialog || !content) return;
    const observer = new MutationObserver(() => {
      if(!dialog.open) return;
      const app = $('a[href*="github.io/"]', content);
      if(!app || $('.snp-preview', content)) return;
      const url = app.href;
      const preview = document.createElement('div');
      preview.className='snp-preview';
      preview.innerHTML=`<div class="snp-preview-head"><span>LIVE PREVIEW</span><strong>interactive</strong></div><iframe class="snp-preview-frame" loading="lazy" referrerpolicy="no-referrer" title="Live project preview"></iframe>`;
      content.insertBefore(preview, $('.contact-actions', content));
      $('.snp-preview-frame', preview).src = url;
      $('.snp-preview-frame', preview).addEventListener('error',()=>{
        preview.innerHTML='<div class="snp-preview-note">This app does not allow embedded previews. Use <b>Open live app</b> to open it directly.</div>';
      });
    });
    observer.observe(content,{childList:true,subtree:true});
  }

  function openWorkspace(){
    let overlay = $('#snpWorkspace');
    if(!overlay){
      overlay = document.createElement('div');
      overlay.id='snpWorkspace';
      overlay.className='snp-focus-overlay';
      overlay.innerHTML=`<div class="snp-focus-panel" role="dialog" aria-modal="true" aria-label="snp workspace"><aside class="snp-focus-side"><h3>snp</h3><nav class="snp-focus-nav"><button data-target="all" class="active">All projects</button><button data-target="Tools">Tools</button><button data-target="Education">Education</button><button data-target="Websites">Websites</button><button data-target="Apps">Apps</button><button data-target="Experiments">Experiments</button><button data-target="Games">Games</button></nav></aside><section class="snp-focus-main"><div class="snp-focus-top"><span>DEVELOPER WORKSPACE · ${owner}</span><button class="snp-focus-close" id="snpWorkspaceClose">Close Esc</button></div><div class="snp-focus-projects" id="snpWorkspaceProjects"></div></section></div>`;
      document.body.appendChild(overlay);
      $('#snpWorkspaceClose').onclick=()=>overlay.classList.remove('open');
      $$('.snp-focus-nav button',overlay).forEach(btn=>btn.onclick=()=>{ $$('.snp-focus-nav button',overlay).forEach(b=>b.classList.remove('active'));btn.classList.add('active');renderWorkspace(btn.dataset.target); });
      document.addEventListener('keydown',e=>{if(e.key==='Escape')overlay.classList.remove('open')});
    }
    renderWorkspace('all');
    overlay.classList.add('open');
  }

  function renderWorkspace(category){
    const holder = $('#snpWorkspaceProjects');
    if(!holder) return;
    const list = category==='all' ? repos : repos.filter(r=>r[1]===category);
    holder.innerHTML = list.map(r=>`<article class="snp-focus-project"><h4>${escapeHtml(r[0])}</h4><p>${escapeHtml(r[1])} · GitHub project</p><div class="snp-focus-project-actions"><a class="small-btn" href="${repoUrl(r[0])}" target="_blank" rel="noreferrer">Repository ↗</a>${r[2]?`<a class="small-btn live-btn" href="${r[2]}" target="_blank" rel="noreferrer">Open app ↗</a>`:''}</div></article>`).join('');
  }

  function setupShortcut(){
    document.addEventListener('keydown',e=>{
      if(e.key==='`' && !['INPUT','TEXTAREA'].includes(document.activeElement?.tagName)){ e.preventDefault(); openWorkspace(); }
    });
  }

  function init(){
    addPulseSection();
    setupCursor();
    improveTilt();
    setupLivePreview();
    setupShortcut();
    const mo = new MutationObserver(()=>improveTilt());
    const grid = $('#projectGrid');
    if(grid) mo.observe(grid,{childList:true});
  }

  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',init); else init();
})();
