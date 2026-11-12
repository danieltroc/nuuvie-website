import { pl, type Dict } from './pl';

const LIVE = 'https://www.nuuvie.com';

export const en: Dict = {
  locale: 'en',
  meta: {
    title: 'Nuuvie Studio – UX/UI Design, Branding & Websites',
    description:
      'I design digital products and brands that build trust from the very first contact. 15 years of experience in UX/UI and branding.',
  },
  nav: {
    work: 'Work',
    services: 'Services',
    about: 'About',
    blog: 'Blog',
    contact: 'Contact',
    cta: "Let's talk",
    menu: 'Menu',
    close: 'Close',
  },
  hero: {
    meta: ['UX / UI', 'Branding', 'Websites'],
    scroll: 'Scroll',
    services: [
      'Logo & visual identity',
      'Websites & UX / UI',
      'Graphic & print design',
      'Strategy & planning',
    ],
    title: 'I design digital products and brands that build trust from the very first contact.',
    subs: [
      '15 years of experience in UX/UI and branding for market leaders.',
      'Your vision translated into the language of benefits and intuitive design.',
    ],
    cta: "Let's talk about your project",
    portraitAlt: 'Daniel Troć, founder of Nuuvie',
  },
  clients: {
    label: 'Partners & clients',
    text: "I've designed for global brands and local leaders:",
  },
  manifesto: {
    label: 'Why I do this',
    lead: "Design is a tool that removes your customers' guesswork.",
    body: 'My job is to make your brand say what matters most before the user reads a single word.',
    author: 'Daniel Troć',
    role: 'Founder of Nuuvie',
  },
  work: {
    label: 'Selected work',
    title: 'Selected work',
    cursor: 'View',
    items: [
      {
        ...pl.work.items[0],
        kicker: 'Smart locks and smart home solutions',
        desc: 'Design that connects the physical and the digital.',
        tags: ['UX / UI', 'App', 'Website', 'Packaging'],
      },
      {
        ...pl.work.items[1],
        kicker: 'A barber studio with character',
        desc: 'New logo. New energy. Same character.',
        tags: ['Logo', 'Identity', 'Print'],
      },
      {
        ...pl.work.items[2],
        kicker: 'Business solutions implementation',
        desc: 'A redesign that brought the brand closer to people.',
        tags: ['Website', 'Redesign', 'Social media'],
      },
    ],
  },
  services: {
    label: 'Services',
    title: 'What can I do for your business?',
    cta: "Let's talk about your project",
    items: [
      {
        title: 'Logo & branding',
        body: 'Have an idea for a brand? I will give it a shape and character that builds customer loyalty. My support covers the full design process: from the logo and visual identity to a complete brand book. I create solutions that are consistent and consciously tailored to your needs.',
      },
      {
        title: 'Websites, apps & UX / UI design',
        body: 'Building a digital product, an app, software or a SaaS service? I will design an intuitive interface and a refined user experience for you. UX and UI are my specialty.',
      },
      {
        title: 'Graphic design',
        body: 'I will help you stand out online. I design websites, campaigns and social media assets that people remember.',
      },
      {
        title: 'Strategy, growth & audits',
        body: 'I do not just design — I analyse and shape a visual strategy that makes your brand recognisable and delivers on your business goals.',
      },
      {
        title: 'Support for your team',
        body: 'External support at Senior Designer level. I join your team at any stage of the work, bringing an expert perspective to design sprints or full-scale implementations. A safe way to scale your product without a lengthy recruitment process.',
      },
    ],
  },
  stats: [
    { value: 11, suffix: '', unit: 'countries', text: 'International collaboration.' },
    { value: 15, suffix: '', unit: 'years', text: 'Of experience that will save you from mistakes.' },
    { value: 2540, suffix: '+', unit: 'projects', text: 'Confidence that yours is in good hands.' },
  ],
  testimonials: {
    label: 'They choose us',
    title: ['CEOs, founders', 'and the people shaping how products and brands grow.'],
    items: [
      {
        ...pl.testimonials.items[0],
        quote: 'A fast start, context grasped brilliantly, and designs that were exactly what we needed.',
      },
      {
        ...pl.testimonials.items[1],
        quote: 'I recommend Nuuvie to anyone who values quality and a good pace.',
      },
      {
        ...pl.testimonials.items[2],
        quote:
          'We worked together on the graphic materials for my barbershop – from the logo and a billboard to business cards. The whole process went smoothly, and Nuuvie translated my vision perfectly into modern, effective materials.',
      },
    ],
  },
  blog: {
    ...pl.blog,
    label: 'Nuuvie blog',
    title: 'We write about design',
    cta: 'Go to the blog',
    read: 'Read',
    posts: [
      { ...pl.blog.posts[0], href: `${LIVE}/en/blog-posts/visual-identity-rebrand-old-craft-barbershop-lublin-case-study`, title: 'Rebranding a visual identity: the Old Craft Barbershop Lublin case study' },
      { ...pl.blog.posts[1], href: `${LIVE}/en/blog-posts/human-touch-in-design-why-brands-in-2026-are-moving-away-from-perfection`, title: 'Human touch in design: why brands are running from perfection in 2026' },
      { ...pl.blog.posts[2], href: `${LIVE}/en/blog-posts/why-a-weak-brand-costs-you-more-than-you-think`, title: 'Why a weak brand costs you more than you think' },
      { ...pl.blog.posts[3], title: 'A website UX audit – do it yourself or hire professionals' },
      { ...pl.blog.posts[4], title: 'How to choose a UX/UI designer' },
      { ...pl.blog.posts[5], title: 'How much does a website cost in 2026?' },
    ],
  },
  contact: {
    ...pl.contact,
    label: 'Contact',
    title: ['Your move.', "Let's talk."],
    writeLabel: 'Write the classic way',
    bookLabel: "Or let's talk",
    bookText: 'Pick a time for a free 15-minute consultation.',
    bookCta: 'Book a call',
  },
  footer: {
    ...pl.footer,
    tagline: 'Design studio. UX/UI, branding and websites.',
    navLabel: 'Navigation',
    socialLabel: 'Social',
    legalLabel: 'Info',
    designerZone: { ...pl.footer.designerZone, label: 'Designer Zone' },
    legal: [
      { ...pl.footer.legal[0], label: 'Terms' },
      { ...pl.footer.legal[1], label: 'Privacy policy' },
    ],
    rights: 'All rights reserved.',
    top: 'Back to top',
  },
};
