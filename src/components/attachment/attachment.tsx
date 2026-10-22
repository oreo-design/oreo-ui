import { SpinnerDots } from "@/components/icon";
import { ComposerAsset } from "@/components/composer/assets";
import * as React from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/cn";
import { pressSpring } from "@/lib/motion";
import { ShimmerText } from "@/components/activity-label";
import { attachment } from "./attachment.variants";
import docIcon from "../icon/assets/attachments/doc.svg";
import textIcon from "../icon/assets/attachments/text.svg";
import codeIcon from "../icon/assets/attachments/code.svg";
import jsonIcon from "../icon/assets/attachments/json.svg";
import musicIcon from "../icon/assets/attachments/music.svg";
import unknownIcon from "../icon/assets/attachments/unknown.svg";
import linkIcon from "../icon/assets/attachments/link.svg";
import pdfIcon from "../icon/assets/attachments/pdf.svg";
import playIcon from "../icon/assets/attachments/play.svg";

export type AttachmentType =
  | "image"
  | "video"
  | "doc"
  | "text"
  | "code"
  | "json"
  | "music"
  | "unknown"
  | "link"
  | "pdf";

const TYPE_ICONS: Record<Exclude<AttachmentType, "image" | "video">, string> = {
  doc: docIcon,
  text: textIcon,
  code: codeIcon,
  json: jsonIcon,
  music: musicIcon,
  unknown: unknownIcon,
  link: linkIcon,
  pdf: pdfIcon,
};

/** Preserve the original export's shadow overflow around its 20px Figma frame.
 * These offsets are artwork bounds, not component spacing tokens. */
function FileIcon({ src, className }: { src: string; className: string }) {
  return <span className={cn("relative inline-block shrink-0", className)}>
    <img src={src} alt="" className="pointer-events-none absolute max-w-none" style={{ left: -8, top: -5, width: 38, height: 33 }} />
  </span>;
}

export type AttachmentProps = {
  /** Filename shown next to the icon; omit for the icon-only square. */
  label?: string;
  /** File kind — picks the paper icon, or thumbnail treatment for image/video. */
  type?: AttachmentType;
  /** Thumbnail URL, used when type is image or video. */
  src?: string;
  /** sm compacts the labeled chip to 28px tall. */
  size?: "md" | "sm";
  /** Upload in flight — dot spinner plus shimmered label. */
  loading?: boolean;
  /** When set, the chip grows its remove affordance on hover. */
  onRemove?: () => void;
} & Omit<React.ComponentPropsWithoutRef<"div">, "children">;

export function Attachment({
  label,
  type,
  src,
  size = "md",
  loading = false,
  onRemove,
  className,
  ...rest
}: AttachmentProps) {
  const kind: AttachmentType = type ?? (src ? "image" : "unknown");
  const media = (kind === "image" || kind === "video") && !!src;
  const withLabel = label != null;
  const slots = attachment({ withLabel, size, removable: !!onRemove, media });
  const removeLabel = label ? `Remove ${label}` : "Remove attachment";

  const leadingIcon = loading ? (
    <SpinnerDots className={slots.spinner()} />
  ) : media ? (
    <span className={slots.thumb()}>
      <img src={src} alt="" className={slots.image()} />
    </span>
  ) : (
    <FileIcon src={TYPE_ICONS[kind as Exclude<AttachmentType, "image" | "video">]} className={slots.typeIcon()} />
  );

  if (!withLabel) {
    return (
      <div className={cn(slots.root(), className)} {...rest}>
        {loading ? (
          <SpinnerDots className={slots.spinner()} />
        ) : media ? (
          <>
            <span className={slots.fill()}>
              <img src={src} alt="" className={slots.image()} />
            </span>
            {kind === "video" && (
              <span className="pointer-events-none absolute top-1/2 left-1/2 size-3.5 -translate-x-1/2 -translate-y-1/2">
                {/* Full export bounds preserve the shadow outside the 14px glyph frame. */}
                <img src={playIcon} alt="" className="absolute max-w-none" style={{ left: -25.2291564941406, top: -22.157470703125, width: 67, height: 68 }} />
              </span>
            )}
          </>
        ) : (
          <FileIcon src={TYPE_ICONS[kind as Exclude<AttachmentType, "image" | "video">]} className={slots.typeIcon()} />
        )}
        {onRemove && (
          <motion.button
            type="button"
            aria-label={removeLabel}
            whileTap={{ scale: 0.88 }}
            transition={pressSpring}
            onClick={onRemove}
            className={slots.badge()}
          >
            <ComposerAsset name="closeBadge" />
          </motion.button>
        )}
      </div>
    );
  }

  return (
    <div className={cn(slots.root(), className)} {...rest}>
      <span className={slots.leading()}>
        {leadingIcon}
        {onRemove && (
          <motion.button
            type="button"
            aria-label={removeLabel}
            whileTap={{ scale: 0.88 }}
            transition={pressSpring}
            onClick={onRemove}
            className={slots.ghost()}
          >
            <ComposerAsset name="closeAttachment" />
          </motion.button>
        )}
      </span>
      <span className={slots.label()}>{loading ? <ShimmerText>{label}</ShimmerText> : label}</span>
    </div>
  );
}

/** The Attachment Bar — a wrapping row of file chips, composer or message side. */
export function AttachmentBar({ className, ...rest }: React.ComponentPropsWithoutRef<"div">) {
  return <div className={cn("flex flex-wrap items-center gap-[var(--space-x4)]", className)} {...rest} />;
}

export { SpinnerDots } from "@/components/icon";
