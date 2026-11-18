/* HOME name: measure actual rendered glyph widths, not character counts. */
(() => {
  'use strict';
  const name = document.getElementById('phx-r10-name');
  if (!name) return;
  const parent = document.getElementById('phx-r10-identity');
  if (!parent) return;
  let fitting = false;
  function fit() {
    if (fitting) return;
    fitting = true;
    try {
      const value = (name.textContent || '').trim();
      if (!value || !parent.clientWidth) return;
      // The unified plaque grows with wrapped names; the legacy fixed-height
      // artwork fitter would otherwise shrink its name to 8px after relocation.
      if (parent.closest('.phx-home-unified-plaque')) {
        for (const property of ['white-space', 'overflow-wrap', 'font-size', 'line-height']) name.style.removeProperty(property);
        return;
      }
      const maxWidth = Math.max(0, parent.clientWidth - 4);
      const maxHeight = Math.max(0, parent.clientHeight - 2);
      name.style.whiteSpace = 'nowrap';
      name.style.overflowWrap = 'normal';
      name.style.fontSize = '22px';
      name.style.lineHeight = '1.05';
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      const computed = getComputedStyle(name);
      const family = computed.fontFamily;
      const weight = computed.fontWeight;
      let size = 22;
      function widthAt(px) {
        ctx.font = weight + ' ' + px + 'px ' + family;
        return ctx.measureText(value).width;
      }
      while (size > 8 && widthAt(size) > maxWidth) size -= 0.5;
      if (widthAt(size) <= maxWidth && size * 1.05 <= maxHeight) {
        name.style.fontSize = size + 'px';
      } else {
        // Two lines for long names; never replace player identity with ellipses.
        name.style.whiteSpace = 'normal';
        name.style.overflowWrap = 'anywhere';
        name.style.fontSize = Math.max(8, Math.min(13, maxHeight / 2.2)) + 'px';
        name.style.lineHeight = '1.05';
      }
    } finally { fitting = false; }
  }
  const observer = new MutationObserver(fit);
  observer.observe(name, {childList: true, characterData: true, subtree: true});
  const resize = new ResizeObserver(fit);
  resize.observe(parent);
  document.fonts?.ready.then(fit);
  fit();
})();
