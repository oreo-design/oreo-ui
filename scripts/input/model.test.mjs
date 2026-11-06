import test from "node:test";
import assert from "node:assert/strict";
import {passwordCriteria,addInputTag} from "../../src/components/input/model.ts";
test("requirements are independent, with an exact length boundary",()=>{assert.deepEqual(passwordCriteria(""),[false,false,false]);assert.deepEqual(passwordCriteria("Abcdef1"),[true,true,false]);assert.deepEqual(passwordCriteria("Abcdef12"),[true,true,true]);assert.deepEqual(passwordCriteria("abcdefgh"),[false,false,true]);});
test("tags trim entries, reject empty and duplicates, and preserve the caller array",()=>{const original=Object.freeze(["Berlin"]);assert.deepEqual(addInputTag(original," Tokyo "),["Berlin","Tokyo"]);assert.deepEqual(addInputTag(original," Berlin "),["Berlin"]);assert.deepEqual(addInputTag(original,"  "),["Berlin"]);assert.deepEqual(original,["Berlin"]);});
