/**
 * Kenyan payroll statutory calculations (2024/2026).
 * PAYE, NSSF, SHIF - auto-calculated but overridable by user.
 * Note: The nhif field stores SHIF (2.75% of gross) - Kenya migrated from NHIF to SHIF.
 */

// PAYE brackets (monthly, KES) - Kenya 2024/2026
const PAYE_BRACKETS = [
  { max: 24_000, rate: 0.1 },
  { max: 32_333, rate: 0.25 },
  { max: 500_000, rate: 0.3 },
  { max: 800_000, rate: 0.325 },
  { max: Infinity, rate: 0.35 },
];
const PERSONAL_RELIEF = 2_400;

// NSSF 2024/2026: Tier I = 6% of first 9k (max 540), Tier II = 6% of next 99k (max 5940), pensionable cap 108k
function calcNSSF(grossPay: number): number {
  const pensionable = Math.min(grossPay, 108_000);
  const tierI = Math.min(pensionable, 9_000) * 0.06;
  const tierII = Math.max(0, Math.min(pensionable - 9_000, 99_000)) * 0.06;
  return Math.round(tierI + tierII);
}

// SHIF (Social Health Insurance Fund) - 2.75% of gross, replaces NHIF
function calcSHIF(grossPay: number): number {
  return Math.round(grossPay * 0.0275);
}

function calcPAYE(grossPay: number, nssf: number, shif: number): number {
  const taxableIncome = Math.max(0, grossPay - nssf - shif);
  let paye = 0;
  let remaining = taxableIncome;
  let prevMax = 0;

  for (const bracket of PAYE_BRACKETS) {
    if (remaining <= 0) break;
    const band = Math.min(remaining, bracket.max - prevMax);
    if (band > 0) paye += band * bracket.rate;
    remaining -= band;
    prevMax = bracket.max;
  }

  return Math.max(0, Math.round(paye - PERSONAL_RELIEF));
}

export interface StatutoryResult {
  grossPay: number;
  paye: number;
  nssf: number;
  nhif: number;
  netPay: number;
}

export function calculateStatutory(
  grossPay: number,
  otherDeductionsTotal: number = 0
): StatutoryResult {
  const nssf = calcNSSF(grossPay);
  const shif = calcSHIF(grossPay);
  const paye = calcPAYE(grossPay, nssf, shif);
  const netPay = grossPay - paye - nssf - shif - otherDeductionsTotal;
  return { grossPay, paye, nssf, nhif: shif, netPay };
}
