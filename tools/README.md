# Rigenerare i dati da lufel.net

Tutti i comandi vanno lanciati dalla **radice della cartella del progetto**.

## 1. Scaricare il repo pubblico di lufel (solo le parti usate)
```
git clone --depth 1 --filter=blob:none --sparse https://github.com/absolroot/lufelnet lufelnet
cd lufelnet
git sparse-checkout set data assets/img/character-cards assets/img/persona assets/img/wonder-weapon
cd ..
```
Gli script cercano il repo in `./lufelnet`; per usare un'altra posizione imposta la variabile `LUFEL_REPO`.

## 2. Estrarre i dati grezzi (Node.js)
| Script | Cosa produce |
|---|---|
| `node tools/loadparty.js` | `data/cache/recommendParty.json` (teammates, party, Wonder weapon e Persona consigliati per personaggio) |
| `node tools/loadpw.js` | `data/cache/personaFiles.json`, `data/cache/matchWeapons.json` (Persona e Wonder weapon) |
| `node tools/loadsk.js` | `data/cache/lufel_skills_src.json` (testi inglesi di skill, Awareness e armi) |
| `node tools/ci.js > data/cache/ci.json` | nomi e codename dei personaggi |
| `node tools/loadpersona.js` | `data/cache/persona_all.json` (tutte le Persona di Wonder, skill, tabella «come si ottiene»; i file di lufel sono letti in un contesto `vm` isolato) |

## 3. Ricostruire l'app (Python 3 + Pillow)
```
python3 data/build_team.py   # team e Wonder per personaggio + conversione immagini in app/img/
python3 tools/build_personas.py   # data/persona_lufel.json per la scheda «Persona» (solo dati strutturati, niente testi degli effetti)
python3 app/build.py         # genera app/index.html (calcola anche stat base e termini con descrizione)
```

## Note
- `data/characters_lufel.json` (dati base dei 68 personaggi, testi tradotti) e le guide in `knowledge/` sono stati prodotti nelle sessioni su claude.ai leggendo le pagine di lufel: non c'è uno script che li rigeneri da zero. Per un nuovo personaggio va estratto a mano come gli altri.
- Le traduzioni italiane di Persona, Wonder weapon e note di gruppo sono in `data/wonder_it_src.py`.
- `data/release_schedule_lufel.json` è stato letto da https://lufel.net/en/schedule/ il 16 nov 2026; per aggiornarlo va riletta la pagina.
- `history/patch_v14.py` e `history/patch_v14b.py` sono le modifiche una tantum che hanno portato il template alla v1.4: sono già applicate e non vanno rieseguite.
