/**
 * Starting content of the home page. It is seeded into Sanity once (studio/scripts/seed-pages.ts)
 * and from then on edited there; the site only uses this file if Sanity is unavailable.
 * Images use `_upload` (a /public path or URL) until they are uploaded to Sanity.
 */
const BOOK = 'https://cal.com/nuuvie/15-minutowa-konsultacja';

export const homeContent = {
  pl: {
    seo: {
      title: 'Nuuvie Studio – Projektowanie UX/UI, Branding i Strony',
      description: 'Projektuję marki i produkty cyfrowe, które budują zaufanie od pierwszego kontaktu. 15 lat doświadczenia w UX/UI i brandingu.',
    },
    hero: {
      title: 'Projektuję marki i produkty, którym się ufa.',
      text: '15 lat w UX/UI i brandingu. Pomagam firmom wyglądać tak dobrze, jak działają.',
      primary: { label: 'Porozmawiajmy o projekcie', href: BOOK },
      secondary: { label: 'Zobacz prace', href: '#work' },
    },
    statement: {
      lead: 'Design to narzędzie, które eliminuje domysły Twoich klientów.',
      rest: 'Moim zadaniem jest sprawić, by Twoja marka mówiła to, co najważniejsze, zanim użytkownik przeczyta pierwsze słowo.',
    },
    figures: [
      { title: '15 lat doświadczenia', text: 'Doświadczenia, które oszczędzi Ci błędów.' },
      { title: '11 krajów', text: 'Współpraca międzynarodowa.' },
      { title: '2540+ projektów', text: 'Pewność, że Twój jest w dobrych rękach.' },
    ],
    work: { title: 'Wybrane projekty', text: 'Marki i produkty, które zaprojektowałem od podstaw: od identyfikacji po aplikacje.', linkLabel: 'Zobacz projekt' },
    services: {
      title: 'Co zrobię dla Twojego biznesu',
      text: 'Pełen proces projektowy, od pierwszego szkicu po wdrożenie.',
      linkLabel: 'Porozmawiajmy',
      items: [
        { title: 'Logo i branding', body: 'Identyfikacja, która buduje rozpoznawalność. Od logo po kompletny brandbook.' },
        { title: 'Strony, aplikacje i UX/UI', body: 'Intuicyjne interfejsy dla produktów cyfrowych, aplikacji i SaaS.' },
        { title: 'Grafika', body: 'Kampanie i materiały do social mediów, które zapadają w pamięć.' },
        { title: 'Strategia i audyty', body: 'Analiza i strategia wizualna, która realizuje cele biznesowe.' },
        { title: 'Wsparcie Twojego zespołu', body: 'Senior designer w Twoim teamie, bez długiej rekrutacji.' },
      ],
    },
    testimonials: {
      title: 'Zaufali mi CEO i founderzy',
      items: [
        { quote: 'Szybki start, świetnie złapany kontekst i projekty dokładnie takie, jakich potrzebowaliśmy.', name: 'Iza Chaber-Lipecka', company: 'Netwise', photo: { _upload: '/img/t-iza.jpg', alt: 'Iza Chaber-Lipecka' } },
        { quote: 'Polecam każdemu, kto stawia na jakość i dobre tempo.', name: 'Anna Świderska', company: 'AMS', photo: { _upload: '/img/t-anna.webp', alt: 'Anna Świderska' } },
        {
          quote: 'Współpracowaliśmy przy tworzeniu materiałów graficznych dla mojego barbershopu – od logo i billboardu po wizytówki. Cały proces przebiegł sprawnie, a Nuuvie doskonale przełożyło moją wizję na nowoczesne i skuteczne materiały.',
          name: 'Michał',
          company: 'Old Craft Barbershop',
          photo: { _upload: '/img/t-michal.jpg', alt: 'Michał, Old Craft Barbershop' },
        },
      ],
    },
    paths: {
      title: 'Jak mogę Ci pomóc?',
      text: 'Projektuję dla firm i pomagam rosnąć designerom. Wybierz ścieżkę, która jest Twoja.',
      business: { title: 'Dla biznesu', text: 'Logo, identyfikacja, strony i aplikacje. Zaczynamy od bezpłatnej, 15-minutowej rozmowy.', cta: { label: 'Porozmawiajmy o projekcie', href: BOOK } },
      designer: { title: 'Dla designerów', text: 'Przegląd portfolio, plan rozwoju i feedback do projektów. Konsultacja 1:1, 90 minut.', cta: { label: 'Strefa Designera', href: '/strefa-designera' } },
    },
    blog: { title: 'Piszę o designie', linkLabel: 'Wszystkie wpisy' },
    contact: { title: 'Czas na Twój ruch.', text: 'Napisz albo umów bezpłatną, 15-minutową rozmowę.', ctaLabel: 'Umów rozmowę' },
  },

  en: {
    seo: {
      title: 'Nuuvie Studio – UX/UI Design, Branding & Websites',
      description: 'I design brands and digital products that build trust from the very first contact. 15 years of experience in UX/UI and branding.',
    },
    hero: {
      title: 'I design brands and products people trust.',
      text: '15 years in UX/UI and branding. I help companies look as good as they work.',
      primary: { label: "Let's talk about your project", href: BOOK },
      secondary: { label: 'See the work', href: '#work' },
    },
    statement: {
      lead: "Design is a tool that removes your customers' guesswork.",
      rest: 'My job is to make your brand say what matters most before the user reads a single word.',
    },
    figures: [
      { title: '15 years of experience', text: 'Experience that will save you from mistakes.' },
      { title: '11 countries', text: 'International collaboration.' },
      { title: '2540+ projects', text: 'Confidence that yours is in good hands.' },
    ],
    work: { title: 'Selected work', text: 'Brands and products I designed from the ground up: from identity to apps.', linkLabel: 'View project' },
    services: {
      title: 'What I can do for your business',
      text: 'The full design process, from the first sketch to launch.',
      linkLabel: "Let's talk",
      items: [
        { title: 'Logo & branding', body: 'An identity that builds recognition. From the logo to a complete brand book.' },
        { title: 'Websites, apps & UX/UI', body: 'Intuitive interfaces for digital products, apps and SaaS.' },
        { title: 'Graphic design', body: 'Campaigns and social media assets people remember.' },
        { title: 'Strategy & audits', body: 'Analysis and visual strategy that delivers on business goals.' },
        { title: 'Support for your team', body: 'A senior designer in your team, without a long hiring process.' },
      ],
    },
    testimonials: {
      title: 'Trusted by CEOs and founders',
      items: [
        { quote: 'A fast start, context grasped brilliantly, and designs that were exactly what we needed.', name: 'Iza Chaber-Lipecka', company: 'Netwise', photo: { _upload: '/img/t-iza.jpg', alt: 'Iza Chaber-Lipecka' } },
        { quote: 'I recommend Nuuvie to anyone who values quality and a good pace.', name: 'Anna Świderska', company: 'AMS', photo: { _upload: '/img/t-anna.webp', alt: 'Anna Świderska' } },
        {
          quote: 'We worked together on the graphic materials for my barbershop – from the logo and a billboard to business cards. The whole process went smoothly, and Nuuvie translated my vision perfectly into modern, effective materials.',
          name: 'Michał',
          company: 'Old Craft Barbershop',
          photo: { _upload: '/img/t-michal.jpg', alt: 'Michał, Old Craft Barbershop' },
        },
      ],
    },
    paths: {
      title: 'How can I help?',
      text: 'I design for companies and help designers grow. Pick the path that fits you.',
      business: { title: 'For businesses', text: 'Logos, identities, websites and apps. We start with a free 15-minute call.', cta: { label: "Let's talk about your project", href: BOOK } },
      designer: { title: 'For designers', text: 'Portfolio review, a growth plan and feedback on your work. A 90-minute 1:1 session.', cta: { label: 'Designer Zone', href: '/en/strefa-designera' } },
    },
    blog: { title: 'Writing about design', linkLabel: 'All posts' },
    contact: { title: 'Your move.', text: 'Write to me or book a free 15-minute call.', ctaLabel: 'Book a call' },
  },
};

export type HomeContent = (typeof homeContent)['pl'];
