const repositories = [
  {name:'godh123', category:'Apps', desc:'A personal web project from the GitHub workspace.', tech:['Web','GitHub']},
  {name:'Minecraft', category:'Games', desc:'A Minecraft-related project and experiment.', tech:['Game','Web']},
  {name:'codethd', category:'Tools', desc:'A browser-based coding and developer experience.', tech:['HTML','CSS','JavaScript'], live:'https://yasinaa2026-hash.github.io/codethd/'},
  {name:'-12', category:'Experiments', desc:'A compact experimental repository and playground.', tech:['Web','Experiment']},
  {name:'-pronunciation', category:'Education', desc:'An English pronunciation learning project.', tech:['English','Learning']},
  {name:'Flashcards', category:'Education', desc:'A flashcard-based learning project.', tech:['Education','Web']},
  {name:'html', category:'Websites', desc:'HTML practice, prototypes and web experiments.', tech:['HTML','CSS']},
  {name:'Learning-English', category:'Education', desc:'A browser-based English learning project.', tech:['English','Web'], live:'https://yasinaa2026-hash.github.io/Learning-English/'},
  {name:'calculator', category:'Tools', desc:'A simple interactive calculator project.', tech:['JavaScript','UI']},
  {name:'opencode', category:'Tools', desc:'A large open-source coding project mirrored in the account.', tech:['Code','Open Source']},
  {name:'Quran-Reels-Generator', category:'Apps', desc:'A project for creating Quran-focused short video content.', tech:['Quran','Media']},
  {name:'codeyau', category:'Websites', desc:'A developer-focused web experience.', tech:['HTML','CSS','JavaScript'], live:'https://yasinaa2026-hash.github.io/codeyau/'},
  {name:'-Learning-programming', category:'Education', desc:'A programming learning project.', tech:['Programming','Education']}
];

const $ = (s) => document.querySelector(s);
const grid = $('#projectGrid');
const filters = $('#filters');
const search = $('#search');
const categories = ['All', ...new Set(repositories.map(r => r.category))];
let active = 'All';

$('#projectCount').textContent = repositories.length;

function esc(value){return String(value).replace(/[&<>\"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;',"'":'&#039;'}[c]));}

categories.forEach(category => {
  const b = document.createElement('button');
  b.className = 'filter' + (category === active ? ' active' : '');
  b.textContent = category;
  b.onclick = () => { active = category; document.querySelectorAll('.filter').forEach(x=>x.classList.remove('active')); b.classList.add('active'); render(); };
  filters.appendChild(b);
});

function render(){
  const query = search.value.trim().toLowerCase();
  const list = repositories.filter(r => (active === 'All' || r.category === active) && (!query || `${r.name} ${r.desc} ${r.tech.join(' ')}`.toLowerCase().includes(query)));
  grid.innerHTML = list.map((r,i) => `
    <article class="project-card">
      <div class="project-top"><span class="repo-index">${String(i+1).padStart(2,'0')}</span><span class="project-icon">${esc(r.name.charAt(0).toUpperCase())}</span></div>
      <h3>${esc(r.name)}</h3>
      <p>${esc(r.desc)}</p>
      <div class="tags">${r.tech.map(t=>`<span class="tag">${esc(t)}</span>`).join('')}</div>
      <div class="project-actions">
        <button class="link-btn details" data-name="${esc(r.name)}">Details</button>
        <a class="small-btn" href="https://github.com/yasinaa2026-hash/${encodeURIComponent(r.name)}" target="_blank" rel="noreferrer" aria-label="Open ${esc(r.name)} repository on GitHub">Repository ↗</a>
        ${r.live ? `<a class="small-btn live-btn" href="${r.live}" target="_blank" rel="noreferrer" aria-label="Open ${esc(r.name)} live application">Open app ↗</a>` : `<span class="demo-unavailable" title="No live demo URL configured yet">App not live</span>`}
      </div>
    </article>`).join('');
  document.querySelectorAll('.details').forEach(btn => btn.onclick = () => openDetails(btn.dataset.name));
}
search.addEventListener('input', render);
render();

const dialog = $('#projectDialog');
const dialogContent = $('#dialogContent');
function openDetails(name){
  const r = repositories.find(x=>x.name === name); if(!r) return;
  dialogContent.innerHTML = `<div class="kicker">PROJECT</div><div class="dialog-title">${esc(r.name)}</div><p class="dialog-copy">${esc(r.desc)}</p><p class="dialog-copy"><strong>Category:</strong> ${esc(r.category)}<br><strong>Technologies:</strong> ${esc(r.tech.join(' · '))}</p><div class="contact-actions"><a class="btn primary" href="https://github.com/yasinaa2026-hash/${encodeURIComponent(r.name)}" target="_blank" rel="noreferrer">Open repository ↗</a>${r.live?`<a class="btn ghost" href="${r.live}" target="_blank" rel="noreferrer">Open live app ↗</a>`:`<span class="btn ghost disabled-btn" aria-disabled="true">Live app not configured</span>`}</div>`;
  dialog.showModal();
}
$('#dialogClose').onclick = () => dialog.close();
dialog.addEventListener('click', e => { if(e.target === dialog) dialog.close(); });

const body = document.body;
const savedTheme = localStorage.getItem('snp-theme');
if(savedTheme === 'light') body.classList.add('light');
$('#themeBtn').onclick = () => { body.classList.toggle('light'); localStorage.setItem('snp-theme',body.classList.contains('light')?'light':'dark'); $('#themeBtn').textContent = body.classList.contains('light')?'☀':'☾'; };
$('#themeBtn').textContent = body.classList.contains('light')?'☀':'☾';

const menuBtn = $('#menuBtn'), navLinks = $('#navLinks');
menuBtn.onclick = () => { const open = navLinks.classList.toggle('open'); menuBtn.setAttribute('aria-expanded', open); };
navLinks.querySelectorAll('a').forEach(a=>a.onclick=()=>navLinks.classList.remove('open'));

function tick(){ $('#liveClock').textContent = new Intl.DateTimeFormat('en-GB',{hour:'2-digit',minute:'2-digit',second:'2-digit'}).format(new Date()); }
tick(); setInterval(tick,1000);

const paletteBtn = $('#paletteBtn');
paletteBtn.onclick = () => {
  const hue = Math.floor(Math.random()*360);
  const color = `hsl(${hue} 82% 62%)`;
  paletteBtn.textContent = color;
  navigator.clipboard?.writeText(color).catch(()=>{});
};

const typingBtn = $('#typingBtn');
typingBtn.onclick = () => { typingBtn.textContent='Ready ↓'; typingBtn.onclick=()=>{ alert('Typing playground: build speed, accuracy and keyboard skills.'); }; };

const observer = new IntersectionObserver(entries => entries.forEach(e=>{ if(e.isIntersecting){e.target.style.opacity='1';e.target.style.transform='translateY(0)';observer.unobserve(e.target);}}),{threshold:.08});
new MutationObserver(()=>document.querySelectorAll('.project-card').forEach(card=>{ if(!card.dataset.revealed){card.dataset.revealed='1';card.style.opacity='0';card.style.transform='translateY(12px)';card.style.transition='opacity .45s ease, transform .45s ease';observer.observe(card);}})).observe(grid,{childList:true});
