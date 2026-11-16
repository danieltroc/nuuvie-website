/**
 * Starting content of the About page (/o-nuuvie). Seeded into Sanity once and edited there.
 * Based on the live Webflow page; sections marked NEW were added (process, principles, facts values)
 * and should be reviewed. English is a new translation.
 */
const BOOK = 'https://cal.com/nuuvie/15-minutowa-konsultacja';
const CDN = 'https://cdn.prod.website-files.com/68ab2937a45826faf83c976e';
const IMG = {
  relation: `${CDN}/69d607cbcb6b50a0baaabf8e_relacja1-1.jpg`,
  project: `${CDN}/69d607cb9bce39c4be1121d0_dobry-projekt.jpg`,
  process: `${CDN}/69d607cbdbb4267e339c8b06_PRoces.jpg`,
  portrait: `${CDN}/69d4d0c2eb01188492ba9327_Daniel-hero.jpg`,
};

export const aboutContent = {
  pl: {
    seo: {
      title: 'O Nuuvie – studio projektowe Daniela Trocia',
      description: 'Nuuvie to studio, w którym design bierze odpowiedzialność za biznes. 15 lat doświadczenia w UX/UI i brandingu, współpraca 1:1.',
    },
    hero: {
      title: 'Nuuvie to studio, w którym design bierze odpowiedzialność za biznes.',
      text: 'W Nuuvie łączę doświadczenie w tworzeniu rozbudowanych systemów z elastycznością małego studia. Dostarczam przemyślane projekty, które pracują na sukces Twojej firmy.',
      primary: { label: 'Porozmawiajmy', href: BOOK },
      secondary: { label: 'Zobacz ofertę dla marek', href: '/#services' },
    },
    facts: [
      { label: 'Siedziba', value: 'Lublin' },
      { label: 'Współpraca', value: 'Zdalnie, z klientami z 11 krajów' },
      { label: 'Doświadczenie', value: '15 lat w UX/UI i brandingu' },
      { label: 'Styl', value: 'Prosto, konkretnie, bez szumu' },
    ],
    why: {
      title: 'Dlaczego Nuuvie?',
      items: [
        { title: 'Relacja 1:1', body: 'Od pierwszej rozmowy do finalnego projektu współpracujesz bezpośrednio ze mną. To gwarancja spójności i braku szumów komunikacyjnych.', image: { _upload: IMG.relation, alt: 'Ilustracja: dwa dymki rozmowy' } },
        { title: 'Dobry projekt', body: 'Dobry projekt to najkrótsza droga do zdobycia zaufania Klienta. Tworzę interfejsy i marki, które eliminują przypadkowość i niespójność. Projektuję tak, aby każde kliknięcie utwierdzało Twojego użytkownika w przekonaniu, że trafił pod właściwy adres.', image: { _upload: IMG.project, alt: 'Ilustracja: dobry projekt' } },
        { title: 'Sprawdzony proces', body: 'Korzystam z procesów wypracowanych przy ponad 2500 projektach dla klientów z 11 krajów.', image: { _upload: IMG.process, alt: 'Ilustracja: proces projektowy' } },
      ],
    },
    story: {
      title: 'Moja droga',
      text: 'Zanim założyłem Nuuvie, przez półtorej dekady brałem odpowiedzialność za UX/UI i branding marek takich jak Maersk, Polpharma, Jabra czy Leroy Merlin. Dziś tę samą jakość i standard pracy wnoszę do projektów moich Klientów w Nuuvie.\n\nZaczynałem od własnego startupu, bo chciałem robić gry. Szybko zrozumiałem, że prawdziwe wyzwania leżą w systemach: w tym, jak marka, produkt i komunikacja działają razem. Ta perspektywa została ze mną do dziś.\n\nNuuvie to małe studio z dużym doświadczeniem. Pracujesz bezpośrednio ze mną, a do większych projektów zapraszam sprawdzonych specjalistów.',
      portrait: { _upload: IMG.portrait, alt: 'Daniel Troć, założyciel Nuuvie' },
    },
    stats: [
      { value: '15 lat', text: 'w branży (wiedza, której nie da się „wyklikać” w rok).' },
      { value: '11 krajów', text: 'w których działają moje projekty.' },
      { value: '2540+ zadań', text: 'dowiezionych zadań (od logotypów po skomplikowane systemy).' },
    ],
    process: {
      title: 'Jak pracuję',
      text: 'Prosty proces, w którym zawsze wiesz, co dzieje się z Twoim projektem.',
      steps: [
        { title: 'Rozmowa', body: 'Bezpłatne 15 minut. Poznaję Twój biznes, cele i to, co dziś nie działa.' },
        { title: 'Strategia', body: 'Ustalam, do kogo mówi marka i co ma osiągnąć. Dopiero potem projektuję.' },
        { title: 'Projekt', body: 'Logo, strona albo produkt. Pokazuję kierunki i dopracowuję wybrany razem z Tobą.' },
        { title: 'Wdrożenie', body: 'Przygotowuję pliki, system i wytyczne, żeby projekt działał w praktyce.' },
        { title: 'Wsparcie', body: 'Po starcie zostaję pod ręką: poprawki, rozwój, kolejne materiały.' },
      ],
    },
    principles: {
      title: 'W co wierzę',
      items: [
        { title: 'Najpierw cel, potem forma', body: 'Każda decyzja projektowa ma uzasadnienie biznesowe. Samo „ładnie” to za mało.' },
        { title: 'Prostota wygrywa', body: 'Usuwam to, co rozprasza, żeby zostało to, co ważne.' },
        { title: 'Spójność buduje zaufanie', body: 'Marka ma wyglądać równie dobrze na wizytówce, w aplikacji i na billboardzie.' },
        { title: 'Bez korporacyjnego szumu', body: 'Mówię wprost, a decyzje podejmujemy szybko i konkretnie.' },
      ],
    },
    quote: { text: 'Design to narzędzie, które eliminuje domysły Twoich klientów.', author: 'Daniel Troć, założyciel Nuuvie' },
    final: { title: 'Czas na Twój ruch.', text: 'Napisz albo umów bezpłatną, 15-minutową rozmowę.', ctaLabel: 'Umów rozmowę' },
  },

  en: {
    seo: {
      title: "About Nuuvie – Daniel Troć's design studio",
      description: 'Nuuvie is a studio where design takes responsibility for business. 15 years of experience in UX/UI and branding, working 1:1.',
    },
    hero: {
      title: 'Nuuvie is a studio where design takes responsibility for business.',
      text: 'At Nuuvie I combine experience in building complex systems with the flexibility of a small studio. I deliver considered work that drives your company’s success.',
      primary: { label: "Let's talk", href: BOOK },
      secondary: { label: 'See services for brands', href: '/en#services' },
    },
    facts: [
      { label: 'Based in', value: 'Lublin, Poland' },
      { label: 'Working', value: 'Remotely, with clients from 11 countries' },
      { label: 'Experience', value: '15 years in UX/UI and branding' },
      { label: 'Style', value: 'Simple, concrete, no noise' },
    ],
    why: {
      title: 'Why Nuuvie?',
      items: [
        { title: '1:1 relationship', body: 'From the first call to the final design you work directly with me. That means consistency and no communication noise.', image: { _upload: IMG.relation, alt: 'Illustration: two speech bubbles' } },
        { title: 'Good design', body: 'Good design is the shortest path to earning a client’s trust. I create interfaces and brands that remove randomness and inconsistency, so every click reassures your users they have come to the right place.', image: { _upload: IMG.project, alt: 'Illustration: good design' } },
        { title: 'Proven process', body: 'I use processes refined over more than 2,500 projects for clients in 11 countries.', image: { _upload: IMG.process, alt: 'Illustration: the design process' } },
      ],
    },
    story: {
      title: 'My path',
      text: 'Before founding Nuuvie, for a decade and a half I was responsible for UX/UI and branding for brands such as Maersk, Polpharma, Jabra and Leroy Merlin. Today I bring the same quality and standard of work to my clients’ projects at Nuuvie.\n\nI started with my own startup because I wanted to make games. I soon realised that the real challenges lie in systems: in how a brand, a product and its communication work together. That perspective has stayed with me ever since.\n\nNuuvie is a small studio with a lot of experience. You work directly with me, and for larger projects I bring in trusted specialists.',
      portrait: { _upload: IMG.portrait, alt: 'Daniel Troć, founder of Nuuvie' },
    },
    stats: [
      { value: '15 years', text: 'in the industry (knowledge you can’t pick up in a year).' },
      { value: '11 countries', text: 'where my projects are in use.' },
      { value: '2540+ tasks', text: 'delivered, from logos to complex systems.' },
    ],
    process: {
      title: 'How I work',
      text: 'A simple process where you always know what is happening with your project.',
      steps: [
        { title: 'Call', body: 'A free 15 minutes. I get to know your business, your goals and what isn’t working today.' },
        { title: 'Strategy', body: 'I define who the brand speaks to and what it needs to achieve. Only then do I design.' },
        { title: 'Design', body: 'A logo, a website or a product. I show directions and refine the chosen one with you.' },
        { title: 'Delivery', body: 'I prepare the files, the system and the guidelines so the design works in practice.' },
        { title: 'Support', body: 'After launch I stay close: fixes, growth and new materials.' },
      ],
    },
    principles: {
      title: 'What I believe in',
      items: [
        { title: 'Goal first, then form', body: 'Every design decision has a business reason. “Pretty” is not enough.' },
        { title: 'Simplicity wins', body: 'I remove what distracts, so what matters stays.' },
        { title: 'Consistency builds trust', body: 'A brand should look just as good on a business card, in an app and on a billboard.' },
        { title: 'No corporate noise', body: 'I speak plainly, and we make decisions quickly and clearly.' },
      ],
    },
    quote: { text: "Design is a tool that removes your customers' guesswork.", author: 'Daniel Troć, founder of Nuuvie' },
    final: { title: 'Your move.', text: 'Write to me or book a free 15-minute call.', ctaLabel: 'Book a call' },
  },
};

export type AboutContent = (typeof aboutContent)['pl'];
