import type { Metadata } from 'next';
import { LegalStub } from '@/components/LegalStub';
import { legalPages, site } from '@/content';

export const metadata: Metadata = {
  title: `${legalPages.datenschutz.title} · ${site.name}`,
};

export default function DatenschutzPage() {
  return <LegalStub {...legalPages.datenschutz} />;
}
