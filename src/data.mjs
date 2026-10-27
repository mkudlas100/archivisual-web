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
  team: [
    { name: "Matěj Kudlička", role: "3D artist", email: "kudlicka@archivisual.cz" },
    { name: "Michele Corradini", role: "Architekt", email: "corradini@archivisual.cz" },
  ],
};

export const CDN = "https://cloud-1de12d.becdn.net/media/";
export const LOGO_SRC = CDN + "original/db5a5d0a8eb2b9bb5a91c85b8b0a8f62/Archivisual-logo2.png";

export const CATS = { ext: "Exteriér", int: "Interiér", air: "Letecké a nadhledy", prod: "Produkty" };

// [cesta na CDN, název, klient, rok, kategorie, na úvodní stránce]
// Názvy jsou z popisků a názvů souborů na současném webu – ke kontrole.
const RAW = [
  ["a78318f2d3f87fdcbaf96851dea52252/2025-RehabBranik-05-Front-copy.jpg", "Rehabilitace Braník", "", 2025, "ext", 1],
  ["f04c60971452491c518eec70307762df/2025-Archum-VRT-3.jpg", "VRT", "Archum", 2025, "ext", 1],
  ["85bff8b28a58a3b3565a310f10f90c7e/2024-Otepka-Medlov-01.jpg", "Medlov", "Otepka", 2024, "ext", 1],
  ["c4069f4d08be8a9d18e31c2a96fc7a45/2025-Archum-Cimice-01.jpg", "Čimice", "Archum", 2025, "ext", 1],
  ["a73b32165ca7141aee2bfb64a88aaca0/2024-CzechCuilding-UPo-ty-B2-Living-07-SD.jpg", "U Pošty, obývací pokoj", "Czechbuilding", 2024, "int", 1],
  ["8a2df2987bad32d27c0f13d3e37e0783/2025-ZS-Zbuzany-2K.jpg", "ZŠ Zbuzany", "", 2025, "ext", 1],
  ["98abe4c03958f7dff92b12a7872b9b41/2024-Krupa-RD-Smolnice-8.jpg", "Rodinný dům Smolnice", "Krupa", 2024, "ext", 1],
  ["ec70be9f04bbc9139d1cd3b43bfdfdcf/2024-Nov-Karolina-Living-04-SD.jpg", "Nová Karolina, obývací pokoj", "", 2024, "int", 1],
  ["37b168e27cdf02e37c030238efa7d6c1/2025-Krupa-Skola-Zbuzany-01.jpg", "Škola Zbuzany", "Krupa", 2025, "ext", 1],
  ["09234fb3848aa6b6125a7473a2d3e9f9/ReAgency-Trebiskeho-PokojA-01.jpg", "Třebízského, pokoj", "ReAgency", "", "int", 1],
  ["5a12b8a7a4a135985a290f208231f9d8/2024-Cairepro-SD.jpg", "Cairepro", "", 2024, "int", 1],
  ["b502a3b71900238e8fae815b9db66e4b/2024-Archum-BD-Nymburk.jpg", "Bytový dům Nymburk", "Archum", 2024, "ext", 1],
  ["dbfd1fb5c5b13042e3067e19147522ea/Kosicka-04-Bedroom-Det04-9-16.jpg", "Košická, ložnice", "", "", "int", 1],
  ["18fa6fdea6ed39788e075e6ad885453f/Milano-Static-02-CShading-LightMix-Recovered-copy.jpg", "Milano", "", "", "int", 1],
  ["c4736a7dff0ee7e5e2b857081a1471a4/2020-Krupa-House-2-SD.jpg", "Rodinný dům", "Krupa", 2020, "ext", 1],
  ["b258208b08e9009bfe449f9e36505a36/2023-Oikoi-Apartment-Teplice-12-SD.jpg", "Apartmán Teplice", "Oikoi", 2023, "int", 1],
  ["857d60221978b5cc6c9802d724c53551/Milano-06-copy.jpg", "Milano", "", "", "int", 1],
  ["74d09d97aafc3a2686e3d692c2093c67/Archum-Nymburk.jpg", "Nymburk", "Archum", "", "ext", 1],
  ["4a09ff1bf338a6f93aca3a9134f7d25f/Aerial-3.jpg", "Letecký záběr", "", "", "air", 1],
  ["a72087866000bb4d88b7ad9fd59bd5f6/2024-CzechBuilding-Krizikova-B11-3.jpg", "Křižíkova B11", "Czechbuilding", 2024, "int", 1],
  ["76caa5bd4664fc358b1d8205d2fb9fe0/2024-Krupa-RD-Smolnice-4-SD.jpg", "Rodinný dům Smolnice", "Krupa", 2024, "ext", 1],
  ["33d78c5c4aa89c09175a1858f7b1cf5a/Kosicka-ext-01-3-1.jpg", "Košická Courtyard", "", "", "ext", 1],
  ["8efd21d8e390a11b92405a611b92ae66/ReAgency-Trebiskeho-Bedroom-03-copy.jpg", "Třebízského, ložnice", "ReAgency", "", "int", 1],
  ["fc51d6dc527aa2dce46deb1e08cbc873/2025-JG-Galerie-SD.jpg", "Galerie", "JG", 2025, "ext", 1],
  ["e8ed61f85cbd9eee2ea2e495493ed52a/CeskoM-Praha-Interier-Living-01.jpg", "Byt Praha, obývací pokoj", "CeskoM", "", "int", 1],
  ["a82c53934721baaaf014a233361ec3b2/Milano-03.jpg", "Milano", "", "", "int", 1],
  ["577480cf4a33ed82f9111ef9bf11bf8f/2024-CzechCuilding-UPo-ty-B2-Bedroom-02-SD.jpg", "U Pošty, ložnice", "Czechbuilding", 2024, "int", 1],
  ["6d09702e3e4a91e5034ed3bf278dea73/2021-Krupa-Rybensk-11-SD.jpg", "Rybenská", "Krupa", 2021, "int", 1],
  ["350576192fb99f2f421ba1ac635798d7/AV-01-copy.jpg", "Bytový dům", "", "", "ext", 1],
  ["25b9fefb17568ff20be8e5b8f5b2350b/2020-Oikoi-Skoda-boot-01.jpg", "Škoda", "Oikoi", 2020, "prod", 1],
  ["87cee91384c169006794a7dc7d3c01c2/Kosicka-Int-01-2-Bedroom-copy.jpg", "Košická, ložnice", "", "", "int", 1],
  ["16fa281a3467ed1ec07a8355d86dcc97/2409-Jinonice-D6-CAM-3-.jpg", "Jinonice D6", "", 2024, "ext", 1],
  ["7d1a6c34c7fc0b555d09557e071d5eb3/Kasna-3-copy.jpg", "Kašna", "", "", "ext", 1],
  ["9fcdae358fc006a4b049b12dc9dfbe43/AV-UPosty-Corridor.png", "U Pošty, chodba", "Czechbuilding", "", "int", 1],
  // galerie /portfolio
  ["1dc084a6fe98821e91abe3cffcdaf6ba/Archivisual-1-.webp", "Ostrava", "", "", "ext", 0],
  ["cef56aa3cea2f4ac380623b42149f5c7/Archivisual-2-.webp", "Muzeum", "", "", "int", 0],
  ["8cdc831103249c8adc21d7ace9cd6643/Archivisual-8-.webp", "Krymská 31", "", "", "int", 0],
  ["9c449d8f63587190f4d9c9afa7f2fd9b/Archivisual-4-.webp", "Brno", "Bogle Architects", "", "ext", 0],
  ["2d12dded07c9ed3fe5578d4adb6765b2/Archivisual-3-.webp", "Rodinné domy", "", "", "ext", 0],
  ["b457dd98d970b9695050b0c93bd43210/Archivisual-5-.webp", "Obývací pokoj", "", "", "int", 0],
  ["b353f577a5072a8c48d7400d9428065b/Archivisual-7-.webp", "Jídelna", "", "", "int", 0],
  ["1f9aaba76bcbd3733cd74196aeada84f/Archivisual-9-.webp", "Tooting, Londýn", "Bogle Architects", "", "ext", 0],
  ["04a9a6888d1165074861f991915ad242/Archivisual-10-.webp", "Oaks Prague", "Bogle Architects", "", "ext", 0],
  ["4813e1f7ff9b19f8a52b7ec11b139ca1/Archivisual-12-.webp", "Medard", "Bogle Architects", "", "air", 0],
  ["d0d426f21ef9873bffdd45faaec09632/Archivisual-14-.webp", "Administrativní budova", "", "", "ext", 0],
  ["d60d6613cee10b13d52b9c2b3b3bada2/Archivisual-17-.webp", "Pavilon v lese", "", "", "ext", 0],
  ["80711a6b6aef9a118fe562eed6acbb68/Archivisual-13-.webp", "Městská ulice", "", "", "ext", 0],
  ["77e59ef64be09e69b4da05ffa8cb6827/Archivisual-16-.webp", "Ragbyový stadion", "", "", "ext", 0],
  ["a8a95a430c28536280310de28eb7184a/Archivisual-11-.webp", "Bytový dům", "Bogle Architects", "", "ext", 0],
  ["dc46b2ca94e048123b97c9882412b2ae/Archivisual-19-.webp", "Rodinný dům", "", "", "ext", 0],
  ["3f962479a7159fb2586cc6b05da81e2c/Archivisual-15-.webp", "Obytný soubor", "Bogle Architects", "", "air", 0],
  ["d7f10f776b3bd8208ec93c8d3c0bfd4b/Archivisual-18-.webp", "Areál v krajině", "", "", "air", 0],
  ["89bfb24d951df23b74851d03ce993494/Archivisual-25-.webp", "Svítidlo", "", "", "prod", 0],
  ["45a2b6f0f93049fd761ad054681357c5/Archivisual-28-.webp", "Designový objekt", "", "", "prod", 0],
  ["f9fb800acee5dbfc6fe5af7dce8871a3/Archivisual-29-.webp", "Elektronika", "", "", "prod", 0],
  ["ef7df238973cd8a17d1baa7a70fcf2ad/Archivisual-20-.webp", "Sakrální interiér", "", "", "int", 0],
  ["0096207ad0781f5be1dba93f3ed8e78b/Archivisual-24-.webp", "Chata", "", "", "ext", 0],
  ["c983c46f5881cbb10db2c130b032d6c3/Archivisual-22-.webp", "Rodinný dům", "", "", "ext", 0],
  ["4e05b7477f1aa6cdf6f7a02507e9a853/Archivisual-21-.webp", "Rodinný dům", "", "", "ext", 0],
  ["5b7abb55b1d826445552914fc0383f47/Archivisual-23-.webp", "Srub v lese", "", "", "ext", 0],
  ["cb6e54ac9151f10a1338042236f1ba46/Archivisual-37-.webp", "Kuchyň", "", "", "int", 0],
  ["272003ad25b091505871c11e0f588829/Archivisual-32-.webp", "Atrium", "", "", "int", 0],
  ["448476f6ddfe426df8aea49f19e25a92/Archivisual-31-.webp", "Obchodní pasáž", "", "", "int", 0],
  ["edb9cc16a83e703624f304ebafc5316f/Archivisual-30-.webp", "Interiér obchodního centra", "", "", "int", 0],
  ["031ddf29c39416cf897b7be229245421/Archivisual-55-.webp", "Fotovoltaika", "", "", "ext", 0],
  ["083fffd8f2def8f97d38892a8a88a6ba/Archivisual-52-.webp", "Průmyslový areál", "", "", "air", 0],
  ["320084e32d202ff7cfe91baa545fea90/Archivisual-53-.webp", "Rodinný dům s fotovoltaikou", "", "", "ext", 0],
  ["82458c9797be17f6929d6455666ab936/Archivisual-54-.webp", "Bytový dům", "", "", "ext", 0],
  ["cfe04846ed776f9b24a42c1c45468b6a/Archivisual-51-.webp", "Logistický park", "", "", "air", 0],
  ["c9c1e51af338af8b5b3caeb15bc29be7/Archivisual-50-.webp", "Haly VGP", "VGP", "", "air", 0],
  ["02a3c9135611fa7f012c121234b94a75/Archivisual-48-.webp", "Haly", "", "", "ext", 0],
  ["e60c050b414cf6dd6179b2e08c31b4d1/Archivisual-49-.webp", "Průmyslové haly", "", "", "air", 0],
  ["750d193c2baa2d013ad3e85848c8fcac/Archivisual-46-.webp", "Haly VGP", "VGP", "", "ext", 0],
  ["c47a7e5d617506cdb2b4d1221097f37f/Archivisual-47-.webp", "Moderní haly", "", "", "air", 0],
];

export const WORK = RAW.map((r, i) => ({
  src: r[0], file: "w" + String(i + 1).padStart(3, "0") + "-" + r[0].split("/")[1].replace(/\.(png|webp)$/i, ".jpg").toLowerCase(),
  t: r[1], k: r[2], y: r[3], c: r[4], home: !!r[5],
}));

export const HERO = [0, 4, 15, 21, 31];

export const SERVICES = [
  ["Exteriérové vizualizace", "Budovy a krajina ve všech fázích projektu, od soutěžního návrhu po prodejní kampaň. Hlídáme každý detail i denní dobu, která stavbě nejvíc sluší."],
  ["Interiérové vizualizace", "Realistické interiéry, ve kterých si klient představí, jak bude prostor žít. Materiály, světlo a vybavení podle návrhu architekta."],
  ["Video prezentace a animace", "Průlety, průchody a krátká videa pro web a sociální sítě, která srozumitelně vysvětlí celý projekt."],
  ["Letecké záběry a fotozákresy", "Pořídíme letecké snímky pozemku a stavbu do nich přesně zakreslíme. Víme, jaké záběry pro zákres potřebujete.", "/fotozakres-stavby"],
  ["Virtuální prohlídky", "Z vizualizací vytvoříme 360° interaktivní prohlídku. Klient si prostory projde online z pohodlí domova.", "/virtualni-prohlidka-360"],
  ["Produktové vizualizace", "Nábytek, svítidla i expozice v kvalitě pro katalogy, prezentace a e-shopy.", "/jak-3d-vizualizace-meni-svet"],
  ["Architektonické soutěže a studie", "Vizualizace, které pomáhají vyhrávat soutěže a přesvědčit investora o hodnotě návrhu."],
];

export const CLIENTS = [
  ["Czechbuilding", "https://www.czechbuildings.cz/"], ["Oikoi", "https://www.oikoi.eu/"], ["KRR Architektura", ""], ["VGP", ""],
  ["Prosun", "https://www.prosun.cz/"], ["Centrum výzkumu Řež", "https://www.cvrez.cz/"], ["ÚJV Řež", "https://www.ujv.cz/"],
  ["Anfilov", "http://anfilov.cz/"], ["Studio Rema 93", "https://www.studiorema93.cz/"], ["Bogle Architects", "https://www.boglearchitects.com/"],
];

export const TESTIMONIALS = [
  ["Archivisual je naším dlouholetým partnerem na tvorbu 3D vizualizací pro větší architektonické projekty i menší soutěže. Naše spolupráce je vždy profesionální a výsledky perfektně odpovídají našim představám.", "Ing. arch. Marek Veleba", "Oikoi Architekti, CEO"],
  ["Studio Archivisual pro nás realizuje interiérové vizualizace našich bytových projektů od konceptu po prezentace. Vizualizace velmi pomáhají klientovi si představit prostor a uvědomit si jeho potenciál.", "Lenka Hanžlová", "Jednatelka, Czechbuilding"],
];

// Orientační ceny bez DPH (návrh podle trhu, schválit s klientem).
export const PRICES = [
  ["Exteriér rodinného domu", "od 9 000 Kč", "první pohled; každý další pohled od 3 000 Kč"],
  ["Bytový dům a developerský projekt", "od 15 000 Kč", "první pohled; každý další pohled od 5 000 Kč"],
  ["Interiér", "od 6 000 Kč", "za pohled; celý byt podle počtu místností"],
  ["Letecký záběr dronem a fotozákres", "od 8 000 Kč", "za pohled včetně leteckého snímku"],
  ["Virtuální staging", "od 3 000 Kč", "za obrázek prázdné nebo zastaralé místnosti"],
  ["Virtuální prohlídka 360°", "od 20 000 Kč", "podle počtu místností"],
  ["Animace a video", "od 30 000 Kč", "krátké video exteriéru nebo průchod interiérem"],
];
