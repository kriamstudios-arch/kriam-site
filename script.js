const projects = [
  {
    "id": "hiban-intro",
    "title": "Hiban — Intro",
    "category": "musica",
    "label": "MÚSICA / VIDEOCLIPE"
  },
  {
    "id": "xflamex-ferrari",
    "title": "XflameX — Ferrari",
    "category": "musica",
    "label": "MÚSICA / VISUALIZER"
  },
  {
    "id": "xflamex-gucci",
    "title": "XflameX — Gucci",
    "category": "musica",
    "label": "MÚSICA / VIDEOCLIPE"
  },
  {
    "id": "film-2",
    "title": "Entre Lugares",
    "category": "cultura",
    "label": "CULTURA / FILME"
  },
  {
    "id": "film-1",
    "title": "Esproarte — Onde nasce a música",
    "category": "cultura",
    "label": "FILME INSTITUCIONAL",
    "file": "assets/pats/pats-0.mp4"
  },
  {
    "id": "film-4",
    "title": "Rosa das Malhas — Fios de uma história",
    "category": "marca",
    "label": "PESSOAS / MARCA"
  },
  {
    "id": "film-0",
    "title": "5370 — Identidade em cada gesto",
    "category": "marca",
    "label": "MARCA / FILME"
  },
  {
    "id": "pats-1",
    "title": "Café — Filme promocional",
    "category": "marca",
    "label": "MARCA / FILME",
    "file": "assets/pats/pats-1.mp4",
    "poster": "assets/pats/pats-1.jpg"
  },
  {
    "id": "pats-2",
    "title": "Maria",
    "category": "cultura",
    "label": "CURTA-METRAGEM",
    "file": "assets/pats/pats-2.mp4",
    "poster": "assets/pats/pats-2.jpg"
  }
];
const grid=document.querySelector('#projects');
const dialog=document.querySelector('#film-dialog'),player=document.querySelector('#player');
let lastFilmButton;
function openFilm(film,trigger){
  lastFilmButton=trigger;
  player.src=film.file;player.poster=film.poster;
  document.querySelector('#film-title').textContent=film.title;
  document.querySelector('#film-description').textContent=film.label||'';
  dialog.showModal();document.body.classList.add('modal-open');player.play().catch(()=>{});
}
function filmCard(film,index){
  const article=document.createElement('article');article.className='project';article.dataset.category=film.category||'arquivo';
  const button=document.createElement('button');button.type='button';button.setAttribute('aria-label','Ver filme '+film.title);
  const frame=document.createElement('div');frame.className='project-image';
  const img=document.createElement('img');img.src=film.poster;img.alt='Fotograma de '+film.title;img.loading='lazy';img.width=960;img.height=540;
  const play=document.createElement('span');play.className='play';play.textContent='▶';play.setAttribute('aria-hidden','true');
  frame.append(img,play);
  const caption=document.createElement('div');caption.className='project-caption';
  const title=document.createElement('h3');title.textContent=film.title;
  const label=document.createElement('p');label.textContent=film.label||'ARQUIVO / FILME';
  caption.append(label,title);button.append(frame,caption);button.addEventListener('click',()=>openFilm(film,button));article.append(button);return article;
}
const featuredIds=['film-2','xflamex-gucci','film-4'];
function renderProjects(filter){
  const shown=filter==='selected'?featuredIds.map(id=>projects.find(p=>p.id===id)):projects.filter(p=>filter==='all'||p.category===filter);
  grid.classList.toggle('curated',filter==='selected');grid.replaceChildren();
  shown.forEach((p,i)=>grid.append(filmCard({...p,file:p.file||`assets/${p.id}.mp4`,poster:p.poster||`assets/${p.id}.jpg`},i)));
}
renderProjects('selected');
document.querySelectorAll('[data-filter]').forEach(button=>button.addEventListener('click',()=>{
 document.querySelectorAll('[data-filter]').forEach(b=>{b.classList.toggle('active',b===button);b.setAttribute('aria-pressed',String(b===button))});
 renderProjects(button.dataset.filter);
}));
document.querySelector('#close-film').addEventListener('click',()=>dialog.close());
dialog.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close()}});
dialog.addEventListener('close',()=>{player.pause();player.removeAttribute('src');player.load();document.body.classList.remove('modal-open');lastFilmButton?.focus()});
const menu=document.querySelector('.menu'),nav=document.querySelector('nav');menu.addEventListener('click',()=>{const open=menu.getAttribute('aria-expanded')!=='true';menu.setAttribute('aria-expanded',String(open));nav.classList.toggle('open',open);menu.querySelector('span').textContent=open?'−':'＋'});nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{menu.setAttribute('aria-expanded','false');nav.classList.remove('open');menu.querySelector('span').textContent='＋'}));document.addEventListener('keydown',e=>{if(e.key==='Escape'){menu.setAttribute('aria-expanded','false');nav.classList.remove('open')}});
document.querySelectorAll('[data-service]').forEach(a=>a.addEventListener('click',()=>document.querySelector('#service').value=a.dataset.service));document.querySelector('#briefing').addEventListener('submit',e=>{
 e.preventDefault();const data=new FormData(e.currentTarget),en=document.documentElement.lang==='en';
 const service=data.get('service')==='exploring'?(en?'Still exploring':'Ainda estou a descobrir'):(data.get('service')||(en?'To be decided':'A definir'));
 const body=en?`Hello KRIAM,\n\nMy name is ${data.get('name')}.\nEmail: ${data.get('email')}\nService: ${service}\n\n${data.get('idea')}`:`Olá KRIAM,\n\nSou ${data.get('name')}.\nEmail: ${data.get('email')}\nTerritório: ${service}\n\n${data.get('idea')}`;
 location.href=`mailto:kriam.studios@gmail.com?subject=${encodeURIComponent((en?'New project — ':'Novo projeto — ')+data.get('name'))}&body=${encodeURIComponent(body)}`;
 document.querySelector('#form-status').textContent='Briefing preparado. Envie a mensagem na sua aplicação de email. Se não abrir, escreva diretamente para kriam.studios@gmail.com.';
});document.querySelector('#year').textContent=new Date().getFullYear();

const hero=document.querySelector('.hero-video'),motion=document.querySelector('#motion'),reduced=matchMedia('(prefers-reduced-motion: reduce)');
function updateMotion(){motion.textContent=hero.paused?'Reproduzir movimento ▶':'Pausar movimento Ⅱ';motion.setAttribute('aria-label',hero.paused?'Reproduzir vídeo de abertura':'Pausar vídeo de abertura')}
if(reduced.matches){hero.autoplay=false;hero.pause()}
hero.addEventListener('play',updateMotion);hero.addEventListener('pause',updateMotion);
motion.addEventListener('click',()=>{if(hero.paused)hero.play().catch(()=>{});else hero.pause();updateMotion()});
reduced.addEventListener('change',()=>{if(reduced.matches)hero.pause()});
updateMotion();
