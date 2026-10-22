/* PHX A039-R8: use existing HOME Territory hotspot, not #home. Load after R8. */
(()=>{'use strict';const war=document.getElementById('phx-r8-war');if(!war)return;
war.addEventListener('click',event=>{const button=event.target.closest('button');if(!button||button.textContent.trim()!=='Öffnen →')return;
const card=button.closest('.wr-card');const target=card?.querySelector('select')?.value;if(target!=='territory')return;
const hotspot=document.querySelector('#phx-r6-home [data-target="territory"]');if(!hotspot)return;
event.preventDefault();event.stopImmediatePropagation();
document.body.classList.remove('phx-r8-war-open');war.setAttribute('aria-hidden','true');
if(location.hash==='#war-room')history.replaceState(history.state,'',location.pathname+location.search+'#phalanx-home');
hotspot.click();
},true);
})();
