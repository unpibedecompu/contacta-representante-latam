import raw from "@/data/representatives.json";
import type { Representative } from "./types";

/**
 * En producción sólo se sirven los representantes con `verified: true`.
 * En desarrollo se muestran todos, para poder probar la UI con los datos de ejemplo.
 */
const SHOW_UNVERIFIED = process.env.NODE_ENV !== "production";

const ALL = raw as Representative[];

export function getRepresentatives(): Representative[] {
  return SHOW_UNVERIFIED ? ALL : ALL.filter((r) => r.verified);
}

export function getByCountry(countryCode: string): Representative[] {
  const cc = countryCode.toUpperCase();
  return getRepresentatives().filter((r) => r.country === cc);
}

/** Lista ordenada de regiones (provincia/estado/…) con al menos un representante cargado. */
export function getRegions(countryCode: string): string[] {
  const set = new Set<string>();
  for (const r of getByCountry(countryCode)) {
    if (r.region) set.add(r.region);
  }
  return [...set].sort((a, b) => a.localeCompare(b, "es"));
}

/**
 * Representantes relevantes para un usuario de `countryCode` en `region`:
 * los de esa región + los de alcance nacional (region === null).
 */
export function getForUser(countryCode: string, region: string | null): Representative[] {
  return getByCountry(countryCode).filter(
    (r) => r.region === null || r.region === region,
  );
}

export function countByCountry(): Record<string, number> {
  const out: Record<string, number> = {};
  for (const r of getRepresentatives()) {
    out[r.country] = (out[r.country] ?? 0) + 1;
  }
  return out;
}
