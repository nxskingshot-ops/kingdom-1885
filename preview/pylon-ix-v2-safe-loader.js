/* PYLON IX V2 safe loader — activate only after the exact staged asset resolves. */
(function(){
  'use strict';
  const imageUrl=new URL('./assets/PYLON_IX_V2_FINAL_ORIGINAL.jpg',document.baseURI);
  const probe=new Image();
  probe.onload=function(){
    if(probe.naturalWidth!==1536||probe.naturalHeight!==1536)return;
    const link=document.createElement('link');
    link.rel='stylesheet';link.href='./pylon-ix-v2-staging.css';
    document.head.appendChild(link);
  };
  probe.onerror=function(){ /* fail closed: no icon, no changes to existing UI */ };
  probe.src=imageUrl.href;
})();
