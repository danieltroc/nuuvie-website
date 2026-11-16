# Hosting na Cloudflare

Strona to statyczne pliki (Astro buduje folder `dist/`). Cloudflare buduje ją z GitHuba po każdym `git push`, a także po każdej publikacji w Sanity (przez deploy hook). Plan **Free**: 0 zł.

Domena **zostaje zarejestrowana w OVH**. Do Cloudflare przenosimy tylko zarządzanie DNS (serwery nazw). Poczta `hej@nuuvie.com` dalej działa w OVH.

## Co jest już gotowe w repozytorium

| Plik | Co robi |
| --- | --- |
| `wrangler.jsonc` | konfiguracja Cloudflare: pliki z `dist/`, adresy bez ukośnika (`/blog`, a `/blog/` przekierowuje na `/blog`), strona 404 |
| `public/_redirects` | przekierowania 301 (`/spotkanie`, `/kontakt`, nieprzetłumaczone wpisy EN) |
| `public/_headers` | długie cache dla JS/CSS/fontów i podstawowe nagłówki bezpieczeństwa |
| `public/robots.txt`, `sitemap-index.xml` | mapa strony dla Google (generowana przy budowaniu) |
| `src/pages/404.astro` | strona „Nie ma takiej strony” |
| `.node-version` | wersja Node.js do budowania (22) |

Sprawdzone lokalnie (`npm run preview:cf`): wszystkie 32 adresy z obecnej mapy strony Webflow działają albo przekierowują.

## Krok 1. Konto i podłączenie GitHuba (ok. 10 min)

1. Załóż darmowe konto na <https://dash.cloudflare.com/sign-up>.
2. **Compute (Workers) → Workers & Pages → Create → Import a repository**.
3. **Connect GitHub**. Daj dostęp tylko do repozytorium `danieltroc/nuuvie-website` („Only select repositories”).
4. Ustawienia projektu:
   - Project name: `nuuvie-website`
   - Build command: `npm run build`
   - Deploy command: `npx wrangler deploy` (domyślne)
   - Root directory: `/` (puste)
   - Zmienne środowiskowe: **nie trzeba** (ID projektu Sanity jest w kodzie)
5. **Deploy**. Pierwsze budowanie trwa ok. 1–2 min.
6. Strona będzie pod adresem `https://nuuvie-website.<twoja-nazwa>.workers.dev`. Sprawdź ją. Ten adres zostaje jako podgląd. Google go nie zaindeksuje, bo każda strona wskazuje `www.nuuvie.com` jako adres kanoniczny.

## Krok 2. Automatyczna publikacja po zmianie w Sanity (ok. 5 min)

1. W Cloudflare: projekt `nuuvie-website` → **Settings → Builds → Deploy Hooks → Create**. Nazwa `Sanity`, gałąź `main`. Skopiuj adres.
   **Ten adres to sekret**: kto go zna, może uruchamiać budowanie. Nie wklejaj go do repozytorium ani do czatu.
2. Na <https://www.sanity.io/manage> → projekt Nuuvie → **API → Webhooks → Create webhook**:
   - Name: `Cloudflare build`
   - URL: adres deploy hooka z punktu 1
   - Dataset: `production`
   - Trigger on: Create, Update, Delete
   - Filter: `_type in ["post", "project", "legalPage", "homePage", "aboutPage", "designerZonePage"]`
   - HTTP method: `POST`
   - Drafts: wyłączone (budujemy tylko po publikacji)
3. Test: zmień przecinek w Sanity → Publish. W Cloudflare w zakładce **Deployments** pojawi się nowe budowanie, a po ok. 2 min zmiana jest na stronie.

## Krok 3. Przeniesienie DNS z OVH do Cloudflare

To jedyny krok, w którym coś może przestać działać, więc robimy go po kolei.

### 3a. Wyłącz DNSSEC w OVH (dzień wcześniej)

Domena ma włączone DNSSEC. Jeśli zmienisz serwery DNS przy włączonym DNSSEC, domena przestanie działać (strona **i poczta**) aż do jego wyłączenia.

- OVH → **Web Cloud → Nazwy domen → nuuvie.com → DNSSEC → Wyłącz**.
- **Odczekaj 24 godziny**, zanim zrobisz krok 3c. (Po przeniesieniu można DNSSEC włączyć z powrotem, już w Cloudflare.)

### 3b. Dodaj domenę w Cloudflare

1. Cloudflare → **Add a domain** → `nuuvie.com` → „Quick scan for DNS records” → plan **Free**.
2. Cloudflare skopiuje rekordy DNS z OVH. **Sprawdź, czy są wszystkie rekordy poczty**:

   | Typ | Nazwa | Wartość |
   | --- | --- | --- |
   | MX | `nuuvie.com` | `mx1.mail.ovh.net` (priorytet 1) |
   | MX | `nuuvie.com` | `mx2.mail.ovh.net` (priorytet 5) |
   | MX | `nuuvie.com` | `mx3.mail.ovh.net` (priorytet 100) |
   | TXT | `nuuvie.com` | `v=spf1 include:_spf.mlsend.com include:mx.ovh.com -all` |

   Skaner nie zawsze znajduje rekordy DKIM (np. MailerLite) i inne o nietypowych nazwach. Najpewniej: w OVH **Strefa DNS → Zmień w trybie tekstowym**, skopiuj całą strefę i porównaj z listą w Cloudflare. Brakujące dopisz ręcznie (MX i TXT zawsze jako „DNS only”, szara chmurka).
3. **Usuń** stare rekordy strony Webflow: `A nuuvie.com 198.202.211.1` i `CNAME www cdn.webflow.com`. Zastąpi je krok 4.
4. Cloudflare pokaże dwa serwery nazw, np. `xxx.ns.cloudflare.com` i `yyy.ns.cloudflare.com`.

### 3c. Zmień serwery DNS w OVH

- OVH → **Nazwy domen → nuuvie.com → Serwery DNS → Zmień serwery DNS** → wpisz dwa serwery z Cloudflare (zamiast `dns102.ovh.net` i `ns102.ovh.net`).
- Zmiana działa zwykle w ciągu 1–2 godzin, maksymalnie do 24 h. Cloudflare wyśle e-mail, gdy domena będzie **Active**.

## Krok 4. Podpięcie domeny pod stronę

1. Projekt `nuuvie-website` → **Settings → Domains & Routes → Add → Custom domain**: `www.nuuvie.com`. Potem drugi raz: `nuuvie.com`.
2. **Rules → Redirect Rules → Create rule → szablon „Redirect from root to WWW”**, żeby `nuuvie.com/...` przekierowywało na `https://www.nuuvie.com/...` (tak jak teraz w Webflow). Kod 301, z zachowaniem ścieżki i parametrów.
3. **SSL/TLS → Edge Certificates → Always Use HTTPS: On**.
4. Sprawdź: `https://www.nuuvie.com`, `http://nuuvie.com/blog` (ma przekierować na `https://www.nuuvie.com/blog`), wyślij maila na `hej@nuuvie.com` i odpowiedz z niego.

## Krok 5. Po przeniesieniu

- [ ] Google Search Console → Mapy witryn → dodaj `https://www.nuuvie.com/sitemap-index.xml`.
- [ ] Przez tydzień obserwuj Search Console (błędy 404).
- [ ] Dopiero potem **anuluj plan Webflow** (obrazki z Webflow są już skopiowane do projektu i Sanity).
- [ ] Zaktualizuj politykę prywatności: hosting Cloudflare zamiast Webflow, analityka Umami zamiast Google Analytics.

## Jak wrócić, gdyby coś poszło źle

W OVH przywróć serwery DNS `dns102.ovh.net` i `ns102.ovh.net`. Do czasu anulowania Webflow stara strona dalej tam działa.

## Na co dzień

- **Zmiana treści:** Sanity → Publish. Strona przebudowuje się sama (ok. 2 min).
- **Zmiana kodu:** `git push` na `main`. Cloudflare buduje i publikuje sam.
- **Podgląd lokalny jak na Cloudflare:** `npm run preview:cf` → <http://localhost:8787>.
- **Limity planu Free:** 500 budowań miesięcznie, ruch na statycznych plikach bez limitu.
