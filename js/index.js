// Smooth anchor scrolling
document.querySelectorAll('a[href^="#"]').forEach(a=>{
    a.addEventListener('click',e=>{
    const id=a.getAttribute('href');
    if(id.length>1){
        const el=document.querySelector(id);
        if(el){ e.preventDefault(); el.scrollIntoView({behavior:'smooth', block:'start'}); }
    }
    });
});

// Mobile menu toggle
const menuBtn=document.getElementById('menuBtn');
menuBtn?.addEventListener('click',()=>{
    const nav=document.querySelector('nav.menu');
    if(!nav) return;
    if(nav.style.display==='flex'){ nav.style.display='none'; }
    else{ nav.style.display='flex'; nav.style.flexDirection='column'; nav.style.position='absolute'; nav.style.top='68px'; nav.style.left='0'; nav.style.right='0'; nav.style.gap='14px'; nav.style.background='linear-gradient(180deg, rgba(11,27,48,.98), rgba(11,27,48,.92))'; nav.style.padding='16px 24px'; }
});

// THEME SWITCHER
const root=document.documentElement;
const themes=['midnight','aurora','sakura','jade'];
const saved=localStorage.getItem('alvavinci-theme');
if(saved && themes.includes(saved)) root.setAttribute('data-theme', saved);

// Footer year
document.getElementById('year').textContent=new Date().getFullYear();

// Back-to-top button
const toTop=document.getElementById('toTop');
const toggleTop=()=>{ if(window.scrollY>500){ toTop.classList.add('show'); } else { toTop.classList.remove('show'); } };
window.addEventListener('scroll', toggleTop);
toggleTop(); // initialize on load
toTop.addEventListener('click', ()=>window.scrollTo({top:0, behavior:'smooth'}));

// --- Smoke tests (do not affect UI) ---
(function(){
    console.assert(document.querySelector('nav.menu'), 'nav.menu missing');
    console.assert(document.querySelector('#contact .panel'), 'contact panel missing');
    console.assert(document.getElementById('toTop'), 'toTop button missing');
})();