export type Stay = {
  id: string;
  name: string;
  stars: number;
  nightly: number;
  point: { x: number; y: number };
  amenities: string[];
  color: "mint" | "orange" | "purple";
};
export type Landmark = {
  id: string;
  name: string;
  point: { x: number; y: number };
};
export type StayFilters = {
  query: string;
  budget: boolean;
  fourStars: boolean;
  nearby: boolean;
  savedOnly: boolean;
  saved: string[];
  sort: "distance" | "price";
};
/** Fixture scale: a 1000×560 scene represents 4×2.24 km. Not geographic navigation. */
export const distanceKm = (stay: Stay, landmark: Landmark) =>
  Math.hypot(
    (stay.point.x - landmark.point.x) * 0.04,
    (stay.point.y - landmark.point.y) * 0.0224,
  );
export const distanceLabel = (distance: number) =>
  distance < 1
    ? `${Math.round(distance * 1000)} m`
    : `${distance.toFixed(1)} km`;
export const pounds = (amount: number) =>
  new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
    maximumFractionDigits: 0,
  }).format(amount);
export function filterStays(
  stays: Stay[],
  landmark: Landmark,
  filters: StayFilters,
) {
  const query = filters.query.trim().toLowerCase();
  return stays
    .filter(
      (stay) =>
        (!query ||
          `${stay.name} ${stay.amenities.join(" ")}`
            .toLowerCase()
            .includes(query)) &&
        (!filters.budget || stay.nightly < 150) &&
        (!filters.fourStars || stay.stars >= 4) &&
        (!filters.nearby || distanceKm(stay, landmark) <= 1) &&
        (!filters.savedOnly || filters.saved.includes(stay.id)),
    )
    .sort(
      (a, b) =>
        (filters.sort === "price"
          ? a.nightly - b.nightly
          : distanceKm(a, landmark) - distanceKm(b, landmark)) ||
        a.name.localeCompare(b.name),
    );
}
export function stayTotal(stay: Stay, nights: number) {
  if (!Number.isInteger(nights) || nights < 1 || nights > 30)
    throw new RangeError("Choose 1–30 nights.");
  return stay.nightly * nights;
}
