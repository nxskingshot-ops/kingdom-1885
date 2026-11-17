/* PHALANX isolated Android layout probe. No network, no storage, no data mutations. */
(() => {
  'use strict';
  const ids = ['phx-r6-home', 'phx-r8-war'];
  const rect = element => {
    if (!element) return null;
    const r = element.getBoundingClientRect();
    const s = getComputedStyle(element);
    return { top: Math.round(r.top), bottom: Math.round(r.bottom),
      height: Math.round(r.height), display: s.display,
      paddingTop: s.paddingTop, marginTop: s.marginTop,
      background: s.backgroundColor, position: s.position };
  };
  const snapshot = () => {
    const home = document.getElementById(ids[0]);
    const war = document.getElementById(ids[1]);
    const scene = home?.querySelector('.phx-queen-experimental');
    const img = home?.querySelector('.phx-queen-scene');
    const data = {
      hash: location.hash, viewport: { innerHeight, innerWidth,
        visualTop: visualViewport?.offsetTop ?? null,
        visualHeight: visualViewport?.height ?? null },
      html: rect(document.documentElement), body: rect(document.body),
      home: rect(home), scene: rect(scene), image: rect(img), war: rect(war),
      statusBarAvailable: Boolean(window.Capacitor?.isPluginAvailable('StatusBar'))
    };
    console.info('[PHX-ANDROID-LAYOUT]', JSON.stringify(data));
    return data;
  };
  // Read-only diagnostic, callable from Android WebView inspector.
  Object.defineProperty(window, '__phxLayoutSnapshot', { value: snapshot, configurable: false });
  addEventListener('hashchange', () => requestAnimationFrame(snapshot));
  addEventListener('load', () => requestAnimationFrame(snapshot), { once: true });
})();
