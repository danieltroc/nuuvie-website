# Do zrobienia

Lista na czas startu nowej strony. Odhaczaj `[x]` w miarę postępów.

## 1. Przed przepięciem domeny (robię ja)

- [ ] Przejście kontrolne po wszystkich stronach z ograniczonym ruchem (`prefers-reduced-motion`): wszystko widoczne, nic nie „wisi” w połowie animacji.
- [ ] Lighthouse na głównych stronach (główna, O Nuuvie, Strefa, Prace, wpis na blogu, Kontakt): szybkość, dostępność, SEO. Poprawki tego, co wyjdzie.
- [ ] Obrazki do udostępniania (Open Graph) dla stron i wpisów: co pokazuje LinkedIn / Messenger po wklejeniu linku.
- [ ] Strona 404 w nowym stylu.

## 2. Przepięcie domeny (robisz Ty, krok po kroku)

Instrukcja: [`docs/przepiecie-domeny.md`](przepiecie-domeny.md).

Umami jest już w kodzie (ten sam identyfikator strony co w Webflow). Zacznie liczyć sam, gdy strona ruszy pod `www.nuuvie.com`.

## 3. Zaraz po przepięciu

- [ ] **Polityka prywatności** (pilne, bo formularz zbiera dane). Dopisać:
  - hosting: Cloudflare (zamiast Webflow);
  - formularz: dane z formularza trafiają mailem przez Resend; ochrona przed spamem Cloudflare Turnstile;
  - analityka: Umami (bez cookies), jeśli w polityce jest jeszcze Google Analytics, usunąć.
- [ ] Przez tydzień zaglądać do Google Search Console (błędy 404, indeksowanie).

## 4. Treści (po przepięciu)

- [ ] **O Nuuvie:** dopracować tekst sekcji „Jak pracuję”.
- [ ] **Prace:** wpisać rok przy projektach w Sanity (kolumna „Rok” na liście prac pojawi się sama). Dodać kolejne projekty.
- [ ] **Blog:** sprawdzić, czy żaden wpis nie ma oznaczenia „Przykładowa treść” (pojawia się nad treścią wpisu).

## 5. Fonty (premiera ok. 30.11.2026)

Strona `/fonty` działa teraz **tylko lokalnie** (`astro dev`) i nie trafia na produkcję.

Przed premierą:
- [ ] Prawdziwe pary fontów zamiast przykładowych, cena, link do zakupu, docelowy prompt (plik `src/dev/fonty.astro`, na górze lista zaślepek).
- [ ] Publikacja:
  1. przenieść `src/dev/fonty.astro` do `src/pages/fonty.astro`;
  2. usunąć wpis `dev-only-pages` w `astro.config.mjs`;
  3. w `src/components/site/SiteFooter.astro` usunąć warunek `import.meta.env.DEV` przy linku „Zestaw fontów”.
- Wersja EN: na razie nie.
