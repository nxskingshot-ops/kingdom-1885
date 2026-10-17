import assert from "node:assert/strict";
import { test } from "node:test";
import { askPylon, MODULES, PYLON_BRAND } from "../../experiments/pylon-ix/pylon-core.js";

test("brand and module identifiers remain stable", () => {
  assert.equal(PYLON_BRAND.name, "PYLON IX");
  assert.deepEqual(Object.keys(MODULES).sort(), ["account", "alliance", "heroes", "kvk"]);
});
for (const language of ["de", "en", "fr"]) {
  test("offline answers remain localized: " + language, () => {
    const greeting = askPylon("", { language });
    assert.equal(greeting.intent, "greeting");
    assert.equal(greeting.module, null);
    assert.ok(greeting.text.length > 20);
    for (const [question, intent] of [
      ["hero skills", "heroes"],
      ["kvk opponent", "kvk"],
      ["account progress", "account"],
      ["alliance comparison", "alliance"]
    ]) {
      const result = askPylon(question, { language });
      assert.equal(result.intent, intent);
      assert.equal(result.module, MODULES[intent]);
      assert.equal(result.confidence, "rule");
      assert.ok(result.text.length > 20);
    }
  });
}
test("unsupported and empty inputs never fabricate data", () => {
  const result = askPylon("weather tomorrow", { language: "de" });
  assert.equal(result.intent, "unknown");
  assert.equal(result.module, null);
  assert.equal(result.confidence, "rule");
  assert.equal(askPylon(null).intent, "greeting");
  assert.equal(askPylon("hero", { language: "invalid" }).intent, "heroes");
});
