// A2 grammar reference — the topics the speaking practice actually tests you on.
//
// Explanations are in English on purpose: at A2 a German explanation of German
// grammar costs more than it teaches. Every example sentence is German with a
// literal-ish English gloss, and `watch` names the mistake learners actually
// make, not the abstract rule.
//
// `id` values are referenced from vocab entries, so a word can point at the
// structure it demonstrates.

export const GRAMMAR = [
  {
    id: "praesens",
    name: "Präsens",
    short: "Present tense",
    tone: "var(--t-alltag)",
    summary: "The default tense. German uses it for what is happening now AND for the near future — there is no separate 'I am going' form.",
    pattern: "ich mach·e · du mach·st · er/sie/es mach·t · wir mach·en · ihr mach·t · sie/Sie mach·en",
    examples: [
      { de: "Ich wohne in Friedrichshafen.", en: "I live in Friedrichshafen." },
      { de: "Du arbeitest zu viel.", en: "You work too much." },
      { de: "Er kommt aus Italien.", en: "He comes from Italy." },
      { de: "Wir lernen jeden Tag Deutsch.", en: "We learn German every day." },
      { de: "Morgen fahre ich nach München.", en: "Tomorrow I'm going to Munich. (present form, future meaning)" }
    ],
    watch: "Some verbs change their stem vowel for du and er/sie/es: fahren → du fährst, er fährt; essen → du isst, er isst; lesen → du liest, er liest."
  },
  {
    id: "perfekt",
    name: "Perfekt",
    short: "Present perfect — the spoken past",
    tone: "var(--t-essen)",
    summary: "This is how Germans talk about the past in conversation. Two parts: haben or sein in position 2, and the participle at the very END of the sentence.",
    pattern: "haben/sein + … + Partizip II (at the end)",
    examples: [
      { de: "Ich habe einen Apfel gegessen.", en: "I ate an apple." },
      { de: "Wir haben gestern Fußball gespielt.", en: "We played football yesterday." },
      { de: "Ich bin nach Berlin gefahren.", en: "I went to Berlin." },
      { de: "Sie ist um sieben Uhr aufgestanden.", en: "She got up at seven." },
      { de: "Hast du das Buch gelesen?", en: "Have you read the book?" }
    ],
    watch: "The participle goes LAST, however long the sentence gets. 'Ich habe gegessen einen Apfel' is the single most common English-speaker mistake."
  },
  {
    id: "haben-sein",
    name: "haben oder sein?",
    short: "Which auxiliary in the Perfekt",
    tone: "var(--t-freizeit)",
    summary: "Most verbs take haben. Use sein for verbs of MOVEMENT from A to B (gehen, fahren, fliegen, kommen), for CHANGE OF STATE (aufstehen, aufwachen, werden, wachsen), and for sein and bleiben themselves.",
    pattern: "sein → Bewegung / Veränderung · haben → alles andere",
    examples: [
      { de: "Ich bin ins Kino gegangen.", en: "I went to the cinema. (movement → sein)" },
      { de: "Der Zug ist pünktlich angekommen.", en: "The train arrived on time. (movement → sein)" },
      { de: "Ich bin krank geworden.", en: "I got ill. (change of state → sein)" },
      { de: "Ich bin zu Hause geblieben.", en: "I stayed at home. (bleiben → sein)" },
      { de: "Ich habe zu Hause gearbeitet.", en: "I worked at home. (no movement → haben)" }
    ],
    watch: "'Ich habe gegangen' is wrong — gehen is movement, so it needs bin. If you can draw an arrow from one place to another, think sein."
  },
  {
    id: "partizip",
    name: "Partizip II",
    short: "Forming the past participle",
    tone: "var(--t-reisen)",
    summary: "Regular (weak) verbs: ge- + stem + -t. Irregular (strong) verbs: ge- + stem (often a changed vowel) + -en. Two groups take NO ge-: verbs ending in -ieren, and verbs with an inseparable prefix (be-, ver-, er-, ent-, ge-).",
    pattern: "machen → gemacht · gehen → gegangen · studieren → studiert · verstehen → verstanden",
    examples: [
      { de: "Ich habe die Küche geputzt.", en: "I cleaned the kitchen. (weak: ge-…-t)" },
      { de: "Ich habe ein Buch gelesen.", en: "I read a book. (strong: ge-…-en)" },
      { de: "Sie hat Medizin studiert.", en: "She studied medicine. (-ieren → no ge-)" },
      { de: "Ich habe alles verstanden.", en: "I understood everything. (ver- → no ge-)" },
      { de: "Ich habe die Tür geöffnet.", en: "I opened the door." }
    ],
    watch: "Separable verbs put the ge- in the MIDDLE: aufstehen → aufgestanden, einkaufen → eingekauft, anrufen → angerufen."
  },
  {
    id: "trennbar",
    name: "Trennbare Verben",
    short: "Separable verbs",
    tone: "var(--t-familie)",
    summary: "Verbs like aufstehen, einkaufen, anrufen split in a main clause: the verb is conjugated in position 2 and the prefix jumps to the END.",
    pattern: "aufstehen → ich stehe … auf",
    examples: [
      { de: "Ich stehe um sieben Uhr auf.", en: "I get up at seven." },
      { de: "Ich rufe meine Mutter an.", en: "I'm calling my mother." },
      { de: "Wir kaufen am Samstag ein.", en: "We shop on Saturday." },
      { de: "Der Zug fährt um neun Uhr ab.", en: "The train departs at nine." },
      { de: "Machst du bitte das Fenster zu?", en: "Would you close the window?" }
    ],
    watch: "The prefix stays attached in the Perfekt participle (aufgestanden) and in a Nebensatz (…, weil ich früh aufstehe)."
  },
  {
    id: "modalverben",
    name: "Modalverben",
    short: "können, müssen, wollen, dürfen, sollen, möchten",
    tone: "var(--t-wohnen)",
    summary: "The modal is conjugated in position 2; the main verb goes to the END as an INFINITIVE. Note the odd ich-form: ich kann, ich muss, ich will — no -e ending.",
    pattern: "Modalverb (Position 2) + … + Infinitiv (Ende)",
    examples: [
      { de: "Ich kann gut schwimmen.", en: "I can swim well." },
      { de: "Ich muss heute länger arbeiten.", en: "I have to work longer today." },
      { de: "Wir wollen am Wochenende wandern.", en: "We want to hike at the weekend." },
      { de: "Hier darf man nicht parken.", en: "You're not allowed to park here." },
      { de: "Ich möchte einen Kaffee bestellen.", en: "I'd like to order a coffee." }
    ],
    watch: "ich kann / du kannst / er kann — the ich and er forms are identical and take no ending. Same for muss, will, darf, mag."
  },
  {
    id: "wortstellung",
    name: "Wortstellung: Verb an Position 2",
    short: "The verb-second rule",
    tone: "var(--t-wetter)",
    summary: "In a German main clause the finite verb is ALWAYS the second element. 'Element' means one block of meaning, not one word — 'Meine ganze Familie' is a single element.",
    pattern: "[Element 1] [VERB] [rest]",
    examples: [
      { de: "Ich trinke jeden Morgen Kaffee.", en: "I drink coffee every morning." },
      { de: "Meine ganze Familie wohnt in Berlin.", en: "My whole family lives in Berlin. (4 words, one element)" },
      { de: "Am Wochenende gehe ich schwimmen.", en: "At the weekend I go swimming." },
      { de: "Heute habe ich viel Zeit.", en: "Today I have a lot of time." },
      { de: "Nach der Arbeit bin ich müde.", en: "After work I'm tired." }
    ],
    watch: "This is the rule the practice mode checks most often. Count elements, not words."
  },
  {
    id: "inversion",
    name: "Inversion",
    short: "When the sentence starts with something else",
    tone: "var(--t-koerper)",
    summary: "If you begin with a time or place instead of the subject, the verb still has to be second — so the subject moves BEHIND the verb. English doesn't do this, which is why it feels wrong at first.",
    pattern: "Gestern + [VERB] + ich + …",
    examples: [
      { de: "Gestern bin ich ins Kino gegangen.", en: "Yesterday I went to the cinema." },
      { de: "Am Montag habe ich keine Zeit.", en: "On Monday I have no time." },
      { de: "In Deutschland trinkt man viel Kaffee.", en: "In Germany people drink a lot of coffee." },
      { de: "Um acht Uhr fängt der Kurs an.", en: "The course starts at eight." },
      { de: "Deshalb bleibe ich heute zu Hause.", en: "That's why I'm staying home today." }
    ],
    watch: "'Gestern ich bin gegangen' is wrong. After a time phrase the verb comes first, THEN the subject."
  },
  {
    id: "nebensatz",
    name: "Nebensatz",
    short: "Subordinate clauses: weil, dass, wenn",
    tone: "var(--t-arbeit)",
    summary: "After weil, dass, wenn, ob, obwohl, damit the conjugated verb moves to the very END of that clause. Always a comma before the conjunction.",
    pattern: "…, weil + Subjekt + … + VERB.",
    examples: [
      { de: "Ich bleibe zu Hause, weil ich krank bin.", en: "I'm staying home because I'm ill." },
      { de: "Ich glaube, dass er morgen kommt.", en: "I think he's coming tomorrow." },
      { de: "Wenn es regnet, bleibe ich zu Hause.", en: "If it rains, I stay home." },
      { de: "Ich weiß nicht, ob sie Zeit hat.", en: "I don't know whether she has time." },
      { de: "Ich lerne Deutsch, weil ich in Deutschland wohne.", en: "I'm learning German because I live in Germany." }
    ],
    watch: "In the Perfekt BOTH verbs go to the end, auxiliary last: '…, weil ich zu viel gegessen habe.'"
  },
  {
    id: "konjunktionen",
    name: "und, aber, oder, denn",
    short: "Conjunctions that change nothing",
    tone: "var(--t-schule)",
    summary: "These five (und, aber, oder, denn, sondern) join two main clauses and do NOT move the verb. They sit in 'position zero', outside the count.",
    pattern: "Hauptsatz + und/aber/oder/denn + Hauptsatz (normal word order)",
    examples: [
      { de: "Ich koche und du deckst den Tisch.", en: "I cook and you set the table." },
      { de: "Ich bin müde, aber ich muss noch arbeiten.", en: "I'm tired, but I still have to work." },
      { de: "Wir bleiben zu Hause, denn es regnet.", en: "We're staying home, because it's raining." },
      { de: "Möchtest du Tee oder trinkst du lieber Kaffee?", en: "Would you like tea or do you prefer coffee?" },
      { de: "Das ist kein Tee, sondern Kaffee.", en: "That's not tea, but coffee." }
    ],
    watch: "Compare with weil: 'denn es regnet' (verb second) vs 'weil es regnet' (verb last). Same meaning, different word order."
  },
  {
    id: "akkusativ",
    name: "Akkusativ",
    short: "The direct-object case",
    tone: "var(--t-kleidung)",
    summary: "The thing the action happens to. Only the masculine article changes: der → den, ein → einen. Feminine, neuter and plural look exactly like the Nominativ.",
    pattern: "der → den · die → die · das → das · die (pl) → die",
    examples: [
      { de: "Ich sehe den Mann.", en: "I see the man. (masculine → den)" },
      { de: "Ich kaufe einen Apfel.", en: "I'm buying an apple. (masculine → einen)" },
      { de: "Ich lese die Zeitung.", en: "I'm reading the newspaper. (feminine → unchanged)" },
      { de: "Ich trinke das Wasser.", en: "I'm drinking the water. (neuter → unchanged)" },
      { de: "Ich brauche einen neuen Computer.", en: "I need a new computer." }
    ],
    watch: "If only one article changes, it's the masculine one. Learn 'den/einen' and most of the Akkusativ is done."
  },
  {
    id: "dativ",
    name: "Dativ",
    short: "The indirect-object case",
    tone: "var(--t-stadt)",
    summary: "Used for the receiver of an action, after certain verbs (helfen, danken, gefallen, gehören), and after the Dativ prepositions.",
    pattern: "der → dem · die → der · das → dem · die (pl) → den + -n",
    examples: [
      { de: "Ich helfe meinem Bruder.", en: "I help my brother." },
      { de: "Ich gebe der Frau das Buch.", en: "I give the woman the book." },
      { de: "Das Haus gehört meinen Eltern.", en: "The house belongs to my parents." },
      { de: "Die Stadt gefällt mir sehr.", en: "I like the city very much. (literally: the city pleases me)" },
      { de: "Ich fahre mit dem Bus.", en: "I go by bus." }
    ],
    watch: "helfen, danken, gefallen, gehören, passen take the Dativ even though English treats them as direct objects."
  },
  {
    id: "praepositionen",
    name: "Präpositionen",
    short: "Which case after which preposition",
    tone: "var(--t-zeit)",
    summary: "Some prepositions always take the Akkusativ, some always the Dativ, and the two-way ones take Akkusativ for movement (wohin?) and Dativ for location (wo?).",
    pattern: "Akk: für, ohne, gegen, um, durch · Dat: mit, nach, aus, bei, seit, von, zu · Wechsel: in, an, auf, über, unter, vor, hinter, neben, zwischen",
    examples: [
      { de: "Das Geschenk ist für meinen Vater.", en: "The present is for my father. (für → Akk)" },
      { de: "Ich fahre mit dem Zug.", en: "I travel by train. (mit → Dat)" },
      { de: "Ich gehe in die Stadt.", en: "I'm going into town. (movement → Akk)" },
      { de: "Ich bin in der Stadt.", en: "I'm in town. (location → Dat)" },
      { de: "Nach der Arbeit gehe ich nach Hause.", en: "After work I go home." }
    ],
    watch: "wohin? → Akkusativ (ich gehe ins Kino). wo? → Dativ (ich bin im Kino)."
  },
  {
    id: "negation",
    name: "nicht oder kein?",
    short: "The two ways to say no",
    tone: "var(--t-natur)",
    summary: "kein negates a noun that has ein or no article. nicht negates everything else — verbs, adjectives, whole sentences, and nouns with a definite article.",
    pattern: "kein + Nomen (ein/kein Artikel) · nicht + alles andere",
    examples: [
      { de: "Ich habe kein Auto.", en: "I don't have a car. (ein Auto → kein Auto)" },
      { de: "Ich trinke keinen Kaffee.", en: "I don't drink coffee. (no article → kein)" },
      { de: "Ich kenne den Mann nicht.", en: "I don't know the man. (definite article → nicht)" },
      { de: "Das ist nicht richtig.", en: "That's not right. (adjective → nicht)" },
      { de: "Ich komme heute nicht.", en: "I'm not coming today." }
    ],
    watch: "nicht usually goes at the end, but BEFORE an adjective, a separable prefix or a participle: 'Ich bin nicht gekommen.'"
  },
  {
    id: "possessiv",
    name: "Possessivartikel",
    short: "mein, dein, sein, ihr …",
    tone: "var(--t-technik)",
    summary: "They take the same endings as ein/kein. The stem tells you the owner; the ending tells you the case and gender of the thing owned.",
    pattern: "ich → mein · du → dein · er → sein · sie → ihr · wir → unser · ihr → euer · sie/Sie → ihr/Ihr",
    examples: [
      { de: "Mein Bruder wohnt in Hamburg.", en: "My brother lives in Hamburg." },
      { de: "Meine Schwester ist Ärztin.", en: "My sister is a doctor. (feminine → -e)" },
      { de: "Ich suche meinen Schlüssel.", en: "I'm looking for my key. (masc. Akk → -en)" },
      { de: "Wie heißt deine Freundin?", en: "What's your girlfriend's name?" },
      { de: "Das ist ihr Auto.", en: "That's her car." }
    ],
    watch: "sein = his, ihr = her. They refer to the OWNER, not to the thing owned: 'sein Schwester' is wrong — it's seine Schwester."
  },
  {
    id: "pronomen",
    name: "Personalpronomen",
    short: "mich/mir, dich/dir, ihn/ihm …",
    tone: "var(--t-gefuehle)",
    summary: "Pronouns change with the case too. Akkusativ for direct objects, Dativ for receivers and after Dativ verbs and prepositions.",
    pattern: "ich → mich/mir · du → dich/dir · er → ihn/ihm · sie → sie/ihr · wir → uns/uns",
    examples: [
      { de: "Kannst du mir helfen?", en: "Can you help me? (helfen → Dativ)" },
      { de: "Ich rufe dich morgen an.", en: "I'll call you tomorrow. (Akkusativ)" },
      { de: "Ich sehe ihn jeden Tag.", en: "I see him every day. (Akkusativ)" },
      { de: "Das Buch gehört mir.", en: "The book belongs to me. (Dativ)" },
      { de: "Wir treffen uns um acht.", en: "We're meeting at eight." }
    ],
    watch: "'Kannst du mich helfen' is wrong. helfen always takes mir/dir/ihm, never mich/dich/ihn."
  },
  {
    id: "reflexiv",
    name: "Reflexive Verben",
    short: "sich freuen, sich waschen …",
    tone: "var(--t-verben)",
    summary: "Some German verbs need a reflexive pronoun where English uses none. The pronoun normally comes straight after the conjugated verb.",
    pattern: "ich freue mich · du freust dich · er freut sich · wir freuen uns",
    examples: [
      { de: "Ich freue mich auf das Wochenende.", en: "I'm looking forward to the weekend." },
      { de: "Wir treffen uns am Bahnhof.", en: "We're meeting at the station." },
      { de: "Setz dich bitte!", en: "Please sit down." },
      { de: "Ich habe mich sehr geärgert.", en: "I was really annoyed." },
      { de: "Interessierst du dich für Sport?", en: "Are you interested in sport?" }
    ],
    watch: "In the Perfekt the pronoun stays near the front: 'Ich habe mich gewaschen', not 'Ich habe gewaschen mich'."
  },
  {
    id: "imperativ",
    name: "Imperativ",
    short: "Giving instructions",
    tone: "var(--t-adjektive)",
    summary: "du-form: drop the -st ending and the pronoun. ihr-form: like the normal ihr form. Sie-form: verb first, then Sie.",
    pattern: "du: Komm! · ihr: Kommt! · Sie: Kommen Sie!",
    examples: [
      { de: "Komm bitte um acht!", en: "Please come at eight." },
      { de: "Mach das Fenster zu!", en: "Close the window." },
      { de: "Sprechen Sie bitte langsam!", en: "Please speak slowly." },
      { de: "Nehmt eure Bücher mit!", en: "Bring your books. (ihr)" },
      { de: "Sei bitte ruhig!", en: "Please be quiet. (sein is irregular)" }
    ],
    watch: "Add bitte to soften it — a bare imperative sounds blunt in German too."
  },
  {
    id: "komparativ",
    name: "Komparativ & Superlativ",
    short: "bigger, biggest",
    tone: "var(--t-kommunikation)",
    summary: "Add -er to compare and am …-sten for the top. Short adjectives often take an Umlaut. Use als for 'than'.",
    pattern: "klein → kleiner → am kleinsten · groß → größer → am größten",
    examples: [
      { de: "Mein Bruder ist größer als ich.", en: "My brother is taller than me." },
      { de: "Heute ist es wärmer als gestern.", en: "Today it's warmer than yesterday." },
      { de: "Das ist das beste Restaurant hier.", en: "That's the best restaurant here." },
      { de: "Im Winter ist es am kältesten.", en: "It's coldest in winter." },
      { de: "Ich trinke lieber Tee als Kaffee.", en: "I prefer tea to coffee." }
    ],
    watch: "Irregulars worth memorising: gut → besser → am besten, viel → mehr → am meisten, gern → lieber → am liebsten."
  },
  {
    id: "fragen",
    name: "Fragen",
    short: "W-questions and yes/no questions",
    tone: "var(--t-geld)",
    summary: "Yes/no question: put the verb FIRST. W-question: question word first, verb second.",
    pattern: "Kommst du? · Wann kommst du?",
    examples: [
      { de: "Hast du morgen Zeit?", en: "Do you have time tomorrow?" },
      { de: "Wohnst du in Berlin?", en: "Do you live in Berlin?" },
      { de: "Wann beginnt der Kurs?", en: "When does the course start?" },
      { de: "Wo ist der Bahnhof?", en: "Where is the station?" },
      { de: "Warum bist du nicht gekommen?", en: "Why didn't you come?" }
    ],
    watch: "German has no 'do' helper. 'Do you live here?' is simply 'Wohnst du hier?'"
  },
  {
    id: "praeteritum",
    name: "Präteritum",
    short: "The written past — and war/hatte",
    tone: "var(--t-alltag)",
    summary: "Mostly used in writing, BUT for sein, haben and the modals everyone uses the Präteritum in speech too. Learn war, hatte, konnte, musste and use Perfekt for everything else.",
    pattern: "ich war · ich hatte · ich konnte · ich musste · ich wollte",
    examples: [
      { de: "Ich war gestern sehr müde.", en: "I was very tired yesterday." },
      { de: "Wir waren letztes Jahr in Italien.", en: "We were in Italy last year." },
      { de: "Ich hatte keine Zeit.", en: "I had no time." },
      { de: "Ich konnte nicht kommen.", en: "I couldn't come." },
      { de: "Als Kind wollte ich Pilot werden.", en: "As a child I wanted to be a pilot." }
    ],
    watch: "'Ich bin müde gewesen' is grammatically fine, but 'Ich war müde' is what people actually say."
  },
  {
    id: "futur",
    name: "Zukunft",
    short: "Talking about the future",
    tone: "var(--t-essen)",
    summary: "Usually just the Präsens plus a time word — that is the normal way. werden + Infinitiv exists but sounds heavier and is used for predictions or emphasis.",
    pattern: "Präsens + Zeitangabe · werden + Infinitiv",
    examples: [
      { de: "Morgen fahre ich nach Berlin.", en: "Tomorrow I'm going to Berlin." },
      { de: "Nächste Woche beginnt der Kurs.", en: "The course starts next week." },
      { de: "Das mache ich später.", en: "I'll do that later." },
      { de: "Es wird morgen regnen.", en: "It's going to rain tomorrow. (prediction)" },
      { de: "Ich werde dich anrufen.", en: "I will call you." }
    ],
    watch: "Don't reach for werden every time you'd say 'will' in English — Präsens plus morgen/später is more natural."
  },
  {
    id: "zeitangaben",
    name: "Zeitangaben",
    short: "am, im, um, seit",
    tone: "var(--t-freizeit)",
    summary: "Fixed pairings worth memorising as blocks rather than deriving each time.",
    pattern: "am Montag · im Januar · um acht Uhr · seit zwei Jahren · vor einer Woche",
    examples: [
      { de: "Am Freitag habe ich frei.", en: "On Friday I'm off. (days → am)" },
      { de: "Im August fahren wir weg.", en: "In August we're going away. (months → im)" },
      { de: "Der Zug kommt um zehn Uhr.", en: "The train comes at ten. (clock → um)" },
      { de: "Ich wohne seit drei Jahren hier.", en: "I've lived here for three years. (seit + Dativ, present tense!)" },
      { de: "Vor einer Woche war ich krank.", en: "A week ago I was ill." }
    ],
    watch: "seit takes the PRESENT tense in German: 'Ich lerne seit einem Jahr Deutsch', not the perfect as in English."
  },
  {
    id: "artikel",
    name: "Artikel & Genus",
    short: "der, die, das",
    tone: "var(--t-reisen)",
    summary: "Gender is mostly unpredictable, so learn every noun WITH its article. A few endings are reliable enough to trust.",
    pattern: "-ung, -heit, -keit, -schaft, -ion → die · -chen, -lein, -ment → das · -er (person), -ling → der",
    examples: [
      { de: "Die Wohnung ist klein.", en: "The flat is small. (-ung → die)" },
      { de: "Die Gesundheit ist wichtig.", en: "Health is important. (-heit → die)" },
      { de: "Das Mädchen spielt draußen.", en: "The girl is playing outside. (-chen → das, even for a girl)" },
      { de: "Der Lehrer erklärt die Regel.", en: "The teacher explains the rule. (-er → der)" },
      { de: "Die Information ist neu.", en: "The information is new. (-ion → die)" }
    ],
    watch: "Learn 'die Wohnung', never bare 'Wohnung'. Fixing a wrong gender later is much harder than learning it right once."
  }
];

export function grammarById(id) {
  return GRAMMAR.find((g) => g.id === id) || null;
}
