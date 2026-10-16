import { WordRoller } from "@/components/word-roller";

// Starting props. Connect event handlers in your app.
<WordRoller
  words={["Sprint","Hurdles","Relay","Marathon","Triathlon","Cycling","Rowing","Climbing","Tennis","Football","Skiing","Surfing","Boxing","Golf"]}
  defaultValue={"Relay"}
  suffix={"for every season"}
  loop
  disabled={false}
  size={"md"}
  visibleWords={9}
 />