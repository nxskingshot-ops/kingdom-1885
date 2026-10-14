# Alpha31 long-number mobile stress test — 2026-10-14

Isolated Chromium CSS reproduction, not a test of the complete original page or physical Android.

Widths 320, 360, 390, 412 px. Replacing result values with long unbroken numeric strings produced document scroll widths 423, 443, 458, 469 px respectively. Result tiles exceeded their content boxes.

Applying only `.tile,.value,td{min-width:0;overflow-wrap:anywhere;word-break:normal}` in the isolated harness restored scroll width to the viewport (320, 360, 390, 412 px), with no measured clipped nodes in the tested selection.

This is a conditional mitigation for extreme values, not proof that typical game-model values overflow. No frozen UI or production file was edited. Before any integration, verify the complete original Alpha31 page in Chromium and on Android, including actual text wrapping and touch interaction.
