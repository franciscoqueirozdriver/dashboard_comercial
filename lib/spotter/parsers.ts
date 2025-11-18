export function parseCurrencyBRLToNumber(value: string | null | undefined): number | null {
  if (!value) {
    return null;
  }

  const clean = value
    .replace(/[R$\s]/g, '')
    .replace(/\./g, '')
    .replace(/,/g, '.')
    .trim();

  const parsed = Number.parseFloat(clean);
  return Number.isNaN(parsed) ? null : parsed;
}
