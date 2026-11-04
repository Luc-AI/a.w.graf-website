import { Header } from '@/components/design-3/Header';
import { Hero } from '@/components/design-3/Hero';
import { Kontakt } from '@/components/design-3/Kontakt';
import { Taetigkeit } from '@/components/design-3/Taetigkeit';
import { Team } from '@/components/design-3/Team';
import { UeberUns } from '@/components/design-3/UeberUns';
import { Werte } from '@/components/design-3/Werte';
import { contactDetails, site } from '@/content';

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

export default function DesignThreePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Header />
      <main>
        <Hero />
        <UeberUns />
        <Taetigkeit />
        <Werte />
        <Team />
      </main>
      <Kontakt />
    </>
  );
}
