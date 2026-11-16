/**
 * Starting content of the Designer Zone (/strefa-designera). Seeded into Sanity once and edited there.
 * Polish text comes from the live Webflow page; the English text is a new translation
 * (the Webflow /en page only had Polish text).
 */
const BUY = 'https://cart.easy.tools/checkout/nuuvie-studio/spotkanie-11?lang=pl';
const INTRO = 'https://cal.com/nuuvie/15-minutowa-konsultacja';
const EMAIL = 'hej@nuuvie.com';

export const designerZoneContent = {
  pl: {
    seo: {
      title: 'Konsultacje UX/UI i mentoring dla designerów – Strefa Designera Nuuvie',
      description: 'Konsultacje z designerem z 15-letnim stażem: portfolio review, plan rozwoju, feedback projektowy i Q&A. 90 minut na Google Meet.',
    },
    links: { buyHref: BUY, introHref: INTRO, email: EMAIL },
    hero: {
      title: 'Konsultacje z designerem z 15-letnim stażem.',
      text: 'Jeśli poważnie myślisz o karierze w designie, to spotkanie pomoże Ci uporządkować kierunek.',
      buyLabel: 'Zaczynamy współpracę · 249 zł',
      introLabel: 'Darmowe 15 minut intro',
      facts: ['90 minut', 'Dopasowany termin', 'Google Meet', 'Dedykowany program'],
    },
    problem: {
      title: 'W designie łatwo się zgubić',
      questions: ['Czy moje portfolio jest dobre?', 'Co wrzucić do portfolio?', 'Jakie skille mają znaczenie?', 'Jak dostać pierwszą pracę w designie?'],
    },
    gets: {
      title: 'Co otrzymasz na spotkaniu',
      text: 'Pracujemy na Twoim konkretnym przypadku. 90 minut czystej praktyki opartej na moich 15 latach w branży.',
      items: [
        { title: 'Portfolio review', body: 'Pokażę, które projekty zostawić, które poprawić i czego brakuje, żeby portfolio było konkurencyjne.' },
        { title: 'Plan rozwoju', body: 'Ustalimy, jakie umiejętności rozwijać i w jakiej kolejności. Wychodzisz z jasnym planem działania.' },
        { title: 'Feedback projektowy', body: 'Przeanalizujemy Twój projekt: od UX/UI i layoutów po typografię i prezentację.' },
        { title: 'Q&A', body: 'Pytasz o wszystko: rynek pracy, freelancing, zdobywanie klientów, narzędzia, rozwój kariery.' },
      ],
    },
    intro: {
      title: 'Nie wiesz, czy mentoring jest dla Ciebie? Pogadajmy chwilę.',
      text: 'Ty powiesz mi, na czym stoisz, a ja powiem Ci szczerze, czy jestem w stanie Ci pomóc. W trakcie 15-minutowego intro nie będę Cię namawiał na zakup. Jeśli uznam, że moje konsultacje Ci nie pomogą, powiem Ci to wprost i skieruję do darmowych źródeł.',
      ctaLabel: 'Rezerwuję termin',
    },
    notFor: { title: 'A dla kogo ten mentoring nie jest?', text: 'Nie pomogę Ci, jeśli szukasz magicznego przycisku „zostań seniorem w tydzień”.' },
    opinions: {
      title: 'Wasze opinie',
      items: [
        { name: 'Marta', text: 'Szukałam kogoś, kto pokaże mi, jak ogarnąć Figmę na poziomie zaawansowanym. Daniel pokazał mi swoje pliki i sposób pracy nad komponentami dla dużych marek. Polecam każdemu kto potrzebuje dopracowania konkretnej umiejętności!' },
        { name: 'Michał', text: 'Daniel często na Instagramie mówił o tym, że konsultacja z nim skraca drogę, teraz już wiem, o czym mówił. Długo kręciłem się w miejscu przez natłok informacji. Teraz mam jasny kierunek rozwoju i listę skilli do wypracowania! Dziękuję!' },
        { name: 'Wojtek', text: 'Polecam, Daniel pomógł mi podszlifować proces projektowy w moim portfolio. Dostałem konkretne wskazówki, wszystko w luźnej atmosferze.' },
      ],
    },
    forms: {
      title: '1:1 jest pierwszym krokiem',
      text: 'Jeśli po spotkaniu będziesz chciał rozwijać się ze mną dalej, możliwe są także inne formy współpracy.',
      items: [
        { title: 'Konsultacja 1:1', body: '90 minut pracy na Twoim przypadku. Od tego zaczynamy.' },
        { title: 'Mentoring Solo', body: 'Regularna współpraca, zadania, feedback i mierzalny rozwój. Pracujemy nad Twoimi projektami, umiejętnościami i kolejnymi krokami w karierze. Dzielę się moimi plikami, procesami i błędami, które popełniłem przez 15 lat.' },
        { title: 'Dedykowany Program', body: 'Chcesz rozwinąć konkretny skill? Webdesign, Webflow, Variables, projektowanie logo, UX/UI? Zaprojektujemy plan pracy dopasowany do Twojego celu.' },
        { title: 'Design w grupie', body: 'Zorganizujemy wspólne sesje rozwojowe i uporządkujemy proces projektowy. Skupiamy się na praktyce, konkretnej strukturze pracy i konstruktywnym feedbacku.' },
      ],
    },
    about: {
      title: 'Przeszedłem drogę, którą Ty właśnie zaczynasz.',
      text: 'Nazywam się Daniel Troć. Od ponad 15 lat moje życie kręci się wokół designu. Zaczynałem od własnego startupu, bo chciałem robić gry. Szybko jednak zrozumiałem, że prawdziwe wyzwania leżą w systemach.\n\nPrzez lata, pracując w agencjach i zespołach produktowych, brałem odpowiedzialność za UX/UI i branding dla marek takich jak Maersk, Jabra czy Polpharma. Praca z Klientami takimi jak Leroy Merlin czy Tedee nauczyła mnie, czego realnie szukają szefowie designu w portfolio.\n\nDziś prowadzę studio Nuuvie. Nie jestem teoretykiem: dzielę się praktyczną wiedzą, plikami i procesami. Moim celem jest skrócić Twoją drogę do pracy marzeń.',
    },
    pricing: {
      title: 'Zacznijmy od tego, czego teraz potrzebujesz',
      text: 'Wybierz opcję, która najlepiej pasuje do Twojego momentu w karierze.',
      plans: [
        { audience: 'Dla zdecydowanych na progres', title: 'Indywidualna konsultacja', text: '90 minut czystej praktyki. Dla stawiających pierwsze kroki, zmieniających branżę oraz tych, którzy chcą wyższych stawek.', price: '249 zł', oldPrice: '350 zł', ctaLabel: 'Zaczynamy współpracę', ctaHref: BUY },
        { audience: 'Dla tych, którzy chcą sprawdzić chemię', title: 'Wstępna analiza Twoich potrzeb', text: 'Nie wiesz, czy mój mentoring jest dla Ciebie? Umów się na krótką, darmową rozmowę. Sprawdzimy, jak mogę Ci pomóc.', price: '0 zł', oldPrice: '', ctaLabel: 'Umów spotkanie', ctaHref: INTRO },
      ],
      note: 'Wolisz najpierw pogadać na czacie? Napisz do mnie albo odezwij się na Instagramie.',
    },
    faq: {
      title: 'Masz pytania?',
      items: [
        { question: 'Czy konsultacja jest dla początkujących designerów?', answer: 'Tak. Konsultacja jest idealna zarówno dla osób, które dopiero myślą o wejściu w świat designu, jak i dla tych, którzy mają już pierwsze projekty, ale czują, że stoją w miejscu. Jeśli nie wiesz, od czego zacząć, ułożymy Twój plan nauki tak, byś nie tracił czasu na nieistotne tutoriale.' },
        { question: 'Czy konsultacja obejmuje portfolio review UX/UI?', answer: 'Oczywiście. To jeden z najczęstszych powodów spotkań. Przejdziemy przez Twoje pliki (najlepiej bezpośrednio w Figmie), a ja wskażę Ci błędy w hierarchii, typografii czy procesie UX. Nie będę Cię oceniał, pokażę Ci, jak zmienić Twój projekt, by stał się atrakcyjny dla rekrutera w topowej agencji.' },
        { question: 'Czy audyt moich projektów odbywa się na żywo w Figmie?', answer: 'Tak. Nie wysyłam suchych raportów PDF. Podczas spotkania udostępniam ekran lub wchodzę do Twojego pliku. Na żywo pokazuję Ci triki warsztatowe, zasady budowania komponentów czy auto-layoutu, które sprawiają, że projekt wygląda profesjonalnie i jest gotowy do wdrożenia.' },
        { question: 'Czy konsultacja pomoże mi znaleźć pracę jako UX/UI Designer?', answer: 'Pomogę Ci stać się kandydatem, którego firmy chcą zatrudnić. Nie szukam pracy za Ciebie, ale dam Ci konkretne narzędzia: poprawimy portfolio, dopracujemy proces projektowy i przygotujemy Cię do rozmowy technicznej. Moim celem jest sprawić, by Twoje CV nie lądowało w koszu, a wyróżniło się na tle kandydatów.' },
        { question: 'Figma, Webflow czy AI – czego uczyć się najpierw w 2026 roku?', answer: 'Podczas spotkania dobierzemy Twój stack technologiczny. Podpowiem Ci, jak wykorzystać AI, by przyspieszyć nudne procesy, ale skupimy się na fundamentach. Rynek potrzebuje dziś projektantów, którzy potrafią dowieźć gotowy produkt (np. Webflow) i rozumieją biznes, a nie tylko sprawnie klikają w narzędziach.' },
        { question: 'Jak przygotować portfolio UX/UI, by wyróżnić się na rynku?', answer: 'Większość portfolio wygląda tak samo. Pokażę Ci, jak opisywać Twoje myślenie projektowe i decyzje biznesowe, a nie tylko pokazywać ładne obrazki. Skupimy się na tzw. case studies, które udowadniają, że rozumiesz problem użytkownika i potrafisz go rozwiązać.' },
        { question: 'Jak wygląda konsultacja online i ile trwa?', answer: 'Spotykamy się na Google Meet. Standardowa sesja trwa 90 minut – to optymalny czas, by wejść głęboko w Twoje projekty i odpowiedzieć na wszystkie pytania. Po spotkaniu otrzymasz ode mnie nagranie oraz listę konkretnych kroków do wykonania (Twoją osobistą mapę drogową).' },
        { question: 'Czy mogę zapytać o freelancing i zdobywanie klientów?', answer: 'Jak najbardziej. Jako właściciel studia Nuuvie na co dzień zarządzam projektami i Klientami. Mogę Ci podpowiedzieć, jak wyceniać swoją pracę, jak konstruować oferty i jak budować markę osobistą designera, która budzi zaufanie i pozwala windować stawki.' },
        { question: 'Czy konsultacja pomoże mi zdecydować, czy UX/UI design jest dla mnie?', answer: 'Tak. Wiele osób uczących się designu nie ma pewności, czy idą w dobrą stronę. Podczas konsultacji możemy przeanalizować Twoje projekty, sposób nauki i poziom umiejętności, aby zobaczyć, na jakim etapie jesteś i jakie kroki warto podjąć dalej. Często pomaga to uporządkować kierunek rozwoju w designie.' },
        { question: 'Czy konsultacja zastępuje pełny kurs UX/UI?', answer: 'Nie, to coś lepszego – to skrót. Kursy dają ogólną wiedzę dla każdego. Konsultacja 1:1 daje Ci odpowiedzi na Twoje konkretne problemy. Zamiast przechodzić przez 40 godzin nagrań, dostajesz 90 minut intensywnej pracy nad Twoim przypadkiem. Często jedna taka rozmowa klaruje w głowie więcej niż miesiące samodzielnej nauki.' },
      ],
    },
    final: { title: 'Działajmy razem.', text: '90 minut, po których wiesz, co robić dalej.' },
  },

  en: {
    seo: {
      title: 'UX/UI consultations and mentoring for designers – Nuuvie Designer Zone',
      description: 'Consultations with a designer with 15 years of experience: portfolio review, growth plan, design feedback and Q&A. 90 minutes on Google Meet.',
    },
    links: { buyHref: BUY, introHref: INTRO, email: EMAIL },
    hero: {
      title: 'Consultations with a designer with 15 years of experience.',
      text: 'If you are serious about a career in design, this session will help you set your direction.',
      buyLabel: 'Book the session · 249 PLN',
      introLabel: 'Free 15-minute intro',
      facts: ['90 minutes', 'A time that suits you', 'Google Meet', 'A programme built for you'],
    },
    problem: {
      title: "It's easy to get lost in design",
      questions: ['Is my portfolio any good?', 'What should go into my portfolio?', 'Which skills really matter?', 'How do I land my first design job?'],
    },
    gets: {
      title: 'What you get from the session',
      text: 'We work on your specific case. 90 minutes of pure practice, based on my 15 years in the industry.',
      items: [
        { title: 'Portfolio review', body: 'I will show you which projects to keep, which to improve and what is missing to make your portfolio competitive.' },
        { title: 'Growth plan', body: 'We will decide which skills to develop and in what order. You leave with a clear plan of action.' },
        { title: 'Design feedback', body: 'We will go through your project: from UX/UI and layouts to typography and presentation.' },
        { title: 'Q&A', body: 'Ask about anything: the job market, freelancing, finding clients, tools, career growth.' },
      ],
    },
    intro: {
      title: 'Not sure mentoring is for you? Let’s have a quick chat.',
      text: "You tell me where you are, and I will tell you honestly whether I can help. During the 15-minute intro I won't push you to buy anything. If I think my consultations won't help you, I will say so and point you to free resources.",
      ctaLabel: 'Book a slot',
    },
    notFor: { title: 'Who is this mentoring not for?', text: 'I can’t help if you are looking for a magic “become a senior in a week” button.' },
    opinions: {
      title: 'What people say',
      items: [
        { name: 'Marta', text: 'I was looking for someone to show me how to handle Figma at an advanced level. Daniel showed me his files and how he builds components for big brands. I recommend him to anyone who needs to sharpen a specific skill!' },
        { name: 'Michał', text: 'Daniel often said on Instagram that a consultation with him shortens the road – now I know what he meant. I spent a long time going round in circles because of information overload. Now I have a clear direction and a list of skills to work on. Thank you!' },
        { name: 'Wojtek', text: 'Recommended. Daniel helped me polish the design process in my portfolio. I got concrete advice, all in a relaxed atmosphere.' },
      ],
    },
    forms: {
      title: '1:1 is the first step',
      text: 'If you want to keep growing with me after the session, there are other ways to work together too.',
      items: [
        { title: '1:1 consultation', body: '90 minutes of work on your case. This is where we start.' },
        { title: 'Solo mentoring', body: 'Regular collaboration, tasks, feedback and measurable progress. We work on your projects, skills and next career steps. I share my files, processes and the mistakes I made over 15 years.' },
        { title: 'Tailored programme', body: 'Want to develop a specific skill? Web design, Webflow, Variables, logo design, UX/UI? We will design a plan of work around your goal.' },
        { title: 'Design in a group', body: 'Joint growth sessions that bring order to your design process. We focus on practice, a clear way of working and constructive feedback.' },
      ],
    },
    about: {
      title: 'I’ve walked the road you are just starting.',
      text: "My name is Daniel Troć. For more than 15 years my life has revolved around design. I started with my own startup because I wanted to make games. I soon realised that the real challenges lie in systems.\n\nOver the years, working in agencies and product teams, I was responsible for UX/UI and branding for brands such as Maersk, Jabra and Polpharma. Working with clients like Leroy Merlin and Tedee taught me what heads of design really look for in a portfolio.\n\nToday I run the Nuuvie studio. I'm not a theorist: I share practical knowledge, files and processes. My goal is to shorten your road to the job you want.",
    },
    pricing: {
      title: 'Let’s start with what you need right now',
      text: 'Pick the option that best fits where you are in your career.',
      plans: [
        { audience: 'For those committed to progress', title: 'Individual consultation', text: '90 minutes of pure practice. For people taking their first steps, switching careers, or aiming for higher rates.', price: '249 PLN', oldPrice: '350 PLN', ctaLabel: 'Book the session', ctaHref: BUY },
        { audience: 'For those who want to check the fit', title: 'An initial look at your needs', text: 'Not sure my mentoring is for you? Book a short, free call. We will see how I can help.', price: '0 PLN', oldPrice: '', ctaLabel: 'Book a call', ctaHref: INTRO },
      ],
      note: 'Prefer to chat first? Write to me or message me on Instagram.',
    },
    faq: {
      title: 'Questions?',
      items: [
        { question: 'Is the consultation for beginner designers?', answer: "Yes. It is ideal both for people who are only thinking about getting into design and for those who already have their first projects but feel stuck. If you don't know where to start, we will plan your learning so you don't waste time on irrelevant tutorials." },
        { question: 'Does the consultation include a UX/UI portfolio review?', answer: "Of course. It's one of the most common reasons for a session. We will go through your files (ideally right in Figma), and I will point out problems with hierarchy, typography or the UX process. I won't judge you; I'll show you how to change your project so it appeals to a recruiter at a top agency." },
        { question: 'Is the review of my projects done live in Figma?', answer: "Yes. I don't send dry PDF reports. During the session I share my screen or join your file. I show you practical tricks live, and the rules for building components and auto layout that make a project look professional and ready for development." },
        { question: 'Will the consultation help me find a job as a UX/UI designer?', answer: "I will help you become the candidate companies want to hire. I won't look for a job for you, but I'll give you concrete tools: we'll improve your portfolio, refine your design process and prepare you for the technical interview. My goal is for your CV to stand out instead of landing in the bin." },
        { question: 'Figma, Webflow or AI – what should I learn first in 2026?', answer: "During the session we'll choose your tech stack. I'll show you how to use AI to speed up tedious tasks, but we'll focus on the fundamentals. Today the market needs designers who can deliver a finished product (for example in Webflow) and understand business, not just click around tools efficiently." },
        { question: 'How do I prepare a UX/UI portfolio that stands out?', answer: "Most portfolios look the same. I'll show you how to describe your design thinking and business decisions, not just show pretty pictures. We'll focus on case studies that prove you understand the user's problem and can solve it." },
        { question: 'What does the online consultation look like and how long is it?', answer: 'We meet on Google Meet. A standard session lasts 90 minutes – the right amount of time to dig deep into your projects and answer all your questions. After the session you get the recording and a list of concrete next steps (your personal roadmap).' },
        { question: 'Can I ask about freelancing and finding clients?', answer: 'Absolutely. As the owner of the Nuuvie studio I manage projects and clients every day. I can tell you how to price your work, how to put together proposals and how to build a personal brand as a designer that earns trust and lets you raise your rates.' },
        { question: 'Will the consultation help me decide whether UX/UI design is for me?', answer: "Yes. Many people learning design aren't sure they're heading in the right direction. During the session we can look at your projects, the way you learn and your skill level to see where you are and what steps make sense next. It often helps bring order to your growth in design." },
        { question: 'Does the consultation replace a full UX/UI course?', answer: 'No – it is something better: a shortcut. Courses give general knowledge for everyone. A 1:1 consultation gives you answers to your specific problems. Instead of 40 hours of recordings, you get 90 minutes of focused work on your case. One such conversation often clears your head more than months of learning on your own.' },
      ],
    },
    final: { title: "Let's work together.", text: '90 minutes, after which you know what to do next.' },
  },
};

export type DesignerZoneContent = (typeof designerZoneContent)['pl'];
