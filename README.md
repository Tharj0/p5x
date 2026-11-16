# P5X — tracker personaggi e guide (Persona 5X: The Phantom X)

Progetto nato come export da claude.ai (16 nov 2026), ora pubblicato come sito personale su GitHub Pages.

## Sito online
- **Tracker**: https://tharj0.github.io/p5x/
- **Guide** (68 personaggi, dati lufel.net in italiano): https://tharj0.github.io/p5x/guide/
- **I tuoi dati** sono nel repository **privato** [Tharj0/p5x-dati](https://github.com/Tharj0/p5x-dati) (`roster.json`, `wonder.json`). Il sito li legge e scrive con un token personale fine-grained che inserisci una volta su ogni dispositivo («Sync e backup» nel tracker): il token resta solo nel browser, non è mai in questo repository.
- Sul telefono puoi aggiungere il sito alla schermata Home: si apre anche senza rete e le modifiche fatte offline partono appena torna la connessione.

## Cosa c'è dentro
| Cartella / file | Contenuto |
|---|---|
| `CLAUDE.md` | Istruzioni del progetto (invariate) + adattamenti per Claude Code |
| `knowledge/` | I 73 documenti del progetto: 68 guide lufel in italiano (`<slug>_lufel.md`), indice, tracker, Release Schedule, Persona e armi di Wonder, dati Revelation |
| `app/` | L'app «Roster P5X — Tracker personaggi»: `template.html` sorgente, `build.py`, `src/` (pezzi v1.4–v1.5 e `ghsync.js`, la sincronizzazione GitHub), `img/` (card, Persona, Wonder weapon) |
| `site/` | File del sito che non stanno nell'app: stile e script delle guide, service worker, manifest, icone |
| `docs/` | **Il sito pubblicato** (generato da `tools/build_site.py`, non modificarlo a mano) |
| `data/` | Dati dell'app (68 personaggi, Revelation, Wonder, Release Schedule, mappature) e script Python; `data/cache/` = dati grezzi di lufel già estratti |
| `tools/` | `build_site.py` (genera `docs/`), `test_ghsync.js` (test della sincronizzazione), `make_icons.py`; script per rigenerare i dati dal repo pubblico di lufel (vedi `tools/README.md`) e, in `history/`, le patch una tantum della v1.4 |
| `consegne/` | Consegne precedenti: tutte le guide in un unico file Markdown e lo zip delle guide singole |

Restano **solo sul PC** (esclusi dal repository pubblico con `.gitignore`): le 93 infografiche Najox `app/img/*--*.webp`, la versione locale `app/index.html` che le mostra, e `memory/` (note personali del progetto).

## Aggiornare il sito
Dalla radice della cartella (su Windows `python`, altrove `python3`; serve il pacchetto `markdown`, già installato):
```
python app/build.py          # versione locale app/index.html (con le infografiche Najox)
python tools/build_site.py   # sito pubblico in docs/ (senza Najox; controlla anche che non ci siano token)
node tools/test_ghsync.js    # test della sincronizzazione
git add -A
git commit -m "Aggiorna il sito"
git push
```
GitHub Pages pubblica `docs/` del branch `main` in un paio di minuti. Basta anche chiedere a Claude Code «aggiorna il sito».

## Sincronizzazione tra dispositivi
- Ogni modifica è salvata subito nel browser; dopo ~3 secondi di pausa il sito scarica la versione su GitHub, la unisce alla tua e la ricarica (un commit per salvataggio in `p5x-dati`, quindi la cronologia conserva tutte le versioni).
- Controlla gli aggiornamenti dell'altro dispositivo all'apertura, quando torni sulla pagina, quando torna la rete e ogni minuto mentre la pagina è aperta.
- **Conflitti**: l'unione è fatta campo per campo. Se sul PC cambi il livello e sul telefono le note, si tengono entrambe. Se lo stesso campo è cambiato in modo diverso su due dispositivi prima che si sincronizzassero, vince la modifica più recente e l'altro valore finisce nel «Registro conflitti» (tasto «Ripristina lo scartato»).
- **Offline**: l'indicatore in alto mostra «Offline · N modifiche da inviare»; partono da sole al ritorno della rete.
- Il token si gestisce in «Sync e backup» (Salva e collega · Verifica token · Sincronizza ora · Rimuovi il token da questo dispositivo). Le istruzioni per crearlo sono nel sito, sotto «Come creare il token».
- Backup/Import JSON e riepilogo Markdown restano disponibili nella stessa scheda.

## Leggere i tuoi dati da Claude Code
```
gh api repos/Tharj0/p5x-dati/contents/roster.json -H "Accept: application/vnd.github.raw+json"
gh api repos/Tharj0/p5x-dati/contents/wonder.json -H "Accept: application/vnd.github.raw+json"
```
Formato: `{"kind":"roster","roster":{"<slug>":{owned, level, awareness, minds, …, updatedAt}}}` e `{"kind":"wonder","wonder":{level, pers, weapons, …}}` (campi descritti in `knowledge/roster_tracker.md`).

## Come aprirlo in Claude Code
1. Apri un terminale nella cartella e avvia `claude` (oppure apri la cartella dall'app Claude desktop, sezione Code).
2. Claude Code legge da solo `CLAUDE.md`: contiene le istruzioni originali del progetto e la mappa delle cartelle. Puoi chiedere subito, per esempio, «build di VIOLET» o «quali Persona di Wonder servono a KOROMARU?».

## La vecchia pagina su claude.ai
https://claude.ai/artifact/QXKG3uXTYDkx2WXapuupGA resta com'era (salvataggio cloud di Claude) ma non viene più aggiornata. Se ci avevi inserito dati, esportali con «Esporta / Importa → backup JSON» e importali nel nuovo sito.

## Cosa non è incluso
- La copia completa del sito lufel (repo pubblico, ~600 MB): si riscarica quando serve, vedi `tools/README.md`.
- Lo zip originale delle infografiche Najox (~770 MB): nell'app locale ci sono già tutte le 93 immagini convertite.
- Le guide PDF di chat più vecchie (Berry v2, Wavecatcher Miyu, Beachflower Minami): non erano tra i file di questo progetto.
