from pathlib import Path
import hashlib,json,sys
root=Path(__file__).resolve().parents[1]
html=root/'www/index.html'
original=html.read_bytes()
expected='b675a78957893f13bb9708f604310ccba27774a0087d788605cede40bd690604'
actual=hashlib.sha256(original).hexdigest()
if actual!=expected:
    print('STOP: frozen index baseline changed',actual);sys.exit(2)
text=original.decode('utf-8')
for marker in ('id="phx-r8-war"','id="phx-r8-war-cards"','id="phx-r10-settings"','id="phx-r8-war-back"',"phx-war-room-slot-","phx-personal-profile-r10","PHX_HOME_QUEEN_AN_APPROVED.png"):
    if marker not in text:
        print('STOP: missing legacy marker',marker);sys.exit(3)
if 'phx-war-room-v2.js' in text:
    print('STOP: integration already present');sys.exit(4)
end=text.rfind('</body>')
if end<0:
    print('STOP: body close not found');sys.exit(5)
addition='<link rel="stylesheet" href="./phx-war-room-v2.css" data-phx-war-v2="true"/>\n<script src="./phx-war-room-v2.js" defer data-phx-war-v2="true"></script>\n'
patched=text[:end]+addition+text[end:]
assert patched.replace(addition,'')==text
html.write_text(patched)
check=root/'checksums.json'
data=json.loads(check.read_text())
if 'index.html' not in data:raise RuntimeError('Missing frozen index checksum key')
data['index.html']=hashlib.sha256(html.read_bytes()).hexdigest()
check.write_text(json.dumps(data,indent=2,ensure_ascii=False)+'\n')
print('INTEGRATED: additive CSS/JS only; original HTML preserved byte-for-byte when insertion removed')
print('ORIGINAL',actual,'NEW',data['index.html'])
