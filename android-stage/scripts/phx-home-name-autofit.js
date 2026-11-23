/* Fit live identity text inside the two fixed frames in the original artwork. */
(() => {
  'use strict';
  const scene = document.querySelector('#phx-r6-home .phx-queen-experimental');
  const name = scene?.querySelector('#phx-r10-name');
  const nameFrame = scene?.querySelector('#phx-r10-identity');
  const affiliation = scene?.querySelector('#phx-r11-affiliation');
  if (!name || !nameFrame || !affiliation) return;

  const textRange = document.createRange();

  function fits(text, frame) {
    const bounds = frame.getBoundingClientRect();
    textRange.selectNodeContents(text);
    return Array.from(textRange.getClientRects()).every(rect =>
      rect.width === 0 || (
        rect.left >= bounds.left + 0.5 && rect.right <= bounds.right - 0.5 &&
        rect.top >= bounds.top - 0.5 && rect.bottom <= bounds.bottom + 0.5
      )
    );
  }

  function fit() {
    if (!scene.getBoundingClientRect().width) return;

    const nameHeight = nameFrame.getBoundingClientRect().height;
    const nameMax = Math.min(44, Math.floor(nameHeight * 0.8));
    name.removeAttribute('data-wrap');
    name.style.fontSize = nameMax + 'px';
    if (!fits(name, nameFrame)) {
      // A single line may use most of the height. For a long name, reserve two lines.
      const singleLineMinimum = Math.min(8, nameMax);
      let size = nameMax;
      while (size > singleLineMinimum && !fits(name, nameFrame)) {
        size -= 0.5;
        name.style.fontSize = size + 'px';
      }
      if (!fits(name, nameFrame)) {
        name.setAttribute('data-wrap', '');
        size = Math.floor(nameHeight * 0.46 * 2) / 2;
        name.style.fontSize = size + 'px';
        while (size > 3 && !fits(name, nameFrame)) {
          size -= 0.5;
          name.style.fontSize = size + 'px';
        }
      }
    }

    let affiliationSize = Math.min(44, Math.floor(affiliation.getBoundingClientRect().height * 0.9));
    affiliation.style.fontSize = affiliationSize + 'px';
    while (affiliationSize > 3 && !fits(affiliation, affiliation)) {
      affiliationSize -= 0.5;
      affiliation.style.fontSize = affiliationSize + 'px';
    }
  }

  const observer = new ResizeObserver(fit);
  observer.observe(scene);
  document.addEventListener('phx:profile-rendered', fit);
  document.fonts?.ready.then(fit);
  fit();
})();
