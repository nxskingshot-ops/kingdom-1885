const { createHash } = require('node:crypto');
const { copyFileSync, mkdirSync, readFileSync, writeFileSync } = require('node:fs');
const { join, resolve } = require('node:path');

const R12_SHA256 = 'ace5c9dd54e685e378b350b9d462ec756ce05abd231fae3b66ed35df6eaa0c42';
const HEADER_SHA256 = '9b8eef3df70587956fb58ce4028a7de01b183d2f2ff2d58352ab6d298ee0f016';
const base = resolve(process.argv[2] ?? join(__dirname, 'r12-source.html'));
const output = resolve(process.argv[3] ?? join(__dirname, 'public'));
const header = join(__dirname, 'home-header.jpg');

function verifiedFile(path, sha) {
  const bytes = readFileSync(path);
  if (createHash('sha256').update(bytes).digest('hex') !== sha) {
    throw new Error(`Unexpected SHA-256 for ${path}`);
  }
  return bytes;
}

function replaceOnce(source, match, replacement) {
  if (source.split(match).length !== 2) throw new Error(`Expected one match for ${match}`);
  return source.replace(match, () => replacement);
}

let app = verifiedFile(base, R12_SHA256).toString('utf8');
verifiedFile(header, HEADER_SHA256);
app = replaceOnce(app, 'data-home-version="PHX-007-R12"', 'data-home-version="PHX-007-R15"');
app = replaceOnce(app, /        <clipPath id="phx-home-hero-art"[\s\S]*?<\/clipPath>\n/, '');
app = replaceOnce(app, /    <header class="phx-home-hero">[\s\S]*?<\/header>\n/,
  readFileSync(join(__dirname, 'hero.html'), 'utf8'));
app = replaceOnce(app, /#phx-r6-home \.phx-home-hero \{[\s\S]*?(?=#phx-r6-home \.phx-home-nav)/,
  readFileSync(join(__dirname, 'hero.css'), 'utf8'));
app = replaceOnce(app, /    <nav class="phx-home-nav"[^>]*>\n[\s\S]*?(?=      <button type="button" data-home-action="pylon")/,
  '    <nav class="phx-home-nav" aria-label="HOME-Navigation" data-home-label="navigation">\n');
app = replaceOnce(app, 'data-home-action="pylon"><span aria-hidden="true">Λ</span>',
  `data-home-action="pylon"><svg class="phx-home-pylon-icon" aria-hidden="true" viewBox="884 36 128 128">
        <image id="phx-home-pylon-icon-image" width="1024" height="1536"/>
      </svg>`);
app = replaceOnce(app, '.phx-home-nav span {', `#phx-r6-home .phx-home-pylon-icon {
  display: block;
  width: 27px;
  height: 27px;
  border-radius: 50%;
  overflow: hidden;
}
.phx-home-nav span {`);
app = replaceOnce(app, "  const home = byId('phx-r6-home');",
  `  const home = byId('phx-r6-home');
  const pylonArtwork = byId('phx-pylon-modal').querySelector('img');
  byId('phx-home-pylon-icon-image').setAttribute('href', pylonArtwork.getAttribute('src'));`);
app = replaceOnce(app, '      <label id="phx-r11-language">', `      <button type="button" data-home-action="settings">
        <span aria-hidden="true">⚙</span><b data-home-text="settings">Einstellungen</b>
      </button>
      <label id="phx-r11-language">`);
app = replaceOnce(app, '#phx-r6-home .phx-home-nav {\n  position: relative;\n  display: grid;\n  grid-template-columns: repeat(7, minmax(0, 1fr));',
  '#phx-r6-home .phx-home-nav {\n  position: relative;\n  display: grid !important;\n  grid-template-columns: repeat(3, minmax(0, 1fr));');
app = replaceOnce(app, 'body.phx-r8-war-open #phx-r8-war{display:block}', `body.phx-r8-war-open #phx-r8-war{display:block}
#phx-r8-war.phx-settings-open :is(.wr-intro,.wr-cards,.wr-note){display:none}
#phx-r8-war.phx-settings-open #phx-r10-settings{border-top:0;margin-top:0}`);
app = replaceOnce(app, "function route(){const on=location.hash==='#war-room';document.body.classList.toggle('phx-r8-war-open',on);war.setAttribute('aria-hidden',String(!on));}",
  `function route(){
 const settings=location.hash==='#war-room-settings';
 const on=settings||location.hash==='#war-room';
 const wasSettings=war.classList.contains('phx-settings-open');
 document.body.classList.toggle('phx-r8-war-open',on);
 war.classList.toggle('phx-settings-open',settings);
 war.setAttribute('aria-hidden',String(!on));
 if(on&&settings!==wasSettings){
  war.scrollTop=0;
  if(settings)document.getElementById('phx-home-settings-title').focus({preventScroll:true});
 }
}`);
app = replaceOnce(app, "visible || location.hash === '#war-room'",
  "visible || location.hash === '#war-room' || location.hash === '#war-room-settings'");
app = replaceOnce(app, "  const commandHeading = byId('phx-home-command-heading');\n", '');
app = replaceOnce(app, /    top: [^\n]*\n/, '');
app = replaceOnce(app, /    command: \(\) => \{[\s\S]*?\n    \},\n/,
  "    settings: () => { location.hash = '#war-room-settings'; },\n");
app = replaceOnce(app, /    reports: [^\n]*\n/, '');
app = replaceOnce(app, "pending: 'Anbindung folgt',", "settings: 'Einstellungen', pending: 'Anbindung folgt',");
app = replaceOnce(app, "pending: 'Coming later',", "settings: 'Settings', pending: 'Coming later',");
app = replaceOnce(app, "pending: 'À venir',", "settings: 'Paramètres', pending: 'À venir',");
app = replaceOnce(app, "<h2>Kommandantenprofil</h2>",
  '<h2 id="phx-home-settings-title" tabindex="-1">Einstellungen</h2>');
app = replaceOnce(app, '<label>Profilbild<input accept=', '<label><span><svg aria-hidden="true" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m3 17 14-14 4 4L7 21H3zM14 6l4 4"/></svg> Profilbild ändern</span><input accept=');
app = replaceOnce(app, " $('phx-r10-sub').textContent='Lvl '+(profile.level||'—')+' ⚔';",
  " $('phx-r10-sub').textContent='Lvl '+(profile.level||'—');");
app = replaceOnce(app, '      alliance.textContent = copy.noAlliance;\n    }',
  `      alliance.textContent = copy.noAlliance;
    }
    const name = byId('phx-r10-name');
    const affiliation = byId('phx-r11-affiliation');
    name.style.setProperty('--profile-name-length', Math.max(1, [...name.textContent].length));
    const kingdom = byId('phx-r11-kingdom').textContent;
    affiliation.style.setProperty('--profile-affiliation-length',
      [...kingdom, ...alliance.textContent].length + 3);`);

mkdirSync(output, { recursive: true });
writeFileSync(join(output, 'index.html'), app);
copyFileSync(header, join(output, 'home-header.jpg'));
