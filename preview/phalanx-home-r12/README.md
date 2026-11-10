# PHALANX HOME · PHX-007-R12

Isolated HOME candidate built from the existing A039 R11 app. The confirmed
artwork is retained. HOME presents the profile, language choice, navigation and
four illustrated cards as separate elements. War Room, Territory Control,
Reports and PYLON IX keep the existing R11 module implementations. The Transfer
Scouting, KvK and Alliance cards have no route in this candidate.

## Build

Use the unmodified original
[A039 R11 HTML](https://chatgpt.com/library?file_id=libfile_dea01bb87a3c819194cc4433e667bffe&account_id=personal)
as the input. The build checks both the file hash and the embedded artwork hash.

```sh
python3 build_home.py /path/to/r11-original.html /path/to/PHALANX_HOME_R12_TEST.html
```

Output SHA-256 for this source revision:
`ace5c9dd54e685e378b350b9d462ec756ce05abd231fae3b66ed35df6eaa0c42`.

The R11 input stays unchanged. Only the HOME fragment, styles and routing adapter
are replaced in the generated HTML. This folder is outside the deployed tree.

## Verification

- Passed locally: pinned input and artwork checks, DOM structure, eight
  JavaScript syntax checks and byte equality of the R11 module blocks.
- Passed in a simulated DOM: HOME routing and return state, Command Center
  focus, language changes and preservation of the assigned alliance.
- Pending: actual desktop and Android browser tests, including visual comparison,
  avatar upload and persistence, real navigation, and live data.
- No release or deployment approval is implied.
