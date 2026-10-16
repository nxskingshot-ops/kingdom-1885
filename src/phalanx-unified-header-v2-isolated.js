/* PHALANX UNIFIED HEADER V2 — isolated component; no production mounting.
 * Approved artwork is NOT regenerated. Supply approved extracted artwork URLs.
 * HOME gold, MODULE red, DETAIL blue. Caller owns route and menu actions.
 */
export function mountPhalanxHeaderV2(host, options = {}) {
  if (!(host instanceof HTMLElement)) throw new TypeError('Host element required');
  const { mode='home', title='', artwork={}, onBack, onMenu, onNavigate, activeDestination='home' } = options;
  const homeItems = [
    ['home','⌂','HOME'],['war','⚔','KRIEG'],['alliance','♟','ALLIANZ'],
    ['tools','⚙','WERKZEUGE'],['guides','▤','GUIDES'],
    ['statistics','▥','STATISTIKEN'],['info','ⓘ','INFO']
  ];
  if (!['home','module','detail'].includes(mode)) throw new TypeError('Invalid header mode');
  if (mode !== 'home' && (typeof onBack !== 'function' || typeof onMenu !== 'function')) {
    throw new TypeError('Non-home header requires working onBack and onMenu callbacks');
  }
  if (mode === 'home' && typeof onNavigate !== 'function') {
    throw new TypeError('HOME header requires a working onNavigate callback');
  }
  if (mode === 'home' && !homeItems.some(([id]) => id === activeDestination)) {
    throw new TypeError('Unknown HOME navigation destination: '+activeDestination);
  }
  const url = artwork[mode];
  if (typeof url !== 'string' || !url.trim()) throw new Error('Approved artwork URL required for '+mode);
  const root = document.createElement('header');
  root.className = 'phalanx-header-v2 phalanx-header-v2--'+mode;
  root.setAttribute('data-freeze','UNIFIED_HEADER_V2_FINAL_2026-10-16');
  const art = document.createElement('img');
  art.className='phalanx-header-v2__art'; art.src=url; art.alt='PHALANX helmet with lion banners';
  root.append(art);
  if (mode==='home') {
    const nav=document.createElement('nav');nav.className='phalanx-header-v2__home-nav';nav.setAttribute('aria-label','Hauptnavigation');
    for (const [id,symbol,label] of homeItems) {
      const button=document.createElement('button');button.type='button';button.className='phalanx-header-v2__home-action';
      button.setAttribute('aria-label',label);button.dataset.destination=id;
      if(id===activeDestination)button.setAttribute('aria-current','page');
      const glyph=document.createElement('span');glyph.className='phalanx-header-v2__home-glyph';glyph.setAttribute('aria-hidden','true');glyph.textContent=symbol;
      const caption=document.createElement('span');caption.className='phalanx-header-v2__home-label';caption.textContent=label;
      button.append(glyph,caption);button.addEventListener('click',()=>onNavigate(id));nav.append(button);
    }
    root.append(nav);
  }
  if (mode!=='home') {
    const bar=document.createElement('nav');bar.className='phalanx-header-v2__nav';bar.setAttribute('aria-label','Modulnavigation');
    const back=document.createElement('button');back.type='button';back.textContent='‹';back.setAttribute('aria-label','Zurück');back.addEventListener('click',onBack);
    const heading=document.createElement('h1');heading.textContent=title;
    const menu=document.createElement('button');menu.type='button';menu.textContent='☰';menu.setAttribute('aria-label','Menü öffnen');menu.addEventListener('click',onMenu);
    bar.append(back,heading,menu);root.append(bar);
  }
  host.replaceChildren(root);
  return () => {if(root.parentNode===host)host.removeChild(root)};
}
