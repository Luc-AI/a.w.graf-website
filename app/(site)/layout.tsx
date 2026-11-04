import type { ReactNode } from 'react';
import { Footer } from '@/components/Footer';
import { Header } from '@/components/Header';
import { contactDetails, site } from '@/content';

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

export default function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <div className="site-shell">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Header />
      <main>{children}</main>
      <Footer />
    </div>
  );
}
