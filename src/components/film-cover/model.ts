export type FilmAsset = {
  id: string;
  src: string;
  name: string;
  alt: string;
  size?: number;
};
export type CoverStatus = "empty" | "loading" | "ready" | "error";
export const MAX_COVER_BYTES = 10 * 1024 * 1024;
export function validateCover(
  file: Pick<File, "type" | "size">,
): string | null {
  if (!["image/jpeg", "image/png", "image/webp"].includes(file.type))
    return "Choose a JPG, PNG or WebP image.";
  if (!file.size) return "This file is empty. Choose another image.";
  if (file.size > MAX_COVER_BYTES)
    return "This image is over 10 MB. Choose a smaller file.";
  return null;
}
export function safeProgress(value: number) {
  return Number.isFinite(value) ? Math.min(1, Math.max(0, value)) : 0;
}
export function fileSize(bytes?: number) {
  return bytes == null
    ? "Sample image"
    : bytes >= 1024 * 1024
      ? `${(bytes / 1024 / 1024).toFixed(1)} MB`
      : `${Math.max(1, Math.round(bytes / 1024))} KB`;
}
