"""Assemble the Intelligence and PYLON additions in isolated generated assets."""
from pathlib import Path
import shutil
import sys

scripts = Path(__file__).resolve().parent
root = Path(sys.argv[1])
pylon = scripts.parents[1] / 'deploy/phalanx-kvk-test/pylon-ix'
transfer_name = 'transfer-scouting-id-stage-20261030'
shared = ('phx-war-academy-core-v01.js', 'phx-war-academy-view.js')


def replace_once(path, anchor, replacement):
    source = path.read_bytes()
    assert source.count(anchor.encode()) == 1, f'Unexpected source anchor: {path}: {anchor}'
    path.write_bytes(source.replace(anchor.encode(), replacement.encode()))


# Use the existing protected Transfer workspace, including its sibling role module.
for directory in ('transfer-pr42', 'transfer-access-v21'):
    shutil.copytree(pylon / directory, root / 'pylon-ix' / directory, dirs_exist_ok=True)
transfer = root / 'pylon-ix/transfer-pr42'
# Confirmation and password-recovery links keep the existing staging origin.
auth_base = 'https://stage-transfer-live-rankings.nexus-phalanx-kvk-test.pages.dev/pylon-ix/'
for filename in (transfer_name + '.html', 'transfer-register.html'):
    replace_once(transfer / filename, 'href="../password-recovery.html"',
                 f'href="{auth_base}password-recovery"')
replace_once(transfer / 'transfer-register.js',
             f"new URL('./{transfer_name}', document.baseURI).href",
             f"'{auth_base}transfer-pr42/{transfer_name}'")
for name in shared + ('phx-war-academy-war-room-bridge-v01.js', 'phx-pylon-transfer.js'):
    shutil.copyfile(scripts / name, root / name)

tags = ''.join(f'<script defer src="./{name}"></script>\n' for name in shared)
live_script = '<script src="./phx-war-room-live.js" defer></script>'
replace_once(root / 'index.html', live_script,
             tags + '<script defer src="./phx-war-academy-war-room-bridge-v01.js"></script>\n'
             + live_script + '\n<script defer src="./phx-pylon-transfer.js"></script>')
replace_once(root / 'index.html', "pylon?.open&&location.hash!=='#pylon'",
             "pylon?.open&&!['#pylon','#transfer'].includes(location.hash)")

transfer_html = transfer / (transfer_name + '.html')
replace_once(transfer_html, '</head>',
             tags.replace('src="./', 'src="../../') + '</head>')
replace_once(transfer / (transfer_name + '.js'), ' card.append(roles,decisionDetails(',
             """ card.append(window.PHXWarAcademyView.fromTransfer(payload,id,castle));
 card.append(roles,decisionDetails(""")
