# Traduzioni italiane (da lufel.net / repo absolroot/lufelnet, testi *_en) — Persona di Wonder e Wonder weapon
# Nomi di Persona, skill, stati e stat lasciati in inglese come su lufel.

PERSONA_IT = {
 "Dominion": {
  "role": "Per 1 turno fornisce buff extra molto potenti tramite Cohesion e gli stack di Commandment del talento. La durata è breve, ma l'effetto è abbastanza forte da essere usato soprattutto nel turno di danno finale.",
  "talent": "Attack +29.1%. Quando usa una skill su un alleato, ottiene 2 stack di Commandment. Quando un alleato infligge danno da skill, spende 1 stack di Commandment per aumentare l'Attack di quella skill del 6.4% e il danno del 15%. Dura 1 turno.",
  "unique": "Attack del party +15.0%/15.8%/16.5% per 2 turni; ogni 500 di Attack dell'utilizzatore, +1.25%/1.31%/1.38% in più (fino al 10%). Danno del bersaglio principale +8.0%/8.4%/8.8%, più 1.0%/1.05%/1.1% ogni 500 di Attack dell'utilizzatore (fino all'8%), per 1 turno."},
 "Macabre": {
  "role": "Uscita su EN/JP nella v4.13 (KR/CN v4.7.1); ottenibile anche con valuta di gioco: costosa, ma ne vale la pena. Quando uno Sweeper infligge danno, aumenta insieme danno critico, Crit Rate e damage bonus, e in più aumenta del 3% il raro moltiplicatore separato [total damage amplification], cioè circa +3% di danno totale effettivo. Talento, unique skill e HIGHLIGHT durano 3 turni: scelta prioritaria per gli attaccanti AoE.",
  "talent": "Attack +29.1%. All'inizio della battaglia ottiene 3 stack di Morbidity; ne ottiene 1 ogni volta che un alleato infligge danno con una skill (max 3). Funziona anche in riserva. Quando l'utilizzatore bersaglia un nemico con una skill, il danno critico subito da tutti i nemici aumenta del 15% per 3 turni; contemporaneamente spende 3 stack di Morbidity e, per 3 turni, quando il bersaglio subisce danno da uno Sweeper alleato, la final damage taken amplification aumenta del 3%.",
  "unique": "Danno Curse a tutti i nemici pari al 150.0%/157.5%/165.0% dell'Attack. Danno subito da tutti i nemici +12.0%/12.6%/13.2% e, quando attaccati da uno Sweeper alleato, Crit Rate subito +10.0%/10.5%/11.0%. Dura 3 turni."},
 "Kohryu": {
  "role": "Sbloccabile dall'effetto synergy di Merope al LV20. Se gli alleati attaccano con 4 elementi diversi, concede agli alleati +15% di Attack. La condizione è difficile senza unità come J&C o Akechi, che coprono naturalmente più elementi; nei team con due personaggi di questo tipo può concedere il buff automaticamente anche dalla riserva, risultando abbastanza utile. Raramente la si usa per attaccare direttamente.",
  "talent": "Attack +29.1%. Attivo anche in riserva: ogni volta che un alleato usa una skill di un attributo diverso, Kohryu ottiene 1 stack di Four Gods (max 4). Se all'inizio del turno ha 4 stack, li spende tutti per ottenere Four Gods' Might: Attack dell'utilizzatore +30% e degli altri alleati +15% per 2 turni; cambia le skill di Kohryu.",
  "unique": "Danno Psy a tutti i nemici pari al 101.4%/106.5%/111.5% dell'Attack."},
 "Dionysus": {
  "role": "Ha il più alto tasso di utilizzo ed è di fatto la Persona principale del protagonista. Usando una skill su un alleato concede un enorme buff di danno critico del 30% per 2 turni. Si attiva con qualsiasi skill purché il bersaglio sia un alleato, quindi quando esce una nuova skill di supporto Dionysus è di solito la prima scelta.",
  "talent": "Crit Rate +14.8%. Usando una skill su un alleato, danno critico del bersaglio principale +30% per 2 turni.",
  "unique": "Crit Rate del party +6.5%/6.8%/7.2%; ogni 10% di Crit Rate dell'utilizzatore, +1.1%/1.2%/1.2% in più (fino a 4.4%/4.6%/4.8%). Dura 3 turni."},
 "Janosik": {
  "role": "Persona iniziale di Wonder; il suo tier cambia con il potenziamento. Applica il debuff [Marked] a un nemico per 2 turni. La riduzione DEF è preziosissima in P5X e Janosik può ridurla di oltre il 40%, applicando in automatico anche un debuff che aumenta il danno subito. Se non è in avanguardia e la si inserisce a metà battaglia per usare una skill Persona, scatta l'effetto 'Marked a inizio battaglia' e applica [Marked] una volta; anche le skill di buff lo attivano, quindi nei contenuti a turni limitati si usa spesso per buffare il DPS al penultimo turno applicando nel frattempo [Marked]. Partire con [Marked] già applicato conta anche nei contenuti da chiudere in fretta.",
  "talent": "Attack +29.1%. All'inizio della battaglia applica Marked a 1 nemico. Quando un alleato attacca un nemico Marked: Attack +20%, Crit Rate e danno critico +4.5%. DEF dei nemici Marked −12% in più. Quando l'utilizzatore attacca un nemico Marked, infligge 1 volta danno Gun bonus pari al 18% dell'Attack.",
  "unique": "Danno Gun a 1 nemico pari al 203.3%/221.6%/239.9% dell'Attack; 75% di probabilità di infliggere Marked per 2 turni. Marked: DEF −29.6%/32.3%/34.9%."},
 "Norn": {
  "role": "Infligge Windswept e riduce la DEF, ma è una versione più debole di Vishnu. Si usa quando Vishnu è assegnata a un altro party ma serve la stessa meccanica.",
  "talent": "Defense +37.4%. Dopo aver inflitto Windswept, DEF del bersaglio −31.5% e Defense dell'utilizzatore +30% per 2 turni.",
  "unique": "Scudo a tutti gli alleati pari al 19.5%/20.5%/21.5% dell'Attack + 590/730/880 per 2 turni. Quando un alleato scudato subisce danno, 35.0%/36.8%/38.5% di probabilità di infliggere Windswept all'attaccante."},
 "Vishnu": {
  "role": "Persona con un forte effetto di riduzione DEF. I suoi utilizzi sono calati dopo l'introduzione del Pierce come stat alternativa, ma resta una Persona forte.",
  "talent": "Crit Rate +17.5%. Precisione di Windswept +20%. Danno ai nemici con Windswept +20%. Infliggendo o rinnovando Windswept, DEF del bersaglio −48% per 2 turni.",
  "unique": "Danno Wind a 1 nemico pari al 192.0%/201.6%/211.2% dell'Attack, 75% di probabilità di infliggere Windswept. Se il bersaglio ha già Windswept, ne rinnova la durata, il danno di questa skill aumenta del 27.0%/28.4%/29.7% e il danno Wind subito dai nemici aumenta del 27.0%/28.4%/29.7% per 2 turni."},
 "Yurlungur": {
  "role": "Anche senza infliggere Shock, la sola presenza in campo aumenta il Crit Mult del 18%. Più che per applicare Shock, si usa di solito per buffare il DPS nel turno di danno chiave.",
  "talent": "Danno critico +17.4%. Danno critico subito dai nemici +18%; se il nemico ha Shock, +11% in più.",
  "unique": "Rimuove la resistenza Electric di 1 bersaglio per 2 turni."},
 "Thor": {
  "role": "Persona specializzata nel danno Electric, usata spesso quando il party ha un DPS Electric.",
  "talent": "Danno critico +34.9%. Ogni volta che un alleato usa una skill Electric, Resonance, Highlight o Theurgy, ottiene 1 stack di Thunder Lord's Majesty (max 3, durata 3 turni). Quando l'utilizzatore infligge danno Electric con 3 stack, danno Electric subito da tutti i nemici +12% e danno critico Electric subito +20% per 2 turni.",
  "unique": "Danno Electric a tutti i nemici pari al 112.0%/117.6%/123.2% dell'Attack. Con 3 stack di Thunder Lord's Majesty, 80% di probabilità di infliggere Shock a tutti i nemici per 2 turni."},
 "Ame-no-Uzume": {
  "role": "Combinando il +10% di Crit Rate dato da Shock con un altro +10% dal talento, fornisce in totale +20% di Crit Rate. Succubus concentra il buff in un solo turno, mentre Ame-no-Uzume offre un po' meno ma per 2 turni: hanno usi diversi.",
  "talent": "Ailment Accuracy +15%. Quando i nemici hanno Shock, Crit Rate del party +10% per 2 turni.",
  "unique": "Danno Electric a 1 nemico pari al 143.0%/150.2%/157.3% dell'Attack; 100.0%/105.0%/110.0% di probabilità di infliggere Shock per 2 turni."},
 "Succubus": {
  "role": "Aumenta molto il Crit Rate di un alleato per 1 turno. Se hai un DPS con poco Crit Rate è sempre una scelta forte.",
  "talent": "Attack +3.5%. Dopo che un alleato usa una skill, il suo Crit Rate aumenta dell'11.7% per 1 turno.",
  "unique": "Crit Rate di 1 alleato +9.3%/9.8%/10.2%; ogni 10% di Crit Rate dell'utilizzatore, +1.6%/1.7%/1.8% in più (fino a 6.4%/6.7%/7.0%). Dura 3 turni."},
 "Bishamonten": {
  "role": "Persona specializzata nel danno Nuclear, usata spesso quando il party ha un attaccante Nuclear.",
  "talent": "Crit Rate +17.5%. Usando una skill su un nemico, per ogni alterazione elementale sul bersaglio principale, danno Nuclear subito +10% per 2 turni (fino a 3 stack); gli altri nemici subiscono il 40% di questo effetto.",
  "unique": "Danno Nuclear a 1 nemico pari al 180.0%/189.0%/198.0% dell'Attack; se il nemico ha un'alterazione elementale, danno della skill +25%. Attack degli alleati Nuclear +20.0%/21.0%/22.0% per 2 turni."},
 "Shiva": {
  "role": "Persona specializzata nel danno Psy. Anche l'effetto a 1 stack ha valore da solo, e resta utile fino a 3 stack.",
  "talent": "Attack +29.1%. All'inizio di ogni turno ottiene Wisdom (attivo anche in riserva, max 3). Quando la unique skill spende Wisdom, applica in base agli stack spesi — 1: danno Psy della skill +33%; 2: DEF del nemico −45% per 1 turno; 3: tasso di critico Psy subito dal bersaglio +18% per 1 turno.",
  "unique": "Danno Psy a tutti i nemici pari al 100.0%/105.0%/110.0% dell'Attack. Spende tutti gli stack di Wisdom per attivare gli effetti di Karmic Alteration."},
 "Jikokuten": {
  "role": "Usando una skill di buff fornisce agli alleati un buff di Attack aggiuntivo; il talento non è limitato alle skill Persona e si attiva anche con l'HIGHLIGHT, per cui a volte si porta solo per l'HIGHLIGHT.",
  "talent": "Defense +15.9%. Dopo aver usato una skill su un alleato, Attack del bersaglio principale +15.5% per 2 turni; se gli HP del bersaglio sono sotto il 60%, l'effetto aumenta del 30%.",
  "unique": "Attack del party +10.9%/11.4%/12.0%; ogni 500 di Attack dell'utilizzatore, +0.9%/0.9%/1.0% in più (fino a 7.2%/7.6%/7.9%). Dura 3 turni."},
 "Alice": {
  "role": "La sola presenza in campo aumenta il danno Curse subito dai nemici. L'effetto di morte istantanea della unique skill è a volte utile quando i nemici non ne sono immuni.",
  "talent": "Ailment Accuracy +34.9%. Danno Curse subito da tutti i nemici +18%. Ogni volta che un alleato usa una skill Curse, Ailment Accuracy e Attack di Alice +12.6% (max 3 stack, 2 turni).",
  "unique": "Danno Curse subito da tutti i nemici +17.5%/18.4%/19.2%, più 2.0%/2.1%/2.2% ogni 30% di Ailment Accuracy dell'utilizzatore (fino al 10%), per 2 turni. Se gli HP del nemico sono sotto il 50%, probabilità di morte istantanea."},
 "Koumokuten": {
  "role": "Anche senza usare skill, il solo talento concede un buff di 3 turni ad Attack e Crit Rate. Il buff resta anche dopo il cambio di Persona, quindi si usa spesso nei contenuti dove conta il danno iniziale.",
  "talent": "Ailment Accuracy +21.2%. All'inizio della battaglia, all'alleato con l'Attack più alto: Attack +14% e Crit Rate +6% per 3 turni (priorità ad Assassin e Sweeper).",
  "unique": "Crit Rate del party +6.5%/6.8%/7.2%; ogni 10% di Crit Rate dell'utilizzatore, +1.1%/1.2%/1.2% in più (fino a 4.4%/4.6%/4.8%). Dura 3 turni."},
 "Nian": {
  "role": "Dopo aver usato una skill Persona su un nemico, se un personaggio infligge danno Fire applica un aumento del danno subito che dura fino a 3 turni. Infligge anche Burn, quindi è utile per i personaggi che lo richiedono.",
  "talent": "Attack +29.1%. Usando una skill su un nemico, infligge Festival of Destruction per 2 turni. La prima volta che un nemico con Festival of Destruction subisce danno Fire, gli infligge Fearsome Flames e ha il 75% di probabilità di infliggere Burn per 2 turni. Fearsome Flames: danno subito +12% per 3 turni.",
  "unique": "Danno Curse a tutti i nemici pari al 104.0%/109.2%/114.4% dell'Attack; DEF −10.0%/10.5%/11.0% e danno continuo subito +20.0%/21.0%/22.0% per 2 turni."},
 "Surt": {
  "role": "L'unica Persona, oltre alla skill card Marakunda, ad avere Marakunda: permette una riduzione DEF ad area.",
  "talent": "Ailment Accuracy +20.9%. Precisione di Burn +50%; se gli HP del nemico sono al 50% o più, l'effetto aumenta del 30%.",
  "unique": "DEF di tutti i nemici −27.1%/28.5%/29.8% per 3 turni."},
 "Narcissus": {
  "role": "Kit identico a quello di Norn, ma la riduzione DEF è in genere più preziosa di un buff al damage bonus, quindi è scelta di rado (e anche Norn è superata da Vishnu). Utile quando hai già abbastanza riduzione DEF e ti servono Windswept o danno Wind.",
  "talent": "Ailment Accuracy +24.9%. Dopo aver inflitto Windswept, danno subito dal bersaglio principale +22.4% e Ailment Accuracy dell'utilizzatore +18% per 2 turni.",
  "unique": "Danno Wind a 1 nemico pari al 155.1%/162.9%/170.6% dell'Attack; 100.0%/105.0%/110.0% di probabilità di infliggere Windswept per 2 turni."},
 "Throne": {
  "role": "Usando una skill di buff concede un damage bonus aggiuntivo in base agli stack posseduti. Per accumularli servono alterazioni elementali, ma la maggior parte dei party ne infligge una o due, quindi resta molto versatile ed è spesso scelta per un secondo party senza Dionysus. Talento e unique skill infliggono Burn, quindi si abbina spesso ai personaggi che lo richiedono.",
  "talent": "Attack +29.1%. All'inizio della battaglia ottiene 8 stack di Holy Flame e ogni 2 turni infligge Burn a 1 nemico casuale. Quando gli alleati infliggono un'alterazione elementale, ottiene 1 stack di Holy Flame per 3 turni (+1 se è Burn; max 10, al massimo 2 per skill). Quando un alleato usa una skill con 4+ stack, li spende tutti: danno del party +1.5% per stack per 2 turni e 75% di probabilità di infliggere Burn a 1 nemico casuale.",
  "unique": "Attack del party +12.0%/12.6%/13.2%; ogni 500 di Attack dell'utilizzatore, +0.8% in più (fino al 6%). Dura 3 turni. Concede inoltre Purifying Flames al bersaglio principale per 3 turni: infliggendo danno da skill, 75% di probabilità di infliggere Burn a 1 nemico casuale."},
 "Sahimochi-no-Kami": {
  "role": "Ha una unique skill potente che rafforza il moltiplicatore separato di amplificazione del danno degli effetti aggiuntivi (Resonance). Anche a parte la unique skill, applica un debuff di 2 turni che aumenta il danno subito, combinandosi bene con altre skill di debuff.",
  "talent": "Attack +29.1%. All'inizio della battaglia ottiene 5 stack di Shark's Blade, +1 quando un alleato attiva una skill (max 5); quando si attiva una Resonance ottiene 1 stack di Serrated Shark's Blade (max 5). Attivo anche in riserva. Con 5 stack di Shark's Blade, quando l'utilizzatore usa una skill sui nemici li spende tutti (anche i Serrated): danno subito da tutti i nemici +1.5% per stack speso, per 2 turni.",
  "unique": "Danno Ice a tutti i nemici pari al 100.0%/105.0%/110.0% dell'Attack; amplificazione del danno Resonance subito +8.0%/8.4%/8.8% e danno Ice subito +8.0%/8.4%/8.8% per 2 turni."},
 "Melchizedek": {
  "role": "Gli attaccanti Bless interagiscono spesso con gli stack di Blessing, quindi si inserisce naturalmente con loro. Si considera quando le Persona di supporto migliori sono già impegnate in altri party, più che come prima scelta.",
  "talent": "Attack +24.9%. Usando una skill, danno Bless +4% per ogni stack di Blessing sul party per 2 turni (fino a 8 stack); gli altri alleati Bless ricevono il 50% dell'effetto. Attack degli alleati con 3+ stack di Blessing +15% per 2 turni.",
  "unique": "Danno Bless a tutti i nemici pari al 79.4%/83.4%/87.3% dell'Attack. Concede 2 stack di Blessing a tutti gli alleati. Per ogni Blessing sull'utilizzatore, skill damage +5% (fino al 25%)."},
 "Lakshmi": {
  "role": "Si distingue per le cure tramite gli speciali stack Lotus: fornisce cure aggiuntive oltre a quella iniziale della skill (una sorta di overheal) e funziona bene con personaggi che devono recuperare HP spesso.",
  "talent": "Cure +20.9%. Per 2 turni, curando con Lotus, HP massimi degli alleati curati +17.5% e cure da Lotus +45%.",
  "unique": "Ripristina gli HP di 1 alleato pari al 32.7%/34.3%/36.0% dell'Attack + 989/1224/1477. Ottiene 2 stack di Lotus per 1 turno; finché li possiede, dopo ogni azione di nemici e alleati, se un alleato ha meno del 50% di HP spende 1 Lotus per ripristinare HP pari all'8.4%/8.8%/9.2% dell'Attack + 254/314/379."},
 "Raphael": {
  "role": "Persona limitata di un evento a pagamento: la prima copia richiedeva 70 Persona Gacha Ticket, la seconda 10 (necessaria per il potenziamento massimo). L'HIGHLIGHT dura 4 turni, il che le dà grande utilità tattica. Oltre alla Total Damage Amplification aggiunta al buff, il danno critico che fornisce mentre è in campo rende ideale farla entrare all'ultimo turno, usare una skill di buff e lasciarla in campo.",
  "talent": "Attack +29.1%. All'inizio della battaglia, Attack di tutti gli alleati +20% permanente. Quando è in campo, se gli alleati hanno attivato un qualsiasi Attribute Harmony, danno critico di tutti gli alleati +25%. Dopo aver usato una skill Persona sugli alleati, Total Damage Amplification del bersaglio principale +4.2% per 3 turni.",
  "unique": "Attack di 1 alleato +25.0%/26.2%/27.5%. Se gli alleati hanno attivato un Attribute Harmony, Crit Rate del bersaglio principale +12.0%/12.6%/13.2%. Dura 3 turni."},
 "Gabriel": {
  "role": "lufel non fornisce una descrizione del ruolo per questa Persona.",
  "talent": "Attack +29.1%. Dopo aver usato una skill Persona sui nemici, DEF del bersaglio principale −30% per 3 turni (effetto registrato). Dopo aver usato una skill Persona sugli alleati, danno critico del bersaglio principale +30% per 3 turni (effetto registrato). 2 turni dopo l'uso di una skill Persona l'utilizzatore ottiene [Gospel]; usando una skill Persona spende tutti i [Gospel] per riattivare l'ultimo effetto registrato e aumentare la Total Damage Amplification degli Assassin alleati del 6% per 3 turni.",
  "unique": "Danno Ice a 1 nemico pari al 300% dell'Attack. Danno subito dal bersaglio +15% e, quando attaccato da un Assassin, DEF −20% in più. Dura 3 turni."},
 "Lamia": {
  "role": "Specializzata nell'infliggere Burn. È scesa di priorità dopo l'arrivo di opzioni migliori come Throne e Nian, ma la facilità di ottenimento la rende utile all'inizio.",
  "talent": "Ailment Accuracy +15%. Precisione di Burn +40%. Quando i nemici hanno Burn, Attack del party +12% per 2 turni.",
  "unique": "Danno Fire a 1 nemico pari al 150.0%/157.5%/165.0% dell'Attack; 50.0%/52.5%/55.0% di probabilità di infliggere Burn (raddoppiata se nessun nemico ha Burn)."},
 "Baphomet": {
  "role": "Se un nemico ha già Burn, infligge un potente debuff di 1 turno che aumenta il danno Fire subito. Richiede Burn come prerequisito, ma i modi per infliggerlo sono sempre di più.",
  "talent": "Attack +24.9%. Dopo aver inflitto danno da skill a un nemico con Burn, danno Fire subito da tutti i nemici +29% per 1 turno.",
  "unique": "Danno Fire a tutti i nemici pari al 67.5%/70.9%/74.2% dell'Attack; infligge Burn al bersaglio principale."},
 "Zaou-Gongen": {
  "role": "Uscita insieme a Makoto Yuki (protagonista di Persona 3). Il talento è ottimo, ma la unique skill spicca per un debuff eccezionale che aumenta il danno critico subito fino al 24%. Il difetto è la scarsa versatilità: richiede sia danno Fire sia colpi multipli.",
  "talent": "Attack +29.1%. Dopo aver inflitto danno con una skill, concede Threefold Transcendence all'utilizzatore e allo Sweeper o Assassin con l'Attack più alto per 3 turni: infliggendo 4+ colpi con una singola skill, Attack +12% e danno +10%.",
  "unique": "Danno Fire a 1 nemico pari al 48.0%/50.4%/52.8% dell'Attack (4 colpi) e infligge Ascetic Ordeals per 3 turni: ogni colpo di danno Fire subito aumenta il danno critico subito del 3% (fino a 8 stack)."},
 "Sandalphon": {
  "role": "Concede scudi agli alleati, aumenta molto la Defense e fornisce un damage bonus, garantendo insieme sopravvivenza e danno. Parte del buff vale anche dalla riserva, quindi si può considerare come ultimo slot quando si usano solo due Persona.",
  "talent": "Defense +43.6%. Se Sandalphon è in campo, Defense degli alleati scudati +42%; se non è in campo, +25%. Usando la unique skill, costo in HP ridotto al 15%.",
  "unique": "Scudo al party pari al 25.5%/26.8%/28.0% dell'Attack dell'utilizzatore + 771/955/1152. Mentre sono scudati, danno +20.4%/21.4%/22.4% per 2 turni."},
 "Mithras": {
  "role": "Aumenta la Defense degli alleati. Da considerare se serve un buff di Defense e non hai Sandalphon o King Frost.",
  "talent": "HP massimi +11.6%. Dopo aver usato una skill su un alleato, Defense del bersaglio +14.5%; se ha più del 50% di HP, +50% in più. Dura 2 turni.",
  "unique": "Defense del party +16.3%/17.1%/17.9%; ogni 500 di Defense dell'utilizzatore, +2.7%/2.8%/3.0% in più (fino a 10.8%/11.3%/11.9%). Dura 3 turni."},
 "Apsaras": {
  "role": "Aumenta la Defense degli alleati. Da considerare se serve un buff di Defense e non hai Sandalphon o King Frost.",
  "talent": "Defense +8.7%. Dopo aver usato una skill su un alleato, Defense del bersaglio +15.4% per 2 turni.",
  "unique": "Crit Rate di 1 alleato +9.3%/9.8%/10.2%; ogni 10% di Crit Rate dell'utilizzatore, +1.6%/1.7%/1.8% in più (fino a 6.4%/6.7%/7.0%). Dura 3 turni."},
 "King Frost": {
  "role": "Specializzata in scudi e aumento di Defense: migliora la sopravvivenza del party.",
  "talent": "Defense +37.4%. Concedendo uno scudo a un alleato, Defense del bersaglio principale +25% e danno Ice +15% per 2 turni.",
  "unique": "Scudo al party pari al 22.8%/23.9%/25.1% dell'Attack dell'utilizzatore + 690/853/1030 per 2 turni; mentre sono scudati, Defense +30%."},
 "Vasuki": {
  "role": "Aumenta il danno continuo (DOT). L'aumento del danno continuo indicato nel talento funziona come moltiplicatore separato ed è moltiplicativo.",
  "talent": "Ailment Accuracy +34.9%. All'inizio della battaglia ottiene 5 stack di Bitter Stagnation; quando gli alleati infliggono debuff con le skill ne ottiene 1 (max 1 per turno, max 5; attivo anche in riserva). Bitter Stagnation: dopo l'uso di una skill, spende 5 stack per aumentare del 15% il danno subito dal bersaglio principale dal danno continuo inflitto da quel momento, per 3 turni, e infligge 1 stack di Serpent's Venom.",
  "unique": "Danno subito da 1 nemico +16.0%/16.8%/17.6% e 1 stack di Serpent's Venom per 3 turni. Serpent's Venom: ogni turno danno Curse pari al 12.8%/13.4%/14.1% dell'Attack del Phantom Thief con l'Attack più alto (contato fino al 300% dell'Attack di Wonder); fino a 2 stack."},
 "Sraosha": {
  "role": "Persona specializzata per Kasumi (VIOLET). Usa la unique skill nei turni 3 e 6, i turni di danno principali di Kasumi.",
  "talent": "Attack +29.1%. All'inizio della battaglia ottiene 2 stack di God's Ear; +1 quando un alleato usa un Highlight, +1 in più se è un alleato Bless (durata 3 turni, max 3; ottenibili anche in riserva). Usando la unique skill spende tutti gli stack: danno Bless subito dal bersaglio +6% per stack per 2 turni; spendendo 3 stack, quando il bersaglio subisce danno Bless, DEF −25% in più per 2 turni.",
  "unique": "Danno Bless a 1 nemico (200.0%/210.0%/220.0% dell'Attack). Danno da Highlight subito dal bersaglio +30.0%/31.5%/33.0% (1 turno)."},
 "Lilith": {
  "role": "Si usa solo in setup che potenziano il danno Almighty, come l'Ex Machina di Wonder, o quando servono due skill di elementi diversi.",
  "talent": "Attack +29.1%. Usando una skill Ice, Wind o Curse, danno inflitto +30% e danno subito −10% per 2 turni; inoltre la unique skill evolve per infliggere danno bonus di quell'attributo, con skill damage molto aumentato e Pierce Rate +15% temporaneo.",
  "unique": "Danno Almighty a tutti i nemici pari al 25.0%/26.2%/27.5% dell'Attack, poi danno Curse pari al 37.5%/39.4%/41.2%. Può evolvere in Frostbite, Tempest o Malice: danno Almighty 25.0%/26.2%/27.5% poi danno Ice, Wind o Curse pari al 101.0%/106.0%/111.1% dell'Attack."},
 "Pazuzu": {
  "role": "Si usa con Toshiya (SEPIA), il cui kit accumula più stack di Curse; si gioca attorno al Burn di Agidyne e alla risoluzione del danno Curse del talento.",
  "talent": "Attack +17.7%. Attaccando un nemico con una skill, 60% di probabilità di infliggere 1 stack di Curse al bersaglio principale; poi infligge danno Curse.",
  "unique": "Danno Curse a tutti i nemici pari al 66.5/70.7/74.9% dell'Attack; probabilità di infliggere 1 stack di Curse."},
 "Anubis": {
  "role": "Usata nei party che accumulano alterazioni Curse sui nemici.",
  "talent": "Attack +16.6%. Dopo danno Bless: ottiene 2 stack di Blessing e 50% di probabilità di infliggere 1 stack di Curse al bersaglio. Dopo danno Curse: infligge 2 stack di Curse al bersaglio principale e 50% di probabilità di ottenere 1 Blessing. Attaccando un nemico con Curse, Attack +27%.",
  "unique": "Danno Curse a 1 nemico pari al 165.0%/173.2%/181.5% dell'Attack; danno +10% per ogni Blessing sull'utilizzatore o Curse sul bersaglio (max 4)."},
 "Okuninushi": {
  "role": "Aumenta il danno Psy subito dai nemici per ben 3 turni; si può usare con un attaccante Psy.",
  "talent": "Crit Rate +12.5%. Dopo aver usato una skill, danno Psy subito dal nemico +8.5% per 3 turni (fino a 3 stack). Attaccando un nemico con questo effetto, danno Psy inflitto +10% in più.",
  "unique": "Danno Psy a tutti i nemici pari all'88.0%/92.4%/96.8% dell'Attack; +20% se i nemici hanno un'alterazione spirituale, +15% in più se sono deboli al Psy."},
 "Neko Shogun": {
  "role": "Buffer incentrata sull'Ailment Accuracy. In generale aumentare Attack o damage bonus è più efficiente, quindi è usata di rado.",
  "talent": "Ailment Accuracy +15%. All'inizio della battaglia, Ailment Accuracy del party +10% (+14% per l'alleato con l'Ailment Accuracy più alta) per 2 turni.",
  "unique": "Danno di 1 alleato +18.0/18.9/19.8%; ogni 20% di Ailment Accuracy del bersaglio, +1.0/1.0/1.1% in più (fino a 6.0/6.3/6.6%). Dura 2 turni."},
}

WEAPON_IT = {
 "Whisperer's Sting": "Attack +28.0%/32.7%/37.3%/42.0%/46.7%/51.3%/56.0%. Quando gli alleati infliggono danno Wind con una skill Persona o una Resonance, WONDER ottiene 1 stack di [Wind Whisper Crystal] per ogni nemico colpito (max 10, durata 2 turni); gli stack attivano [Spirit Sigil]: 2+ → Attack dell'utilizzatore +200/233/266/300/333/366/400 · 5+ → danno subito da tutti i nemici +10.0%/11.7%/13.3%/15.0%/16.7%/18.3%/20.0% · 10+ → danno critico subito da tutti i nemici +5.0%/5.8%/6.7%/7.5%/8.3%/9.2%/10.0% e danno critico Wind subito +12.5%/14.6%/16.7%/18.8%/20.8%/22.9%/25.0%.",
 "Chaos Hex": "Attack +28.0%/32.7%/37.3%/42.0%/46.7%/51.3%/56.0%. Dopo che WONDER usa una skill Persona o un attacco Gun, ottiene [Deadly Instinct] per 1 turno: all'inizio del turno ricarica tutti i proiettili; attacchi Gun e skill Persona Gunshot vanno sempre a critico; danno inflitto +9.5%/11.1%/12.7%/14.2%/15.8%/17.4%/19.0% e danno degli attacchi Gun +9.5%/11.1%/12.7%/14.2%/15.8%/17.4%/19.0% in più. Mentre WONDER ha [Deadly Instinct], Attack di tutti gli alleati +11.0%/12.8%/14.7%/16.5%/18.3%/20.2%/22.0% e danno critico infliggendo danno Gunshot +10.0%/11.7%/13.3%/15.0%/16.7%/18.3%/20.0%.",
 "Midnight Sun": "Attack +12.0%/14.0%/16.0%/18.0%/20.0%/22.0%/24.0%. Attack +6.4%/7.4%/8.3%/9.3%/10.2%/11.2%/12.2% in più; effetto raddoppiato per 1 turno dopo aver cambiato Persona.",
 "Event Horizon": "Attack +28.0%/32.7%/37.3%/42.0%/46.7%/51.3%/56.0%. All'inizio della battaglia concede 2 stack di Spaghettification a tutti gli alleati; quando un alleato infligge danno Nuclear con una skill, ne concede 1 a tutti. Per ogni alleato con Spaghettification, Attack dell'utilizzatore +50/58/66/75/83/91/100. Spaghettification: Attack +5.5%/6.4%/7.3%/8.2%/9.2%/10.1%/11.0% e, infliggendo danno Nuclear, danno critico +5.0%/5.8%/6.7%/7.5%/8.3%/9.2%/10.0%; fino a 2 stack, 2 turni (calcolati per stack).",
 "Starry Compass": "Attack +28.0%/28.0%/37.3%/37.3%/46.7%/46.7%/56.0%. Universal Astrolabe (Aura), in base agli stack di Guidance: 5 → DEF di tutti i nemici −11.0%/14.7%/14.7%/18.3%/18.3%/22.0%/22.0% · 10 → Ailment Accuracy di tutti gli alleati +9.0%/12.0%/12.0%/15.0%/15.0%/18.0%/18.0% · 15 → danno Psy di tutti gli alleati +11.0%/14.7%/14.7%/18.3%/18.3%/22.0%/22.0%. Inizia la battaglia con 10 stack di Guidance (max 20); +1 ogni volta che un alleato infligge danno a un nemico; −5 alla fine del turno dell'utilizzatore.",
 "Arc Knife": "Attack +28.0%/28.0%/37.3%/37.3%/46.7%/46.7%/56.0%. Dopo aver inflitto un'alterazione elementale, Attack +10.0%/13.3%/13.3%/16.7%/16.7%/20.0%/20.0% per 2 turni. Precisione delle alterazioni elementali +15.0%/20.0%/20.0%/25.0%/25.0%/30.0%/30.0%. Attaccando un nemico, DEF del bersaglio −4.5%/6.0%/6.0%/7.5%/7.5%/9.0%/9.0% per 2 turni; l'effetto aumenta per ogni alterazione elementale del bersaglio, fino a 4.",
 "Ex Machina": "Attack +28.0%/28.0%/37.3%/37.3%/46.7%/46.7%/56.0%. Aura: con l'utilizzatore in campo, Attack del party +120/160/160/199/199/240/240. In base all'attributo della Persona equipaggiata all'inizio della battaglia, danno di quell'attributo +17.0%/22.7%/22.7%/28.3%/28.3%/34.0%/34.0% (gli altri alleati ricevono il 40% dell'effetto).",
 "Purgatory": "Attack +28.0%/28.0%/37.3%/37.3%/46.7%/46.7%/60.7%. All'inizio della battaglia ottiene 2 stack di Trial by Fire; +1 quando un alleato infligge danno da skill Fire (durata 3 turni, max 3). Inferno of Nothingness (Aura), in base agli stack: 1 → Attack dell'utilizzatore +180/240/240/300/300/360/360 e degli altri alleati +150/200/200/249/249/300/300 · 2 → danno dell'utilizzatore +8.0%/10.7%/10.7%/13.3%/13.3%/16.0%/16.0% e degli altri alleati +3.0%/4.0%/4.0%/5.0%/5.0%/6.0%/6.0% · 3 → danno Fire del party +12.0%/16.0%/16.0%/20.0%/20.0%/24.0%/24.0%.",
 "Ice Age": "Attack +28.0%/32.7%/37.3%/42.0%/46.7%/51.3%/56.0%. All'inizio della battaglia concede Ancient Frost a 1 alleato; quando Wonder usa skill sugli alleati, la concede al bersaglio principale (1 volta ciascuno). Quando gli alleati hanno Ancient Frost, danno di Wonder +17.5%/20.4%/23.3%/26.2%/29.2%/32.1%/35.0%. Ancient Frost: danno +8.0%/9.3%/10.7%/12.0%/13.3%/14.7%/16.0% e danno Ice +11.0%/12.8%/14.7%/16.5%/18.3%/20.2%/22.0% per 3 turni.",
 "Plasma Blade": "Attack +28.0%/28.0%/37.3%/37.3%/46.7%/46.7%/60.7%. All'inizio della battaglia, o quando un alleato infligge danno con una skill Almighty, attiva Harmonic Element per 2 turni; in base al numero di effetti Flames of Desire attivi nel party: 1+ → Attack dell'utilizzatore +15.0%/20.0%/20.0%/25.0%/25.0%/30.0%/30.0% e danno Almighty +9.0%/12.0%/12.0%/15.0%/15.0%/18.0%/18.0% (50% agli altri alleati) · 2+ → danno critico del party +9.0%/12.0%/12.0%/15.0%/15.0%/18.0%/18.0%.",
 "Pheromone Sting": "Ailment Accuracy +34.0%/39.7%/45.3%/51.0%/56.7%/62.3%/68.0% e probabilità di infliggere alterazioni elementali o spirituali +12.5%/14.6%/16.7%/18.8%/20.8%/22.9%/25.0%. Quando un nemico subisce un'alterazione elementale o spirituale, gli infligge anche Infestation: danno subito +10.0%/11.7%/13.3%/15.0%/16.7%/18.3%/20.0% per 3 turni. Con un nemico con Infestation presente, Ailment Accuracy +4.0%/4.7%/5.3%/6.0%/6.7%/7.3%/8.0% e Attack +7.0%/8.2%/9.3%/10.5%/11.7%/12.8%/14.0%.",
 "Abyss Fang": "Attack +28.0%/28.0%/37.3%/37.3%/46.7%/46.7%/56.0%. Infliggendo danno con una skill ottiene 3 stack di Hunter's Instinct, +1 ogni 2 volte che infligge danno. Hunter's Instinct: danno +3.3%/4.4%/4.4%/5.5%/5.5%/6.6%/6.6% per 1 turno (max 5 stack). A 3/5 stack aumentano anche Crit Rate e danno critico — lufel riporta 14 valori ciascuno, qui letti come 7 per 3 stack + 7 per 5 stack: Crit Rate +6.0%/8.0%/8.0%/10.0%/10.0%/12.0%/12.0% (3 stack) e +9.0%/12.0%/12.0%/15.0%/15.0%/18.0%/18.0% (5 stack); danno critico +12.0%/16.0%/16.0%/20.0%/20.0%/24.0%/24.0% (3 stack) e +18.0%/24.0%/24.0%/30.0%/30.0%/36.0%/36.0% (5 stack).",
 "Glimmer": "Attack +28.0%/28.0%/37.3%/37.3%/46.7%/46.7%/56.0%. Danno Bless e cure +11.0%/14.7%/14.7%/18.3%/18.3%/22.0%/22.0%. All'inizio del turno concede Blessing a 1 alleato e ne aumenta il danno dell'8.0%/10.7%/10.7%/13.3%/13.3%/16.0%/16.0%; se il bersaglio è di attributo Bless, danno Bless +13.5%/18.0%/18.0%/22.5%/22.5%/27.0%/27.0% in più. L'effetto si riattiva ogni 2 turni.",
 "Cyclotron": "Attack +28.0%/32.7%/37.3%/42.0%/46.7%/51.3%/56.0%. All'inizio della battaglia, Crit Rate +9.5%/11.1%/12.7%/14.2%/15.8%/17.4%/19.0%. Quando gli alleati infliggono danno Electric, concede Magnetized Plasma a tutti gli alleati per 2 turni: danno +9.0%/10.5%/12.0%/13.5%/15.0%/16.5%/18.0% e, infliggendo danno Electric, danno critico +9.0%/10.5%/12.0%/13.5%/15.0%/16.5%/18.0%.",
 "Eye of Obsequies": "Attack +28.0%/28.0%/37.3%/37.3%/46.7%/46.7%/56.0%. Dopo aver inflitto un'alterazione di stato a un nemico, per 3 turni: resistenza alle alterazioni del nemico −12%, DEF −5.0%/6.7%/6.7%/8.3%/8.3%/10.0%/10.0% e Attack dell'utilizzatore +10.0%/13.3%/13.3%/16.7%/16.7%/20.0%/20.0%; fino a 2 stack (spesi separatamente). Con 1 stack, danno Physical subito dal bersaglio +14.0%/18.7%/18.7%/23.3%/23.3%/28.0%/28.0% per 3 turni.",
 "Cursed Ties": "Ailment Accuracy +34.0%/39.7%/45.3%/51.0%/56.7%/62.3%/68.0%. Dopo che un alleato infligge danno Curse, 70% di probabilità che Wonder infligga Evil Eye al bersaglio. Attaccando un nemico con Evil Eye, Attack +18.0%/21.0%/24.0%/27.0%/30.0%/33.0%/36.0%. Evil Eye: DEF −12.5%/14.6%/16.7%/18.8%/20.8%/22.9%/25.0% e danno subito dagli attacchi Curse +8.0%/9.3%/10.7%/12.0%/13.3%/14.7%/16.0% per 3 turni.",
 "All In": "Cure e scudi +20.0%/20.0%/26.7%/26.7%/33.3%/33.3%/40.0%. Aura: con l'utilizzatore in campo, Defense del party +15.0%/20.0%/20.0%/25.0%/25.0%/30.0%/30.0%. Dopo aver usato una skill su un alleato, ripristina il 10.0%/13.3%/13.3%/16.7%/16.7%/20.0%/20.0% degli HP massimi del bersaglio principale.",
 "Sennight Inferno": "Attack +28.0%/28.0%/37.3%/37.3%/46.7%/46.7%/56.0%. Per ogni Persona di attributo diverso equipaggiata, danno +6.0%/8.0%/8.0%/10.0%/10.0%/12.0%/12.0% (max 3 stack). Dopo aver atterrato (Down) un nemico, DEF del bersaglio −15.0%/20.0%/20.0%/25.0%/25.0%/30.0%/30.0% per 1 turno.",
}

GROUP_COMMENT_IT = {
 "Akechi can attack with two attributes, making it easier to trigger Kohryu's passive.": "Akechi può attaccare con due attributi, facilitando l'attivazione della passiva di Kohryu.",
 "Vasuki's DOT damage increase is not a damage bonus, but a separate multiplicative modifier.": "L'aumento del danno DOT di Vasuki non è un damage bonus, ma un modificatore moltiplicativo separato.",
 "Increase DOT damage by placing the Almighty attribute at the front and enhancing elemental damage through the Wonder weapon": "Aumenta il danno DOT mettendo l'attributo Almighty davanti e potenziando il danno elementale tramite la Wonder weapon.",
 "Increase DOT damage by placing the Almighty attribute at the front and enhancing elemental damage through the Wonder weapon. Curse Effect damage is Almighty damage.": "Aumenta il danno DOT mettendo l'attributo Almighty davanti e potenziando il danno elementale tramite la Wonder weapon. Il danno degli effetti Curse è danno Almighty.",
 "Apply Curse to the enemy, then resolve it through Pazuzu's passive. Curse damage is dealt as a percentage of the enemy's HP.": "Applica Curse al nemico, poi risolvilo tramite la passiva di Pazuzu. Il danno Curse è inflitto come percentuale degli HP del nemico.",
}

CATEGORY_IT = {
 "ATK": ("Buff offensivi (ATK)", "Persona che aumentano Attack o danno del party/del DPS, o specializzate nell'elemento del personaggio."),
 "CRITICAL": ("Critico", "Persona che aumentano Crit Rate o danno critico (Crit Mult)."),
 "REDUCE DEF": ("Riduzione DEF", "Persona che abbassano la Defense nemica o ne aumentano il danno subito."),
 "DEF/SHIELD": ("DEF / Scudi", "Persona di scudi e Defense, per chi scala sulla Defense."),
 "DOT": ("Danno continuo (DOT)", "Persona che applicano o amplificano danni continui."),
 "HEAL": ("Cure", "Persona di supporto curativo."),
 "PERSONA": ("Persona consigliate", "Persona indicate da lufel per questo personaggio."),
}

SPECIAL_LINEUP_IT = {
 ("crow", "Can record and attack with Skill 3 to boost overall damage."): "Akechi può registrarne gli attacchi e attaccare con la Skill 3 per aumentare il danno complessivo.",
 ("turbo", "Provides high Penetration, ATK, and Damage Mult. buffs, enabling flexible tactics through additional turns."): "Fornisce alti buff di Penetration, ATK e Damage Mult, permettendo tattiche flessibili tramite i turni aggiuntivi.",
 ("wind-tempest", "Riko provides high ATK and CRIT Mult buffs."): "Riko fornisce alti buff di ATK e CRIT Mult.",
}
