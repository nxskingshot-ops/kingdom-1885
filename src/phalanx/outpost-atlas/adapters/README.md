# PHX-OUT-CORE V2: Datenadapter
Host stellt vor dem Laden von map-core.js `window.PHALANX_OUTPOST_DATA_PROVIDER = async ({signal}) => rows` bereit.
Keine Schlüssel im Client hinterlegen. Zugriff ausschließlich nach Berechtigungsprüfung durch vertrauenswürdige Backend-API. Rückgabe muss die Felder id, source_key, alliance, structure_type, level, coord_x, coord_y enthalten. Optionaler Wrapper `{rows}` wird akzeptiert. Keine automatischen Netzwerkaufrufe, keine erfundenen Datensätze. Schema 1.0.0; Änderungen nur versioniert.
