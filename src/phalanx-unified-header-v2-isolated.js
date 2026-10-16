/* PHALANX UNIFIED HEADER V2 — isolated component; no production mounting.
 * Approved artwork is NOT regenerated. Supply approved extracted artwork URLs.
 * HOME gold, MODULE red, DETAIL blue. Caller owns route and menu actions.
 */
export function mountPhalanxHeaderV2(host, options = {}) {
  if (!(host instanceof HTMLElement)) throw new TypeError('Host element required');
  const { mode='home', title='', artwork={}, onBack=()=>{}, onMenu=()=>{} } = options;
  if (!['home','module','detail'].includes(mode)) throw new TypeError('Invalid header mode');
  const url = artwork[mode];
  if (!url) throw new Error('Approved artwork URL required for '+mode);
  const root = document.createElement('header');
  root.className = 'phalanx-header-v2 phalanx-header-v2--'+mode;
  root.setAttribute('data-freeze','UNIFIED_HEADER_V2_FINAL_2026-10-16');
  const art = document.createElement('img');
  art.className='phalanx-header-v2__art'; art.src=url; art.alt='PHALANX helmet with lion banners';
  root.append(art);
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
