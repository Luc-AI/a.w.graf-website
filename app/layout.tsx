import type { Metadata, Viewport } from 'next';
import type { ReactNode } from 'react';
import { contactDetails, site } from '@/content';
import { Footer } from '@/components/Footer';
import { Header } from '@/components/Header';
import { inter, newsreader } from './fonts';
import './globals.css';

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : 'http://localhost:3100');

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: site.title,
  description: site.description,
  openGraph: {
    title: site.title,
    description: site.description,
    locale: 'de_CH',
    type: 'website',
    images: [{ url: '/images/hero-illnau-1200.jpg', width: 1200, height: 900 }],
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#F6F3EC',
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  name: site.name,
  telephone: contactDetails.phoneInternational,
  foundingDate: site.foundingDate,
  address: {
    '@type': 'PostalAddress',
    streetAddress: contactDetails.street,
    postalCode: contactDetails.postalCode,
    addressLocality: contactDetails.locality,
    addressCountry: contactDetails.country,
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="de-CH" className={`${inter.variable} ${newsreader.variable}`}>
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
