import type { Metadata } from 'next';
import { LegalPage } from '@/components/design-2/LegalPage';
import { legalPages, site } from '@/content';

export const metadata: Metadata = {
  title: `${legalPages.impressum.title} · ${site.name}`,
};

export default function ImpressumPage() {
  return <LegalPage {...legalPages.impressum} />;
}
