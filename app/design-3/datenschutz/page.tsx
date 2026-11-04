import type { Metadata } from 'next';
import { LegalPage } from '@/components/design-3/LegalPage';
import { legalPages, site } from '@/content';

export const metadata: Metadata = {
  title: `${legalPages.datenschutz.title} · ${site.name}`,
};

export default function DatenschutzPage() {
  return <LegalPage {...legalPages.datenschutz} />;
}
