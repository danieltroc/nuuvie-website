# Migracja nuuvie.com z Webflow na OVH

Plan przeniesienia strony z Webflow na hosting OVH tak, żeby nic nie zginęło: adresy, pozycje w Google, poczta.
Stan sprawdzony 12.11.2026.

## Co jest teraz

| Element | Gdzie | Uwaga |
| --- | --- | --- |
| Domena nuuvie.com | OVH (rejestrator) | zostaje |
| DNS | OVH (`dns102.ovh.net`, `ns102.ovh.net`) | tu będziemy przełączać |
| Strona | Webflow: `www` → CNAME `cdn.webflow.com`, `nuuvie.com` → A `198.202.211.1` | to zmieniamy |
| Poczta hej@nuuvie.com | OVH (`mx1/mx2/mx3.mail.ovh.net`) | **nie ruszać** |
| SPF | `include:_spf.mlsend.com include:mx.ovh.com` (MailerLite + OVH) | **nie ruszać** |
| Adres główny | `https://www.nuuvie.com`, adresy bez ukośnika na końcu (`/blog`, nie `/blog/`) | zachowujemy dokładnie tak samo |

Nowa strona to Astro, które buduje zwykłe pliki HTML/CSS/JS (folder `dist/`, ok. 3 MB). Nie potrzebuje PHP, Node.js ani bazy danych na serwerze, więc działa na każdym hostingu OVH, także najtańszym.

## Najważniejsze ryzyko: adresy

Google zna 32 adresy obecnej strony. Każdy z nich po migracji musi albo działać pod tym samym adresem, albo przekierowywać (301) na nowy. Inaczej tracimy pozycje i linki.

Obecnie nowa strona ma tylko stronę główną (PL/EN), `/strefa-designera` i `/fonty`. Brakuje:

| Obecny adres | Co zrobić przed startem |
| --- | --- |
| `/blog`, `/en/blog` | zbudować listę wpisów |
| `/blog-posts/…` (6 wpisów PL) | przenieść treść, **te same adresy** |
| `/en/blog-posts/…` (6 wpisów EN) | przenieść treść, te same adresy |
| `/work/tedee`, `/work/old-craft-barbershop`, `/work/netwise` (+ EN) | zbudować podstrony case studies |
| `/o-nuuvie`, `/en/o-nuuvie` | zbudować albo przekierować na `/#about` |
| `/kontakt`, `/en/kontakt` | zbudować albo przekierować na `/#contact` |
| `/legal/polityka-prywatnosci`, `/legal/regulamin` (+ EN `/en/legal/terms-of-service`) | **przenieść obowiązkowo** (wymóg prawny) |
| `/en/strefa-designera` | zbudować wersję EN albo przekierować na `/strefa-designera` |
| `/spotkanie` (link w przyciskach, nie ma go w mapie strony) | przekierować na `https://cal.com/nuuvie/15-minutowa-konsultacja` |

Pełna lista adresów: mapa strony `https://www.nuuvie.com/sitemap.xml`.

## Plan w 6 krokach

### 1. Decyzje i porządek w projekcie (1 dzień)

- [ ] Wariant **Next** staje się stroną główną `/` (i `/en/`).
- [ ] Usunąć warianty z `/design/…` i przełącznik wariantów (zostają w gicie pod tagiem `warianty-2026-11-12`).
- [ ] Ustalić, czy sprzedaż fontów (`/fonty`) startuje razem ze stroną, czy później.

### 2. Brakujące treści (największa część pracy)

- [ ] **Blog:** wyeksportować kolekcję z Webflow (CMS → Export CSV), zamienić na pliki Markdown w `src/content/blog/` (kolekcja treści Astro), zachować slugi 1:1. Dotyczy PL i EN.
- [ ] **Obrazki:** pobrać wszystkie obrazki z `cdn.prod.website-files.com` do projektu. **Po wyłączeniu Webflow ten CDN przestanie działać.**
- [ ] **Case studies:** Tedee, Old Craft, Netwise (PL + EN).
- [ ] **Strony prawne:** polityka prywatności i regulamin (PL + EN). Po migracji zaktualizować politykę: hosting OVH zamiast Webflow, ewentualnie nowa analityka.
- [ ] **O Nuuvie, Kontakt, EN Strefa Designera:** zbudować albo przekierować (patrz tabela wyżej).
- [ ] Na obecnej `/kontakt` nie znalazłem formularza Webflow. Jeśli jakiś jest, potrzebny zamiennik (np. formularz PHP na OVH albo Formspree).

### 3. Przygotowanie techniczne pod serwer OVH (Apache)

- [ ] **Adresy bez ukośnika**, żeby były identyczne jak w Webflow. W `astro.config.mjs`:
  ```js
  trailingSlash: 'never',
  build: { format: 'file' },   // /blog → dist/blog.html
  ```
- [ ] **Plik `public/.htaccess`** (Apache na OVH go czyta):
  ```apache
  RewriteEngine On
  # /en i /en/blog są jednocześnie plikiem (en.html) i folderem (en/) — nie dokładaj ukośnika
  DirectorySlash Off

  # Zawsze HTTPS i www (jak teraz w Webflow)
  RewriteCond %{HTTPS} off [OR]
  RewriteCond %{HTTP_HOST} ^nuuvie\.com$ [NC]
  RewriteRule ^ https://www.nuuvie.com%{REQUEST_URI} [L,R=301]

  # Przekierowania stron, których nie przenosimy 1:1
  Redirect 301 /spotkanie https://cal.com/nuuvie/15-minutowa-konsultacja
  # Redirect 301 /o-nuuvie /#about      ← tylko jeśli nie budujemy tej strony

  # /blog/ → /blog (jeden kanoniczny adres, jak w Webflow)
  RewriteRule ^(.+)/$ /$1 [L,R=301]

  # /blog → blog.html (adresy bez .html i bez ukośnika)
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME}.html -f
  RewriteRule ^(.+)$ $1.html [L]

  # Stare adresy z .html → czyste
  RewriteCond %{THE_REQUEST} \s/+(.+?)\.html[\s?] [NC]
  RewriteRule ^ /%1 [L,R=301]

  ErrorDocument 404 /404.html

  # Cache: pliki z hashem w nazwie na rok, HTML zawsze świeży
  <IfModule mod_expires.c>
    ExpiresActive On
    ExpiresByType text/html "access plus 0 seconds"
    ExpiresByType text/css "access plus 1 year"
    ExpiresByType application/javascript "access plus 1 year"
    ExpiresByType image/jpeg "access plus 1 month"
    ExpiresByType image/webp "access plus 1 month"
    ExpiresByType image/svg+xml "access plus 1 month"
    ExpiresByType font/woff2 "access plus 1 year"
  </IfModule>
  <IfModule mod_deflate.c>
    AddOutputFilterByType DEFLATE text/html text/css application/javascript image/svg+xml
  </IfModule>
  ```
- [ ] **Mapa strony:** dodać `@astrojs/sitemap` i `public/robots.txt`.
- [ ] **Strona 404** (`src/pages/404.astro`).
- [ ] **Fonty Google na `/fonty`:** pobrać i trzymać u siebie. Ładowanie z serwerów Google bez zgody to w UE ryzyko RODO.
- [ ] **Licencja BDO Grotesk:** sprawdzić, czy pozwala na samodzielny hosting pliku na stronie (w Webflow mogła być inna sytuacja).
- [ ] **Font:** przekonwertować `BDOGrotesk-VF.ttf` (289 KB) na `.woff2`.
- [ ] **Analityka (jeśli potrzebna):** na obecnej stronie nie znalazłem żadnej. Jeśli ma być, najprościej Plausible lub Umami (bez banera cookies).

### 4. Hosting OVH i automatyczne wgrywanie z GitHuba

**Jaki hosting:** wystarczy dowolny hosting WWW OVH (Perso / Pro / Performance). Pro i wyżej daje dostęp SSH, co przyspiesza wgrywanie, ale nie jest konieczne. Jeśli masz już hosting z pocztą, możesz użyć go.

**Konfiguracja w panelu OVH:**
- [ ] Hosting → **Multisite** → dodać `nowa.nuuvie.com` wskazujący na folder np. `www-nowa/` (wersja testowa).
- [ ] Docelowo dodać `www.nuuvie.com` i `nuuvie.com` wskazujące na folder `www/`.
- [ ] Zanotować dane FTP (Hosting → FTP-SSH): serwer `ftp.clusterXXX.hosting.ovh.net`, login, hasło.

**Automatyczne wgrywanie (GitHub Actions):** każdy `git push` na `main` buduje stronę i wgrywa ją na OVH. Plik `.github/workflows/deploy.yml`:

```yaml
name: Deploy na OVH
on:
  push:
    branches: [main]
  workflow_dispatch:

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 24
          cache: npm
      - run: npm ci
      - run: npm run build
      - name: Wgraj na OVH (FTPS)
        uses: SamKirkland/FTP-Deploy-Action@v4.3.5
        with:
          server: ${{ secrets.OVH_FTP_HOST }}
          username: ${{ secrets.OVH_FTP_USER }}
          password: ${{ secrets.OVH_FTP_PASSWORD }}
          protocol: ftps
          local-dir: ./dist/
          server-dir: ${{ secrets.OVH_FTP_DIR }}   # najpierw www-nowa/, po starcie www/
```

- [ ] W GitHubie: repozytorium → Settings → Secrets and variables → Actions → dodać `OVH_FTP_HOST`, `OVH_FTP_USER`, `OVH_FTP_PASSWORD`, `OVH_FTP_DIR`. **Hasła nie wpisujemy do kodu.**
- [ ] Na hostingu Pro+ można zamiast FTP użyć `rsync` po SSH (szybsze, kasuje usunięte pliki).

### 5. Wersja testowa i sprawdzenie

- [ ] W DNS OVH dodać `nowa.nuuvie.com` (OVH zrobi to sam przy Multisite) i włączyć dla niej SSL Let's Encrypt.
- [ ] Zablokować wersję testową przed Google: hasło (`.htpasswd`) albo `noindex`.
- [ ] Sprawdzić **wszystkie 32 adresy** z obecnej mapy strony: każdy ma zwrócić 200 albo 301 na sensowną stronę, żaden 404.
- [ ] Sprawdzić telefon, formularze/linki płatności (easy.tools, cal.com), polskie znaki, 404.

### 6. Przełączenie domeny (dzień startu)

Dzień wcześniej:
- [ ] W strefie DNS OVH obniżyć TTL rekordów `www` i `nuuvie.com` do 300 s (5 min), żeby ewentualny powrót był szybki.
- [ ] Zrobić pełny eksport z Webflow (strony, CMS, obrazki) na wypadek, gdyby czegoś brakowało.

Start (najlepiej wieczorem lub w weekend):
1. W DNS OVH: rekord `www` zmienić z CNAME `cdn.webflow.com` na adres hostingu OVH (OVH podpowiada go w Multisite), rekord A `nuuvie.com` z `198.202.211.1` na IP hostingu OVH.
2. W panelu OVH dla `www.nuuvie.com` i `nuuvie.com` włączyć certyfikat SSL (Let's Encrypt, darmowy). Wystawi się dopiero, gdy DNS już wskazuje na OVH, więc przez kilka–kilkanaście minut może być ostrzeżenie o certyfikacie.
3. Zmienić sekret `OVH_FTP_DIR` na `www/` i uruchomić wgrywanie.
4. Sprawdzić: `https://www.nuuvie.com`, `https://nuuvie.com` (przekierowanie na www), kilka wpisów bloga, `/spotkanie`.
5. **Rekordów MX i SPF nie ruszamy.** Wysłać testowego maila na hej@nuuvie.com.

Plan B: jeśli coś pójdzie źle, przywrócić stare wartości DNS (CNAME `cdn.webflow.com`, A `198.202.211.1`). Przy TTL 300 s strona wraca do Webflow w kilka minut.

### Po starcie

- [ ] Google Search Console: wysłać nową mapę strony, przez 2–4 tygodnie sprawdzać raport „Strony" pod kątem 404.
- [ ] Przywrócić normalny TTL (np. 3600 s).
- [ ] **Webflow wyłączyć dopiero po 2–4 tygodniach**, gdy wszystko działa i obrazki są na pewno przeniesione.
- [ ] Zaktualizować politykę prywatności (hosting OVH).

## Co mogę przygotować w kodzie

Kroki 1, 3 i workflow z kroku 4 to praca w repozytorium i mogę je zrobić od razu. Krok 2 (blog i case studies) zrobię po wyeksportowaniu CSV z Webflow. Kroki w panelu OVH, sekrety GitHuba i zmiana DNS wymagają Twojego logowania.
