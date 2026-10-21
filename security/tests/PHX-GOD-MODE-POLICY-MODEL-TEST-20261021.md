# PHALANX owner policy model — isolated test results

Executed 2026-10-21 using Python 3 in the working container.

Five tests PASS:
- owner protected from ban/delete/demote/disable/auth-relink in the model
- only owner can lock/unlock app
- sale-only transfer and no sharing
- game identity changes do not change owner privileges
- An may approve ordinary users but not invoke owner lock

These tests are deliberately **policy-model unit tests**, not database/RLS/API/Auth integration tests. No production changes or deployments.

Test script:
```python
from dataclasses import dataclass

@dataclass(frozen=True)
class Account:
    auth_id: str
    game_id: str | None
    role: str
    active: bool = True

OWNER = 'auth-owner-uuid'
AN = 'auth-an-uuid'

def allowed(actor, action, target=None, *, owner=OWNER, sale_verified=False):
    if action in {'ban', 'delete', 'demote', 'disable', 'relink_auth'} and target == owner:
        return False
    if action in {'lock_app', 'unlock_app'}:
        return actor == owner
    if action in {'transfer_owner', 'share_owner'}:
        return action == 'transfer_owner' and actor == owner and sale_verified
    if action == 'approve_user':
        return actor in {owner, AN}
    return False

def test_owner_protection():
    for actor in (AN, 'other-admin', 'member', OWNER):
        for operation in ('ban','delete','demote','disable','relink_auth'):
            assert not allowed(actor, operation, OWNER), (actor, operation)

def test_owner_lock():
    for op in ('lock_app','unlock_app'):
        assert allowed(OWNER,op)
        assert not allowed(AN,op)

def test_sale_only():
    assert not allowed(OWNER,'transfer_owner',sale_verified=False)
    assert allowed(OWNER,'transfer_owner',sale_verified=True)
    assert not allowed(AN,'transfer_owner',sale_verified=True)
    assert not allowed(OWNER,'share_owner',sale_verified=True)

def test_game_identity_independent():
    before=Account(OWNER,'291410048','owner')
    after=Account(OWNER,None,'owner')
    assert before.auth_id == after.auth_id
    assert allowed(before.auth_id,'lock_app') == allowed(after.auth_id,'lock_app')

def test_operational_admin():
    assert allowed(AN,'approve_user')
    assert not allowed(AN,'lock_app')

if __name__=='__main__':
    tests=[test_owner_protection,test_owner_lock,test_sale_only,test_game_identity_independent,test_operational_admin]
    for test in tests:
        test()
        print('PASS',test.__name__)
```

**Known model limitation:** `sale_verified` is a test input, not a real sale-verification protocol. This model cannot establish identity, prevent privileged infrastructure modifications, or guarantee owner continuity. Implement and test server-side protections separately before any release.
