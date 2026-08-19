export function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(' ');
}

export function pad(value: number) {
  return String(value).padStart(2, '0');
}

export function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}
