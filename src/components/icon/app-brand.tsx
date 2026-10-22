import gmail from "./assets/brands/gmail.svg";
import slack from "./assets/brands/slack-color.svg";
import clickup from "./assets/brands/clickup-color.svg";

const appBrands = { gmail, slack, clickup };
export type AppBrandName = keyof typeof appBrands;
/** Identity artwork stays colored; operation icons use the central Icon adapter. */
export function AppBrand({ name }: { name: AppBrandName }) {
  return <img src={appBrands[name]} alt="" aria-hidden className="size-4 object-contain" />;
}
