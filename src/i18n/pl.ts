const LIVE = 'https://www.nuuvie.com';

export const pl = {
  locale: 'pl',
  meta: {
    title: 'Nuuvie Studio – Projektowanie UX/UI, Branding i Strony',
    description:
      'Projektuję produkty cyfrowe i marki, które budują zaufanie od pierwszego kontaktu. 15 lat doświadczenia w UX/UI i brandingu.',
  },
  nav: {
    work: 'Prace',
    services: 'Usługi',
    about: 'O Nuuvie',
    blog: 'Blog',
    contact: 'Kontakt',
    cta: 'Porozmawiajmy',
    menu: 'Menu',
    close: 'Zamknij',
  },
  hero: {
    meta: ['UX / UI', 'Branding', 'Strony internetowe'],
    scroll: 'Przewiń',
    services: [
      'Logo i identyfikacja wizualna',
      'Strony internetowe i UX / UI',
      'Grafika użytkowa i drukowana',
      'Strategia i planowanie',
    ],
    title: 'Projektuję produkty cyfrowe i marki, które budują zaufanie od pierwszego kontaktu.',
    subs: [
      '15 lat doświadczenia w UX/UI i brandingu dla liderów rynku.',
      'Twoja wizja przełożona na język korzyści i intuicyjny design.',
    ],
    cta: 'Porozmawiajmy o Twoim projekcie',
    portraitAlt: 'Daniel Troć, założyciel Nuuvie',
  },
  clients: {
    label: 'Partnerzy & klienci',
    text: 'Projektowałem dla globalnych marek i lokalnych liderów:',
  },
  manifesto: {
    label: 'Dlaczego to robię?',
    lead: 'Design to narzędzie, które eliminuje domysły Twoich klientów.',
    body: 'Moim zadaniem jest sprawić, by Twoja marka mówiła to, co najważniejsze, zanim użytkownik przeczyta pierwsze słowo.',
    author: 'Daniel Troć',
    role: 'Założyciel Nuuvie',
  },
  work: {
    label: 'Wybrane projekty',
    title: 'Wybrane projekty',
    cursor: 'Zobacz',
    items: [
      {
        name: 'Tedee',
        kicker: 'Inteligentne zamki i rozwiązania smart home',
        desc: 'Design, który łączy świat fizyczny i cyfrowy.',
        tags: ['UX / UI', 'Aplikacja', 'Strona', 'Opakowania'],
        img: '/img/work/tedee.jpg',
        href: `${LIVE}/work/tedee`,
      },
      {
        name: 'Old Craft Barbershop',
        kicker: 'Studio barberskie z charakterem',
        desc: 'Nowe logo. Nowa energia. Ten sam charakter.',
        tags: ['Logo', 'Identyfikacja', 'Druk'],
        img: '/img/work/oldcraft.jpg',
        href: `${LIVE}/work/old-craft-barbershop`,
      },
      {
        name: 'Netwise',
        kicker: 'Implementacja rozwiązań biznesowych',
        desc: 'Redesign, który przybliżył markę do ludzi.',
        tags: ['Strona', 'Redesign', 'Social media'],
        img: '/img/work/netwise.jpg',
        href: `${LIVE}/work/netwise`,
      },
    ],
  },
  services: {
    label: 'Usługi',
    title: 'Co zrobię dla Twojego biznesu?',
    cta: 'Porozmawiajmy o Twoim projekcie',
    items: [
      {
        title: 'Logo i branding',
        body: 'Masz pomysł na markę? Nadam jej kształt i charakter, który buduje lojalność klientów. Moje wsparcie obejmuje pełen proces projektowy: od logo i identyfikacji wizualnej, aż po przygotowanie kompletnego brandbooka. Tworzę rozwiązania spójne i świadomie dopasowane do Twoich potrzeb.',
      },
      {
        title: 'Strony, aplikacje i UX / UI design',
        body: 'Tworzysz cyfrowy produkt, aplikację, oprogramowanie lub usługę SaaS? Zaprojektuję dla Ciebie intuicyjny interfejs i estetyczne doświadczenie użytkownika. UX i UI to moja specjalność.',
      },
      {
        title: 'Grafika',
        body: 'Pomogę Ci zaistnieć w sieci. Projektuję strony, kampanie i materiały do social mediów, które zapadają w pamięć.',
      },
      {
        title: 'Strategia, rozwój i audyty',
        body: 'Nie tylko projektuję, ale analizuję i układam strategię wizualną, która sprawi, że Twoja marka stanie się rozpoznawalna i skutecznie realizuje założone cele biznesowe.',
      },
      {
        title: 'Wsparcie Twojego teamu',
        body: 'Zewnętrzne wsparcie na poziomie Senior Designera. Dołączam do Twojego zespołu na dowolnym etapie prac, zapewniając eksperckie spojrzenie podczas sprintów projektowych lub kompleksowych wdrożeń. To bezpieczny sposób na skalowanie produktu bez konieczności prowadzenia długotrwałej rekrutacji.',
      },
    ],
  },
  stats: [
    { value: 11, suffix: '', unit: 'krajów', text: 'Współpraca międzynarodowa.' },
    { value: 15, suffix: '', unit: 'lat', text: 'Doświadczenia, które oszczędzi Ci błędów.' },
    { value: 2540, suffix: '+', unit: 'projektów', text: 'Pewność, że Twój jest w dobrych rękach.' },
  ],
  testimonials: {
    label: 'Wybierają nas',
    title: ['CEO, founderzy', 'i osoby kształtujące rozwój produktów oraz marek.'],
    items: [
      {
        quote: 'Szybki start, świetnie złapany kontekst i projekty dokładnie takie, jakich potrzebowaliśmy.',
        name: 'Iza Chaber-Lipecka',
        company: 'Netwise',
        img: '/img/t-iza.jpg',
      },
      {
        quote: 'Polecam każdemu, kto stawia na jakość i dobre tempo.',
        name: 'Anna Świderska',
        company: 'AMS',
        img: '/img/t-anna.webp',
      },
      {
        quote:
          'Współpracowaliśmy przy tworzeniu materiałów graficznych dla mojego barbershopu – od logo i billboardu po wizytówki. Cały proces przebiegł sprawnie, a Nuuvie doskonale przełożyło moją wizję na nowoczesne i skuteczne materiały.',
        name: 'Michał',
        company: 'Old Craft Barbershop',
        img: '/img/t-michal.jpg',
      },
    ],
  },
  blog: {
    label: 'Blog Nuuvie',
    title: 'Piszemy o designie',
    cta: 'Przejdź do bloga',
    href: `${LIVE}/blog`,
    read: 'Czytaj',
    posts: [
      {
        date: '2026-11-05',
        title: 'Rebranding identyfikacji wizualnej: case study Old Craft Barbershop Lublin',
        img: '/img/blog/oldcraft.jpg',
        href: `${LIVE}/blog-posts/rebranding-identyfikacji-wizualnej-case-study-old-craft-barbershop-lublin`,
      },
      {
        date: '2026-05-19',
        title: 'Human touch w designie: dlaczego marki w 2026 roku uciekają od perfekcji',
        img: '/img/blog/human-touch.jpg',
        href: `${LIVE}/blog-posts/human-touch-w-designie-dlaczego-marki-w-2026-roku-uciekaja-od-perfekcji`,
      },
      {
        date: '2026-05-01',
        title: 'Dlaczego słaby brand kosztuje Cię więcej niż myślisz?',
        img: '/img/blog/slaby-brand.jpg',
        href: `${LIVE}/blog-posts/dlaczego-slaby-brand-kosztuje-cie-wiecej-niz-myslisz`,
      },
      {
        date: '2026-04-20',
        title: 'Audyt UX strony internetowej – zrób to sam lub zleć profesjonalistom',
        img: '/img/blog/audyt-ux.jpg',
        href: `${LIVE}/blog-posts/audyt-ux-strony-internetowej-zrob-to-sam-lub-zlec-profesjonalistom`,
      },
      {
        date: '2026-04-20',
        title: 'Jak wybrać UX/UI designera?',
        img: '/img/blog/jak-wybrac.jpg',
        href: `${LIVE}/blog-posts/jak-wybrac-ux-ui-designera`,
      },
      {
        date: '2026-04-09',
        title: 'Ile kosztuje strona internetowa w 2026 roku?',
        img: '/img/blog/ile-kosztuje.jpg',
        href: `${LIVE}/blog-posts/ile-kosztuje-strona-internetowa-w-2026-roku`,
      },
    ],
  },
  contact: {
    label: 'Kontakt',
    title: ['Czas na', 'Twój ruch.'],
    writeLabel: 'Napisz klasycznie',
    email: 'hej@nuuvie.com',
    bookLabel: 'Albo porozmawiajmy',
    bookText: 'Wybierz termin bezpłatnej, 15-minutowej konsultacji.',
    bookCta: 'Umów rozmowę',
    bookHref: `${LIVE}/spotkanie`,
  },
  footer: {
    tagline: 'Studio projektowe. UX/UI, branding i strony internetowe.',
    navLabel: 'Nawigacja',
    socialLabel: 'Social media',
    legalLabel: 'Informacje',
    designerZone: { label: 'Strefa Designera', href: `${LIVE}/strefa-designera` },
    legal: [
      { label: 'Regulamin', href: `${LIVE}/legal/regulamin` },
      { label: 'Polityka prywatności', href: `${LIVE}/legal/polityka-prywatnosci` },
    ],
    rights: 'Wszelkie prawa zastrzeżone.',
    top: 'Do góry',
  },
};

export type Dict = typeof pl;
