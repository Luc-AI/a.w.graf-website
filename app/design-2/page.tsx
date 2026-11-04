import type { Metadata, Viewport } from 'next';
import { Footer } from '@/components/design-2/Footer';
import { Hero } from '@/components/design-2/Hero';
import { Taetigkeit } from '@/components/design-2/Taetigkeit';
import { Team } from '@/components/design-2/Team';
import { UeberUns } from '@/components/design-2/UeberUns';
import { Werte } from '@/components/design-2/Werte';
import theme from '@/components/design-2/theme.module.css';
import { contactDetails, designTwo, site } from '@/content';

export const metadata: Metadata = {
  title: site.title,
  description: designTwo.description,
  openGraph: {
    title: site.title,
    description: designTwo.description,
    locale: 'de_CH',
    type: 'website',
    images: [{ url: '/images/hero-illnau-1200.jpg', width: 1200, height: 900 }],
  },
};

/* The page opens on the dark hero. */
export const viewport: Viewport = {
  themeColor: '#171715',
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
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

export default function DesignTwoPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Hero />
      <main>
        <div className={theme.wrap}>
          <UeberUns />
          <Taetigkeit />
          <Werte />
        </div>
        <Team />
      </main>
      <Footer />
    </>
  );
}
