"use strict";
const assert=require("node:assert/strict");
const {route}=require("../src/phalanx-question-router-v1.js");
const cases=[
 ["Bär Ratio 6 Märsche","bear"],
 ["Bear trap troop ratio","bear"],
 ["KvK Gegner 1913","kvk"],
 ["Opponent Player Intelligence","kvk"],
 ["Alcar oder Amadeus","heroes"],
 ["Top 40 Veränderung","players"],
 ["Wer hat sich am stärksten entwickelt?","players"],
 ["Outposts Nord","outposts"],
 ["Truppen 50/20/30","troops"],
 ["Archer march","troops"]
];
for(const [q,intent] of cases)assert.equal(route(q).intent,intent,q);
assert.equal(route("Und mit 50/20/30?",{intent:"bear"}).intent,"bear");
assert.equal(route("Und wie sieht es aus?",{intent:"bear"}).intent,"bear");
assert.equal(route("???").status,"clarify");
assert.equal(route("").status,"clarify");
assert.equal(route("Helden und Outposts").status,"clarify");
console.log(cases.length+5+" intent routing assertions passed");
