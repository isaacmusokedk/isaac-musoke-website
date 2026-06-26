# Isaac Musoke — Website

Personlig hjemmeside for Isaac Musoke. Bygget med Astro, hostet på Netlify, med Decap CMS til projektstyring.

---

## Kom hurtigt i gang

### Forudsætninger

- Node.js 20 eller nyere — hent det fra [nodejs.org](https://nodejs.org/)
- npm (følger med Node.js)

### Kør lokalt

```bash
# 1. Installer afhængigheder
npm install

# 2. Start udviklingsserveren
npm run dev
```

Åbn derefter [http://localhost:4321](http://localhost:4321) i din browser.

---

## Tilføj et nyt projekt (GitHub web UI — ingen kode nødvendig)

1. Gå til dit GitHub-repository i browseren.
2. Naviger til mappen `src/content/projects/`.
3. Klik på **Add file** → **Create new file**.
4. Giv filen et navn i formatet `projekt-navn.md` — kun små bogstaver og bindestreger.
5. Kopiér skabelonen herunder og udfyld felterne:

```markdown
---
title: "Dit projekttitel"
slug: "dit-projekttitel"
year: 2024
category: "Musik"
role: "Instruktør & DOP"
client: "Klientnavn"
poster: "/images/poster-dit-projekt.jpg"
embed_url: "https://player.vimeo.com/video/DIT_VIMEO_ID"
clip_url: ""
stills:
  - "/images/still-dit-projekt-01.jpg"
  - "/images/still-dit-projekt-02.jpg"
featured: false
excerpt: "Kort beskrivelse af projektet på 1-2 sætninger."
---

Skriv din fulde projektbeskrivelse her i Markdown-format.

## Overskrift

Tekst...
```

6. Klik **Commit new file** — Netlify bygger og udgiver automatisk inden for 1-2 minutter.

### Upload billeder til projektet

Gå til mappen `public/images/` i GitHub og klik **Add file** → **Upload files**. Upload din poster og stills. Brug de samme filnavne som du angav i frontmatter.

---

## Brug Decap CMS (alternativ til GitHub web UI)

1. Gå til `https://isaacmusoke.netlify.app/admin/`
2. Log ind med din Netlify Identity e-mail og adgangskode
3. Klik på **Projekter** → **Nyt projekt**
4. Udfyld formularen og klik **Publicer**

CMS'et gemmer direkte i GitHub og Netlify bygger automatisk.

> Første gang du logger ind på `/admin/`: gå til Netlify Dashboard → Site → Identity → Enable Identity. Tilføj din e-mail under Invite users. Sæt External providers til GitHub hvis ønsket.

---

## Mappestruktur

```
isaac-musoke-website/
├── public/
│   ├── fonts/          ← Space Grotesk og Inter .woff2-filer (tilføj selv)
│   ├── images/         ← Projektbilleder, posters og stills
│   └── admin/          ← Decap CMS bootstrap (redigér ikke)
├── src/
│   ├── components/     ← Genbrugelige UI-komponenter (SiteNav, SiteFooter, ProjectCard)
│   ├── content/
│   │   └── projects/   ← Ét .md-fil per projekt — her tilføjer du nyt indhold
│   ├── layouts/        ← BaseLayout.astro — bruges af alle sider
│   ├── pages/          ← Sidefiler: index, work, about, contact, 404
│   └── styles/
│       └── global.css  ← Designtokens, @font-face, reset — redigér ikke uden grund
├── astro.config.mjs
├── netlify.toml
└── package.json
```

---

## Fonts — vigtig handling inden deploy

Fontfilerne er **ikke** inkluderet i dette repository (Google Fonts-licens tillader selvhosting, men filerne skal hentes manuelt).

Download disse filer fra [Google Fonts](https://fonts.google.com/) eller brug [google-webfonts-helper](https://gwfh.mranftl.com/fonts):

| Fil | Font | Vægt |
|-----|------|------|
| `SpaceGrotesk-Light.woff2` | Space Grotesk | 300 |
| `SpaceGrotesk-Medium.woff2` | Space Grotesk | 500 |
| `SpaceGrotesk-Bold.woff2` | Space Grotesk | 700 |
| `Inter-Regular.woff2` | Inter | 400 |
| `Inter-Medium.woff2` | Inter | 500 |
| `Inter-SemiBold.woff2` | Inter | 600 |

Placer alle seks filer i mappen `public/fonts/`.

---

## Opdater hero-videoen på forsiden

Åbn `src/pages/index.astro` og find denne linje:

```js
const heroVideoId = '000000000';
```

Erstat `000000000` med dit Vimeo video-ID. Du finder ID'et i Vimeo-URL'en — fx `https://vimeo.com/123456789` → ID er `123456789`.

---

## Byg til produktion

```bash
npm run build
```

Output lander i `dist/`. Netlify kører dette automatisk ved hvert push til `main`-branchen.
