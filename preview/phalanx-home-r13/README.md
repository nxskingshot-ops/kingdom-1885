# PHALANX HOME · PHX-007-R13

Isolierte HOME-Testfassung vom 10.11.2026. Die von Matthi übermittelte
Header-Vorlage ist in `home-header.jpg` unverändert archiviert. Dateiformat JPEG,
1536 × 768 Pixel. Die beiden Plaketten verwenden Ausschnitte der Originaltextur.
Name, Level, Königreich und Allianz kommen aus dem vorhandenen lokalen Profil.
Der runde Avatar und die War-Room-Lasche öffnen den bestehenden War Room.
Der vorhandene Bildwähler liegt unter **Einstellungen → Profilbild ändern**.

## Reproduzieren

Benötigt Node.js und die unveränderte [R12-Testdatei](https://chatgpt.com/library?file_id=libfile_cf02c1ab2ad08191b5e6b89786c06a11&account_id=personal).
`build.cjs` prüft Eingangsdatei und Header mit SHA-256 und baut in einen separaten Ausgabeordner.

```sh
node build.cjs /pfad/PHALANX_HOME_R12_TEST.html /pfad/ausgabe
```

- SHA-256 Originalheader `9b8eef3df70587956fb58ce4028a7de01b183d2f2ff2d58352ab6d298ee0f016`
- SHA-256 R13-HTML `d89a89dfec75b76afae6b6046775ec2a8284b1544981bf913742edb3af0ffaae`

## Teststand

| Prüfung | Ergebnis | Nachweis |
|---|---|---|
| Quell- und Build-Integrität | BESTANDEN | Pinned SHA-256, Vercel-Datei-IDs für die sechs Eingangsdateien geprüft, 8 JavaScript-Blöcke syntaktisch gültig. |
| Bestandsschutz auf Dateiebene | BESTANDEN | 24 Style- und Skriptblöcke bytegleich mit R12, einschließlich Territory Control, Karte und Reports. Drei Blöcke mit HOME, Profil und Routing gezielt angepasst. |
| Rendern des Bildmotivs | BESTANDEN | Originalmotiv und Texturmasken als SVG bei 768 px gerendert und visuell gesichtet. |
| HOME, War Room, Profil und Sprache | BESTANDEN in DOM-Simulation | Avatar und Lasche, War-Room-Rückweg, langer Name, leere Allianz, simulierter Bildimport, Speichern, Wiederladen, Zurücksetzen und Sprachwahl. |
| Territory Control, Karte und Reports | Teilprüfung BESTANDEN | Routingadapter in der DOM-Simulation, Modulblöcke bytegleich. Funktionale R13-Navigation im echten Browser NICHT GETESTET. |
| Geschützte Vorschau | BESTANDEN | Vercel meldet abgeschlossenes Deployment und keine Aliase. Der Browser zeigt die Vercel-Anmeldung. |
| R13 im angemeldeten Browser, physisches Android, visueller Vergleich der Live-Typografie | NICHT GETESTET | Anmeldung stand der Prüfsitzung nicht zur Verfügung. Der Rendernachweis deckt die Grafik ab. |
| Rollen, Live-Daten und Wiederherstellung | NICHT GETESTET | Isolierte HOME-Vorschau mit lokalem Profil. |

[R13-Testvorschau](https://phalanx-r11-atlas-preview-edjw5k328-matze4428-6040.vercel.app/) ·
[R12-Rückweg](https://phalanx-r11-atlas-preview-1cj287yeu-matze4428-6040.vercel.app/).
