// Jediný zdroj pravdy pro fakta webu Archivisual.
export const SITE = {
  name: "Archivisual",
  url: "https://www.archivisual.cz",
  since: 2006,
  email: "kontakt@archivisual.cz",
  phones: [
    { tel: "+420724589403", label: "+420 724 589 403", who: "Matěj Kudlička" },
    { tel: "+420608776171", label: "+420 608 776 171", who: "Michele Corradini" },
  ],
  address: { street: "Šaldova 544/6", zip: "186 00", city: "Praha 8 – Karlín", country: "CZ", lat: 50.0923679, lng: 14.4561536 },
  map: "https://www.google.com/maps/place/%C5%A0aldova+544%2F6,+186+00+Karl%C3%ADn",
  social: [
    ["Instagram", "https://www.instagram.com/archivisual_archviz/"],
    ["Behance", "https://www.behance.net/archivisual_cz"],
    ["Pinterest", "https://cz.pinterest.com/matjkudlika/archivisual/"],
  ],
  // Provozovatel pro patičku a zásady ochrany osobních údajů – doplnit podle rejstříku (čeká na klienta)
  company: null, // např. { name: "…", ico: "…", seat: "…", register: "…" }
  team: [
    { name: "Matěj Kudlička", role: "3D artist", email: "kudlicka@archivisual.cz" },
    { name: "Michele Corradini", role: "Architekt", email: "corradini@archivisual.cz" },
  ],
};

export const CDN = "https://cloud-1de12d.becdn.net/media/";

export const CATS = { ext: "Exteriér", int: "Interiér", air: "Letecké a nadhledy", ind: "Industriál", prod: "Produkty", exp: "Expozice", sch: "Axonometrie a schémata" };

// Fotky a projekty z podkladů ve složce Foto (generuje tools/projects.json → src/work.mjs).
import { PROJECTS, PHOTOS } from "./work.mjs";
const BY_ID = Object.fromEntries(PROJECTS.map(p => [p.id, p]));
// t = název projektu, k = klient (Bogle Architects atd.), y = rok, c = kategorie, home = výběr top 10, p = projekt
const ALL = PHOTOS.map(w => ({ f: w.f, file: w.f, t: BY_ID[w.p].t, k: w.k, y: w.y, c: w.c, home: w.top, p: BY_ID[w.p] }));
// top 10 střídat po projektech (ať nejsou stejné projekty vedle sebe), pak zbytek od nejnovějších
const spread = list => { const g = new Map(); list.forEach(w => { if (!g.has(w.p)) g.set(w.p, []); g.get(w.p).push(w); }); const out = []; while (out.length < list.length) for (const a of g.values()) if (a.length) out.push(a.shift()); return out; };
export const WORK = [...spread(ALL.filter(w => w.home)), ...spread(ALL.filter(w => !w.home))];
export { PROJECTS };
export const PROJECT_PAGES = PROJECTS.filter(p => p.slug).map(p => ({ ...p, items: WORK.map((w, i) => [w, i]).filter(([w]) => w.p === p) }))
  .sort((a, b) => (b.items.some(([w]) => w.home) - a.items.some(([w]) => w.home)) || (b.y - a.y) || b.items.length - a.items.length);

// úvodní prolínačka: vybrané záběry z top 10
const pick = f => WORK.findIndex(w => w.f.startsWith(f));
export const HERO = ["2026_Oikoi_Barrandov_EXT_08", "2026_Oikoi_Kreslice_EXT_05", "2026_JKH_NaLukach_EXT_02", "2025_Archum_VRT_EXT_03_v03", "2024_Krupa_Smolnice_EXT_05"].map(pick).filter(i => i >= 0);

export const SERVICES = [
  ["Exteriérové vizualizace", "Budovy a krajina ve všech fázích projektu, od soutěžního návrhu po prodejní kampaň. Hlídáme každý detail i denní dobu, která stavbě nejvíc sluší.", [["/portfolio#ext", "Ukázky exteriérů"], ["/studie/kosicka-courtyard", "Studie Košická Courtyard"]]],
  ["Interiérové vizualizace", "Realistické interiéry, ve kterých si klient představí, jak bude prostor žít. Materiály, světlo a vybavení podle návrhu architekta.", [["/portfolio#int", "Ukázky interiérů"], ["/studie/vrsovice-interier", "Studie bytu ve Vršovicích"]]],
  ["Video prezentace a animace", "Průlety, průchody a krátká videa pro web a sociální sítě, která srozumitelně vysvětlí celý projekt.", []],
  ["Letecké záběry a fotozákresy", "Pořídíme letecké snímky pozemku a stavbu do nich přesně zakreslíme. Víme, jaké záběry pro zákres potřebujete.", [["/portfolio#air", "Ukázky nadhledů"], ["/fotozakres-stavby", "Jak vzniká fotozákres"]]],
  ["Virtuální prohlídky", "Z vizualizací vytvoříme 360° interaktivní prohlídku. Klient si prostory projde online z pohodlí domova.", [["/virtualni-prohlidka-360", "Jak vzniká prohlídka 360°"]]],
  ["Virtuální staging", "Prázdný nebo zastaralý byt zařídíme ve vizualizaci, aby si kupující dokázal představit svůj budoucí domov.", [["/virtualni-staging", "Článek o virtuálním stagingu"]]],
  ["Produktové vizualizace", "Nábytek, svítidla i expozice v kvalitě pro katalogy, prezentace a e-shopy.", [["/portfolio#prod", "Ukázky produktů"], ["/projekty/hodinky-krr", "Projekt Hodinky KRR"], ["/jak-3d-vizualizace-meni-svet", "Článek o produktových vizualizacích"]]],
  ["Architektonické soutěže a studie", "Vizualizace, které pomáhají vyhrávat soutěže a přesvědčit investora o hodnotě návrhu.", []],
];

export const CLIENTS = [
  ["Czechbuilding", "https://www.czechbuildings.cz/"], ["Oikoi", "https://www.oikoi.eu/"], ["KRR Architektura", ""], ["VGP", "https://www.vgpparks.eu/"],
  ["Prosun", "https://www.prosun.cz/"], ["Centrum výzkumu Řež", "https://www.cvrez.cz/"], ["ÚJV Řež", "https://www.ujv.cz/"],
  ["Anfilov", "http://anfilov.cz/"], ["Studio Rema 93", "https://www.studiorema93.cz/"], ["Bogle Architects", "https://www.boglearchitects.com/"],
];

export const TESTIMONIALS = [
  ["Archivisual je naším dlouholetým partnerem na tvorbu 3D vizualizací pro větší architektonické projekty i menší soutěže. Naše spolupráce je vždy profesionální a výsledky perfektně odpovídají našim představám.", "Ing. arch. Marek Veleba", "Oikoi Architekti, CEO"],
  ["Studio Archivisual pro nás realizuje interiérové vizualizace našich bytových projektů od konceptu po prezentace. Vizualizace velmi pomáhají klientovi si představit prostor a uvědomit si jeho potenciál.", "Lenka Hanžlová", "Jednatelka, Czechbuilding"],
];

// Ceník podle kalkulace na archivisual.cz/kalkulace (stav 6. 11. 2026), ceny bez DPH.
// [skupina, položka, cena v Kč (null = individuálně), jednotka]
export const PRICES = [
  ["Záběry", "Exteriérový fotorealistický render", 14000, "za záběr"],
  ["Záběry", "Interiérový záběr", 12000, "za záběr"],
  ["Záběry", "Zákres do letecké fotografie (3D model + dron)", 12000, "za záběr"],
  ["Záběry", "Siteplan / ortofoto", 8000, "za záběr"],
  ["Záběry", "360° panoramatický záběr", 16000, "za záběr"],
  ["Animace", "Balíček 12s animace (video ze 3 záběrů)", 60000, "za balíček"],
  ["Animace", "Animovaný průlet 15 s", 60000, "za video"],
  ["Animace", "Oživení statického záběru pomocí AI", 6000, "za záběr"],
  ["Animace", "Animace bez lidí", 2200, "za sekundu"],
  ["Animace", "Animace s lidmi a stafáží", 4200, "za sekundu"],
  ["Focení a letecké záběry", "Focení ulice, menší projekt (půlden)", 12000, ""],
  ["Focení a letecké záběry", "Focení ulice, velký projekt (celý den)", 20000, ""],
  ["Focení a letecké záběry", "Letecký balíček (foto + video)", 20000, ""],
  ["Ostatní", "Dopracování scény (zeleň, terén, okolí)", 1300, "za hodinu"],
  ["Ostatní", "Extra vysoké rozlišení (10 000+ px)", null, "příplatek individuálně"],
];
export const kc = n => n == null ? "individuálně" : n.toLocaleString("cs-CZ").replace(/\s/g, "\u00A0") + "\u00A0Kč";
