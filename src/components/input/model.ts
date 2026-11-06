export const passwordCriteria = (value: string) => [
  /[A-Z]/.test(value),
  /[0-9]/.test(value),
  value.length >= 8,
];
export function addInputTag(tags: readonly string[], value: string) {
  const tag = value.trim();
  return !tag || tags.includes(tag) ? [...tags] : [...tags, tag];
}
