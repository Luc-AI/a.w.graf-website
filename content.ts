/**
 * All site copy lives here (Swiss orthography: ss, no ß).
 * Square-bracket values are placeholders awaiting content from the client.
 */

export const site = {
  name: 'A.W. Graf AG',
  title: 'A.W. Graf AG · Immobilien in Illnau',
  description:
    'Die A.W. Graf AG bewirtschaftet und entwickelt ihren eigenen Immobilienbestand in Illnau, mit Sorgfalt und mit langfristiger Perspektive.',
  logoAlt: 'A.W. Graf AG – seit 1927',
  foundingDate: '1927',
};

export const contactDetails = {
  address: 'Im Riet 7, 8308 Illnau',
  street: 'Im Riet 7',
  postalCode: '8308',
  locality: 'Illnau',
  country: 'CH',
  phoneDisplay: '052 346 13 77',
  phoneHref: 'tel:+41523461377',
  phoneInternational: '+41 52 346 13 77',
  /** Replace with the real address and set `emailHref` to `mailto:…` once known. */
  email: '[Platzhalter]',
  emailHref: null as string | null,
};

export const nav = {
  label: 'Hauptnavigation',
  menuOpen: 'Menü',
  menuClose: 'Schliessen',
  home: { href: '/#top', label: 'A.W. Graf AG' },
  links: [
    { href: '/#ueber-uns', label: 'Über uns' },
    { href: '/#taetigkeit', label: 'Tätigkeit' },
    { href: '/#werte', label: 'Werte' },
    { href: '/#team', label: 'Team' },
    { href: '/#kontakt', label: 'Kontakt' },
  ],
};

export const hero = {
  title: 'Immobilien mit Bestand.',
  intro: site.description,
  cta: { href: '#kontakt', label: 'In Kontakt treten' },
  imageAlt: 'Illnau mit reformierter Kirche, Luftaufnahme',
};

export const ueberUns = {
  title: 'Ein Unternehmen aus Illnau.',
  paragraphs: [
    'Die A.W. Graf AG ist eigentümergeführt in der dritten Generation. Wir kümmern uns um unsere eigenen Liegenschaften: Wir vermieten sie, halten sie instand und entwickeln sie weiter.',
    'Wir arbeiten nicht im Auftrag Dritter. Was wir betreuen, gehört uns, und wir haben vor, es zu behalten.',
  ],
};

export const taetigkeit = {
  title: 'Was wir tun.',
  rows: [
    {
      label: 'Bewirtschaftung',
      text: 'Wir betreuen und bewirtschaften unsere Liegenschaften selbst. Die Nähe zum eigenen Bestand erlaubt uns, auf Anliegen unserer Mieterinnen und Mieter direkt einzugehen und Mietverhältnisse zu pflegen, die über Jahrzehnte bestehen.',
    },
    {
      label: 'Entwicklung',
      text: 'Für uns heisst Entwicklung das Bestehende sorgfältig weiterzuführen. Dabei stehen der Ort und seine Menschen im Mittelpunkt. Neue Vorhaben messen wir stets daran, wie sie Illnau als Wohn- und Arbeitsort stärken.',
    },
  ],
};

export const werte = {
  title: 'Wir denken in Generationen.',
  rows: [
    {
      label: 'Kontinuität',
      text: 'Als inhabergeführtes Unternehmen denken wir über die eigene Generation hinaus.',
    },
    {
      label: 'Werterhalt',
      text: 'Wir investieren dort, wo es die Lebensdauer eines Gebäudes verlängert. Verpflichtungen gehen wir nur ein, wenn wir sie aus eigener Kraft tragen können.',
    },
    {
      label: 'Verantwortung',
      text: 'Was wir bauen, prägt das Ortsbild über lange Zeit. Wir beziehen Nachbarschaft und Gemeinde deshalb früh ein und arbeiten mit Betrieben aus der Region.',
    },
  ],
};

export const team = {
  eyebrow: 'Eigentümergeführt seit Generationen',
  lead: 'Die A.W. Graf AG, geführt von [Vorname Name] und [Vorname Name], betreut ihre eigenen Liegenschaften in Illnau persönlich und ist für Mieter, Partner und Handwerker direkt erreichbar.',
  cta: { href: '#kontakt', label: 'Kontakt aufnehmen' },
  imageAlt: 'Team A.W. Graf AG',
};

export const kontakt = {
  title: 'A.W. Graf AG',
  intro: 'Für Anfragen erreichen Sie uns in Illnau.',
  labels: { address: 'Adresse', phone: 'Telefon', email: 'E-Mail' },
};

export const footer = {
  copyright: '© A.W. Graf AG · Immobilienbewirtschaftung und Entwicklung · Illnau',
  links: [
    { href: '/impressum', label: 'Impressum' },
    { href: '/datenschutz', label: 'Datenschutz' },
  ],
};

export const legalPages = {
  impressum: { title: 'Impressum', body: 'Inhalt folgt.' },
  datenschutz: { title: 'Datenschutz', body: 'Inhalt folgt.' },
};
