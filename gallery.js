const collection=document.querySelector('#collection'),archiveGrid=document.querySelector('#archive-grid'),morePhotos=document.querySelector('#more-photos');
for(const [i,g] of archive.groups.entries()){const o=document.createElement('option');o.value=i;o.textContent=g.title;collection.append(o)}
let selection=[],shown=0,photoIndex=0,photoTrigger;
function addPhotos(){const page=selection.slice(shown,shown+6);for(const item of page){const button=document.createElement('button');button.className='photo-tile';button.setAttribute('aria-label','Ampliar fotografia — '+item.title);const img=document.createElement('img');img.src=item.file;img.alt=item.title+' — fotografia de Fábio Rodrigues';img.loading='lazy';img.decoding='async';const caption=document.createElement('span');caption.className='photo-label';caption.textContent=item.title;button.append(img,caption);button.addEventListener('click',()=>{photoTrigger=button;photoIndex=selection.indexOf(item);showPhoto();photoDialog.showModal();document.body.classList.add('modal-open')});archiveGrid.append(button)}shown+=page.length;morePhotos.hidden=shown>=selection.length}
function choose(){const g=archive.groups[Number(collection.value)];selection=collection.value==='all'?archive.items:archive.items.filter(x=>g.ids.includes(x.id));shown=0;archiveGrid.replaceChildren();document.querySelector('#collection-title').textContent=collection.value==='all'?'Todos os instantes':g.title;document.querySelector('#collection-count').textContent=selection.length+' fotografias';document.querySelectorAll('[data-collection]').forEach(b=>{b.classList.toggle('active',b.dataset.collection===collection.value);b.setAttribute('aria-pressed',String(b.dataset.collection===collection.value))});addPhotos()}
collection.addEventListener('change',choose);morePhotos.addEventListener('click',addPhotos);
const photoDialog=document.querySelector('#photo-dialog');function showPhoto(){const p=selection[photoIndex];document.querySelector('#photo-full').src=p.file;document.querySelector('#photo-full').alt=p.title;document.querySelector('#photo-caption').textContent=p.title;document.querySelector('#photo-position').textContent=(photoIndex+1)+' / '+selection.length}
function nextPhoto(step){photoIndex=(photoIndex+step+selection.length)%selection.length;showPhoto()}
document.querySelector('#photo-prev').addEventListener('click',()=>nextPhoto(-1));document.querySelector('#photo-next').addEventListener('click',()=>nextPhoto(1));document.querySelector('#photo-close').addEventListener('click',()=>photoDialog.close());photoDialog.addEventListener('keydown',e=>{if(e.key==='ArrowRight')nextPhoto(1);if(e.key==='ArrowLeft')nextPhoto(-1)});photoDialog.addEventListener('close',()=>{document.body.classList.remove('modal-open');photoTrigger?.focus()});photoDialog.addEventListener('click',e=>{if(e.target===photoDialog){const r=photoDialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)photoDialog.close()}});
if(archive.videos.length){
 const target=document.querySelector('#archive-films');const details=document.createElement('details');details.className='archive-film-list';
 const summary=document.createElement('summary');summary.textContent='Mais filmes do arquivo ('+archive.videos.length+')';
 const grid=document.createElement('div');grid.className='archive-video-grid';
 archive.videos.forEach((v,i)=>grid.append(filmCard({...v,label:'ARQUIVO / FILME'},i)));
 details.append(summary,grid);target.append(details);
}
const quick=document.querySelector('#quick-collections'),series=document.querySelector('#series-buttons'),toggle=document.querySelector('#toggle-collections'),panel=document.querySelector('#collection-panel');
function collectionButton(label,value,parent){const b=document.createElement('button');b.type='button';b.textContent=label;b.dataset.collection=value;b.setAttribute('aria-pressed','false');b.addEventListener('click',()=>{collection.value=value;choose();if(parent===series){panel.hidden=true;toggle.setAttribute('aria-expanded','false');toggle.querySelector('span').textContent='＋'}});parent.append(b)}
collectionButton('TODOS','all',quick);archive.groups.forEach((g,i)=>{if(i<3)collectionButton(['RETRATOS','LUGARES','MODA'][i],String(i),quick);else collectionButton(g.title,String(i),series) });
for(const b of series.querySelectorAll('button')){const g=archive.groups[Number(b.dataset.collection)],photos=archive.items.filter(x=>g.ids.includes(x.id));if(!photos.length){b.remove();continue}const label=document.createElement('span');label.textContent=g.title;const count=document.createElement('small');count.textContent=photos.length+' fotografias';const img=document.createElement('img');img.src=photos[0].file;img.alt='';img.loading='lazy';b.replaceChildren(img,label,count);b.classList.add('album-card')}
toggle.addEventListener('click' ,()=>{panel.hidden=!panel.hidden;toggle.setAttribute('aria-expanded',String(!panel.hidden));toggle.querySelector('span').textContent=panel.hidden?'＋':'−'});collection.value='0';choose();

// The home page introduces three photographic worlds. Images open on demand.
const overview=document.querySelector('#photo-collections'),photoView=document.querySelector('#photography-view');
const collectionTitles=['Retratos','Lugares','Moda'];
const collectionDescriptions=['Presença, gesto e identidade.','O mundo, pelo nosso olhar.','Expressão em cada detalhe.'];
archive.groups.slice(0,3).forEach((group,index)=>{
 const photos=archive.items.filter(item=>group.ids.includes(item.id));
 const cover=photos[index===1?1:0]||photos[0];
 const button=document.createElement('button');button.type='button';button.className='collection-cover';
 button.setAttribute('aria-label','Explorar coleção — '+collectionTitles[index]);
 const image=document.createElement('img');image.src=cover.file;image.alt='';image.loading='lazy';
 const text=document.createElement('div');text.className='collection-cover-copy';
 const number=document.createElement('span');number.className='collection-number';number.textContent='0'+(index+1);
 const title=document.createElement('h3');title.textContent=collectionTitles[index];
 const description=document.createElement('p');description.textContent=collectionDescriptions[index];
 const arrow=document.createElement('span');arrow.className='collection-arrow';arrow.textContent='↗';arrow.setAttribute('aria-hidden','true');
 text.append(number,title,description,arrow);button.append(image,text);
 button.addEventListener('click',()=>{collection.value=String(index);choose();overview.hidden=true;photoView.hidden=false;document.querySelector('#back-collections').focus({preventScroll:true})});
 overview.append(button);
});
document.querySelector('#back-collections').addEventListener('click',()=>{photoView.hidden=true;overview.hidden=false;panel.hidden=true;toggle.setAttribute('aria-expanded','false');toggle.querySelector('span').textContent='＋';overview.querySelector('button').focus({preventScroll:true})});
