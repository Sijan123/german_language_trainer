/*
 * Grammatik, als Kurs — Schritte plus Neu 3 (A2.1), Lektion 1 bis 7.
 *
 * The Themen list next door is a reference: twenty-four A2 structures, each one
 * a card you look up when a vocabulary word points at it. That is the right
 * shape for looking something up and the wrong shape for learning, because
 * nothing in it says what comes first.
 *
 * This file is the other shape. It follows the course book chapter by chapter
 * and, inside a chapter, Lernschritt by Lernschritt, with the book's own
 * headings (A ICH BIN TRAURIG, WEIL ICH …) and the book's own grammar labels
 * (Nebensätze mit weil). Someone working through the actual book can open the
 * matching chapter here and find the same material, laid out longer: the rule,
 * the paradigm as a table, example sentences, and the one mistake that
 * structure invites.
 *
 * Steps that teach a skill rather than a structure (D TELEFONGESPRÄCHE AM
 * ARBEITSPLATZ) are kept, because dropping them would renumber the chapter and
 * break the promise that this is the same book. They carry `kind: "wortschatz"`
 * and show Redemittel instead of a paradigm.
 *
 * `deepen` is the part that is NOT in Schritte 3. A2.1 is taught by several
 * books at once and they do not agree on what belongs at this level: Menschen
 * A2 teaches Adjektivdeklination and deshalb where Schritte 3 does not, and
 * Schritte 3 teaches Direktionaladverbien where Menschen does not. So each
 * chapter carries a second layer, drawn from the parallel books and named with
 * its source, that sits under the same topic rather than in a chapter of its
 * own: weil in Lektion 1 pulls in denn and deshalb, Wechselpräpositionen in
 * Lektion 2 pulls in the full verb pairs. Learn the chapter, then go deeper on
 * the same thing — never a different thing. SOURCES at the bottom lists what
 * every layer came from.
 *
 * Each chapter ends in a test, and the test is deliberately stingy. Every gap
 * is a drop-down, so the answer is always among the options and there is
 * nothing to type; checking marks each gap right or wrong and says NOTHING
 * else. A gap you got right locks shut. A gap you got wrong stays open, stays
 * red, and keeps every one of its options — the right answer is never filled
 * in, never highlighted, never revealed. The only way out of a red gap is to
 * think again, which is the whole point: a revealed answer is read, agreed
 * with, and forgotten by the next question.
 *
 * `topic` on a step is the id of a card in the Themen list, so the two halves
 * of the Grammatik screen link to each other.
 */

/* ------------------------------------------------------------------ */
/* Lektion 1 — Ankommen                                                */
/* ------------------------------------------------------------------ */

const L1 = {
  nr: 1,
  title: "Ankommen",
  en: "Arriving",
  tone: "var(--t-alltag)",
  focus: "weil · Perfekt der trennbaren und nicht trennbaren Verben",

  steps: [
    {
      letter: "A",
      head: "Ich bin traurig, weil ich …",
      grammar: "Nebensätze mit weil",
      goal: "Gründe nennen.",
      topic: "nebensatz",
      summary: "weil answers Warum?. It opens a Nebensatz, and in a Nebensatz the conjugated verb leaves its usual second place and goes to the very END. A comma always separates the two halves.",
      pattern: "Hauptsatz , weil + Subjekt + … + VERB .",
      tables: [
        {
          caption: "Das Verb rutscht ans Ende",
          cols: ["Hauptsatz", "Nebensatz"],
          rows: [
            ["Ich bin traurig,", "weil ich meine Freunde <b>vermisse</b>."],
            ["Tim ist umgezogen,", "weil er eine neue Arbeit <b>hat</b>."],
            ["Ich bin müde,", "weil ich früh <b>aufstehe</b>."],
            ["Ich komme nicht mit,", "weil ich arbeiten <b>muss</b>."],
            ["Sie ist glücklich,", "weil sie eine Wohnung gefunden <b>hat</b>."]
          ]
        }
      ],
      notes: [
        "Two verbs in the clause? The conjugated one goes last: <b>weil ich arbeiten muss</b> (the modal last), <b>weil ich umgezogen bin</b> (haben/sein last, after the participle).",
        "A separable verb does not separate here — it stays whole at the end: <b>weil ich früh aufstehe</b>."
      ],
      examples: [
        { de: "Ich bin traurig, weil ich meine Freunde vermisse.", en: "I'm sad because I miss my friends." },
        { de: "Wir ziehen um, weil die Wohnung zu klein ist.", en: "We're moving because the flat is too small." },
        { de: "Er lernt Deutsch, weil er hier arbeiten will.", en: "He's learning German because he wants to work here." },
        { de: "Ich bin müde, weil ich gestern lange gearbeitet habe.", en: "I'm tired because I worked late yesterday." },
        { de: "Sie freut sich, weil ihre Nachbarn so freundlich sind.", en: "She's pleased because her neighbours are so friendly." }
      ],
      watch: "The weil-clause can also come first — and then the main clause starts with its verb: „Weil ich meine Freunde vermisse, <b>bin</b> ich traurig.“ The Nebensatz has taken up position 1, so the verb still comes second."
    },
    {
      letter: "B",
      head: "Ich habe schon … kennengelernt.",
      grammar: "Perfekt der trennbaren Verben",
      goal: "Von Alltagserlebnissen berichten.",
      topic: "partizip",
      summary: "A separable verb builds its participle around the ge-: the prefix stays at the front, ge- slots in behind it, and the whole thing is written as ONE word at the end of the sentence.",
      pattern: "Vorsilbe + ge + Stamm + t / en   →   ein·ge·kauft · auf·ge·standen",
      tables: [
        {
          caption: "Infinitiv → Partizip II",
          cols: ["Infinitiv", "Partizip II", "haben/sein"],
          rows: [
            ["einkaufen", "ein<b>ge</b>kauft", "hat"],
            ["aufräumen", "auf<b>ge</b>räumt", "hat"],
            ["anrufen", "an<b>ge</b>rufen", "hat"],
            ["kennenlernen", "kennen<b>ge</b>lernt", "hat"],
            ["mitbringen", "mit<b>ge</b>bracht", "hat"],
            ["aufstehen", "auf<b>ge</b>standen", "ist"],
            ["umziehen", "um<b>ge</b>zogen", "ist"],
            ["ausgehen", "aus<b>ge</b>gangen", "ist"]
          ]
        }
      ],
      notes: [
        "Eine Aussage gliedern — the words the book gives you for telling a story in order: <b>zuerst</b>, <b>dann</b>, <b>danach</b>, <b>später</b>, <b>zum Schluss</b>. Each can stand in first place, and then the verb still follows immediately: „Zuerst <b>habe</b> ich eingekauft.“"
      ],
      examples: [
        { de: "Ich habe schon viele Nachbarn kennengelernt.", en: "I've already met a lot of neighbours." },
        { de: "Zuerst habe ich die Wohnung aufgeräumt.", en: "First I tidied the flat." },
        { de: "Danach habe ich im Supermarkt eingekauft.", en: "After that I did the shopping at the supermarket." },
        { de: "Ich bin heute um sechs Uhr aufgestanden.", en: "I got up at six today." },
        { de: "Letzte Woche bin ich nach Friedrichshafen umgezogen.", en: "Last week I moved to Friedrichshafen." }
      ],
      watch: "One word, not two: <b>eingekauft</b>, never „ein gekauft“. The stress tells you it is separable — <b>EIN</b>kaufen, <b>AUF</b>stehen. If you hear the stress on the prefix, the ge- goes in the middle."
    },
    {
      letter: "C",
      head: "So was hast du noch nicht erlebt!",
      grammar: "Perfekt der nicht trennbaren Verben und der Verben auf -ieren",
      goal: "Von Pannen im Alltag erzählen.",
      topic: "partizip",
      summary: "Two groups build their participle with NO ge- at all: verbs with an inseparable prefix (be-, ge-, er-, ver-, ent-, emp-, miss-, zer-) and verbs ending in -ieren.",
      pattern: "be/ge/er/ver/ent + Stamm + t / en   ·   …ieren → …iert",
      tables: [
        {
          caption: "Kein ge-",
          cols: ["Infinitiv", "Partizip II", "haben/sein"],
          rows: [
            ["bezahlen", "bezahlt", "hat"],
            ["erleben", "erlebt", "hat"],
            ["verstehen", "verstanden", "hat"],
            ["bekommen", "bekommen", "hat"],
            ["vergessen", "vergessen", "hat"],
            ["telefonieren", "telefoniert", "hat"],
            ["reparieren", "repariert", "hat"],
            ["passieren", "passiert", "ist"]
          ]
        }
      ],
      notes: [
        "Three families, one question — <em>where does the ge- go?</em> Regular: <b>ge</b>macht. Separable: ein<b>ge</b>kauft. Inseparable or -ieren: bezahlt, studiert. There is nowhere else to put it."
      ],
      examples: [
        { de: "So was hast du noch nicht erlebt!", en: "You've never been through anything like that!" },
        { de: "Ich habe die Rechnung schon bezahlt.", en: "I've already paid the bill." },
        { de: "Was ist denn passiert?", en: "So what happened?" },
        { de: "Ich habe meinen Schlüssel vergessen.", en: "I forgot my key." },
        { de: "Hast du das verstanden?", en: "Did you understand that?" },
        { de: "Wir haben zwei Stunden telefoniert.", en: "We were on the phone for two hours." }
      ],
      watch: "Stress again: ver<b>GES</b>sen, be<b>ZAH</b>len — the prefix is unstressed, so it is inseparable and there is no ge-. Compare <b>AN</b>rufen → angerufen."
    },
    {
      letter: "D",
      head: "Familie und Verwandte",
      kind: "wortschatz",
      goal: "Über die Familie berichten.",
      summary: "Relatives, and the everyday way of saying whose relative someone is: von + Dativ rather than a genitive.",
      examples: [
        { de: "Das ist der Bruder von meinem Vater — mein Onkel.", en: "That's my father's brother — my uncle." },
        { de: "Die Schwester von meiner Mutter heißt Anna.", en: "My mother's sister is called Anna." },
        { de: "Meine Großeltern wohnen auf dem Land.", en: "My grandparents live in the country." },
        { de: "Wir haben eine Nichte und zwei Neffen.", en: "We have one niece and two nephews." },
        { de: "Meine Schwiegereltern besuchen uns am Wochenende.", en: "My parents-in-law are visiting us at the weekend." }
      ]
    },
    {
      letter: "E",
      head: "Wohn- und Lebensformen",
      kind: "wortschatz",
      goal: "Von Wohn- und Lebensformen erzählen.",
      summary: "How people live: alone, as a couple, sharing, with the family.",
      examples: [
        { de: "Ich wohne allein in einer kleinen Wohnung.", en: "I live alone in a small flat." },
        { de: "Wir wohnen zusammen in einer WG.", en: "We share a flat." },
        { de: "Sie lebt mit ihrem Partner zusammen.", en: "She lives with her partner." },
        { de: "Meine Eltern wohnen in einem Reihenhaus.", en: "My parents live in a terraced house." },
        { de: "Immer mehr Menschen leben allein.", en: "More and more people live alone." }
      ]
    }
  ],

  deepen: [
    {
      head: "weil · denn · deshalb",
      grammar: "Drei Wege, einen Grund zu nennen",
      source: "Menschen A2, Lektion 8",
      summary: "Same meaning, three different word orders — and this is exactly where A2 learners lose marks. weil sends the verb to the end. denn changes nothing. deshalb is not a conjunction at all but an adverb, so it takes position 1 and the verb follows it.",
      pattern: "…, weil ich keine Zeit HABE. · …, denn ich HABE keine Zeit. · Deshalb HABE ich keine Zeit.",
      tables: [
        {
          caption: "Grund und Folge",
          cols: ["Wort", "Was folgt", "Beispiel"],
          rows: [
            ["weil", "Nebensatz — Verb am Ende", "Ich komme nicht, weil ich keine Zeit <b>habe</b>."],
            ["denn", "Hauptsatz — Verb bleibt auf Position 2", "Ich komme nicht, denn ich <b>habe</b> keine Zeit."],
            ["deshalb", "Hauptsatz — Verb direkt nach deshalb", "Ich habe keine Zeit. Deshalb <b>komme</b> ich nicht."]
          ]
        }
      ],
      notes: [
        "weil and denn introduce the <b>reason</b>. deshalb introduces the <b>consequence</b> — so the two halves swap places when you switch.",
        "Also in this family: <b>darum</b> and <b>deswegen</b>, which behave exactly like deshalb."
      ],
      examples: [
        { de: "Ich bleibe zu Hause, weil es regnet.", en: "I'm staying home because it's raining." },
        { de: "Ich bleibe zu Hause, denn es regnet.", en: "I'm staying home, for it's raining." },
        { de: "Es regnet. Deshalb bleibe ich zu Hause.", en: "It's raining. That's why I'm staying home." },
        { de: "Sie hat den Zug verpasst, deshalb kommt sie später.", en: "She missed the train, so she's coming later." }
      ],
      watch: "„Deshalb ich bleibe zu Hause“ is the classic error. deshalb has taken position 1, so the verb must come second: <b>deshalb bleibe ich</b>."
    },
    {
      head: "war, hatte — oder habe … gemacht?",
      grammar: "Präteritum von sein und haben neben dem Perfekt",
      source: "Menschen A2, Lektion 1 · Schritte plus Neu 3, Lektion 6",
      summary: "German has two past tenses in everyday speech and splits the work between them. For sein, haben and the modals you use the Präteritum. For everything else you use the Perfekt. Both translate as plain English past.",
      pattern: "sein/haben/Modalverb → Präteritum   ·   alle anderen Verben → Perfekt",
      tables: [
        {
          caption: "sein und haben im Präteritum",
          cols: ["", "sein", "haben"],
          rows: [
            ["ich", "war", "hatte"],
            ["du", "warst", "hattest"],
            ["er/sie/es", "war", "hatte"],
            ["wir", "waren", "hatten"],
            ["ihr", "wart", "hattet"],
            ["sie/Sie", "waren", "hatten"]
          ]
        }
      ],
      notes: [
        "ich and er/sie/es are identical in the Präteritum — in every verb, always. There is no -t on er/sie/es here."
      ],
      examples: [
        { de: "Gestern war ich sehr müde.", en: "Yesterday I was very tired." },
        { de: "Wir hatten keine Zeit.", en: "We had no time." },
        { de: "Ich hatte Glück, denn der Zug war pünktlich.", en: "I was lucky, because the train was on time." },
        { de: "Als Kind war ich oft krank.", en: "As a child I was often ill." },
        { de: "Ich habe die Wohnung gefunden. Sie war billig.", en: "I found the flat. It was cheap." }
      ],
      watch: "„Ich bin müde gewesen“ and „Ich habe Zeit gehabt“ are not wrong, but they sound heavy. Germans say <b>ich war</b> and <b>ich hatte</b>."
    },
    {
      head: "unser und euer",
      grammar: "Possessivartikel — die zwei, die wehtun",
      source: "Menschen A2, Lektion 1",
      summary: "The full set is mein, dein, sein, ihr, unser, euer, ihr, Ihr, and they all take the same endings. unser and euer are the awkward ones, because euer drops its second e as soon as an ending arrives.",
      pattern: "unser → unser·e · unser·en   ·   euer → eur·e · eur·en",
      tables: [
        {
          caption: "Nominativ und Akkusativ",
          cols: ["", "der (Nom.)", "den (Akk.)", "das", "die", "die (Pl.)"],
          rows: [
            ["unser", "unser Sohn", "unseren Sohn", "unser Kind", "unsere Tochter", "unsere Kinder"],
            ["euer", "euer Sohn", "euren Sohn", "euer Kind", "eure Tochter", "eure Kinder"]
          ]
        }
      ],
      examples: [
        { de: "Unser Sohn geht schon zur Schule.", en: "Our son already goes to school." },
        { de: "Wir besuchen unsere Großeltern.", en: "We're visiting our grandparents." },
        { de: "Ist das euer Auto?", en: "Is that your car?" },
        { de: "Wie heißen eure Kinder?", en: "What are your children called?" }
      ],
      watch: "<b>eure</b> Kinder, not „euere Kinder“. The e of euer disappears whenever an ending is added."
    }
  ],

  test: [
    { rule: "weil-end", en: "I'm pleased because the flat is big.",
      parts: ["Ich bin froh, weil die Wohnung groß ", { options: ["ist", "sein", "bist"], answer: "ist" }, "."] },
    { rule: "weil-perfekt", en: "He's moving because he's found a new job.",
      parts: ["Er zieht um, weil er eine neue Arbeit gefunden ", { options: ["hat", "haben", "ist"], answer: "hat" }, "."] },
    { rule: "weil-trennbar", en: "I'm tired because I get up at five.",
      parts: ["Ich bin müde, weil ich um fünf Uhr ", { options: ["aufstehe", "stehe auf", "auf stehe"], answer: "aufstehe" }, "."] },
    { rule: "weil-modal", en: "I'm not coming because I have to work.",
      parts: ["Ich komme nicht, weil ich arbeiten ", { options: ["muss", "musse", "müssen"], answer: "muss" }, "."] },
    { rule: "nebensatz-vorn", en: "Because it's raining, I'm staying at home.",
      parts: ["Weil es regnet, ", { options: ["bleibe ich", "ich bleibe", "bleibt ich"], answer: "bleibe ich" }, " zu Hause."] },
    { rule: "partizip-trennbar", en: "I've already met a lot of neighbours.",
      parts: ["Ich habe schon viele Nachbarn ", { options: ["kennengelernt", "kennenlernt", "gekennenlernt"], answer: "kennengelernt" }, "."] },
    { rule: "partizip-trennbar", en: "First I tidied up.",
      parts: ["Zuerst habe ich ", { options: ["aufgeräumt", "geaufräumt", "aufräumt"], answer: "aufgeräumt" }, "."] },
    { rule: "partizip-trennbar", en: "Then I did the shopping at the supermarket.",
      parts: ["Dann habe ich im Supermarkt ", { options: ["eingekauft", "geeinkauft", "einkauft"], answer: "eingekauft" }, "."] },
    { rule: "perfekt-sein", en: "Last week I moved house.",
      parts: ["Letzte Woche ", { options: ["bin", "habe", "war"], answer: "bin" }, " ich umgezogen."] },
    { rule: "partizip-untrennbar", en: "I've already paid the bill.",
      parts: ["Ich habe die Rechnung schon ", { options: ["bezahlt", "gebezahlt", "bezahlen"], answer: "bezahlt" }, "."] },
    { rule: "partizip-ieren", en: "What on earth happened?",
      parts: ["Was ist denn ", { options: ["passiert", "gepassiert", "passieren"], answer: "passiert" }, "?"] },
    { rule: "partizip-ieren", en: "We were on the phone for two hours.",
      parts: ["Wir haben zwei Stunden ", { options: ["telefoniert", "getelefoniert", "telefonieren"], answer: "telefoniert" }, "."] },
    { rule: "partizip-untrennbar", en: "Have you understood everything?",
      parts: ["Hast du alles ", { options: ["verstanden", "geverstanden", "verstehen"], answer: "verstanden" }, "?"] },
    { rule: "von-dativ", en: "That's my mother's sister.",
      parts: ["Das ist die Schwester ", { options: ["von", "aus", "für"], answer: "von" }, " meiner Mutter."] },
    { rule: "denn-wortstellung", en: "I'm not coming, for I have no time.",
      parts: ["Ich komme nicht, denn ich ", { options: ["habe keine Zeit", "keine Zeit habe", "habe nicht Zeit"], answer: "habe keine Zeit" }, "."] },
    { rule: "deshalb-wortstellung", en: "It's raining. That's why I'm staying at home.",
      parts: ["Es regnet. Deshalb ", { options: ["bleibe ich", "ich bleibe", "bleiben ich"], answer: "bleibe ich" }, " zu Hause."] },
    { rule: "praet-sein-haben", en: "Yesterday I was very tired.",
      parts: ["Gestern ", { options: ["war", "bin", "habe"], answer: "war" }, " ich sehr müde."] },
    { rule: "praet-sein-haben", en: "We had no time.",
      parts: ["Wir ", { options: ["hatten", "haben gehabt", "waren"], answer: "hatten" }, " keine Zeit."] },
    { rule: "possessiv-euer", en: "What are your children called?",
      parts: ["Wie heißen ", { options: ["eure", "euere", "euer"], answer: "eure" }, " Kinder?"] },
    { rule: "possessiv-unser", en: "We're visiting our grandparents.",
      parts: ["Wir besuchen ", { options: ["unsere", "unser", "unseren"], answer: "unsere" }, " Großeltern."] }
  ]
};

/* ------------------------------------------------------------------ */
/* Lektion 2 — Zu Hause                                                */
/* ------------------------------------------------------------------ */

const L2 = {
  nr: 2,
  title: "Zu Hause",
  en: "At home",
  tone: "var(--t-wohnen)",
  focus: "Wechselpräpositionen · Wo? mit Dativ, Wohin? mit Akkusativ",

  steps: [
    {
      letter: "A",
      head: "Die Lampe hängt an der Decke.",
      grammar: "Positionsverben liegen, stehen, stecken, hängen; Wechselpräpositionen mit Dativ",
      goal: "Ortsangaben machen: Wo …?",
      topic: "praepositionen",
      summary: "Nine prepositions can take either case, and the case is decided by the question. Wo? — nothing is moving, something simply IS somewhere — takes the Dativ. The verb that goes with it is a position verb: liegen, stehen, stecken, hängen, sitzen.",
      pattern: "Wo? → Dativ:  dem (der/das) · der (die) · den + n (Plural)",
      tables: [
        {
          caption: "Die neun Wechselpräpositionen, hier mit Dativ",
          cols: ["Präposition", "maskulin / neutrum", "feminin", "Plural"],
          rows: [
            ["in", "in <b>dem</b> Schrank = im", "in <b>der</b> Küche", "in <b>den</b> Schränken"],
            ["an", "an <b>dem</b> Tisch = am", "an <b>der</b> Wand", "an <b>den</b> Wänden"],
            ["auf", "auf <b>dem</b> Tisch", "auf <b>der</b> Couch", "auf <b>den</b> Stühlen"],
            ["über", "über <b>dem</b> Bett", "über <b>der</b> Tür", "über <b>den</b> Betten"],
            ["unter", "unter <b>dem</b> Bett", "unter <b>der</b> Lampe", "unter <b>den</b> Büchern"],
            ["vor", "vor <b>dem</b> Haus", "vor <b>der</b> Tür", "vor <b>den</b> Fenstern"],
            ["hinter", "hinter <b>dem</b> Sofa", "hinter <b>der</b> Tür", "hinter <b>den</b> Häusern"],
            ["neben", "neben <b>dem</b> Bett", "neben <b>der</b> Lampe", "neben <b>den</b> Stühlen"],
            ["zwischen", "zwischen <b>dem</b> …", "zwischen <b>der</b> …", "zwischen <b>den</b> Betten"]
          ]
        },
        {
          caption: "Positionsverben — Wo?",
          cols: ["Verb", "Beispiel", "Präteritum / Perfekt"],
          rows: [
            ["liegen", "Das Buch <b>liegt</b> auf dem Tisch.", "lag · hat gelegen"],
            ["stehen", "Die Flaschen <b>stehen</b> in der Küche.", "stand · hat gestanden"],
            ["stecken", "Der Schlüssel <b>steckt</b> im Schloss.", "steckte · hat gesteckt"],
            ["hängen", "Die Lampe <b>hängt</b> an der Decke.", "hing · hat gehangen"],
            ["sitzen", "Die Katze <b>sitzt</b> auf dem Stuhl.", "saß · hat gesessen"]
          ]
        }
      ],
      notes: [
        "Two contractions you will use constantly: in + dem = <b>im</b>, an + dem = <b>am</b>.",
        "Dativ Plural adds an -n to the noun as well: in den Schränke<b>n</b>, auf den Stühle<b>n</b>."
      ],
      examples: [
        { de: "Die Lampe hängt an der Decke.", en: "The lamp is hanging from the ceiling." },
        { de: "Das Buch liegt auf dem Tisch.", en: "The book is lying on the table." },
        { de: "Die Gläser stehen im Schrank.", en: "The glasses are in the cupboard." },
        { de: "Der Schlüssel steckt in der Tür.", en: "The key is in the door." },
        { de: "Zwischen den Betten steht ein kleiner Tisch.", en: "There's a small table between the beds." }
      ],
      watch: "Flat things <b>liegen</b>, upright things <b>stehen</b>. A plate lies on the table, a bottle stands on it. English uses „is“ for both and that is why this needs practising."
    },
    {
      letter: "B",
      head: "Kann ich das auf den Tisch legen?",
      grammar: "Richtungsverben legen, stellen, stecken, hängen; Wechselpräpositionen mit Akkusativ",
      goal: "Ortsangaben machen: Wohin …?",
      topic: "praepositionen",
      summary: "Same nine prepositions, other case. Wohin? — something is being moved, it ends up somewhere — takes the Akkusativ. And the verb changes with it: legen, stellen, stecken, hängen, setzen.",
      pattern: "Wohin? → Akkusativ:  den (der) · das (das) · die (die) · die (Plural)",
      tables: [
        {
          caption: "Dieselben Präpositionen, jetzt mit Akkusativ",
          cols: ["Präposition", "maskulin", "neutrum", "feminin / Plural"],
          rows: [
            ["in", "in <b>den</b> Schrank", "in <b>das</b> Regal = ins", "in <b>die</b> Küche / Schränke"],
            ["an", "an <b>den</b> Tisch", "an <b>das</b> Fenster = ans", "an <b>die</b> Wand / Wände"],
            ["auf", "auf <b>den</b> Tisch", "auf <b>das</b> Sofa", "auf <b>die</b> Couch / Stühle"],
            ["über", "über <b>den</b> Tisch", "über <b>das</b> Bett", "über <b>die</b> Tür / Betten"],
            ["unter", "unter <b>den</b> Tisch", "unter <b>das</b> Bett", "unter <b>die</b> Lampe / Bücher"],
            ["vor", "vor <b>den</b> Schrank", "vor <b>das</b> Haus", "vor <b>die</b> Tür / Fenster"],
            ["hinter", "hinter <b>den</b> Schrank", "hinter <b>das</b> Sofa", "hinter <b>die</b> Tür / Häuser"],
            ["neben", "neben <b>den</b> Schrank", "neben <b>das</b> Bett", "neben <b>die</b> Lampe / Stühle"],
            ["zwischen", "zwischen <b>den</b> …", "zwischen <b>das</b> …", "zwischen <b>die</b> Betten"]
          ]
        },
        {
          caption: "Die Paare, die man zusammen lernt",
          cols: ["Wo? (Dativ)", "Wohin? (Akkusativ)"],
          rows: [
            ["liegen — Es <b>liegt</b> auf dem Tisch.", "legen — Ich <b>lege</b> es auf den Tisch."],
            ["stehen — Es <b>steht</b> im Schrank.", "stellen — Ich <b>stelle</b> es in den Schrank."],
            ["sitzen — Er <b>sitzt</b> auf dem Stuhl.", "setzen — Er <b>setzt</b> sich auf den Stuhl."],
            ["stecken — Es <b>steckt</b> in der Tasche.", "stecken — Ich <b>stecke</b> es in die Tasche."],
            ["hängen — Es <b>hängt</b> an der Wand.", "hängen — Ich <b>hänge</b> es an die Wand."]
          ]
        }
      ],
      notes: [
        "Contractions here: in + das = <b>ins</b>, an + das = <b>ans</b>.",
        "The Wo?-verbs are irregular (lag, stand, hing); the Wohin?-verbs are all regular (legte/gelegt, stellte/gestellt, hängte/gehängt). That is a reliable way to check which one you have used."
      ],
      examples: [
        { de: "Kann ich das auf den Tisch legen?", en: "Can I put this on the table?" },
        { de: "Stell die Flaschen bitte in die Küche.", en: "Please put the bottles in the kitchen." },
        { de: "Ich hänge das Bild an die Wand.", en: "I'm hanging the picture on the wall." },
        { de: "Steck den Schlüssel in die Tasche.", en: "Put the key in your pocket." },
        { de: "Setzen Sie sich bitte auf das Sofa.", en: "Please sit down on the sofa." }
      ],
      watch: "The question decides the case, not the preposition and not the furniture. „Ich lege das Buch auf <b>den</b> Tisch“ (Wohin? → Akkusativ) but „Das Buch liegt auf <b>dem</b> Tisch“ (Wo? → Dativ)."
    },
    {
      letter: "C",
      head: "Stellen Sie die Leiter dahin.",
      grammar: "Direktionaladverbien hierhin, dahin, dorthin, rein, raus, rauf, runter, rüber",
      goal: "Richtungen angeben.",
      summary: "Spoken German has a set of short direction words that save you a whole prepositional phrase. They all answer Wohin?, and they are what people actually say.",
      pattern: "hier → hierhin · da → dahin · dort → dorthin   ·   rein · raus · rauf · runter · rüber",
      tables: [
        {
          caption: "Wo? und Wohin?",
          cols: ["Wo? (Position)", "Wohin? (Richtung)"],
          rows: [
            ["hier", "hierhin"],
            ["da", "dahin"],
            ["dort", "dorthin"],
            ["drinnen / draußen", "rein / raus"],
            ["oben / unten", "rauf / runter"],
            ["drüben", "rüber"]
          ]
        },
        {
          caption: "Die kurzen Formen",
          cols: ["Kurzform", "Lange Form", "Beispiel"],
          rows: [
            ["rein", "herein / hinein", "Komm <b>rein</b>!"],
            ["raus", "heraus / hinaus", "Bring den Müll <b>raus</b>."],
            ["rauf", "herauf / hinauf", "Gehen Sie die Treppe <b>rauf</b>."],
            ["runter", "herunter / hinunter", "Kannst du <b>runter</b>kommen?"],
            ["rüber", "herüber / hinüber", "Ich komme gleich <b>rüber</b>."]
          ]
        }
      ],
      notes: [
        "These stick to the verb like a separable prefix: rein<b>kommen</b>, raus<b>bringen</b>, rüber<b>gehen</b> — and they behave like one, jumping to the end: „Ich komme später <b>rüber</b>.“"
      ],
      examples: [
        { de: "Stellen Sie die Leiter dahin.", en: "Put the ladder over there." },
        { de: "Komm rein, die Tür ist offen!", en: "Come in, the door's open!" },
        { de: "Bring bitte den Müll raus.", en: "Please take the rubbish out." },
        { de: "Das Bad ist oben — gehen Sie die Treppe rauf.", en: "The bathroom is upstairs — go up the stairs." },
        { de: "Ich komme nachher kurz rüber.", en: "I'll pop over later." }
      ],
      watch: "hier/da/dort answer <b>Wo?</b>; hierhin/dahin/dorthin answer <b>Wohin?</b>. „Stellen Sie die Leiter da“ is understood but wrong — the ladder is being moved, so it needs <b>dahin</b>."
    },
    {
      letter: "D",
      head: "Mitteilungen im Mietshaus",
      kind: "wortschatz",
      goal: "Mitteilungen und Regeln in Mietshäusern verstehen.",
      summary: "The notices in a German stairwell have their own register: impersonal, passive-ish, and strict. man is the key word.",
      examples: [
        { de: "Bitte die Haustür immer schließen!", en: "Please always close the front door!" },
        { de: "Von 22 bis 7 Uhr ist Nachtruhe.", en: "Quiet hours are from 10pm to 7am." },
        { de: "Im Treppenhaus darf man nicht rauchen.", en: "Smoking is not allowed in the stairwell." },
        { de: "Der Hausmeister ist von 8 bis 12 Uhr im Haus.", en: "The caretaker is in the building from 8 to 12." },
        { de: "Fahrräder bitte nicht im Flur abstellen.", en: "Please don't leave bicycles in the hallway." }
      ]
    },
    {
      letter: "E",
      head: "Zusammen leben",
      kind: "wortschatz",
      goal: "Gespräche mit Nachbarn führen und Nachrichten an Nachbarn schreiben.",
      summary: "Asking a neighbour for something, and apologising — the two things you will actually need.",
      examples: [
        { de: "Entschuldigen Sie die Störung — können Sie mir kurz helfen?", en: "Sorry to bother you — could you help me for a moment?" },
        { de: "Könnten Sie bitte die Musik leiser machen?", en: "Could you turn the music down, please?" },
        { de: "Tut mir leid, das wusste ich nicht.", en: "I'm sorry, I didn't know that." },
        { de: "Würden Sie meine Pflanzen gießen, wenn ich weg bin?", en: "Would you water my plants while I'm away?" },
        { de: "Kein Problem, das mache ich gern.", en: "No problem, I'll gladly do that." }
      ]
    }
  ],

  deepen: [
    {
      head: "Die anderen Präpositionen",
      grammar: "Nur Dativ, nur Akkusativ — und wann in nicht geht",
      source: "Menschen A2, Lektion 2 · Goethe-Zertifikat A2, Grammatik-Inventar",
      summary: "The nine Wechselpräpositionen are the interesting case because they vary. The rest never vary, and it is worth having them as two closed lists so you stop wondering.",
      pattern: "immer Dativ: aus bei mit nach seit von zu   ·   immer Akkusativ: durch für gegen ohne um",
      tables: [
        {
          caption: "Feste Präpositionen",
          cols: ["Immer Dativ", "Immer Akkusativ"],
          rows: [
            ["aus — aus der Türkei", "durch — durch den Park"],
            ["bei — bei meiner Schwester", "für — für meinen Vater"],
            ["mit — mit dem Bus", "gegen — gegen die Wand"],
            ["nach — nach der Arbeit", "ohne — ohne meinen Mantel"],
            ["seit — seit einem Jahr", "um — um die Ecke"],
            ["von — von meinem Chef", ""],
            ["zu — zu der Ärztin = zur", ""]
          ]
        },
        {
          caption: "Wohin? — drei verschiedene Wörter",
          cols: ["Ziel", "Präposition", "Beispiel"],
          rows: [
            ["Stadt, Land", "nach", "Ich fahre <b>nach</b> Berlin."],
            ["Person, Firma, Arzt", "zu", "Ich gehe <b>zu</b> meiner Schwester."],
            ["Gebäude, Raum (hinein)", "in + Akkusativ", "Ich gehe <b>ins</b> Kino."]
          ]
        }
      ],
      notes: [
        "Contractions worth memorising: zu + dem = <b>zum</b>, zu + der = <b>zur</b>, von + dem = <b>vom</b>, bei + dem = <b>beim</b>."
      ],
      examples: [
        { de: "Nach der Arbeit gehe ich zum Sport.", en: "After work I go to my sport." },
        { de: "Ich fahre mit dem Fahrrad zur Arbeit.", en: "I cycle to work." },
        { de: "Das Geschenk ist für meine Nachbarin.", en: "The present is for my neighbour." },
        { de: "Wir gehen heute Abend ins Kino.", en: "We're going to the cinema this evening." },
        { de: "Ohne meinen Schlüssel komme ich nicht rein.", en: "Without my key I can't get in." }
      ],
      watch: "„Ich gehe <b>zum</b> Arzt“, not „in den Arzt“. People and practices take <b>zu</b>; rooms and buildings you physically enter take <b>in</b> + Akkusativ."
    },
    {
      head: "Wortbildung: der Vermieter, die Wohnung",
      grammar: "Nomen aus Verben: Verb + -er und Verb + -ung",
      source: "Menschen A2, Lektion 3",
      summary: "Two endings turn a verb you know into a noun you did not have to learn — and both come with a free gender rule. -er is a person and is always der. -ung is a thing or a process and is always die.",
      pattern: "vermieten → der Vermiet·er   ·   wohnen → die Wohn·ung",
      tables: [
        {
          caption: "Verb → Nomen",
          cols: ["Verb", "+ -er (der)", "+ -ung (die)"],
          rows: [
            ["wohnen", "der Bewohner", "die Wohnung"],
            ["vermieten", "der Vermieter", "die Vermietung"],
            ["mieten", "der Mieter", "—"],
            ["heizen", "—", "die Heizung"],
            ["einrichten", "—", "die Einrichtung"],
            ["arbeiten", "der Arbeiter", "—"],
            ["besichtigen", "—", "die Besichtigung"],
            ["lernen", "der Lerner", "—"]
          ]
        }
      ],
      notes: [
        "A woman gets -erin: der Vermieter → die Vermieter<b>in</b>, der Mieter → die Mieter<b>in</b>.",
        "Other endings with a fixed gender, worth having in the same drawer: <b>die</b> -heit, <b>die</b> -keit, <b>die</b> -schaft, <b>die</b> -ion, <b>das</b> -chen, <b>das</b> -lein."
      ],
      examples: [
        { de: "Der Vermieter wohnt im Erdgeschoss.", en: "The landlord lives on the ground floor." },
        { de: "Die Heizung funktioniert nicht.", en: "The heating isn't working." },
        { de: "Die Wohnungsbesichtigung ist am Freitag.", en: "The flat viewing is on Friday." },
        { de: "Unsere Nachbarin ist die Mieterin von Nummer 4.", en: "Our neighbour is the tenant of number 4." }
      ],
      watch: "This buys you gender for free: if a noun ends in <b>-ung</b> it is <b>die</b>, with no exceptions worth worrying about at A2."
    }
  ],

  test: [
    { rule: "wechsel-wo", en: "The lamp is hanging from the ceiling.",
      parts: ["Die Lampe hängt an ", { options: ["der", "die", "dem"], answer: "der" }, " Decke."] },
    { rule: "wechsel-wo", en: "The book is lying on the table.",
      parts: ["Das Buch liegt auf ", { options: ["dem", "den", "das"], answer: "dem" }, " Tisch."] },
    { rule: "wechsel-wohin", en: "Can I put this on the table?",
      parts: ["Kann ich das auf ", { options: ["den", "dem", "der"], answer: "den" }, " Tisch legen?"] },
    { rule: "wechsel-wohin", en: "Please put the bottles in the kitchen.",
      parts: ["Stell die Flaschen bitte in ", { options: ["die", "der", "dem"], answer: "die" }, " Küche."] },
    { rule: "positionsverb", en: "The glasses are in the cupboard.",
      parts: ["Die Gläser ", { options: ["stehen", "stellen", "liegen"], answer: "stehen" }, " im Schrank."] },
    { rule: "wechsel-wohin", en: "I'm hanging the picture on the wall.",
      parts: ["Ich hänge das Bild an ", { options: ["die", "der", "dem"], answer: "die" }, " Wand."] },
    { rule: "positionsverb", en: "Where is the key? — It's in the door.",
      parts: ["Der Schlüssel ", { options: ["steckt", "steckst", "stellt"], answer: "steckt" }, " in der Tür."] },
    { rule: "wechsel-wohin", en: "Please sit down on the sofa.",
      parts: ["Setzen Sie sich bitte auf ", { options: ["das", "dem", "der"], answer: "das" }, " Sofa."] },
    { rule: "richtungsverb", en: "I'm putting the plate on the table.",
      parts: ["Ich ", { options: ["lege", "liege", "stelle"], answer: "lege" }, " den Teller auf den Tisch."] },
    { rule: "dativ-plural-n", en: "There's a small table between the beds.",
      parts: ["Zwischen ", { options: ["den", "die", "dem"], answer: "den" }, " Betten steht ein kleiner Tisch."] },
    { rule: "direktionaladverb", en: "Put the ladder over there.",
      parts: ["Stellen Sie die Leiter ", { options: ["dahin", "da", "dort"], answer: "dahin" }, "."] },
    { rule: "kurzform", en: "Come in, the door's open!",
      parts: ["Komm ", { options: ["rein", "raus", "drinnen"], answer: "rein" }, ", die Tür ist offen!"] },
    { rule: "kurzform", en: "Please take the rubbish out.",
      parts: ["Bring bitte den Müll ", { options: ["raus", "rein", "draußen"], answer: "raus" }, "."] },
    { rule: "kurzform", en: "Go up the stairs.",
      parts: ["Gehen Sie die Treppe ", { options: ["rauf", "oben", "runter"], answer: "rauf" }, "."] },
    { rule: "feste-praep-dativ", en: "After work I go to my sport.",
      parts: ["Nach ", { options: ["der", "die", "dem"], answer: "der" }, " Arbeit gehe ich zum Sport."] },
    { rule: "feste-praep-dativ", en: "I cycle to work.",
      parts: ["Ich fahre mit ", { options: ["dem", "den", "das"], answer: "dem" }, " Fahrrad zur Arbeit."] },
    { rule: "zu-vs-in", en: "I'm going to my sister's.",
      parts: ["Ich gehe ", { options: ["zu", "nach", "in"], answer: "zu" }, " meiner Schwester."] },
    { rule: "nach-stadt", en: "In the summer we're flying to Istanbul.",
      parts: ["Im Sommer fliegen wir ", { options: ["nach", "zu", "in"], answer: "nach" }, " Istanbul."] },
    { rule: "zu-vs-in", en: "We're going to the cinema this evening.",
      parts: ["Wir gehen heute Abend ", { options: ["ins", "im", "zum"], answer: "ins" }, " Kino."] },
    { rule: "feste-praep-akk", en: "The present is for my neighbour.",
      parts: ["Das Geschenk ist für ", { options: ["meine", "meiner", "meinem"], answer: "meine" }, " Nachbarin."] },
    { rule: "artikel-ung", en: "The heating isn't working.",
      parts: [{ options: ["Die", "Der", "Das"], answer: "Die" }, " Heizung funktioniert nicht."] }
  ]
};

/* ------------------------------------------------------------------ */
/* Lektion 3 — Essen und Trinken                                       */
/* ------------------------------------------------------------------ */

const L3 = {
  nr: 3,
  title: "Essen und Trinken",
  en: "Food and drink",
  tone: "var(--t-essen)",
  focus: "Häufigkeitsangaben · Indefinitpronomen (k)einer, (k)eins, welche",

  steps: [
    {
      letter: "A",
      head: "Ich esse nie Fleisch.",
      grammar: "Häufigkeitsangaben",
      goal: "Häufigkeitsangaben machen.",
      topic: "zeitangaben",
      summary: "How often, on a scale from always to never. They sit in the middle of the sentence, after the conjugated verb — or at the very front, in which case the verb still comes second.",
      pattern: "immer → meistens → oft → manchmal → selten → nie",
      tables: [
        {
          caption: "Die Skala",
          cols: ["Wort", "Etwa", "Beispiel"],
          rows: [
            ["immer", "100%", "Ich trinke <b>immer</b> Kaffee zum Frühstück."],
            ["meistens", "80%", "Ich koche <b>meistens</b> selbst."],
            ["oft", "70%", "Wir essen <b>oft</b> Nudeln."],
            ["manchmal", "40%", "<b>Manchmal</b> gehen wir essen."],
            ["selten", "15%", "Ich esse <b>selten</b> Fisch."],
            ["nie", "0%", "Ich esse <b>nie</b> Fleisch."]
          ]
        },
        {
          caption: "Wo steht das Wort?",
          cols: ["Position", "Beispiel"],
          rows: [
            ["nach dem Verb (normal)", "Ich esse <b>nie</b> Fleisch."],
            ["auf Position 1 (Betonung)", "<b>Manchmal</b> esse ich Fisch."],
            ["im Nebensatz", "…, weil ich <b>selten</b> Fleisch esse."]
          ]
        }
      ],
      notes: [
        "Also in this family, and asked the same way (<em>Wie oft?</em>): <b>jeden Tag</b>, <b>einmal pro Woche</b>, <b>zweimal im Monat</b>, <b>montags</b>, <b>am Wochenende</b>.",
        "<b>montags, dienstags, sonntags</b> — a weekday with -s means <em>every</em> such day: „Montags habe ich Deutschkurs.“"
      ],
      examples: [
        { de: "Ich esse nie Fleisch.", en: "I never eat meat." },
        { de: "Zum Frühstück trinke ich meistens Tee.", en: "For breakfast I usually drink tea." },
        { de: "Manchmal koche ich indisch.", en: "Sometimes I cook Indian food." },
        { de: "Wir gehen selten ins Restaurant.", en: "We rarely go to a restaurant." },
        { de: "Einmal pro Woche kaufe ich auf dem Markt ein.", en: "Once a week I shop at the market." }
      ],
      watch: "nie is already the negative — do not add another one. „Ich esse <b>nie</b> Fleisch“, never „Ich esse nicht nie Fleisch“."
    },
    {
      letter: "B",
      head: "Du möchtest doch auch einen, oder?",
      grammar: "Indefinitpronomen (k)einer, (k)einen, (k)eins, (k)eine, welche im Nominativ und Akkusativ",
      goal: "Dinge im Haushalt benennen.",
      topic: "pronomen",
      summary: "Once the noun has been mentioned, you drop it and keep only the article — but the article then has to show the ending the full form never shows. „ein Ei“ has no ending; standing alone it becomes „eins“.",
      pattern: "der → einer / einen · das → eins · die → eine · Plural → welche",
      tables: [
        {
          caption: "Mit Nomen und ohne Nomen",
          cols: ["", "mit Nomen", "Nominativ allein", "Akkusativ allein"],
          rows: [
            ["der Löffel", "ein Löffel", "ein<b>er</b>", "ein<b>en</b>"],
            ["das Ei", "ein Ei", "ein<b>s</b>", "ein<b>s</b>"],
            ["die Gabel", "eine Gabel", "ein<b>e</b>", "ein<b>e</b>"],
            ["die Eier (Pl.)", "— Eier", "<b>welche</b>", "<b>welche</b>"]
          ]
        },
        {
          caption: "Negativ",
          cols: ["", "Nominativ", "Akkusativ"],
          rows: [
            ["der", "kein<b>er</b>", "kein<b>en</b>"],
            ["das", "kein<b>s</b>", "kein<b>s</b>"],
            ["die", "kein<b>e</b>", "kein<b>e</b>"],
            ["Plural", "kein<b>e</b>", "kein<b>e</b>"]
          ]
        }
      ],
      notes: [
        "There is no plural of ein, so the positive plural borrows a different word: <b>welche</b>. „Haben wir noch Eier?“ — „Ja, wir haben noch <b>welche</b>.“",
        "The negative plural is regular: „Nein, wir haben <b>keine</b>.“"
      ],
      examples: [
        { de: "Ich mache noch einen Espresso. Möchtest du auch einen?", en: "I'm making another espresso. Would you like one too?" },
        { de: "Wer möchte noch eine Portion? — Ich nehme noch eine.", en: "Who'd like another helping? — I'll have another one." },
        { de: "Haben wir noch Eier? — Ja, wir haben noch welche.", en: "Have we still got eggs? — Yes, we've still got some." },
        { de: "Wo ist der Löffel? — Hier ist doch einer.", en: "Where's the spoon? — There's one right here." },
        { de: "Brauchst du ein Messer? — Nein danke, ich habe schon eins.", en: "Do you need a knife? — No thanks, I've already got one." },
        { de: "Ich brauche eine Gabel. — Tut mir leid, ich habe keine.", en: "I need a fork. — Sorry, I haven't got one." }
      ],
      watch: "The neuter is the one that catches people: „ein Ei“ but „ich möchte <b>eins</b>“, with -s. And English „one“ is invisible in German — you cannot say „ich möchte ein“."
    },
    {
      letter: "C",
      head: "Guten Appetit!",
      kind: "wortschatz",
      goal: "Gespräche bei einer Einladung führen.",
      summary: "Being fed at someone's house, in both directions: offering, accepting, declining without rudeness.",
      examples: [
        { de: "Greif zu! — Danke, das sieht lecker aus.", en: "Help yourself! — Thanks, that looks delicious." },
        { de: "Möchtest du noch etwas? — Nein danke, ich bin satt.", en: "Would you like some more? — No thanks, I'm full." },
        { de: "Nehmen Sie doch noch ein Stück Kuchen.", en: "Do have another piece of cake." },
        { de: "Das schmeckt wirklich gut. Wie hast du das gemacht?", en: "That really tastes good. How did you make it?" },
        { de: "Ich esse kein Fleisch — gibt es etwas Vegetarisches?", en: "I don't eat meat — is there anything vegetarian?" }
      ]
    },
    {
      letter: "D",
      head: "In der Kantine",
      kind: "wortschatz",
      goal: "Ein schriftliches Interview verstehen.",
      summary: "Lunch at work, and the words for talking about a menu.",
      examples: [
        { de: "In der Kantine gibt es jeden Tag ein Tagesgericht.", en: "In the canteen there's a dish of the day every day." },
        { de: "Mittags esse ich meistens eine Suppe und einen Salat.", en: "At lunchtime I usually have soup and a salad." },
        { de: "Das Essen ist günstig, aber nicht besonders gesund.", en: "The food is cheap but not especially healthy." },
        { de: "Ich bringe mir lieber etwas von zu Hause mit.", en: "I prefer to bring something from home." },
        { de: "Zum Nachtisch nehme ich einen Joghurt.", en: "For dessert I'll have a yoghurt." }
      ]
    },
    {
      letter: "E",
      head: "Essen gehen",
      kind: "wortschatz",
      goal: "Gespräche im Restaurant führen.",
      summary: "Ordering, complaining and paying — the full restaurant script.",
      examples: [
        { de: "Wir möchten bestellen, bitte.", en: "We'd like to order, please." },
        { de: "Ich nehme das Schnitzel mit Pommes.", en: "I'll have the schnitzel with chips." },
        { de: "Entschuldigung, das habe ich nicht bestellt.", en: "Excuse me, I didn't order this." },
        { de: "Zusammen oder getrennt? — Getrennt, bitte.", en: "Together or separately? — Separately, please." },
        { de: "Stimmt so, danke.", en: "Keep the change, thanks." }
      ]
    }
  ],

  deepen: [
    {
      head: "ein guter Kaffee, einen guten Kaffee",
      grammar: "Adjektivdeklination nach dem unbestimmten Artikel",
      source: "Menschen A2, Lektion 4",
      summary: "An adjective in front of a noun takes an ending. This is the version Menschen A2 teaches at exactly this point, in exactly this topic — ordering food — and it is the single most useful ending table at A2.1.",
      pattern: "ein·Ø gut·er Kaffee · ein·en gut·en Kaffee · ein·Ø gut·es Brot · ein·e gut·e Suppe",
      tables: [
        {
          caption: "Nach ein-, kein-, mein- …",
          cols: ["", "maskulin", "neutrum", "feminin", "Plural"],
          rows: [
            ["Nominativ", "ein gut<b>er</b> Kaffee", "ein gut<b>es</b> Brot", "eine gut<b>e</b> Suppe", "gut<b>e</b> Brötchen"],
            ["Akkusativ", "einen gut<b>en</b> Kaffee", "ein gut<b>es</b> Brot", "eine gut<b>e</b> Suppe", "gut<b>e</b> Brötchen"],
            ["Dativ", "einem gut<b>en</b> Kaffee", "einem gut<b>en</b> Brot", "einer gut<b>en</b> Suppe", "gut<b>en</b> Brötchen"]
          ]
        },
        {
          caption: "Nach der/das/die ist fast alles -e oder -en",
          cols: ["", "maskulin", "neutrum", "feminin", "Plural"],
          rows: [
            ["Nominativ", "der gut<b>e</b> Kaffee", "das gut<b>e</b> Brot", "die gut<b>e</b> Suppe", "die gut<b>en</b> …"],
            ["Akkusativ", "den gut<b>en</b> Kaffee", "das gut<b>e</b> Brot", "die gut<b>e</b> Suppe", "die gut<b>en</b> …"],
            ["Dativ", "dem gut<b>en</b> Kaffee", "dem gut<b>en</b> Brot", "der gut<b>en</b> Suppe", "den gut<b>en</b> …"]
          ]
        }
      ],
      notes: [
        "The logic in one line: the ending the <em>article</em> fails to show, the <em>adjective</em> shows instead. „ein“ tells you nothing about gender, so „gut<b>er</b>“ has to.",
        "No ending at all when the adjective comes after the verb: „Der Kaffee ist <b>gut</b>.“ That is the easy escape route and it is always available."
      ],
      examples: [
        { de: "Ich möchte einen starken Kaffee.", en: "I'd like a strong coffee." },
        { de: "Das ist ein gutes Restaurant.", en: "That's a good restaurant." },
        { de: "Wir hatten eine lange Pause.", en: "We had a long break." },
        { de: "Mit frischem Brot schmeckt das besser.", en: "It tastes better with fresh bread." },
        { de: "Die Suppe ist heiß.", en: "The soup is hot." }
      ],
      watch: "Dativ is the merciful case: after einem/einer/den the adjective ends in <b>-en</b>, every gender, every time."
    },
    {
      head: "ein Kilo, eine Packung, ein bisschen",
      grammar: "Mengenangaben und Verpackungen",
      source: "Menschen A2, Lektion 4 · Schritte plus Neu 3, Lektion 3",
      summary: "German counts uncountable food with a container or a weight, and — unlike English — puts no „of“ between the two nouns.",
      pattern: "ein Kilo Äpfel · eine Flasche Wasser · ein Stück Kuchen   (kein „von“!)",
      tables: [
        {
          caption: "Mengen",
          cols: ["Angabe", "Beispiel"],
          rows: [
            ["Gewicht", "ein Kilo Tomaten · 200 Gramm Käse · ein Pfund Mehl"],
            ["Verpackung", "eine Packung Nudeln · eine Dose Mais · ein Glas Honig"],
            ["Gefäß", "eine Flasche Wasser · eine Tasse Tee · ein Becher Joghurt"],
            ["Stück", "ein Stück Kuchen · eine Scheibe Brot · eine Tafel Schokolade"],
            ["unbestimmt", "ein bisschen Salz · etwas Zucker · viel Zeit · wenig Geld"]
          ]
        }
      ],
      notes: [
        "After a measurement the noun stays in the plain form, with no article and no case ending: „zwei Kilo <b>Äpfel</b>“, „drei Flaschen <b>Wasser</b>“.",
        "<b>viel</b> for uncountables (viel Milch), <b>viele</b> for countables (viele Eier). Same for wenig / wenige."
      ],
      examples: [
        { de: "Ich nehme ein Kilo Tomaten, bitte.", en: "I'll take a kilo of tomatoes, please." },
        { de: "Wir brauchen noch eine Packung Nudeln.", en: "We still need a packet of pasta." },
        { de: "Möchtest du ein Stück Kuchen?", en: "Would you like a piece of cake?" },
        { de: "Nur ein bisschen Milch, bitte.", en: "Just a little milk, please." },
        { de: "Ich trinke zu viel Kaffee und zu wenig Wasser.", en: "I drink too much coffee and too little water." }
      ],
      watch: "No <b>von</b> and no <b>aus</b> between the two words: „ein Glas <b>Wasser</b>“, never „ein Glas von Wasser“."
    }
  ],

  test: [
    { rule: "haeufigkeit", en: "I never eat meat.",
      parts: ["Ich esse ", { options: ["nie", "nicht nie", "kein nie"], answer: "nie" }, " Fleisch."] },
    { rule: "haeufigkeit", en: "For breakfast I usually drink tea.",
      parts: ["Zum Frühstück trinke ich ", { options: ["meistens", "meiste", "meist Zeit"], answer: "meistens" }, " Tee."] },
    { rule: "haeufigkeit-pos1", en: "Sometimes I cook Indian food.",
      parts: [{ options: ["Manchmal koche ich", "Manchmal ich koche", "Ich manchmal koche"], answer: "Manchmal koche ich" }, " indisch."] },
    { rule: "wochentag-s", en: "On Mondays I have a German course.",
      parts: [{ options: ["Montags", "Montag", "Am Montags"], answer: "Montags" }, " habe ich Deutschkurs."] },
    { rule: "indef-akk-m", en: "I'm making an espresso. Would you like one too?",
      parts: ["Ich mache einen Espresso. Möchtest du auch ", { options: ["einen", "eins", "einer"], answer: "einen" }, "?"] },
    { rule: "indef-neutrum", en: "Do you need a knife? — No thanks, I've got one.",
      parts: ["Brauchst du ein Messer? — Nein danke, ich habe ", { options: ["eins", "einen", "eine"], answer: "eins" }, "."] },
    { rule: "indef-nom-m", en: "Where's the spoon? — There's one right here.",
      parts: ["Wo ist der Löffel? — Hier ist doch ", { options: ["einer", "einen", "eins"], answer: "einer" }, "."] },
    { rule: "indef-plural", en: "Have we still got eggs? — Yes, we've got some.",
      parts: ["Haben wir noch Eier? — Ja, wir haben ", { options: ["welche", "eine", "einige Eier"], answer: "welche" }, "."] },
    { rule: "indef-fem", en: "I need a fork. — Sorry, I haven't got one.",
      parts: ["Ich brauche eine Gabel. — Tut mir leid, ich habe ", { options: ["keine", "keinen", "keins"], answer: "keine" }, "."] },
    { rule: "indef-neutrum", en: "Is there still bread? — No, there isn't any.",
      parts: ["Gibt es noch Brot? — Nein, es gibt ", { options: ["keins", "keine", "keiner"], answer: "keins" }, "."] },
    { rule: "adj-ein-akk-m", en: "I'd like a strong coffee.",
      parts: ["Ich möchte einen ", { options: ["starken", "starker", "starkes"], answer: "starken" }, " Kaffee."] },
    { rule: "adj-ein-neutrum", en: "That's a good restaurant.",
      parts: ["Das ist ein ", { options: ["gutes", "guter", "guten"], answer: "gutes" }, " Restaurant."] },
    { rule: "adj-ein-nom-m", en: "A strong coffee really helps.",
      parts: ["Ein ", { options: ["starker", "starken", "starkes"], answer: "starker" }, " Kaffee hilft wirklich."] },
    { rule: "adj-ein-fem", en: "We had a long break.",
      parts: ["Wir hatten eine ", { options: ["lange", "langen", "langes"], answer: "lange" }, " Pause."] },
    { rule: "adj-dativ", en: "It tastes better with fresh bread.",
      parts: ["Mit ", { options: ["frischem", "frisches", "frischer"], answer: "frischem" }, " Brot schmeckt das besser."] },
    { rule: "adj-praedikativ", en: "The soup is hot.",
      parts: ["Die Suppe ist ", { options: ["heiß", "heiße", "heißes"], answer: "heiß" }, "."] },
    { rule: "menge-kein-von", en: "I'll take a kilo of tomatoes.",
      parts: ["Ich nehme ein Kilo ", { options: ["Tomaten", "von Tomaten", "der Tomaten"], answer: "Tomaten" }, "."] },
    { rule: "menge-kein-von", en: "Just a little milk, please.",
      parts: ["Nur ein bisschen ", { options: ["Milch", "Milche", "von Milch"], answer: "Milch" }, ", bitte."] },
    { rule: "viel-viele", en: "I drink too much coffee.",
      parts: ["Ich trinke zu ", { options: ["viel", "viele", "vieles" ], answer: "viel" }, " Kaffee."] },
    { rule: "haeufigkeit", en: "We rarely go to a restaurant.",
      parts: ["Wir gehen ", { options: ["selten", "seltener", "wenig"], answer: "selten" }, " ins Restaurant."] }
  ]
};

/* ------------------------------------------------------------------ */
/* Lektion 4 — Arbeitswelt                                             */
/* ------------------------------------------------------------------ */

const L4 = {
  nr: 4,
  title: "Arbeitswelt",
  en: "The world of work",
  tone: "var(--t-arbeit)",
  focus: "wenn · Konjunktiv II von sollen",

  steps: [
    {
      letter: "A",
      head: "Wenn Sie einen Fehler gemacht haben, dann …",
      grammar: "Nebensätze mit wenn",
      goal: "Bedingungen ausdrücken.",
      topic: "konjunktionen",
      summary: "wenn sets a condition — if, or whenever. Like weil it sends the verb to the end of its clause. Unlike weil it very often comes FIRST, and then the main clause may open with dann.",
      pattern: "Wenn + … + VERB , (dann) VERB + Subjekt …",
      tables: [
        {
          caption: "Beide Reihenfolgen",
          cols: ["Nebensatz zuerst", "Hauptsatz zuerst"],
          rows: [
            ["<b>Wenn</b> ich Zeit <b>habe</b>, besuche ich dich.", "Ich besuche dich, <b>wenn</b> ich Zeit <b>habe</b>."],
            ["<b>Wenn</b> Sie einen Fehler gemacht <b>haben</b>, dann sagen Sie es sofort.", "Sagen Sie es sofort, <b>wenn</b> Sie einen Fehler gemacht <b>haben</b>."],
            ["<b>Wenn</b> es regnet, bleiben wir zu Hause.", "Wir bleiben zu Hause, <b>wenn</b> es regnet."]
          ]
        }
      ],
      notes: [
        "If the wenn-clause comes first, it fills position 1 of the whole sentence — so the main clause starts with its verb: „Wenn ich Zeit habe, <b>besuche</b> ich dich.“",
        "<b>dann</b> is optional and changes nothing: it simply occupies position 1 instead, and the verb still follows it."
      ],
      examples: [
        { de: "Wenn Sie einen Fehler gemacht haben, sagen Sie es dem Chef.", en: "If you've made a mistake, tell the boss." },
        { de: "Wenn ich krank bin, rufe ich in der Firma an.", en: "If I'm ill, I ring the company." },
        { de: "Wenn du Fragen hast, dann frag mich einfach.", en: "If you have questions, just ask me." },
        { de: "Ich komme später, wenn die Besprechung lange dauert.", en: "I'll come later if the meeting takes a long time." },
        { de: "Wenn das Telefon klingelt, melde ich mich mit meinem Namen.", en: "When the phone rings, I answer with my name." }
      ],
      watch: "Three words, three jobs: <b>wenn</b> = if / whenever (condition), <b>wann</b> = when? (question), <b>als</b> = when (one single time in the past). „<b>Wann</b> kommst du?“ — „<b>Wenn</b> ich fertig bin.“"
    },
    {
      letter: "B",
      head: "Du solltest Detektiv werden.",
      grammar: "Konjunktiv II von sollen",
      goal: "Ratschläge geben.",
      topic: "modalverben",
      summary: "sollte is how you give advice without ordering anyone about. Forms like a modal: sollte in position 2, the main verb as an infinitive at the end.",
      pattern: "sollte (Position 2) + … + Infinitiv (Ende)",
      tables: [
        {
          caption: "sollte",
          cols: ["", "Form", "Beispiel"],
          rows: [
            ["ich", "sollte", "Ich <b>sollte</b> mehr schlafen."],
            ["du", "solltest", "Du <b>solltest</b> zum Arzt gehen."],
            ["er/sie/es", "sollte", "Er <b>sollte</b> früher anfangen."],
            ["wir", "sollten", "Wir <b>sollten</b> das besprechen."],
            ["ihr", "solltet", "Ihr <b>solltet</b> pünktlich sein."],
            ["sie/Sie", "sollten", "Sie <b>sollten</b> sich ausruhen."]
          ]
        }
      ],
      notes: [
        "Same shape as the other modals, so nothing new to learn about word order: <b>sollte</b> second, <b>Infinitiv</b> last.",
        "Softer still: „Du <b>könntest</b> …“ (you could) or „<b>Vielleicht</b> solltest du …“."
      ],
      examples: [
        { de: "Du solltest Detektiv werden!", en: "You should become a detective!" },
        { de: "Sie sollten mit Ihrem Chef sprechen.", en: "You should speak to your boss." },
        { de: "Du solltest nicht so viel arbeiten.", en: "You shouldn't work so much." },
        { de: "Wir sollten die Besprechung verschieben.", en: "We should postpone the meeting." },
        { de: "Du solltest dich krankmelden.", en: "You should call in sick." }
      ],
      watch: "The forms look exactly like the Präteritum of sollen, and only the context separates them. „Ich <b>sollte</b> arbeiten“ = I <em>ought to</em> work (now) or I <em>was supposed to</em> work (then)."
    },
    {
      letter: "C",
      head: "Mitteilungen am Arbeitsplatz",
      kind: "wortschatz",
      goal: "Schriftliche Mitteilungen am Arbeitsplatz verstehen.",
      summary: "Short written messages at work: notes, emails, handover.",
      examples: [
        { de: "Bitte rufen Sie Frau Berg zurück.", en: "Please call Ms Berg back." },
        { de: "Die Besprechung wurde auf Freitag verschoben.", en: "The meeting has been moved to Friday." },
        { de: "Ich bin heute im Homeoffice erreichbar.", en: "I'm reachable at home office today." },
        { de: "Können Sie das bitte bis morgen erledigen?", en: "Could you deal with that by tomorrow, please?" },
        { de: "Viele Grüße und schönes Wochenende!", en: "Best wishes and have a good weekend!" }
      ]
    },
    {
      letter: "D",
      head: "Telefongespräche am Arbeitsplatz",
      kind: "wortschatz",
      goal: "Telefongespräche am Arbeitsplatz führen.",
      summary: "The fixed phrases of a German work phone call — learn them as whole blocks, because that is how they are used.",
      examples: [
        { de: "Firma Keller, Bauer am Telefon. Was kann ich für Sie tun?", en: "Keller company, Bauer speaking. How can I help you?" },
        { de: "Könnte ich bitte Herrn Özdemir sprechen?", en: "Could I speak to Mr Özdemir, please?" },
        { de: "Einen Moment bitte, ich verbinde.", en: "One moment please, I'll put you through." },
        { de: "Er ist gerade in einer Besprechung. Möchten Sie eine Nachricht hinterlassen?", en: "He's in a meeting right now. Would you like to leave a message?" },
        { de: "Könnten Sie das bitte wiederholen? Ich habe Sie nicht verstanden.", en: "Could you repeat that, please? I didn't understand you." }
      ]
    },
    {
      letter: "E",
      head: "Arbeit und Freizeit",
      kind: "wortschatz",
      goal: "Einen Sachtext verstehen und über Arbeit und Freizeit sprechen.",
      summary: "Working hours, holiday, overtime — and the German vocabulary for the balance between the two.",
      examples: [
        { de: "Ich arbeite vierzig Stunden pro Woche.", en: "I work forty hours a week." },
        { de: "Wir haben Gleitzeit, das finde ich praktisch.", en: "We have flexitime, which I find handy." },
        { de: "Dreißig Urlaubstage sind in Deutschland normal.", en: "Thirty days' holiday is normal in Germany." },
        { de: "Letzte Woche habe ich viele Überstunden gemacht.", en: "Last week I did a lot of overtime." },
        { de: "Mir ist die Freizeit wichtiger als das Geld.", en: "Free time matters more to me than money." }
      ]
    }
  ],

  deepen: [
    {
      head: "könnte, hätte, wäre",
      grammar: "Konjunktiv II — höflich bitten und vorschlagen",
      source: "Menschen A2, Lektion 7",
      summary: "sollte has three companions you will hear every day. They are the polite forms: könnte for requests and suggestions, hätte and wäre for wishes and softened statements.",
      pattern: "Könnten Sie …? · Ich hätte gern … · Das wäre schön.",
      tables: [
        {
          caption: "Die vier Formen, die man an A2.1 braucht",
          cols: ["", "können → könnte", "haben → hätte", "sein → wäre"],
          rows: [
            ["ich", "könnte", "hätte", "wäre"],
            ["du", "könntest", "hättest", "wärst"],
            ["er/sie/es", "könnte", "hätte", "wäre"],
            ["wir", "könnten", "hätten", "wären"],
            ["ihr", "könntet", "hättet", "wärt"],
            ["sie/Sie", "könnten", "hätten", "wären"]
          ]
        },
        {
          caption: "Wofür man sie benutzt",
          cols: ["Funktion", "Beispiel"],
          rows: [
            ["höfliche Bitte", "<b>Könnten</b> Sie mir bitte helfen?"],
            ["Vorschlag", "Wir <b>könnten</b> montags joggen gehen."],
            ["Wunsch", "Ich <b>hätte</b> gern einen Kaffee."],
            ["Bewertung", "Das <b>wäre</b> super!"],
            ["Ratschlag", "Du <b>solltest</b> mehr schlafen."]
          ]
        }
      ],
      notes: [
        "Note the Umlaut: <b>könnte</b> with ö is the polite form, <b>konnte</b> without is the past (<em>I was able to</em>). One dot changes the tense.",
        "„Ich hätte gern …“ is the standard way to order or request anything in a shop, a café or an office. It is more polite than „Ich möchte …“ and far more polite than „Ich will …“."
      ],
      examples: [
        { de: "Könnten Sie mir bitte helfen?", en: "Could you help me, please?" },
        { de: "Wir könnten montags joggen gehen.", en: "We could go jogging on Mondays." },
        { de: "Ich hätte gern einen Termin am Freitag.", en: "I'd like an appointment on Friday." },
        { de: "Das wäre sehr nett von Ihnen.", en: "That would be very kind of you." },
        { de: "Hätten Sie am Montag Zeit?", en: "Would you have time on Monday?" }
      ],
      watch: "<b>könnte</b> (polite, now) against <b>konnte</b> (past, then): „Ich <b>könnte</b> morgen kommen“ vs. „Ich <b>konnte</b> gestern nicht kommen.“"
    },
    {
      head: "wenn · wann · ob · als",
      grammar: "Vier Wörter, die alle „when / if“ heißen",
      source: "Menschen A2, Lektion 12 und 13 · Schritte plus Neu 3, Lektion 4",
      summary: "English covers all four with when and if, which is why this confusion is so persistent. All four send the verb to the end; what differs is the job.",
      pattern: "wenn = Bedingung / immer   ·   wann = Frage   ·   ob = ja oder nein   ·   als = einmal, Vergangenheit",
      tables: [
        {
          caption: "Welches Wort wann",
          cols: ["Wort", "Bedeutung", "Beispiel"],
          rows: [
            ["wenn", "if / whenever", "<b>Wenn</b> ich Zeit habe, komme ich."],
            ["wann", "when? (indirekte Frage)", "Ich weiß nicht, <b>wann</b> er kommt."],
            ["ob", "whether / if (ja oder nein)", "Ich weiß nicht, <b>ob</b> er kommt."],
            ["als", "when (einmal, Vergangenheit)", "<b>Als</b> ich ein Kind war, wohnten wir in Nepal."]
          ]
        }
      ],
      notes: [
        "The <b>wenn</b> / <b>als</b> split is about counting: repeated or general → wenn („<b>Immer wenn</b> es regnet …“); one single occasion in the past → als („<b>Als</b> ich nach Deutschland kam …“).",
        "<b>ob</b> after verbs of not knowing and asking: wissen, fragen, sich informieren. „Können Sie mir sagen, <b>ob</b> der Zug pünktlich ist?“"
      ],
      examples: [
        { de: "Ich weiß nicht, wann die Besprechung anfängt.", en: "I don't know when the meeting starts." },
        { de: "Ich weiß nicht, ob die Besprechung heute ist.", en: "I don't know whether the meeting is today." },
        { de: "Als ich klein war, wollte ich Pilot werden.", en: "When I was little I wanted to be a pilot." },
        { de: "Immer wenn ich nach Berlin fahre, besuche ich sie.", en: "Whenever I go to Berlin I visit her." },
        { de: "Können Sie mir sagen, ob Herr Berg da ist?", en: "Can you tell me whether Mr Berg is in?" }
      ],
      watch: "„Ich weiß nicht, <b>wenn</b> er kommt“ is a very common mistake and means something else. For a time you do not know, use <b>wann</b>; for a yes-or-no you do not know, use <b>ob</b>."
    }
  ],

  test: [
    { rule: "wenn-vorn", en: "If I have time, I'll visit you.",
      parts: ["Wenn ich Zeit habe, ", { options: ["besuche ich", "ich besuche", "besucht ich"], answer: "besuche ich" }, " dich."] },
    { rule: "wenn-end", en: "If I'm ill, I ring the company.",
      parts: ["Wenn ich krank ", { options: ["bin", "sein", "ist"], answer: "bin" }, ", rufe ich in der Firma an."] },
    { rule: "wenn-end", en: "If you've made a mistake, tell the boss.",
      parts: ["Wenn Sie einen Fehler gemacht ", { options: ["haben", "hat", "sind"], answer: "haben" }, ", sagen Sie es dem Chef."] },
    { rule: "wenn-end", en: "I'll come later if the meeting takes long.",
      parts: ["Ich komme später, wenn die Besprechung lange ", { options: ["dauert", "dauern", "gedauert"], answer: "dauert" }, "."] },
    { rule: "imperativ-du", en: "If you have questions, just ask me.",
      parts: ["Wenn du Fragen hast, dann ", { options: ["frag mich", "mich frag", "du fragst mich"], answer: "frag mich" }, " einfach."] },
    { rule: "sollte-form", en: "You should become a detective!",
      parts: ["Du ", { options: ["solltest", "sollte", "sollst"], answer: "solltest" }, " Detektiv werden!"] },
    { rule: "sollte-form", en: "You should speak to your boss.",
      parts: ["Sie ", { options: ["sollten", "solltet", "sollte"], answer: "sollten" }, " mit Ihrem Chef sprechen."] },
    { rule: "sollte-infinitiv", en: "You shouldn't work so much.",
      parts: ["Du solltest nicht so viel ", { options: ["arbeiten", "arbeitest", "gearbeitet"], answer: "arbeiten" }, "."] },
    { rule: "sollte-infinitiv", en: "We should postpone the meeting.",
      parts: ["Wir sollten die Besprechung ", { options: ["verschieben", "verschoben", "verschieben wir"], answer: "verschieben" }, "."] },
    { rule: "koennte-vs-konnte", en: "Could you help me, please?",
      parts: [{ options: ["Könnten", "Konnten", "Können"], answer: "Könnten" }, " Sie mir bitte helfen?"] },
    { rule: "koennte-vs-konnte", en: "We could go jogging on Mondays.",
      parts: ["Wir ", { options: ["könnten", "konnten", "könnte"], answer: "könnten" }, " montags joggen gehen."] },
    { rule: "haette-gern", en: "I'd like an appointment on Friday.",
      parts: ["Ich ", { options: ["hätte", "hatte", "habe"], answer: "hätte" }, " gern einen Termin am Freitag."] },
    { rule: "waere", en: "That would be very kind of you.",
      parts: ["Das ", { options: ["wäre", "war", "ist gewesen"], answer: "wäre" }, " sehr nett von Ihnen."] },
    { rule: "koennte-vs-konnte", en: "I couldn't come yesterday.",
      parts: ["Ich ", { options: ["konnte", "könnte", "kann"], answer: "konnte" }, " gestern nicht kommen."] },
    { rule: "wann-indirekt", en: "I don't know when the meeting starts.",
      parts: ["Ich weiß nicht, ", { options: ["wann", "wenn", "ob"], answer: "wann" }, " die Besprechung anfängt."] },
    { rule: "ob-janein", en: "I don't know whether the meeting is today.",
      parts: ["Ich weiß nicht, ", { options: ["ob", "wenn", "wann"], answer: "ob" }, " die Besprechung heute ist."] },
    { rule: "als-einmal", en: "When I was little I wanted to be a pilot.",
      parts: [{ options: ["Als", "Wenn", "Wann"], answer: "Als" }, " ich klein war, wollte ich Pilot werden."] },
    { rule: "wenn-immer", en: "Whenever I go to Berlin I visit her.",
      parts: ["Immer ", { options: ["wenn", "als", "wann"], answer: "wenn" }, " ich nach Berlin fahre, besuche ich sie."] },
    { rule: "ob-janein", en: "Can you tell me whether Mr Berg is in?",
      parts: ["Können Sie mir sagen, ", { options: ["ob", "wenn", "dass"], answer: "ob" }, " Herr Berg da ist?"] },
    { rule: "haette-gern", en: "Would you have time on Monday?",
      parts: [{ options: ["Hätten", "Hatten", "Haben"], answer: "Hätten" }, " Sie am Montag Zeit?"] }
  ]
};

/* ------------------------------------------------------------------ */
/* Lektion 5 — Sport und Fitness                                       */
/* ------------------------------------------------------------------ */

const L5 = {
  nr: 5,
  title: "Sport und Fitness",
  en: "Sport and fitness",
  tone: "var(--t-freizeit)",
  focus: "Reflexive Verben · Verben mit Präpositionen · Wofür? Dafür.",

  steps: [
    {
      letter: "A",
      head: "Ich bewege mich zurzeit nicht genug.",
      grammar: "Reflexive Verben",
      goal: "Gesundheitstipps verstehen.",
      topic: "reflexiv",
      summary: "Some German verbs come with a pronoun that points back at the subject. It is part of the verb, not an extra idea, and it usually cannot be translated into English at all.",
      pattern: "Verb + mich · dich · sich · uns · euch · sich",
      tables: [
        {
          caption: "sich bewegen",
          cols: ["", "Reflexivpronomen", "Beispiel"],
          rows: [
            ["ich", "mich", "Ich bewege <b>mich</b> nicht genug."],
            ["du", "dich", "Du bewegst <b>dich</b> zu wenig."],
            ["er/sie/es", "sich", "Er bewegt <b>sich</b> jeden Tag."],
            ["wir", "uns", "Wir bewegen <b>uns</b> genug."],
            ["ihr", "euch", "Ihr bewegt <b>euch</b> zu wenig."],
            ["sie/Sie", "sich", "Sie bewegen <b>sich</b> regelmäßig."]
          ]
        },
        {
          caption: "Die Verben, die man an A2 braucht",
          cols: ["Verb", "Bedeutung", "Beispiel"],
          rows: [
            ["sich bewegen", "to get exercise", "Bewege <b>dich</b> mehr!"],
            ["sich ausruhen", "to rest", "Ich ruhe <b>mich</b> kurz aus."],
            ["sich entspannen", "to relax", "Hier kann man <b>sich</b> gut entspannen."],
            ["sich fühlen", "to feel", "Ich fühle <b>mich</b> heute besser."],
            ["sich anmelden", "to sign up", "Ich melde <b>mich</b> im Verein an."],
            ["sich freuen", "to be pleased", "Ich freue <b>mich</b> sehr."],
            ["sich ärgern", "to be annoyed", "Er ärgert <b>sich</b> über den Lärm."],
            ["sich treffen", "to meet", "Wir treffen <b>uns</b> um acht."],
            ["sich erholen", "to recover", "Sie erholt <b>sich</b> vom Stress."],
            ["sich konzentrieren", "to concentrate", "Ich kann <b>mich</b> nicht konzentrieren."]
          ]
        }
      ],
      notes: [
        "Where the pronoun stands: straight after the conjugated verb. „Ich bewege <b>mich</b> …“, „Bewegst du <b>dich</b> …?“, „…, weil ich <b>mich</b> nicht genug bewege.“",
        "With a modal, the pronoun still follows the conjugated verb and the reflexive verb goes to the end as an infinitive: „Ich muss <b>mich</b> mehr bewegen.“"
      ],
      examples: [
        { de: "Ich bewege mich zurzeit nicht genug.", en: "I'm not getting enough exercise at the moment." },
        { de: "Nach der Arbeit ruhe ich mich eine halbe Stunde aus.", en: "After work I rest for half an hour." },
        { de: "Wie fühlst du dich heute?", en: "How are you feeling today?" },
        { de: "Ich habe mich für einen Yogakurs angemeldet.", en: "I've signed up for a yoga course." },
        { de: "Wir treffen uns dreimal pro Woche zum Laufen.", en: "We meet three times a week to run." }
      ],
      watch: "The pronoun is not optional. „Ich fühle gut“ is not German — it has to be „Ich fühle <b>mich</b> gut“. Nor is it ever <em>myself</em>: nobody is emphasising anything."
    },
    {
      letter: "B",
      head: "Ich interessiere mich sehr für den Tanzsport.",
      grammar: "Verben mit Präpositionen",
      goal: "Interesse ausdrücken.",
      topic: "praepositionen",
      summary: "Many verbs demand one particular preposition, and that preposition demands one particular case. Neither is guessable from English, so the three parts are learned as a single block: verb + preposition + case.",
      pattern: "sich interessieren für + Akkusativ   ·   warten auf + Akkusativ   ·   Angst haben vor + Dativ",
      tables: [
        {
          caption: "Präposition + Akkusativ",
          cols: ["Verb", "Beispiel"],
          rows: [
            ["sich interessieren <b>für</b>", "Ich interessiere mich <b>für den</b> Tanzsport."],
            ["sich freuen <b>auf</b>", "Ich freue mich <b>auf das</b> Wochenende. <em>(Zukunft)</em>"],
            ["sich freuen <b>über</b>", "Ich freue mich <b>über das</b> Geschenk. <em>(Vergangenheit)</em>"],
            ["warten <b>auf</b>", "Wir warten <b>auf den</b> Bus."],
            ["achten <b>auf</b>", "Du musst <b>auf die</b> Ernährung achten."],
            ["sich ärgern <b>über</b>", "Sie ärgert sich <b>über den</b> Lärm."],
            ["denken <b>an</b>", "Ich denke oft <b>an meine</b> Familie."],
            ["Lust haben <b>auf</b>", "Hast du Lust <b>auf einen</b> Spaziergang?"],
            ["sich vorbereiten <b>auf</b>", "Er bereitet sich <b>auf die</b> Prüfung vor."],
            ["sich entschuldigen <b>für</b>", "Ich entschuldige mich <b>für die</b> Verspätung."],
            ["lachen <b>über</b>", "Wir haben <b>über den</b> Film gelacht."]
          ]
        },
        {
          caption: "Präposition + Dativ",
          cols: ["Verb", "Beispiel"],
          rows: [
            ["Angst haben <b>vor</b>", "Ich habe Angst <b>vor dem</b> Zahnarzt."],
            ["sich treffen <b>mit</b>", "Ich treffe mich <b>mit meiner</b> Freundin."],
            ["sprechen <b>mit</b>", "Ich spreche <b>mit dem</b> Trainer."],
            ["teilnehmen <b>an</b>", "Sie nimmt <b>an einem</b> Kurs teil."],
            ["sich beschäftigen <b>mit</b>", "Er beschäftigt sich <b>mit Sport</b>."],
            ["gehören <b>zu</b>", "Das gehört <b>zu meinen</b> Hobbys."],
            ["abhängen <b>von</b>", "Das hängt <b>vom</b> Wetter ab."],
            ["sich erkundigen <b>nach</b>", "Ich erkundige mich <b>nach den</b> Kursen."]
          ]
        }
      ],
      notes: [
        "A reflexive verb can carry a preposition as well, and then both parts appear: „Ich <b>interessiere mich für</b> …“, „Ich <b>freue mich auf</b> …“.",
        "freuen splits by time: <b>auf</b> for something still to come, <b>über</b> for something that has happened."
      ],
      examples: [
        { de: "Ich interessiere mich sehr für den Tanzsport.", en: "I'm very interested in dance sport." },
        { de: "Ich freue mich schon auf das Wochenende.", en: "I'm already looking forward to the weekend." },
        { de: "Wir warten auf den Trainer.", en: "We're waiting for the coach." },
        { de: "Beim Sport muss man auf den Körper achten.", en: "When you do sport you have to listen to your body." },
        { de: "Ich habe keine Angst vor dem Wettkampf.", en: "I'm not afraid of the competition." },
        { de: "Sie nimmt an einem Kurs für Anfänger teil.", en: "She's taking part in a beginners' course." }
      ],
      watch: "The German preposition almost never matches the English one: <b>warten auf</b> (not „für“), <b>sich interessieren für</b> (not „in“), <b>denken an</b> (not „über“). Learn the block, not the translation."
    },
    {
      letter: "C",
      head: "Darauf habe ich keine Lust.",
      grammar: "Fragewörter und Präpositionaladverbien",
      goal: "Nach Interessen fragen.",
      topic: "fragen",
      summary: "Once a verb has a fixed preposition, the question and the short answer have to carry it too — and the form depends on whether you are talking about a THING or a PERSON.",
      pattern: "Sache: wo(r) + Präposition → Worauf? · da(r) + Präposition → Darauf.   Person: Präposition + wen/wem → Auf wen?",
      tables: [
        {
          caption: "Sache oder Person",
          cols: ["", "Frage", "Antwort"],
          rows: [
            ["Sache", "<b>Worauf</b> wartest du?", "<b>Darauf.</b> / Auf den Bus."],
            ["Person", "<b>Auf wen</b> wartest du?", "Auf meinen Bruder."],
            ["Sache", "<b>Wofür</b> interessierst du dich?", "<b>Dafür.</b> / Für Musik."],
            ["Person", "<b>Für wen</b> ist das Geschenk?", "Für meine Mutter."],
            ["Sache", "<b>Wovor</b> hast du Angst?", "<b>Davor.</b>"],
            ["Person", "<b>Vor wem</b> hast du Angst?", "Vor dem Chef."]
          ]
        },
        {
          caption: "Das eingeschobene r",
          cols: ["Präposition", "Frage", "Antwort"],
          rows: [
            ["auf", "wo<b>r</b>auf", "da<b>r</b>auf"],
            ["an", "wo<b>r</b>an", "da<b>r</b>an"],
            ["über", "wo<b>r</b>über", "da<b>r</b>über"],
            ["um", "wo<b>r</b>um", "da<b>r</b>um"],
            ["für", "wofür", "dafür"],
            ["von", "wovon", "davon"],
            ["mit", "womit", "damit"],
            ["vor", "wovor", "davor"],
            ["nach", "wonach", "danach"]
          ]
        }
      ],
      notes: [
        "The r appears only before a vowel: wo<b>r</b>auf, wo<b>r</b>über — but wofür, womit, wovon. Say it out loud and you can hear why.",
        "For people the preposition simply keeps its own case: <b>auf wen</b> (Akkusativ), <b>mit wem</b> (Dativ), <b>von wem</b> (Dativ)."
      ],
      examples: [
        { de: "Worauf freust du dich? — Auf den Urlaub.", en: "What are you looking forward to? — The holiday." },
        { de: "Darauf habe ich keine Lust.", en: "I don't fancy that." },
        { de: "Wofür interessierst du dich? — Für Fußball.", en: "What are you interested in? — Football." },
        { de: "Mit wem triffst du dich? — Mit meiner Schwester.", en: "Who are you meeting? — My sister." },
        { de: "Woran denkst du? — Daran denke ich oft.", en: "What are you thinking about? — I think about that often." },
        { de: "Wovor hast du Angst? — Vor nichts.", en: "What are you afraid of? — Nothing." }
      ],
      watch: "Spoken German often says „Für was interessierst du dich?“, but the book and the exam want <b>Wofür</b>. And for people you must NOT use wo(r)-: „<b>Auf wen</b> wartest du?“, never „Worauf wartest du?“ if you mean a person."
    },
    {
      letter: "D",
      head: "Anmeldung beim Sportverein",
      kind: "wortschatz",
      goal: "Sich beim Sportverein anmelden und nach Informationen fragen.",
      summary: "Joining a club: the questions you ask and the form you fill in.",
      examples: [
        { de: "Ich möchte mich für den Kurs anmelden.", en: "I'd like to sign up for the course." },
        { de: "Wie viel kostet der Mitgliedsbeitrag pro Monat?", en: "How much is the membership fee per month?" },
        { de: "Gibt es auch einen Kurs für Anfänger?", en: "Is there a course for beginners too?" },
        { de: "Wann und wo findet das Training statt?", en: "When and where does the training take place?" },
        { de: "Kann ich erst einmal zum Probetraining kommen?", en: "Could I come to a trial session first?" }
      ]
    },
    {
      letter: "E",
      head: "Aktiv bleiben",
      kind: "wortschatz",
      goal: "Eine Informationsbroschüre verstehen und die Meinung sagen.",
      summary: "Staying active, and saying what you think of an idea.",
      examples: [
        { de: "Dreimal pro Woche Sport ist gesund.", en: "Sport three times a week is healthy." },
        { de: "Ich finde, Bewegung ist wichtiger als Diäten.", en: "I think exercise matters more than diets." },
        { de: "Das Angebot gefällt mir gut.", en: "I like the offer." },
        { de: "Meiner Meinung nach sollte Sport Spaß machen.", en: "In my opinion sport should be fun." },
        { de: "Ich gehe lieber schwimmen als ins Fitnessstudio.", en: "I'd rather go swimming than to the gym." }
      ]
    }
  ],

  deepen: [
    {
      head: "Ich wasche mich. Ich wasche mir die Hände.",
      grammar: "Reflexivpronomen im Akkusativ und im Dativ",
      source: "Menschen A2, Lektion 11 · Schritte plus Neu 3, Lektion 5",
      summary: "The reflexive pronoun is normally accusative. But as soon as the sentence already has an accusative object, the reflexive pronoun switches to the dative — and only two forms actually change.",
      pattern: "Akkusativ: mich · dich   →   Dativ: mir · dir   (sich, uns, euch bleiben gleich)",
      tables: [
        {
          caption: "Nur ich und du sehen anders aus",
          cols: ["", "Akkusativ", "Dativ"],
          rows: [
            ["ich", "mich", "<b>mir</b>"],
            ["du", "dich", "<b>dir</b>"],
            ["er/sie/es", "sich", "sich"],
            ["wir", "uns", "uns"],
            ["ihr", "euch", "euch"],
            ["sie/Sie", "sich", "sich"]
          ]
        },
        {
          caption: "Wann Dativ?",
          cols: ["Kein Akkusativobjekt → Akkusativ", "Mit Akkusativobjekt → Dativ"],
          rows: [
            ["Ich wasche <b>mich</b>.", "Ich wasche <b>mir</b> die Hände."],
            ["Ich ziehe <b>mich</b> an.", "Ich ziehe <b>mir</b> die Jacke an."],
            ["Ich habe <b>mich</b> verletzt.", "Ich habe <b>mir</b> den Fuß verletzt."],
            ["—", "Ich putze <b>mir</b> die Zähne."],
            ["—", "Kannst du <b>dir</b> das vorstellen?"]
          ]
        }
      ],
      notes: [
        "Test it in your head: is there already a thing in the accusative? <em>die Hände</em>, <em>die Jacke</em>, <em>den Fuß</em>. If yes, the pronoun becomes <b>mir</b> / <b>dir</b>.",
        "Dative-only from the start: <b>sich etwas vorstellen</b> (to imagine), <b>sich etwas ansehen</b> (to have a look at), <b>sich etwas überlegen</b> (to think over)."
      ],
      examples: [
        { de: "Ich wasche mir die Hände.", en: "I'm washing my hands." },
        { de: "Putz dir bitte die Zähne.", en: "Please brush your teeth." },
        { de: "Beim Sport habe ich mir den Fuß verletzt.", en: "I hurt my foot doing sport." },
        { de: "Das kann ich mir gut vorstellen.", en: "I can well imagine that." },
        { de: "Zieh dir eine Jacke an, es ist kalt.", en: "Put a jacket on, it's cold." }
      ],
      watch: "German uses the reflexive where English uses a possessive: „Ich wasche <b>mir die</b> Hände“ — literally <em>I wash myself the hands</em>, never „meine Hände“."
    },
    {
      head: "Mir gefällt das. Das tut mir weh.",
      grammar: "Verben mit Dativ",
      source: "Goethe-Zertifikat A2, Grammatik-Inventar · Menschen A2, Lektion 15",
      summary: "A small group of very common verbs takes a dative object where English takes a subject. The German sentence turns around: the thing becomes the subject and the person goes into the dative.",
      pattern: "Das Buch (Nominativ) gefällt mir (Dativ).   ≈   I like the book.",
      tables: [
        {
          caption: "Die Dativverben, die man täglich braucht",
          cols: ["Verb", "Beispiel", "Englisch"],
          rows: [
            ["gefallen", "Das Angebot gefällt <b>mir</b>.", "I like the offer."],
            ["schmecken", "Der Kuchen schmeckt <b>mir</b> gut.", "I like the cake."],
            ["helfen", "Kannst du <b>mir</b> helfen?", "Can you help me?"],
            ["passen", "Der Termin passt <b>mir</b> nicht.", "The time doesn't suit me."],
            ["gehören", "Das Fahrrad gehört <b>meinem</b> Bruder.", "The bike belongs to my brother."],
            ["danken", "Ich danke <b>Ihnen</b> sehr.", "Thank you very much."],
            ["wehtun", "Der Rücken tut <b>mir</b> weh.", "My back hurts."],
            ["gratulieren", "Wir gratulieren <b>dir</b>!", "Congratulations!"],
            ["antworten", "Sie antwortet <b>mir</b> nicht.", "She isn't answering me."]
          ]
        },
        {
          caption: "Personalpronomen im Dativ",
          cols: ["Nominativ", "Dativ"],
          rows: [
            ["ich → ", "<b>mir</b>"],
            ["du → ", "<b>dir</b>"],
            ["er / es → ", "<b>ihm</b>"],
            ["sie → ", "<b>ihr</b>"],
            ["wir → ", "<b>uns</b>"],
            ["ihr → ", "<b>euch</b>"],
            ["sie / Sie → ", "<b>ihnen</b> / <b>Ihnen</b>"]
          ]
        }
      ],
      notes: [
        "Three fixed phrases built on the same pattern, all worth memorising whole: „Wie geht es <b>dir</b>?“, „Das ist <b>mir</b> wichtig“, „<b>Mir</b> ist kalt“."
      ],
      examples: [
        { de: "Der Kurs gefällt mir sehr.", en: "I really like the course." },
        { de: "Kannst du mir bitte helfen?", en: "Can you help me, please?" },
        { de: "Der Termin passt mir leider nicht.", en: "Unfortunately the time doesn't suit me." },
        { de: "Nach dem Training tut mir alles weh.", en: "After training everything hurts." },
        { de: "Mir ist die Gesundheit wichtiger als der Sport.", en: "Health matters more to me than sport." }
      ],
      watch: "There is no „ich gefalle das Buch“. The thing is the subject: „Das Buch <b>gefällt mir</b>.“ Same trap as Spanish <em>me gusta</em>."
    }
  ],

  test: [
    { rule: "reflexiv-akk", en: "I'm not getting enough exercise.",
      parts: ["Ich bewege ", { options: ["mich", "mir", "sich"], answer: "mich" }, " nicht genug."] },
    { rule: "reflexiv-akk", en: "How are you feeling today?",
      parts: ["Wie fühlst du ", { options: ["dich", "dir", "sich"], answer: "dich" }, " heute?"] },
    { rule: "reflexiv-akk", en: "We meet three times a week.",
      parts: ["Wir treffen ", { options: ["uns", "sich", "euch"], answer: "uns" }, " dreimal pro Woche."] },
    { rule: "reflexiv-akk", en: "She relaxes after work.",
      parts: ["Sie entspannt ", { options: ["sich", "mich", "ihr"], answer: "sich" }, " nach der Arbeit."] },
    { rule: "reflexiv-modal", en: "I have to get more exercise.",
      parts: ["Ich muss ", { options: ["mich mehr bewegen", "mehr bewegen mich", "mich mehr bewege"], answer: "mich mehr bewegen" }, "."] },
    { rule: "vp-fuer", en: "I'm very interested in dance sport.",
      parts: ["Ich interessiere mich sehr ", { options: ["für", "an", "in"], answer: "für" }, " den Tanzsport."] },
    { rule: "vp-warten-auf", en: "We're waiting for the coach.",
      parts: ["Wir warten ", { options: ["auf", "für", "an"], answer: "auf" }, " den Trainer."] },
    { rule: "vp-freuen-auf", en: "I'm looking forward to the weekend.",
      parts: ["Ich freue mich ", { options: ["auf", "über", "für"], answer: "auf" }, " das Wochenende."] },
    { rule: "vp-freuen-ueber", en: "I'm pleased about the present.",
      parts: ["Ich freue mich ", { options: ["über", "auf", "für"], answer: "über" }, " das Geschenk."] },
    { rule: "vp-angst-vor", en: "I'm afraid of the dentist.",
      parts: ["Ich habe Angst vor ", { options: ["dem", "den", "der"], answer: "dem" }, " Zahnarzt."] },
    { rule: "vp-denken-an", en: "I often think about my family.",
      parts: ["Ich denke oft ", { options: ["an", "über", "auf"], answer: "an" }, " meine Familie."] },
    { rule: "vp-teilnehmen-an", en: "She's taking part in a course.",
      parts: ["Sie nimmt an ", { options: ["einem", "einen", "ein"], answer: "einem" }, " Kurs teil."] },
    { rule: "wo-r-sache", en: "What are you looking forward to?",
      parts: [{ options: ["Worauf", "Wofür", "Auf wen"], answer: "Worauf" }, " freust du dich?"] },
    { rule: "wo-r-sache", en: "What are you interested in?",
      parts: [{ options: ["Wofür", "Worfür", "Für wen"], answer: "Wofür" }, " interessierst du dich?"] },
    { rule: "praep-wen-person", en: "Who are you waiting for? — My brother.",
      parts: [{ options: ["Auf wen", "Worauf", "Wem"], answer: "Auf wen" }, " wartest du? — Auf meinen Bruder."] },
    { rule: "da-r-antwort", en: "I don't fancy that.",
      parts: [{ options: ["Darauf", "Dafür", "Davon"], answer: "Darauf" }, " habe ich keine Lust."] },
    { rule: "praep-wen-person", en: "Who are you meeting? — My sister.",
      parts: [{ options: ["Mit wem", "Womit", "Wem"], answer: "Mit wem" }, " triffst du dich?"] },
    { rule: "reflexiv-dativ", en: "I'm washing my hands.",
      parts: ["Ich wasche ", { options: ["mir", "mich", "meine"], answer: "mir" }, " die Hände."] },
    { rule: "reflexiv-dativ", en: "I hurt my foot.",
      parts: ["Ich habe ", { options: ["mir", "mich", "meinen"], answer: "mir" }, " den Fuß verletzt."] },
    { rule: "dativverb", en: "I really like the course.",
      parts: ["Der Kurs gefällt ", { options: ["mir", "mich", "ich"], answer: "mir" }, " sehr."] },
    { rule: "dativverb", en: "Unfortunately the time doesn't suit me.",
      parts: ["Der Termin passt ", { options: ["mir", "mich", "für mich"], answer: "mir" }, " leider nicht."] },
    { rule: "dativverb", en: "Can you help me, please?",
      parts: ["Kannst du ", { options: ["mir", "mich", "für mich"], answer: "mir" }, " bitte helfen?"] }
  ]
};

/* ------------------------------------------------------------------ */
/* Lektion 6 — Schule und Ausbildung                                   */
/* ------------------------------------------------------------------ */

const L6 = {
  nr: 6,
  title: "Schule und Ausbildung",
  en: "School and training",
  tone: "var(--t-schule)",
  focus: "Präteritum der Modalverben · Nebensätze mit dass",

  steps: [
    {
      letter: "A",
      head: "Ich wollte auf meiner Schule bleiben.",
      grammar: "Präteritum der Modalverben",
      goal: "Über Wünsche und Pläne aus der Kindheit sprechen.",
      topic: "praeteritum",
      summary: "Modal verbs do not form a Perfekt in everyday German — they use the Präteritum instead. The recipe is simple: take the stem, DROP the Umlaut, add -te.",
      pattern: "können → konn·te   müssen → muss·te   wollen → woll·te   dürfen → durf·te   (kein Umlaut!)",
      tables: [
        {
          caption: "Die fünf Modalverben im Präteritum",
          cols: ["", "können", "müssen", "wollen", "dürfen", "sollen"],
          rows: [
            ["ich", "konnte", "musste", "wollte", "durfte", "sollte"],
            ["du", "konntest", "musstest", "wolltest", "durftest", "solltest"],
            ["er/sie/es", "konnte", "musste", "wollte", "durfte", "sollte"],
            ["wir", "konnten", "mussten", "wollten", "durften", "sollten"],
            ["ihr", "konntet", "musstet", "wolltet", "durftet", "solltet"],
            ["sie/Sie", "konnten", "mussten", "wollten", "durften", "sollten"]
          ]
        },
        {
          caption: "Präsens → Präteritum",
          cols: ["Präsens", "Präteritum", "Was passiert"],
          rows: [
            ["ich kann", "ich konnte", "ä/ö/ü fällt weg, + te"],
            ["ich muss", "ich musste", "+ te"],
            ["ich will", "ich wollte", "i → o, + te"],
            ["ich darf", "ich durfte", "a → u, + te"],
            ["ich soll", "ich sollte", "+ te"],
            ["ich mag", "ich mochte", "a → o, + te"]
          ]
        }
      ],
      notes: [
        "The word order does not change at all: the modal stands in position 2, the main verb is an infinitive at the end. „Ich <b>wollte</b> auf meiner Schule <b>bleiben</b>.“",
        "In a Nebensatz the modal goes last: „…, weil ich auf meiner Schule bleiben <b>wollte</b>.“"
      ],
      examples: [
        { de: "Ich wollte auf meiner Schule bleiben.", en: "I wanted to stay at my school." },
        { de: "Mit sechs Jahren konnte ich schon lesen.", en: "At six I could already read." },
        { de: "Wir mussten jeden Tag Hausaufgaben machen.", en: "We had to do homework every day." },
        { de: "Ich durfte abends nicht lange draußen spielen.", en: "I wasn't allowed to play outside late in the evening." },
        { de: "Als Kind mochte ich Mathematik nicht.", en: "As a child I didn't like maths." },
        { de: "Eigentlich sollte ich Arzt werden.", en: "I was actually supposed to become a doctor." }
      ],
      watch: "<b>konnte</b> without an Umlaut is the past; <b>könnte</b> with one is the polite form (<em>could</em>). Two different sentences, one dot apart."
    },
    {
      letter: "B",
      head: "Es ist wichtig, dass …",
      grammar: "Nebensätze mit dass",
      goal: "Die Meinung äußern.",
      topic: "nebensatz",
      summary: "dass packs a whole statement into a clause so it can hang off a verb of thinking, saying or judging. Verb to the end, comma in front — the same machinery as weil.",
      pattern: "Ich finde , dass + … + VERB .",
      tables: [
        {
          caption: "Die Einleitungen",
          cols: ["Hauptsatz", "Nebensatz"],
          rows: [
            ["Ich glaube,", "dass er den Kurs <b>macht</b>."],
            ["Ich finde,", "dass Sprachen wichtig <b>sind</b>."],
            ["Ich denke,", "dass das richtig <b>ist</b>."],
            ["Ich hoffe,", "dass du die Prüfung <b>schaffst</b>."],
            ["Ich bin sicher,", "dass du das <b>kannst</b>."],
            ["Es ist wichtig,", "dass man einen Beruf <b>lernt</b>."],
            ["Es ist schade,", "dass du nicht <b>kommen kannst</b>."]
          ]
        }
      ],
      notes: [
        "After glauben, finden, denken, meinen and hoffen you may drop dass entirely — and then the word order goes back to normal: „Ich glaube, er <b>kommt</b> morgen.“ Both versions are correct.",
        "„Es ist wichtig / schön / schade / gut, dass …“ is the pattern for judging a situation rather than reporting one."
      ],
      examples: [
        { de: "Ich finde, dass Sprachen sehr wichtig sind.", en: "I think languages are very important." },
        { de: "Es ist wichtig, dass man einen Beruf lernt.", en: "It's important to learn a trade." },
        { de: "Ich glaube, dass sie die Prüfung bestanden hat.", en: "I think she passed the exam." },
        { de: "Es ist schade, dass du nicht mitkommen kannst.", en: "It's a shame you can't come along." },
        { de: "Ich bin sicher, dass du das schaffst.", en: "I'm sure you'll manage it." }
      ],
      watch: "<b>dass</b> with two s is the conjunction; <b>das</b> with one is the article or the pronoun. „Ich weiß, <b>dass das</b> schwierig ist“ — both in one sentence, and both correct."
    },
    {
      letter: "C",
      head: "Schule",
      kind: "wortschatz",
      goal: "Über das Schulsystem und die Schulzeit sprechen.",
      summary: "The German school system and the words for talking about your own school years.",
      examples: [
        { de: "In Deutschland geht man mit sechs Jahren in die Grundschule.", en: "In Germany you start primary school at six." },
        { de: "Danach kommt man aufs Gymnasium, auf die Realschule oder auf die Hauptschule.", en: "After that you go to Gymnasium, Realschule or Hauptschule." },
        { de: "Mit dem Abitur kann man studieren.", en: "With the Abitur you can go to university." },
        { de: "Meine Lieblingsfächer waren Biologie und Sport.", en: "My favourite subjects were biology and PE." },
        { de: "Bei uns ist das Schulsystem anders als hier.", en: "In my country the school system is different from here." }
      ]
    },
    {
      letter: "D",
      head: "Aus- und Weiterbildung",
      kind: "wortschatz",
      goal: "Aus- und Weiterbildungsangebote verstehen.",
      summary: "Apprenticeships and further training — reading a course listing and signing up.",
      examples: [
        { de: "Ich mache eine Ausbildung als Krankenpfleger.", en: "I'm training as a nurse." },
        { de: "Die Ausbildung dauert drei Jahre.", en: "The training lasts three years." },
        { de: "Der Kurs findet jeden Dienstag von 18 bis 20 Uhr statt.", en: "The course is every Tuesday from 6 to 8pm." },
        { de: "Für diesen Kurs braucht man Vorkenntnisse.", en: "You need prior knowledge for this course." },
        { de: "Ich möchte mich zu dem Computerkurs anmelden.", en: "I'd like to register for the computer course." }
      ]
    },
    {
      letter: "E",
      head: "Mein Berufsweg",
      kind: "wortschatz",
      goal: "Einen biographischen Text verstehen und über den eigenen Weg sprechen.",
      summary: "Telling the story of your working life — which is mostly Perfekt plus the Präteritum of sein, haben and the modals.",
      examples: [
        { de: "Nach der Schule habe ich eine Ausbildung gemacht.", en: "After school I did an apprenticeship." },
        { de: "Dann habe ich fünf Jahre als Verkäufer gearbeitet.", en: "Then I worked as a salesperson for five years." },
        { de: "2019 bin ich nach Deutschland gekommen.", en: "In 2019 I came to Germany." },
        { de: "Zuerst war das schwierig, weil ich kein Deutsch konnte.", en: "At first it was hard because I couldn't speak German." },
        { de: "Jetzt möchte ich mich weiterbilden.", en: "Now I'd like to train further." }
      ]
    }
  ],

  deepen: [
    {
      head: "Als ich ein Kind war …",
      grammar: "Nebensätze mit als — und das Präteritum der starken Verben",
      source: "Menschen A2, Lektion 13",
      summary: "als is the past-only cousin of wenn: one single occasion, or one stretch of life that is over. It is almost always followed by a Präteritum, which is why the two belong on one page.",
      pattern: "Als + … + VERB (Präteritum) , …",
      tables: [
        {
          caption: "Präteritum, die Formen, die man lesen muss",
          cols: ["Infinitiv", "ich / er, sie, es", "wir / sie"],
          rows: [
            ["sein", "war", "waren"],
            ["haben", "hatte", "hatten"],
            ["werden", "wurde", "wurden"],
            ["gehen", "ging", "gingen"],
            ["kommen", "kam", "kamen"],
            ["geben", "gab", "gaben"],
            ["wohnen", "wohnte", "wohnten"],
            ["machen", "machte", "machten"]
          ]
        },
        {
          caption: "als oder wenn",
          cols: ["einmal, Vergangenheit → als", "immer / Zukunft → wenn"],
          rows: [
            ["<b>Als</b> ich ein Kind war, …", "<b>Wenn</b> ich Zeit habe, …"],
            ["<b>Als</b> ich nach Deutschland kam, …", "Immer <b>wenn</b> es regnet, …"],
            ["<b>Als</b> ich die Schule beendete, …", "<b>Wenn</b> ich fertig bin, …"]
          ]
        }
      ],
      notes: [
        "In speech the Präteritum is mostly limited to sein, haben, werden and the modals — everything else uses the Perfekt. In writing, and in the texts you read at A2, the full Präteritum turns up, so it is worth recognising even before you can produce it.",
        "<b>ich</b> and <b>er/sie/es</b> are always identical in the Präteritum: ich ging / er ging, ich wohnte / sie wohnte."
      ],
      examples: [
        { de: "Als ich ein Kind war, wohnten wir in Nepal.", en: "When I was a child we lived in Nepal." },
        { de: "Als ich nach Deutschland kam, konnte ich kein Deutsch.", en: "When I came to Germany I couldn't speak German." },
        { de: "Als meine erste Lehrerin das sagte, war ich sehr stolz.", en: "When my first teacher said that I was very proud." },
        { de: "Wenn ich Zeit habe, lerne ich Vokabeln.", en: "When I have time I learn vocabulary." }
      ],
      watch: "One occasion in the past takes <b>als</b>, never wenn: „<b>Als</b> ich 2019 nach Deutschland kam …“ — „Wenn ich 2019 kam“ would mean <em>whenever</em>, which is nonsense."
    },
    {
      head: "dass · ob · weil · wenn — alle gleich gebaut",
      grammar: "Die Nebensatz-Familie auf einen Blick",
      source: "Goethe-Zertifikat A2, Grammatik-Inventar",
      summary: "By the end of A2.1 you have met five subordinating conjunctions. They differ in meaning and not at all in grammar: every one of them pushes the conjugated verb to the end of its clause. Learning them as one family is the shortcut.",
      pattern: "…, [dass / ob / weil / wenn / als] + Subjekt + … + VERB .",
      tables: [
        {
          caption: "Eine Regel, fünf Wörter",
          cols: ["Konjunktion", "Bedeutung", "Beispiel"],
          rows: [
            ["dass", "that", "Ich glaube, dass er morgen <b>kommt</b>."],
            ["ob", "whether", "Ich weiß nicht, ob er morgen <b>kommt</b>."],
            ["weil", "because", "Er kommt nicht, weil er krank <b>ist</b>."],
            ["wenn", "if / whenever", "Wenn er Zeit <b>hat</b>, kommt er."],
            ["als", "when (einmal, früher)", "Als er klein <b>war</b>, kam er oft."]
          ]
        },
        {
          caption: "Was am Ende steht",
          cols: ["Im Nebensatz steht am Ende", "Beispiel"],
          rows: [
            ["ein einfaches Verb", "…, weil ich müde <b>bin</b>."],
            ["ein Modalverb", "…, weil ich arbeiten <b>muss</b>."],
            ["haben / sein im Perfekt", "…, weil ich gearbeitet <b>habe</b>."],
            ["ein trennbares Verb (ganz)", "…, weil ich früh <b>aufstehe</b>."]
          ]
        }
      ],
      notes: [
        "And the two that look like conjunctions but are not: <b>denn</b> (word order unchanged) and <b>deshalb</b> (verb directly after it). Those two never send a verb anywhere."
      ],
      examples: [
        { de: "Ich hoffe, dass ich die Prüfung schaffe.", en: "I hope I'll pass the exam." },
        { de: "Ich frage, ob der Kurs noch frei ist.", en: "I'll ask whether there are still places on the course." },
        { de: "Ich lerne Deutsch, weil ich hier arbeiten möchte.", en: "I'm learning German because I want to work here." },
        { de: "Wenn der Kurs zu teuer ist, suche ich einen anderen.", en: "If the course is too expensive I'll look for another." },
        { de: "Als ich in der Schule war, hatte ich keine Lust.", en: "When I was at school I wasn't interested." }
      ],
      watch: "Once a sentence has a Nebensatz at the front, the main clause must start with its verb: „Wenn er Zeit hat, <b>kommt</b> er“ — not „kommt er nicht“ order problems, simply verb first."
    }
  ],

  test: [
    { rule: "praet-modal", en: "I wanted to stay at my school.",
      parts: ["Ich ", { options: ["wollte", "wollt", "will"], answer: "wollte" }, " auf meiner Schule bleiben."] },
    { rule: "praet-modal", en: "At six I could already read.",
      parts: ["Mit sechs Jahren ", { options: ["konnte", "könnte", "kannte"], answer: "konnte" }, " ich schon lesen."] },
    { rule: "praet-modal", en: "We had to do homework every day.",
      parts: ["Wir ", { options: ["mussten", "müssten", "musste"], answer: "mussten" }, " jeden Tag Hausaufgaben machen."] },
    { rule: "praet-modal", en: "I wasn't allowed to play outside.",
      parts: ["Ich ", { options: ["durfte", "dürfte", "darf"], answer: "durfte" }, " nicht draußen spielen."] },
    { rule: "praet-modal", en: "As a child I didn't like maths.",
      parts: ["Als Kind ", { options: ["mochte", "möchte", "mag"], answer: "mochte" }, " ich Mathematik nicht."] },
    { rule: "praet-modal-infinitiv", en: "I couldn't come yesterday.",
      parts: ["Ich konnte gestern nicht ", { options: ["kommen", "gekommen", "komme"], answer: "kommen" }, "."] },
    { rule: "dass-end", en: "I think languages are very important.",
      parts: ["Ich finde, dass Sprachen sehr wichtig ", { options: ["sind", "sein", "ist"], answer: "sind" }, "."] },
    { rule: "dass-vs-das", en: "It's important to learn a trade.",
      parts: ["Es ist wichtig, ", { options: ["dass", "das", "ob"], answer: "dass" }, " man einen Beruf lernt."] },
    { rule: "dass-end", en: "I think she passed the exam.",
      parts: ["Ich glaube, dass sie die Prüfung bestanden ", { options: ["hat", "ist", "haben"], answer: "hat" }, "."] },
    { rule: "dass-end", en: "It's a shame you can't come along.",
      parts: ["Es ist schade, dass du nicht mitkommen ", { options: ["kannst", "kann", "könnest"], answer: "kannst" }, "."] },
    { rule: "dass-vs-das", en: "I know that that is difficult.",
      parts: ["Ich weiß, ", { options: ["dass das", "das dass", "das das"], answer: "dass das" }, " schwierig ist."] },
    { rule: "dass-end", en: "I'm sure you'll manage it.",
      parts: ["Ich bin sicher, dass du das ", { options: ["schaffst", "schaffen", "geschafft"], answer: "schaffst" }, "."] },
    { rule: "als-einmal", en: "When I was a child we lived in Nepal.",
      parts: [{ options: ["Als", "Wenn", "Wann"], answer: "Als" }, " ich ein Kind war, wohnten wir in Nepal."] },
    { rule: "als-praeteritum", en: "When I came to Germany I couldn't speak German.",
      parts: ["Als ich nach Deutschland ", { options: ["kam", "kommen", "gekommen"], answer: "kam" }, ", konnte ich kein Deutsch."] },
    { rule: "wenn-immer", en: "When I have time I learn vocabulary.",
      parts: [{ options: ["Wenn", "Als", "Wann"], answer: "Wenn" }, " ich Zeit habe, lerne ich Vokabeln."] },
    { rule: "praet-werden", en: "In 2019 I became a nurse.",
      parts: ["2019 ", { options: ["wurde", "wurd", "wird"], answer: "wurde" }, " ich Krankenpfleger."] },
    { rule: "ob-janein", en: "I'll ask whether there are still places on the course.",
      parts: ["Ich frage, ", { options: ["ob", "dass", "wenn"], answer: "ob" }, " der Kurs noch frei ist."] },
    { rule: "weil-modal", en: "I'm learning German because I want to work here.",
      parts: ["Ich lerne Deutsch, weil ich hier arbeiten ", { options: ["möchte", "möchten", "mag"], answer: "möchte" }, "."] },
    { rule: "weil-modal", en: "I'm tired because I had to work.",
      parts: ["Ich bin müde, weil ich arbeiten ", { options: ["musste", "müsste", "muss gemusst"], answer: "musste" }, "."] },
    { rule: "wenn-vorn", en: "If he has time, he'll come.",
      parts: ["Wenn er Zeit hat, ", { options: ["kommt er", "er kommt", "kommen er"], answer: "kommt er" }, "."] }
  ]
};

/* ------------------------------------------------------------------ */
/* Lektion 7 — Feste und Geschenke                                     */
/* ------------------------------------------------------------------ */

const L7 = {
  nr: 7,
  title: "Feste und Geschenke",
  en: "Celebrations and presents",
  tone: "var(--t-familie)",
  focus: "Possessivartikel im Dativ · Stellung der Objekte · von + Dativ",

  steps: [
    {
      letter: "A",
      head: "Ich habe meinem Mann … gekauft.",
      grammar: "Possessivartikel im Dativ",
      goal: "Über Geschenkideen sprechen.",
      topic: "dativ",
      summary: "Giving has two objects: the PERSON who receives (Dativ, question Wem?) and the THING given (Akkusativ, question Was?). The possessive article in front of the person takes the dative endings.",
      pattern: "Wem? → mein·em (der/das) · mein·er (die) · mein·en + n (Plural)",
      tables: [
        {
          caption: "Possessivartikel im Dativ",
          cols: ["", "der / das", "die", "die (Plural)"],
          rows: [
            ["mein", "mein<b>em</b> Mann / Kind", "mein<b>er</b> Nachbarin", "mein<b>en</b> Eltern"],
            ["dein", "dein<b>em</b> Bruder", "dein<b>er</b> Schwester", "dein<b>en</b> Freunden"],
            ["sein", "sein<b>em</b> Vater", "sein<b>er</b> Mutter", "sein<b>en</b> Kindern"],
            ["ihr", "ihr<b>em</b> Mann", "ihr<b>er</b> Tochter", "ihr<b>en</b> Nachbarn"],
            ["unser", "unser<b>em</b> Sohn", "unser<b>er</b> Oma", "unser<b>en</b> Gästen"],
            ["euer", "eur<b>em</b> Kollegen", "eur<b>er</b> Chefin", "eur<b>en</b> Freunden"],
            ["kein / ein", "kein<b>em</b> Kind", "kein<b>er</b> Frau", "kein<b>en</b> Leuten"]
          ]
        },
        {
          caption: "Wer — wem — was",
          cols: ["Wer?", "Verb", "Wem? (Person)", "Was? (Sache)"],
          rows: [
            ["Ich", "habe", "mein<b>em</b> Mann", "Gartenstühle gekauft."],
            ["Kristina", "schenkt", "ihr<b>er</b> Nachbarin", "Pralinen."],
            ["Wir", "schenken", "unser<b>en</b> Nachbarn", "eine Flasche Wein."],
            ["Was", "schenkst", "du dein<b>er</b> Schwester", "?"]
          ]
        }
      ],
      notes: [
        "The Dativ Plural adds an -n to the NOUN too: meinen Nachbar<b>n</b>, meinen Kinder<b>n</b>, unseren Gäste<b>n</b>. A plural already ending in -n or -s does not double it.",
        "The verbs that work this way: <b>schenken</b>, <b>kaufen</b>, <b>geben</b>, <b>bringen</b>, <b>zeigen</b>, <b>schicken</b>, <b>empfehlen</b>, <b>erklären</b>, <b>leihen</b>."
      ],
      examples: [
        { de: "Ich habe meinem Mann Gartenstühle gekauft.", en: "I bought my husband some garden chairs." },
        { de: "Ich schenke meiner Nachbarin Blumen.", en: "I'm giving my neighbour flowers." },
        { de: "Wir schenken unseren Nachbarn eine Flasche Wein.", en: "We're giving our neighbours a bottle of wine." },
        { de: "Was schenkst du deiner Schwester zum Geburtstag?", en: "What are you giving your sister for her birthday?" },
        { de: "Kannst du meinen Eltern die Fotos zeigen?", en: "Can you show my parents the photos?" }
      ],
      watch: "Dativ marks the <em>recipient</em>, and English gives you no hint, because it just puts the person first: <em>I bought <b>my husband</b> chairs</em>. Ask <b>Wem?</b> and you will find it."
    },
    {
      letter: "B",
      head: "Ich kann es Ihnen nur empfehlen.",
      grammar: "Die Stellung der Objekte im Satz",
      goal: "Bitten und Empfehlungen ausdrücken.",
      topic: "pronomen",
      summary: "With two objects, the default is Dativ before Akkusativ — person first, thing second. One rule overrides it: an accusative PRONOUN jumps to the front of both.",
      pattern: "Nomen: Dativ → Akkusativ   ·   Akkusativpronomen: immer zuerst",
      tables: [
        {
          caption: "Vier Kombinationen",
          cols: ["Was ist was", "Reihenfolge", "Beispiel"],
          rows: [
            ["Nomen + Nomen", "Dativ → Akkusativ", "Ich schenke <b>meiner Mutter</b> <b>einen Schal</b>."],
            ["Pronomen + Nomen", "Dativ → Akkusativ", "Ich schenke <b>ihr</b> <b>einen Schal</b>."],
            ["Nomen + Pronomen", "<b>Akkusativ</b> → Dativ", "Ich schenke <b>ihn</b> <b>meiner Mutter</b>."],
            ["Pronomen + Pronomen", "<b>Akkusativ</b> → Dativ", "Ich schenke <b>ihn</b> <b>ihr</b>."]
          ]
        },
        {
          caption: "Die Pronomen, die man dafür braucht",
          cols: ["", "Akkusativ", "Dativ"],
          rows: [
            ["ich", "mich", "mir"],
            ["du", "dich", "dir"],
            ["er / es", "ihn / es", "ihm"],
            ["sie", "sie", "ihr"],
            ["wir", "uns", "uns"],
            ["ihr", "euch", "euch"],
            ["sie / Sie", "sie", "ihnen / Ihnen"]
          ]
        }
      ],
      notes: [
        "One line to remember it all: <em>the shorter and the more pronoun-ish, the earlier.</em> An accusative pronoun is the shortest thing in the sentence, so it goes first.",
        "„Ich kann <b>es Ihnen</b> nur empfehlen“ — es (Akkusativpronomen) before Ihnen (Dativ). This is the chapter's title sentence and the pattern in miniature."
      ],
      examples: [
        { de: "Ich kann es Ihnen nur empfehlen.", en: "I can only recommend it to you." },
        { de: "Kannst du mir das Rezept geben?", en: "Can you give me the recipe?" },
        { de: "Ich schicke es dir heute noch.", en: "I'll send it to you today." },
        { de: "Zeig sie mir bitte!", en: "Show them to me, please!" },
        { de: "Wir haben unseren Gästen die Wohnung gezeigt.", en: "We showed our guests the flat." },
        { de: "Ich habe sie ihnen schon erklärt.", en: "I've already explained it to them." }
      ],
      watch: "„Ich schenke meiner Mutter ihn“ is wrong. The moment the thing becomes a pronoun, it overtakes the person: „Ich schenke <b>ihn meiner Mutter</b>.“"
    },
    {
      letter: "C",
      head: "Hochzeit",
      kind: "wortschatz",
      goal: "Kurznachrichten über eine Hochzeit verstehen und über ein Fest berichten.",
      summary: "Weddings and the messages people send about them.",
      examples: [
        { de: "Wir heiraten am 12. Juni — kommst du?", en: "We're getting married on 12 June — will you come?" },
        { de: "Herzlichen Glückwunsch zur Hochzeit!", en: "Congratulations on your wedding!" },
        { de: "Die Feier war wunderschön.", en: "The celebration was lovely." },
        { de: "Wir haben bis morgens um vier getanzt.", en: "We danced until four in the morning." },
        { de: "Leider kann ich nicht kommen, ich bin an dem Tag verreist.", en: "Unfortunately I can't come, I'm away that day." }
      ]
    },
    {
      letter: "D",
      head: "Geschenke",
      grammar: "Die Präposition von mit Dativ",
      goal: "Meinungen, Vorlieben und Wichtigkeit ausdrücken.",
      topic: "praepositionen",
      summary: "Spoken German avoids the genitive and says von + Dativ instead. It covers belonging, origin and authorship — and it is the normal form, not a sloppy one.",
      pattern: "von + Dativ:  von dem = vom · von der · von den + n",
      tables: [
        {
          caption: "von + Dativ",
          cols: ["", "Form", "Beispiel"],
          rows: [
            ["der / das", "von dem = <b>vom</b>", "das Geschenk <b>vom</b> Chef"],
            ["die", "<b>von der</b>", "die Blumen <b>von der</b> Nachbarin"],
            ["Plural", "<b>von den</b>", "die Karte <b>von den</b> Kollegen"],
            ["Possessiv", "<b>von meinem</b> / <b>von meiner</b>", "das Buch <b>von meiner</b> Schwester"],
            ["Name", "<b>von</b> + Name", "die Mutter <b>von</b> Tim"]
          ]
        },
        {
          caption: "Meinung und Wichtigkeit",
          cols: ["Redemittel", "Beispiel"],
          rows: [
            ["Was halten Sie von …?", "Was hältst du <b>von dem</b> Geschenk?"],
            ["Ich halte viel / nicht viel von …", "Ich halte nicht viel <b>von</b> teuren Geschenken."],
            ["Mir ist … wichtig", "<b>Mir</b> ist wichtig, dass das Geschenk persönlich ist."],
            ["Am liebsten …", "<b>Am liebsten</b> schenke ich etwas Selbstgemachtes."]
          ]
        }
      ],
      notes: [
        "With a name both forms exist and both are correct: „<b>Tims</b> Mutter“ and „die Mutter <b>von Tim</b>“. The second is what you will hear.",
        "Contractions in this family: von + dem = <b>vom</b>, bei + dem = <b>beim</b>, zu + dem = <b>zum</b>, zu + der = <b>zur</b>."
      ],
      examples: [
        { de: "Das ist das Geschenk von meiner Schwester.", en: "That's the present from my sister." },
        { de: "Die Mutter von Tim kommt auch zum Fest.", en: "Tim's mother is coming to the party too." },
        { de: "Was hältst du von dieser Idee?", en: "What do you think of this idea?" },
        { de: "Ich halte nicht viel von teuren Geschenken.", en: "I don't think much of expensive presents." },
        { de: "Mir ist wichtig, dass das Geschenk persönlich ist.", en: "It matters to me that the present is personal." }
      ],
      watch: "von is one of the always-Dativ prepositions, so there is never a choice: „von <b>meiner</b> Schwester“, „<b>vom</b> Chef“ — never „von meine“."
    },
    {
      letter: "E",
      head: "Ein Fest planen",
      kind: "wortschatz",
      goal: "Ein Fest planen und von Festen erzählen.",
      summary: "Planning something together: suggesting, agreeing, dividing up the jobs.",
      examples: [
        { de: "Wollen wir am Samstag eine Party machen?", en: "Shall we have a party on Saturday?" },
        { de: "Ich finde, wir sollten um sieben anfangen.", en: "I think we should start at seven." },
        { de: "Ich kümmere mich um die Getränke.", en: "I'll take care of the drinks." },
        { de: "Könntest du den Salat mitbringen?", en: "Could you bring the salad?" },
        { de: "Einverstanden, das machen wir so.", en: "Agreed, let's do it that way." }
      ]
    }
  ],

  deepen: [
    {
      head: "Die Nomen, die im Dativ anders aussehen",
      grammar: "n-Deklination und der Dativ Plural",
      source: "Goethe-Zertifikat A2, Grammatik-Inventar · Menschen A2, Lektion 15",
      summary: "Two small spelling rules that bite exactly in this chapter, because this chapter is full of people in the dative.",
      pattern: "Dativ Plural: + n   ·   n-Deklination: der Nachbar → dem Nachbarn",
      tables: [
        {
          caption: "Dativ Plural bekommt ein -n",
          cols: ["Nominativ Plural", "Dativ Plural"],
          rows: [
            ["die Kinder", "mit den Kinder<b>n</b>"],
            ["die Freunde", "von meinen Freunde<b>n</b>"],
            ["die Gäste", "für die Gäste → <em>Akk.</em> · mit den Gäste<b>n</b>"],
            ["die Eltern", "mit den Eltern <em>(schon -n)</em>"],
            ["die Autos", "mit den Autos <em>(-s: kein -n)</em>"]
          ]
        },
        {
          caption: "n-Deklination: diese Maskulina",
          cols: ["Nominativ", "Akkusativ / Dativ"],
          rows: [
            ["der Nachbar", "den / dem Nachbar<b>n</b>"],
            ["der Kollege", "den / dem Kolleg<b>en</b>"],
            ["der Junge", "den / dem Jung<b>en</b>"],
            ["der Herr", "den / dem Herr<b>n</b>"],
            ["der Mensch", "den / dem Mensch<b>en</b>"],
            ["der Student", "den / dem Student<b>en</b>"],
            ["der Name", "den / dem Name<b>n</b>"]
          ]
        }
      ],
      notes: [
        "The n-Deklination group is small and mostly people: nouns in <b>-e</b> (Kollege, Junge, Name), plus Herr, Mensch, Nachbar, and job words in <b>-ent / -ist / -ant</b> (Student, Polizist, Praktikant)."
      ],
      examples: [
        { de: "Ich schenke meinen Kindern Bücher.", en: "I'm giving my children books." },
        { de: "Ich habe mit dem Nachbarn gesprochen.", en: "I spoke to the neighbour." },
        { de: "Wir fahren mit unseren Freunden nach Berlin.", en: "We're going to Berlin with our friends." },
        { de: "Kennst du Herrn Berg?", en: "Do you know Mr Berg?" },
        { de: "Ich habe meinem Kollegen geholfen.", en: "I helped my colleague." }
      ],
      watch: "„Herr“ loses its bare form as soon as it is not the subject: <b>Herrn</b> Berg in the accusative and dative, and in the address on an envelope."
    },
    {
      head: "zum Geburtstag, am Samstag, im Juni",
      grammar: "Temporale Präpositionen — und die, die neu dazukommen",
      source: "Menschen A2, Lektion 6 · Schritte plus Neu 3, Lektion 7",
      summary: "Dates and occasions, as fixed blocks. The A1 set (am, im, um) plus the ones A2 adds: von … bis, ab, über, zwischen, vor, nach, seit.",
      pattern: "am Samstag · im Juni · um acht · zum Geburtstag · von acht bis zehn · ab Montag",
      tables: [
        {
          caption: "Wann?",
          cols: ["Präposition", "Wofür", "Beispiel"],
          rows: [
            ["am + Dativ", "Tage, Datum", "<b>am</b> Samstag, <b>am</b> 12. Juni"],
            ["im + Dativ", "Monate, Jahreszeiten", "<b>im</b> Juni, <b>im</b> Sommer"],
            ["um", "Uhrzeit", "<b>um</b> acht Uhr"],
            ["zu + Dativ", "Feste, Anlässe", "<b>zum</b> Geburtstag, <b>zu</b> Weihnachten"],
            ["von … bis", "Zeitraum", "<b>von</b> acht <b>bis</b> zehn Uhr"],
            ["ab + Dativ", "Anfang, in die Zukunft", "<b>ab</b> Montag, <b>ab</b> nächster Woche"],
            ["über + Akkusativ", "Dauer, hindurch", "<b>über</b> das Wochenende"],
            ["zwischen + Dativ", "dazwischen", "<b>zwischen</b> acht und zehn"],
            ["vor / nach + Dativ", "früher / später", "<b>vor</b> dem Fest, <b>nach</b> der Feier"],
            ["seit + Dativ", "Anfang in der Vergangenheit", "<b>seit</b> zwei Jahren"]
          ]
        }
      ],
      notes: [
        "No preposition at all for a year on its own: „<b>2019</b> bin ich gekommen“ or „<b>im Jahr</b> 2019“ — but never „in 2019“.",
        "<b>seit</b> keeps the PRESENT tense in German: „Ich wohne <b>seit</b> zwei Jahren hier“, where English says <em>have lived</em>."
      ],
      examples: [
        { de: "Zum Geburtstag schenke ich ihr Blumen.", en: "For her birthday I'm giving her flowers." },
        { de: "Die Feier ist am Samstag von acht bis zwölf.", en: "The party is on Saturday from eight to twelve." },
        { de: "Ab nächster Woche habe ich Urlaub.", en: "From next week I'm on holiday." },
        { de: "Über das Wochenende bleiben wir zu Hause.", en: "Over the weekend we're staying at home." },
        { de: "Ich kenne sie seit drei Jahren.", en: "I've known her for three years." }
      ],
      watch: "„<b>zu</b> Weihnachten“ and „<b>zum</b> Geburtstag“ for occasions — not „für“. The present itself can take für („ein Geschenk <b>für</b> dich“), but the occasion takes zu."
    }
  ],

  test: [
    { rule: "possessiv-dativ-m", en: "I bought my husband some garden chairs.",
      parts: ["Ich habe ", { options: ["meinem", "meinen", "meiner"], answer: "meinem" }, " Mann Gartenstühle gekauft."] },
    { rule: "possessiv-dativ-f", en: "I'm giving my neighbour flowers.",
      parts: ["Ich schenke ", { options: ["meiner", "meinem", "meine"], answer: "meiner" }, " Nachbarin Blumen."] },
    { rule: "possessiv-dativ-pl", en: "We're giving our neighbours a bottle of wine.",
      parts: ["Wir schenken ", { options: ["unseren", "unsere", "unserem"], answer: "unseren" }, " Nachbarn eine Flasche Wein."] },
    { rule: "possessiv-dativ-f", en: "What are you giving your sister?",
      parts: ["Was schenkst du ", { options: ["deiner", "deine", "deinem"], answer: "deiner" }, " Schwester?"] },
    { rule: "possessiv-dativ-pl", en: "Can you show my parents the photos?",
      parts: ["Kannst du ", { options: ["meinen", "meine", "meinem"], answer: "meinen" }, " Eltern die Fotos zeigen?"] },
    { rule: "dativ-plural-n", en: "I'm giving my children books.",
      parts: ["Ich schenke meinen ", { options: ["Kindern", "Kinder", "Kindes"], answer: "Kindern" }, " Bücher."] },
    { rule: "objekt-akk-pronomen", en: "I can only recommend it to you.",
      parts: ["Ich kann ", { options: ["es Ihnen", "Ihnen es", "es Sie"], answer: "es Ihnen" }, " nur empfehlen."] },
    { rule: "objekt-dativ-vor-akk", en: "Can you give me the recipe?",
      parts: ["Kannst du ", { options: ["mir das Rezept", "das Rezept mir", "mich das Rezept"], answer: "mir das Rezept" }, " geben?"] },
    { rule: "objekt-akk-pronomen", en: "I'll send it to you today.",
      parts: ["Ich schicke ", { options: ["es dir", "dir es", "es dich"], answer: "es dir" }, " heute noch."] },
    { rule: "objekt-akk-pronomen", en: "I'm giving it to my mother.",
      parts: ["Ich schenke ", { options: ["ihn meiner Mutter", "meiner Mutter ihn", "ihm meine Mutter"], answer: "ihn meiner Mutter" }, "."] },
    { rule: "objekt-akk-pronomen", en: "I'm giving it to her.",
      parts: ["Ich schenke ", { options: ["ihn ihr", "ihr ihn", "sie ihr"], answer: "ihn ihr" }, "."] },
    { rule: "possessiv-dativ-pl", en: "We showed our guests the flat.",
      parts: ["Wir haben ", { options: ["unseren Gästen", "unsere Gäste", "unserem Gäste"], answer: "unseren Gästen" }, " die Wohnung gezeigt."] },
    { rule: "von-dativ", en: "That's the present from my sister.",
      parts: ["Das ist das Geschenk von ", { options: ["meiner", "meine", "meinem"], answer: "meiner" }, " Schwester."] },
    { rule: "vom-kontraktion", en: "The present from the boss was expensive.",
      parts: ["Das Geschenk ", { options: ["vom", "von dem Chefs", "von der"], answer: "vom" }, " Chef war teuer."] },
    { rule: "von-name", en: "Tim's mother is coming too.",
      parts: ["Die Mutter ", { options: ["von", "aus", "für"], answer: "von" }, " Tim kommt auch."] },
    { rule: "halten-von", en: "What do you think of this idea?",
      parts: ["Was hältst du ", { options: ["von", "über", "für"], answer: "von" }, " dieser Idee?"] },
    { rule: "n-deklination", en: "I spoke to the neighbour.",
      parts: ["Ich habe mit dem ", { options: ["Nachbarn", "Nachbar", "Nachbars"], answer: "Nachbarn" }, " gesprochen."] },
    { rule: "herrn", en: "Do you know Mr Berg?",
      parts: ["Kennst du ", { options: ["Herrn", "Herr", "Herren"], answer: "Herrn" }, " Berg?"] },
    { rule: "zu-anlass", en: "For her birthday I'm giving her flowers.",
      parts: [{ options: ["Zum", "Für den", "Am"], answer: "Zum" }, " Geburtstag schenke ich ihr Blumen."] },
    { rule: "am-tag", en: "The party is on Saturday.",
      parts: ["Die Feier ist ", { options: ["am", "im", "um"], answer: "am" }, " Samstag."] },
    { rule: "ab-dativ", en: "From next week I'm on holiday.",
      parts: [{ options: ["Ab", "Von", "Seit"], answer: "Ab" }, " nächster Woche habe ich Urlaub."] },
    { rule: "seit-dativ", en: "I've known her for three years.",
      parts: ["Ich kenne sie seit drei ", { options: ["Jahren", "Jahre", "Jahr"], answer: "Jahren" }, "."] }
  ]
};

/* ------------------------------------------------------------------ */
/* Hinweise — what a wrong gap gets instead of the answer              */
/* ------------------------------------------------------------------ */

/*
 * A wrong gap is told the rule, not the answer. It gets one sentence of
 * explanation and one worked example of the SAME structure with DIFFERENT
 * words, so the example cannot be copied into the gap — it has to be applied.
 *
 * The answer exists behind one more deliberate press (Antwort zeigen, red,
 * styled as the destructive action it is), and a gap opened that way is
 * counted separately from one that was earned. Keeping the two apart is the
 * point: a score that counts revealed answers as correct is a score that
 * lies to you.
 *
 * Items carry a `rule` id rather than their own hint text, so the same rule
 * explains itself identically wherever it is tested — weil in Lektion 1 and
 * weil in Lektion 6 are the same rule and should not drift apart.
 */

export const HINTS = {
  /* ---- Nebensatz ---- */
  "weil-end": { tip: "weil opens a Nebensatz, and the conjugated verb drops to the very END of it. Find the verb, then put it last and match it to the subject.", ex: "Ich bleibe hier, weil das Wetter schlecht <b>wird</b>." },
  "weil-perfekt": { tip: "In a Perfekt Nebensatz the LAST word is the helper verb, haben or sein, standing after the participle — and it has to match the subject.", ex: "Ich bin müde, weil ich lange gearbeitet <b>habe</b>." },
  "weil-trennbar": { tip: "A separable verb does not separate in a Nebensatz. It stays whole, as one word, at the end.", ex: "Ich bin müde, weil ich so früh <b>losfahre</b>." },
  "weil-modal": { tip: "With a modal, the MODAL is the conjugated verb — so the modal goes last, with the infinitive sitting just in front of it.", ex: "Ich bleibe zu Hause, weil ich lernen <b>will</b>." },
  "nebensatz-vorn": { tip: "A Nebensatz at the front fills position 1 of the sentence, so the main clause has to start with its verb.", ex: "Weil es kalt ist, <b>nehme ich</b> den Mantel mit." },
  "dass-end": { tip: "dass works exactly like weil: conjugated verb at the end of the clause.", ex: "Ich hoffe, dass der Kurs morgen <b>anfängt</b>." },
  "dass-vs-das": { tip: "Count the s. One of them is the conjunction that opens a clause and sends the verb to the end; the other, with a single s, is an article or a pronoun belonging to a noun.", ex: "<b>Das</b> Auto ist neu. <em>(Artikel, ein s)</em> — Ich hoffe, … es noch lange fährt. <em>(Bindewort, zwei s)</em>" },
  "ob-janein": { tip: "Is the open question a yes-or-no one? Then you need the whether-word — not the time-word, and not dass.", ex: "Zeit: Ich weiß nicht, <b>wann</b> er kommt. · Ja oder nein? Dann das andere Wort." },
  "wann-indirekt": { tip: "An indirect question keeps its own question word. This one asks about a TIME — so not the condition-word, and not the yes-or-no word.", ex: "Ja/Nein: Ich weiß nicht, <b>ob</b> er kommt. · Bedingung: <b>Wenn</b> er kommt, sage ich es dir." },
  "wenn-end": { tip: "wenn sets a condition and sends the conjugated verb to the end of its clause — and that verb still has to agree with its own subject.", ex: "Wenn die Kinder müde <b>werden</b>, gehen wir nach Hause." },
  "wenn-vorn": { tip: "The wenn-clause has taken position 1, so the main clause opens with the verb — subject second.", ex: "Wenn er anruft, <b>sage ich</b> es dir." },
  "wenn-immer": { tip: "Does this happen again and again, or once in the past? Repeated and general takes one word; a single past occasion takes the other.", ex: "<b>Als</b> ich zwanzig war, zog ich nach Hamburg. <em>(einmal, damals — also das andere)</em>" },
  "als-einmal": { tip: "Ask yourself whether this happened ONCE, at one point in the past, or again and again. Only one of the two words covers a single past occasion.", ex: "Immer <b>wenn</b> es regnet, nehme ich den Bus. <em>(wiederholt — also das andere Wort)</em>" },
  "als-praeteritum": { tip: "After als the verb normally stands in the Präteritum — and it goes to the end of the clause.", ex: "Als sie nach Berlin <b>zog</b>, war sie sehr jung." },
  "denn-wortstellung": { tip: "denn is not a Nebensatz word: after it nothing moves, the verb stays in second place.", ex: "Ich bleibe hier, denn ich <b>bin sehr müde</b>." },
  "deshalb-wortstellung": { tip: "deshalb is an adverb and takes position 1, so the verb must come directly after it.", ex: "Es ist spät. Deshalb <b>gehe ich</b> nach Hause." },

  /* ---- Perfekt und Präteritum ---- */
  "partizip-trennbar": { tip: "A separable verb puts ge- between the prefix and the stem, written as ONE word.", ex: "mitbringen → Ich habe Kuchen <b>mitgebracht</b>." },
  "partizip-untrennbar": { tip: "An inseparable prefix (be-, er-, ver-, ent-, ge-) means NO ge- in the participle.", ex: "erzählen → Er hat uns alles <b>erzählt</b>." },
  "partizip-ieren": { tip: "A verb ending in -ieren builds its participle with -iert and no ge-.", ex: "organisieren → Wir haben das Fest <b>organisiert</b>." },
  "perfekt-sein": { tip: "Movement from A to B, or a change of state, builds its Perfekt with sein rather than haben. So position 2 holds a form of sein — conjugated for this subject.", ex: "Sie <b>ist</b> nach Hamburg gefahren. · Wir <b>sind</b> früh aufgestanden." },
  "praet-sein-haben": { tip: "For sein and haben, everyday German uses the Präteritum rather than the Perfekt. It is ONE word — and it has to match the subject.", ex: "du <b>warst</b> gestern krank · ihr <b>hattet</b> Glück" },
  "praet-werden": { tip: "werden has its own one-word past form. It is not a Perfekt with geworden, and not the present.", ex: "du <b>wurdest</b> · ihr <b>wurdet</b> · wir <b>wurden</b> Nachbarn" },
  "praet-modal": { tip: "Modals go into the Präteritum, never the Perfekt. Take the stem, DROP the Umlaut, add -te — and remember that ich and er/sie/es are identical.", ex: "sollen → ich <b>sollte</b> · ihr <b>solltet</b> · wir <b>sollten</b>" },
  "praet-modal-infinitiv": { tip: "The modal is conjugated in position 2; the main verb stays an INFINITIVE at the end.", ex: "Ich konnte damals nicht <b>schwimmen</b>." },
  "koennte-vs-konnte": { tip: "One dot decides it. With an Umlaut it is the polite Konjunktiv II (could you, we could); without one it is the plain past (was able to). Read the English first.", ex: "Dasselbe Muster: <b>hatte</b> / <b>hätte</b> und <b>war</b> / <b>wäre</b>." },
  "haette-gern": { tip: "The polite request is built on the Konjunktiv II of haben — the form with an Umlaut, not the plain past and not the present.", ex: "Vergleiche: ich <b>habe</b> <em>(Präsens)</em> · ich <b>hatte</b> <em>(Präteritum)</em> · und höflich? Die Form mit Umlaut." },
  "waere": { tip: "This is the Konjunktiv II of sein — the polite, hypothetical form. The Umlaut is exactly what separates it from the plain past.", ex: "Dasselbe Muster: haben → <b>hätte</b> · können → <b>könnte</b> · sein → ?" },
  "sollte-form": { tip: "sollte is a modal: ich and er/sie/es share one form, and the other persons take the ordinary personal endings. Check who is being advised.", ex: "ich / er / sie <b>sollte</b> · ihr <b>solltet</b>" },
  "sollte-infinitiv": { tip: "sollte is a modal, so the other verb goes to the very end as an infinitive.", ex: "Du solltest mehr Wasser <b>trinken</b>." },
  "imperativ-du": { tip: "The du-Imperativ is the verb stem with no subject and no -st.", ex: "<b>Komm</b> bitte früher!" },

  /* ---- Fälle und Präpositionen ---- */
  "wechsel-wo": { tip: "Nothing is being moved, so the question is Wo? — and a Wechselpräposition answering Wo? takes the Dativ. Then put the article into the Dativ of that noun's gender.", ex: "Der Test: Bewegt sich etwas? <b>Nein</b> → Wo? → Dativ. <b>Ja</b> → Wohin? → Akkusativ." },
  "wechsel-wohin": { tip: "Something is being moved and ends up somewhere — the question is Wohin? — so the Wechselpräposition takes the Akkusativ.", ex: "Ich stelle eine Flasche auf <b>einen</b> Tisch. · Ich lege es in <b>meine</b> Tasche." },
  "positionsverb": { tip: "Wo? needs a position verb, and German picks it by shape: flat things lie, upright things stand, a key in a lock is wedged, a picture hangs, a person sits.", ex: "Der Teller <b>liegt</b> auf dem Tisch. · Die Katze <b>sitzt</b> auf dem Stuhl." },
  "richtungsverb": { tip: "For Wohin? you need the moving twin: legen, stellen, setzen, stecken, hängen.", ex: "Ich <b>stelle</b> die Tasse auf den Tisch." },
  "dativ-plural-n": { tip: "The Dativ Plural marks itself twice: once on the article or possessive, and once on the NOUN, which takes an extra -n unless it already ends in -n or -s.", ex: "mit <b>ihren</b> Freund<b>en</b> · bei <b>deinen</b> Nachbar<b>n</b> · aber: mit <b>ihren</b> Auto<b>s</b>" },
  "direktionaladverb": { tip: "hier, da and dort answer Wo?. To answer Wohin? each of them needs -hin on the end.", ex: "<b>hierhin</b> = an diese Stelle · <b>dorthin</b> = an jene Stelle" },
  "kurzform": { tip: "Spoken German has one short word for each direction — in, out, up, down, across. They behave like separable prefixes and sit at the end of the sentence.", ex: "Kannst du mal <b>runter</b>kommen? · Ich komme gleich <b>rüber</b>." },
  "feste-praep-dativ": { tip: "aus, bei, mit, nach, seit, von and zu always take the Dativ — there is never a choice. So put the article into the Dativ form of that noun's gender.", ex: "aus <b>einem</b> Dorf · bei <b>unserer</b> Tante · nach <b>diesem</b> Film" },
  "feste-praep-akk": { tip: "durch, für, gegen, ohne, um always take the Akkusativ.", ex: "Das ist für <b>meinen</b> Bruder." },
  "zu-vs-in": { tip: "Where are you going? To a PERSON or a practice is one preposition; INTO a building or a room is another, with the Akkusativ.", ex: "<b>nach</b> Berlin <em>(Stadt oder Land — ein drittes Wort)</em>" },
  "nach-stadt": { tip: "A town or a country without an article takes its own preposition — not the one for people, and not the one for going into a building.", ex: "<b>zu</b> meiner Schwester <em>(Person)</em> · <b>ins</b> Kino <em>(Gebäude)</em> · und eine Stadt? Ein drittes Wort." },
  "von-dativ": { tip: "Everyday German replaces the genitive with a preposition, and that preposition always takes the Dativ — so whatever follows it carries a Dativ ending.", ex: "Vergleiche: <b>Tims</b> Mutter <em>(Genitiv, eher schriftlich)</em> — und gesprochen? Präposition + Dativ." },
  "vom-kontraktion": { tip: "von and dem never stand next to each other — they contract into a single word. The same happens across this whole family of prepositions.", ex: "zu + dem = <b>zum</b> Arzt · zu + der = <b>zur</b> Schule · bei + dem = <b>beim</b> Essen" },
  "von-name": { tip: "With a name there are two ways to say it: the written genitive with -s, and the everyday one with a preposition. This sentence uses the everyday one.", ex: "<b>Annas</b> Hund = der Hund … Anna" },
  "halten-von": { tip: "halten is one of the verbs with a fixed preposition, and the German choice does not follow the English of. Learn it as one block: verb + Präposition + Kasus.", ex: "Jedes Verb hat seine eigene: <b>denken an</b> + Akk. · <b>warten auf</b> + Akk. · <b>Angst haben vor</b> + Dat." },
  "zu-anlass": { tip: "Occasions and festivals take zu: zum Geburtstag, zu Weihnachten, zur Hochzeit.", ex: "<b>Zur</b> Hochzeit schenken wir Geld." },
  "am-tag": { tip: "Days and dates, months and seasons, and clock times each take a different preposition. Decide first which of the three you have.", ex: "<b>Im</b> Juli fahren wir weg, und <b>um</b> sieben geht der Zug." },
  "ab-dativ": { tip: "A starting point that runs on into the future has its own preposition, and it takes the Dativ. It is not the one that looks back to the past, and not the one that needs bis.", ex: "Vergleiche: <b>seit</b> Montag <em>(schon vorbei bis jetzt)</em> · <b>von</b> Montag <b>bis</b> Freitag <em>(ein Zeitraum)</em>." },
  "seit-dativ": { tip: "seit takes the Dativ, so a plural noun gets its -n — and German keeps the PRESENT tense.", ex: "Ich lerne seit zwei <b>Monaten</b> Deutsch." },
  "n-deklination": { tip: "A small group of masculine nouns adds -n outside the Nominativ: Nachbar, Kollege, Junge, Mensch, Student, Name.", ex: "Ich habe den Kolleg<b>en</b> gefragt." },
  "herrn": { tip: "Herr belongs to the small n-group of masculine nouns: outside the Nominativ it takes an ending.", ex: "der Kollege → Ich frage den Kolleg<b>en</b>. · der Student → mit dem Student<b>en</b>" },

  /* ---- Dativ, Akkusativ, Objekte ---- */
  "possessiv-dativ-m": { tip: "Dativ, masculine or neuter: the possessive takes -em. Ask Wem? — the person who receives is the word that changes.", ex: "Ich zeige <b>deinem</b> Bruder die Fotos. · Ich helfe <b>seinem</b> Kind." },
  "possessiv-dativ-f": { tip: "Dativ, feminine: the possessive takes -er. Ask Wem? to find which word has to change — it is the person who receives.", ex: "Ich helfe <b>unserer</b> Nachbarin. · Ich schreibe <b>ihrer</b> Mutter." },
  "possessiv-dativ-pl": { tip: "Dativ Plural: the possessive takes -en — and the noun adds an -n of its own as well.", ex: "Ich schreibe <b>ihren</b> Freund<b>en</b>. · Ich helfe <b>deinen</b> Eltern." },
  "possessiv-euer": { tip: "euer is the awkward one: as soon as an ending is added, the second e drops out. The form is shorter than you expect.", ex: "euer Sohn → <b>euren</b> Sohn · euer Kind → <b>eurem</b> Kind" },
  "possessiv-unser": { tip: "unser, unlike euer, keeps its e and simply adds the ending on top of it.", ex: "unser Sohn → <b>unseren</b> Sohn · unser Kind → <b>unserem</b> Kind" },
  "objekt-akk-pronomen": { tip: "The default is person before thing. But the moment the THING is a pronoun it overtakes everything: the Akkusativpronomen comes first.", ex: "Ich zeige <b>sie ihm</b> morgen. · Ich erkläre <b>es euch</b> später." },
  "objekt-dativ-vor-akk": { tip: "Two nouns, or a pronoun person plus a noun thing: Dativ (person) comes before Akkusativ (thing).", ex: "Ich kaufe <b>meinem Sohn ein Buch</b>." },
  "dativverb": { tip: "gefallen, helfen, passen, gehören, schmecken and wehtun put the PERSON in the Dativ and make the thing the subject. So ask Wem?, never Wen?", ex: "Das Hemd gefällt <b>ihm</b> nicht. · Kannst du <b>uns</b> helfen?" },
  "reflexiv-akk": { tip: "The reflexive pronoun just repeats the subject — same person, same number. Find the subject first, then match it.", ex: "<b>ihr</b> → Ihr trefft <b>euch</b> um acht." },
  "reflexiv-dativ": { tip: "The sentence already has an accusative object (die Hände, den Fuß, die Zähne), so the reflexive pronoun moves into the Dativ. Only the ich- and du-forms actually look different.", ex: "<b>du</b> → Zieh <b>dir</b> eine Jacke an." },
  "reflexiv-modal": { tip: "With a modal the pronoun follows the conjugated verb, and the reflexive verb goes to the end as an infinitive.", ex: "Du musst <b>dich</b> besser <b>konzentrieren</b>." },

  /* ---- Verben mit Präpositionen ---- */
  "vp-fuer": { tip: "sich interessieren carries one fixed preposition, and the English equivalent is no guide to it at all. Learn the block: Verb + Präposition + Kasus — this one with the Akkusativ.", ex: "Vergleiche: warten <b>auf</b> + Akkusativ · sich erkundigen <b>nach</b> + Dativ" },
  "vp-warten-auf": { tip: "warten has one fixed preposition, and it is not the English for. The block takes the Akkusativ.", ex: "Vergleiche: sich interessieren <b>für</b> + Akkusativ · Angst haben <b>vor</b> + Dativ" },
  "vp-freuen-auf": { tip: "sich freuen takes two different prepositions and the difference is TIME. This one points forward, to something that has not happened yet.", ex: "Ich freue mich <b>über</b> das Geschenk. <em>(schon passiert — also das andere)</em>" },
  "vp-freuen-ueber": { tip: "sich freuen takes two different prepositions, split by time. This one is about something that has ALREADY happened.", ex: "Ich freue mich <b>auf</b> den Urlaub. <em>(kommt noch — also das andere)</em>" },
  "vp-angst-vor": { tip: "Angst haben carries a fixed preposition, and that preposition takes the Dativ — so the article after it is a Dativ one.", ex: "Sie hat Angst vor <b>Hunden</b>. <em>(Dativ Plural, mit -n)</em>" },
  "vp-denken-an": { tip: "denken carries a fixed preposition, and it is not the English about. Learn the whole block: verb + Präposition + Kasus.", ex: "Jedes Verb hat seine eigene: sich interessieren <b>für</b> · warten <b>auf</b> · Angst haben <b>vor</b>" },
  "vp-teilnehmen-an": { tip: "teilnehmen takes an + DATIV.", ex: "Sie nimmt <b>an</b> dem Seminar teil." },
  "wo-r-sache": { tip: "For a THING, the question is wo + preposition, with an r inserted before a vowel: worauf, worüber, woran — but wofür, womit.", ex: "<b>Womit</b> fährst du zur Arbeit?" },
  "da-r-antwort": { tip: "The short answer mirrors the question with da-: darauf, darüber, daran, dafür, damit.", ex: "<b>Damit</b> bin ich einverstanden." },
  "praep-wen-person": { tip: "This is a PERSON, so the wo(r)- forms are wrong. Keep the verb's own preposition and follow it with the question word for people — Akkusativ or Dativ, whichever that preposition takes.", ex: "<b>Für wen</b> ist das Geschenk? · <b>Von wem</b> ist der Brief?" },

  /* ---- Pronomen, Artikel, Adjektive ---- */
  "indef-nom-m": { tip: "Standing alone, ein shows the ending that der has. Mind the case: this is the Nominativ — the thing that IS somewhere, not the thing you take.", ex: "das Glas → Hier ist <b>eins</b>. · die Tasse → Hier ist <b>eine</b>." },
  "indef-akk-m": { tip: "With the noun dropped, ein has to carry the ending the article would have shown. This is the Akkusativ, masculine — so which ending does den have?", ex: "das Ei → Ich nehme <b>eins</b>. · die Gabel → Ich nehme <b>eine</b>." },
  "indef-neutrum": { tip: "Neuter is the one everybody forgets: standing alone the pronoun does NOT stay bare. It takes the same ending that das itself ends in.", ex: "der Stuhl → Dort steht <b>einer</b>. · die Lampe → Ich habe <b>eine</b>." },
  "indef-fem": { tip: "Feminine is the easy one: standing alone the pronoun looks exactly as it does in front of a noun, in both Nominativ and Akkusativ.", ex: "der Löffel → Ich habe <b>keinen</b>. · das Messer → Ich habe <b>keins</b>." },
  "indef-plural": { tip: "ein has no plural at all, so the positive plural pronoun is a different word altogether — and it is neither eine nor einige.", ex: "Der Negativ ist dagegen regelmäßig: Haben wir Eier? — Nein, wir haben <b>keine</b>." },
  "adj-ein-nom-m": { tip: "After ein (which shows nothing), the adjective has to show the gender: masculine Nominativ → -er.", ex: "Das ist ein neu<b>er</b> Computer." },
  "adj-ein-akk-m": { tip: "Masculine Akkusativ after einen → the adjective ends in -en.", ex: "Ich suche einen günstig<b>en</b> Flug." },
  "adj-ein-neutrum": { tip: "Neuter after ein → the adjective ends in -es.", ex: "Wir haben ein groß<b>es</b> Problem." },
  "adj-ein-fem": { tip: "Feminine after eine → the adjective ends in -e.", ex: "Sie hat eine gut<b>e</b> Idee." },
  "adj-dativ": { tip: "In the Dativ the adjective ends in -en for every gender. It is the easiest case.", ex: "Mit kalt<b>em</b> Wasser geht das besser." },
  "adj-praedikativ": { tip: "An adjective AFTER the verb takes no ending at all.", ex: "Der Film war <b>langweilig</b>." },
  "artikel-ung": { tip: "The ending of the noun gives the gender away. -ung, -heit, -keit, -schaft and -ion all point the same way, and it is neither der nor das.", ex: "Dieselbe Endung, derselbe Artikel: <b>eine</b> Wohnung, <b>meine</b> Rechnung, <b>keine</b> Information." },

  /* ---- Mengen und Häufigkeit ---- */
  "menge-kein-von": { tip: "German puts no von between the measure and what is measured — the two nouns simply stand together.", ex: "Ich kaufe eine Flasche <b>Öl</b>." },
  "viel-viele": { tip: "Can you count it? Coffee, work, time and money cannot; eggs, appointments and people can. The two forms are one letter apart.", ex: "<b>viele</b> Eier · <b>viele</b> Termine · aber <b>wenig</b> Geld" },
  "haeufigkeit": { tip: "There is a scale from 100% down to 0%, and the English sentence tells you where on it you are. The 0% word is already negative and needs no second negation.", ex: "<b>immer</b> 100% → <b>oft</b> 70% → <b>manchmal</b> 40% → … 0%" },
  "haeufigkeit-pos1": { tip: "A frequency word can take position 1 — and then the verb still has to come second, before the subject.", ex: "<b>Oft koche ich</b> am Wochenende." },
  "wochentag-s": { tip: "A weekday with -s means every such day: montags, dienstags, sonntags.", ex: "<b>Freitags</b> arbeite ich nur bis zwei." }
};

export function hintFor(rule) {
  return HINTS[rule] || null;
}

/* ------------------------------------------------------------------ */
/* Das Lernmaterial                                                    */
/* ------------------------------------------------------------------ */

/*
 * Where every layer came from. The chapter spine and the Lernschritt headings
 * are Schritte plus Neu 3; the `deepen` blocks name their own source, and
 * these are the editions they were taken from.
 */
export const SOURCES = [
  {
    name: "Schritte plus Neu 3 (A2.1)",
    pub: "Hueber Verlag",
    role: "Der Aufbau dieses Kurses: Lektion 1–7, die Lernschritte A–E und die Grammatik jedes Schritts.",
    url: "https://www.hueber.de/schritte-plus-neu"
  },
  {
    name: "Schritte plus Neu 3 — Unterrichtsplan",
    pub: "Hueber Verlag (kostenlos)",
    role: "Die Lernziele und Grammatiküberschriften Lektion für Lektion, wörtlich übernommen.",
    url: "https://www.hueber.de/schritte-plus-neu/unterrichten"
  },
  {
    name: "Menschen A2 — Stoffverteilungsplan",
    pub: "Hueber Verlag (kostenlos)",
    role: "Die Vertiefungen: deshalb, Adjektivdeklination, Konjunktiv II könnte, als, Stellung der Objekte.",
    url: "https://www.hueber.de/menschen"
  },
  {
    name: "Netzwerk neu A2.1",
    pub: "Klett Sprachen",
    role: "Gegenprobe zur Reihenfolge der Themen auf A2.1.",
    url: "https://www.klett-sprachen.de/netzwerk-neu-a2-1/t-1/9783126071628"
  },
  {
    name: "Goethe-Zertifikat A2 — Prüfungsziele und Wortliste",
    pub: "Goethe-Institut (kostenlos)",
    role: "Prüfung, ob eine Struktur wirklich zu A2 gehört — und der Wortschatzrahmen.",
    url: "https://www.goethe.de/de/spr/kup/prf/prf/gzsd2.html"
  },
  {
    name: "mein-deutschbuch.de",
    pub: "frei im Netz",
    role: "Die Listen: Verben mit Präpositionen, Dativverben, n-Deklination.",
    url: "https://mein-deutschbuch.de/praepositionalergaenzung.html"
  },
  {
    name: "Nico's Weg A2",
    pub: "Deutsche Welle (kostenlos)",
    role: "Zum Weiterüben: dieselben A2-Strukturen als Video-Kurs mit Übungen.",
    url: "https://learngerman.dw.com/de/nicos-weg/c-36519687"
  }
];

/* ------------------------------------------------------------------ */
/* Export                                                              */
/* ------------------------------------------------------------------ */

export const COURSE = [L1, L2, L3, L4, L5, L6, L7];

export function lektionByNr(nr) {
  return COURSE.find((l) => l.nr === Number(nr)) || null;
}

/*
 * Which chapters teach a given Themen card. This is what makes the two halves
 * of the Grammatik screen reciprocal: the course links out to the reference,
 * and the reference links back to the chapters that drill the structure.
 */
export function lektionenForTopic(topicId) {
  const out = [];
  COURSE.forEach((l) => {
    l.steps.forEach((s) => {
      if (s.topic === topicId) out.push({ nr: l.nr, title: l.title, letter: s.letter });
    });
  });
  return out;
}

/** How many gaps a chapter's test has — the chapter list shows it. */
export function gapCount(lektion) {
  return lektion.test.reduce(
    (n, item) => n + item.parts.filter((p) => typeof p !== "string").length,
    0
  );
}
