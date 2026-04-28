import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import CookieConsent from "@/components/CookieConsent";
import { ToastViewport } from "@/components/ui/toast";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim()?.replace(/\/$/, '') || 'https://3rdparkhospital.com';

export const metadata: Metadata = {
  title: {
    default: "3rd Park Hospital HR",
    template: "%s | 3rd Park Hospital HR",
  },
  description: "3rd Park Hospital — internal HR & payroll. Improving the quality of your life through better health.",
  keywords: "3rd Park Hospital, HRIS, Nairobi, healthcare, HR, payroll, Kenya",
  authors: [{ name: "3rd Park Hospital" }],
  creator: "3rd Park Hospital",
  publisher: "3rd Park Hospital",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(siteUrl),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: "3rd Park Hospital HR",
    description: "3rd Park Hospital — internal HR & payroll.",
    url: '/',
    siteName: '3rd Park Hospital HR',
    images: [
      {
        url: '/og-image.svg',
        width: 1200,
        height: 630,
        alt: '3rd Park Hospital',
      },
    ],
    locale: 'en_KE',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "3rd Park Hospital HR",
    description: "3rd Park Hospital — internal HR & payroll.",
    images: ['/og-image.svg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google:
      process.env.GOOGLE_SITE_VERIFICATION?.trim() ||
      'DUsQ5vrza5zxhMwhGNFVVkzCxPU-Pon8Ybj8fh28uoY',
  },
  icons: {
    icon: [
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/brand/3rd-park-logo.webp', sizes: 'any', type: 'image/webp' },
    ],
    shortcut: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/site.webmanifest',
  other: {
    'og:image:width': '1200',
    'og:image:height': '630',
    'og:image:type': 'image/webp',
    'twitter:image:alt': '3rd Park Hospital',
  },
};

const jsonLd = (siteUrl: string) => ({
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      '@id': `${siteUrl}/#organization`,
      name: '3rd Park Hospital',
      url: 'https://3rdparkhospital.com',
      logo: { '@type': 'ImageObject', url: `${siteUrl}/brand/3rd-park-logo.webp` },
      contactPoint: {
        '@type': 'ContactPoint',
        telephone: '+254-730-819-900',
        contactType: 'customer service',
        email: 'info@3rdparkhospital.com',
        areaServed: 'KE',
      },
      sameAs: ['https://3rdparkhospital.com'],
    },
    {
      '@type': 'WebSite',
      '@id': `${siteUrl}/#website`,
      url: siteUrl,
      name: '3rd Park Hospital HR',
      description: '3rd Park Hospital — internal HR & payroll system.',
      publisher: { '@id': `${siteUrl}/#organization` },
      inLanguage: 'en-KE',
      potentialAction: {
        '@type': 'SearchAction',
        target: { '@type': 'EntryPoint', urlTemplate: `${siteUrl}/careers?keyword={search_term_string}` },
        'query-input': 'required name=search_term_string',
      },
    },
  ],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">
        {/* Google tag (gtag.js) */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=AW-18037337193"
          strategy="afterInteractive"
        />
        <Script id="google-ads-gtag" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'AW-18037337193');
          `}
        </Script>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd(siteUrl)) }}
        />
        {children}
        <ToastViewport />
        <CookieConsent />
      </body>
    </html>
  );
}
