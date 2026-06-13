import { brand, getPublicBrand, type PublicBrand } from '@/lib/brand';
import { DEFAULT_BRAND_LOGO_SRC, isLegacyPlatformLogo, normalizeLogoSrc } from '@/lib/brand-constants';
import {
  DEFAULT_PRIMARY_COLOR,
  DEFAULT_SECONDARY_COLOR,
  sanitizeHexColor,
} from '@/lib/brand-theme';
import type { CompanySetupSettings } from '@/lib/company-setup';

function pickString(dbValue: string | undefined, envValue: string): string {
  return dbValue?.trim() ? dbValue.trim() : envValue;
}

/** Merge DB company setup branding over env defaults (empty DB fields inherit env). */
export function resolvePublicBrand(setup: CompanySetupSettings): PublicBrand {
  const env = getPublicBrand();
  return {
    orgName: pickString(setup.orgName, env.orgName),
    appName: pickString(setup.appName, env.appName),
    tagline: pickString(setup.tagline, env.tagline),
    contactEmail: pickString(setup.contactEmail, env.contactEmail),
    contactPhone: pickString(setup.contactPhone, env.contactPhone),
    contactAddress: pickString(setup.contactAddress, env.contactAddress),
    logoSrc: normalizeLogoSrc(pickString(setup.logoSrc, env.logoSrc)),
    logoPngPath: normalizeLogoSrc(pickString(setup.logoPngPath, env.logoPngPath || env.logoSrc)),
    wordmark: pickString(setup.wordmark, env.wordmark),
    faviconSrc: normalizeLogoSrc(
      pickString(setup.faviconSrc, setup.logoSrc?.trim() || env.logoSrc),
    ),
    primaryColor: sanitizeHexColor(setup.primaryColor, DEFAULT_PRIMARY_COLOR),
    secondaryColor: sanitizeHexColor(setup.secondaryColor, DEFAULT_SECONDARY_COLOR),
    privacyPolicyUrl: setup.privacyPolicyUrl?.trim() || '/privacy',
    termsUrl: setup.termsUrl?.trim() || '/terms',
    supportUrl: setup.supportUrl?.trim() || '',
    emailFromName: pickString(setup.emailFromName, brand.appName ? `${brand.appName} HR` : 'HRIS HR'),
    careersEmployerName: pickString(setup.careersEmployerName, env.orgName),
    careersTagline: pickString(setup.careersTagline, env.tagline),
    careersHeroImageUrl: pickString(setup.careersHeroImageUrl, ''),
    essPortalTitle: pickString(setup.essPortalTitle, 'Employee Self Service'),
    staffPortalTitle: pickString(setup.staffPortalTitle, ''),
    payslipLegalName: pickString(setup.payslipLegalName, env.orgName),
    documentFooterText: setup.documentFooterText?.trim() || '',
    publicFooterText: pickString(setup.publicFooterText, env.publicFooterText),
    defaultLandingPath: setup.defaultLandingPath?.trim() || '/dashboard',
    dashboardBannerEnabled: Boolean(setup.dashboardBannerEnabled),
    dashboardBannerText: setup.dashboardBannerText?.trim() || '',
    dashboardBannerTone: setup.dashboardBannerTone === 'warning' || setup.dashboardBannerTone === 'success'
      ? setup.dashboardBannerTone
      : 'info',
    dashboardTableZebraStriping: Boolean(setup.dashboardTableZebraStriping),
    hidePoweredBy: Boolean(setup.hidePoweredBy),
  };
}

export function isCustomLogo(logoSrc: string): boolean {
  const t = logoSrc.trim();
  return Boolean(
    t &&
      t !== DEFAULT_BRAND_LOGO_SRC &&
      !isLegacyPlatformLogo(t) &&
      !t.endsWith('platform-logo.png'),
  );
}
