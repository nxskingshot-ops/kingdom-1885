# Mystic Six — verified integration status

The existing six-board probe is read-only and currently selects governor ID 290591005.
A generic player lookup requires complete board rows and an authorized backend endpoint.
The six recognized board keys are coliseum, forest_of_life, crystal_cave, knowledge_nexus, molten_fort, radiant_spire.

Do not expose upstream credentials in the browser.
Do not replace existing 16 ranking boards or overwrite candidate records.
Missing player in returned top 100 means unknown rank and score, not zero.
Existing candidate trial stages are not ranking scores.

Next implementation gate: verify NEXUS membership in backend, accept validated governor ID, query six boards, return matched records with coverage and capture timestamps; integrate with existing scouting dossier.
No production deployment is approved.
