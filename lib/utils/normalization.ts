export function normalizeCompanyName(
  name: string
) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "")
    .trim();
}

export function normalizeLocation(
  city: string,
  state?: string,
  country?: string
) {
  return [city, state, country]
    .filter(Boolean)
    .map((v) =>
      v!.toLowerCase().trim()
    )
    .join(",");
}