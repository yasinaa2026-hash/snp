const OWNER = 'yasinaa2026-hash';
const repositories = [
  {name:'godh123',category:'Apps',desc:'A personal web project from the GitHub workspace.',tech:['Web','GitHub']},
  {name:'Minecraft',category:'Games',desc:'A Minecraft-related project and experiment.',tech:['Game','Web']},
  {name:'codethd',category:'Tools',desc:'A browser-based coding and developer experience.',tech:['HTML','CSS','JavaScript'],live:'https://yasinaa2026-hash.github.io/codethd/',featured:'Building focus'},
  {name:'-12',category:'Experiments',desc:'A compact experimental repository and playground.',tech:['Web','Experiment']},
  {name:'-pronunciation',category:'Education',desc:'An English pronunciation learning project.',tech:['English','Learning']},
  {name:'Flashcards',category:'Education',desc:'A flashcard-based learning project.',tech:['Education','Web']},
  {name:'html',category:'Websites',desc:'HTML practice, prototypes and web experiments.',tech:['HTML','CSS']},
  {name:'Learning-English',category:'Education',desc:'A browser-based English learning project.',tech:['English','Web'],live:'https://yasinaa2026-hash.github.io/Learning-English/'},
  {name:'calculator',category:'Tools',desc:'A simple interactive calculator project.',tech:['JavaScript','UI']},
  {name:'opencode',category:'Tools',desc:'A large open-source coding project in the account.',tech:['Code','Open Source']},
  {name:'Quran-Reels-Generator',category:'Apps',desc:'A project for creating Quran-focused short video content.',tech:['Quran','Media']},
  {name:'codeyau',category:'Websites',desc:'A developer-focused web experience.',tech:['HTML','CSS','JavaScript'],live:'https://yasinaa2026-hash.github.io/codeyau/'},
  {name:'-Learning-programming',category:'Education',desc:'A programming learning project.',tech:['Programming','Education']}
];
const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
const grid=$('#projectGrid'),filters=$('#filters'),search=$('#search'),empty=$('#emptyState');
let active='All';
$('#projectCount').textContent=repositories.length;
$('#liveCount').textContent=repositories.filter(r=>r.live).length;
const categories=['All',...new Set(repositories.map(r=>r.category))];
const esc=v=>String(v).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]));

categories.forEach(category=>{const b=document.createElement('button');b.className='filter'+(category===active?' active':'');b.textContent=category;b.onclick=()=>{active=category;$$('.filter').forEach(x=>x.classList.remove('active'));b.classList.add('active');render();};filters.appendChild(b);});

function repoUrl(name){return `https://github.com/${OWNER}/${encodeURIComponent(name)}`}
function render(){
  const q=search.value.trim().toLowerCase();
  const list=repositories.filter(r=>(active==='All'||r.category===active)&&(!q||`${r.name} ${r.desc} ${r.tech.join(' ')}`.toLowerCase().includes(q)));
  grid.innerHTML=list.map((r,i)=>`<article class="project-card">
    <div class="project-top"><span class="repo-index">${String(i+1).padStart(2,'0')}</span><span class="project-icon">${esc(r.name.charAt(0).toUpperCase())}</span></div>
    <h3>${esc(r.name)}</h3><p>${esc(r.desc)}</p>
    <div class="tags">${r.tech.map(t=>`<span class="tag">${esc(t)}</span>`).join('')}</div>
    <div class="project-actions">
      <button class="link-btn details" data-name="${esc(r.name)}">Details</button>
      <a class="small-btn" href="${repoUrl(r.name)}" target="_blank" rel="noreferrer">Repository ↗</a>
      ${r.live?`<a class="small-btn live-btn" href="${r.live}" target="_blank" rel="noreferrer">Open app ↗</a>`:`<span class="demo-unavailable">App not live</span>`}
    </div></article>`).join('');
  empty.hidden=list.length!==0;
  $$('.details').forEach(btn=>btn.onclick=()=>openDetails(btn.dataset.name));
  revealCards();
}
search.addEventListener('input',render);

function renderSpotlight(){
  const picks=[repositories.find(r=>r.name==='codethd'),repositories.find(r=>r.name==='codeyau'),repositories.find(r=>r.name==='Learning-English')].filter(Boolean);
  $('#spotlightGrid').innerHTML=picks.map((r,i)=>`<article class="spotlight"><span class="label">${i===0?'Main build':i===1?'Web project':'Learning project'}</span><h3>${esc(r.name)}</h3><p>${esc(r.desc)}</p><div class="spotlight-actions"><a class="small-btn" href="${repoUrl(r.name)}" target="_blank" rel="noreferrer">Repository ↗</a>${r.live?`<a class="small-btn live-btn" href="${r.live}" target="_blank" rel="noreferrer">Try app ↗</a>`:''}</div></article>`).join('');
}
renderSpotlight();render();

const dialog=$('#projectDialog'),dialogContent=$('#dialogContent');
function openDetails(name){const r=repositories.find(x=>x.name===name);if(!r)return;dialogContent.innerHTML=`<div class="kicker">PROJECT</div><div class="dialog-title">${esc(r.name)}</div><p class="dialog-copy">${esc(r.desc)}</p><p class="dialog-copy"><strong>Category:</strong> ${esc(r.category)}<br><strong>Technologies:</strong> ${esc(r.tech.join(' · '))}</p><div class="contact-actions"><a class="btn primary" href="${repoUrl(r.name)}" target="_blank" rel="noreferrer">Open repository ↗</a>${r.live?`<a class="btn ghost" href="${r.live}" target="_blank" rel="noreferrer">Open live app ↗</a>`:`<span class="btn ghost disabled-btn" aria-disabled="true">Live app not configured</span>`}</div>`;dialog.showModal();}
$('#dialogClose').onclick=()=>dialog.close();dialog.addEventListener('click',e=>{if(e.target===dialog)dialog.close()});

const body=document.body,saved=localStorage.getItem('snp-theme');if(saved==='light')body.classList.add('light');
function syncTheme(){localStorage.setItem('snp-theme',body.classList.contains('light')?'light':'dark');$('#themeBtn').textContent=body.classList.contains('light')?'☀':'☾'}
$('#themeBtn').onclick=()=>{body.classList.toggle('light');syncTheme()};syncTheme();
const menuBtn=$('#menuBtn'),navLinks=$('#navLinks');menuBtn.onclick=()=>{const open=navLinks.classList.toggle('open');menuBtn.setAttribute('aria-expanded',open)};navLinks.querySelectorAll('a').forEach(a=>a.onclick=()=>navLinks.classList.remove('open'));

function tick(){$('#liveClock').textContent=new Intl.DateTimeFormat('en-GB',{hour:'2-digit',minute:'2-digit',second:'2-digit'}).format(new Date())}tick();setInterval(tick,1000);
$('#paletteBtn').onclick=()=>{const hue=Math.floor(Math.random()*360),color=`hsl(${hue} 82% 62%)`;$('#paletteBtn').textContent=color;navigator.clipboard?.writeText(color).then(()=>toast(`${color} copied`)).catch(()=>toast(color));};
let reactionTimer=null,reactionReady=false;$('#reactionBtn').onclick=()=>{const b=$('#reactionBtn');if(reactionTimer){clearTimeout(reactionTimer);reactionTimer=null;reactionReady=false;b.textContent='Too soon';return}b.textContent='Wait...';reactionTimer=setTimeout(()=>{reactionReady=true;reactionTimer=null;b.textContent='CLICK!';const t=performance.now();b.onclick=()=>{if(!reactionReady)return;b.textContent=Math.round(performance.now()-t)+' ms';reactionReady=false;setTimeout(()=>b.textContent='Again',900)}},800+Math.random()*1600)};

const scrollProgress=$('#scrollProgress');window.addEventListener('scroll',()=>{const max=document.documentElement.scrollHeight-innerHeight;scrollProgress.style.width=(max>0?(scrollY/max)*100:0)+'%'},{passive:true});
$('#randomProjectBtn').onclick=()=>{const r=repositories[Math.floor(Math.random()*repositories.length)];openDetails(r.name)};
$('#clearSearch').onclick=()=>{search.value='';active='All';$$('.filter').forEach((x,i)=>x.classList.toggle('active',i===0));render();search.focus()};

$$('.tech-row button').forEach(b=>b.onclick=()=>{search.value=b.dataset.skill;active='All';$$('.filter').forEach((x,i)=>x.classList.toggle('active',i===0));render();document.querySelector('#work').scrollIntoView({behavior:'smooth'});});
$('#openPaletteFromLab').onclick=()=>openCommandPalette();

const observer=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.style.opacity='1';e.target.style.transform='translateY(0)';observer.unobserve(e.target)}}),{threshold:.08});
function revealCards(){$$('.project-card').forEach(card=>{if(card.dataset.revealed)return;card.dataset.revealed='1';card.style.opacity='0';card.style.transform='translateY(13px)';card.style.transition='opacity .45s ease,transform .45s ease';observer.observe(card)})}

const commandDialog=$('#commandDialog'),commandSearch=$('#commandSearch'),commandList=$('#commandList');
const commands=[
  ['Home','Go to the top','#home'],['Projects','Browse every GitHub project','#work'],['Lab','Open developer experiments','#lab'],['About','Learn about snp','#about'],['Contact','Go to contact','#contact'],['GitHub','Open Yasin on GitHub','https://github.com/yasinaa2026-hash'],['CodeTHD','Try CodeTHD live','https://yasinaa2026-hash.github.io/codethd/'],['CodeYau','Try CodeYau live','https://yasinaa2026-hash.github.io/codeyau/']
];
function renderCommands(){const q=commandSearch.value.trim().toLowerCase();const list=commands.filter(c=>c[0].toLowerCase().includes(q)||c[1].toLowerCase().includes(q));commandList.innerHTML=list.map((c,i)=>`<button class="command-item" data-i="${i}" data-dest="${c[2]}"><span><b>${esc(c[0])}</b><br><small>${esc(c[1])}</small></span><small>↵</small></button>`).join('');$$('.command-item').forEach(btn=>btn.onclick=()=>runCommand(btn.dataset.dest));}
function openCommandPalette(){commandSearch.value='';renderCommands();commandDialog.showModal();setTimeout(()=>commandSearch.focus(),30)}
function runCommand(dest){commandDialog.close();if(dest.startsWith('#'))document.querySelector(dest)?.scrollIntoView({behavior:'smooth'});else window.open(dest,'_blank','noopener,noreferrer')}
$('#commandTrigger').onclick=openCommandPalette;commandSearch.addEventListener('input',renderCommands);document.addEventListener('keydown',e=>{if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==='k'){e.preventDefault();openCommandPalette()}if(e.key==='/'&&document.activeElement!==search&&document.activeElement!==commandSearch){e.preventDefault();search.focus()}if(e.key==='Escape'&&commandDialog.open)commandDialog.close()});

function toast(message){const el=$('#toast');el.textContent=message;el.classList.add('show');clearTimeout(toast.t);toast.t=setTimeout(()=>el.classList.remove('show'),1600)}
window.addEventListener('keydown',e=>{if(e.key==='Escape'&&dialog.open)dialog.close()});
