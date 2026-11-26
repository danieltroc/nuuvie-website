# Przepięcie nuuvie.com z Webflow na nową stronę

Instrukcja krok po kroku. Nie trzeba się znać na DNS: każdy krok mówi, **gdzie kliknąć**, **co wpisać** i **jak sprawdzić**, że się udało.

## Jak to działa (w 30 sekund)

- **Domena** `nuuvie.com` jest kupiona w **OVH** i tam zostaje (płacisz za nią dalej w OVH).
- **DNS** to „książka adresowa” domeny: mówi, gdzie jest strona, a gdzie poczta. Dziś prowadzi ją OVH. Przeniesiemy ją do **Cloudflare**, bo tam działa nowa strona.
- **Poczta** `hej@nuuvie.com` zostaje w OVH. Kopiujemy tylko jej wpisy do Cloudflare, nic w samej poczcie się nie zmienia.
- **Nowa strona** już działa w Cloudflare pod adresem podglądu `https://nuuvie-website.daniel-troc.workers.dev`. Na koniec podpinamy pod nią `www.nuuvie.com`.

Najważniejsza zasada: **stara strona w Webflow działa cały czas**, aż do ostatniego kroku przepięcia. Dzięki temu nie ma przerwy w działaniu strony.

## Plan w czasie

| Kiedy | Co | Ile trwa |
| --- | --- | --- |
| **Dzień 0** | Krok 1: kopia DNS. Krok 2: wyłączenie DNSSEC | 15 min |
| *czekasz 24 h* | | |
| **Dzień 1** | Krok 3: domena w Cloudflare. Krok 4: zmiana serwerów DNS w OVH | 30 min |
| *czekasz, aż Cloudflare napisze „Active” (zwykle 1–2 h, max 24 h)* | | |
| **Dzień 1–2** | Krok 5: podpięcie strony. Krok 6: formularz. Krok 7: testy. Krok 8: Google | 1–1,5 h |
| **Po tygodniu** | Krok 9: DNSSEC z powrotem. Krok 10: wyłączenie Webflow | 20 min |

Najlepiej zacząć w dzień roboczy rano, żeby mieć czas na sprawdzenie poczty.

Co **musisz zrobić sam** (logowania, płatności): OVH, Cloudflare, Resend, Google Search Console, Webflow. Co **robię ja**: kod, konfiguracja w repozytorium, sprawdzenie, czy wszystko gra. Jeśli w którymś kroku coś wygląda inaczej niż w opisie, zrób zrzut ekranu i wklej mi go.

---

## Krok 1. Kopia zapasowa DNS z OVH (Dzień 0, 5 min)

Zapisujesz obecne wpisy DNS. Przydadzą się w kroku 3 do porównania i gdyby trzeba było coś cofnąć.

1. Zaloguj się na <https://www.ovh.com/manager/>.
2. Na górze wybierz **Web Cloud**, po lewej **Nazwy domen** → kliknij **nuuvie.com**.
3. Zakładka **Strefa DNS**.
4. Po prawej (albo pod tabelą) kliknij **Zmień w trybie tekstowym** (*Change in text format*).
5. Zaznacz cały tekst w okienku (Cmd + A), skopiuj (Cmd + C) i wklej do nowego pliku w Notatkach albo TextEdit. Zapisz jako `strefa-dns-ovh.txt`.
6. **Zamknij okienko bez zapisywania** (Anuluj).

✅ Masz plik z listą wpisów. Możesz go też wkleić mi w czacie, porównam go z tym, co zobaczysz w Cloudflare.

## Krok 2. Wyłączenie DNSSEC w OVH (Dzień 0, 2 min + 24 h czekania)

DNSSEC to zabezpieczenie podpisujące wpisy DNS. Gdy jest włączone w OVH, a DNS przeniesiemy do Cloudflare, **domena przestanie działać** (strona i poczta). Dlatego wyłączamy je dzień wcześniej. Po przeniesieniu włączymy je z powrotem, już w Cloudflare (krok 9).

1. OVH → **Web Cloud → Nazwy domen → nuuvie.com**.
2. Zakładka **Informacje ogólne**. W sekcji **Bezpieczeństwo** znajdź **DNSSEC** i przestaw przełącznik na **wyłączone** (albo zakładka **DNSSEC → Wyłącz**, zależnie od wersji panelu).
3. Potwierdź.

⏳ **Odczekaj 24 godziny**, zanim przejdziesz do kroku 4. (Krok 3 możesz zrobić wcześniej.)

✅ Po 24 h status DNSSEC w OVH pokazuje „wyłączone”, bez komunikatu „w trakcie”.

## Krok 3. Dodanie domeny w Cloudflare (Dzień 1, 15 min)

1. Zaloguj się na <https://dash.cloudflare.com> (to samo konto, na którym działa podgląd strony).
2. Po lewej **Account home** (Strona główna konta) → przycisk **Onboard a domain** (albo **Add a domain**).
3. Wpisz `nuuvie.com`. Zostaw zaznaczone **Quick scan for DNS records**. Kliknij **Continue**.
4. Wybierz plan **Free** (na dole listy) → **Continue**.
5. Cloudflare pokaże listę skopiowanych wpisów DNS. **Teraz porównaj ją z plikiem z kroku 1.**

   Muszą być na pewno (poczta):

   | Typ | Nazwa | Wartość | Uwagi |
   | --- | --- | --- | --- |
   | MX | `nuuvie.com` (albo `@`) | `mx1.mail.ovh.net` | priorytet 1 |
   | MX | `nuuvie.com` | `mx2.mail.ovh.net` | priorytet 5 |
   | MX | `nuuvie.com` | `mx3.mail.ovh.net` | priorytet 100 |
   | TXT | `nuuvie.com` | `v=spf1 include:_spf.mlsend.com include:mx.ovh.com -all` | SPF |

   Oprócz tego sprawdź w pliku z kroku 1 **każdy wpis TXT i CNAME** i dopisz brakujące. Najczęściej skaner pomija:
   - `google-site-verification=...` (TXT): weryfikacja Google Search Console. **Ważne**, bez niego Search Console przestanie widzieć domenę.
   - wpisy z `_domainkey` w nazwie (DKIM, np. MailerLite): podpis maili z newslettera;
   - `autodiscover`, `autoconfig`, `_autodiscover._tcp` (SRV): automatyczna konfiguracja poczty w programach pocztowych.

   Jak dopisać brakujący wpis: **Add record** → wybierz typ (TXT, CNAME, MX…) → w polu **Name** wpisz nazwę **bez** `.nuuvie.com` na końcu (np. dla `ml._domainkey.nuuvie.com` wpisz `ml._domainkey`; dla samej domeny wpisz `@`) → w **Content** wartość → **Save**.

6. **Pomarańczowa i szara chmurka** (kolumna *Proxy status*):
   - wszystkie wpisy **MX, TXT, SRV** i wpisy poczty: **szara chmurka** (*DNS only*);
   - dwa wpisy starej strony Webflow **zostaw na razie bez zmian**, tylko przestaw je na **szarą chmurkę** (*DNS only*):
     - `A` `nuuvie.com` → `198.202.211.1`
     - `CNAME` `www` → `cdn.webflow.com`

     Dzięki temu po przełączeniu stara strona dalej działa. Usuniemy je w kroku 5.
7. **Continue to activation**. Cloudflare pokaże **dwa serwery nazw**, np. `ada.ns.cloudflare.com` i `bob.ns.cloudflare.com`. Zostaw tę kartę otwartą albo przepisz je.

✅ W Cloudflare lista wpisów zgadza się z plikiem z OVH, MX i TXT mają szarą chmurkę.

## Krok 4. Zmiana serwerów DNS w OVH (Dzień 1, 5 min + czekanie)

Uwaga: tylko jeśli od kroku 2 minęły **24 godziny**.

1. OVH → **Web Cloud → Nazwy domen → nuuvie.com** → zakładka **Serwery DNS**.
2. **Zmień serwery DNS**.
3. Wybierz opcję **Użyj własnych serwerów DNS** (*external DNS*).
4. W miejsce obecnych (`dns102.ovh.net` i `ns102.ovh.net`) wpisz **dwa serwery z Cloudflare** z kroku 3, każdy w osobnym polu. Usuń stare, jeśli zostały na liście.
5. **Zastosuj konfigurację** → potwierdź.
6. Wróć do Cloudflare → przy domenie kliknij **Check nameservers now**.

⏳ Zmiana działa zwykle w ciągu 1–2 godzin, maksymalnie do 24 h. W tym czasie **wszystko działa jak dotąd** (stara strona, poczta). Cloudflare wyśle e-mail „nuuvie.com is now active on a Cloudflare Free plan”.

✅ W Cloudflare przy `nuuvie.com` jest zielony status **Active**.

Przy okazji: wyślij maila na `hej@nuuvie.com` z innej skrzynki (np. Gmail) i odpowiedz na niego. Jeśli dochodzi i wychodzi, poczta jest bezpieczna.

## Krok 5. Podpięcie domeny pod nową stronę (Dzień 1–2, 15 min)

Tu stara strona zostaje zastąpiona nową. Trwa to kilka minut.

### 5a. Usuń wpisy Webflow

1. Cloudflare → wybierz domenę **nuuvie.com** → **DNS → Records**.
2. Przy wpisie `A nuuvie.com 198.202.211.1` kliknij **Edit → Delete**.
3. To samo dla `CNAME www cdn.webflow.com`.

(Od tej chwili do końca kroku 5b strona pod nuuvie.com nie działa, dlatego od razu przejdź dalej.)

### 5b. Podepnij domeny pod stronę

1. Po lewej **Workers & Pages** (albo **Compute (Workers)**) → kliknij **nuuvie-website**.
2. **Settings → Domains & Routes → Add → Custom domain**.
3. Wpisz `www.nuuvie.com` → **Add domain**.
4. Powtórz dla `nuuvie.com` (bez www).

Cloudflare sam utworzy wpisy DNS i certyfikat SSL. Status zmieni się z *Initializing* na **Active** w ciągu kilku minut.

### 5c. Przekierowanie nuuvie.com → www.nuuvie.com

Strona ma jeden główny adres: `https://www.nuuvie.com` (tak jak w Webflow). Adres bez www ma na niego przekierowywać.

1. W domenie **nuuvie.com** → po lewej **Rules → Overview** → **Create rule → Redirect Rule**.
2. Wybierz szablon **Redirect from Root to WWW** (*Przekierowanie z domeny głównej na WWW*).
3. Sprawdź, że:
   - warunek: *Hostname equals* `nuuvie.com`;
   - cel: `https://www.nuuvie.com` + ścieżka (*Preserve path* / *dynamic*), z zachowaniem parametrów (*Preserve query string* zaznaczone);
   - kod: **301**.
4. **Deploy**.

### 5d. Zawsze HTTPS

1. W domenie **nuuvie.com** → **SSL/TLS → Edge Certificates**.
2. **Always Use HTTPS** → **On**.

✅ `https://www.nuuvie.com` pokazuje nową stronę. `http://nuuvie.com/blog` przekierowuje na `https://www.nuuvie.com/blog`.

## Krok 6. Formularz kontaktowy (Dzień 1–2, 30 min)

Formularz na `/kontakt` potrzebuje dwóch usług:
- **Turnstile** (Cloudflare, darmowe): niewidzialna ochrona przed botami;
- **Resend** (darmowe do 3000 maili/mies.): wysyła wiadomość z formularza na `hej@nuuvie.com`.

Do czasu tego kroku formularz pokazuje komunikat „Nie udało się wysłać” z adresem e-mail, więc nikt nie zostanie bez kontaktu.

### 6a. Turnstile

1. Cloudflare → po lewej **Turnstile** (bywa w grupie *Application security* / *Protect & connect*) → **Add widget**.
2. Ustawienia:
   - **Widget name:** `Nuuvie formularz`
   - **Hostnames:** `nuuvie.com` oraz `nuuvie-website.daniel-troc.workers.dev` (każdy jako osobny wpis)
   - **Widget mode:** **Managed**
   - **Pre-clearance:** **No**
3. **Create**. Zobaczysz dwa klucze: **Site Key** i **Secret Key**. Nie zamykaj tej strony.
4. **Site Key** (jawny):
   - **Workers & Pages → nuuvie-website → Settings → Build → Variables and secrets → Add**;
   - nazwa `PUBLIC_TURNSTILE_SITE_KEY`, wartość: Site Key, typ **Text** → **Save**.
5. **Secret Key** (tajny):
   - **Workers & Pages → nuuvie-website → Settings → Variables and Secrets → Add**;
   - typ **Secret**, nazwa `TURNSTILE_SECRET`, wartość: Secret Key → **Deploy**.

### 6b. Resend

1. Załóż konto na <https://resend.com/signup>.
2. **Domains → Add Domain**:
   - **Name:** `formularz.nuuvie.com` (osobna subdomena, żeby nie ruszać ustawień Twojej poczty w OVH);
   - **Region:** **Ireland (eu-west-1)**, żeby dane zostały w UE.
3. Resend pokaże 3–4 wpisy DNS do dodania (typy **MX** i **TXT**, czasem opcjonalny DMARC). Dodaj każdy w Cloudflare:
   - domena **nuuvie.com → DNS → Records → Add record**;
   - **Type** jak w Resend;
   - **Name**: to, co pokazuje Resend, ale **bez** `.nuuvie.com` na końcu (np. `send.formularz`, `resend._domainkey.formularz`);
   - **Content** / **Mail server** / **Priority**: skopiuj z Resend (przycisk kopiowania obok wartości);
   - **Proxy status: szara chmurka (DNS only)** → **Save**.
4. W Resend kliknij **Verify DNS Records**. Po kilku minutach domena ma status **Verified**.
5. **API Keys → Create API Key**:
   - **Name:** `nuuvie-website`
   - **Permission:** **Sending access**
   - **Domain:** `formularz.nuuvie.com`
   - **Add**. Skopiuj klucz, zaczyna się od `re_`. **Pokazuje się tylko raz.** Nie wklejaj go do czatu ani nigdzie indziej.
6. Cloudflare → **Workers & Pages → nuuvie-website → Settings → Variables and Secrets → Add** → typ **Secret**, nazwa `RESEND_API_KEY`, wartość: klucz z Resend → **Deploy**.

### 6c. Przebudowa strony

Klucz Turnstile (Site Key) wchodzi do strony przy budowaniu, więc trzeba ją raz przebudować:

- **Workers & Pages → nuuvie-website → Deployments** → przy najnowszym wdrożeniu **⋯ → Retry deployment**;
- albo napisz mi „przebuduj”, a wypchnę pusty commit.

Po 1–2 minutach nowa wersja jest online.

✅ Wyślij wiadomość przez `https://www.nuuvie.com/kontakt`. W ciągu minuty przychodzi na `hej@nuuvie.com` od „Formularz Nuuvie”. „Odpowiedz” odpisuje od razu osobie z formularza. (Za pierwszym razem zajrzyj do spamu.)

## Krok 7. Testy (Dzień 1–2, 15 min)

Odhacz po kolei:

- [ ] `https://www.nuuvie.com`: nowa strona, kłódka w pasku adresu.
- [ ] `nuuvie.com`, `http://nuuvie.com`, `http://www.nuuvie.com`: wszystkie kończą na `https://www.nuuvie.com`.
- [ ] Stare adresy z Google działają, np. `https://www.nuuvie.com/blog-posts/jak-wybrac-ux-ui-designera` i `https://www.nuuvie.com/work/tedee`. (Sprawdziłem lokalnie wszystkie 32 adresy ze starej mapy strony.)
- [ ] `https://www.nuuvie.com/spotkanie` przekierowuje do cal.com.
- [ ] Przełącznik PL / EN w menu działa.
- [ ] Formularz kontaktowy: wiadomość dochodzi (krok 6).
- [ ] Poczta: mail na `hej@nuuvie.com` z Gmaila dochodzi, odpowiedź wychodzi.
- [ ] Newsletter MailerLite (jeśli wysyłasz): testowa wysyłka do siebie nie ląduje w spamie.
- [ ] Umami (<https://cloud.umami.is>): po wejściu na stronę w zakładce **Realtime** widać wizytę. Umami jest już w kodzie z tym samym identyfikatorem co w Webflow, więc statystyki lecą dalej bez przerwy.

Jeśli cokolwiek nie działa: zrzut ekranu do mnie. Plan B na końcu dokumentu.

## Krok 8. Google Search Console (Dzień 1–2, 5 min)

1. <https://search.google.com/search-console> → wybierz usługę `nuuvie.com`.
2. Jeśli Google pyta o ponowną weryfikację: brakuje wpisu TXT `google-site-verification` z kroku 3. Dopisz go w Cloudflare (DNS → Add record → TXT, Name `@`).
3. Po lewej **Mapy witryn** → wpisz `sitemap-index.xml` → **Prześlij**.
4. Stara mapa (`sitemap.xml` z Webflow), jeśli jest na liście: zostaw, sama wygaśnie.

Przez następny tydzień zaglądaj do **Strony** (indeksowanie) i **Ulepszenia**. Jeśli pojawią się błędy 404, wklej mi adresy, dodam przekierowania.

## Krok 9. DNSSEC z powrotem (po tygodniu, 10 min)

1. Cloudflare → domena **nuuvie.com** → **DNS → Settings** → **DNSSEC → Enable DNSSEC**.
2. Cloudflare pokaże dane rekordu DS. Potrzebujesz: **Key Tag**, **Algorithm** (zwykle 13), **Flags** (257) i **Public Key**.
3. OVH → **Web Cloud → Nazwy domen → nuuvie.com** → zakładka **Rekordy DS** (*DS Records*) → **Zmień** → **+** → przepisz:
   - Key Tag (Etykieta klucza);
   - Flag: 257;
   - Algorithm: 13;
   - Public key (Klucz publiczny).

   Zapisz.
4. Po kilku godzinach Cloudflare pokaże przy DNSSEC status **Active** (czasem do 24 h).

## Krok 10. Wyłączenie Webflow (po tygodniu, 5 min)

Dopiero gdy przez tydzień wszystko działa:

1. Webflow → projekt strony → **Site settings → Publishing** → w **Custom domains** usuń `nuuvie.com` i `www.nuuvie.com`.
2. **Site settings → Billing / Plans** → anuluj **Site plan** (hosting). Konto Webflow i projekt mogą zostać (darmowy plan), na wszelki wypadek.

Nic z Webflow nie jest już potrzebne: treści są w Sanity, obrazki w projekcie.

## Dodatkowo: nuuvie.pl → www.nuuvie.com (kiedykolwiek, 15 min)

Niezależne od nuuvie.com, można zrobić od razu. Dziś `nuuvie.pl` pokazuje stronę „w budowie” od OVH i nie działa przez https. Po tych krokach każdy adres na `nuuvie.pl` i `www.nuuvie.pl` (także przez https) przekieruje na `https://www.nuuvie.com`. DNSSEC na `nuuvie.pl` jest wyłączony, więc nie trzeba na nic czekać.

1. **Cloudflare → Add a domain** → wpisz `nuuvie.pl` → plan **Free** → zostaw import rekordów.
2. **Sprawdź zaimportowane rekordy** (DNS → Records):
   - **zostaw** pocztę bez zmian: 3 × `MX` (`mx1/mx2/mx3.mail.ovh.net`) i `TXT` z `v=spf1 include:mx.ovh.com -all`;
   - **usuń** `A` dla `nuuvie.pl` i `www` z adresem `213.186.33.5` (to przekierowanie OVH) i `TXT` z treścią `1|www.nuuvie.pl`;
   - **dodaj** dwa rekordy, oba z pomarańczową chmurką (**Proxied**):
     - Type `A`, Name `@`, IPv4 `192.0.2.1`
     - Type `A`, Name `www`, IPv4 `192.0.2.1`

     (to adres zastępczy: ruch i tak przechwyci reguła z kroku 3).
3. **Rules → Redirect Rules → Create rule:**
   - nazwa: `nuuvie.pl → nuuvie.com`;
   - **All incoming requests**;
   - Then: **Static**, URL `https://www.nuuvie.com`, status **301**;
   - Deploy.
4. **OVH → Domeny → nuuvie.pl → Serwery DNS → Modyfikuj serwery DNS:** wpisz dwa serwery, które Cloudflare pokaże dla `nuuvie.pl` (mogą być inne niż dla nuuvie.com) → Zastosuj konfigurację.
5. Po kilku godzinach (zwykle szybciej) Cloudflare przestawi `nuuvie.pl` na **Active** (przyjdzie mail). Test: <https://nuuvie.pl> i <http://www.nuuvie.pl> mają otworzyć www.nuuvie.com.

Poczta na `@nuuvie.pl` (jeśli jest) działa dalej, bo rekordy MX i SPF zostają takie same.

## Plan B: jak wrócić do starej strony

**Przed krokiem 10** (Webflow jeszcze opłacony):

1. Cloudflare → **Workers & Pages → nuuvie-website → Settings → Domains & Routes** → usuń `www.nuuvie.com` i `nuuvie.com`.
2. Cloudflare → **nuuvie.com → DNS → Records → Add record**:
   - `A`, Name `@`, IPv4 `198.202.211.1`, szara chmurka;
   - `CNAME`, Name `www`, Target `cdn.webflow.com`, szara chmurka.
3. W **Rules** wyłącz przekierowanie root → www (Webflow robi je sam).

Po kilku minutach działa stara strona. Poczty to nie dotyczy, ona działa cały czas.

**Awaryjnie, gdyby nie działało nic** (ani strona, ani poczta): OVH → **Serwery DNS** → przywróć `dns102.ovh.net` i `ns102.ovh.net`. Zadziała do 24 h. Jeśli DNSSEC był już włączony w Cloudflare (krok 9), najpierw usuń rekord DS w OVH.

---

## Na co dzień (po starcie)

- **Zmiana treści:** Sanity → Publish. Strona przebudowuje się sama (ok. 2 min), jeśli jest ustawiony deploy hook (poniżej).
- **Zmiana kodu:** `git push` na `main`. Cloudflare buduje i publikuje sam.
- **Podgląd lokalny jak na Cloudflare:** `npm run preview:cf` → <http://localhost:8787>.
- **Strony tylko lokalne** (np. `/fonty` do premiery): `astro dev` → <http://localhost:4321/fonty>.

### Automatyczna publikacja po zmianie w Sanity (jeśli jeszcze nie ustawione)

1. Cloudflare → **Workers & Pages → nuuvie-website → Settings → Builds → Deploy Hooks → Create**: nazwa `Sanity`, gałąź `main`. Skopiuj adres. **To sekret**: nie wklejaj go do repozytorium ani do czatu.
2. <https://www.sanity.io/manage> → projekt Nuuvie → **API → Webhooks → Create webhook**:
   - Name: `Cloudflare build`
   - URL: adres z punktu 1
   - Dataset: `production`
   - Trigger on: Create, Update, Delete
   - Filter: `_type in ["post", "project", "legalPage", "homePage", "aboutPage", "designerZonePage"]`
   - HTTP method: `POST`
   - Drafts: wyłączone
3. Test: popraw przecinek w Sanity → Publish. W Cloudflare w **Deployments** pojawi się nowe budowanie.

### Co jest w repozytorium

| Plik | Co robi |
| --- | --- |
| `wrangler.jsonc` | konfiguracja Cloudflare: pliki z `dist/`, formularz (`/api/contact`), limit 3 wysyłek na minutę, adres odbiorcy i nadawcy formularza |
| `worker/index.ts` | obsługa formularza: ochrona przed spamem, Turnstile, wysyłka przez Resend |
| `public/_redirects` | przekierowania 301 (`/spotkanie`, stare wpisy „EN” z polskim tekstem) |
| `public/_headers` | cache i nagłówki bezpieczeństwa |
| `src/layouts/Base.astro` | Umami (liczy tylko na `www.nuuvie.com`) |
| `.dev.vars` | klucze testowe do lokalnego formularza (nie trafia do repozytorium) |

Limity planu Free: 100 000 wywołań formularza dziennie, 500 budowań miesięcznie, ruch na stronie bez limitu.
