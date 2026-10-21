import top from "./assets/ascii/bars-top.svg";
import middle from "./assets/ascii/bars-middle.svg";
import bottom from "./assets/ascii/bars-bottom.svg";

/** Figma 330:10859, display artwork only. Operation icons stay in components/icon. */
export function ThemeIllustration() {
  return <div className="oreo-theme-illustration" aria-hidden="true">
    <div className="oreo-theme-illustration-art">
      <img src={top} alt="" />
      <img src={middle} alt="" />
      <img src={bottom} alt="" />
    </div>
  </div>;
}
