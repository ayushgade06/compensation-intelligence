export function normalizeCompanyName(
  name: string
) {
  return name
    .toLowerCase()

    .replace(
      /\b(inc|inc\.|llc|ltd|corp|corporation|co)\b/g,
      ""
    )

    .replace(
      /[^a-z0-9]/g,
      ""
    )

    .trim();
}

export function normalizeLocation(
  city: string,
  state?: string,
  country?: string
) {
  return [city, state, country]
    .filter(Boolean)
    .map((v : any) =>
      v!.toLowerCase().trim()
    )
    .join(",");
}