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
app = replaceOnce(app, 'data-home-version="PHX-007-R12"', 'data-home-version="PHX-007-R13"');
app = replaceOnce(app, /        <clipPath id="phx-home-hero-art"[\s\S]*?<\/clipPath>\n/, '');
app = replaceOnce(app, /    <header class="phx-home-hero">[\s\S]*?<\/header>\n/,
  readFileSync(join(__dirname, 'hero.html'), 'utf8'));
app = replaceOnce(app, /#phx-r6-home \.phx-home-hero \{[\s\S]*?(?=#phx-r6-home \.phx-home-nav)/,
  readFileSync(join(__dirname, 'hero.css'), 'utf8'));
app = replaceOnce(app, '#phx-r6-home .phx-home-nav {\n  position: relative;',
  '#phx-r6-home .phx-home-nav {\n  position: relative;\n  display: grid !important;');
app = replaceOnce(app, "<h2>Kommandantenprofil</h2>",
  '<h2>Einstellungen</h2>');
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
