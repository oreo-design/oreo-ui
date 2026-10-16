import { useRef, useState } from "react";
import { Dialog } from "@base-ui-components/react/dialog";
import { Button, IconButton } from "@/components/button";
import { Chip, ChipGroup } from "@/components/chip";
import { Icon } from "@/components/icon";
import { OreoLogo } from "@/docs/OreoLogo";
import { AgentWorkspaceState } from "@/components/automation";
import {
  PlaceMap,
  MapStylePicker,
  type MapStyle,
  type PlaceResult,
} from "@/components/place-map";
import {
  StayPriceLabel,
  StayResultCard,
  StaySelectionCard,
  StayIllustration,
  filterStays,
  distanceKm,
  distanceLabel,
  pounds,
  stayTotal,
  type Stay,
} from "@/components/stay-results";
import { LANDMARKS, STAYS } from "./data";
import "./landmark-stays.css";

/** Schematic original artwork. The river and landmark are contextual, not tile data. */
function ParisArtwork() {
  return (
    <g aria-hidden="true">
      <rect width="1000" height="560" fill="var(--map-block)" />
      <g transform="rotate(-12 500 280)">
        {Array.from({ length: 13 }, (_, i) => (
          <path
            key={`v${i}`}
            d={`M${i * 90 - 70} -200V800`}
            stroke="var(--map-road)"
            strokeWidth="10"
          />
        ))}
        {Array.from({ length: 9 }, (_, i) => (
          <path
            key={`h${i}`}
            d={`M-200 ${i * 80 - 50}H1200`}
            stroke="var(--map-road)"
            strokeWidth="10"
          />
        ))}
      </g>
      <path
        d="M-30 280C210 350 250 70 470 150S750 240 1040 40"
        fill="none"
        stroke="var(--map-road)"
        strokeWidth="72"
      />
      <path
        d="M-30 280C210 350 250 70 470 150S750 240 1040 40"
        fill="none"
        stroke="var(--map-water)"
        strokeWidth="50"
      />
      <path d="M365 234L416 217L490 366L430 390Z" fill="var(--map-park)" />
      <path d="M410 270L465 376" stroke="var(--map-road)" strokeWidth="5" />
      <path
        d="M340 193L370 150M590 235L600 168M816 163L798 116"
        stroke="var(--map-road)"
        strokeWidth="16"
      />
      <g fill="var(--map-tree)">
        {[
          [376, 247],
          [388, 274],
          [405, 305],
          [419, 333],
          [430, 359],
          [452, 344],
          [436, 316],
          [422, 289],
          [410, 261],
        ].map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r="8" />
        ))}
      </g>
      <g fill="var(--map-street-label)" fontSize="13" textAnchor="middle">
        <text x="550" y="110">
          LA SEINE
        </text>
        <text x="455" y="422">
          CHAMP DE MARS
        </text>
        <text x="168" y="80">
          PASSY
        </text>
        <text x="840" y="382">
          LES INVALIDES
        </text>
      </g>
    </g>
  );
}
export function LandmarkStaysPage() {
  const root = useRef<HTMLDivElement>(null),
    heading = useRef<HTMLHeadingElement>(null),
    lastTrigger = useRef<HTMLElement | null>(null),
    savedButton = useRef<HTMLButtonElement>(null);
  const [dark, setDark] = useState(false),
    [style, setStyle] = useState<MapStyle>("meadow");
  const [landmarkId, setLandmarkId] = useState("tower"),
    [selected, setSelected] = useState("atelier"),
    [query, setQuery] = useState("");
  const [budget, setBudget] = useState(false),
    [fourStars, setFourStars] = useState(false),
    [nearby, setNearby] = useState(false),
    [savedOnly, setSavedOnly] = useState(false),
    [sort, setSort] = useState<"distance" | "price">("distance");
  const [saved, setSaved] = useState<string[]>([]),
    [details, setDetails] = useState<Stay | null>(null),
    [nights, setNights] = useState(5),
    [notice, setNotice] = useState("");
  const landmark = LANDMARKS.find((item) => item.id === landmarkId)!;
  const stays = filterStays(STAYS, landmark, {
    query,
    budget,
    fourStars,
    nearby,
    savedOnly,
    saved,
    sort,
  });
  const current = stays.find((stay) => stay.id === selected) ?? stays[0],
    index = stays.findIndex((stay) => stay.id === current?.id);
  const places: PlaceResult[] = stays.map((stay) => ({
    id: stay.id,
    name: stay.name,
    category: "Stay",
    minutes: 0,
    rating: 0,
    address: "Paris",
    description: "Fictional hotel",
    amenities: [],
    point: stay.point,
    route: [],
  }));
  function reset() {
    setQuery("");
    setBudget(false);
    setFourStars(false);
    setNearby(false);
    setSavedOnly(false);
    setSort("distance");
  }
  function toggleSave(stay: Stay) {
    if (savedOnly && saved.includes(stay.id) && !details)
      savedButton.current?.focus();
    setSaved((items) =>
      items.includes(stay.id)
        ? items.filter((id) => id !== stay.id)
        : [...items, stay.id],
    );
    setNotice(
      `${stay.name} ${saved.includes(stay.id) ? "removed from" : "added to"} your shortlist.`,
    );
  }
  function openDetails(stay: Stay) {
    lastTrigger.current = document.activeElement as HTMLElement;
    setDetails(stay);
  }
  function download() {
    const payload = {
      demo: true,
      landmark: landmark.name,
      nights,
      guests: 2,
      currency: "GBP",
      distance: "Illustrative straight-line distance",
      stays: STAYS.filter((stay) => saved.includes(stay.id)).map((stay) => ({
        ...stay,
        total: stayTotal(stay, nights),
        distanceKm: Number(distanceKm(stay, landmark).toFixed(3)),
      })),
    };
    const url = URL.createObjectURL(
      new Blob([JSON.stringify(payload, null, 2)], {
        type: "application/json",
      }),
    );
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "landmark-stays-shortlist.json";
    anchor.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    setNotice(
      "Shortlist downloaded. These sample prices are not a booking quote.",
    );
  }
  return (
    <div ref={root} className={dark ? "theme-dark" : ""}>
      <div className="ls-root">
        <header className="ls-header">
          <a href="/stay-selection-card">
            <OreoLogo className="h-5 w-8" />
            <span className="stay-muted">/</span> Stays
          </a>
          <div className="stay-action-row">
            <Button
              render={<button type="button" ref={savedButton} />}
              type={savedOnly ? "secondary" : "tertiary"}
              tapScale={1}
              aria-pressed={savedOnly}
              onClick={() => setSavedOnly(!savedOnly)}
              leadingIcon={<Icon name="star" size="sm" />}
            >
              Saved ({saved.length})
            </Button>
            <IconButton
              type="tertiary"
              tapScale={1}
              aria-label={
                dark ? "Switch to light theme" : "Switch to dark theme"
              }
              onClick={() => setDark(!dark)}
              icon={<Icon name={dark ? "sun" : "moon"} />}
            />
          </div>
        </header>
        <main className="ls-main">
          <div className="ls-intro">
            <span className="ls-kicker">
              <Icon name="globe" size="sm" /> A stay closer to your plans
            </span>
            <h1 ref={heading} tabIndex={-1}>
              A little closer.
              <br />
              <span>A lot more Paris.</span>
            </h1>
            <p>Find a place near the things you came to see.</p>
          </div>
          <div className="ls-trip">
            <label>
              <span>Near</span>
              <select
                value={landmarkId}
                onChange={(e) => setLandmarkId(e.target.value)}
              >
                {LANDMARKS.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name}
                  </option>
                ))}
              </select>
            </label>
            <label>
              <span>Trip length</span>
              <select
                value={nights}
                onChange={(e) => setNights(Number(e.target.value))}
              >
                {[1, 3, 5, 7, 14].map((n) => (
                  <option key={n} value={n}>
                    {n} {n === 1 ? "night" : "nights"}
                  </option>
                ))}
              </select>
            </label>
            <label className="ls-search">
              <span>Find a stay</span>
              <div>
                <Icon name="search" size="sm" />
                <input
                  type="search"
                  aria-label="Search sample stays"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Name or amenity"
                  maxLength={100}
                />
              </div>
            </label>
          </div>
          <div className="ls-results-header">
            <div>
              <h2>
                {savedOnly ? "Your shortlist" : "Stays around " + landmark.name}
              </h2>
              <p role="status">
                {stays.length} sample stays · {nights}{" "}
                {nights === 1 ? "night" : "nights"} · 2 adults
              </p>
            </div>
            <label className="ls-sort">
              <span className="sr-only">Sort stays</span>
              <select
                aria-label="Sort stays"
                value={sort}
                onChange={(e) => setSort(e.target.value as typeof sort)}
              >
                <option value="distance">Closest first</option>
                <option value="price">Lowest price first</option>
              </select>
            </label>
          </div>
          <ChipGroup
            className="ls-filters"
            role="group"
            aria-label="Stay filters"
          >
            <Chip
              tapScale={1}
              selected={budget}
              onClick={() => setBudget(!budget)}
            >
              Under £150 / night
            </Chip>
            <Chip
              tapScale={1}
              selected={fourStars}
              onClick={() => setFourStars(!fourStars)}
            >
              4 stars +
            </Chip>
            <Chip
              tapScale={1}
              selected={nearby}
              onClick={() => setNearby(!nearby)}
            >
              Within 1 km
            </Chip>
            {(budget || fourStars || nearby || query || savedOnly) && (
              <Button type="tertiary" size="sm" tapScale={1} onClick={reset}>
                Clear filters
              </Button>
            )}
          </ChipGroup>
          {current ? (
            <>
              <div className="ls-map">
                <PlaceMap
                  places={places}
                  selectedId={current.id}
                  onSelect={(id) => setSelected(id)}
                  onPreview={setSelected}
                  origin={landmark.point}
                  originLabel={landmark.name}
                  label={`Sample stays near ${landmark.name}`}
                  artwork={<ParisArtwork />}
                  mapStyle={style}
                  toolbar={
                    <MapStylePicker value={style} onValueChange={setStyle} />
                  }
                  renderMarker={(place, active) => (
                    <StayPriceLabel
                      name={place.name}
                      nightly={
                        STAYS.find((stay) => stay.id === place.id)!.nightly
                      }
                      selected={active}
                    />
                  )}
                  getSelectionLabel={(place) => {
                    const stay = STAYS.find((item) => item.id === place.id)!;
                    return `${stay.name}, ${pounds(stay.nightly)} per night, ${distanceLabel(distanceKm(stay, landmark))} from ${landmark.name}, illustrative straight-line distance`;
                  }}
                  footer={
                    <StaySelectionCard
                      stay={current}
                      distance={distanceKm(current, landmark)}
                      landmark={landmark.name}
                      index={index}
                      total={stays.length}
                      onPrevious={() =>
                        setSelected(
                          stays[(index - 1 + stays.length) % stays.length].id,
                        )
                      }
                      onNext={() =>
                        setSelected(stays[(index + 1) % stays.length].id)
                      }
                      saved={saved.includes(current.id)}
                      onSave={() => toggleSave(current)}
                      onDetails={() => openDetails(current)}
                    />
                  }
                />
              </div>
              <div className="ls-strip-header">
                <h2>Take a closer look</h2>
                <span>Illustrative straight-line distances</span>
              </div>
              <div className="ls-strip" role="group" aria-label="Stay results">
                {stays.map((stay) => (
                  <StayResultCard
                    key={stay.id}
                    stay={stay}
                    distance={distanceKm(stay, landmark)}
                    selected={current.id === stay.id}
                    saved={saved.includes(stay.id)}
                    onSelect={setSelected}
                  />
                ))}
              </div>
            </>
          ) : (
            <div className="ls-empty">
              <AgentWorkspaceState
                title={
                  savedOnly && !saved.length
                    ? "Your shortlist starts here"
                    : "No stays match these filters"
                }
                description={
                  savedOnly && !saved.length
                    ? "Save a stay using the star on its detail card."
                    : "Try another name, a wider distance or a different budget."
                }
                actionLabel="Show all stays"
                onAction={reset}
              />
            </div>
          )}
          <div className="ls-export">
            <span role="status">
              {notice || "A few places worth keeping in mind."}
            </span>
            <Button
              type="secondary"
              tapScale={1}
              disabled={!saved.length}
              onClick={download}
              leadingIcon={<Icon name="arrow-down" size="sm" />}
            >
              Export shortlist ({saved.length})
            </Button>
          </div>
          <footer className="ls-footer">
            <p>
              Six fictional stays · Sample GBP prices · Local shortlist resets
              on reload.
              <br />
              Original illustrations. Distances are schematic, not walking
              routes. No reservations are made.
            </p>
            <a href="/stay-selection-card">Explore the components ↗</a>
          </footer>
        </main>
        <Dialog.Root
          open={!!details}
          onOpenChange={(open) => {
            if (!open) setDetails(null);
          }}
        >
          <Dialog.Portal container={root}>
            <Dialog.Backdrop className="ls-backdrop" />
            <Dialog.Popup
              className="ls-dialog"
              finalFocus={() =>
                lastTrigger.current?.isConnected
                  ? lastTrigger.current
                  : heading.current
              }
            >
              {details && (
                <>
                  <div className="ls-dialog-heading">
                    <div>
                      <p className="ls-kicker">Sample room</p>
                      <Dialog.Title>{details.name}</Dialog.Title>
                    </div>
                    <Dialog.Close
                      render={
                        <IconButton
                          type="tertiary"
                          tapScale={1}
                          aria-label="Close room details"
                          icon={<Icon name="x" />}
                        />
                      }
                    />
                  </div>
                  <Dialog.Description className="stay-muted">
                    A fictional double room for 2 adults. Add this stay to your
                    shortlist to compare it later.
                  </Dialog.Description>
                  <div className="ls-room-art">
                    <StayIllustration color={details.color} />
                  </div>
                  <div className="ls-room-info">
                    <span>{details.stars}-star category</span>
                    <span>{details.amenities.join(" · ")}</span>
                  </div>
                  <div className="ls-total">
                    <span>
                      {pounds(details.nightly)} × {nights}{" "}
                      {nights === 1 ? "night" : "nights"}
                    </span>
                    <strong>{pounds(stayTotal(details, nights))}</strong>
                  </div>
                  <p className="ls-disclaimer">
                    Illustrative room subtotal. Taxes, fees and availability are
                    not modelled. This demo cannot make a booking.
                  </p>
                  <Button
                    type="primary"
                    tapScale={1}
                    aria-pressed={saved.includes(details.id)}
                    onClick={() => toggleSave(details)}
                    leadingIcon={
                      <Icon
                        name={saved.includes(details.id) ? "check" : "star"}
                        size="sm"
                      />
                    }
                  >
                    {saved.includes(details.id)
                      ? "Remove from shortlist"
                      : "Save to shortlist"}
                  </Button>
                </>
              )}
            </Dialog.Popup>
          </Dialog.Portal>
        </Dialog.Root>
      </div>
    </div>
  );
}
