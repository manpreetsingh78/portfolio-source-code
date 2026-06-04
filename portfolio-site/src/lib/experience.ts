// Single source of truth for "years of experience" used across the site.
// Career start: July 2022.
const CAREER_START = new Date(2022, 6, 1); // month is 0-indexed → July
const MS_PER_YEAR = 365.25 * 24 * 60 * 60 * 1000;

/**
 * Years of experience rounded to the nearest 0.5.
 * Used wherever we display the number (Hero, Experience stats, etc.).
 *
 * Examples (assuming start = Jul 2022):
 *   Jan 2025 → 2.5
 *   Jun 2026 → 4
 *   Dec 2026 → 4.5
 */
export function getYearsExperience(now: Date = new Date()): number {
  const diff = (now.getTime() - CAREER_START.getTime()) / MS_PER_YEAR;
  const rounded = Math.round(diff * 2) / 2;
  return Math.max(1, rounded);
}

/**
 * Pre-formatted string ("4" or "3.5") — strips the trailing .0 when whole.
 */
export function formatYearsExperience(now: Date = new Date()): string {
  const y = getYearsExperience(now);
  return Number.isInteger(y) ? y.toString() : y.toFixed(1);
}
