// Stáhne fotky z původního webu v plné kvalitě do složky foto/<kategorie>/.
import fs from "node:fs/promises";
import { CDN, LOGO_SRC, CATS, WORK } from "../src/data.mjs";
const safe = s => s.normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^\w\- ,]+/g, "").replace(/\s+/g, " ").trim();
let ok = 0, bad = [];
for (const [i, w] of WORK.entries()) {
  const ext = w.src.split(".").pop().toLowerCase();
  const dir = `foto/${safe(CATS[w.c])}`;
  await fs.mkdir(dir, { recursive: true });
  const name = `${dir}/AV${String(i + 1).padStart(3, "0")} ${safe(w.t)}${w.k ? " - " + safe(w.k) : ""}${w.y ? " " + w.y : ""}.${ext}`;
  try {
    const r = await fetch(CDN + "original/" + w.src); if (!r.ok) throw new Error(r.status);
    await fs.writeFile(name, Buffer.from(await r.arrayBuffer())); ok++;
  } catch (e) { bad.push(w.src + " " + e.message); }
}
await fs.mkdir("foto/Logo", { recursive: true });
const r = await fetch(LOGO_SRC); if (r.ok) await fs.writeFile("foto/Logo/Archivisual-logo.png", Buffer.from(await r.arrayBuffer()));
await fs.writeFile("foto/README.txt", `Fotky z webu archivisual.cz v plné kvalitě (${ok} souborů).\nNestaženo: ${bad.length}\n${bad.join("\n")}\n`);
console.log("OK", ok, "chyb", bad.length);
