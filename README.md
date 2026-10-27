# Web Archivisual

Statický web (Node + sharp), nasazení na Vercel.

- Data a fakta: `src/data.mjs` (kontakty, projekty, služby, klienti, reference)
- Články: `src/posts-new.mjs`, `src/posts-old.mjs` (původní adresy zachované)
- Studie: `src/studies.mjs`, fotky v `static/img/studie/`
- Vzhled a chování: `src/site.css`, `src/site.js`
- Sestavení: `npm run build` → `dist/` (fotky z původního webu se stáhnou při sestavení)
- Indexování je vypnuté, dokud se nenastaví proměnná `NOINDEX=0` (při spuštění ostrého webu).
