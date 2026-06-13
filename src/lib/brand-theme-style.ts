import type { CSSProperties } from 'react';
import { buildBrandThemeCssVars } from '@/lib/brand-theme';
import type { PublicBrand } from '@/lib/brand';

export function brandThemeStyle(brand: PublicBrand): CSSProperties {
  return buildBrandThemeCssVars(brand.primaryColor, brand.secondaryColor) as CSSProperties;
}
