#!/usr/bin/env python3
"""Check registered version comparisons."""
from compare_version_locks import compare
base = {'app': {'build': 'B001'}, 'modules': [{'code': 'A', 'current': False, 'path': 'a', 'sha256': 'x'}, {'code': 'B', 'current': False}]}
next_version = {'app': {'build': 'B002'}, 'modules': [{'code': 'A', 'current': False, 'path': 'b', 'sha256': 'y'}, {'code': 'C', 'current': True, 'path': None, 'sha256': None}]}
result = compare(base, next_version)
kinds = {item['code']: item['kind'] for item in result['modules']}
assert kinds == {'A': 'changed', 'B': 'removed', 'C': 'unverified'}
assert result['source_verified'] is False
assert result['same_build'] is False
assert compare(base, base)['same_build'] is True
assert compare(base, base)['modules'][0]['kind'] == 'unchanged'
print('PASS: comparator regression tests')
