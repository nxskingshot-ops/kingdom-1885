import importlib.util
import pathlib
import tempfile
import unittest

path=pathlib.Path(__file__).resolve().parents[1]/'scripts'/'phx-sec-037-local-recovery.py'
spec=importlib.util.spec_from_file_location('local_recovery',path)
module=importlib.util.module_from_spec(spec)
spec.loader.exec_module(module)

class TestLocalRecovery(unittest.TestCase):
    def test_complete_synthetic_recovery(self):
        with tempfile.TemporaryDirectory() as tmp:
            root=pathlib.Path(tmp)
            inventory=[]
            for n in range(26):
                slug=f'function-{n}'
                (root/slug).mkdir()
                (root/slug/'index.ts').write_text('export default true')
                inventory.append({'slug':slug,'version':1,'ezbr_sha256':'a'*64})
            result=module.prove_local_recovery(root,inventory)
            self.assertEqual(result['functions'],26)
            self.assertTrue(result['verified'])
            self.assertEqual(len(result['ciphertext_sha256']),64)
