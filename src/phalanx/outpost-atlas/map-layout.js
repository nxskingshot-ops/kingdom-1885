(function(){
 const map=document.querySelector('.map'),svg=document.getElementById('svg');if(!map||!svg)return;
 function fit(){if(map.classList.contains('expanded')){svg.style.removeProperty('height');return;}
 const rect=map.getBoundingClientRect(),available=(window.visualViewport?.height||window.innerHeight)+(window.visualViewport?.offsetTop||0)-rect.top-12;
 const natural=map.clientWidth*380/340;svg.style.height=Math.round(Math.min(natural,Math.max(260,available)))+'px';}
 let raf;function requestFit(){cancelAnimationFrame(raf);raf=requestAnimationFrame(fit)}
 window.addEventListener('resize',requestFit);window.visualViewport?.addEventListener('resize',requestFit);
 const obs=new MutationObserver(requestFit);for(const id of ['activeFilters','noMatches']){let el=document.getElementById(id);if(el)obs.observe(el,{childList:true,attributes:true,subtree:true});}
 obs.observe(map,{attributes:true,attributeFilter:['class']});requestFit();window.addEventListener('load',requestFit);
})();
