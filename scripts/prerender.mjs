// Пререндер для SEO: після `vite build` генерує для кожної сторінки окремий HTML
// (свій title/description/canonical/OG, JSON-LD і готовий текст сторінки для пошукових ботів),
// а також sitemap.xml (з усіма фото), robots.txt і 404.html.
// React на клієнті все одно рендерить сторінку заново — пререндер лише для першого показу і ботів.
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const dist = path.join(root, "dist");
const content = JSON.parse(fs.readFileSync(path.join(root, "src/content/defaultSiteContent.json"), "utf8"));
const seo = JSON.parse(fs.readFileSync(path.join(root, "src/content/seo.json"), "utf8"));
const manifest = JSON.parse(fs.readFileSync(path.join(root, "src/content/photoManifest.json"), "utf8"));
const template = fs.readFileSync(path.join(dist, "index.html"), "utf8");

const SITE = (process.env.SITE_URL || process.env.URL || seo.defaultSiteUrl).replace(/\/+$/, "");
const abs = (p) => (p.startsWith("http") ? p : `${SITE}${p.startsWith("/") ? "" : "/"}${p}`);
const esc = (s = "") => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const clip = (text, max = 160) => {
  const clean = text.replace(/\s+/g, " ").trim();
  return clean.length <= max ? clean : `${clean.slice(0, max - 1).replace(/\s+\S*$/, "")}…`;
};
const today = new Date().toISOString().slice(0, 10);

const heroSlot = manifest.find((slot) => slot.slotId === "home.hero");
const heroImage = `/seed-images/${heroSlot.seedImage}`;
const instagram = content.navigation.socialLinks.filter((s) => s.url.includes("instagram.com")).map((s) => s.url);
const values = content.personalBrand.values.filter((v) => v.slug);

// ---------- JSON-LD ----------
const person = {
  "@type": "Person",
  "@id": `${SITE}/#person`,
  name: "Марія Попілян",
  alternateName: ["Maria Popilian", "Марія Михайлівна Попілян", "m.popilian"],
  url: `${SITE}/`,
  image: abs(heroImage),
  jobTitle: ["Модель", "Хореограф"],
  description: seo.pages.home.description,
  award: content.hero.badge,
  alumniOf: { "@type": "CollegeOrUniversity", name: "Академія культури і мистецтв", address: { "@type": "PostalAddress", addressLocality: "Ужгород", addressCountry: "UA" } },
  affiliation: { "@type": "Organization", name: "Модельна школа «Астар»" },
  knowsAbout: ["Модельна робота", "Подіум", "Хореографія", "Фотосесії"],
  nationality: { "@type": "Country", name: "Україна" },
  sameAs: instagram,
};
const website = { "@type": "WebSite", "@id": `${SITE}/#website`, url: `${SITE}/`, name: seo.siteName, inLanguage: "uk-UA", about: { "@id": `${SITE}/#person` } };
const breadcrumbs = (items) => ({
  "@type": "BreadcrumbList",
  itemListElement: items.map(([name, url], i) => ({ "@type": "ListItem", position: i + 1, name, item: abs(url) })),
});

// ---------- спільна розмітка ----------
const nav = () =>
  `<nav aria-label="Меню"><ul>${content.navigation.links
    .map((l) => `<li><a href="${l.id === "home" ? "/" : `/${l.id}`}">${esc(l.label)}</a></li>`)
    .join("")}</ul></nav>`;
// У пререндері — мініатюри: їх же першими бере React на телефоні (кеш), повні фото є в sitemap
const thumb = (src) => (src.startsWith("/seed-images/") && !src.startsWith("/seed-images/thumbs/") ? src.replace("/seed-images/", "/seed-images/thumbs/") : src);
const img = (src, alt) => `<img src="${esc(thumb(src))}" alt="${esc(alt)}" loading="lazy" decoding="async">`;
const paragraphs = (list) => list.map((p) => `<p>${esc(p)}</p>`).join("");

// ---------- сторінки ----------
const pages = [
  {
    path: "/",
    ...seo.pages.home,
    image: heroImage,
    jsonld: [website, person],
    body: `<h1>Марія Попілян — ${esc(content.hero.firstName)} ${esc(content.hero.lastName)}</h1>
<p>${esc(content.hero.badge)} · ${content.hero.roles.map(esc).join(" · ")}</p>
${img(heroImage, heroSlot.altText)}
<section><h2>${content.about.headlineLines.map(esc).join(" ")}</h2>${paragraphs(content.about.paragraphs)}</section>
<section><h2>${esc(content.services.titleLine1)} ${esc(content.services.titleAccent)}</h2><ul>${content.services.items
      .map((i) => `<li><h3>${esc(i.title)}</h3><p>${esc(i.desc)}</p></li>`)
      .join("")}</ul></section>
<section><h2>Вибрані роботи</h2>${content.portfolio.items.slice(0, 6).map((i) => img(i.imageUrl, i.altText)).join("")}<p><a href="/portfolio">Усе портфоліо</a></p></section>
<blockquote>${esc(content.personalBrand.quote)}</blockquote>`,
  },
  {
    path: "/about",
    ...seo.pages.about,
    jsonld: [person, breadcrumbs([["Головна", "/"], ["Про Марію", "/about"]])],
    body: `<h1>Про Марію Попілян</h1>${paragraphs(content.about.paragraphs)}
<section><h2>Цінності</h2><ul>${values
      .map((v) => `<li><h3><a href="/values/${v.slug}">${esc(v.title)}</a></h3><p>${esc(v.description)}</p></li>`)
      .join("")}</ul></section>
<section><h2>${esc(content.careerTimeline.titleLine1)} ${esc(content.careerTimeline.titleAccent)}</h2><ol>${content.careerTimeline.achievements
      .map((a) => `<li><h3>${esc(a.year)} — ${esc(a.title)}</h3><p>${esc(a.description)}</p><p>${esc(a.details)}</p></li>`)
      .join("")}</ol></section>
<section><h2>${esc(content.charity.eyebrow)}</h2>${paragraphs(content.charity.paragraphs)}</section>`,
  },
  {
    path: "/portfolio",
    ...seo.pages.portfolio,
    jsonld: [
      {
        "@type": "CollectionPage",
        name: seo.pages.portfolio.title,
        url: abs("/portfolio"),
        about: { "@id": `${SITE}/#person` },
        primaryImageOfPage: abs(content.portfolio.items[0].imageUrl),
        hasPart: content.portfolio.items.slice(0, 30).map((i) => ({ "@type": "ImageObject", contentUrl: abs(i.imageUrl), caption: i.altText, name: i.title })),
      },
      breadcrumbs([["Головна", "/"], ["Портфоліо", "/portfolio"]]),
    ],
    body: `<h1>Портфоліо Марії Попілян</h1><p>${esc(seo.pages.portfolio.description)}</p>
${[...new Set(content.portfolio.items.map((i) => i.category))]
  .map(
    (cat) =>
      `<section><h2>${esc(cat)}</h2>${content.portfolio.items
        .filter((i) => i.category === cat)
        .slice(0, 8)
        .map((i) => `<figure>${img(i.imageUrl, i.altText)}<figcaption>${esc(i.title)}</figcaption></figure>`)
        .join("")}</section>`,
  )
  .join("")}
<section><h2>${esc(content.reels.titleLine1)} ${esc(content.reels.titleAccent)}</h2><ul>${content.reels.items
      .map((r) => `<li><a href="${esc(r.url || content.reels.moreUrl)}">${esc(r.title)}</a></li>`)
      .join("")}</ul></section>`,
  },
  {
    path: "/press",
    ...seo.pages.press,
    jsonld: [breadcrumbs([["Головна", "/"], ["Щоденник", "/press"]])],
    body: `<h1>${esc(content.press.titleLine1)} ${esc(content.press.titleAccent)}</h1><ul>${content.journal.items
      .map((j) => `<li><article>${img(j.imageUrl, j.altText)}<p>${esc(j.date)}</p><h2><a href="${esc(j.href)}">${esc(j.title)}</a></h2></article></li>`)
      .join("")}</ul>`,
  },
  {
    path: "/contact",
    ...seo.pages.contact,
    jsonld: [{ "@type": "ContactPage", url: abs("/contact"), about: { "@id": `${SITE}/#person` } }, breadcrumbs([["Головна", "/"], ["Контакти", "/contact"]])],
    body: `<h1>${esc(content.contact.titlePrefix)} ${esc(content.contact.titleAccent)}</h1><ul>${content.contact.methods
      .map((m) => `<li>${esc(m.label)}: <a href="${esc(m.href)}">${esc(m.value)}</a></li>`)
      .join("")}</ul>`,
  },
  ...values.map((v) => ({
    path: `/values/${v.slug}`,
    title: `${v.title} — Марія Попілян`,
    description: clip(`${v.lead || v.description} ${(v.body || [])[0] || ""}`),
    image: v.imageUrl,
    type: "article",
    jsonld: [
      {
        "@type": "Article",
        headline: `${v.title} — Марія Попілян`,
        description: v.lead || v.description,
        image: v.imageUrl ? abs(v.imageUrl) : undefined,
        inLanguage: "uk-UA",
        author: { "@id": `${SITE}/#person` },
        about: { "@id": `${SITE}/#person` },
        mainEntityOfPage: abs(`/values/${v.slug}`),
      },
      breadcrumbs([["Головна", "/"], ["Про Марію", "/about"], [v.title, `/values/${v.slug}`]]),
    ],
    body: `<article><h1>${esc(v.title)}</h1>${v.lead ? `<p>${esc(v.lead)}</p>` : ""}${v.imageUrl ? img(v.imageUrl, `Марія Попілян — ${v.title.toLowerCase()}`) : ""}${paragraphs(
      v.body || [v.description],
    )}${v.quote ? `<blockquote>${esc(v.quote)}${v.quoteSource ? ` — ${esc(v.quoteSource)}` : ""}</blockquote>` : ""}</article>`,
  })),
];

// ---------- збирання HTML ----------
function render(page, { noindex = false } = {}) {
  const url = abs(page.path);
  const image = abs(page.image || seo.ogImage);
  const jsonld = page.jsonld ? { "@context": "https://schema.org", "@graph": page.jsonld } : null;
  const head = [
    `<meta name="description" content="${esc(page.description)}" />`,
    `<meta name="robots" content="${noindex ? "noindex, follow" : "index, follow, max-image-preview:large"}" />`,
    noindex ? "" : `<link rel="canonical" href="${url}" />`,
    `<link rel="alternate" hreflang="uk" href="${url}" />`,
    `<meta property="og:type" content="${page.type || "website"}" />`,
    `<meta property="og:site_name" content="${esc(seo.siteName)}" />`,
    `<meta property="og:locale" content="uk_UA" />`,
    `<meta property="og:title" content="${esc(page.title)}" />`,
    `<meta property="og:description" content="${esc(page.description)}" />`,
    `<meta property="og:url" content="${url}" />`,
    `<meta property="og:image" content="${image}" />`,
    page.image ? "" : `<meta property="og:image:width" content="1200" /><meta property="og:image:height" content="630" />`,
    `<meta property="og:image:alt" content="${esc(page.title)}" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" content="${esc(page.title)}" />`,
    `<meta name="twitter:description" content="${esc(page.description)}" />`,
    `<meta name="twitter:image" content="${image}" />`,
    jsonld ? `<script type="application/ld+json">${JSON.stringify(jsonld).replace(/</g, "\\u003c")}</script>` : "",
  ]
    .filter(Boolean)
    .join("\n    ");

  // Прибираємо загальні теги з шаблону, щоб не дублювались
  let html = template
    .replace(/<title>[\s\S]*?<\/title>/, `<title>${esc(page.title)}</title>`)
    .replace(/\s*<meta name="description"[^>]*>/, "")
    .replace(/\s*<meta property="og:[^"]+"[^>]*>/g, "")
    // Preload головного фото потрібен лише на головній
    .replace(page.path === "/" ? /$^/ : /\s*<!-- Головне фото[^>]*-->\s*<link rel="preload" as="image"[^>]*>/, "")
    .replace("</head>", `    ${head}\n  </head>`);

  // Текст сторінки — під заставкою (вона fixed поверх), React замінить усе в #root після старту
  const seoContent = `<div class="prerender">${nav()}<main>${page.body}</main><footer><p>${esc(content.footer.copyright)}</p></footer></div>`;
  html = html.replace(/(<div class="boot">[\s\S]*?<\/div><\/div>)<\/div>/, `$1${seoContent}</div>`);
  if (!html.includes('class="prerender"')) throw new Error("Не знайдено заставку в dist/index.html — пререндер не вставлено");
  return html;
}

for (const page of pages) {
  const html = render(page);
  // /about → about.html: Netlify віддає його за адресою /about без переадресації на /about/
  const file = page.path === "/" ? path.join(dist, "index.html") : path.join(dist, `${page.path.slice(1)}.html`);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, html);
}

// 404 — та сама SPA (покаже «Сторінку не знайдено»), але з noindex
fs.writeFileSync(path.join(dist, "404.html"), render({ path: "/404", ...seo.pages.notFound, body: `<h1>Сторінку не знайдено</h1><p><a href="/">На головну</a></p>` }, { noindex: true }));

// ---------- sitemap.xml з фото (Google Images) ----------
const imagesFor = {
  "/": [heroImage, ...content.portfolio.items.slice(0, 6).map((i) => i.imageUrl)],
  "/portfolio": content.portfolio.items.map((i) => i.imageUrl),
  "/press": content.journal.items.map((j) => j.imageUrl),
  ...Object.fromEntries(values.map((v) => [`/values/${v.slug}`, v.imageUrl ? [v.imageUrl] : []])),
};
const priority = { "/": "1.0", "/portfolio": "0.9", "/about": "0.9" };
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${pages
  .map(
    (p) => `  <url>
    <loc>${abs(p.path)}</loc>
    <lastmod>${today}</lastmod>
    <priority>${priority[p.path] || "0.7"}</priority>
${[...new Set(imagesFor[p.path] || [])].map((src) => `    <image:image><image:loc>${esc(abs(src))}</image:loc></image:image>`).join("\n")}
  </url>`,
  )
  .join("\n")}
</urlset>
`;
fs.writeFileSync(path.join(dist, "sitemap.xml"), sitemap.replace(/\n\n/g, "\n"));

fs.writeFileSync(
  path.join(dist, "robots.txt"),
  `User-agent: *\nAllow: /\nDisallow: /admin\nDisallow: /api/\n\nSitemap: ${SITE}/sitemap.xml\n`,
);

console.log(`[prerender] ${pages.length} сторінок + 404, sitemap (${Object.values(imagesFor).flat().length} фото), robots.txt → ${SITE}`);
