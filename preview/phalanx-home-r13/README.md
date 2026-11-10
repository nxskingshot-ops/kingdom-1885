# PHALANX HOME · R13 und R14

## R14 · Schlanke HOME-Navigation

Die Leiste enthält den bestehenden PYLON-IX-Button, Einstellungen und die Sprachwahl. Einstellungen öffnet das vorhandene Profilformular direkt. Der War Room behält seine Zugänge über Avatar und Lasche. Territory Control bleibt als Kachel erreichbar, Outpost Reports über Territory Control.

[Geschützte R14-Testvorschau](https://phalanx-r11-atlas-preview-9w9c4rgsd-matze4428-6040.vercel.app/) · [R13-Rückweg](https://phalanx-r11-atlas-preview-edjw5k328-matze4428-6040.vercel.app/)

- BESTANDEN im simulierten DOM. Einstellungen und Fokus, lokales Profil und simulierter Bildimport, beide War-Room-Einstiege, Sprache, Territory-Rückweg und vorhandener PYLON-Dialog mit Rückweg.
- BESTANDEN auf Dateiebene. HOME-Header, Command Center, Territory Control, Outpost Map, Reports, Profilskript und PYLON-Skript bytegleich mit R13. Alle Inline-Skripte syntaktisch gültig.
- NICHT GETESTET. R14 im angemeldeten Browser und auf physischem Android.

R14-HTML SHA-256 `24ac3cdef24d6dabfefd023df8d8d22894adf17c0405abf07d6fc01ce36a273a`.

## Reproduzieren

Benötigt Node.js und die unveränderte [R12-Testdatei](https://chatgpt.com/library?file_id=libfile_cf02c1ab2ad08191b5e6b89786c06a11&account_id=personal).
`build.cjs` prüft Eingangsdatei und Header mit SHA-256 und baut in einen separaten Ausgabeordner.

```sh
node build.cjs /pfad/PHALANX_HOME_R12_TEST.html /pfad/ausgabe
```

Unverändertes Originalmotiv `home-header.jpg`, SHA-256 `9b8eef3df70587956fb58ce4028a7de01b183d2f2ff2d58352ab6d298ee0f016`.
Der gesicherte R13-Stand liegt im Vorgänger-Commit `c5f9f27`.
