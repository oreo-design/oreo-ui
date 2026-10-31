/** Family-owned preview adapters and local export bindings. */
import { WordRoller } from "@/components/word-roller";
import { definePlayground as define, text, toggle, select } from "../schema";
import type { PlaygroundSpec } from "../schema";
const playgrounds: Record<string, PlaygroundSpec> = {
"word-roller": define("Word Roller", {
    words: { ...text("Sprint, Hurdles, Relay, Marathon, Triathlon, Cycling, Rowing, Climbing, Tennis, Football, Skiing, Surfing, Boxing, Golf", true), description: "Separate words with commas." },
    suffix: text("for every season"),
    value: { ...text("Triathlon"), label: "Selected word" },
    loop: toggle(true), disabled: toggle(),
    size: select(["sm", "md", "lg"], "md"),
    visibleWords: select(["5", "7", "9"], "9"),
  }, (v, set) => <WordRoller words={v.words.split(",").map(word => word.trim()).filter(Boolean)} value={v.value} onValueChange={word => set("value", word)} suffix={v.suffix} loop={v.loop} disabled={v.disabled} size={v.size} visibleWords={Number(v.visibleWords) as 5 | 7 | 9} />)
};
const exports = {
"word-roller": { WordRoller }
};
for (const spec of Object.values(playgrounds)) { spec.source ??= "word-roller"; spec.exports = exports; }
export default playgrounds;
