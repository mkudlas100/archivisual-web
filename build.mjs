// Sestavení webu Archivisual: node build.mjs  → složka dist/
// Na Vercelu si skript stáhne fotky ze současného úložiště (becdn) a uloží je k webu.
import fs from "node:fs/promises";
import path from "node:path";
import { SITE, CDN, LOGO_SRC, CATS, WORK, HERO, SERVICES, CLIENTS, TESTIMONIALS, PRICES } from "./src/data.mjs";
import { OLD_POSTS } from "./src/posts-old.mjs";
import { NEW_POSTS } from "./src/posts-new.mjs";
import { STUDIES } from "./src/studies.mjs";

const OUT = "dist";
const NOINDEX = process.env.NOINDEX !== "0"; // do spuštění ostrého webu zakázat indexování
const HOST = process.env.VERCEL_PROJECT_PRODUCTION_URL ? "https://" + process.env.VERCEL_PROJECT_PRODUCTION_URL : SITE.url;
const HOME_BEST = [2, 4, 5, 6, 8, 13, 17, 22, 27, 29, 31, 34, 39, 40, 42, 44, 45, 56].map(n => n - 1); // výběr klienta (složka Foto/top 10), čísla AV
const POSTS = [...NEW_POSTS, ...OLD_POSTS];
const BUILD_DATE = new Date().toISOString().slice(0, 10);

let sharp = null;
try { sharp = (await import("sharp")).default; } catch { console.warn("sharp není k dispozici – fotky se nezpracují"); }

const esc = s => String(s ?? "").replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
// česká typografie: nezlomitelná mezera po jednopísmenných předložkách a spojkách
const nb = s => String(s).replace(/(^|[\s(„>])([kvszouaiKVSZOUAI])\s+/g, "$1$2 ");
const write = async (p, c) => { const f = path.join(OUT, p); await fs.mkdir(path.dirname(f), { recursive: true }); await fs.writeFile(f, c); };
const meta = w => [w.k, w.y].filter(Boolean).join(", ");
const dims = {};

/* ---------- fotky ---------- */
async function fetchTo(url, file, width) {
  try {
    await fs.access(path.join(OUT, file)); return true;
  } catch {}
  try {
    const r = await fetch(url, { headers: { "user-agent": "Mozilla/5.0 archivisual-build" } });
    if (!r.ok) throw new Error(r.status);
    let buf = Buffer.from(await r.arrayBuffer());
    if (sharp) buf = await sharp(buf).rotate().resize({ width, withoutEnlargement: true }).jpeg({ quality: 82, mozjpeg: true }).toBuffer();
    await write(file, buf);
    return true;
  } catch (e) { console.warn("Nestaženo:", url, e.message); return false; }
}
async function measure(file) {
  if (!sharp) return;
  try { const m = await sharp(path.join(OUT, file)).metadata(); dims[file] = [m.width, m.height]; } catch {}
}
async function pool(items, n, fn) { const q = [...items]; await Promise.all(Array.from({ length: n }, async () => { while (q.length) await fn(q.shift()); })); }

const thumb = w => `/img/w/${w.file}`;
const full = w => `/img/f/${w.file}`;
const blogImg = p => p.img.startsWith("/") ? p.img : `/img/blog/${p.slug}.jpg`;

async function images() {
  const jobs = [];
  for (const w of WORK) {
    jobs.push([CDN + "iW=1000&iH=any/" + w.src, thumb(w).slice(1), 1000]);
    jobs.push([CDN + "iW=2400&iH=any/" + w.src, full(w).slice(1), 2400]);
  }
  for (const p of POSTS) if (!p.img.startsWith("/")) jobs.push([p.img.replace(CDN, CDN + "iW=1800&iH=any/"), blogImg(p).slice(1), 1800]);
  await pool(jobs, 8, ([u, f, w]) => fetchTo(u, f, w));
  for (const w of WORK) await measure(thumb(w).slice(1));
  // statické fotky (studie)
  await fs.cp("static", OUT, { recursive: true });
  for (const f of await fs.readdir(path.join(OUT, "img/studie"))) await measure("img/studie/" + f);
  // logo: bílé, bez poloprůhledného rámečku
  try {
    const r = await fetch(LOGO_SRC); if (!r.ok) throw new Error(r.status);
    const buf = Buffer.from(await r.arrayBuffer());
    if (sharp) {
      const { data, info } = await sharp(buf).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
      for (let i = 0; i < data.length; i += 4) { const a = data[i + 3]; data[i] = data[i + 1] = data[i + 2] = 255; data[i + 3] = a > 200 ? 255 : a > 150 ? Math.round((a - 150) * 5) : 0; }
      const clean = sharp(data, { raw: info }).trim({ threshold: 1 });
      await write("img/logo.png", await clean.clone().resize({ height: 120 }).png().toBuffer());
      try { await write("favicon.png", await sharp(path.join(OUT, "img/logo.png")).extract({ left: 0, top: 0, width: 120, height: 120 }).resize(64, 64, { fit: "contain", background: "#17191B" }).flatten({ background: "#17191B" }).png().toBuffer()); } catch (e) { console.warn("Favicon:", e.message); }
      if (false) await write("favicon.png", await sharp(data, { raw: info }).extract({ left: 0, top: 0, width: Math.round(info.width * 0.24), height: info.height }).trim({ threshold: 1 }).resize(64, 64, { fit: "contain", background: { r: 23, g: 25, b: 27, alpha: 1 } }).flatten({ background: "#17191B" }).png().toBuffer());
    } else await write("img/logo.png", buf);
  } catch (e) {
    console.warn("Logo nestaženo:", e.message);
    await write("img/logo.svg", `<svg xmlns="http://www.w3.org/2000/svg" width="300" height="60"><text x="0" y="44" fill="#fff" font-family="Arial" font-size="44">Archivisual</text></svg>`);
  }
}
const logoSrc = async () => { try { await fs.access(path.join(OUT, "img/logo.png")); return "/img/logo.png"; } catch { return "/img/logo.svg"; } };
const wh = f => dims[f] ? ` width="${dims[f][0]}" height="${dims[f][1]}"` : "";

/* ---------- strukturovaná data ---------- */
const ORG = {
  "@type": "ProfessionalService", "@id": SITE.url + "/#studio", name: "Archivisual", url: SITE.url,
  description: "Pražské studio architektonických 3D vizualizací, animací, leteckých záběrů a virtuálních prohlídek pro developery a architekty.",
  foundingDate: String(SITE.since), email: SITE.email, telephone: SITE.phones.map(p => p.tel),
  address: { "@type": "PostalAddress", streetAddress: SITE.address.street, postalCode: SITE.address.zip.replace(" ", ""), addressLocality: "Praha 8", addressCountry: "CZ" },
  geo: { "@type": "GeoCoordinates", latitude: SITE.address.lat, longitude: SITE.address.lng },
  areaServed: [{ "@type": "Country", name: "Česko" }], sameAs: SITE.social.map(s => s[1]),
  employee: SITE.team.map(t => ({ "@type": "Person", name: t.name, jobTitle: t.role, email: t.email })),
};
const ld = (...nodes) => `<script type="application/ld+json">${JSON.stringify({ "@context": "https://schema.org", "@graph": [ORG, ...nodes] })}</script>`;
const crumbsLd = items => ({ "@type": "BreadcrumbList", itemListElement: items.map(([n, u], i) => ({ "@type": "ListItem", position: i + 1, name: n, item: SITE.url + u })) });

/* ---------- šablona ---------- */
const NAV = [["/portfolio", "Práce"], ["/#studie", "Studie"], ["/#sluzby", "Služby"], ["/cenik", "Ceník"], ["/blog-archivisual", "Blog"]];
async function page({ path: p, title, desc, body, schema = "", image = "/img/og.jpg", home = false, cur = "" }) {
  const logo = await logoSrc();
  const canonical = SITE.url + (p === "/" ? "/" : p);
  return `<!doctype html>
<html lang="cs">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${esc(title)}</title>
<meta name="description" content="${esc(desc)}">
${NOINDEX ? '<meta name="robots" content="noindex, nofollow">' : ""}
<link rel="canonical" href="${canonical}">
<meta property="og:type" content="website"><meta property="og:title" content="${esc(title)}"><meta property="og:description" content="${esc(desc)}"><meta property="og:url" content="${canonical}"><meta property="og:image" content="${SITE.url}${image}"><meta property="og:locale" content="cs_CZ"><meta name="twitter:card" content="summary_large_image">
<link rel="icon" href="/favicon.png">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Archivo:wdth,wght@62..125,200..700&display=swap">
<link rel="stylesheet" href="/assets/site.css?v=${BUILD_DATE}">
${schema}
</head>
<body>
<a class="skip" href="#obsah">Přeskočit na obsah</a>
${home ? '<div class="pre" id="pre" aria-hidden="true"><span>Archivisual – vizualizace od roku ' + SITE.since + '</span><b id="preN">000</b></div>' : ""}
<div class="cur" id="cur" aria-hidden="true"><em>Zobrazit</em></div>
<header class="top wrap">
  <a class="logo" href="/" aria-label="Archivisual – úvod"><img src="${logo}" alt="Archivisual" height="40"></a>
  <nav class="hnav" aria-label="Hlavní">
    ${NAV.map(([u, l]) => `<a class="hl" href="${u}"${cur === u ? ' aria-current="page"' : ""}>${l}</a>`).join("")}
    <a class="hl" href="#kontakt">Poptat projekt</a>
    <button class="btn-menu" id="menuBtn" aria-expanded="false" aria-controls="menu">Menu</button>
  </nav>
</header>
<div class="menu wrap" id="menu" role="dialog" aria-modal="true" aria-label="Menu">
  <div class="mtop"><img src="${logo}" alt="" height="36"><button class="btn-menu" id="menuClose">Zavřít</button></div>
  <nav>
    <a href="/">Úvod</a>
    <a href="/portfolio">Práce <small>${WORK.length}</small></a>
    <a href="/studie/kosicka-courtyard">Košická Courtyard</a>
    <a href="/studie/vrsovice-interier">Byt ve Vršovicích</a>
    <a href="/#sluzby">Služby</a>
    <a href="/cenik">Ceník</a>
    <a href="/blog-archivisual">Blog <small>${POSTS.length}</small></a>
    <a href="#kontakt">Kontakt</a>
  </nav>
  <div class="foot"><span>${SITE.email}</span>${SITE.phones.map(x => `<span>${x.label}</span>`).join("")}${SITE.social.map(([n, u]) => `<a href="${u}" target="_blank" rel="noopener">${n}</a>`).join("")}</div>
</div>
<main id="obsah">
${body}
${contact()}
</main>
<footer class="site wrap">
  <span>© ${new Date().getFullYear()} Archivisual · vizualizace od roku ${SITE.since}</span>
  <nav aria-label="Patička">${SITE.social.map(([n, u]) => `<a href="${u}" target="_blank" rel="noopener">${n}</a>`).join("")}<a href="/blog-archivisual">Blog</a></nav>
</footer>
<div class="peek" id="peek" aria-hidden="true"><img alt=""></div>
<div class="lb" id="lb" role="dialog" aria-modal="true" aria-label="Detail vizualizace">
  <div class="bar"><b id="lbT"></b><span id="lbN"></span><button id="lbX">Zavřít</button></div>
  <figure><img id="lbImg" alt=""></figure>
  <div class="nav"><button id="lbP">Předchozí</button><span id="lbM"></span><button id="lbNx">Další</button></div>
</div>
<script src="/assets/site.js?v=${BUILD_DATE}" defer></script>
</body>
</html>`;
}

function contact() {
  return `<section class="contact wrap" id="kontakt">
  <h2>Svěřte nám<br>váš projekt</h2>
  <div class="ct-grid">
    <dl>
      <div><dt>E-mail</dt><dd><a href="mailto:${SITE.email}">${SITE.email}</a></dd></div>
      <div><dt>Telefon</dt>${SITE.phones.map(x => `<dd><a href="tel:${x.tel}">${x.label}</a><small>${x.who}</small></dd>`).join("")}</div>
      <div><dt>Studio</dt><dd>${SITE.address.street}<br>${SITE.address.zip} ${SITE.address.city}</dd></div>
      <div><dt>Mapa</dt><dd><a href="${SITE.map}" target="_blank" rel="noopener">Otevřít v Google Mapách</a></dd></div>
    </dl>
    <form id="form" action="https://formsubmit.co/${SITE.email}" method="POST" enctype="multipart/form-data">
      <input type="hidden" name="_subject" value="Poptávka z webu archivisual.cz">
      <input type="hidden" name="_next" value="${HOST}/dekujeme">
      <input type="hidden" name="_template" value="table">
      <input type="text" name="_honey" class="hp" tabindex="-1" autocomplete="off" aria-hidden="true">
      <div class="two">
        <div class="fld"><label for="f-name">Jméno a firma</label><input id="f-name" name="Jméno" autocomplete="name" required></div>
        <div class="fld"><label for="f-mail">E-mail</label><input id="f-mail" name="email" type="email" autocomplete="email" required></div>
      </div>
      <div class="two">
        <div class="fld"><label for="f-tel">Telefon (nepovinné)</label><input id="f-tel" name="Telefon" type="tel" autocomplete="tel"></div>
        <div class="fld"><label for="f-type">Co potřebujete</label><select id="f-type" name="Služba">${SERVICES.map(s => `<option>${s[0]}</option>`).join("")}<option>Developerský servis</option><option>Něco jiného</option></select></div>
      </div>
      <div class="fld"><label for="f-msg">Popis projektu, termín, počet pohledů</label><textarea id="f-msg" name="Zpráva" required></textarea></div>
      <div class="fld"><label for="f-file">Podklady (výkresy, model) do 10 MB</label><input id="f-file" name="attachment" type="file" multiple></div>
      <button class="btn" type="submit">Odeslat poptávku</button>
      <p class="note" id="formNote">Poptávka přijde na ${SITE.email}. Ozveme se s cenou a termínem.</p>
    </form>
  </div>
</section>`;
}

/* ---------- komponenty ---------- */
const card = (w, i, extra) => `<figure class="card" tabindex="0" data-c="${w.c}" data-i="${i}"${extra ? ' data-extra="1"' : ""} data-full="${full(w)}" data-t="${esc(w.t)}" data-m="${esc([meta(w), CATS[w.c]].filter(Boolean).join(" — "))}">
  <div class="ph"><img loading="lazy" decoding="async" src="${thumb(w)}"${wh(thumb(w).slice(1))} alt="${esc(w.t + " – " + CATS[w.c].toLowerCase() + (w.k ? ", vizualizace pro " + w.k : ", 3D vizualizace"))}"></div>
  <figcaption><b>${esc(w.t)}</b><span>${esc(meta(w) || CATS[w.c])}</span></figcaption>
</figure>`;
const row = (w, i, extra) => `<div class="row" role="button" tabindex="0" data-c="${w.c}"${extra ? ' data-extra="1"' : ""} data-full="${full(w)}" data-thumb="${thumb(w)}" data-t="${esc(w.t)}" data-m="${esc([meta(w), CATS[w.c]].filter(Boolean).join(" — "))}"><span class="n">AV/${String(i + 1).padStart(3, "0")}</span><span class="t">${esc(w.t)}</span><span class="k">${esc(w.k || "—")}</span><span class="muted">${CATS[w.c]}</span><span class="y">${w.y || ""}</span></div>`;
function gallery(items, { more = 0, list = true, heading = "h2", title = "Práce" } = {}) {
  const counts = Object.keys(CATS).map(k => [k, items.filter(([w]) => w.c === k).length]);
  return `<div data-gallery>
  <div class="work-head"><${heading}>${title}</${heading}>
    <div class="ctrl">
      <div class="filters" role="group" aria-label="Filtrovat podle typu"><button class="chip" data-f="all" aria-pressed="true">Vše<sup>${items.length}</sup></button>${counts.map(([k, n]) => `<button class="chip" data-f="${k}" aria-pressed="false">${CATS[k]}<sup>${n}</sup></button>`).join("")}</div>
      ${list ? '<div class="views" role="group" aria-label="Zobrazení"><button class="chip" data-view="grid" aria-pressed="true">Mřížka</button><button class="chip" data-view="list" aria-pressed="false">Seznam</button></div>' : ""}
    </div>
  </div>
  <div class="grid">${items.map(([w, i], k) => card(w, i, more && k >= more)).join("")}</div>
  ${list ? `<div class="list" hidden>${items.map(([w, i], k) => row(w, i, more && k >= more)).join("")}</div>` : ""}
  ${more ? `<div class="more"><button class="btn" type="button">Zobrazit další projekty (${items.length - more})</button></div>` : ""}
</div>`;
}
const postCard = p => `<a class="post" href="/${p.slug}"><div class="ph"><img loading="lazy" decoding="async" src="${blogImg(p)}" alt=""></div><span class="tg">${p.tags.join(" · ")}</span><h3>${nb(esc(p.title))}</h3><p>${nb(esc(p.desc))}</p></a>`;

const priceTable = () => `<div class="prices">${PRICES.map(([n, c, d]) => `<div class="pr"><div><h3>${n}</h3><p class="muted">${nb(d)}</p></div><b>${c.replace(/ (?=\d{3})/g, "\u00A0").replace(" Kč", "\u00A0Kč")}</b></div>`).join("")}</div><p class="muted" style="margin-top:16px;font-size:var(--s-s)">${nb("Ceny jsou orientační a bez DPH. Přesnou cenu pošleme po zaslání podkladů; záleží na modelu, počtu pohledů, detailu a termínu.")}</p>`;

/* ---------- stránky ---------- */
async function home() {
  const order = [...HOME_BEST, ...WORK.map((_, i) => i).filter(i => !HOME_BEST.includes(i))];
  const items = order.map(i => [WORK[i], i]);
  const k = STUDIES[0], v = STUDIES[1];
  const body = `
<section class="hero wrap">
  <h1><span>Architektonické</span><span>3D vizualizace</span><span class="muted">a animace</span></h1>
  <div class="hero-row">
    <p>${nb("Ukážeme, jak bude stavba vypadat, dřív než se postaví. Vizualizace pro developery, architekty a designéry z ateliéru v pražském Karlíně.")}</p>
    <div class="hero-cta"><a class="btn solid" href="#kontakt">Poptat vizualizaci</a><a class="btn" href="/portfolio">Prohlédnout práci</a></div>
  </div>
  <p class="facts"><span><b>Od roku ${SITE.since}</b> tvoříme vizualizace</span><span><b>Exteriéry, interiéry</b>, animace a letecké záběry</span><span><b>Praha 8</b> – Karlín</span></p>
  <div class="stage" id="stage" aria-label="Ukázky vizualizací">${HERO.map((i, n) => `<img src="${full(WORK[i])}" alt="${esc(WORK[i].t)}" data-cap="${esc(WORK[i].t + (meta(WORK[i]) ? " — " + meta(WORK[i]) : ""))}"${n ? ' loading="lazy"' : ' class="on" fetchpriority="high"'}>`).join("")}</div>
  <div class="stage-cap"><span id="stageCap">${esc(WORK[HERO[0]].t + " — " + meta(WORK[HERO[0]]))}</span><span class="dots" id="stageDots">${HERO.map((_, n) => `<button aria-label="Snímek ${n + 1}"${n ? "" : ' class="on"'}></button>`).join("")}</span></div>
</section>
<section class="wrap"><div class="intro rv"><h2>Co děláme</h2><p class="big">${nb("Jsme tým architektů a grafiků. Pomáháme vyprávět příběh projektu světlem, kompozicí a pohledem člověka,")} <em>${nb("který v domě bude jednou žít.")}</em></p></div></section>
<section class="wrap" id="prace" style="padding-top:0">${gallery(items, { more: HOME_BEST.length, list: false })}</section>
<section class="wrap" id="studie" style="padding-top:0">
  <p class="sec-h">Případové studie</p>
  <a class="case rv" href="/studie/${k.slug}"><div class="media"><img loading="lazy" src="/img/studie/kosicka-007.jpg" alt="Vnitřní dvůr rezidence Košická ve zlaté hodině"></div><div><p class="kick">${k.kicker}</p><h3>${k.title}</h3><p>${nb(k.lead)} ${nb("Osm vizualizací se scénami ze života obyvatel.")}</p><span class="btn">Prohlédnout studii</span></div></a>
  <a class="case flip rv" href="/studie/${v.slug}"><div class="media"><img loading="lazy" src="/img/studie/vrsovice-002.jpg" alt="Obývací pokoj bytu ve Vršovicích při oslavě narozenin"></div><div><p class="kick">${v.kicker}</p><h3>${v.title}</h3><p>${nb("Jeden byt, pět místností a jedenáct vizualizací. Od deštivé neděle po oslavu narozenin.")}</p><span class="btn">Prohlédnout studii</span></div></a>
</section>
<section class="wrap" id="sluzby" style="padding-top:0">
  <div class="two-col rv" style="margin-bottom:clamp(32px,5vw,64px)"><h2>Služby</h2><p class="big" style="font-size:var(--s-l);max-width:40ch">${nb("Od první skici po prodejní kampaň. Každou zakázku stavíme na míru, ať jde o jeden pokoj, nebo celý obytný soubor.")}</p></div>
  <div class="svc">${SERVICES.map((s, i) => `<details${i ? "" : " open"}><summary><h3>${s[0]}</h3><i aria-hidden="true">+</i></summary><div class="body"><span></span><div><p>${nb(s[1])}</p>${s[2] ? `<a href="${s[2]}">Více o službě</a>` : ""}</div></div></details>`).join("")}</div>
  <p style="margin-top:28px"><a class="btn" href="/cenik">Orientační ceník</a></p>
  <div class="dev">
    <div><h3>Developerský servis</h3><p class="muted">${nb("Kromě vizualizací pomáháme s prodejem malých i velkých projektů.")}</p></div>
    <div><h3>Web a SEO</h3><p>${nb("Přehledná prezentace nemovitosti a bytových jednotek. Postaráme se, aby byl web vidět.")}</p></div>
    <div><h3>Marketing</h3><p>${nb("Dostaneme projekt k lidem, kteří hledají bydlení, a přivedeme je k vám.")}</p></div>
    <div><h3>Grafický design</h3><p>${nb("Logo, tiskoviny a katalogy rodinných domů, které podpoří prodej.")}</p></div>
  </div>
</section>
<section class="wrap" id="studio" style="padding-top:0">
  <div class="two-col"><h2>Studio</h2><div>
    <p class="big rv">${nb("Vizualizace tvoříme od roku " + SITE.since + ". Každý z nás umí něco jiného, spojuje nás důraz na kvalitu a na to, co dělá místo místem.")}</p>
    <div class="team">${SITE.team.map(t => `<div><b>${t.name}</b><span class="muted">${t.role}</span><br>${t.email}</div>`).join("")}</div>
    <blockquote class="quote">„Světlo barev mi stále utíká. Světlo mění všechno a já se neustále snažím zachytit ten klíčový moment.“<cite>Claude Monet</cite></blockquote>
  </div></div>
</section>
<section class="wrap" style="padding-top:0">
  <p class="sec-h">Spolupracujeme</p>
  <div class="clients">${CLIENTS.map(([n, u]) => u ? `<a href="${u}" target="_blank" rel="noopener">${n}</a>` : `<span>${n}</span>`).join("")}</div>
  <div class="tst">${TESTIMONIALS.map(([q, n, r]) => `<figure><blockquote>„${nb(q)}“</blockquote><figcaption>${n}<span>${r}</span></figcaption></figure>`).join("")}</div>
</section>
<section class="wrap related" style="padding-block:clamp(64px,8vw,110px)">
  <div class="work-head"><h2 style="font-size:var(--s-xl)">Z blogu</h2><a class="btn" href="/blog-archivisual">Všechny články</a></div>
  <div class="posts">${NEW_POSTS.slice(0, 3).map(postCard).join("")}</div>
</section>`;
  return page({ path: "/", home: true, title: "Archivisual – architektonické 3D vizualizace, Praha", desc: `Pražské studio 3D vizualizací od roku ${SITE.since}. Exteriérové a interiérové vizualizace, animace, letecké záběry a virtuální prohlídky pro developery a architekty.`, body, image: full(WORK[0]) });
}

async function portfolio() {
  const items = WORK.map((w, i) => [w, i]);
  const body = `<section class="wrap" style="padding-top:calc(130px + env(safe-area-inset-top,0px))">
  <nav class="crumbs" aria-label="Drobečková navigace"><a href="/">Úvod</a><span>/</span><span>Práce</span></nav>
  ${gallery(items, { heading: "h1", title: "Práce" })}
  <p class="muted" style="margin-top:24px">${nb("Exteriérové a interiérové 3D vizualizace, letecké nadhledy a produktové vizualizace z let 2020–2025. Celé sady obrázků z vybraných projektů najdete v")} <a href="/#studie">případových studiích</a>.</p>
</section>`;
  return page({ path: "/portfolio", cur: "/portfolio", title: "Galerie 3D vizualizací | Archivisual", desc: `Galerie ${WORK.length} architektonických 3D vizualizací: exteriéry, interiéry, letecké nadhledy a produkty. Studio Archivisual, Praha.`, body, schema: ld(crumbsLd([["Úvod", "/"], ["Práce", "/portfolio"]])) });
}

const groups = list => { const out = []; for (const g of list) { if (g[2] === "wide") out.push({ wide: g }); else { const l = out[out.length - 1]; if (l && l.items) l.items.push(g); else out.push({ items: [g] }); } } return out; };
async function study(s) {
  const fig = ([f, c, cls]) => `<figure class="${cls}" data-full="/img/studie/${f}" data-t="${esc(s.title)}" data-m="${esc(c)}"><img loading="lazy" decoding="async" src="/img/studie/${f}"${wh("img/studie/" + f)} alt="${esc(c)}"><figcaption>${esc(c)}</figcaption></figure>`;
  const other = STUDIES.find(x => x !== s);
  const body = `
<section class="study-cover"><img src="/img/studie/${s.cover}" alt="" fetchpriority="high"><div class="in wrap"><p class="kick">${s.kicker}</p><h1>${s.title}</h1><p>${nb(s.lead)}</p></div></section>
<div class="wrap"><div class="sfacts">${s.facts.map(([a, b]) => `<div><b>${a}</b><span>${b}</span></div>`).join("")}</div></div>
<section class="wrap"><div class="two-col"><h2>O projektu</h2><div><p class="big" style="margin-bottom:28px">${nb(s.intro[0][0])}</p>${s.intro.map(([h, t], i) => `${i ? `<h3 style="font-size:var(--s-l);font-weight:400;margin:28px 0 10px">${h}</h3>` : ""}<p>${nb(t)}</p>`).join("")}</div></div></section>
<section class="wrap" style="padding-top:0"><div class="sgal">${groups(s.gallery).map(g => g.wide ? fig(g.wide) : `<div class="scol">${g.items.map(fig).join("")}</div>`).join("")}</div></section>
<section class="wrap" style="padding-top:0"><blockquote class="bigquote">„${nb(s.quote)}“</blockquote></section>
<section class="wrap" style="padding-top:0"><div class="cols3">${s.approach.map(([h, t]) => `<div><h3>${h}</h3><p>${nb(t)}</p></div>`).join("")}</div>
${s.steps.length ? `<h2 class="sec-h" style="margin-top:clamp(56px,8vw,96px)">Postup</h2><div class="cols3 steps">${s.steps.map(([h, t]) => `<div><h3>${h}</h3><p>${nb(t)}</p></div>`).join("")}</div>` : ""}
${s.closing ? `<p class="big" style="font-size:var(--s-l);margin-top:clamp(48px,7vw,80px);max-width:40ch">${nb(s.closing)}</p>` : ""}
</section>
<section class="wrap related" style="padding-block:clamp(56px,8vw,100px)"><a class="case" href="/studie/${other.slug}"><div class="media"><img loading="lazy" src="/img/studie/${other.cover}" alt=""></div><div><p class="kick">Další studie</p><h3>${other.title}</h3><p>${nb(other.lead)}</p><span class="btn">Prohlédnout studii</span></div></a></section>`;
  const p = "/studie/" + s.slug;
  return page({ path: p, title: `${s.title} – případová studie | Archivisual`, desc: s.desc, body, image: "/img/studie/" + s.cover,
    schema: ld(crumbsLd([["Úvod", "/"], ["Studie", "/#studie"], [s.title, p]]), { "@type": "CreativeWork", name: s.title, description: s.desc, creator: { "@id": SITE.url + "/#studio" }, image: s.gallery.map(g => SITE.url + "/img/studie/" + g[0]) }) });
}

async function blogIndex() {
  const body = `<section class="wrap" style="padding-top:calc(130px + env(safe-area-inset-top,0px))">
  <nav class="crumbs" aria-label="Drobečková navigace"><a href="/">Úvod</a><span>/</span><span>Blog</span></nav>
  <div class="work-head"><h1>Blog</h1><p class="muted" style="max-width:40ch">${nb("Ceny, postupy a řemeslo architektonické vizualizace. Píšeme z praxe studia, které vizualizace tvoří od roku " + SITE.since + ".")}</p></div>
  <div class="posts">${POSTS.map(postCard).join("")}</div>
</section>`;
  return page({ path: "/blog-archivisual", cur: "/blog-archivisual", title: "Blog o 3D vizualizacích | Archivisual", desc: "Články o 3D vizualizacích: kolik stojí, jak probíhá tvorba, fotozákres, virtuální prohlídky, staging a práce se světlem.", body, schema: ld(crumbsLd([["Úvod", "/"], ["Blog", "/blog-archivisual"]])) });
}

async function post(p) {
  const url = "/" + p.slug;
  const rel = POSTS.filter(x => x !== p && x.tags.some(t => p.tags.includes(t))).concat(POSTS.filter(x => x !== p)).filter((x, i, a) => a.indexOf(x) === i).slice(0, 3);
  const date = p.date ? new Date(p.date).toLocaleDateString("cs-CZ", { day: "numeric", month: "long", year: "numeric" }) : "";
  const body = `
<header class="page-head wrap"><nav class="crumbs" aria-label="Drobečková navigace"><a href="/">Úvod</a><span>/</span><a href="/blog-archivisual">Blog</a></nav><h1>${nb(esc(p.title))}</h1></header>
<div class="wrap"><div class="art-hero"><img src="${blogImg(p)}" alt="${esc(p.title)}" fetchpriority="high"></div></div>
<article class="art wrap">
  <p class="meta">Matěj Kudlička, 3D artist${date ? " · " + date : ""} · ${p.tags.join(", ")}</p>
  <div class="prose">${nb(p.body).replace("{{CENIK}}", priceTable())}</div>
  ${p.faq ? `<div class="faq"><h2 class="sec-h" style="margin:24px 0 8px">Časté otázky</h2>${p.faq.map(([q, a]) => `<details><summary>${nb(q)}</summary><p>${nb(a)}</p></details>`).join("")}</div>` : ""}
  <div class="author"><div><b>Matěj Kudlička</b><br><span class="muted">3D artist, Archivisual. Studio tvoří vizualizace od roku ${SITE.since}.</span></div></div>
  <div class="cta-box"><h2>Chystáte projekt?</h2><p>${nb("Pošlete nám výkresy nebo model a připravíme nabídku na míru.")}</p><a class="btn solid" href="#kontakt" style="justify-self:start">Poptat vizualizaci</a></div>
</article>
<section class="wrap related" style="padding-block:clamp(56px,8vw,100px)"><h2 class="sec-h">Související články</h2><div class="posts">${rel.map(postCard).join("")}</div></section>`;
  const nodes = [crumbsLd([["Úvod", "/"], ["Blog", "/blog-archivisual"], [p.title, url]]),
    { "@type": "BlogPosting", headline: p.title, description: p.desc, image: SITE.url + blogImg(p), inLanguage: "cs", ...(p.date ? { datePublished: p.date, dateModified: p.date } : {}), author: { "@type": "Person", name: "Matěj Kudlička", jobTitle: "3D artist", worksFor: { "@id": SITE.url + "/#studio" } }, publisher: { "@id": SITE.url + "/#studio" }, mainEntityOfPage: SITE.url + url }];
  if (p.faq) nodes.push({ "@type": "FAQPage", mainEntity: p.faq.map(([q, a]) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: a } })) });
  return page({ path: url, cur: "/blog-archivisual", title: `${p.title} | Archivisual`, desc: p.desc, body, image: blogImg(p), schema: ld(...nodes) });
}

async function cenik() {
  const body = `<section class="wrap" style="padding-top:calc(130px + env(safe-area-inset-top,0px))">
  <nav class="crumbs" aria-label="Drobečková navigace"><a href="/">Úvod</a><span>/</span><span>Ceník</span></nav>
  <div class="two-col"><h1 class="big">Ceník 3D vizualizací</h1><div><p style="font-size:var(--s-l);font-weight:300">${nb("Orientační ceny našich služeb. Každá zakázka je jiná, proto vám po zaslání podkladů pošleme přesnou nabídku.")}</p></div></div>
  <div style="margin-top:clamp(32px,5vw,64px)">${priceTable()}</div>
  <div class="cta-box" style="max-width:42rem"><h2>Co cenu ovlivňuje</h2><p>${nb("Kvalita podkladů, počet pohledů, úroveň detailu, letecké záběry, počet kol připomínek a termín.")} <a href="/kolik-stoji-3d-vizualizace">Podrobně v článku</a>.</p><a class="btn solid" href="#kontakt" style="justify-self:start">Poptat přesnou cenu</a></div>
</section>`;
  return page({ path: "/cenik", cur: "/cenik", title: "Ceník 3D vizualizací | Archivisual", desc: "Orientační ceny 3D vizualizací: exteriér rodinného domu od 9 000 Kč, bytový dům od 15 000 Kč, interiér od 6 000 Kč, virtuální prohlídka, animace. Studio Archivisual, Praha.", body,
    schema: ld(crumbsLd([["Úvod", "/"], ["Ceník", "/cenik"]]), { "@type": "OfferCatalog", name: "Ceník 3D vizualizací", itemListElement: PRICES.map(([n, c, d]) => ({ "@type": "Offer", itemOffered: { "@type": "Service", name: n, description: d }, priceSpecification: { "@type": "PriceSpecification", minPrice: Number(c.replace(/\D/g, "")), priceCurrency: "CZK", valueAddedTaxIncluded: false } })) }) });
}

async function simple(p, title, h, text) {
  return page({ path: p, title: `${title} | Archivisual`, desc: text, body: `<section class="wrap" style="padding-top:calc(150px + env(safe-area-inset-top,0px))"><h1 class="big">${h}</h1><p style="margin-top:20px;font-size:var(--s-l)">${nb(text)}</p><p style="margin-top:28px"><a class="btn" href="/">Zpět na úvod</a> <a class="btn" href="/portfolio">Prohlédnout práci</a></p></section>` });
}

/* ---------- běh ---------- */
await fs.mkdir(OUT, { recursive: true });
await images();
await fs.mkdir(path.join(OUT, "assets"), { recursive: true });
await fs.copyFile("src/site.css", path.join(OUT, "assets/site.css"));
await fs.copyFile("src/site.js", path.join(OUT, "assets/site.js"));
if (sharp) { try { await write("img/og.jpg", await sharp(path.join(OUT, full(WORK[0]).slice(1))).resize(1200, 630, { fit: "cover" }).jpeg({ quality: 80 }).toBuffer()); } catch {} }

await write("index.html", await home());
await write("portfolio.html", await portfolio());
for (const s of STUDIES) await write(`studie/${s.slug}.html`, await study(s));
await write("cenik.html", await cenik());
await write("blog-archivisual.html", await blogIndex());
for (const p of POSTS) await write(`${p.slug}.html`, await post(p));
await write("dekujeme.html", await simple("/dekujeme", "Děkujeme", "Děkujeme, poptávka je odeslaná", "Ozveme se vám s cenou a termínem. Pokud spěcháte, zavolejte nám."));
await write("404.html", await simple("/404", "Stránka nenalezena", "Tuhle stránku jsme nenašli", "Možná se přesunula. Zkuste galerii, blog, nebo nám napište."));

const urls = ["/", "/portfolio", "/cenik", ...STUDIES.map(s => "/studie/" + s.slug), "/blog-archivisual", ...POSTS.map(p => "/" + p.slug)];
await write("sitemap.xml", `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map(u => `<url><loc>${SITE.url}${u}</loc><lastmod>${BUILD_DATE}</lastmod></url>`).join("\n")}\n</urlset>\n`);
await write("robots.txt", NOINDEX ? "User-agent: *\nDisallow: /\n" : `User-agent: *\nAllow: /\nSitemap: ${SITE.url}/sitemap.xml\n`);
await write("llms.txt", `# Archivisual\n\n> Pražské studio architektonických 3D vizualizací (od roku ${SITE.since}), Šaldova 544/6, Praha 8 – Karlín. Exteriérové a interiérové vizualizace, animace, letecké záběry a fotozákresy, virtuální prohlídky 360°, produktové vizualizace a developerský servis.\n\n- Kontakt: ${SITE.email}, ${SITE.phones.map(p => p.label + " (" + p.who + ")").join(", ")}\n- [Galerie](${SITE.url}/portfolio)\n${STUDIES.map(s => `- [Studie: ${s.title}](${SITE.url}/studie/${s.slug}): ${s.desc}`).join("\n")}\n\n## Blog\n${POSTS.map(p => `- [${p.title}](${SITE.url}/${p.slug}): ${p.desc}`).join("\n")}\n`);
console.log(`Hotovo: ${urls.length} stránek, ${WORK.length} projektů, ${POSTS.length} článků.`);
