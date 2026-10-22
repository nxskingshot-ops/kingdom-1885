/* PHX A039-R8 War Room route bridge. Load after the original R8 scripts. */
(()=>{'use strict';const war=document.getElementById('phx-r8-war');if(!war)return;
war.addEventListener('click',event=>{const button=event.target.closest('button');if(!button||button.textContent.trim()!=='Öffnen →')return;
const target=button.closest('.wr-card')?.querySelector('select')?.value;if(!['territory','map','report'].includes(target))return;
event.preventDefault();event.stopImmediatePropagation();
if(typeof window.phxNavigate!=='function')return;
document.body.classList.remove('phx-r8-war-open');war.setAttribute('aria-hidden','true');
window.phxNavigate(target==='territory'?'home':target);
},true);
})();
