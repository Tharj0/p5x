# Ichigo Shikano — BERRY (dati lufel.net)
Fonte: https://lufel.net/en/character/berry/ · letto il 2026-11-14 con il browser integrato (spoiler attivi) · Stato Global: rilasciata.
Convenzione: nomi di skill, awareness, armi, Persona, set e stat lasciati in inglese come su lufel.net; condizioni ed effetti tradotti in italiano. Valori skill = LV10 / LV10+Minds 5 / LV13 / LV13+Minds 5. Valori armi = refinement R0/R1/R2/R3/R4/R5/R6.

## Scheda
| Campo | Valore |
|---|---|
| Nome | Ichigo Shikano |
| Codename | BERRY |
| Persona | Thelxiepeia |
| Rarità / tipo | 5★ · Limited |
| Elemento | Curse |
| Posizione | Assassin |
| Ruolo (lufel) | Highlight DOT Dealer |
| Tag (lufel) | HIGHLIGHT · DOT · Defense Reduction |
| Resistenza / Debolezza | Res: Curse · Wk: Electric |

## Character Review (lufel)
- Potente DPS single-target che applica ai nemici stack del DoT di elemento Curse Lovesick.
- Applica Lovesick con S1 e S2; raggiunti gli stack massimi, ne rinnova la durata con S3 infliggendo danni pesanti.
- L'Highlight è la skill centrale di Ichigo: attiva gli effetti Lovesick accumulati e permette a Lovesick di andare a critico.
- Ichigo è estremamente forte, ma il suo meccanismo di danno è il più complesso tra tutti i personaggi usciti finora.
- Lovesick infligge danno in due modi principali: danno a fine turno del nemico e attivazione forzata del DoT tramite Highlight.
- Ogni stack di Lovesick fa uno snapshot dello stato dei buff di Ichigo al momento dell'applicazione; quando viene rinnovato con S3, viene sovrascritto con i buff di Ichigo in quel momento.
- Il DoT non conta né come skill Persona né come Resonance, quindi non è influenzato da Stable Domain; il Crit Mult si applica solo quando avviene un colpo critico.
- Nel calcolo del DoT a fine turno i buff di Pierce di Ichigo non si applicano, perciò gli effetti di Defense Reduction sono più importanti rispetto ad altri personaggi.

Tabella dei buff di Ichigo che si applicano (lufel):

| - | ATK / Damage Mult | Crit Rate / Crit Mult | DEF Reduction | Pierce |
|---|---|---|---|---|
| S1/S2/S3 | O | O | O | O |
| Applicazione/rinnovo Lovesick | O | - | O | - |
| Attivazione Lovesick×2 – Highlight | - | O (in base al momento dell'attivazione) | - | - |
| Attivazione DoT – Highlight | - | - | - | - |
| Attivazione Lovesick – fine turno | - | O (in base al momento dell'attivazione) | - | - |
| Highlight base | O | - | O | O |

- ※ Non è ancora confermato se il Pierce Rate si applichi alle attivazioni del DoT provocate dall'Highlight.
- Il buff "DoT Damage Increase" è calcolato in un bucket separato rispetto agli aumenti di danno standard.
- Per confronto, il DoT Damage Increase di Nian (uscita prima di Ichigo) è calcolato nel bucket standard degli aumenti di danno.

**Pro**
- Infligge danni significativi a tutti i boss grazie a un DoT basato sull'ATK invece che sugli HP.
- Ha una Skill 3 e un Highlight molto potenti.

**Contro**
- Richiede più tempo per il setup quando la Skill 1 non può colpire più nemici.

## Recommended Setup (lufel)
> Nota lufel: le impostazioni consigliate sono basate su contenuti futuri; alcune funzioni potrebbero non essere ancora disponibili (Revelation, Mindscape, ecc.).

- **Revelation** — Space: Perseverance (tooltip lufel "Perseverance - Sorrow": aumenta il danno continuo del 16%) · Sun/Moon/Star/Sky: Sorrow ×4 (2-Set: ATK +12% · 4-Set: DMG +20% per 3 turni; l'effetto si riottiene quando usi HIGHLIGHT)
- **Main Options** — Sun: HP · Moon: Attack / Damage Mult · Star: Crit Mult · Sky: Attack
- **Sub Options** — 1ª priorità: Crit Mult · 2ª: Damage Mult / Attack · 3ª: Crit Rate / Pierce Rate
- **Recommended Stats** — non indicate da lufel ("-" in tutte le colonne LV10 / LV10+Minds 5 / LV13 / LV13+Minds 5); Battle Entry +: "-"
- **Priorità skill** — 1º Skill 3 · 2º Highlight · 3º Skill 1 · 4º Skill 2 (tutte MAX)
- **Mindscape (LV 5)** — Rank Strengthening 1: Damage Mult 16% · Rank Strengthening 2: Pierce Rate 7.5% · Skill Enforce 1: Skill1 / Skill2 · Skill Enforce 2: Skill3 / HIGHLIGHT
- **Skill Rotation** — A0: 1 › HL+2 › 2 › 3 › 3 › HL+3 · A1: 1 › HL+2 › 1 › 3 › 3 › HL+3 · A6: 2+2 › HL+1+1 › 3 › 3 › 3+3 › 3+HL+HL
- **Notes (lufel)** — Il Crit Rate di base è alto: regola il Crit Rate in funzione del party · Se ci sono molti nemici con pochi HP, ripeti la Skill 1 per accorciare il ciclo

## Skills (LV10 / LV10+Minds 5 / LV13 / LV13+Minds 5)
**Skill 1 — Vorpal Butterfly** (Curse · SP 20 · cooldown 1 turno)
Infligge danno Curse a 1 nemico pari al 129.0%/142.2%/137.0%/150.2% dell'Attack e applica 2 stack di Lovesick. Quando il bersaglio ha più del 70% di HP, aumenta il danno della skill del 200%. Se questa skill sconfigge un bersaglio, si attiva di nuovo (attivabile consecutivamente).

**Skill 2 — Obsessive Rose** (Curse · SP 20)
Infligge danno Curse a 1 nemico pari al 106.9%/117.8%/113.4%/124.4% dell'Attack e applica 4 stack di Lovesick.

**Skill 3 — My Beloved Prince** (Curse · SP 22)
Infligge danno Curse a 1 nemico pari al 254.8%/280.9%/270.4%/296.6% dell'Attack + 11.7%/12.9%/12.4%/13.6% per ogni stack di Lovesick. Inoltre, quando il bersaglio ha 10 o più stack di Lovesick, infligge danno Curse aggiuntivo pari al 118.7%/130.9%/126.1%/138.2% dell'Attack. Dopo l'attivazione di questa skill, azzera (rinnova) la durata degli stack di Lovesick.

**Highlight** (Curse · cooldown 4 turni)
Infligge danno Curse a 1 nemico pari al 457.1%/503.9%/485.2%/532.0% dell'Attack e per 3 turni Lovesick può attivare colpi critici. Inoltre attiva 1 volta tutti gli effetti di danno continuo sul bersaglio e attiva altre 2 volte l'effetto Lovesick.

**Passiva — Overflowing Love**: per ogni stack di Chains of Love, aumenta l'Attack di Ichigo del 15.0%.

**Passiva — Melting Ichi-Go Butter**: quando Ichigo è presente, aumenta il danno continuo del party del 15.0%.

## Awareness
- **A0 — Mine Alone** (talento base): la prima volta che Ichigo attiva Vorpal Butterfly ottiene 1 stack di Chains of Love; inoltre, ogni volta che attiva un Highlight ottiene 1 stack di Chains of Love. Chains of Love si accumula fino a 3 volte. In base al numero di stack di Chains of Love ottiene i seguenti effetti: 1: per ogni stack di Lovesick applicato, aumenta il danno subito dal bersaglio del 4%. 2: aumenta il Crit Rate del 15%; inoltre tutto il danno delle skill di Ichigo conta come danno continuo. 3: aumenta il danno continuo del 25%.
- **A1 — Pounding Heartbeat**: per ogni stack di Lovesick applicato, riduce la Defense del bersaglio del 3%. Inoltre, ogni volta che usa una skill, applica 1 stack aggiuntivo di Lovesick al bersaglio.
- **A2 — Power of Love**: all'inizio della battaglia ottiene 1 stack di Chains of Love. Chains of Love ora si accumula fino a 5 volte e ottiene i seguenti effetti in base agli stack: 4: aumenta il danno critico (Crit Mult) del 36%. 5: la prima volta che Ichigo subisce danno letale sopravvive con 1 HP, entra in uno speciale stato di quasi-morte e ottiene 4 stack di Power of Love. Alla fine del turno di ogni alleato consuma 1 stack di Power of Love; una volta consumati tutti gli stack di Power of Love, Ichigo va KO.
- **A3 — Forever My Prince**: aumenta di 3 i livelli di skill di My Beloved Prince e Thief Tactics.
- **A4 — Maiden's True Strength**: Highlight Enhanced: ogni volta che il suo Highlight viene attivato, aumenta permanentemente l'Attack di Ichigo del 6%. Si accumula fino a 5 volte.
- **A5 — Garden of Devotion**: aumenta di 3 i livelli di skill di Vorpal Butterfly e Obsessive Rose.
- **A6 — A World of Our Own**: Lovesick ora si accumula fino a 15 volte. In base al numero totale di stack di Chains of Love possono attivarsi i seguenti effetti: 1: dopo aver attivato Vorpal Butterfly, attiva Vorpal Butterfly 1 altra volta sul bersaglio selezionato. 2: dopo aver attivato Obsessive Rose, attiva Obsessive Rose 1 altra volta sul bersaglio selezionato. 3: dopo aver attivato My Beloved Prince, attiva My Beloved Prince 1 altra volta sul bersaglio selezionato. 4: durante il turno di Ichigo può attivare 1 volta l'Highlight sul bersaglio selezionato senza consumare la barra Highlight (non influenzato dal cooldown dell'Highlight). (Ogni effetto può attivarsi una sola volta per battaglia. Se il bersaglio viene sconfitto o la skill viene annullata, riflessa o assorbita, viene selezionato un bersaglio diverso per l'effetto.)

## Stats
- Base (LV1): HP 321 · ATK 104 · DEF 48 · Speed 96
- Hidden Ability LV7: ATK % 29%
- LV80 (HP / ATK / DEF): A0 3600 / 1170 / 547 · A1 3665 / 1191 / 556 · A2 3730 / 1212 / 567 · A3 3794 / 1233 / 576 · A4 3859 / 1254 / 586 · A5 3924 / 1276 / 596 · A6 3989 / 1296 / 606

## Armi esclusive (valori R0/R1/R2/R3/R4/R5/R6)
**5★ My Destiny** — HP 2378 · ATK 773 · DEF 361 — passiva *Possessive Desire*
- Aumenta il Crit Rate del 18.1%/18.1%/23.5%/23.5%/28.9%/28.9%/34.3%.
- Quando Chains of Love è a 1/2/3 stack, aumenta il danno di Ichigo rispettivamente di: 1 stack 11.0%/14.2%/14.2%/17.4%/17.4%/20.6%/20.6% · 2 stack 22.0%/28.5%/28.5%/35.0%/35.0%/41.5%/41.5% · 3 stack 34.0%/44.0%/44.0%/54.0%/54.0%/64.0%/64.0%.
- Quando attiva My Beloved Prince, aumenta il danno critico (Crit Mult) del 32.8%/42.8%/42.8%/52.8%/52.8%/62.8%/62.8%.

**4★ Love Letter** — HP 1903 · ATK 619 · DEF 289 — passiva *Love Dependence*
- Aumenta l'Attack del 12.0%/12.0%/16.0%/16.0%/20.0%/20.0%/24.0%.
- Quando attiva un Highlight, aumenta il danno di Ichigo del 17.6%/23.2%/23.2%/28.8%/28.8%/34.4%/34.4% per 2 turni.

## Attribute Mindscape (lufel: introdotto in KR V5.2, forse non ancora su Global)
- Mindscape Synergy — **DOT Increase** (consigliata): aumenta l'effetto DOT del 2.0%/4.0%.
- Mindscape Combat Skill — **Abyssal Whisper** (consigliata): dopo aver usato HIGHLIGHT/Theurgy su un nemico, aumenta l'effetto DOT subito da quel nemico del 3.0%/6.0% per 2 turni (non cumulabile).

## Recommended Combination (lufel)
> Nota lufel: alcune Persona e armi consigliate potrebbero non essere ancora uscite nella tua regione.
- **Wonder Weapons**: Cursed Ties · Arc Knife · Ex Machina
- **Persona (ATK)**: Vasuki · Alice — nota lufel: l'aumento del danno DOT di Vasuki non è un bonus di danno ma un moltiplicatore separato.
- **Persona (CRITICAL)**: Dionysus
- **Persona (REDUCE DEF)**: Janosik · Nian · Vishnu

## Recommended Parties (lufel)
> Nota lufel: la maggior parte degli esempi di party è stata scritta attorno all'uscita KR/CN del personaggio, quindi Thieves o Mindscape Core successivi potrebbero non essere considerati. Da usare solo come riferimento.
- **Lineup** — CHORD: Ichigo deve usare l'HIGHLIGHT il prima possibile per ottenere tutti gli effetti dell'A0, e Ayaka permette di usare l'HIGHLIGHT di Ichigo frequentemente. · MARIAN·Beachflower: può concedere un aumento del danno DOT in un bucket indipendente tramite l'uso di item.
- **Party d'esempio** — BERRY / WIND·Tempest / CHORD / ANGE · BERRY / WIND·Tempest / CHORD / ORACLE · BERRY / MARIAN·Beachflower / CHORD / ORACLE

## Nomenclatura
- lufel: "Ichigo Shikano" (codename BERRY), slug URL `berry`. Stack: Lovesick, Chains of Love, Power of Love. Thief Tactics = livello dell'Highlight.
- Nelle descrizioni lufel "critical rate" = Crit Rate e "critical damage" = Crit Mult.
