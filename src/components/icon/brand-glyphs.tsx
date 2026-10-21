import type { SVGProps } from "react";
import apple from "./assets/brands/apple.svg";
import github from "./assets/brands/github.svg";
/** Brand identity assets are independent of operation-icon libraries. */
function brand(src: string) {
  return function BrandGlyph({ style, ...props }: SVGProps<SVGSVGElement>) {
    return <svg {...props} viewBox="0 0 24 24" style={{ backgroundColor: "currentColor", maskImage: `url("${src}")`, maskSize: "contain", maskPosition: "center", maskRepeat: "no-repeat", ...style }} />;
  };
}
export const AppleLogo = brand(apple);
export const GithubLogo = brand(github);
