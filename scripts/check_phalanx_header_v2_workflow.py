#!/usr/bin/env python3
"""Check isolated workflow is scoped and does not publish or merge."""
from pathlib import Path
import sys

root=Path(__file__).resolve().parents[1]
workflow=(root/'.github/workflows/phalanx-header-v2-assets-isolated.yml').read_text()
checks={
    'isolated branch': 'fix/battle-readiness-navigation-isolated-20261015' in workflow,
    'asset verification': 'python3 scripts/verify_phalanx_header_v2_assets.py' in workflow,
    'component verification': 'python3 scripts/check_phalanx_header_v2_contract.py' in workflow,
    'read-only permissions': 'contents: read' in workflow,
    'no deployment': not any(token in workflow for token in ('wrangler', 'pages deploy', 'gh pr merge', 'git push', 'contents: write')),
}
for name,ok in checks.items():
    print(('PASS' if ok else 'FAIL')+': '+name)
sys.exit(not all(checks.values()))
