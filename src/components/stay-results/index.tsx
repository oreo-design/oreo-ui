import { Button, IconButton } from "@/components/button";
import { Icon } from "@/components/icon";
import { pounds, distanceLabel, type Stay } from "./model";
import "./stay-results.css";
export * from "./model";

/** Contents for a host-owned map marker button; contains no nested interaction. */
export function StayPriceLabel({
  name,
  nightly,
  selected = false,
}: {
  name: string;
  nightly: number;
  selected?: boolean;
}) {
  return (
    <span className="stay-price-label">
      {selected && <span className="stay-price-name">{name}</span>}
      <strong>{pounds(nightly)}</strong>
      <span className="sr-only">
        {" "}
        per night{!selected ? ` at ${name}` : ""}
      </span>
    </span>
  );
}
/** Original architectural illustration, deliberately not a hotel photograph. */
export function StayIllustration({
  color = "mint",
}: {
  color?: Stay["color"];
}) {
  return (
    <svg
      className="stay-illustration"
      data-color={color}
      viewBox="0 0 320 180"
      aria-hidden="true"
    >
      <rect width="320" height="180" fill="var(--stay-art-bg)" />
      <circle
        cx="266"
        cy="34"
        r="24"
        fill="var(--color-bg-base)"
        opacity=".7"
      />
      <path
        d="M0 146Q88 119 158 139T320 129V180H0Z"
        fill="var(--stay-art-ink)"
        opacity=".16"
      />
      <path d="M69 44H221L237 62H53Z" fill="var(--stay-art-ink)" />
      <path d="M65 62H225V165H65Z" fill="var(--color-bg-base)" />
      <path
        d="M69 76H221M69 114H221M69 152H221"
        stroke="var(--stay-art-bg)"
        strokeWidth="3"
      />
      {[85, 124, 164, 203].map((x) => (
        <g key={x}>
          {[86, 124].map((y) => (
            <g key={y}>
              <path
                d={`M${x - 8} ${y + 14}V${y}a8 8 0 0 1 16 0v14Z`}
                fill="var(--stay-art-ink)"
                opacity=".8"
              />
              <path
                d={`M${x} ${y - 7}v21M${x - 8} ${y + 4}h16`}
                stroke="var(--stay-art-bg)"
                strokeWidth="2"
              />
            </g>
          ))}
        </g>
      ))}
      <path d="M130 165V150Q145 132 160 150V165Z" fill="var(--stay-art-ink)" />
      <path
        d="M248 165V114M39 168V122"
        stroke="var(--stay-art-ink)"
        strokeWidth="3"
      />
      <ellipse
        cx="248"
        cy="111"
        rx="20"
        ry="29"
        fill="var(--stay-art-ink)"
        opacity=".65"
      />
      <ellipse
        cx="39"
        cy="119"
        rx="16"
        ry="23"
        fill="var(--stay-art-ink)"
        opacity=".5"
      />
      <path d="M48 166H237" stroke="var(--stay-art-ink)" strokeWidth="4" />
    </svg>
  );
}
export function StayResultCard({
  stay,
  distance,
  selected = false,
  saved = false,
  onSelect,
}: {
  stay: Stay;
  distance: number;
  selected?: boolean;
  saved?: boolean;
  onSelect?: (id: string) => void;
}) {
  const content = (
    <>
      <div className="stay-result-art">
        <StayIllustration color={stay.color} />
        <span className="stay-star-badge">
          <Icon name="star" size="sm" weight="fill" />
          {stay.stars}
          <span className="sr-only"> star category</span>
        </span>
        {saved && (
          <span className="stay-saved-badge">
            <Icon name="check" size="sm" />
            <span className="sr-only">Saved</span>
          </span>
        )}
      </div>
      <span className="stay-result-body">
        <strong>{stay.name}</strong>
        <span>{distanceLabel(distance)} from landmark</span>
        <span className="stay-result-price">
          <b>{pounds(stay.nightly)}</b> / night
        </span>
      </span>
    </>
  );
  return onSelect ? (
    <button
      className="stay-result-card"
      type="button"
      aria-pressed={selected}
      onClick={() => onSelect(stay.id)}
    >
      {content}
    </button>
  ) : (
    <article className="stay-result-card">{content}</article>
  );
}
export function StaySelectionCard({
  stay,
  distance,
  landmark,
  index = 0,
  total = 1,
  saved = false,
  onPrevious,
  onNext,
  onSave,
  onDetails,
}: {
  stay: Stay;
  distance: number;
  landmark: string;
  index?: number;
  total?: number;
  saved?: boolean;
  onPrevious?: () => void;
  onNext?: () => void;
  onSave?: () => void;
  onDetails?: () => void;
}) {
  return (
    <article
      className="stay-selection"
      aria-label={`Selected stay: ${stay.name}`}
    >
      <div className="stay-selection-main">
        <StayIllustration color={stay.color} />
        <div>
          <p className="stay-eyebrow">
            {stay.stars}-star stay · {distanceLabel(distance)} from {landmark}
          </p>
          <h3>{stay.name}</h3>
          <p className="stay-selection-amenities">
            {stay.amenities.join(" · ")}
          </p>
          <p>
            <strong>{pounds(stay.nightly)}</strong>
            <span className="stay-muted"> / night</span>
          </p>
        </div>
      </div>
      <div className="stay-selection-actions">
        <div className="stay-pager">
          <IconButton
            type="tertiary"
            tapScale={1}
            size="sm"
            aria-label="Previous stay"
            disabled={total < 2 || !onPrevious}
            onClick={onPrevious}
            icon={<Icon name="chevron-left" size="sm" />}
          />
          <span>
            {index + 1} / {total}
          </span>
          <IconButton
            type="tertiary"
            tapScale={1}
            size="sm"
            aria-label="Next stay"
            disabled={total < 2 || !onNext}
            onClick={onNext}
            icon={<Icon name="chevron-right" size="sm" />}
          />
        </div>
        <div className="stay-action-row">
          {onSave && (
            <IconButton
              type="secondary"
              tapScale={1}
              aria-label={`${saved ? "Unsave" : "Save"} ${stay.name}`}
              aria-pressed={saved}
              onClick={onSave}
              icon={
                <Icon
                  name="star"
                  size="sm"
                  weight={saved ? "fill" : "regular"}
                />
              }
            />
          )}{" "}
          {onDetails && (
            <Button
              type="primary"
              tapScale={1}
              onClick={onDetails}
              trailingIcon={<Icon name="arrow-up-right" size="sm" />}
            >
              View rooms
            </Button>
          )}
        </div>
      </div>
    </article>
  );
}
