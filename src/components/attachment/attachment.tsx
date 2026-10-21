import { SpinnerDots, CloseGlyph } from "@/components/icon";
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
      {kind === "video" && (
        <img
          src={playIcon}
          alt=""
          className="absolute top-1/2 left-1/2 size-[7px] -translate-x-1/2 -translate-y-1/2 [filter:drop-shadow(0_2.33px_7px_rgba(0,0,0,0.08))_drop-shadow(0_0_0.29px_rgba(0,0,0,0.24))]"
        />
      )}
    </span>
  ) : (
    <img src={TYPE_ICONS[kind as Exclude<AttachmentType, "image" | "video">]} alt="" className={slots.typeIcon()} />
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
              <img
                src={playIcon}
                alt=""
                className="pointer-events-none absolute top-1/2 left-1/2 size-[14px] -translate-x-1/2 -translate-y-1/2 [filter:drop-shadow(0_4.67px_14px_rgba(0,0,0,0.08))_drop-shadow(0_0_0.58px_rgba(0,0,0,0.24))]"
              />
            )}
          </>
        ) : (
          <img src={TYPE_ICONS[kind as Exclude<AttachmentType, "image" | "video">]} alt="" className={slots.typeIcon()} />
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
            <CloseGlyph className="size-[10px]" />
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
            <CloseGlyph className="size-4" />
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
