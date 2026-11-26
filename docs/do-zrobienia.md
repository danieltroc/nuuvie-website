# Do zrobienia

Lista na czas startu nowej strony. Odhaczaj `[x]` w miarę postępów.

## 1. Przed przepięciem domeny (robię ja)

- [x] Przejście kontrolne po wszystkich stronach z ograniczonym ruchem (`prefers-reduced-motion`): sprawdzone 24.11 na 9 stronach, wszystko widoczne.
- [x] Lighthouse (24.11, telefon): SEO i dobre praktyki 100, dostępność 90–100, szybkość 73–90. Poprawione: obrazki wpisów (WebP), cache wideo i obrazków, kontrast licznika w formularzu, kolejność nagłówków na głównej. Zostaje: szybkość strony głównej (animacje na starcie), do ewentualnego dopracowania.
- [ ] Obrazki do udostępniania (Open Graph) dla stron i wpisów: co pokazuje LinkedIn / Messenger po wklejeniu linku.
- [x] Strona 404 w nowym stylu: wariant D · Urwana linia, PL (`dist/404.html`) i EN (`dist/en/404.html`, dla adresów `/en/...`).
- [ ] **Decyzja: CTA na końcu stron.** Warianty do przeklikania lokalnie: `astro dev` → <http://localhost:4321/cta> (plik `src/dev/cta.astro`, na produkcji go nie ma). Najpewniej bierzemy **A · Rozmowa** i **B · Kalendarz**, każdy na innych stronach. Do ustalenia: który wariant na której stronie. Przy wdrożeniu:
  - formularz `/kontakt` ma odczytywać parametry `?usluga=…&termin=…` i zaznaczać je sam (z wariantu A i C);
  - sprawdzić, czy cal.com otwiera się na dniu z `?date=RRRR-MM-DD` (wariant B).

## 2. Przepięcie domeny (robisz Ty, krok po kroku)

Instrukcja: [`docs/przepiecie-domeny.md`](przepiecie-domeny.md).

**Stan 24.11.2026:** kroki 1–7 zrobione. Nowa strona działa na `www.nuuvie.com` (Cloudflare), przekierowania i HTTPS sprawdzone, formularz wysyła maile (Resend zweryfikowany), poczta OVH działa. Domeny odnowione do 21.11.2027 (auto-odnawianie włączone).

- [x] Krok 8: Google Search Console: usługa domeny nuuvie.com zweryfikowana (TXT w Cloudflare), sitemapa przesłana 24.11.
- [ ] Krok 9 (od 1.12): DNSSEC z powrotem, tym razem włączany w Cloudflare.
- [ ] Krok 10 (od 1.12): wyłączyć Webflow.
- [ ] Opcjonalnie: `nuuvie.pl` → `www.nuuvie.com` (sekcja „Dodatkowo” w instrukcji).

Umami jest już w kodzie (ten sam identyfikator strony co w Webflow). Zacznie liczyć sam, gdy strona ruszy pod `www.nuuvie.com`.

## 3. Zaraz po przepięciu

- [x] Ogłoszenie o zmianie Regulaminu i Polityki prywatności (od 4.12.2026) na obu stronach prawnych (26.11).
- [ ] **Polityka prywatności: szkic w Sanity (26.11), tylko dopiski** o narzędziach i bannerze cookies (Umami, Meta Pixel po zgodzie, Turnstile, Cloudflare, Resend, „Ustawienia cookies”). Reszta polityki i Regulamin bez zmian, nowe wersje wchodzą później (ogłoszenie na górze stron). Publish w Studio. Przy nowej wersji: usunąć Google Analytics, Smartlook i Webflow, sprawdzić art. 399 PKE i datę wejścia w życie (ogłoszenie: 4.12).
- [x] **Zgoda marketingowa w formularzu `/kontakt`** (potwierdzone 26.11): osobne, nieobowiązkowe pole, odznaczone domyślnie; w mailu z formularza linijka „Zgoda marketingowa: TAK (data)” jako dowód. Musi działać najpóźniej 2.12.
- [ ] Przez tydzień zaglądać do Google Search Console (błędy 404, indeksowanie).

## 3a. Statystyki

- [ ] **Zdarzenia w Umami:** wysłanie formularza, kliknięcie „Umów rozmowę” (cal.com), kliknięcia w e-mail i telefon, a po premierze Fontów „Kup zestaw”. Statystyki: <https://cloud.umami.is> (ta sama strona co w Webflow, historia ciągła).

## 3b. Meta (reklamy na Instagramie)

Piksel działa od 26.11.2026 (zbiór danych `994634066083263`, portfolio „Nuuvie”), tylko po zgodzie w bannerze cookies.

- [ ] **Weryfikacja domeny w Meta:** Meta Business Suite → Ustawienia → Bezpieczeństwo marki → Domeny → sprawdzić, czy `nuuvie.com` jest na liście i zweryfikowana. Jeśli nie: dodać, wybrać rekord DNS TXT i dodać go w Cloudflare (DNS → Records).
- [ ] **easy.tools:** w ustawieniach integracji wpisać ten sam identyfikator piksela, żeby Meta widziała zakupy (Fonty, spotkania 1:1).
- [ ] Puste portfolio „Nuuvie” (0 zasobów) w Meta Business Suite: sprawdzić i ewentualnie usunąć, żeby się nie myliło.

## 4. Treści (po przepięciu)

- [ ] **O Nuuvie:** dopracować tekst sekcji „Jak pracuję”.
- [ ] **Prace:** wpisać rok przy projektach w Sanity (kolumna „Rok” na liście prac pojawi się sama). Dodać kolejne projekty.
- [ ] **Blog:** sprawdzić, czy żaden wpis nie ma oznaczenia „Przykładowa treść” (pojawia się nad treścią wpisu).

## 5. Do decyzji po starcie

### Akcent w nagłówkach fontem Cakra

Pomysł odłożony 17.11.2026, do decyzji, gdy strona będzie już online.

- **Na czym polega:** nagłówki w prostym Interze, a **jedno słowo albo krótka fraza** w nagłówku w foncie [Cakra](https://bestfreefonts.com/cakra) (OoM Type, licencja SIL OFL, można komercyjnie), w fiolecie marki. Na przykład: „Projektuję marki i produkty, którym się **UFA**.”, „Design, który odpowiada za **WYNIK**.”, „W designie łatwo się **ZGUBIĆ**”.
- **Gdzie jest:** gałąź `preview/cakra` (commit „Preview: plain Inter headings…”). Podgląd:
  ```bash
  git switch preview/cakra
  ```
  potem `astro dev`, a powrót: `git switch main`.
- **Co już sprawdzone:** Cakra ma wszystkie polskie znaki. Same nagłówki w całości w Cakrze odrzucone (wersaliki, za głośno).
- **Do ustalenia przed wdrożeniem:**
  - słowo akcentu zaznaczane ręcznie w Sanity (np. `*za wynik*`), a ostatnie słowo tylko jako zapas; w podglądzie jest zawsze ostatnie słowo;
  - „N” w Cakrze wygląda jak odwrócone „И” (np. „WYИIK”): albo to akceptujemy jako detal, albo dobieramy słowa bez „N”;
  - kolor akcentu: fiolet czy czarny;
  - Bricolage zostaje czy przechodzimy na Inter w nagłówkach;
  - waga fontu (ok. 150 KB na każdej stronie): ewentualnie przyciąć do polskich i łacińskich znaków.
- Odrzucona po drodze: Cakra z befonts (inny font o tej samej nazwie, demo tylko do użytku osobistego, bez polskich znaków).

## 6. Fonty (premiera ok. 30.11.2026)

Strona `/fonty` do premiery jest **podglądem**: działa pod <https://nuuvie-website.daniel-troc.workers.dev/fonty> (i lokalnie), ale na `nuuvie.com` zwraca 404 i nie trafia do Google (`noindex`, poza sitemapą). Link w stopce widać tylko lokalnie.

Przed premierą:
- [x] Strona przepisana pod prawdziwy produkt z pliku Figma „Fonts”: 250 par, 12 rozdziałów, licencje, instalacja, PDF + plik Figma (17.11.2026).
- [ ] Cena i link do zakupu (plik `src/dev/fonty.astro`, na górze lista zaślepek).
- [ ] Sprawdzić grubości nagłówków przykładowych par ze slajdami (lista `raw` w `src/dev/fonty.astro`).
- [ ] Przed publikacją: fonty Fontshare na stronie ładują się z api.fontshare.com. Rozważyć hostowanie u siebie (licencja ITF FFL na to pozwala).
- [ ] Publikacja:
  1. w `worker/index.ts` ustawić `FONTY_LIVE = true`;
  2. w `src/dev/fonty.astro` usunąć `noindex` przy `<Base …>`;
  3. w `astro.config.mjs` usunąć `/fonty` z filtra sitemapy (i najlepiej przenieść plik do `src/pages/fonty.astro`, usuwając jego linię z `dev-only-pages`);
  4. w `src/components/site/SiteFooter.astro` usunąć warunek `import.meta.env.DEV` przy linku „Zestaw fontów”.
- Wersja EN: na razie nie.
