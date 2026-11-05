import { useEffect, useId, useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { Button } from "@/components/button";
import { Icon } from "@/components/icon";
import { easeOut } from "@/lib/motion";
import {
  safeProgress,
  fileSize,
  type FilmAsset,
  type CoverStatus,
} from "./model";
import "./film-cover.css";
export * from "./model";

export function FilmReveal({
  src,
  alt,
  progress = 1,
  animate = true,
  layoutId,
}: {
  src: string;
  alt: string;
  progress?: number;
  animate?: boolean;
  layoutId?: string;
}) {
  const reduce = useReducedMotion(),
    canvas = useRef<HTMLCanvasElement>(null),
    latest = useRef(0);
  const engine = useRef<{
    draw: (p: number) => void;
    dispose: () => void;
  } | null>(null);
  const [unavailable, setUnavailable] = useState<string>();
  const [rendered, setRendered] = useState(false),
    [failed, setFailed] = useState(false);
  const p = safeProgress(progress),
    active = animate && !reduce && p < 1;
  latest.current = p;
  useEffect(() => {
    setRendered(false);
    setFailed(false);
    if (!active || !canvas.current) return;
    let cancelled = false;
    const target = canvas.current;
    const lost = () => {
      setRendered(false);
      setFailed(true);
    };
    target.addEventListener("webglcontextlost", lost);
    const observer = new ResizeObserver(() =>
      engine.current?.draw(latest.current),
    );
    observer.observe(target);
    const image = new Image();
    image.crossOrigin = "anonymous";
    image.src = src;
    Promise.all([image.decode(), import("./film-renderer")])
      .then(([, module]) => {
        if (cancelled) return;
        engine.current = module.createFilmRenderer(target, image);
        engine.current.draw(latest.current);
        setRendered(true);
      })
      .catch(() => {
        if (!cancelled) setFailed(true);
      });
    return () => {
      cancelled = true;
      observer.disconnect();
      target.removeEventListener("webglcontextlost", lost);
      engine.current?.dispose();
      engine.current = null;
    };
  }, [src, active]);
  useEffect(() => {
    engine.current?.draw(p);
  }, [p]);
  return (
    <motion.div
      layoutId={layoutId}
      transition={{ duration: 0.25, ease: easeOut }}
      className="film-reveal"
      data-renderer={active && rendered && !failed ? "webgl" : "image"}
    >
      {unavailable === src ? (
        <div className="film-unavailable" role="img" aria-label={alt}>
          <Icon name="camera" />
          <span>Preview unavailable</span>
        </div>
      ) : (
        <img src={src} alt={alt} onError={() => setUnavailable(src)} />
      )}
      {active && unavailable !== src && (
        <>
          <img
            aria-hidden="true"
            className="film-silver"
            src={src}
            alt=""
            style={{ opacity: 1 - p }}
          />
          <canvas
            ref={canvas}
            aria-hidden="true"
            style={{ opacity: rendered && !failed ? 1 : 0 }}
          />
        </>
      )}
    </motion.div>
  );
}

export function CoverTransfer({
  asset,
  status,
  progress,
  error,
}: {
  asset: FilmAsset;
  status: CoverStatus;
  progress: number;
  error?: string;
}) {
  const [failedSrc, setFailedSrc] = useState<string>();
  const p = safeProgress(progress),
    busy = status === "loading";
  return (
    <div className="film-transfer">
      <span className="film-file-thumb">
        {failedSrc === asset.src ? (
          <Icon name="file" />
        ) : (
          <img src={asset.src} alt="" onError={() => setFailedSrc(asset.src)} />
        )}
      </span>
      <div className="film-transfer-copy">
        <strong title={asset.name}>{asset.name}</strong>
        <span>
          {fileSize(asset.size)} ·{" "}
          {busy
            ? "Preparing image…"
            : status === "error"
              ? "Could not prepare image"
              : "Ready to use"}
        </span>
      </div>
      <span className="film-percent">
        {busy ? (
          `${Math.round(p * 100)}%`
        ) : status === "ready" ? (
          <Icon name="check" />
        ) : null}
      </span>
      {busy && (
        <div
          className="film-progress"
          role="progressbar"
          aria-label={`Preparing ${asset.name}`}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(p * 100)}
        >
          <span style={{ transform: `scaleX(${p})` }} />
        </div>
      )}
      {error && (
        <p className="film-error" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

export function FilmCoverUpload({
  value,
  status,
  progress = 0,
  error,
  disabled = false,
  animate = true,
  onFiles,
  onRemove,
  onRetry,
  onCancel,
  onAssetDrop,
  layoutId,
}: {
  layoutId?: string;
  value: FilmAsset | null;
  status: CoverStatus;
  progress?: number;
  error?: string;
  disabled?: boolean;
  animate?: boolean;
  onFiles: (files: File[]) => void;
  onRemove?: () => void;
  onRetry?: () => void;
  onCancel?: () => void;
  onAssetDrop?: (id: string) => void;
}) {
  const input = useRef<HTMLInputElement>(null),
    id = useId(),
    depth = useRef(0);
  const [over, setOver] = useState(false);
  const busy = status === "loading";
  return (
    <div className="film-upload" data-disabled={disabled || undefined}>
      <div className="film-cover-label">
        <span id={id}>Cover</span>
        <span>Shown at the top of the project page</span>
      </div>
      <input
        ref={input}
        className="sr-only"
        type="file"
        accept="image/jpeg,image/png,image/webp"
        aria-label="Choose cover image"
        disabled={disabled}
        tabIndex={-1}
        onChange={(e) => {
          const files = Array.from(e.currentTarget.files ?? []);
          e.currentTarget.value = "";
          if (files.length) onFiles(files);
        }}
      />
      <div
        className="film-drop oreo-squircle"
        data-over={over || undefined}
        data-empty={!value || undefined}
        aria-labelledby={id}
        onDragEnter={(e) => {
          e.preventDefault();
          if (!disabled) {
            depth.current++;
            setOver(true);
          }
        }}
        onDragLeave={() => {
          if (--depth.current <= 0) {
            depth.current = 0;
            setOver(false);
          }
        }}
        onDragOver={(e) => {
          e.preventDefault();
          e.dataTransfer.dropEffect = disabled ? "none" : "copy";
        }}
        onDrop={(e) => {
          e.preventDefault();
          depth.current = 0;
          setOver(false);
          if (disabled) return;
          const files = Array.from(e.dataTransfer.files);
          if (files.length) onFiles(files);
          else {
            const asset = e.dataTransfer.getData("application/x-oreo-film");
            if (asset) onAssetDrop?.(asset);
          }
        }}
      >
        {value ? (
          <>
            <FilmReveal
              key={value.id}
              src={value.src}
              alt={value.alt}
              progress={busy ? progress : 1}
              animate={animate}
              layoutId={status === "ready" ? layoutId : undefined}
            />
            <span className="film-status-tag">
              {busy
                ? "Developing"
                : status === "error"
                  ? "Needs attention"
                  : "Cover image"}
            </span>
            {!busy && (
              <div className="film-cover-actions">
                <Button
                  size="sm"
                  type="secondary"
                  disabled={disabled}
                  onClick={() => input.current?.click()}
                >
                  Replace
                </Button>
                {onRemove && (
                  <Button
                    size="sm"
                    type="secondary"
                    disabled={disabled}
                    onClick={onRemove}
                  >
                    Remove
                  </Button>
                )}
              </div>
            )}
          </>
        ) : (
          <button
            type="button"
            className="film-empty oreo-focus"
            disabled={disabled}
            onClick={() => input.current?.click()}
          >
            <Icon name="camera" />
            <strong>Drop an image here</strong>
            <span>
              or <u>browse files</u> · JPG, PNG or WebP, up to 10 MB
            </span>
          </button>
        )}
        {over && (
          <div className="film-drop-hint">
            Drop to {value ? "replace" : "add"} cover
          </div>
        )}
      </div>
      <div className="film-upload-details">
        {value && (
          <CoverTransfer
            asset={value}
            status={status}
            progress={progress}
            error={error}
          />
        )}
        {!value && error && (
          <p className="film-error" role="alert">
            {error}
          </p>
        )}
        <div className="film-recovery">
          {busy && onCancel && (
            <Button
              type="tertiary"
              size="sm"
              disabled={disabled}
              onClick={onCancel}
            >
              Cancel import
            </Button>
          )}
          {status === "error" && onRetry && (
            <Button
              type="secondary"
              size="sm"
              disabled={disabled}
              onClick={onRetry}
            >
              Retry image
            </Button>
          )}
        </div>
      </div>
      <span className="sr-only" role="status">
        {busy
          ? "Preparing cover image"
          : status === "ready"
            ? "Cover ready"
            : status === "empty"
              ? "No cover selected"
              : "Cover needs attention"}
      </span>
    </div>
  );
}

export function MediaTray({
  assets,
  selectedId,
  onSelect,
  disabled = false,
  title = "Photo library",
}: {
  assets: FilmAsset[];
  selectedId?: string;
  onSelect: (asset: FilmAsset, keyboard: boolean) => void;
  disabled?: boolean;
  title?: string;
}) {
  return (
    <aside className="film-tray" aria-label={title}>
      <div className="film-tray-title">
        <Icon name="folder" />
        <div>
          <strong>{title}</strong>
          <span>{assets.length} photos · local samples</span>
        </div>
      </div>
      {assets.length ? (
        <div className="film-thumbnails">
          {assets.map((asset) => (
            <button
              type="button"
              key={asset.id}
              className="film-thumb oreo-squircle oreo-focus"
              aria-label={`Use ${asset.name} as cover`}
              aria-pressed={selectedId === asset.id}
              disabled={disabled}
              draggable={!disabled}
              onDragStart={(e) => {
                e.dataTransfer.setData("application/x-oreo-film", asset.id);
                e.dataTransfer.effectAllowed = "copy";
              }}
              onClick={(e) => onSelect(asset, e.detail === 0)}
            >
              <img draggable={false} src={asset.src} alt="" />
              {selectedId === asset.id && (
                <span>
                  <Icon name="check" size="sm" />
                </span>
              )}
            </button>
          ))}
        </div>
      ) : (
        <p className="film-muted">
          No sample photos. Browse files to add a cover.
        </p>
      )}
    </aside>
  );
}
