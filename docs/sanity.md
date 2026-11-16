# Blog w Sanity

Wpisy bloga edytujesz w Sanity Studio. Strona pobiera je przy budowaniu, więc po publikacji wpisu strona musi się przebudować (na hostingu robi to automatycznie webhook, patrz krok 5).

Dopóki projekt Sanity nie jest podłączony, strona pokazuje przykładowe wpisy (tytuły, daty i okładki z obecnego bloga), żeby wszystko działało i dało się oglądać.

## Co jest w repozytorium

| Miejsce | Co to jest |
| --- | --- |
| `studio/` | Sanity Studio, czyli edytor. Osobny projekt z własnym `package.json`. |
| `studio/schema-types/post.ts` | Model wpisu: tytuł, adres, data, zajawka, okładka z opisem, treść, SEO. |
| `studio/sanity.config.ts` | Konfiguracja: listy „Blog (PL)” i „Blog (EN)”, łączenie tłumaczeń. |
| `studio/schema-types/project.ts` | Case study: klient, nagłówek, zakres, okładka, sekcje tekstu i rzędy zdjęć (cała szerokość lub siatka). |
| `studio/schema-types/legal-page.ts` | Strony prawne: regulamin, polityka prywatności. |
| `src/pages/work/[slug].astro`, `src/pages/legal/[slug].astro` | Case studies `/work/…` i strony prawne `/legal/…` (+ wersje `/en/…`). |
| `src/lib/sanity.ts` | Pobieranie wpisów przez stronę (z zapasem na przykładowe wpisy). |
| `src/pages/blog.astro`, `src/pages/blog-posts/[slug].astro` | Lista i wpis po polsku: `/blog`, `/blog-posts/…` |
| `src/pages/en/blog.astro`, `src/pages/en/blog-posts/[slug].astro` | To samo po angielsku: `/en/blog`, `/en/blog-posts/…` |

Adresy są takie same jak w Webflow, więc Google nie straci istniejących wpisów.

## Uruchomienie krok po kroku

1. **Załóż projekt** na https://www.sanity.io/manage (plan Free). Nazwa np. „Nuuvie”, dataset `production`. Zapisz **Project ID** (krótki ciąg liter i cyfr).
2. **Studio lokalnie:**
   ```bash
   cd studio
   cp .env.example .env      # wpisz SANITY_STUDIO_PROJECT_ID
   npm run dev               # edytor na http://localhost:3333
   ```
3. **Strona lokalnie:** w głównym folderze skopiuj `.env.example` do `.env` i wpisz `PUBLIC_SANITY_PROJECT_ID`. Po `npm run dev` strona pobierze wpisy z Sanity.
4. **Studio online:** opublikowane pod https://nuuvie.sanity.studio (bezpłatnie). Po zmianach w `studio/` aktualizujesz je komendą `cd studio && npm run deploy`.
5. **Automatyczna przebudowa po publikacji:** deploy hook z Cloudflare podpięty jako webhook w Sanity, opis krok po kroku w [cloudflare.md](cloudflare.md) (krok 2). Po kliknięciu „Publikuj” zmiana jest online po około 2 minutach.
6. **Zmienne na hostingu:** ustaw `PUBLIC_SANITY_PROJECT_ID` i `PUBLIC_SANITY_DATASET=production` w ustawieniach projektu na hostingu.

## Jak pisać wpis

- „Blog (PL)” lub „Blog (EN)” → nowy wpis. Język ustawia się sam.
- Tłumaczenie: w otwartym wpisie menu tłumaczeń (ikona języka u góry) → „EN” tworzy powiązaną wersję angielską. Strona sama podlinkuje wersje w przełączniku PL/EN.
- **Adresu (slug) nie zmieniaj po publikacji**, bo zepsujesz linki i pozycję w Google.
- Okładka i obrazki: zawsze uzupełnij „Opis obrazka (alt)”.

## Przeniesienie obecnych wpisów z Webflow

Następny krok: eksport kolekcji bloga z Webflow (CMS → kolekcja → Export CSV) i skrypt, który wgra 12 wpisów z obrazkami do Sanity. Do wgrania potrzebny będzie token API z uprawnieniem „Editor” (Manage → API → Tokens); token trzymamy tylko w pliku `.env`, nigdy w repozytorium.

## Case studies i strony prawne

Zaimportowane skryptem `studio/scripts/import-webflow-pages.ts` (16.11.2026): 3 case studies PL i EN, regulamin, polityka prywatności (PL) i Terms of Service (EN).

- **Angielskie case studies** to nowe tłumaczenia: w Webflow strony `/en/work/…` miały polski tekst. Warto je przejrzeć.
- **Opisy zdjęć (alt)** w case studies są ogólne („Tedee – realizacja Nuuvie, zdjęcie 3”), bo w Webflow były puste. Lepiej opisać, co widać.
- **Angielska polityka prywatności** w Webflow była po polsku, więc nie została zaimportowana; `/en/legal/polityka-prywatnosci` przekierowuje na polską wersję.
- **Polityka prywatności wymienia Webflow i Google Analytics.** Po przejściu na nowy hosting i Umami trzeba ją zaktualizować.
