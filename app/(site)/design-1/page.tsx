import { Divider } from '@/components/Divider';
import { Hero } from '@/components/Hero';
import { Kontakt } from '@/components/Kontakt';
import { Taetigkeit } from '@/components/Taetigkeit';
import { Team } from '@/components/Team';
import { UeberUns } from '@/components/UeberUns';
import { Werte } from '@/components/Werte';

export default function HomePage() {
  return (
    <>
      <Hero />
      <UeberUns />
      <Divider />
      <Taetigkeit />
      <Divider />
      <Werte />
      <Divider flush />
      <Team />
      <Kontakt />
    </>
  );
}
