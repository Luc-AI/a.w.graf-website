import type { Metadata } from 'next';
import { LegalStub } from '@/components/LegalStub';
import { legalPages, site } from '@/content';

export const metadata: Metadata = {
  title: `${legalPages.impressum.title} · ${site.name}`,
};

export default function ImpressumPage() {
  return <LegalStub {...legalPages.impressum} />;
}
