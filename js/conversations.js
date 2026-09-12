/*
 * Everyday A2 dialogues between Shruti and Sijan.
 *
 * Shape:
 *   { id, topic, title, titleEn, lines: [{ s, de, en }] }
 *
 * `s` is the speaker's name as it appears on screen — "Shruti" or "Sijan" —
 * and the two colours in the UI key off exactly those strings.
 *
 * Rules the whole set follows, so a new batch stays consistent with the old:
 *  - 10 to 15 turns, alternating, always ending on something that closes the
 *    exchange rather than trailing off mid-thought.
 *  - A2 grammar only: Präsens, Perfekt, modals, simple weil/dass clauses,
 *    Akkusativ and Dativ. No Konjunktiv II beyond "ich hätte gern" / "könntest
 *    du", no Passiv, no Genitiv, no Präteritum except war/hatte.
 *  - Real situations with a small problem or decision in them. A dialogue where
 *    two people agree about the weather for twelve turns teaches nothing.
 *  - The English is what an English speaker would actually say, not a word-for-
 *    word gloss — German Perfekt becomes the English simple past.
 *
 * Shruti and Sijan are a couple who live together. `couple: true` marks the
 * dialogues that actually sound like it — affection, shared plans, making up
 * after an argument — as opposed to the ones where they play a customer and a
 * shop assistant. At least 5% of the set has to carry that flag; convtest.mjs
 * asserts it, so a new batch cannot quietly let the ratio slip.
 */

export const CONV_TOPICS = [
  { id: "alltag",        name: "Alltag",            tone: "var(--t-alltag)" },
  { id: "einkaufen",     name: "Einkaufen",         tone: "var(--t-geld)" },
  { id: "essen",         name: "Essen & Restaurant", tone: "var(--t-essen)" },
  { id: "wohnen",        name: "Wohnen",            tone: "var(--t-wohnen)" },
  { id: "arbeit",        name: "Arbeit",            tone: "var(--t-arbeit)" },
  { id: "gesundheit",    name: "Gesundheit",        tone: "var(--t-koerper)" },
  { id: "unterwegs",     name: "Unterwegs",         tone: "var(--t-stadt)" },
  { id: "reisen",        name: "Reisen",            tone: "var(--t-reisen)" },
  { id: "freizeit",      name: "Freizeit",          tone: "var(--t-freizeit)" },
  { id: "amt",           name: "Ämter & Formulare", tone: "var(--t-zeit)" },
  { id: "telefon",       name: "Telefon & Termine", tone: "var(--t-kommunikation)" },
  { id: "familie",       name: "Familie & Freunde", tone: "var(--t-familie)" },
  { id: "lernen",        name: "Deutsch lernen",    tone: "var(--t-schule)" },
  { id: "technik",       name: "Technik",           tone: "var(--t-technik)" },
  { id: "wetter",        name: "Wetter & Natur",    tone: "var(--t-wetter)" },
  { id: "paar",          name: "Zu zweit",          tone: "var(--t-gefuehle)" }
];

export const CONVERSATIONS = [

  {
    id: "c001", topic: "alltag", couple: true,
    title: "Der Wecker hat nicht geklingelt",
    titleEn: "The alarm didn't go off",
    lines: [
      { s: "Shruti", de: "Sijan, es ist schon halb acht!", en: "Sijan, it's already half past seven!" },
      { s: "Sijan",  de: "Was? Mein Wecker hat nicht geklingelt.", en: "What? My alarm didn't go off." },
      { s: "Shruti", de: "Hast du ihn gestern Abend gestellt?", en: "Did you set it last night?" },
      { s: "Sijan",  de: "Ich glaube schon. Vielleicht ist der Akku leer.", en: "I think so. Maybe the battery is dead." },
      { s: "Shruti", de: "Dein Bus fährt in zwanzig Minuten.", en: "Your bus leaves in twenty minutes." },
      { s: "Sijan",  de: "Ich dusche ganz schnell und ziehe mich an.", en: "I'll shower really quickly and get dressed." },
      { s: "Shruti", de: "Soll ich dir ein Brot machen?", en: "Shall I make you a sandwich?" },
      { s: "Sijan",  de: "Ja bitte, das wäre super.", en: "Yes please, that would be great." },
      { s: "Shruti", de: "Kaffee hast du keine Zeit mehr.", en: "You don't have time for coffee any more." },
      { s: "Sijan",  de: "Kein Problem, ich trinke einen im Büro.", en: "No problem, I'll have one at the office." },
      { s: "Shruti", de: "Hier ist dein Schlüssel. Du vergisst ihn immer.", en: "Here's your key. You always forget it." },
      { s: "Sijan",  de: "Danke, Schatz! Heute Abend stelle ich zwei Wecker.", en: "Thanks, love! Tonight I'm setting two alarms." }
    ]
  },

  {
    id: "c002", topic: "einkaufen",
    title: "Im Supermarkt fehlt die Hälfte",
    titleEn: "Half the list is missing at the supermarket",
    lines: [
      { s: "Sijan",  de: "Was steht alles auf der Liste?", en: "What's on the list?" },
      { s: "Shruti", de: "Milch, Brot, Eier, Tomaten und Käse.", en: "Milk, bread, eggs, tomatoes and cheese." },
      { s: "Sijan",  de: "Die Milch ist leider aus.", en: "Unfortunately the milk is sold out." },
      { s: "Shruti", de: "Nimm einfach die Hafermilch, die ist auch gut.", en: "Just take the oat milk, that's fine too." },
      { s: "Sijan",  de: "Wie viele Eier brauchen wir?", en: "How many eggs do we need?" },
      { s: "Shruti", de: "Zehn reichen. Ich backe am Wochenende einen Kuchen.", en: "Ten is enough. I'm baking a cake at the weekend." },
      { s: "Sijan",  de: "Die Tomaten sehen heute nicht gut aus.", en: "The tomatoes don't look good today." },
      { s: "Shruti", de: "Dann kaufen wir sie morgen auf dem Markt.", en: "Then we'll buy them at the market tomorrow." },
      { s: "Sijan",  de: "Soll ich noch etwas zum Frühstück mitnehmen?", en: "Should I get something for breakfast too?" },
      { s: "Shruti", de: "Ja, ein Glas Marmelade bitte.", en: "Yes, a jar of jam please." },
      { s: "Sijan",  de: "An der Kasse ist eine lange Schlange.", en: "There's a long queue at the till." },
      { s: "Shruti", de: "Geh zur Selbstbedienungskasse, die ist frei.", en: "Go to the self-checkout, it's free." },
      { s: "Sijan",  de: "Gute Idee. Ich bin in fünf Minuten zu Hause.", en: "Good idea. I'll be home in five minutes." }
    ]
  },

  {
    id: "c003", topic: "essen",
    title: "Ein Tisch für zwei",
    titleEn: "A table for two",
    lines: [
      { s: "Shruti", de: "Guten Abend, haben Sie noch einen Tisch frei?", en: "Good evening, do you still have a table free?" },
      { s: "Sijan",  de: "Wir sind zu zweit und haben nicht reserviert.", en: "There are two of us and we haven't booked." },
      { s: "Shruti", de: "Der Tisch am Fenster wäre schön.", en: "The table by the window would be nice." },
      { s: "Sijan",  de: "Die Speisekarte ist zum Glück auch auf Englisch.", en: "Luckily the menu is in English as well." },
      { s: "Shruti", de: "Ich nehme die Gemüsesuppe und einen Salat.", en: "I'll have the vegetable soup and a salad." },
      { s: "Sijan",  de: "Ich hätte gern die Nudeln mit Tomatensoße.", en: "I'd like the pasta with tomato sauce." },
      { s: "Shruti", de: "Trinkst du ein Bier?", en: "Are you having a beer?" },
      { s: "Sijan",  de: "Nein, heute nur Wasser. Ich fahre noch.", en: "No, just water today. I'm driving later." },
      { s: "Shruti", de: "Das Essen kommt schnell hier.", en: "The food comes quickly here." },
      { s: "Sijan",  de: "Und es schmeckt wirklich gut.", en: "And it really tastes good." },
      { s: "Shruti", de: "Sollen wir noch einen Nachtisch nehmen?", en: "Shall we have a dessert as well?" },
      { s: "Sijan",  de: "Ich bin satt. Aber bestell du ruhig etwas.", en: "I'm full. But do order something." },
      { s: "Shruti", de: "Dann bitte einmal Eis und die Rechnung zusammen.", en: "Then one ice cream and the bill together, please." }
    ]
  },

  {
    id: "c004", topic: "wohnen", couple: true,
    title: "Die Heizung wird nicht warm",
    titleEn: "The heating won't get warm",
    lines: [
      { s: "Sijan",  de: "Im Wohnzimmer ist es eiskalt.", en: "The living room is freezing." },
      { s: "Shruti", de: "Die Heizung läuft, aber sie wird nicht richtig warm.", en: "The heating is on, but it doesn't really get warm." },
      { s: "Sijan",  de: "Hast du sie ganz aufgedreht?", en: "Have you turned it right up?" },
      { s: "Shruti", de: "Ja, seit heute Morgen steht sie auf fünf.", en: "Yes, it's been on five since this morning." },
      { s: "Sijan",  de: "Vielleicht ist Luft im Heizkörper.", en: "Maybe there's air in the radiator." },
      { s: "Shruti", de: "Kannst du das selbst machen?", en: "Can you do that yourself?" },
      { s: "Sijan",  de: "Ich brauche einen kleinen Schlüssel dafür.", en: "I need a small key for it." },
      { s: "Shruti", de: "Dann ruf lieber den Vermieter an.", en: "Then it's better to call the landlord." },
      { s: "Sijan",  de: "Ich schreibe ihm eine Nachricht, das geht schneller.", en: "I'll send him a message, that's quicker." },
      { s: "Shruti", de: "Heute Nacht wird es unter null Grad.", en: "Tonight it's going below zero." },
      { s: "Sijan",  de: "Wir holen die dicke Decke aus dem Schrank.", en: "We'll get the thick blanket out of the cupboard." },
      { s: "Shruti", de: "Komm her, zu zweit ist es sowieso wärmer.", en: "Come here, it's warmer with the two of us anyway." }
    ]
  },

  {
    id: "c005", topic: "arbeit", couple: true,
    title: "Der erste Tag im Büro",
    titleEn: "First day at the office",
    lines: [
      { s: "Shruti", de: "Und? Wie war dein erster Tag?", en: "So? How was your first day?" },
      { s: "Sijan",  de: "Lang, aber wirklich gut.", en: "Long, but really good." },
      { s: "Shruti", de: "Sind die Kollegen nett?", en: "Are your colleagues nice?" },
      { s: "Sijan",  de: "Ja, eine Kollegin hat mir alles gezeigt.", en: "Yes, one colleague showed me everything." },
      { s: "Shruti", de: "Hast du deinen Chef schon kennengelernt?", en: "Have you met your boss yet?" },
      { s: "Sijan",  de: "Nur kurz. Er war den ganzen Tag in Besprechungen.", en: "Only briefly. He was in meetings all day." },
      { s: "Shruti", de: "Wo ist dein Schreibtisch?", en: "Where's your desk?" },
      { s: "Sijan",  de: "Im dritten Stock, direkt am Fenster.", en: "On the third floor, right by the window." },
      { s: "Shruti", de: "Und das Essen in der Kantine?", en: "And the food in the canteen?" },
      { s: "Sijan",  de: "Besser als erwartet, und ziemlich günstig.", en: "Better than expected, and quite cheap." },
      { s: "Shruti", de: "Wann fängst du morgen an?", en: "When do you start tomorrow?" },
      { s: "Sijan",  de: "Um acht. Ich muss den Bus um sieben nehmen.", en: "At eight. I have to take the seven o'clock bus." },
      { s: "Shruti", de: "Ich bin stolz auf dich. Den Wecker stelle ich.", en: "I'm proud of you. I'll set the alarm." }
    ]
  },

  {
    id: "c006", topic: "gesundheit", couple: true,
    title: "Beim Arzt anrufen",
    titleEn: "Calling the doctor",
    lines: [
      { s: "Shruti", de: "Du hustest schon die ganze Woche.", en: "You've been coughing all week." },
      { s: "Sijan",  de: "Ich weiß. Und mein Hals tut auch weh.", en: "I know. And my throat hurts too." },
      { s: "Shruti", de: "Hast du Fieber gemessen?", en: "Have you taken your temperature?" },
      { s: "Sijan",  de: "Ja, achtunddreißig Grad.", en: "Yes, thirty-eight degrees." },
      { s: "Shruti", de: "Ruf bitte die Praxis an, sie öffnet um acht.", en: "Please call the surgery, it opens at eight." },
      { s: "Sijan",  de: "Bekomme ich heute noch einen Termin?", en: "Will I still get an appointment today?" },
      { s: "Shruti", de: "Sag einfach, dass es dringend ist.", en: "Just say that it's urgent." },
      { s: "Sijan",  de: "Sie haben um halb elf etwas frei.", en: "They have something free at half past ten." },
      { s: "Shruti", de: "Sehr gut. Nimm deine Versichertenkarte mit.", en: "Very good. Take your insurance card with you." },
      { s: "Sijan",  de: "Die liegt in meiner Jacke.", en: "It's in my jacket." },
      { s: "Shruti", de: "Soll ich mitkommen?", en: "Shall I come along?" },
      { s: "Sijan",  de: "Danke, aber ich schaffe das allein.", en: "Thanks, but I can manage on my own." },
      { s: "Shruti", de: "Ich mache dir einen Tee mit Honig, mein Lieber.", en: "I'll make you a tea with honey, my love." }
    ]
  },

  {
    id: "c007", topic: "unterwegs",
    title: "Welcher Bus fährt zum Bahnhof?",
    titleEn: "Which bus goes to the station?",
    lines: [
      { s: "Sijan",  de: "Entschuldigung, fährt dieser Bus zum Bahnhof?", en: "Excuse me, does this bus go to the station?" },
      { s: "Shruti", de: "Nein, die Vier fährt in die andere Richtung.", en: "No, the number four goes the other way." },
      { s: "Sijan",  de: "Welchen muss ich denn nehmen?", en: "Which one do I need to take?" },
      { s: "Shruti", de: "Die Sieben, sie hält auf der anderen Straßenseite.", en: "The seven, it stops on the other side of the street." },
      { s: "Sijan",  de: "Wie lange dauert die Fahrt?", en: "How long does the journey take?" },
      { s: "Shruti", de: "Ungefähr zwölf Minuten.", en: "About twelve minutes." },
      { s: "Sijan",  de: "Und wo kaufe ich eine Fahrkarte?", en: "And where do I buy a ticket?" },
      { s: "Shruti", de: "Direkt beim Fahrer oder mit der App.", en: "Straight from the driver or with the app." },
      { s: "Sijan",  de: "Ich habe leider nur einen großen Schein.", en: "Unfortunately I only have a large note." },
      { s: "Shruti", de: "Dann nimm die App, das ist einfacher.", en: "Then use the app, that's easier." },
      { s: "Sijan",  de: "Danke, Sie haben mir sehr geholfen.", en: "Thank you, you've helped me a lot." },
      { s: "Shruti", de: "Gern. Da kommt Ihr Bus schon.", en: "You're welcome. Here comes your bus already." }
    ]
  },

  {
    id: "c008", topic: "reisen",
    title: "Der Zug hat Verspätung",
    titleEn: "The train is delayed",
    lines: [
      { s: "Shruti", de: "Unser Zug hat zwanzig Minuten Verspätung.", en: "Our train is twenty minutes late." },
      { s: "Sijan",  de: "Dann verpassen wir den Anschluss in Ulm.", en: "Then we'll miss the connection in Ulm." },
      { s: "Shruti", de: "Schau mal in der App, ob es eine andere Verbindung gibt.", en: "Have a look in the app to see if there's another connection." },
      { s: "Sijan",  de: "Es gibt einen später, um Viertel nach sechs.", en: "There's a later one, at quarter past six." },
      { s: "Shruti", de: "Dann sind wir erst um neun im Hotel.", en: "Then we won't be at the hotel until nine." },
      { s: "Sijan",  de: "Ich schreibe dem Hotel kurz eine Mail.", en: "I'll send the hotel a quick email." },
      { s: "Shruti", de: "Gute Idee, sonst geben sie das Zimmer weg.", en: "Good idea, otherwise they'll give the room away." },
      { s: "Sijan",  de: "Hast du noch etwas zu essen im Rucksack?", en: "Do you still have something to eat in your backpack?" },
      { s: "Shruti", de: "Zwei Äpfel und ein paar Nüsse.", en: "Two apples and a few nuts." },
      { s: "Sijan",  de: "Das reicht bis zum Abendessen.", en: "That'll do until dinner." },
      { s: "Shruti", de: "Der Zug kommt auf Gleis fünf, nicht auf drei.", en: "The train is coming on platform five, not three." },
      { s: "Sijan",  de: "Dann müssen wir schnell auf die andere Seite.", en: "Then we have to hurry to the other side." },
      { s: "Shruti", de: "Komm, wir nehmen die Treppe, der Aufzug dauert zu lange.", en: "Come on, let's take the stairs, the lift takes too long." }
    ]
  },

  {
    id: "c009", topic: "freizeit", couple: true,
    title: "Was machen wir am Wochenende?",
    titleEn: "What shall we do at the weekend?",
    lines: [
      { s: "Sijan",  de: "Hast du am Samstag schon etwas vor?", en: "Do you already have plans for Saturday?" },
      { s: "Shruti", de: "Am Vormittag nicht, am Nachmittag treffe ich Anna.", en: "Not in the morning, in the afternoon I'm meeting Anna." },
      { s: "Sijan",  de: "Wollen wir früh an den See fahren?", en: "Shall we drive to the lake early?" },
      { s: "Shruti", de: "Gern, wenn das Wetter mitspielt.", en: "I'd love to, if the weather plays along." },
      { s: "Sijan",  de: "Es soll sonnig und zwanzig Grad werden.", en: "It's supposed to be sunny and twenty degrees." },
      { s: "Shruti", de: "Dann nehmen wir die Räder statt das Auto.", en: "Then let's take the bikes instead of the car." },
      { s: "Sijan",  de: "Mein Reifen ist leider platt.", en: "Unfortunately my tyre is flat." },
      { s: "Shruti", de: "Wir haben doch eine Pumpe im Keller.", en: "We've got a pump in the cellar." },
      { s: "Sijan",  de: "Stimmt, das repariere ich heute Abend.", en: "True, I'll fix that this evening." },
      { s: "Shruti", de: "Ich mache uns Brote für unterwegs.", en: "I'll make us some sandwiches for the way." },
      { s: "Sijan",  de: "Und ich nehme die Kamera mit.", en: "And I'll take the camera." },
      { s: "Shruti", de: "Ich freue mich auf einen Tag nur mit dir.", en: "I'm looking forward to a day with just you." }
    ]
  },

  {
    id: "c010", topic: "amt",
    title: "Anmeldung beim Bürgerbüro",
    titleEn: "Registering at the residents' office",
    lines: [
      { s: "Sijan",  de: "Guten Tag, ich möchte mich anmelden.", en: "Hello, I'd like to register." },
      { s: "Shruti", de: "Haben Sie einen Termin?", en: "Do you have an appointment?" },
      { s: "Sijan",  de: "Ja, um zehn Uhr, auf den Namen Pahari.", en: "Yes, at ten o'clock, under the name Pahari." },
      { s: "Shruti", de: "Bitte geben Sie mir Ihren Ausweis.", en: "Please give me your ID." },
      { s: "Sijan",  de: "Hier ist mein Pass.", en: "Here's my passport." },
      { s: "Shruti", de: "Und die Wohnungsgeberbestätigung?", en: "And the confirmation from your landlord?" },
      { s: "Sijan",  de: "Die habe ich auch dabei.", en: "I have that with me as well." },
      { s: "Shruti", de: "Seit wann wohnen Sie in der Wohnung?", en: "Since when have you been living in the flat?" },
      { s: "Sijan",  de: "Seit dem ersten März.", en: "Since the first of March." },
      { s: "Shruti", de: "Bitte füllen Sie noch dieses Formular aus.", en: "Please fill in this form as well." },
      { s: "Sijan",  de: "Muss ich hier unten unterschreiben?", en: "Do I sign down here?" },
      { s: "Shruti", de: "Genau. Die Bestätigung kommt per Post.", en: "Exactly. The confirmation comes by post." },
      { s: "Sijan",  de: "Vielen Dank für Ihre Hilfe.", en: "Thank you very much for your help." }
    ]
  },

  {
    id: "c011", topic: "alltag",
    title: "Die Waschmaschine ist voll",
    titleEn: "The washing machine is full",
    lines: [
      { s: "Shruti", de: "Kannst du die Wäsche aufhängen?", en: "Can you hang up the washing?" },
      { s: "Sijan",  de: "Ist die Maschine schon fertig?", en: "Is the machine finished already?" },
      { s: "Shruti", de: "Ja, seit einer halben Stunde.", en: "Yes, half an hour ago." },
      { s: "Sijan",  de: "Draußen regnet es leider.", en: "Unfortunately it's raining outside." },
      { s: "Shruti", de: "Dann häng sie im Bad auf.", en: "Then hang it up in the bathroom." },
      { s: "Sijan",  de: "Der Ständer steht noch im Keller.", en: "The drying rack is still in the cellar." },
      { s: "Shruti", de: "Ich hole ihn gleich hoch.", en: "I'll bring it up in a minute." },
      { s: "Sijan",  de: "Dein rotes Hemd hat gefärbt.", en: "Your red shirt has run." },
      { s: "Shruti", de: "Oh nein, sind die weißen Sachen jetzt rosa?", en: "Oh no, are the white things pink now?" },
      { s: "Sijan",  de: "Nur zwei Socken, das ist nicht schlimm.", en: "Only two socks, it's not that bad." },
      { s: "Shruti", de: "Nächstes Mal wasche ich Rot getrennt.", en: "Next time I'll wash the reds separately." },
      { s: "Sijan",  de: "Bis morgen früh ist alles trocken.", en: "Everything will be dry by tomorrow morning." }
    ]
  },

  {
    id: "c012", topic: "alltag",
    title: "Wer bringt den Müll raus?",
    titleEn: "Who's taking out the rubbish?",
    lines: [
      { s: "Sijan",  de: "Morgen kommt die Müllabfuhr.", en: "The bin lorry comes tomorrow." },
      { s: "Shruti", de: "Welche Tonne ist dran?", en: "Which bin is it this time?" },
      { s: "Sijan",  de: "Die blaue, also Papier.", en: "The blue one, so paper." },
      { s: "Shruti", de: "Die Kartons vom Umzug müssen noch raus.", en: "The boxes from the move still need to go out." },
      { s: "Sijan",  de: "Die sind zu groß für die Tonne.", en: "They're too big for the bin." },
      { s: "Shruti", de: "Dann falte sie bitte zusammen.", en: "Then please fold them up." },
      { s: "Sijan",  de: "Mache ich, aber ich brauche ein Messer.", en: "I will, but I need a knife." },
      { s: "Shruti", de: "Im Küchenschrank liegt eins.", en: "There's one in the kitchen cupboard." },
      { s: "Sijan",  de: "Kommst du kurz mit runter?", en: "Will you come down with me for a moment?" },
      { s: "Shruti", de: "Ja, ich nehme die Flaschen mit.", en: "Yes, I'll take the bottles with me." },
      { s: "Sijan",  de: "Der Container ist gleich neben der Garage.", en: "The container is right next to the garage." },
      { s: "Shruti", de: "Danach machen wir es uns gemütlich.", en: "Afterwards we'll make ourselves comfortable." }
    ]
  },

  {
    id: "c013", topic: "alltag",
    title: "Der Schlüssel ist weg",
    titleEn: "The key is gone",
    lines: [
      { s: "Sijan",  de: "Ich finde meinen Schlüssel nicht.", en: "I can't find my key." },
      { s: "Shruti", de: "Wann hattest du ihn zuletzt?", en: "When did you last have it?" },
      { s: "Sijan",  de: "Heute Morgen an der Haustür.", en: "This morning at the front door." },
      { s: "Shruti", de: "Hast du in deiner Jacke nachgesehen?", en: "Have you checked your jacket?" },
      { s: "Sijan",  de: "In beiden Taschen, nichts.", en: "Both pockets, nothing." },
      { s: "Shruti", de: "Und im Rucksack?", en: "And in the backpack?" },
      { s: "Sijan",  de: "Da ist nur mein Laptop drin.", en: "There's only my laptop in there." },
      { s: "Shruti", de: "Warst du heute im Supermarkt?", en: "Were you at the supermarket today?" },
      { s: "Sijan",  de: "Ja, ich rufe dort gleich an.", en: "Yes, I'll call them right away." },
      { s: "Shruti", de: "Schau vorher noch in der Hose von gestern.", en: "Check yesterday's trousers first." },
      { s: "Sijan",  de: "Da ist er! Ich bin wirklich blind.", en: "There it is! I really am blind." },
      { s: "Shruti", de: "Häng ihn bitte immer an den Haken.", en: "Please always hang it on the hook." }
    ]
  },

  {
    id: "c014", topic: "einkaufen",
    title: "Die Hose ist zu eng",
    titleEn: "The trousers are too tight",
    lines: [
      { s: "Shruti", de: "Guten Tag, ich möchte diese Hose umtauschen.", en: "Hello, I'd like to exchange these trousers." },
      { s: "Sijan",  de: "Haben Sie den Kassenbon dabei?", en: "Do you have the receipt with you?" },
      { s: "Shruti", de: "Ja, hier ist er.", en: "Yes, here it is." },
      { s: "Sijan",  de: "Was stimmt mit der Hose nicht?", en: "What's wrong with the trousers?" },
      { s: "Shruti", de: "Sie ist mir zu eng an der Hüfte.", en: "They're too tight on the hips." },
      { s: "Sijan",  de: "Welche Größe haben Sie genommen?", en: "Which size did you take?" },
      { s: "Shruti", de: "Achtunddreißig, aber ich brauche wohl vierzig.", en: "Thirty-eight, but I probably need forty." },
      { s: "Sijan",  de: "In Vierzig haben wir sie nur noch in Schwarz.", en: "In forty we only have them in black." },
      { s: "Shruti", de: "Schwarz passt auch gut.", en: "Black works fine too." },
      { s: "Sijan",  de: "Möchten Sie sie kurz anprobieren?", en: "Would you like to try them on quickly?" },
      { s: "Shruti", de: "Ja gern, wo sind die Kabinen?", en: "Yes please, where are the fitting rooms?" },
      { s: "Sijan",  de: "Hinten links, neben den Jacken.", en: "At the back on the left, next to the jackets." },
      { s: "Shruti", de: "Diese passt perfekt, die nehme ich.", en: "These fit perfectly, I'll take them." }
    ]
  },

  {
    id: "c015", topic: "einkaufen",
    title: "Samstag auf dem Markt",
    titleEn: "Saturday at the market",
    lines: [
      { s: "Sijan",  de: "Die Erdbeeren sehen richtig gut aus.", en: "The strawberries look really good." },
      { s: "Shruti", de: "Was kostet eine Schale?", en: "How much is a punnet?" },
      { s: "Sijan",  de: "Drei Euro fünfzig, zwei für sechs.", en: "Three fifty, two for six." },
      { s: "Shruti", de: "Dann nehmen wir zwei.", en: "Then we'll take two." },
      { s: "Sijan",  de: "Brauchen wir auch Kartoffeln?", en: "Do we need potatoes as well?" },
      { s: "Shruti", de: "Ja, ein Kilo für die Suppe.", en: "Yes, a kilo for the soup." },
      { s: "Sijan",  de: "Der Käsestand hat heute sehr wenig.", en: "The cheese stall has very little today." },
      { s: "Shruti", de: "Wir sind auch spät dran.", en: "We're late as well." },
      { s: "Sijan",  de: "Nächste Woche kommen wir um neun.", en: "Next week we'll come at nine." },
      { s: "Shruti", de: "Hast du genug Bargeld dabei?", en: "Do you have enough cash on you?" },
      { s: "Sijan",  de: "Nur zehn Euro, hier kann man nicht mit Karte zahlen.", en: "Only ten euros, you can't pay by card here." },
      { s: "Shruti", de: "Ich habe noch zwanzig, das reicht.", en: "I still have twenty, that's enough." },
      { s: "Sijan",  de: "Dann trinken wir danach noch einen Kaffee.", en: "Then we'll have a coffee afterwards." }
    ]
  },

  {
    id: "c016", topic: "einkaufen",
    title: "Das Paket ist nicht angekommen",
    titleEn: "The parcel never arrived",
    lines: [
      { s: "Shruti", de: "Mein Paket sollte gestern kommen.", en: "My parcel was supposed to come yesterday." },
      { s: "Sijan",  de: "Hast du in der App nachgeschaut?", en: "Have you checked in the app?" },
      { s: "Shruti", de: "Dort steht, es ist zugestellt.", en: "It says it's been delivered." },
      { s: "Sijan",  de: "Vielleicht hat der Nachbar es angenommen.", en: "Maybe the neighbour took it in." },
      { s: "Shruti", de: "Herr Weber war gestern nicht zu Hause.", en: "Mr Weber wasn't at home yesterday." },
      { s: "Sijan",  de: "Schau mal, ob ein Zettel im Briefkasten liegt.", en: "Have a look whether there's a note in the letterbox." },
      { s: "Shruti", de: "Hier ist einer! Es ist in der Filiale.", en: "Here's one! It's at the branch." },
      { s: "Sijan",  de: "Bis wann kannst du es abholen?", en: "Until when can you pick it up?" },
      { s: "Shruti", de: "Sieben Tage, also bis Freitag.", en: "Seven days, so until Friday." },
      { s: "Sijan",  de: "Nimm deinen Ausweis mit.", en: "Take your ID with you." },
      { s: "Shruti", de: "Kommst du nach der Arbeit mit?", en: "Will you come with me after work?" },
      { s: "Sijan",  de: "Klar, die Filiale liegt auf meinem Weg.", en: "Sure, the branch is on my way." }
    ]
  },

  {
    id: "c017", topic: "essen", couple: true,
    title: "Zusammen kochen",
    titleEn: "Cooking together",
    lines: [
      { s: "Sijan",  de: "Was kochen wir heute Abend?", en: "What are we cooking tonight?" },
      { s: "Shruti", de: "Ich habe Lust auf Linsen mit Reis.", en: "I fancy lentils with rice." },
      { s: "Sijan",  de: "Haben wir noch Zwiebeln?", en: "Do we still have onions?" },
      { s: "Shruti", de: "Zwei, das reicht.", en: "Two, that's enough." },
      { s: "Sijan",  de: "Soll ich sie klein schneiden?", en: "Shall I chop them up?" },
      { s: "Shruti", de: "Ja, und den Knoblauch auch bitte.", en: "Yes, and the garlic too please." },
      { s: "Sijan",  de: "Wie lange müssen die Linsen kochen?", en: "How long do the lentils have to cook?" },
      { s: "Shruti", de: "Ungefähr zwanzig Minuten.", en: "About twenty minutes." },
      { s: "Sijan",  de: "Ich decke schon mal den Tisch.", en: "I'll set the table in the meantime." },
      { s: "Shruti", de: "Kannst du auch den Reis aufsetzen?", en: "Can you put the rice on too?" },
      { s: "Sijan",  de: "Das Wasser kocht schon.", en: "The water is already boiling." },
      { s: "Shruti", de: "Probier mal, ob genug Salz drin ist.", en: "Have a taste, see if there's enough salt in it." },
      { s: "Sijan",  de: "Perfekt. Mit dir kochen macht mir Spaß.", en: "Perfect. I enjoy cooking with you." }
    ]
  },

  {
    id: "c018", topic: "essen",
    title: "Beim Bäcker",
    titleEn: "At the bakery",
    lines: [
      { s: "Shruti", de: "Guten Morgen, was hätten Sie gern?", en: "Good morning, what would you like?" },
      { s: "Sijan",  de: "Zwei Brötchen und ein Vollkornbrot bitte.", en: "Two rolls and a wholemeal loaf please." },
      { s: "Shruti", de: "Geschnitten oder am Stück?", en: "Sliced or whole?" },
      { s: "Sijan",  de: "Geschnitten bitte.", en: "Sliced please." },
      { s: "Shruti", de: "Darf es sonst noch etwas sein?", en: "Anything else?" },
      { s: "Sijan",  de: "Haben Sie noch Käsekuchen?", en: "Do you still have cheesecake?" },
      { s: "Shruti", de: "Nur noch zwei Stücke.", en: "Only two pieces left." },
      { s: "Sijan",  de: "Dann nehme ich beide.", en: "Then I'll take both." },
      { s: "Shruti", de: "Das macht acht Euro zwanzig.", en: "That'll be eight euros twenty." },
      { s: "Sijan",  de: "Kann ich mit Karte zahlen?", en: "Can I pay by card?" },
      { s: "Shruti", de: "Ab zehn Euro gern, darunter leider nur bar.", en: "From ten euros, yes, below that unfortunately cash only." },
      { s: "Sijan",  de: "Kein Problem, ich habe passend.", en: "No problem, I have the exact change." },
      { s: "Shruti", de: "Vielen Dank und einen schönen Tag!", en: "Thank you very much and have a nice day!" }
    ]
  },

  {
    id: "c019", topic: "essen",
    title: "Gäste kommen zum Essen",
    titleEn: "Guests are coming for dinner",
    lines: [
      { s: "Sijan",  de: "Anna und Tom kommen um sieben.", en: "Anna and Tom are coming at seven." },
      { s: "Shruti", de: "Isst Tom eigentlich Fleisch?", en: "Does Tom actually eat meat?" },
      { s: "Sijan",  de: "Nein, er ist Vegetarier.", en: "No, he's a vegetarian." },
      { s: "Shruti", de: "Gut, dass du es sagst.", en: "Good that you mention it." },
      { s: "Sijan",  de: "Dann machen wir Gemüse mit Nudeln.", en: "Then let's make vegetables with pasta." },
      { s: "Shruti", de: "Und als Vorspeise eine Suppe?", en: "And a soup as a starter?" },
      { s: "Sijan",  de: "Ja, die kann ich vorher kochen.", en: "Yes, I can cook that beforehand." },
      { s: "Shruti", de: "Wir brauchen noch Getränke.", en: "We still need drinks." },
      { s: "Sijan",  de: "Ich hole Wasser und Saft.", en: "I'll get water and juice." },
      { s: "Shruti", de: "Der Tisch ist zu klein für vier.", en: "The table is too small for four." },
      { s: "Sijan",  de: "Wir stellen den kleinen dazu.", en: "We'll put the small one next to it." },
      { s: "Shruti", de: "Um halb sieben sind wir fertig.", en: "We'll be ready by half past six." }
    ]
  },

  {
    id: "c020", topic: "wohnen",
    title: "Eine Wohnung besichtigen",
    titleEn: "Viewing a flat",
    lines: [
      { s: "Shruti", de: "Wie viele Zimmer hat die Wohnung?", en: "How many rooms does the flat have?" },
      { s: "Sijan",  de: "Drei, plus Küche und Bad.", en: "Three, plus kitchen and bathroom." },
      { s: "Shruti", de: "Und wie hoch ist die Miete?", en: "And how high is the rent?" },
      { s: "Sijan",  de: "Achthundert warm.", en: "Eight hundred including bills." },
      { s: "Shruti", de: "Gibt es einen Balkon?", en: "Is there a balcony?" },
      { s: "Sijan",  de: "Ja, nach Süden, das ist schön.", en: "Yes, facing south, that's nice." },
      { s: "Shruti", de: "In welchem Stock liegt sie?", en: "Which floor is it on?" },
      { s: "Sijan",  de: "Im dritten, leider ohne Aufzug.", en: "On the third, unfortunately without a lift." },
      { s: "Shruti", de: "Das wird beim Umzug anstrengend.", en: "That'll be hard work when we move." },
      { s: "Sijan",  de: "Dafür ist die Straße ruhig.", en: "On the other hand the street is quiet." },
      { s: "Shruti", de: "Wann können wir einziehen?", en: "When can we move in?" },
      { s: "Sijan",  de: "Ab dem ersten Juni.", en: "From the first of June." },
      { s: "Shruti", de: "Mir gefällt sie. Bewerben wir uns?", en: "I like it. Shall we apply?" }
    ]
  },

  {
    id: "c021", topic: "wohnen",
    title: "Der Umzugstag",
    titleEn: "Moving day",
    lines: [
      { s: "Sijan",  de: "Der Transporter steht schon unten.", en: "The van is already downstairs." },
      { s: "Shruti", de: "Sind alle Kartons beschriftet?", en: "Are all the boxes labelled?" },
      { s: "Sijan",  de: "Fast, bei der Küche fehlt noch einer.", en: "Almost, one from the kitchen is still missing." },
      { s: "Shruti", de: "Tragen wir das Sofa zuerst runter?", en: "Shall we carry the sofa down first?" },
      { s: "Sijan",  de: "Ja, die schweren Sachen zuerst.", en: "Yes, the heavy things first." },
      { s: "Shruti", de: "Passt es durch die Tür?", en: "Will it fit through the door?" },
      { s: "Sijan",  de: "Wir müssen es hochkant drehen.", en: "We'll have to turn it on its side." },
      { s: "Shruti", de: "Vorsicht, die Wand ist frisch gestrichen.", en: "Careful, the wall is freshly painted." },
      { s: "Sijan",  de: "Kommt Tom auch noch helfen?", en: "Is Tom still coming to help?" },
      { s: "Shruti", de: "Er ist gegen zehn da.", en: "He'll be here around ten." },
      { s: "Sijan",  de: "Dann schaffen wir es bis mittags.", en: "Then we'll manage by midday." },
      { s: "Shruti", de: "Danach bestelle ich uns eine Pizza.", en: "Afterwards I'll order us a pizza." }
    ]
  },

  {
    id: "c022", topic: "wohnen",
    title: "Die Nachbarn sind laut",
    titleEn: "The neighbours are loud",
    lines: [
      { s: "Shruti", de: "Hast du letzte Nacht geschlafen?", en: "Did you sleep last night?" },
      { s: "Sijan",  de: "Kaum, oben war es bis zwei Uhr laut.", en: "Hardly, it was noisy upstairs until two." },
      { s: "Shruti", de: "Die haben wohl gefeiert.", en: "They were obviously having a party." },
      { s: "Sijan",  de: "Am Dienstag finde ich das schon frech.", en: "On a Tuesday I think that's a bit cheeky." },
      { s: "Shruti", de: "Sollen wir mit ihnen reden?", en: "Shall we talk to them?" },
      { s: "Sijan",  de: "Ja, aber freundlich.", en: "Yes, but in a friendly way." },
      { s: "Shruti", de: "Ich klingle heute Abend bei ihnen.", en: "I'll ring their bell this evening." },
      { s: "Sijan",  de: "Vielleicht wissen sie gar nicht, dass man alles hört.", en: "Maybe they don't even know that you can hear everything." },
      { s: "Shruti", de: "Der Boden ist wirklich dünn.", en: "The floor really is thin." },
      { s: "Sijan",  de: "Wenn es wieder passiert, schreibe ich dem Vermieter.", en: "If it happens again, I'll write to the landlord." },
      { s: "Shruti", de: "Erst mal probieren wir es persönlich.", en: "Let's try in person first." },
      { s: "Sijan",  de: "Einverstanden. Heute gehe ich früh ins Bett.", en: "Agreed. Today I'm going to bed early." }
    ]
  },

  {
    id: "c023", topic: "arbeit",
    title: "Urlaub beantragen",
    titleEn: "Asking for time off",
    lines: [
      { s: "Sijan",  de: "Haben Sie kurz Zeit?", en: "Do you have a moment?" },
      { s: "Shruti", de: "Ja, natürlich. Worum geht es?", en: "Yes, of course. What's it about?" },
      { s: "Sijan",  de: "Ich möchte im August Urlaub nehmen.", en: "I'd like to take holiday in August." },
      { s: "Shruti", de: "Welche Woche genau?", en: "Which week exactly?" },
      { s: "Sijan",  de: "Vom zehnten bis zum einundzwanzigsten.", en: "From the tenth to the twenty-first." },
      { s: "Shruti", de: "Das sind zwei Wochen.", en: "That's two weeks." },
      { s: "Sijan",  de: "Ja, wir fliegen nach Nepal.", en: "Yes, we're flying to Nepal." },
      { s: "Shruti", de: "In der Zeit ist Frau Meyer auch weg.", en: "Mrs Meyer is away at that time too." },
      { s: "Sijan",  de: "Kann ich eine Woche später fahren?", en: "Could I go a week later?" },
      { s: "Shruti", de: "Ab dem siebzehnten wäre besser.", en: "From the seventeenth would be better." },
      { s: "Sijan",  de: "Dann buche ich die Flüge so um.", en: "Then I'll rebook the flights that way." },
      { s: "Shruti", de: "Stellen Sie den Antrag bitte heute noch.", en: "Please submit the request today." },
      { s: "Sijan",  de: "Mache ich sofort. Danke!", en: "I'll do it right away. Thanks!" }
    ]
  },

  {
    id: "c024", topic: "arbeit",
    title: "Sich krankmelden",
    titleEn: "Calling in sick",
    lines: [
      { s: "Sijan",  de: "Guten Morgen, hier ist Sijan.", en: "Good morning, this is Sijan." },
      { s: "Shruti", de: "Guten Morgen, was ist los?", en: "Good morning, what's the matter?" },
      { s: "Sijan",  de: "Ich bin krank und kann heute nicht kommen.", en: "I'm ill and can't come in today." },
      { s: "Shruti", de: "Das tut mir leid. Was haben Sie denn?", en: "I'm sorry to hear that. What's wrong?" },
      { s: "Sijan",  de: "Eine starke Erkältung mit Fieber.", en: "A bad cold with a fever." },
      { s: "Shruti", de: "Waren Sie schon beim Arzt?", en: "Have you been to the doctor?" },
      { s: "Sijan",  de: "Ich habe um elf einen Termin.", en: "I have an appointment at eleven." },
      { s: "Shruti", de: "Schicken Sie uns die Krankmeldung bitte per Mail.", en: "Please send us the sick note by email." },
      { s: "Sijan",  de: "Mache ich heute Nachmittag.", en: "I'll do that this afternoon." },
      { s: "Shruti", de: "Und die Besprechung morgen?", en: "And the meeting tomorrow?" },
      { s: "Sijan",  de: "Können Sie die bitte verschieben?", en: "Could you postpone it please?" },
      { s: "Shruti", de: "Ja, ich kümmere mich darum. Gute Besserung!", en: "Yes, I'll take care of it. Get well soon!" }
    ]
  },

  {
    id: "c025", topic: "arbeit",
    title: "Die Bewerbung durchgehen",
    titleEn: "Going through the application",
    lines: [
      { s: "Shruti", de: "Ist deine Bewerbung fertig?", en: "Is your application ready?" },
      { s: "Sijan",  de: "Fast, das Anschreiben fehlt noch.", en: "Almost, the cover letter is still missing." },
      { s: "Shruti", de: "Liest du es mir mal vor?", en: "Will you read it to me?" },
      { s: "Sijan",  de: "Es ist noch zu lang, glaube ich.", en: "It's still too long, I think." },
      { s: "Shruti", de: "Eine Seite reicht völlig.", en: "One page is plenty." },
      { s: "Sijan",  de: "Soll ich meine Ausbildung erwähnen?", en: "Should I mention my training?" },
      { s: "Shruti", de: "Ja, und deine Erfahrung mit dem Projekt.", en: "Yes, and your experience with the project." },
      { s: "Sijan",  de: "Brauche ich ein Foto?", en: "Do I need a photo?" },
      { s: "Shruti", de: "Das ist heute nicht mehr nötig.", en: "That isn't necessary any more these days." },
      { s: "Sijan",  de: "Bis wann muss ich es schicken?", en: "By when do I have to send it?" },
      { s: "Shruti", de: "Die Frist ist am Freitag.", en: "The deadline is on Friday." },
      { s: "Sijan",  de: "Dann schicke ich es morgen früh ab.", en: "Then I'll send it off tomorrow morning." },
      { s: "Shruti", de: "Ich lese vorher noch einmal drüber.", en: "I'll read over it once more beforehand." }
    ]
  },

  {
    id: "c026", topic: "gesundheit",
    title: "In der Apotheke",
    titleEn: "At the pharmacy",
    lines: [
      { s: "Sijan",  de: "Guten Tag, ich brauche etwas gegen Husten.", en: "Hello, I need something for a cough." },
      { s: "Shruti", de: "Haben Sie ein Rezept?", en: "Do you have a prescription?" },
      { s: "Sijan",  de: "Nein, ich war nicht beim Arzt.", en: "No, I haven't been to the doctor." },
      { s: "Shruti", de: "Seit wann haben Sie den Husten?", en: "How long have you had the cough?" },
      { s: "Sijan",  de: "Seit drei Tagen.", en: "For three days." },
      { s: "Shruti", de: "Haben Sie auch Fieber?", en: "Do you have a fever as well?" },
      { s: "Sijan",  de: "Nein, nur Halsschmerzen.", en: "No, just a sore throat." },
      { s: "Shruti", de: "Dann probieren Sie diesen Saft.", en: "Then try this syrup." },
      { s: "Sijan",  de: "Wie oft nehme ich ihn?", en: "How often do I take it?" },
      { s: "Shruti", de: "Dreimal am Tag, nach dem Essen.", en: "Three times a day, after meals." },
      { s: "Sijan",  de: "Und wenn es nicht besser wird?", en: "And if it doesn't get better?" },
      { s: "Shruti", de: "Dann gehen Sie bitte zum Arzt.", en: "Then please go to the doctor." },
      { s: "Sijan",  de: "Gut, vielen Dank für die Beratung.", en: "Alright, thank you for the advice." }
    ]
  },

  {
    id: "c027", topic: "gesundheit",
    title: "Zahnschmerzen",
    titleEn: "Toothache",
    lines: [
      { s: "Shruti", de: "Du isst ja gar nichts.", en: "You're not eating anything at all." },
      { s: "Sijan",  de: "Mein Zahn tut beim Kauen weh.", en: "My tooth hurts when I chew." },
      { s: "Shruti", de: "Seit wann denn?", en: "Since when?" },
      { s: "Sijan",  de: "Seit dem Wochenende.", en: "Since the weekend." },
      { s: "Shruti", de: "Und du sagst erst jetzt etwas?", en: "And you're only saying something now?" },
      { s: "Sijan",  de: "Ich dachte, es geht von allein weg.", en: "I thought it would go away on its own." },
      { s: "Shruti", de: "Ruf morgen früh beim Zahnarzt an.", en: "Call the dentist tomorrow morning." },
      { s: "Sijan",  de: "Ich war seit zwei Jahren nicht mehr dort.", en: "I haven't been there for two years." },
      { s: "Shruti", de: "Umso wichtiger ist es.", en: "All the more reason to go." },
      { s: "Sijan",  de: "Heißes Essen tut besonders weh.", en: "Hot food hurts especially." },
      { s: "Shruti", de: "Dann mache ich dir einen kalten Joghurt.", en: "Then I'll get you a cold yoghurt." },
      { s: "Sijan",  de: "Danke. Morgen rufe ich wirklich an.", en: "Thanks. Tomorrow I'll really call." }
    ]
  },

  {
    id: "c028", topic: "gesundheit",
    title: "Rücken nach dem Sport",
    titleEn: "A sore back after sport",
    lines: [
      { s: "Sijan",  de: "Mein Rücken tut seit gestern weh.", en: "My back has been hurting since yesterday." },
      { s: "Shruti", de: "Hast du zu schwer gehoben?", en: "Did you lift something too heavy?" },
      { s: "Sijan",  de: "Im Training, ja.", en: "At training, yes." },
      { s: "Shruti", de: "Hast du dich vorher aufgewärmt?", en: "Did you warm up first?" },
      { s: "Sijan",  de: "Ehrlich gesagt nur kurz.", en: "Honestly, only briefly." },
      { s: "Shruti", de: "Das ist immer der Fehler.", en: "That's always the mistake." },
      { s: "Sijan",  de: "Soll ich eine Pause machen?", en: "Should I take a break?" },
      { s: "Shruti", de: "Ein paar Tage nur leicht bewegen.", en: "Move gently for a few days." },
      { s: "Sijan",  de: "Spazieren gehen ist also in Ordnung?", en: "So going for a walk is fine?" },
      { s: "Shruti", de: "Ja, und abends Wärme auf den Rücken.", en: "Yes, and heat on your back in the evening." },
      { s: "Sijan",  de: "Wir haben noch das Kirschkernkissen.", en: "We've still got the cherry-stone cushion." },
      { s: "Shruti", de: "Wenn es nächste Woche noch weh tut, geh zum Arzt.", en: "If it still hurts next week, go to the doctor." }
    ]
  },

  {
    id: "c029", topic: "unterwegs",
    title: "Das Auto macht ein Geräusch",
    titleEn: "The car is making a noise",
    lines: [
      { s: "Shruti", de: "Hörst du das Geräusch vorne rechts?", en: "Can you hear that noise at the front right?" },
      { s: "Sijan",  de: "Ja, seit ein paar Tagen.", en: "Yes, for a few days now." },
      { s: "Shruti", de: "Es wird lauter, wenn du bremst.", en: "It gets louder when you brake." },
      { s: "Sijan",  de: "Vielleicht sind es die Bremsen.", en: "Maybe it's the brakes." },
      { s: "Shruti", de: "Damit solltest du nicht warten.", en: "You shouldn't wait with that." },
      { s: "Sijan",  de: "Ich rufe die Werkstatt an.", en: "I'll call the garage." },
      { s: "Shruti", de: "Die um die Ecke ist gut und nicht teuer.", en: "The one round the corner is good and not expensive." },
      { s: "Sijan",  de: "Sie haben am Donnerstag einen Termin frei.", en: "They have a free slot on Thursday." },
      { s: "Shruti", de: "Wie kommst du dann zur Arbeit?", en: "How will you get to work then?" },
      { s: "Sijan",  de: "Mit dem Zug, das ist kein Problem.", en: "By train, that's no problem." },
      { s: "Shruti", de: "Fahr bis dahin bitte vorsichtig.", en: "Please drive carefully until then." },
      { s: "Sijan",  de: "Mache ich, ich lasse das Auto lieber stehen.", en: "I will, I'd rather leave the car parked." }
    ]
  },

  {
    id: "c030", topic: "unterwegs",
    title: "Ein Zettel an der Windschutzscheibe",
    titleEn: "A ticket on the windscreen",
    lines: [
      { s: "Sijan",  de: "Da klemmt ein Zettel an der Scheibe.", en: "There's a ticket stuck on the windscreen." },
      { s: "Shruti", de: "Oh nein, ein Strafzettel?", en: "Oh no, a parking fine?" },
      { s: "Sijan",  de: "Ja, dreißig Euro.", en: "Yes, thirty euros." },
      { s: "Shruti", de: "Aber hier darf man doch parken.", en: "But you're allowed to park here." },
      { s: "Sijan",  de: "Nur mit Parkschein, steht auf dem Schild.", en: "Only with a ticket, it says on the sign." },
      { s: "Shruti", de: "Ich habe das Schild nicht gesehen.", en: "I didn't see the sign." },
      { s: "Sijan",  de: "Es steht ziemlich weit hinten.", en: "It's quite far back." },
      { s: "Shruti", de: "Können wir etwas dagegen machen?", en: "Can we do something about it?" },
      { s: "Sijan",  de: "Wahrscheinlich nicht, wir zahlen einfach.", en: "Probably not, we'll just pay." },
      { s: "Shruti", de: "Bis wann muss es bezahlt sein?", en: "By when does it have to be paid?" },
      { s: "Sijan",  de: "Innerhalb von zwei Wochen.", en: "Within two weeks." },
      { s: "Shruti", de: "Ich überweise es heute Abend.", en: "I'll transfer it this evening." },
      { s: "Sijan",  de: "Und nächstes Mal lese ich die Schilder.", en: "And next time I'll read the signs." }
    ]
  },

  {
    id: "c031", topic: "unterwegs",
    title: "Ein gebrauchtes Fahrrad kaufen",
    titleEn: "Buying a second-hand bike",
    lines: [
      { s: "Shruti", de: "Guten Tag, ich komme wegen des Fahrrads.", en: "Hello, I'm here about the bike." },
      { s: "Sijan",  de: "Ja, es steht hier in der Garage.", en: "Yes, it's here in the garage." },
      { s: "Shruti", de: "Wie alt ist es denn?", en: "How old is it?" },
      { s: "Sijan",  de: "Drei Jahre, aber wenig gefahren.", en: "Three years, but ridden very little." },
      { s: "Shruti", de: "Darf ich eine Runde fahren?", en: "May I take it for a ride?" },
      { s: "Sijan",  de: "Natürlich, fahren Sie ruhig.", en: "Of course, go ahead." },
      { s: "Shruti", de: "Die Bremsen sind ein bisschen weich.", en: "The brakes are a bit soft." },
      { s: "Sijan",  de: "Die kann man leicht einstellen.", en: "Those can be adjusted easily." },
      { s: "Shruti", de: "Was soll es kosten?", en: "What are you asking for it?" },
      { s: "Sijan",  de: "Hundertachtzig Euro.", en: "A hundred and eighty euros." },
      { s: "Shruti", de: "Hundertfünfzig, dann nehme ich es sofort.", en: "A hundred and fifty, then I'll take it straight away." },
      { s: "Sijan",  de: "Hundertsechzig, und das Schloss gebe ich dazu.", en: "A hundred and sixty, and I'll throw in the lock." },
      { s: "Shruti", de: "Abgemacht.", en: "It's a deal." }
    ]
  },

  {
    id: "c032", topic: "reisen",
    title: "Ankunft im Hotel",
    titleEn: "Arriving at the hotel",
    lines: [
      { s: "Sijan",  de: "Guten Abend, wir haben ein Zimmer reserviert.", en: "Good evening, we've reserved a room." },
      { s: "Shruti", de: "Auf welchen Namen bitte?", en: "Under what name, please?" },
      { s: "Sijan",  de: "Pahari, für zwei Nächte.", en: "Pahari, for two nights." },
      { s: "Shruti", de: "Ein Doppelzimmer mit Frühstück, richtig?", en: "A double room with breakfast, correct?" },
      { s: "Sijan",  de: "Genau. Ab wann gibt es Frühstück?", en: "Exactly. From when is breakfast served?" },
      { s: "Shruti", de: "Ab halb sieben, im Erdgeschoss.", en: "From half past six, on the ground floor." },
      { s: "Sijan",  de: "Gibt es WLAN im Zimmer?", en: "Is there wifi in the room?" },
      { s: "Shruti", de: "Ja, das Passwort steht auf der Karte.", en: "Yes, the password is on the card." },
      { s: "Sijan",  de: "Wir kommen morgen erst spät zurück.", en: "We won't be back until late tomorrow." },
      { s: "Shruti", de: "Kein Problem, die Rezeption ist rund um die Uhr besetzt.", en: "No problem, reception is staffed around the clock." },
      { s: "Sijan",  de: "Können wir das Gepäck am Abreisetag hierlassen?", en: "Can we leave our luggage here on the day we check out?" },
      { s: "Shruti", de: "Gern, wir haben einen Raum dafür.", en: "Of course, we have a room for that." },
      { s: "Sijan",  de: "Wunderbar, danke schön.", en: "Wonderful, thank you." }
    ]
  },

  {
    id: "c033", topic: "reisen",
    title: "Der Koffer ist nicht angekommen",
    titleEn: "The suitcase didn't arrive",
    lines: [
      { s: "Shruti", de: "Alle Koffer sind weg, unserer nicht.", en: "All the suitcases are gone, but not ours." },
      { s: "Sijan",  de: "Vielleicht kommt er noch.", en: "Maybe it's still coming." },
      { s: "Shruti", de: "Das Band steht schon still.", en: "The belt has already stopped." },
      { s: "Sijan",  de: "Dann melden wir es beim Schalter.", en: "Then we'll report it at the desk." },
      { s: "Shruti", de: "Hast du den Gepäckaufkleber noch?", en: "Do you still have the baggage tag?" },
      { s: "Sijan",  de: "Ja, er klebt auf dem Ticket.", en: "Yes, it's stuck on the ticket." },
      { s: "Shruti", de: "Wie sieht unser Koffer aus?", en: "What does our suitcase look like?" },
      { s: "Sijan",  de: "Groß, blau, mit einem roten Band.", en: "Big, blue, with a red ribbon." },
      { s: "Shruti", de: "Sie sagen, er kommt mit dem nächsten Flug.", en: "They say it's coming on the next flight." },
      { s: "Sijan",  de: "Und wer bringt ihn ins Hotel?", en: "And who brings it to the hotel?" },
      { s: "Shruti", de: "Sie liefern ihn morgen früh.", en: "They'll deliver it tomorrow morning." },
      { s: "Sijan",  de: "Gut, dass die Zahnbürste im Rucksack ist.", en: "Good thing the toothbrush is in the backpack." },
      { s: "Shruti", de: "Dann kaufen wir dir schnell ein T-Shirt.", en: "Then let's quickly buy you a T-shirt." }
    ]
  },

  {
    id: "c034", topic: "reisen",
    title: "Einen Ausflug planen",
    titleEn: "Planning a day trip",
    lines: [
      { s: "Sijan",  de: "Was machen wir morgen?", en: "What shall we do tomorrow?" },
      { s: "Shruti", de: "Wir könnten auf die Insel fahren.", en: "We could go over to the island." },
      { s: "Sijan",  de: "Wie kommt man dorthin?", en: "How do you get there?" },
      { s: "Shruti", de: "Mit der Fähre, sie fährt jede Stunde.", en: "By ferry, it goes every hour." },
      { s: "Sijan",  de: "Was kostet die Fahrt?", en: "How much is the crossing?" },
      { s: "Shruti", de: "Hin und zurück zwölf Euro.", en: "Twelve euros return." },
      { s: "Sijan",  de: "Wie lange dauert sie?", en: "How long does it take?" },
      { s: "Shruti", de: "Eine knappe Stunde.", en: "Just under an hour." },
      { s: "Sijan",  de: "Können wir dort Räder leihen?", en: "Can we hire bikes there?" },
      { s: "Shruti", de: "Ja, direkt am Hafen.", en: "Yes, right at the harbour." },
      { s: "Sijan",  de: "Dann nehmen wir die Fähre um neun.", en: "Then let's take the nine o'clock ferry." },
      { s: "Shruti", de: "Und abends essen wir am Wasser.", en: "And in the evening we'll eat by the water." }
    ]
  },

  {
    id: "c035", topic: "freizeit",
    title: "Ins Kino oder nicht?",
    titleEn: "Cinema or not?",
    lines: [
      { s: "Shruti", de: "Wollen wir heute ins Kino?", en: "Shall we go to the cinema today?" },
      { s: "Sijan",  de: "Was läuft denn?", en: "What's on?" },
      { s: "Shruti", de: "Ein deutscher Film, eine Komödie.", en: "A German film, a comedy." },
      { s: "Sijan",  de: "Verstehe ich den überhaupt?", en: "Will I even understand it?" },
      { s: "Shruti", de: "Es gibt Untertitel auf Englisch.", en: "There are English subtitles." },
      { s: "Sijan",  de: "Dann gern. Wann fängt er an?", en: "Then gladly. When does it start?" },
      { s: "Shruti", de: "Um zwanzig Uhr dreißig.", en: "At half past eight." },
      { s: "Sijan",  de: "Sollen wir die Karten online kaufen?", en: "Shall we buy the tickets online?" },
      { s: "Shruti", de: "Ja, sonst sind die guten Plätze weg.", en: "Yes, otherwise the good seats will be gone." },
      { s: "Sijan",  de: "Ich nehme Reihe zehn, in der Mitte.", en: "I'll take row ten, in the middle." },
      { s: "Shruti", de: "Treffen wir uns um acht davor?", en: "Shall we meet outside at eight?" },
      { s: "Sijan",  de: "Passt. Ich hole vorher noch Popcorn.", en: "Works for me. I'll get popcorn beforehand." }
    ]
  },

  {
    id: "c036", topic: "freizeit",
    title: "Im Sportverein anmelden",
    titleEn: "Joining a sports club",
    lines: [
      { s: "Sijan",  de: "Ich möchte gern mitspielen. Geht das?", en: "I'd like to join in. Is that possible?" },
      { s: "Shruti", de: "Klar, wir suchen immer Leute.", en: "Sure, we're always looking for people." },
      { s: "Sijan",  de: "Wann trainiert ihr?", en: "When do you train?" },
      { s: "Shruti", de: "Dienstags und donnerstags um neunzehn Uhr.", en: "Tuesdays and Thursdays at seven." },
      { s: "Sijan",  de: "Muss ich gleich Mitglied werden?", en: "Do I have to become a member straight away?" },
      { s: "Shruti", de: "Nein, du kannst zweimal zum Probetraining kommen.", en: "No, you can come to two trial sessions." },
      { s: "Sijan",  de: "Was kostet der Beitrag danach?", en: "What does the membership cost after that?" },
      { s: "Shruti", de: "Zwölf Euro im Monat.", en: "Twelve euros a month." },
      { s: "Sijan",  de: "Brauche ich eigene Schuhe?", en: "Do I need my own shoes?" },
      { s: "Shruti", de: "Hallenschuhe ja, alles andere haben wir.", en: "Indoor shoes yes, we have everything else." },
      { s: "Sijan",  de: "Wo genau ist die Halle?", en: "Where exactly is the hall?" },
      { s: "Shruti", de: "Hinter der Schule, der Eingang ist auf der Rückseite.", en: "Behind the school, the entrance is at the back." },
      { s: "Sijan",  de: "Dann komme ich am Dienstag.", en: "Then I'll come on Tuesday." }
    ]
  },

  {
    id: "c037", topic: "freizeit",
    title: "Karten für das Konzert",
    titleEn: "Tickets for the concert",
    lines: [
      { s: "Shruti", de: "Die Band spielt im Mai hier.", en: "The band is playing here in May." },
      { s: "Sijan",  de: "Gibt es noch Karten?", en: "Are there still tickets?" },
      { s: "Shruti", de: "Ja, aber nur teure.", en: "Yes, but only expensive ones." },
      { s: "Sijan",  de: "Wie teuer denn?", en: "How expensive?" },
      { s: "Shruti", de: "Fünfundfünfzig Euro pro Person.", en: "Fifty-five euros per person." },
      { s: "Sijan",  de: "Das ist viel für einen Abend.", en: "That's a lot for one evening." },
      { s: "Shruti", de: "Sie kommen aber selten nach Deutschland.", en: "But they rarely come to Germany." },
      { s: "Sijan",  de: "Stimmt. Wo genau spielen sie?", en: "True. Where exactly are they playing?" },
      { s: "Shruti", de: "In der Halle am Bahnhof.", en: "In the hall by the station." },
      { s: "Sijan",  de: "Dann brauchen wir kein Auto.", en: "Then we don't need a car." },
      { s: "Shruti", de: "Soll ich zwei Karten nehmen?", en: "Shall I get two tickets?" },
      { s: "Sijan",  de: "Ja, kauf sie, bevor sie ausverkauft sind.", en: "Yes, buy them before they sell out." }
    ]
  },

  {
    id: "c038", topic: "amt",
    title: "Den Führerschein umschreiben",
    titleEn: "Converting a driving licence",
    lines: [
      { s: "Sijan",  de: "Ich möchte meinen Führerschein umschreiben lassen.", en: "I'd like to have my driving licence converted." },
      { s: "Shruti", de: "Aus welchem Land ist er?", en: "Which country is it from?" },
      { s: "Sijan",  de: "Aus Nepal.", en: "From Nepal." },
      { s: "Shruti", de: "Dann brauchen Sie eine Übersetzung.", en: "Then you need a translation." },
      { s: "Sijan",  de: "Die habe ich schon machen lassen.", en: "I've already had that done." },
      { s: "Shruti", de: "Sehr gut. Und ein biometrisches Foto?", en: "Very good. And a biometric photo?" },
      { s: "Sijan",  de: "Ja, hier sind zwei.", en: "Yes, here are two." },
      { s: "Shruti", de: "Sie müssen leider auch eine Prüfung machen.", en: "Unfortunately you also have to take a test." },
      { s: "Sijan",  de: "Theorie und Praxis?", en: "Theory and practical?" },
      { s: "Shruti", de: "Ja, beides.", en: "Yes, both." },
      { s: "Sijan",  de: "Wie lange dauert das Ganze?", en: "How long does the whole thing take?" },
      { s: "Shruti", de: "Mit der Prüfung ungefähr drei Monate.", en: "With the test, about three months." },
      { s: "Sijan",  de: "Dann melde ich mich gleich bei einer Fahrschule an.", en: "Then I'll sign up at a driving school right away." }
    ]
  },

  {
    id: "c039", topic: "amt",
    title: "Ein Konto eröffnen",
    titleEn: "Opening a bank account",
    lines: [
      { s: "Shruti", de: "Guten Tag, ich möchte ein Konto eröffnen.", en: "Hello, I'd like to open an account." },
      { s: "Sijan",  de: "Gern. Haben Sie einen Ausweis dabei?", en: "Certainly. Do you have ID with you?" },
      { s: "Shruti", de: "Ja, meinen Pass und die Anmeldung.", en: "Yes, my passport and the registration form." },
      { s: "Sijan",  de: "Arbeiten Sie hier in der Stadt?", en: "Do you work here in town?" },
      { s: "Shruti", de: "Ja, seit zwei Monaten.", en: "Yes, for two months." },
      { s: "Sijan",  de: "Möchten Sie ein Girokonto?", en: "Would you like a current account?" },
      { s: "Shruti", de: "Ja, für Gehalt und Miete.", en: "Yes, for salary and rent." },
      { s: "Sijan",  de: "Es kostet vier Euro im Monat.", en: "It costs four euros a month." },
      { s: "Shruti", de: "Ist eine Karte dabei?", en: "Is a card included?" },
      { s: "Sijan",  de: "Ja, sie kommt in einer Woche per Post.", en: "Yes, it comes by post within a week." },
      { s: "Shruti", de: "Und die PIN?", en: "And the PIN?" },
      { s: "Sijan",  de: "Die kommt getrennt, aus Sicherheitsgründen.", en: "That comes separately, for security reasons." },
      { s: "Shruti", de: "Alles klar. Wo unterschreibe ich?", en: "Understood. Where do I sign?" }
    ]
  },

  {
    id: "c040", topic: "amt",
    title: "Ein Brief vom Amt",
    titleEn: "A letter from the authorities",
    lines: [
      { s: "Sijan",  de: "Da war Post vom Amt im Briefkasten.", en: "There was mail from the authorities in the letterbox." },
      { s: "Shruti", de: "Was steht drin?", en: "What does it say?" },
      { s: "Sijan",  de: "Ich verstehe nur die Hälfte.", en: "I only understand half of it." },
      { s: "Shruti", de: "Lies mir den ersten Satz vor.", en: "Read me the first sentence." },
      { s: "Sijan",  de: "Sie brauchen noch eine Bescheinigung von mir.", en: "They still need a certificate from me." },
      { s: "Shruti", de: "Welche denn?", en: "Which one?" },
      { s: "Sijan",  de: "Vom Arbeitgeber, wegen des Gehalts.", en: "From my employer, about my salary." },
      { s: "Shruti", de: "Das bekommst du sicher schnell.", en: "You'll surely get that quickly." },
      { s: "Sijan",  de: "Bis wann muss ich sie schicken?", en: "By when do I have to send it?" },
      { s: "Shruti", de: "Steht da ein Datum?", en: "Is there a date?" },
      { s: "Sijan",  de: "Ja, bis zum fünfzehnten.", en: "Yes, by the fifteenth." },
      { s: "Shruti", de: "Dann frag morgen in der Personalabteilung.", en: "Then ask in the HR department tomorrow." },
      { s: "Sijan",  de: "Gute Idee, das mache ich gleich früh.", en: "Good idea, I'll do that first thing." }
    ]
  },

  {
    id: "c041", topic: "telefon",
    title: "Einen Termin verschieben",
    titleEn: "Postponing an appointment",
    lines: [
      { s: "Sijan",  de: "Guten Tag, hier spricht Sijan Pahari.", en: "Hello, this is Sijan Pahari speaking." },
      { s: "Shruti", de: "Guten Tag, was kann ich für Sie tun?", en: "Hello, what can I do for you?" },
      { s: "Sijan",  de: "Ich habe morgen um zehn einen Termin.", en: "I have an appointment tomorrow at ten." },
      { s: "Shruti", de: "Einen Moment, ich schaue nach.", en: "One moment, I'll check." },
      { s: "Sijan",  de: "Leider muss ich ihn verschieben.", en: "Unfortunately I have to postpone it." },
      { s: "Shruti", de: "Kein Problem. Wann passt es Ihnen?", en: "No problem. When suits you?" },
      { s: "Sijan",  de: "Am besten nächste Woche nachmittags.", en: "Preferably next week in the afternoon." },
      { s: "Shruti", de: "Mittwoch um vierzehn Uhr?", en: "Wednesday at two o'clock?" },
      { s: "Sijan",  de: "Da arbeite ich noch.", en: "I'm still at work then." },
      { s: "Shruti", de: "Und Donnerstag um sechzehn Uhr?", en: "And Thursday at four?" },
      { s: "Sijan",  de: "Das passt gut.", en: "That works well." },
      { s: "Shruti", de: "Ich habe es eingetragen.", en: "I've put it in the diary." },
      { s: "Sijan",  de: "Vielen Dank und einen schönen Tag.", en: "Thank you very much and have a nice day." }
    ]
  },

  {
    id: "c042", topic: "telefon",
    title: "Falsch verbunden",
    titleEn: "Wrong number",
    lines: [
      { s: "Shruti", de: "Müller, guten Tag?", en: "Müller speaking, hello?" },
      { s: "Sijan",  de: "Guten Tag, ich möchte Herrn Weber sprechen.", en: "Hello, I'd like to speak to Mr Weber." },
      { s: "Shruti", de: "Hier ist kein Herr Weber.", en: "There's no Mr Weber here." },
      { s: "Sijan",  de: "Ist das nicht die Nummer der Werkstatt?", en: "Isn't this the garage's number?" },
      { s: "Shruti", de: "Nein, Sie sind bei einer Privatperson.", en: "No, you've reached a private number." },
      { s: "Sijan",  de: "Entschuldigung, ich habe mich wohl vertippt.", en: "Sorry, I must have mistyped." },
      { s: "Shruti", de: "Das passiert, kein Problem.", en: "That happens, no problem." },
      { s: "Sijan",  de: "Welche Nummer habe ich denn gewählt?", en: "Which number did I dial?" },
      { s: "Shruti", de: "Die endet auf siebenundvierzig.", en: "It ends in forty-seven." },
      { s: "Sijan",  de: "Ah, ich brauche die auf vierundsiebzig.", en: "Ah, I need the one ending in seventy-four." },
      { s: "Shruti", de: "Dann versuchen Sie es noch einmal.", en: "Then try again." },
      { s: "Sijan",  de: "Danke und entschuldigen Sie die Störung.", en: "Thanks, and sorry for disturbing you." }
    ]
  },

  {
    id: "c043", topic: "telefon",
    title: "Eine Nachricht hinterlassen",
    titleEn: "Leaving a message",
    lines: [
      { s: "Sijan",  de: "Guten Morgen, ist Frau Klein im Haus?", en: "Good morning, is Mrs Klein in?" },
      { s: "Shruti", de: "Sie ist gerade in einer Besprechung.", en: "She's in a meeting right now." },
      { s: "Sijan",  de: "Wann ist sie wieder erreichbar?", en: "When will she be available again?" },
      { s: "Shruti", de: "Voraussichtlich ab elf.", en: "Probably from eleven." },
      { s: "Sijan",  de: "Kann ich eine Nachricht hinterlassen?", en: "Can I leave a message?" },
      { s: "Shruti", de: "Natürlich, ich notiere es.", en: "Of course, I'll write it down." },
      { s: "Sijan",  de: "Es geht um die Lieferung am Freitag.", en: "It's about the delivery on Friday." },
      { s: "Shruti", de: "Soll sie zurückrufen?", en: "Should she call you back?" },
      { s: "Sijan",  de: "Ja bitte, auf meinem Handy.", en: "Yes please, on my mobile." },
      { s: "Shruti", de: "Wie ist die Nummer?", en: "What's the number?" },
      { s: "Sijan",  de: "Null eins sieben sechs, dann drei zwei vier eins.", en: "Zero one seven six, then three two four one." },
      { s: "Shruti", de: "Ich lese es zurück: null eins sieben sechs, drei zwei vier eins.", en: "Let me read that back: zero one seven six, three two four one." },
      { s: "Sijan",  de: "Genau richtig. Vielen Dank.", en: "Exactly right. Thank you very much." }
    ]
  },

  {
    id: "c044", topic: "telefon",
    title: "Internet funktioniert nicht",
    titleEn: "The internet isn't working",
    lines: [
      { s: "Shruti", de: "Kundendienst, guten Tag.", en: "Customer service, hello." },
      { s: "Sijan",  de: "Guten Tag, mein Internet geht seit gestern nicht.", en: "Hello, my internet hasn't worked since yesterday." },
      { s: "Shruti", de: "Leuchtet eine rote Lampe am Router?", en: "Is there a red light on the router?" },
      { s: "Sijan",  de: "Ja, die mittlere blinkt rot.", en: "Yes, the middle one is flashing red." },
      { s: "Shruti", de: "Haben Sie den Router schon neu gestartet?", en: "Have you restarted the router?" },
      { s: "Sijan",  de: "Dreimal, es ändert sich nichts.", en: "Three times, nothing changes." },
      { s: "Shruti", de: "Ich prüfe die Leitung. Einen Moment bitte.", en: "I'll check the line. One moment please." },
      { s: "Sijan",  de: "Kein Problem, ich warte.", en: "No problem, I'll wait." },
      { s: "Shruti", de: "Es gibt eine Störung in Ihrer Straße.", en: "There's a fault in your street." },
      { s: "Sijan",  de: "Wie lange dauert die Reparatur?", en: "How long will the repair take?" },
      { s: "Shruti", de: "Bis morgen Abend, sagen die Kollegen.", en: "Until tomorrow evening, my colleagues say." },
      { s: "Sijan",  de: "Dann arbeite ich morgen im Büro.", en: "Then I'll work at the office tomorrow." },
      { s: "Shruti", de: "Wir schicken Ihnen eine SMS, wenn es läuft.", en: "We'll send you a text when it's working." }
    ]
  },

  {
    id: "c045", topic: "telefon",
    title: "Eine Verabredung absagen",
    titleEn: "Cancelling plans",
    lines: [
      { s: "Sijan",  de: "Hallo Shruti, hast du kurz Zeit?", en: "Hi Shruti, do you have a moment?" },
      { s: "Shruti", de: "Klar, was gibt's?", en: "Sure, what's up?" },
      { s: "Sijan",  de: "Es tut mir leid, heute Abend klappt es nicht.", en: "I'm sorry, this evening isn't going to work." },
      { s: "Shruti", de: "Oh, schade. Was ist passiert?", en: "Oh, that's a shame. What happened?" },
      { s: "Sijan",  de: "Ich muss länger arbeiten.", en: "I have to work late." },
      { s: "Shruti", de: "Bis wann denn?", en: "Until when?" },
      { s: "Sijan",  de: "Wahrscheinlich bis acht.", en: "Probably until eight." },
      { s: "Shruti", de: "Dann wird es wirklich zu spät.", en: "Then it really would be too late." },
      { s: "Sijan",  de: "Können wir es auf morgen verschieben?", en: "Can we move it to tomorrow?" },
      { s: "Shruti", de: "Morgen habe ich Sport bis sieben.", en: "Tomorrow I have sport until seven." },
      { s: "Sijan",  de: "Dann eben Samstag?", en: "Saturday then?" },
      { s: "Shruti", de: "Samstag passt mir gut.", en: "Saturday suits me well." },
      { s: "Sijan",  de: "Super, dann melde ich mich Freitag noch mal.", en: "Great, I'll get in touch again on Friday." }
    ]
  },

  {
    id: "c046", topic: "telefon",
    title: "Einen Tisch reservieren",
    titleEn: "Booking a table",
    lines: [
      { s: "Shruti", de: "Restaurant Adler, guten Tag.", en: "Restaurant Adler, hello." },
      { s: "Sijan",  de: "Guten Tag, ich möchte einen Tisch reservieren.", en: "Hello, I'd like to book a table." },
      { s: "Shruti", de: "Für wann und für wie viele Personen?", en: "For when and for how many people?" },
      { s: "Sijan",  de: "Für Samstag, vier Personen.", en: "For Saturday, four people." },
      { s: "Shruti", de: "Um wie viel Uhr?", en: "At what time?" },
      { s: "Sijan",  de: "Gegen neunzehn Uhr.", en: "Around seven." },
      { s: "Shruti", de: "Da ist es leider schon voll.", en: "Unfortunately we're already full then." },
      { s: "Sijan",  de: "Und um halb neun?", en: "And at half past eight?" },
      { s: "Shruti", de: "Das geht, aber nur bis halb elf.", en: "That works, but only until half past ten." },
      { s: "Sijan",  de: "Das reicht uns völlig.", en: "That's plenty for us." },
      { s: "Shruti", de: "Auf welchen Namen?", en: "Under what name?" },
      { s: "Sijan",  de: "Pahari, P-A-H-A-R-I.", en: "Pahari, P-A-H-A-R-I." },
      { s: "Shruti", de: "Notiert. Bis Samstag!", en: "Noted. See you Saturday!" }
    ]
  },

  {
    id: "c047", topic: "familie",
    title: "Geschenk für die Schwester",
    titleEn: "A present for my sister",
    lines: [
      { s: "Sijan",  de: "Meine Schwester hat nächste Woche Geburtstag.", en: "My sister has her birthday next week." },
      { s: "Shruti", de: "Weißt du schon, was du ihr schenkst?", en: "Do you already know what you're giving her?" },
      { s: "Sijan",  de: "Überhaupt nicht.", en: "Not at all." },
      { s: "Shruti", de: "Was macht sie gern?", en: "What does she like doing?" },
      { s: "Sijan",  de: "Sie liest viel und kocht gern.", en: "She reads a lot and likes cooking." },
      { s: "Shruti", de: "Dann ein Kochbuch?", en: "A cookbook then?" },
      { s: "Sijan",  de: "Sie hat schon so viele.", en: "She's already got so many." },
      { s: "Shruti", de: "Und etwas für die Küche?", en: "And something for the kitchen?" },
      { s: "Sijan",  de: "Eine gute Pfanne vielleicht.", en: "A good pan, maybe." },
      { s: "Shruti", de: "Das ist praktisch und hält lange.", en: "That's practical and lasts a long time." },
      { s: "Sijan",  de: "Kommst du morgen mit in die Stadt?", en: "Will you come into town with me tomorrow?" },
      { s: "Shruti", de: "Gern, nach der Arbeit.", en: "Gladly, after work." },
      { s: "Sijan",  de: "Und eine Karte schreiben wir zusammen.", en: "And we'll write a card together." }
    ]
  },

  {
    id: "c048", topic: "familie",
    title: "Video-Anruf nach Hause",
    titleEn: "A video call home",
    lines: [
      { s: "Shruti", de: "Hörst du mich gut?", en: "Can you hear me clearly?" },
      { s: "Sijan",  de: "Ja, aber das Bild ruckelt.", en: "Yes, but the picture is stuttering." },
      { s: "Shruti", de: "Das Internet ist hier nicht so stark.", en: "The internet isn't that strong here." },
      { s: "Sijan",  de: "Wie geht es allen zu Hause?", en: "How is everyone at home?" },
      { s: "Shruti", de: "Gut. Papa arbeitet wieder im Garten.", en: "Good. Dad is working in the garden again." },
      { s: "Sijan",  de: "Und Oma?", en: "And Grandma?" },
      { s: "Shruti", de: "Sie fragt jede Woche nach dir.", en: "She asks about you every week." },
      { s: "Sijan",  de: "Sag ihr, ich komme im Sommer.", en: "Tell her I'm coming in the summer." },
      { s: "Shruti", de: "Sie wird sich sehr freuen.", en: "She'll be really pleased." },
      { s: "Sijan",  de: "Wie ist das Wetter bei euch?", en: "What's the weather like where you are?" },
      { s: "Shruti", de: "Warm, fast dreißig Grad.", en: "Warm, almost thirty degrees." },
      { s: "Sijan",  de: "Hier regnet es seit drei Tagen.", en: "It's been raining here for three days." },
      { s: "Shruti", de: "Wir telefonieren am Sonntag wieder.", en: "We'll talk again on Sunday." }
    ]
  },

  {
    id: "c049", topic: "familie",
    title: "Besuch am Wochenende",
    titleEn: "Visitors at the weekend",
    lines: [
      { s: "Sijan",  de: "Meine Eltern kommen am Samstag.", en: "My parents are coming on Saturday." },
      { s: "Shruti", de: "Wie lange bleiben sie?", en: "How long are they staying?" },
      { s: "Sijan",  de: "Zwei Nächte.", en: "Two nights." },
      { s: "Shruti", de: "Wo schlafen sie denn?", en: "Where will they sleep?" },
      { s: "Sijan",  de: "Im Arbeitszimmer, dort steht das Gästebett.", en: "In the study, the guest bed is in there." },
      { s: "Shruti", de: "Dann müssen wir dort aufräumen.", en: "Then we need to tidy up in there." },
      { s: "Sijan",  de: "Das mache ich am Freitagabend.", en: "I'll do that on Friday evening." },
      { s: "Shruti", de: "Was kochen wir am Samstag?", en: "What shall we cook on Saturday?" },
      { s: "Sijan",  de: "Meine Mutter isst kein scharfes Essen.", en: "My mother doesn't eat spicy food." },
      { s: "Shruti", de: "Dann mache ich es mild und stelle Chili dazu.", en: "Then I'll make it mild and put chilli on the side." },
      { s: "Sijan",  de: "Perfekt. Am Sonntag zeigen wir ihnen die Stadt.", en: "Perfect. On Sunday we'll show them the town." },
      { s: "Shruti", de: "Und nachmittags gehen wir an den See.", en: "And in the afternoon we'll go to the lake." }
    ]
  },

  {
    id: "c050", topic: "familie", couple: true,
    title: "Streit um die Hausarbeit",
    titleEn: "An argument about the housework",
    lines: [
      { s: "Shruti", de: "Die Küche sieht schon wieder furchtbar aus.", en: "The kitchen looks terrible again." },
      { s: "Sijan",  de: "Ich hatte gestern wirklich keine Zeit.", en: "I honestly had no time yesterday." },
      { s: "Shruti", de: "Das sagst du jede Woche.", en: "You say that every week." },
      { s: "Sijan",  de: "Du hast recht, das stimmt.", en: "You're right, that's true." },
      { s: "Shruti", de: "Ich mache fast alles allein.", en: "I do almost everything on my own." },
      { s: "Sijan",  de: "Das ist nicht fair, entschuldige.", en: "That isn't fair, I'm sorry." },
      { s: "Shruti", de: "Sollen wir einen Plan machen?", en: "Shall we make a plan?" },
      { s: "Sijan",  de: "Gute Idee. Ich übernehme Küche und Müll.", en: "Good idea. I'll take the kitchen and the bins." },
      { s: "Shruti", de: "Und ich das Bad und die Wäsche.", en: "And I'll take the bathroom and the washing." },
      { s: "Sijan",  de: "Den Boden machen wir zusammen.", en: "We'll do the floors together." },
      { s: "Shruti", de: "Sonntags, nach dem Frühstück?", en: "On Sundays, after breakfast?" },
      { s: "Sijan",  de: "Abgemacht. Ich will nicht, dass du dich ärgerst.", en: "Agreed. I don't want you getting upset." }
    ]
  },

  {
    id: "c051", topic: "familie",
    title: "Ein neuer Nachbar",
    titleEn: "A new neighbour",
    lines: [
      { s: "Sijan",  de: "Hallo, ich glaube, Sie sind neu hier.", en: "Hello, I think you're new here." },
      { s: "Shruti", de: "Ja, ich bin gestern eingezogen.", en: "Yes, I moved in yesterday." },
      { s: "Sijan",  de: "Willkommen! Ich wohne im zweiten Stock.", en: "Welcome! I live on the second floor." },
      { s: "Shruti", de: "Freut mich. Ich bin Shruti.", en: "Nice to meet you. I'm Shruti." },
      { s: "Sijan",  de: "Sijan. Kommen Sie aus der Gegend?", en: "Sijan. Are you from around here?" },
      { s: "Shruti", de: "Nein, aus Hamburg. Wegen der Arbeit.", en: "No, from Hamburg. Because of work." },
      { s: "Sijan",  de: "Haben Sie schon alles gefunden?", en: "Have you found everything yet?" },
      { s: "Shruti", de: "Wo ist denn hier der nächste Supermarkt?", en: "Where's the nearest supermarket?" },
      { s: "Sijan",  de: "Zwei Straßen weiter, neben der Apotheke.", en: "Two streets further, next to the pharmacy." },
      { s: "Shruti", de: "Und die Mülltonnen?", en: "And the bins?" },
      { s: "Sijan",  de: "Hinter dem Haus. Papier ist blau.", en: "Behind the building. Paper is blue." },
      { s: "Shruti", de: "Danke, das hilft mir sehr.", en: "Thanks, that helps a lot." },
      { s: "Sijan",  de: "Wenn etwas ist, klingeln Sie einfach.", en: "If anything comes up, just ring the bell." }
    ]
  },

  {
    id: "c052", topic: "familie",
    title: "Die Kinder der Nachbarn hüten",
    titleEn: "Looking after the neighbours' children",
    lines: [
      { s: "Shruti", de: "Kannst du heute Abend auf Mia aufpassen?", en: "Can you look after Mia this evening?" },
      { s: "Sijan",  de: "Wie alt ist sie noch mal?", en: "How old is she again?" },
      { s: "Shruti", de: "Sechs, sie ist ganz ruhig.", en: "Six, she's very calm." },
      { s: "Sijan",  de: "Von wann bis wann denn?", en: "From when to when?" },
      { s: "Shruti", de: "Von sieben bis etwa zehn.", en: "From seven until about ten." },
      { s: "Sijan",  de: "Hat sie schon gegessen?", en: "Has she already eaten?" },
      { s: "Shruti", de: "Ja, sie braucht nur noch eine Geschichte.", en: "Yes, she just needs a story." },
      { s: "Sijan",  de: "Mein Deutsch reicht für ein Kinderbuch.", en: "My German is good enough for a children's book." },
      { s: "Shruti", de: "Sie hilft dir bestimmt bei den Wörtern.", en: "She'll definitely help you with the words." },
      { s: "Sijan",  de: "Wann muss sie ins Bett?", en: "When does she have to go to bed?" },
      { s: "Shruti", de: "Um halb neun, sonst ist sie morgen müde.", en: "At half past eight, otherwise she's tired tomorrow." },
      { s: "Sijan",  de: "Alles klar, das schaffe ich.", en: "Alright, I can manage that." }
    ]
  },

  {
    id: "c053", topic: "lernen",
    title: "Im Deutschkurs",
    titleEn: "In the German class",
    lines: [
      { s: "Sijan",  de: "Entschuldigung, ich habe die Aufgabe nicht verstanden.", en: "Excuse me, I didn't understand the exercise." },
      { s: "Shruti", de: "Welche Nummer genau?", en: "Which number exactly?" },
      { s: "Sijan",  de: "Nummer drei, auf Seite achtzehn.", en: "Number three, on page eighteen." },
      { s: "Shruti", de: "Da sollen Sie das Perfekt bilden.", en: "There you're supposed to form the Perfekt." },
      { s: "Sijan",  de: "Mit haben oder mit sein?", en: "With haben or with sein?" },
      { s: "Shruti", de: "Bei Bewegung meistens mit sein.", en: "With movement, usually with sein." },
      { s: "Sijan",  de: "Also: ich bin nach Hause gegangen?", en: "So: ich bin nach Hause gegangen?" },
      { s: "Shruti", de: "Genau richtig.", en: "Exactly right." },
      { s: "Sijan",  de: "Und bei essen?", en: "And with essen?" },
      { s: "Shruti", de: "Da nehmen Sie haben: ich habe gegessen.", en: "There you take haben: ich habe gegessen." },
      { s: "Sijan",  de: "Gibt es dafür eine Liste?", en: "Is there a list for that?" },
      { s: "Shruti", de: "Ja, hinten im Buch, Seite hundertzwei.", en: "Yes, at the back of the book, page a hundred and two." },
      { s: "Sijan",  de: "Danke, das übe ich heute Abend.", en: "Thanks, I'll practise that this evening." }
    ]
  },

  {
    id: "c054", topic: "lernen",
    title: "Vor der Prüfung",
    titleEn: "Before the exam",
    lines: [
      { s: "Shruti", de: "Wann ist deine Prüfung?", en: "When is your exam?" },
      { s: "Sijan",  de: "Am Montag um neun.", en: "On Monday at nine." },
      { s: "Shruti", de: "Bist du nervös?", en: "Are you nervous?" },
      { s: "Sijan",  de: "Ein bisschen, besonders wegen des Sprechens.", en: "A bit, especially about the speaking." },
      { s: "Shruti", de: "Wollen wir zusammen üben?", en: "Shall we practise together?" },
      { s: "Sijan",  de: "Gern. Ich muss mich vorstellen und ein Bild beschreiben.", en: "Gladly. I have to introduce myself and describe a picture." },
      { s: "Shruti", de: "Dann fangen wir mit der Vorstellung an.", en: "Then let's start with the introduction." },
      { s: "Sijan",  de: "Ich heiße Sijan und wohne seit einem Jahr hier.", en: "My name is Sijan and I've lived here for a year." },
      { s: "Shruti", de: "Sag auch etwas über deine Arbeit.", en: "Say something about your work as well." },
      { s: "Sijan",  de: "Ich arbeite als Ingenieur in einer Firma.", en: "I work as an engineer at a company." },
      { s: "Shruti", de: "Sehr gut, sprich nur etwas langsamer.", en: "Very good, just speak a little more slowly." },
      { s: "Sijan",  de: "Machen wir morgen noch mal weiter?", en: "Shall we carry on again tomorrow?" },
      { s: "Shruti", de: "Ja, jeden Abend eine halbe Stunde.", en: "Yes, half an hour every evening." }
    ]
  },

  {
    id: "c055", topic: "lernen",
    title: "Ein neues Wort",
    titleEn: "A new word",
    lines: [
      { s: "Sijan",  de: "Was heißt eigentlich Feierabend?", en: "What does Feierabend actually mean?" },
      { s: "Shruti", de: "Das Ende des Arbeitstages.", en: "The end of the working day." },
      { s: "Sijan",  de: "Also so etwas wie Freizeit?", en: "So something like free time?" },
      { s: "Shruti", de: "Nicht ganz. Es ist der Moment, wenn die Arbeit endet.", en: "Not quite. It's the moment when work ends." },
      { s: "Sijan",  de: "Kann ich sagen: Ich mache jetzt Feierabend?", en: "Can I say: Ich mache jetzt Feierabend?" },
      { s: "Shruti", de: "Ja, genau so sagt man das.", en: "Yes, that's exactly how you say it." },
      { s: "Sijan",  de: "Und wenn jemand nach Hause geht?", en: "And when someone goes home?" },
      { s: "Shruti", de: "Dann wünscht man schönen Feierabend.", en: "Then you wish them a nice evening off." },
      { s: "Sijan",  de: "Gibt es das Wort auf Englisch?", en: "Is there that word in English?" },
      { s: "Shruti", de: "Nicht wirklich, das ist typisch deutsch.", en: "Not really, that's typically German." },
      { s: "Sijan",  de: "Solche Wörter mag ich.", en: "I like words like that." },
      { s: "Shruti", de: "Schreib es dir gleich auf.", en: "Write it down straight away." }
    ]
  },

  {
    id: "c056", topic: "lernen",
    title: "Welcher Artikel ist richtig?",
    titleEn: "Which article is correct?",
    lines: [
      { s: "Sijan",  de: "Heißt es der oder das Butter?", en: "Is it der or das Butter?" },
      { s: "Shruti", de: "Weder noch, es heißt die Butter.", en: "Neither, it's die Butter." },
      { s: "Sijan",  de: "Die Artikel sind mein größtes Problem.", en: "The articles are my biggest problem." },
      { s: "Shruti", de: "Es gibt ein paar Regeln.", en: "There are a few rules." },
      { s: "Sijan",  de: "Zum Beispiel?", en: "For example?" },
      { s: "Shruti", de: "Wörter auf -ung sind fast immer feminin.", en: "Words ending in -ung are almost always feminine." },
      { s: "Sijan",  de: "Also die Wohnung, die Rechnung?", en: "So die Wohnung, die Rechnung?" },
      { s: "Shruti", de: "Genau. Und -chen ist immer neutrum.", en: "Exactly. And -chen is always neuter." },
      { s: "Sijan",  de: "Das Mädchen, obwohl es ein Mädchen ist?", en: "Das Mädchen, even though it's a girl?" },
      { s: "Shruti", de: "Ja, die Endung entscheidet, nicht die Person.", en: "Yes, the ending decides, not the person." },
      { s: "Sijan",  de: "Das muss ich mir merken.", en: "I need to remember that." },
      { s: "Shruti", de: "Lern neue Wörter am besten immer mit dem Artikel.", en: "It's best to always learn new words with the article." }
    ]
  },

  {
    id: "c057", topic: "lernen",
    title: "Deutsch im Alltag üben",
    titleEn: "Practising German in daily life",
    lines: [
      { s: "Shruti", de: "Wie übst du außerhalb vom Kurs?", en: "How do you practise outside of class?" },
      { s: "Sijan",  de: "Ich höre morgens Radio.", en: "I listen to the radio in the morning." },
      { s: "Shruti", de: "Verstehst du schon viel?", en: "Do you understand much yet?" },
      { s: "Sijan",  de: "Die Nachrichten sind zu schnell.", en: "The news is too fast." },
      { s: "Shruti", de: "Probier mal Nachrichten in einfacher Sprache.", en: "Try the news in simple language." },
      { s: "Sijan",  de: "Gibt es das wirklich?", en: "Does that really exist?" },
      { s: "Shruti", de: "Ja, jeden Tag, ungefähr zehn Minuten.", en: "Yes, every day, about ten minutes." },
      { s: "Sijan",  de: "Und was machst du mit neuen Wörtern?", en: "And what do you do with new words?" },
      { s: "Shruti", de: "Ich schreibe sie auf kleine Karten.", en: "I write them on small cards." },
      { s: "Sijan",  de: "Ich benutze eine App auf dem Handy.", en: "I use an app on my phone." },
      { s: "Shruti", de: "Das Wichtigste ist jeden Tag ein bisschen.", en: "The main thing is a little every day." },
      { s: "Sijan",  de: "Zehn Minuten schaffe ich immer.", en: "I can always manage ten minutes." }
    ]
  },

  {
    id: "c058", topic: "lernen",
    title: "Sprechen Sie bitte langsamer",
    titleEn: "Please speak more slowly",
    lines: [
      { s: "Shruti", de: "Haben Sie das verstanden?", en: "Did you understand that?" },
      { s: "Sijan",  de: "Entschuldigung, können Sie das wiederholen?", en: "Sorry, could you repeat that?" },
      { s: "Shruti", de: "Natürlich. Ich habe zu schnell gesprochen.", en: "Of course. I spoke too fast." },
      { s: "Sijan",  de: "Könnten Sie bitte etwas langsamer sprechen?", en: "Could you please speak a bit more slowly?" },
      { s: "Shruti", de: "Gern. Sagen Sie einfach Bescheid.", en: "Gladly. Just let me know." },
      { s: "Sijan",  de: "Ein Wort kenne ich nicht: Anmeldung.", en: "There's one word I don't know: Anmeldung." },
      { s: "Shruti", de: "Das ist die Registrierung bei der Stadt.", en: "That's the registration with the city." },
      { s: "Sijan",  de: "Ah, jetzt verstehe ich.", en: "Ah, now I understand." },
      { s: "Shruti", de: "Soll ich es Ihnen aufschreiben?", en: "Shall I write it down for you?" },
      { s: "Sijan",  de: "Ja bitte, das hilft mir sehr.", en: "Yes please, that helps me a lot." },
      { s: "Shruti", de: "Ihr Deutsch ist übrigens schon gut.", en: "Your German is quite good already, by the way." },
      { s: "Sijan",  de: "Danke, ich lerne seit einem Jahr.", en: "Thanks, I've been learning for a year." }
    ]
  },

  {
    id: "c059", topic: "technik",
    title: "Das Handy lädt nicht",
    titleEn: "The phone won't charge",
    lines: [
      { s: "Sijan",  de: "Mein Handy lädt seit gestern nicht.", en: "My phone hasn't charged since yesterday." },
      { s: "Shruti", de: "Hast du ein anderes Kabel probiert?", en: "Have you tried a different cable?" },
      { s: "Sijan",  de: "Ja, mit deinem geht es auch nicht.", en: "Yes, it doesn't work with yours either." },
      { s: "Shruti", de: "Dann liegt es nicht am Kabel.", en: "Then it isn't the cable." },
      { s: "Sijan",  de: "Vielleicht ist der Anschluss schmutzig.", en: "Maybe the socket is dirty." },
      { s: "Shruti", de: "Das kommt oft vor, gerade in der Hosentasche.", en: "That happens often, especially in a trouser pocket." },
      { s: "Sijan",  de: "Wie macht man ihn sauber?", en: "How do you clean it?" },
      { s: "Shruti", de: "Ganz vorsichtig mit einem Zahnstocher.", en: "Very carefully with a toothpick." },
      { s: "Sijan",  de: "Da ist wirklich viel Staub drin.", en: "There really is a lot of dust in there." },
      { s: "Shruti", de: "Probier es jetzt noch mal.", en: "Try it again now." },
      { s: "Sijan",  de: "Es lädt! Du hast mir viel Geld gespart.", en: "It's charging! You've saved me a lot of money." },
      { s: "Shruti", de: "Gern. Aber kauf trotzdem mal ein neues Kabel.", en: "You're welcome. But do buy a new cable anyway." }
    ]
  },

  {
    id: "c060", topic: "technik",
    title: "Passwort vergessen",
    titleEn: "Forgotten password",
    lines: [
      { s: "Shruti", de: "Ich komme nicht in mein Konto.", en: "I can't get into my account." },
      { s: "Sijan",  de: "Falsches Passwort?", en: "Wrong password?" },
      { s: "Shruti", de: "Ich habe es dreimal versucht.", en: "I've tried it three times." },
      { s: "Sijan",  de: "Pass auf, sonst wird es gesperrt.", en: "Be careful, otherwise it gets locked." },
      { s: "Shruti", de: "Was mache ich jetzt?", en: "What do I do now?" },
      { s: "Sijan",  de: "Klick auf Passwort vergessen.", en: "Click on forgotten password." },
      { s: "Shruti", de: "Dann kommt eine Mail, oder?", en: "Then an email comes, right?" },
      { s: "Sijan",  de: "Ja, mit einem Link zum Zurücksetzen.", en: "Yes, with a link to reset it." },
      { s: "Shruti", de: "Sie ist da. Welches Passwort nehme ich?", en: "It's here. Which password should I choose?" },
      { s: "Sijan",  de: "Etwas Langes, das du dir merken kannst.", en: "Something long that you can remember." },
      { s: "Shruti", de: "Und nicht den Namen der Katze?", en: "And not the cat's name?" },
      { s: "Sijan",  de: "Genau das nicht.", en: "Exactly that, no." },
      { s: "Shruti", de: "Diesmal schreibe ich es mir auf.", en: "This time I'm writing it down." }
    ]
  },

  {
    id: "c061", topic: "technik",
    title: "Der Drucker streikt",
    titleEn: "The printer is playing up",
    lines: [
      { s: "Sijan",  de: "Der Drucker macht gar nichts.", en: "The printer isn't doing anything at all." },
      { s: "Shruti", de: "Ist er überhaupt an?", en: "Is it even switched on?" },
      { s: "Sijan",  de: "Ja, die grüne Lampe leuchtet.", en: "Yes, the green light is on." },
      { s: "Shruti", de: "Und das Papier?", en: "And the paper?" },
      { s: "Sijan",  de: "Das Fach ist voll.", en: "The tray is full." },
      { s: "Shruti", de: "Vielleicht ist er nicht verbunden.", en: "Maybe it isn't connected." },
      { s: "Sijan",  de: "Am Computer steht offline.", en: "The computer says offline." },
      { s: "Shruti", de: "Dann starte beide neu.", en: "Then restart both of them." },
      { s: "Sijan",  de: "Zuerst den Drucker oder den Computer?", en: "The printer first or the computer?" },
      { s: "Shruti", de: "Erst den Drucker, dann den Computer.", en: "The printer first, then the computer." },
      { s: "Sijan",  de: "Jetzt druckt er wieder.", en: "Now it's printing again." },
      { s: "Shruti", de: "Bei Technik hilft Ausschalten erstaunlich oft.", en: "With technology, switching off helps surprisingly often." }
    ]
  },

  {
    id: "c062", topic: "technik",
    title: "Ein neues Handy aussuchen",
    titleEn: "Choosing a new phone",
    lines: [
      { s: "Shruti", de: "Mein Handy ist vier Jahre alt.", en: "My phone is four years old." },
      { s: "Sijan",  de: "Läuft es noch gut?", en: "Is it still running well?" },
      { s: "Shruti", de: "Der Akku hält nur einen halben Tag.", en: "The battery only lasts half a day." },
      { s: "Sijan",  de: "Man kann den Akku wechseln lassen.", en: "You can have the battery replaced." },
      { s: "Shruti", de: "Das kostet fast achtzig Euro.", en: "That costs almost eighty euros." },
      { s: "Sijan",  de: "Ein neues Handy ist aber viel teurer.", en: "But a new phone is much more expensive." },
      { s: "Shruti", de: "Stimmt. Und der Speicher reicht noch.", en: "True. And the storage is still enough." },
      { s: "Sijan",  de: "Dann lohnt sich der neue Akku.", en: "Then the new battery is worth it." },
      { s: "Shruti", de: "Wo kann man das machen lassen?", en: "Where can you get that done?" },
      { s: "Sijan",  de: "In dem kleinen Laden am Markt.", en: "In the small shop by the market." },
      { s: "Shruti", de: "Wie lange dauert es?", en: "How long does it take?" },
      { s: "Sijan",  de: "Meistens eine Stunde.", en: "Usually an hour." },
      { s: "Shruti", de: "Gut, dann gehe ich am Samstag hin.", en: "Good, then I'll go on Saturday." }
    ]
  },

  {
    id: "c063", topic: "technik",
    title: "Fotos sichern",
    titleEn: "Backing up photos",
    lines: [
      { s: "Sijan",  de: "Mein Speicher ist wieder voll.", en: "My storage is full again." },
      { s: "Shruti", de: "Wie viele Fotos hast du denn?", en: "How many photos do you have?" },
      { s: "Sijan",  de: "Über zehntausend.", en: "Over ten thousand." },
      { s: "Shruti", de: "Sicherst du sie irgendwo?", en: "Do you back them up anywhere?" },
      { s: "Sijan",  de: "Nein, das habe ich nie gemacht.", en: "No, I've never done that." },
      { s: "Shruti", de: "Das ist gefährlich.", en: "That's risky." },
      { s: "Sijan",  de: "Was schlägst du vor?", en: "What do you suggest?" },
      { s: "Shruti", de: "Kopier alles auf eine externe Festplatte.", en: "Copy everything onto an external hard drive." },
      { s: "Sijan",  de: "Haben wir noch eine?", en: "Do we still have one?" },
      { s: "Shruti", de: "Ja, im Schreibtisch, sie ist fast leer.", en: "Yes, in the desk, it's almost empty." },
      { s: "Sijan",  de: "Dann mache ich das heute Abend.", en: "Then I'll do that this evening." },
      { s: "Shruti", de: "Und danach löschst du die schlechten Fotos.", en: "And afterwards you delete the bad photos." }
    ]
  },

  {
    id: "c064", topic: "technik",
    title: "Eine App einrichten",
    titleEn: "Setting up an app",
    lines: [
      { s: "Shruti", de: "Wie funktioniert die Bahn-App?", en: "How does the train app work?" },
      { s: "Sijan",  de: "Zuerst musst du dich anmelden.", en: "First you have to sign up." },
      { s: "Shruti", de: "Mit meiner E-Mail-Adresse?", en: "With my email address?" },
      { s: "Sijan",  de: "Ja, und dann bestätigst du die Mail.", en: "Yes, and then you confirm the email." },
      { s: "Shruti", de: "Fertig. Und jetzt?", en: "Done. And now?" },
      { s: "Sijan",  de: "Gib Start und Ziel ein.", en: "Enter your start and destination." },
      { s: "Shruti", de: "Friedrichshafen nach Ulm.", en: "Friedrichshafen to Ulm." },
      { s: "Sijan",  de: "Jetzt siehst du alle Verbindungen.", en: "Now you can see all the connections." },
      { s: "Shruti", de: "Kann ich die Karte direkt kaufen?", en: "Can I buy the ticket right here?" },
      { s: "Sijan",  de: "Ja, aber du musst eine Zahlungsart hinterlegen.", en: "Yes, but you have to save a payment method." },
      { s: "Shruti", de: "Muss ich sie ausdrucken?", en: "Do I have to print it?" },
      { s: "Sijan",  de: "Nein, du zeigst sie einfach auf dem Handy.", en: "No, you just show it on your phone." },
      { s: "Shruti", de: "Sehr praktisch, danke!", en: "Very practical, thanks!" }
    ]
  },

  {
    id: "c065", topic: "wetter", couple: true,
    title: "Regen am Morgen",
    titleEn: "Rain in the morning",
    lines: [
      { s: "Shruti", de: "Schau mal aus dem Fenster.", en: "Have a look out of the window." },
      { s: "Sijan",  de: "Es schüttet ja richtig.", en: "It's really pouring down." },
      { s: "Shruti", de: "Und du wolltest mit dem Rad fahren.", en: "And you wanted to go by bike." },
      { s: "Sijan",  de: "Das lasse ich heute lieber.", en: "I'd rather not today." },
      { s: "Shruti", de: "Nimm den Bus um sieben.", en: "Take the seven o'clock bus." },
      { s: "Sijan",  de: "Dann muss ich in zehn Minuten los.", en: "Then I have to leave in ten minutes." },
      { s: "Shruti", de: "Dein Schirm steht im Flur.", en: "Your umbrella is in the hallway." },
      { s: "Sijan",  de: "Der ist kaputt, weißt du noch?", en: "That one's broken, remember?" },
      { s: "Shruti", de: "Dann nimm meinen, den blauen.", en: "Then take mine, the blue one." },
      { s: "Sijan",  de: "Soll morgen auch so ein Wetter werden?", en: "Is tomorrow supposed to be like this too?" },
      { s: "Shruti", de: "Nein, ab mittags wird es trocken.", en: "No, from midday it'll be dry." },
      { s: "Sijan",  de: "Danke, dass du immer an alles denkst.", en: "Thank you for always thinking of everything." }
    ]
  },

  {
    id: "c066", topic: "wetter",
    title: "Der erste Schnee",
    titleEn: "The first snow",
    lines: [
      { s: "Sijan",  de: "Es hat heute Nacht geschneit!", en: "It snowed last night!" },
      { s: "Shruti", de: "Wie viel liegt denn?", en: "How much is there?" },
      { s: "Sijan",  de: "Ungefähr zehn Zentimeter.", en: "About ten centimetres." },
      { s: "Shruti", de: "Dann sind die Straßen glatt.", en: "Then the roads will be slippery." },
      { s: "Sijan",  de: "Hast du Winterreifen?", en: "Do you have winter tyres?" },
      { s: "Shruti", de: "Seit Oktober, ja.", en: "Since October, yes." },
      { s: "Sijan",  de: "Trotzdem fahre ich heute langsam.", en: "I'm still driving slowly today." },
      { s: "Shruti", de: "Wir müssen auch den Gehweg räumen.", en: "We have to clear the pavement as well." },
      { s: "Sijan",  de: "Ist das Pflicht?", en: "Is that compulsory?" },
      { s: "Shruti", de: "Ja, bis sieben Uhr morgens.", en: "Yes, by seven in the morning." },
      { s: "Sijan",  de: "Wo ist die Schneeschaufel?", en: "Where's the snow shovel?" },
      { s: "Shruti", de: "Im Keller, neben den Fahrrädern.", en: "In the cellar, next to the bikes." },
      { s: "Sijan",  de: "Dann fange ich gleich an.", en: "Then I'll start right away." }
    ]
  },

  {
    id: "c067", topic: "wetter",
    title: "Zu heiß in der Wohnung",
    titleEn: "Too hot in the flat",
    lines: [
      { s: "Shruti", de: "In der Wohnung sind es achtundzwanzig Grad.", en: "It's twenty-eight degrees in the flat." },
      { s: "Sijan",  de: "Nachts kann man kaum schlafen.", en: "You can hardly sleep at night." },
      { s: "Shruti", de: "Tagsüber sollten wir die Fenster zulassen.", en: "During the day we should keep the windows shut." },
      { s: "Sijan",  de: "Wirklich? Ich dachte, Lüften hilft.", en: "Really? I thought airing helps." },
      { s: "Shruti", de: "Nur früh morgens und spät abends.", en: "Only early in the morning and late in the evening." },
      { s: "Sijan",  de: "Und die Rollläden?", en: "And the blinds?" },
      { s: "Shruti", de: "Die bleiben unten, solange die Sonne scheint.", en: "They stay down as long as the sun is shining." },
      { s: "Sijan",  de: "Sollen wir einen Ventilator kaufen?", en: "Shall we buy a fan?" },
      { s: "Shruti", de: "Die sind gerade überall ausverkauft.", en: "They're sold out everywhere at the moment." },
      { s: "Sijan",  de: "Dann stelle ich abends kaltes Wasser bereit.", en: "Then I'll get cold water ready in the evening." },
      { s: "Shruti", de: "Und wir gehen später an den See.", en: "And we'll go to the lake later." },
      { s: "Sijan",  de: "Gute Idee, da ist es immer kühler.", en: "Good idea, it's always cooler there." }
    ]
  },

  {
    id: "c068", topic: "wetter",
    title: "Gewitter am Abend",
    titleEn: "A thunderstorm in the evening",
    lines: [
      { s: "Sijan",  de: "Hast du den Donner gehört?", en: "Did you hear the thunder?" },
      { s: "Shruti", de: "Ja, es kommt näher.", en: "Yes, it's getting closer." },
      { s: "Sijan",  de: "Die Wäsche hängt noch draußen.", en: "The washing is still hanging outside." },
      { s: "Shruti", de: "Hol sie schnell rein.", en: "Get it in quickly." },
      { s: "Sijan",  de: "Und die Stühle auf dem Balkon?", en: "And the chairs on the balcony?" },
      { s: "Shruti", de: "Stell sie an die Wand, der Wind ist stark.", en: "Put them against the wall, the wind is strong." },
      { s: "Sijan",  de: "Soll ich die Fenster schließen?", en: "Shall I close the windows?" },
      { s: "Shruti", de: "Alle, auch das im Bad.", en: "All of them, including the one in the bathroom." },
      { s: "Sijan",  de: "Jetzt regnet es richtig stark.", en: "Now it's raining really hard." },
      { s: "Shruti", de: "Gut, dass wir schon zu Hause sind.", en: "Good thing we're already home." },
      { s: "Sijan",  de: "Das Licht flackert.", en: "The light is flickering." },
      { s: "Shruti", de: "Die Kerzen liegen in der Schublade.", en: "The candles are in the drawer." }
    ]
  },

  {
    id: "c069", topic: "wetter",
    title: "Frühling im Garten",
    titleEn: "Spring in the garden",
    lines: [
      { s: "Shruti", de: "Die ersten Blumen blühen schon.", en: "The first flowers are already blooming." },
      { s: "Sijan",  de: "Und die Bäume werden grün.", en: "And the trees are turning green." },
      { s: "Shruti", de: "Wollen wir am Wochenende pflanzen?", en: "Shall we do some planting at the weekend?" },
      { s: "Sijan",  de: "Was denn genau?", en: "What exactly?" },
      { s: "Shruti", de: "Tomaten und ein paar Kräuter.", en: "Tomatoes and a few herbs." },
      { s: "Sijan",  de: "Ist es dafür nicht zu früh?", en: "Isn't it too early for that?" },
      { s: "Shruti", de: "Tomaten erst nach Mitte Mai.", en: "Tomatoes only after the middle of May." },
      { s: "Sijan",  de: "Wegen der kalten Nächte?", en: "Because of the cold nights?" },
      { s: "Shruti", de: "Genau, sonst gehen sie kaputt.", en: "Exactly, otherwise they die." },
      { s: "Sijan",  de: "Dann fangen wir mit den Kräutern an.", en: "Then let's start with the herbs." },
      { s: "Shruti", de: "Erde haben wir noch im Keller.", en: "We still have soil in the cellar." },
      { s: "Sijan",  de: "Und Töpfe kaufe ich morgen.", en: "And I'll buy pots tomorrow." }
    ]
  },

  {
    id: "c070", topic: "wetter",
    title: "Nebel auf dem Weg zur Arbeit",
    titleEn: "Fog on the way to work",
    lines: [
      { s: "Sijan",  de: "Draußen ist dichter Nebel.", en: "There's thick fog outside." },
      { s: "Shruti", de: "Man sieht kaum die andere Straßenseite.", en: "You can hardly see the other side of the street." },
      { s: "Sijan",  de: "Fährst du trotzdem mit dem Auto?", en: "Are you still driving?" },
      { s: "Shruti", de: "Ja, aber ganz langsam.", en: "Yes, but very slowly." },
      { s: "Sijan",  de: "Mach bitte das Licht an.", en: "Please put your lights on." },
      { s: "Shruti", de: "Natürlich, und Abstand halten.", en: "Of course, and keep your distance." },
      { s: "Sijan",  de: "Nimm lieber zehn Minuten mehr Zeit.", en: "Better to allow ten minutes more." },
      { s: "Shruti", de: "Ich fahre gleich los.", en: "I'm setting off right away." },
      { s: "Sijan",  de: "Schreib mir, wenn du da bist.", en: "Text me when you arrive." },
      { s: "Shruti", de: "Mache ich. Und du?", en: "I will. And you?" },
      { s: "Sijan",  de: "Ich nehme heute den Zug.", en: "I'm taking the train today." },
      { s: "Shruti", de: "Das ist bei dem Wetter klüger.", en: "That's wiser in this weather." }
    ]
  },

  {
    id: "c071", topic: "alltag",
    title: "Die Kaffeemaschine ist kaputt",
    titleEn: "The coffee machine is broken",
    lines: [
      { s: "Sijan",  de: "Die Kaffeemaschine macht nur ein Geräusch.", en: "The coffee machine just makes a noise." },
      { s: "Shruti", de: "Kommt gar kein Wasser durch?", en: "Doesn't any water come through?" },
      { s: "Sijan",  de: "Ein paar Tropfen, mehr nicht.", en: "A few drops, no more." },
      { s: "Shruti", de: "Wann hast du sie zuletzt entkalkt?", en: "When did you last descale it?" },
      { s: "Sijan",  de: "Ehrlich gesagt noch nie.", en: "Honestly, never." },
      { s: "Shruti", de: "Dann ist das wahrscheinlich der Grund.", en: "Then that's probably the reason." },
      { s: "Sijan",  de: "Haben wir Entkalker im Haus?", en: "Do we have descaler in the house?" },
      { s: "Shruti", de: "Nein, aber Essig geht auch.", en: "No, but vinegar works too." },
      { s: "Sijan",  de: "Und wie lange muss das wirken?", en: "And how long does it have to work?" },
      { s: "Shruti", de: "Eine halbe Stunde, dann gut spülen.", en: "Half an hour, then rinse well." },
      { s: "Sijan",  de: "Und mein Kaffee heute Morgen?", en: "And my coffee this morning?" },
      { s: "Shruti", de: "Heute gibt es Tee.", en: "Today it's tea." },
      { s: "Sijan",  de: "Damit kann ich leben.", en: "I can live with that." }
    ]
  },

  {
    id: "c072", topic: "alltag",
    title: "Ein Sonntag ohne Plan",
    titleEn: "A Sunday with no plans",
    lines: [
      { s: "Shruti", de: "Was machen wir heute?", en: "What are we doing today?" },
      { s: "Sijan",  de: "Nichts Bestimmtes, alles ist zu.", en: "Nothing in particular, everything's closed." },
      { s: "Shruti", de: "Stimmt, Sonntag ist hier wirklich ruhig.", en: "True, Sunday is really quiet here." },
      { s: "Sijan",  de: "Sollen wir spazieren gehen?", en: "Shall we go for a walk?" },
      { s: "Shruti", de: "Gern, aber erst nach dem Frühstück.", en: "Gladly, but only after breakfast." },
      { s: "Sijan",  de: "Ich backe Brötchen auf.", en: "I'll warm up some rolls." },
      { s: "Shruti", de: "Haben wir noch Eier?", en: "Do we still have eggs?" },
      { s: "Sijan",  de: "Vier, das reicht.", en: "Four, that's enough." },
      { s: "Shruti", de: "Danach gehen wir am Wasser entlang.", en: "Afterwards we'll walk along the water." },
      { s: "Sijan",  de: "Und abends ein Film auf dem Sofa.", en: "And a film on the sofa in the evening." },
      { s: "Shruti", de: "Das klingt nach einem guten Sonntag.", en: "That sounds like a good Sunday." },
      { s: "Sijan",  de: "Morgen wird es sowieso wieder stressig.", en: "Tomorrow it'll be stressful again anyway." }
    ]
  },

  {
    id: "c073", topic: "einkaufen",
    title: "Die Schuhe sind kaputt gegangen",
    titleEn: "The shoes fell apart",
    lines: [
      { s: "Shruti", de: "Guten Tag, ich habe ein Problem mit diesen Schuhen.", en: "Hello, I have a problem with these shoes." },
      { s: "Sijan",  de: "Was ist denn passiert?", en: "What happened?" },
      { s: "Shruti", de: "Die Sohle löst sich vorne.", en: "The sole is coming off at the front." },
      { s: "Sijan",  de: "Wann haben Sie sie gekauft?", en: "When did you buy them?" },
      { s: "Shruti", de: "Vor sechs Wochen.", en: "Six weeks ago." },
      { s: "Sijan",  de: "Dann haben Sie noch Garantie.", en: "Then they're still under guarantee." },
      { s: "Shruti", de: "Ich habe den Bon leider verloren.", en: "Unfortunately I've lost the receipt." },
      { s: "Sijan",  de: "Haben Sie mit Karte bezahlt?", en: "Did you pay by card?" },
      { s: "Shruti", de: "Ja, das kann ich zeigen.", en: "Yes, I can show that." },
      { s: "Sijan",  de: "Das reicht uns als Nachweis.", en: "That's proof enough for us." },
      { s: "Shruti", de: "Bekomme ich das Geld zurück?", en: "Do I get my money back?" },
      { s: "Sijan",  de: "Oder ein neues Paar, wie Sie möchten.", en: "Or a new pair, whichever you prefer." },
      { s: "Shruti", de: "Dann nehme ich das gleiche Modell noch einmal.", en: "Then I'll take the same model again." }
    ]
  },

  {
    id: "c074", topic: "einkaufen",
    title: "Ein Geschenk einpacken lassen",
    titleEn: "Getting a present wrapped",
    lines: [
      { s: "Sijan",  de: "Können Sie das als Geschenk einpacken?", en: "Could you gift-wrap this?" },
      { s: "Shruti", de: "Gern. Ist es für eine Frau oder einen Mann?", en: "Gladly. Is it for a woman or a man?" },
      { s: "Sijan",  de: "Für meine Schwester.", en: "For my sister." },
      { s: "Shruti", de: "Wir haben blaues und rotes Papier.", en: "We have blue and red paper." },
      { s: "Sijan",  de: "Das blaue bitte.", en: "The blue one please." },
      { s: "Shruti", de: "Möchten Sie eine Karte dazu?", en: "Would you like a card with it?" },
      { s: "Sijan",  de: "Ja, haben Sie eine für den Geburtstag?", en: "Yes, do you have one for a birthday?" },
      { s: "Shruti", de: "Hier sind drei zur Auswahl.", en: "Here are three to choose from." },
      { s: "Sijan",  de: "Die mit den Blumen gefällt mir.", en: "I like the one with the flowers." },
      { s: "Shruti", de: "Das Einpacken kostet nichts extra.", en: "The wrapping costs nothing extra." },
      { s: "Sijan",  de: "Sehr schön, vielen Dank.", en: "Very nice, thank you very much." },
      { s: "Shruti", de: "Soll ich den Preis abmachen?", en: "Shall I take the price off?" },
      { s: "Sijan",  de: "Ja bitte, das hätte ich fast vergessen.", en: "Yes please, I'd almost forgotten that." }
    ]
  },

  {
    id: "c075", topic: "essen",
    title: "Essen bestellen",
    titleEn: "Ordering food in",
    lines: [
      { s: "Shruti", de: "Ich habe keine Lust zu kochen.", en: "I don't feel like cooking." },
      { s: "Sijan",  de: "Dann bestellen wir etwas.", en: "Then let's order something." },
      { s: "Shruti", de: "Pizza oder indisch?", en: "Pizza or Indian?" },
      { s: "Sijan",  de: "Indisch hatten wir erst am Dienstag.", en: "We had Indian only on Tuesday." },
      { s: "Shruti", de: "Also Pizza. Welche nimmst du?", en: "Pizza then. Which one are you having?" },
      { s: "Sijan",  de: "Eine mit Gemüse, ohne Zwiebeln.", en: "One with vegetables, without onions." },
      { s: "Shruti", de: "Und ich eine mit viel Käse.", en: "And I'll have one with lots of cheese." },
      { s: "Sijan",  de: "Wie lange dauert die Lieferung?", en: "How long is the delivery?" },
      { s: "Shruti", de: "Vierzig Minuten, steht in der App.", en: "Forty minutes, it says in the app." },
      { s: "Sijan",  de: "Hast du Bargeld für Trinkgeld?", en: "Do you have cash for a tip?" },
      { s: "Shruti", de: "Ja, fünf Euro liegen auf der Kommode.", en: "Yes, there's five euros on the dresser." },
      { s: "Sijan",  de: "Ich decke schnell den Tisch.", en: "I'll quickly set the table." }
    ]
  },

  {
    id: "c076", topic: "essen",
    title: "Im Café",
    titleEn: "At the café",
    lines: [
      { s: "Sijan",  de: "Ist der Platz hier noch frei?", en: "Is this seat still free?" },
      { s: "Shruti", de: "Ja, setzen Sie sich ruhig.", en: "Yes, do sit down." },
      { s: "Sijan",  de: "Danke, drinnen ist alles besetzt.", en: "Thanks, everything inside is taken." },
      { s: "Shruti", de: "Draußen ist es sowieso schöner.", en: "It's nicer outside anyway." },
      { s: "Sijan",  de: "Wissen Sie, ob man hier am Tisch bestellt?", en: "Do you know whether you order at the table here?" },
      { s: "Shruti", de: "Nein, man geht zur Theke.", en: "No, you go to the counter." },
      { s: "Sijan",  de: "Und wie ist der Kuchen?", en: "And how's the cake?" },
      { s: "Shruti", de: "Der Apfelkuchen ist sehr gut.", en: "The apple cake is very good." },
      { s: "Sijan",  de: "Dann nehme ich den auch.", en: "Then I'll have that too." },
      { s: "Shruti", de: "Und dazu einen Milchkaffee.", en: "And a milky coffee with it." },
      { s: "Sijan",  de: "Kann man hier mit Karte zahlen?", en: "Can you pay by card here?" },
      { s: "Shruti", de: "Ja, ohne Mindestbetrag.", en: "Yes, with no minimum." },
      { s: "Sijan",  de: "Perfekt, dann bin ich gleich zurück.", en: "Perfect, I'll be right back." }
    ]
  },

  {
    id: "c077", topic: "wohnen",
    title: "Die Wohnung übergeben",
    titleEn: "Handing over the flat",
    lines: [
      { s: "Shruti", de: "Ist die Wohnung jetzt leer?", en: "Is the flat empty now?" },
      { s: "Sijan",  de: "Ja, alles ist draußen und geputzt.", en: "Yes, everything's out and cleaned." },
      { s: "Shruti", de: "Haben Sie die Wände gestrichen?", en: "Have you painted the walls?" },
      { s: "Sijan",  de: "Zwei Zimmer ja, das Bad nicht.", en: "Two rooms yes, not the bathroom." },
      { s: "Shruti", de: "Das ist in Ordnung so.", en: "That's fine like that." },
      { s: "Sijan",  de: "Hier sind beide Schlüssel.", en: "Here are both keys." },
      { s: "Shruti", de: "Es waren doch drei, oder?", en: "There were three, weren't there?" },
      { s: "Sijan",  de: "Richtig, der dritte liegt im Briefkasten.", en: "Correct, the third is in the letterbox." },
      { s: "Shruti", de: "Ich lese noch die Zählerstände ab.", en: "I'll read the meters as well." },
      { s: "Sijan",  de: "Der Stromzähler ist im Keller.", en: "The electricity meter is in the cellar." },
      { s: "Shruti", de: "Wann kommt die Kaution zurück?", en: "When will the deposit come back?" },
      { s: "Sijan",  de: "Innerhalb von drei Monaten, per Überweisung.", en: "Within three months, by bank transfer." },
      { s: "Shruti", de: "Dann unterschreiben wir jetzt das Protokoll.", en: "Then let's sign the handover report now." }
    ]
  },

  {
    id: "c078", topic: "wohnen",
    title: "Den Schrank aufbauen",
    titleEn: "Putting up the wardrobe",
    lines: [
      { s: "Sijan",  de: "Wo ist die Anleitung?", en: "Where are the instructions?" },
      { s: "Shruti", de: "Im großen Karton, ganz oben.", en: "In the big box, right on top." },
      { s: "Sijan",  de: "Es sind über vierzig Schrauben.", en: "There are over forty screws." },
      { s: "Shruti", de: "Sortier sie zuerst nach Größe.", en: "Sort them by size first." },
      { s: "Sijan",  de: "Gute Idee, sonst suchen wir ewig.", en: "Good idea, otherwise we'll search forever." },
      { s: "Shruti", de: "Fangen wir mit der Rückwand an.", en: "Let's start with the back panel." },
      { s: "Sijan",  de: "Hältst du sie kurz fest?", en: "Will you hold it for a moment?" },
      { s: "Shruti", de: "Ja, aber beeil dich, sie ist schwer.", en: "Yes, but hurry, it's heavy." },
      { s: "Sijan",  de: "Ein Teil fehlt leider.", en: "Unfortunately one part is missing." },
      { s: "Shruti", de: "Welches denn?", en: "Which one?" },
      { s: "Sijan",  de: "Die kleine Stange für die Tür.", en: "The small rod for the door." },
      { s: "Shruti", de: "Die bestellen wir online nach.", en: "We'll order that online." },
      { s: "Sijan",  de: "Bis dahin bleibt die Tür offen.", en: "Until then the door stays open." }
    ]
  },

  {
    id: "c079", topic: "arbeit",
    title: "Aufgaben im Team verteilen",
    titleEn: "Dividing up the work",
    lines: [
      { s: "Shruti", de: "Das Projekt startet am Montag.", en: "The project starts on Monday." },
      { s: "Sijan",  de: "Wer macht was?", en: "Who does what?" },
      { s: "Shruti", de: "Ich kümmere mich um den Zeitplan.", en: "I'll take care of the schedule." },
      { s: "Sijan",  de: "Und ich um die Technik?", en: "And I'll take the technical side?" },
      { s: "Shruti", de: "Genau. Schaffst du das bis Freitag?", en: "Exactly. Can you manage that by Friday?" },
      { s: "Sijan",  de: "Der erste Teil ja, der Rest nicht.", en: "The first part yes, the rest no." },
      { s: "Shruti", de: "Was brauchst du dafür?", en: "What do you need for it?" },
      { s: "Sijan",  de: "Zugang zum Server und einen Tag Zeit.", en: "Access to the server and one day." },
      { s: "Shruti", de: "Den Zugang beantrage ich heute.", en: "I'll request the access today." },
      { s: "Sijan",  de: "Wer spricht mit dem Kunden?", en: "Who talks to the customer?" },
      { s: "Shruti", de: "Das mache ich am Dienstag.", en: "I'll do that on Tuesday." },
      { s: "Sijan",  de: "Dann schreibe ich dir vorher die Details.", en: "Then I'll send you the details beforehand." },
      { s: "Shruti", de: "Gut, wir besprechen es Montag früh noch mal.", en: "Good, we'll go over it again on Monday morning." }
    ]
  },

  {
    id: "c080", topic: "arbeit",
    title: "Überstunden am Freitag",
    titleEn: "Overtime on Friday",
    lines: [
      { s: "Sijan",  de: "Ich schaffe das heute nicht bis fünf.", en: "I won't finish this by five today." },
      { s: "Shruti", de: "Woran liegt es?", en: "What's the reason?" },
      { s: "Sijan",  de: "Die Daten kamen erst heute Mittag.", en: "The data only came at midday." },
      { s: "Shruti", de: "Wie lange brauchst du noch?", en: "How much longer do you need?" },
      { s: "Sijan",  de: "Etwa zwei Stunden.", en: "About two hours." },
      { s: "Shruti", de: "Muss es heute fertig werden?", en: "Does it have to be finished today?" },
      { s: "Sijan",  de: "Der Kunde wartet seit gestern.", en: "The customer has been waiting since yesterday." },
      { s: "Shruti", de: "Dann bleib, aber schreib die Stunden auf.", en: "Then stay, but write the hours down." },
      { s: "Sijan",  de: "Kann ich sie nächste Woche abbauen?", en: "Can I take them off next week?" },
      { s: "Shruti", de: "Ja, nimm Mittwochnachmittag frei.", en: "Yes, take Wednesday afternoon off." },
      { s: "Sijan",  de: "Das wäre super.", en: "That would be great." },
      { s: "Shruti", de: "Und geh nicht später als acht.", en: "And don't leave later than eight." }
    ]
  },

  {
    id: "c081", topic: "gesundheit",
    title: "Einen Termin zur Vorsorge",
    titleEn: "Booking a check-up",
    lines: [
      { s: "Sijan",  de: "Guten Tag, ich hätte gern einen Termin.", en: "Hello, I'd like an appointment." },
      { s: "Shruti", de: "Waren Sie schon einmal bei uns?", en: "Have you been to us before?" },
      { s: "Sijan",  de: "Nein, ich bin neu hier.", en: "No, I'm new here." },
      { s: "Shruti", de: "Dann brauche ich Ihre Daten.", en: "Then I need your details." },
      { s: "Sijan",  de: "Pahari, geboren am vierten Juli.", en: "Pahari, born on the fourth of July." },
      { s: "Shruti", de: "Und Ihre Krankenkasse?", en: "And your health insurance?" },
      { s: "Sijan",  de: "Die steht auf der Karte, hier bitte.", en: "It's on the card, here you are." },
      { s: "Shruti", de: "Worum geht es bei dem Termin?", en: "What is the appointment for?" },
      { s: "Sijan",  de: "Nur um eine allgemeine Untersuchung.", en: "Just a general check-up." },
      { s: "Shruti", de: "Da haben wir am achten Platz.", en: "We have a slot on the eighth." },
      { s: "Sijan",  de: "Vormittags oder nachmittags?", en: "Morning or afternoon?" },
      { s: "Shruti", de: "Um acht Uhr fünfzehn.", en: "At a quarter past eight." },
      { s: "Sijan",  de: "Passt, und kommen Sie nüchtern, oder?", en: "That works — and I should come without eating, right?" }
    ]
  },

  {
    id: "c082", topic: "gesundheit",
    title: "Eine neue Brille",
    titleEn: "New glasses",
    lines: [
      { s: "Shruti", de: "Ich sehe abends schlechter als früher.", en: "I see worse in the evening than I used to." },
      { s: "Sijan",  de: "Wann warst du zuletzt beim Optiker?", en: "When were you last at the optician's?" },
      { s: "Shruti", de: "Vor drei Jahren.", en: "Three years ago." },
      { s: "Sijan",  de: "Das ist zu lange.", en: "That's too long." },
      { s: "Shruti", de: "Kostet ein Sehtest etwas?", en: "Does an eye test cost anything?" },
      { s: "Sijan",  de: "Beim Optiker meistens nichts.", en: "At the optician's usually nothing." },
      { s: "Shruti", de: "Und die Brille selbst?", en: "And the glasses themselves?" },
      { s: "Sijan",  de: "Das hängt vom Gestell ab.", en: "That depends on the frame." },
      { s: "Shruti", de: "Ich hätte gern ein leichtes.", en: "I'd like a light one." },
      { s: "Sijan",  de: "Probier mehrere an, nimm dir Zeit.", en: "Try several on, take your time." },
      { s: "Shruti", de: "Kommst du am Samstag mit?", en: "Will you come with me on Saturday?" },
      { s: "Sijan",  de: "Klar, ich sage dir ehrlich, was gut aussieht.", en: "Sure, I'll tell you honestly what looks good." }
    ]
  },

  {
    id: "c083", topic: "unterwegs",
    title: "An der Tankstelle",
    titleEn: "At the petrol station",
    lines: [
      { s: "Shruti", de: "Wir sollten noch tanken.", en: "We should fill up." },
      { s: "Sijan",  de: "Wie weit kommen wir noch?", en: "How far can we still get?" },
      { s: "Shruti", de: "Achtzig Kilometer, sagt der Bordcomputer.", en: "Eighty kilometres, the trip computer says." },
      { s: "Sijan",  de: "Das reicht nicht bis nach Hause.", en: "That's not enough to get home." },
      { s: "Shruti", de: "Die nächste Tankstelle ist in zwei Kilometern.", en: "The next petrol station is two kilometres away." },
      { s: "Sijan",  de: "Welche Säule nehmen wir?", en: "Which pump do we take?" },
      { s: "Shruti", de: "Nummer vier ist frei.", en: "Number four is free." },
      { s: "Sijan",  de: "Diesel oder Benzin?", en: "Diesel or petrol?" },
      { s: "Shruti", de: "Benzin, auf keinen Fall Diesel.", en: "Petrol, definitely not diesel." },
      { s: "Sijan",  de: "Für vierzig Euro reicht?", en: "Is forty euros' worth enough?" },
      { s: "Shruti", de: "Mach lieber voll.", en: "Better fill it up." },
      { s: "Sijan",  de: "Ich zahle drinnen, Säule vier.", en: "I'll pay inside, pump four." },
      { s: "Shruti", de: "Bring bitte auch Wasser mit.", en: "Please bring water too." }
    ]
  },

  {
    id: "c084", topic: "unterwegs",
    title: "Zu Fuß nach dem Weg fragen",
    titleEn: "Asking for directions on foot",
    lines: [
      { s: "Sijan",  de: "Entschuldigung, wie komme ich zum Rathaus?", en: "Excuse me, how do I get to the town hall?" },
      { s: "Shruti", de: "Zu Fuß sind es etwa zehn Minuten.", en: "On foot it's about ten minutes." },
      { s: "Sijan",  de: "In welche Richtung?", en: "In which direction?" },
      { s: "Shruti", de: "Gehen Sie hier geradeaus bis zur Kirche.", en: "Go straight ahead here as far as the church." },
      { s: "Sijan",  de: "Und dann?", en: "And then?" },
      { s: "Shruti", de: "Dann links in die Fußgängerzone.", en: "Then left into the pedestrian zone." },
      { s: "Sijan",  de: "Muss ich über eine große Straße?", en: "Do I have to cross a big road?" },
      { s: "Shruti", de: "Ja, aber da ist eine Ampel.", en: "Yes, but there's a traffic light there." },
      { s: "Sijan",  de: "Ist das Rathaus zu sehen?", en: "Can you see the town hall?" },
      { s: "Shruti", de: "Es ist das große Gebäude am Marktplatz.", en: "It's the big building on the market square." },
      { s: "Sijan",  de: "Hat es heute überhaupt offen?", en: "Is it even open today?" },
      { s: "Shruti", de: "Bis sechzehn Uhr, glaube ich.", en: "Until four, I think." },
      { s: "Sijan",  de: "Dann beeile ich mich. Danke!", en: "Then I'll hurry. Thanks!" }
    ]
  },

  {
    id: "c085", topic: "reisen",
    title: "Am Check-in",
    titleEn: "At check-in",
    lines: [
      { s: "Shruti", de: "Guten Morgen, Ihren Pass bitte.", en: "Good morning, your passport please." },
      { s: "Sijan",  de: "Hier, bitte schön.", en: "Here you are." },
      { s: "Shruti", de: "Haben Sie Gepäck zum Aufgeben?", en: "Do you have luggage to check in?" },
      { s: "Sijan",  de: "Einen Koffer, den Rucksack nehme ich mit.", en: "One suitcase, I'll take the backpack with me." },
      { s: "Shruti", de: "Stellen Sie den Koffer bitte hier drauf.", en: "Please put the suitcase here." },
      { s: "Sijan",  de: "Wie viel darf er wiegen?", en: "How much is it allowed to weigh?" },
      { s: "Shruti", de: "Dreiundzwanzig Kilo, Ihrer hat vierundzwanzig.", en: "Twenty-three kilos, yours is twenty-four." },
      { s: "Sijan",  de: "Kann ich etwas umpacken?", en: "Can I move something over?" },
      { s: "Shruti", de: "Ja, treten Sie ruhig kurz zur Seite.", en: "Yes, do step aside for a moment." },
      { s: "Sijan",  de: "Jetzt sind es genau dreiundzwanzig.", en: "Now it's exactly twenty-three." },
      { s: "Shruti", de: "Sehr gut. Gang oder Fenster?", en: "Very good. Aisle or window?" },
      { s: "Sijan",  de: "Fenster bitte.", en: "Window please." },
      { s: "Shruti", de: "Gate B zwölf, Boarding um halb elf.", en: "Gate B twelve, boarding at half past ten." }
    ]
  },

  {
    id: "c086", topic: "reisen",
    title: "Etwas mitbringen",
    titleEn: "Bringing something back",
    lines: [
      { s: "Sijan",  de: "Was bringen wir den Kollegen mit?", en: "What shall we bring back for our colleagues?" },
      { s: "Shruti", de: "Etwas Typisches aus der Region.", en: "Something typical from the region." },
      { s: "Sijan",  de: "Schokolade ist immer gut.", en: "Chocolate is always good." },
      { s: "Shruti", de: "Aber bei der Hitze schmilzt sie.", en: "But in this heat it melts." },
      { s: "Sijan",  de: "Stimmt. Und Kekse?", en: "True. And biscuits?" },
      { s: "Shruti", de: "Die halten länger und schmecken allen.", en: "They keep longer and everyone likes them." },
      { s: "Sijan",  de: "Für deine Schwester etwas anderes?", en: "Something different for your sister?" },
      { s: "Shruti", de: "Sie sammelt Postkarten.", en: "She collects postcards." },
      { s: "Sijan",  de: "Die kaufen wir am Hafen.", en: "We'll buy those at the harbour." },
      { s: "Shruti", de: "Denk an Briefmarken.", en: "Remember stamps." },
      { s: "Sijan",  de: "Sollen wir sie hier abschicken?", en: "Shall we send them from here?" },
      { s: "Shruti", de: "Ja, dann kommen sie vor uns an.", en: "Yes, then they'll arrive before we do." }
    ]
  },

  {
    id: "c087", topic: "freizeit",
    title: "Nachmittag im Schwimmbad",
    titleEn: "An afternoon at the pool",
    lines: [
      { s: "Shruti", de: "Zwei Erwachsene bitte.", en: "Two adults please." },
      { s: "Sijan",  de: "Gibt es eine Ermäßigung am Nachmittag?", en: "Is there a reduction in the afternoon?" },
      { s: "Shruti", de: "Ab sechzehn Uhr, ja.", en: "From four o'clock, yes." },
      { s: "Sijan",  de: "Wie lange hat es offen?", en: "How long is it open?" },
      { s: "Shruti", de: "Bis einundzwanzig Uhr.", en: "Until nine." },
      { s: "Sijan",  de: "Wo sind die Umkleiden?", en: "Where are the changing rooms?" },
      { s: "Shruti", de: "Rechts, hinter der Treppe.", en: "On the right, behind the stairs." },
      { s: "Sijan",  de: "Braucht man ein Schloss für den Schrank?", en: "Do you need a lock for the locker?" },
      { s: "Shruti", de: "Ein Euro reicht, den bekommst du zurück.", en: "One euro is enough, you get it back." },
      { s: "Sijan",  de: "Ich habe die Badekappe vergessen.", en: "I've forgotten my swimming cap." },
      { s: "Shruti", de: "Hier ist sie nicht nötig.", en: "It isn't necessary here." },
      { s: "Sijan",  de: "Gut, dann treffen wir uns am Becken.", en: "Good, then let's meet at the pool." }
    ]
  },

  {
    id: "c088", topic: "freizeit",
    title: "In der Bibliothek",
    titleEn: "At the library",
    lines: [
      { s: "Sijan",  de: "Ich möchte mich anmelden.", en: "I'd like to register." },
      { s: "Shruti", de: "Haben Sie einen Ausweis dabei?", en: "Do you have ID with you?" },
      { s: "Sijan",  de: "Ja, meinen Pass.", en: "Yes, my passport." },
      { s: "Shruti", de: "Der Jahresbeitrag kostet fünfzehn Euro.", en: "The yearly fee is fifteen euros." },
      { s: "Sijan",  de: "Wie viele Bücher darf ich ausleihen?", en: "How many books may I borrow?" },
      { s: "Shruti", de: "Zehn, für vier Wochen.", en: "Ten, for four weeks." },
      { s: "Sijan",  de: "Kann man verlängern?", en: "Can you renew?" },
      { s: "Shruti", de: "Zweimal, online oder hier.", en: "Twice, online or here." },
      { s: "Sijan",  de: "Haben Sie auch Bücher auf Englisch?", en: "Do you have books in English as well?" },
      { s: "Shruti", de: "Im ersten Stock, ein ganzes Regal.", en: "On the first floor, a whole shelf." },
      { s: "Sijan",  de: "Und leichte Bücher zum Deutschlernen?", en: "And easy books for learning German?" },
      { s: "Shruti", de: "Ja, gleich daneben, mit grünem Punkt.", en: "Yes, right next to them, with a green dot." },
      { s: "Sijan",  de: "Perfekt, da schaue ich gleich mal.", en: "Perfect, I'll have a look right away." }
    ]
  },

  {
    id: "c089", topic: "amt",
    title: "Nachsendeauftrag bei der Post",
    titleEn: "Mail forwarding at the post office",
    lines: [
      { s: "Shruti", de: "Wir ziehen am ersten um.", en: "We're moving on the first." },
      { s: "Sijan",  de: "Was passiert mit unserer Post?", en: "What happens to our post?" },
      { s: "Shruti", de: "Wir brauchen einen Nachsendeauftrag.", en: "We need a mail forwarding order." },
      { s: "Sijan",  de: "Wo stellt man den?", en: "Where do you set that up?" },
      { s: "Shruti", de: "Online oder in der Filiale.", en: "Online or at the branch." },
      { s: "Sijan",  de: "Was kostet das?", en: "What does it cost?" },
      { s: "Shruti", de: "Für sechs Monate etwa dreißig Euro.", en: "For six months about thirty euros." },
      { s: "Sijan",  de: "Ab wann gilt er?", en: "From when does it apply?" },
      { s: "Shruti", de: "Man sollte ihn zwei Wochen vorher stellen.", en: "You should set it up two weeks beforehand." },
      { s: "Sijan",  de: "Dann machen wir es heute.", en: "Then let's do it today." },
      { s: "Shruti", de: "Wir brauchen beide Adressen genau.", en: "We need both addresses exactly." },
      { s: "Sijan",  de: "Die neue steht im Mietvertrag.", en: "The new one is in the tenancy agreement." },
      { s: "Shruti", de: "Gut, dann fülle ich das gleich aus.", en: "Good, then I'll fill it in right away." }
    ]
  },

  {
    id: "c090", topic: "amt",
    title: "Eine Versicherung abschließen",
    titleEn: "Taking out insurance",
    lines: [
      { s: "Sijan",  de: "Brauche ich wirklich eine Haftpflicht?", en: "Do I really need liability insurance?" },
      { s: "Shruti", de: "Sie ist nicht Pflicht, aber sehr wichtig.", en: "It isn't compulsory, but very important." },
      { s: "Sijan",  de: "Wofür genau ist sie?", en: "What exactly is it for?" },
      { s: "Shruti", de: "Wenn du bei anderen etwas kaputt machst.", en: "If you break something belonging to someone else." },
      { s: "Sijan",  de: "Zum Beispiel beim Nachbarn?", en: "At the neighbour's, for example?" },
      { s: "Shruti", de: "Genau, oder ein Handy von jemandem.", en: "Exactly, or somebody's phone." },
      { s: "Sijan",  de: "Was kostet so etwas?", en: "What does something like that cost?" },
      { s: "Shruti", de: "Etwa fünf Euro im Monat.", en: "About five euros a month." },
      { s: "Sijan",  de: "Das ist wenig für die Sicherheit.", en: "That's little for the security." },
      { s: "Shruti", de: "Vergleich aber vorher zwei, drei Angebote.", en: "But compare two or three offers first." },
      { s: "Sijan",  de: "Kann ich online abschließen?", en: "Can I sign up online?" },
      { s: "Shruti", de: "Ja, du bekommst die Police per Mail.", en: "Yes, you get the policy by email." },
      { s: "Sijan",  de: "Dann mache ich das heute Abend.", en: "Then I'll do it this evening." }
    ]
  },

  {
    id: "c091", topic: "telefon",
    title: "Einen Handwerker bestellen",
    titleEn: "Calling out a tradesman",
    lines: [
      { s: "Sijan",  de: "Guten Tag, bei uns tropft der Wasserhahn.", en: "Hello, our tap is dripping." },
      { s: "Shruti", de: "Seit wann denn?", en: "Since when?" },
      { s: "Sijan",  de: "Seit etwa einer Woche.", en: "For about a week." },
      { s: "Shruti", de: "Tropft es stark?", en: "Is it dripping heavily?" },
      { s: "Sijan",  de: "Nein, aber ständig.", en: "No, but constantly." },
      { s: "Shruti", de: "Dann ist es wahrscheinlich die Dichtung.", en: "Then it's probably the washer." },
      { s: "Sijan",  de: "Wann können Sie kommen?", en: "When can you come?" },
      { s: "Shruti", de: "Diese Woche leider nicht mehr.", en: "Not this week, unfortunately." },
      { s: "Sijan",  de: "Und nächste Woche?", en: "And next week?" },
      { s: "Shruti", de: "Dienstag zwischen acht und zwölf.", en: "Tuesday between eight and twelve." },
      { s: "Sijan",  de: "Das ist ein langes Zeitfenster.", en: "That's a long time window." },
      { s: "Shruti", de: "Wir rufen vorher an.", en: "We'll call beforehand." },
      { s: "Sijan",  de: "In Ordnung, dann nehme ich Urlaub.", en: "Alright, then I'll take the day off." }
    ]
  },

  {
    id: "c092", topic: "telefon",
    title: "Wo bleibt die Lieferung?",
    titleEn: "Where is the delivery?",
    lines: [
      { s: "Shruti", de: "Guten Tag, ich frage wegen meiner Bestellung.", en: "Hello, I'm calling about my order." },
      { s: "Sijan",  de: "Haben Sie die Bestellnummer?", en: "Do you have the order number?" },
      { s: "Shruti", de: "Ja, vier sieben zwei null drei.", en: "Yes, four seven two zero three." },
      { s: "Sijan",  de: "Einen Moment bitte.", en: "One moment please." },
      { s: "Shruti", de: "Sie sollte letzte Woche kommen.", en: "It should have come last week." },
      { s: "Sijan",  de: "Der Artikel ist leider nicht auf Lager.", en: "The item is unfortunately out of stock." },
      { s: "Shruti", de: "Das hat mir niemand geschrieben.", en: "Nobody wrote to tell me that." },
      { s: "Sijan",  de: "Das tut mir leid.", en: "I'm sorry about that." },
      { s: "Shruti", de: "Wann kommt er wieder rein?", en: "When will it be back in?" },
      { s: "Sijan",  de: "In etwa drei Wochen.", en: "In about three weeks." },
      { s: "Shruti", de: "Das ist mir zu lang.", en: "That's too long for me." },
      { s: "Sijan",  de: "Dann storniere ich die Bestellung.", en: "Then I'll cancel the order." },
      { s: "Shruti", de: "Ja bitte, und überweisen Sie das Geld zurück.", en: "Yes please, and transfer the money back." }
    ]
  },

  {
    id: "c093", topic: "familie",
    title: "Eine Einladung zur Hochzeit",
    titleEn: "A wedding invitation",
    lines: [
      { s: "Sijan",  de: "Anna und Tom heiraten im September.", en: "Anna and Tom are getting married in September." },
      { s: "Shruti", de: "Sind wir eingeladen?", en: "Are we invited?" },
      { s: "Sijan",  de: "Ja, die Karte kam heute.", en: "Yes, the card came today." },
      { s: "Shruti", de: "Wo findet es statt?", en: "Where is it taking place?" },
      { s: "Sijan",  de: "In einem Hotel am See.", en: "At a hotel by the lake." },
      { s: "Shruti", de: "Müssen wir bis wann antworten?", en: "By when do we have to reply?" },
      { s: "Sijan",  de: "Bis Ende Juli.", en: "By the end of July." },
      { s: "Shruti", de: "Was ziehen wir an?", en: "What are we going to wear?" },
      { s: "Sijan",  de: "Ich brauche wohl einen Anzug.", en: "I'll probably need a suit." },
      { s: "Shruti", de: "Und was schenken wir?", en: "And what shall we give them?" },
      { s: "Sijan",  de: "Sie wünschen sich Geld für die Reise.", en: "They'd like money for their trip." },
      { s: "Shruti", de: "Dann machen wir eine schöne Karte dazu.", en: "Then we'll make a nice card to go with it." },
      { s: "Sijan",  de: "Ich sage heute Abend zu.", en: "I'll accept this evening." }
    ]
  },

  {
    id: "c094", topic: "familie",
    title: "Den Eltern beim Umzug helfen",
    titleEn: "Helping the parents move",
    lines: [
      { s: "Shruti", de: "Meine Eltern ziehen in eine kleinere Wohnung.", en: "My parents are moving to a smaller flat." },
      { s: "Sijan",  de: "Wann denn?", en: "When?" },
      { s: "Shruti", de: "Ende des Monats.", en: "At the end of the month." },
      { s: "Sijan",  de: "Brauchen sie Hilfe?", en: "Do they need help?" },
      { s: "Shruti", de: "Ja, besonders beim Packen.", en: "Yes, especially with the packing." },
      { s: "Sijan",  de: "Ich habe am Samstag Zeit.", en: "I'm free on Saturday." },
      { s: "Shruti", de: "Sie haben vierzig Jahre lang gesammelt.", en: "They've been collecting for forty years." },
      { s: "Sijan",  de: "Dann wird es ein langer Tag.", en: "Then it'll be a long day." },
      { s: "Shruti", de: "Vieles kommt auch weg.", en: "A lot of it is being thrown out too." },
      { s: "Sijan",  de: "Wir könnten es verschenken.", en: "We could give it away." },
      { s: "Shruti", de: "Gute Idee, es gibt eine Gruppe im Internet.", en: "Good idea, there's a group online." },
      { s: "Sijan",  de: "Ich fotografiere die Sachen am Samstag.", en: "I'll photograph the things on Saturday." }
    ]
  },

  {
    id: "c095", topic: "lernen",
    title: "Eine Lerngruppe gründen",
    titleEn: "Starting a study group",
    lines: [
      { s: "Sijan",  de: "Sollen wir zusammen für die Prüfung lernen?", en: "Shall we study for the exam together?" },
      { s: "Shruti", de: "Ja, allein ist es langweilig.", en: "Yes, it's boring on my own." },
      { s: "Sijan",  de: "Wer könnte noch mitmachen?", en: "Who else could join in?" },
      { s: "Shruti", de: "Maria und vielleicht Ali.", en: "Maria and maybe Ali." },
      { s: "Sijan",  de: "Wo treffen wir uns?", en: "Where shall we meet?" },
      { s: "Shruti", de: "In der Bibliothek gibt es Räume.", en: "There are rooms at the library." },
      { s: "Sijan",  de: "Muss man die reservieren?", en: "Do you have to book them?" },
      { s: "Shruti", de: "Ja, aber das geht online.", en: "Yes, but you can do that online." },
      { s: "Sijan",  de: "Wie oft treffen wir uns?", en: "How often shall we meet?" },
      { s: "Shruti", de: "Einmal pro Woche, zwei Stunden.", en: "Once a week, two hours." },
      { s: "Sijan",  de: "Und wir sprechen nur Deutsch.", en: "And we only speak German." },
      { s: "Shruti", de: "Einverstanden, auch in den Pausen.", en: "Agreed, in the breaks too." },
      { s: "Sijan",  de: "Ich schreibe den anderen heute noch.", en: "I'll write to the others today." }
    ]
  },

  {
    id: "c096", topic: "lernen",
    title: "Die Aussprache üben",
    titleEn: "Practising pronunciation",
    lines: [
      { s: "Shruti", de: "Wie spricht man eigentlich Röntgen aus?", en: "How do you actually pronounce Röntgen?" },
      { s: "Sijan",  de: "Das ö ist für mich am schwersten.", en: "The ö is the hardest for me." },
      { s: "Shruti", de: "Forme die Lippen wie bei o.", en: "Shape your lips like for o." },
      { s: "Sijan",  de: "Und dann?", en: "And then?" },
      { s: "Shruti", de: "Sag e, aber halte die Lippen rund.", en: "Say e, but keep your lips round." },
      { s: "Sijan",  de: "Das fühlt sich komisch an.", en: "That feels strange." },
      { s: "Shruti", de: "Am Anfang ja, mit der Zeit nicht mehr.", en: "At first yes, over time it won't." },
      { s: "Sijan",  de: "Und das r am Ende?", en: "And the r at the end?" },
      { s: "Shruti", de: "Das klingt fast wie ein a.", en: "That sounds almost like an a." },
      { s: "Sijan",  de: "Also Mutter fast wie Mutta?", en: "So Mutter almost like Mutta?" },
      { s: "Shruti", de: "Genau, so machen es die meisten.", en: "Exactly, that's how most people do it." },
      { s: "Sijan",  de: "Das hilft mir wirklich.", en: "That really helps me." },
      { s: "Shruti", de: "Nimm dich mal auf und hör es dir an.", en: "Record yourself and listen to it." }
    ]
  },

  {
    id: "c097", topic: "technik",
    title: "Der Laptop ist langsam",
    titleEn: "The laptop is slow",
    lines: [
      { s: "Sijan",  de: "Mein Laptop braucht ewig zum Starten.", en: "My laptop takes forever to start." },
      { s: "Shruti", de: "Wie alt ist er?", en: "How old is it?" },
      { s: "Sijan",  de: "Fünf Jahre.", en: "Five years." },
      { s: "Shruti", de: "Wie viel Platz ist noch frei?", en: "How much space is still free?" },
      { s: "Sijan",  de: "Nur acht Gigabyte.", en: "Only eight gigabytes." },
      { s: "Shruti", de: "Das ist zu wenig.", en: "That's too little." },
      { s: "Sijan",  de: "Was kann ich löschen?", en: "What can I delete?" },
      { s: "Shruti", de: "Alte Downloads und Videos zuerst.", en: "Old downloads and videos first." },
      { s: "Sijan",  de: "Und die Programme beim Start?", en: "And the programs at start-up?" },
      { s: "Shruti", de: "Schalte die meisten aus, du brauchst sie nicht.", en: "Switch most of them off, you don't need them." },
      { s: "Sijan",  de: "Er startet jetzt viel schneller.", en: "It starts much faster now." },
      { s: "Shruti", de: "Später hilft nur noch eine neue Festplatte.", en: "Later only a new hard drive will help." }
    ]
  },

  {
    id: "c098", topic: "technik",
    title: "Online einen Termin buchen",
    titleEn: "Booking an appointment online",
    lines: [
      { s: "Shruti", de: "Beim Amt bekommt man nur online einen Termin.", en: "At the council office you only get an appointment online." },
      { s: "Sijan",  de: "Ich habe es schon dreimal versucht.", en: "I've already tried three times." },
      { s: "Shruti", de: "Und es war immer voll?", en: "And it was always full?" },
      { s: "Sijan",  de: "Ja, kein einziger freier Tag.", en: "Yes, not a single free day." },
      { s: "Shruti", de: "Neue Termine kommen meistens morgens.", en: "New appointments usually come in the morning." },
      { s: "Sijan",  de: "Um welche Uhrzeit genau?", en: "At what time exactly?" },
      { s: "Shruti", de: "Bei uns um acht Uhr.", en: "Here at eight o'clock." },
      { s: "Sijan",  de: "Dann stelle ich mir einen Wecker.", en: "Then I'll set an alarm." },
      { s: "Shruti", de: "Halte deine Daten schon bereit.", en: "Have your details ready in advance." },
      { s: "Sijan",  de: "Name, Adresse und Geburtsdatum?", en: "Name, address and date of birth?" },
      { s: "Shruti", de: "Genau, sonst läuft die Zeit ab.", en: "Exactly, otherwise the time runs out." },
      { s: "Sijan",  de: "Morgen früh probiere ich es wieder.", en: "Tomorrow morning I'll try again." }
    ]
  },

  {
    id: "c099", topic: "wetter",
    title: "Sturmwarnung",
    titleEn: "Storm warning",
    lines: [
      { s: "Shruti", de: "Für heute Nacht gibt es eine Sturmwarnung.", en: "There's a storm warning for tonight." },
      { s: "Sijan",  de: "Wie stark soll der Wind werden?", en: "How strong is the wind supposed to get?" },
      { s: "Shruti", de: "Über hundert Kilometer pro Stunde.", en: "Over a hundred kilometres an hour." },
      { s: "Sijan",  de: "Dann bleibt das Auto in der Garage.", en: "Then the car stays in the garage." },
      { s: "Shruti", de: "Und alles auf dem Balkon muss rein.", en: "And everything on the balcony has to come in." },
      { s: "Sijan",  de: "Die Pflanzen auch?", en: "The plants too?" },
      { s: "Shruti", de: "Ja, sonst stehen sie morgen unten.", en: "Yes, otherwise they'll be down below tomorrow." },
      { s: "Sijan",  de: "Fährt morgen überhaupt ein Zug?", en: "Will any train run tomorrow?" },
      { s: "Shruti", de: "Schau früh in die App.", en: "Check the app early." },
      { s: "Sijan",  de: "Ich sage meinem Chef lieber Bescheid.", en: "I'd better let my boss know." },
      { s: "Shruti", de: "Vielleicht arbeitest du von zu Hause.", en: "Maybe you'll work from home." },
      { s: "Sijan",  de: "Wenn der Strom hält, ja.", en: "If the power holds, yes." }
    ]
  },

  {
    id: "c100", topic: "wetter", couple: true,
    title: "Herbst im Park",
    titleEn: "Autumn in the park",
    lines: [
      { s: "Sijan",  de: "Die Blätter sind jetzt ganz gelb.", en: "The leaves are completely yellow now." },
      { s: "Shruti", de: "Im Herbst ist der Park am schönsten.", en: "The park is at its most beautiful in autumn." },
      { s: "Sijan",  de: "Aber es wird früh dunkel.", en: "But it gets dark early." },
      { s: "Shruti", de: "Um halb sechs ist schon Abend.", en: "By half past five it's already evening." },
      { s: "Sijan",  de: "Dann gehen wir mittags spazieren.", en: "Then let's go for walks at midday." },
      { s: "Shruti", de: "Nimm eine dickere Jacke mit.", en: "Take a thicker jacket with you." },
      { s: "Sijan",  de: "Es sind doch noch zwölf Grad.", en: "It's still twelve degrees, though." },
      { s: "Shruti", de: "Im Schatten fühlt es sich kälter an.", en: "In the shade it feels colder." },
      { s: "Sijan",  de: "Riechst du das? Jemand macht ein Feuer.", en: "Can you smell that? Someone's got a fire going." },
      { s: "Shruti", de: "Das gehört für mich zum Herbst.", en: "For me that's part of autumn." },
      { s: "Sijan",  de: "Zu Hause trinken wir dann einen Tee.", en: "Then we'll have a tea at home." },
      { s: "Shruti", de: "Mit dir gehe ich hier jeden Tag spazieren.", en: "With you I'd walk here every day." }
    ]
  },

  {
    id: "c101", topic: "paar", couple: true,
    title: "Unser Jahrestag",
    titleEn: "Our anniversary",
    lines: [
      { s: "Shruti", de: "Weißt du, welcher Tag morgen ist?", en: "Do you know what day it is tomorrow?" },
      { s: "Sijan",  de: "Natürlich, unser Jahrestag.", en: "Of course, our anniversary." },
      { s: "Shruti", de: "Ich dachte, du hast es vergessen.", en: "I thought you'd forgotten." },
      { s: "Sijan",  de: "Niemals. Drei Jahre schon.", en: "Never. Three years already." },
      { s: "Shruti", de: "Die Zeit ist schnell vergangen.", en: "The time has gone by quickly." },
      { s: "Sijan",  de: "Ich habe einen Tisch reserviert.", en: "I've booked a table." },
      { s: "Shruti", de: "Wo denn?", en: "Where?" },
      { s: "Sijan",  de: "Das bleibt eine Überraschung.", en: "That stays a surprise." },
      { s: "Shruti", de: "Sag mir wenigstens, was ich anziehen soll.", en: "At least tell me what I should wear." },
      { s: "Sijan",  de: "Etwas Schönes. Um sieben gehen wir los.", en: "Something nice. We're leaving at seven." },
      { s: "Shruti", de: "Ich freue mich schon den ganzen Tag.", en: "I've been looking forward to it all day." },
      { s: "Sijan",  de: "Ich auch. Danke für diese drei Jahre.", en: "Me too. Thank you for these three years." }
    ]
  },

  {
    id: "c102", topic: "paar", couple: true,
    title: "Ich vermisse dich",
    titleEn: "I miss you",
    lines: [
      { s: "Sijan",  de: "Hallo Schatz, wie war dein Tag?", en: "Hi love, how was your day?" },
      { s: "Shruti", de: "Lang. Ich bin gerade erst im Hotel.", en: "Long. I've only just got to the hotel." },
      { s: "Sijan",  de: "Hast du schon etwas gegessen?", en: "Have you eaten anything yet?" },
      { s: "Shruti", de: "Nur ein Brot im Zug.", en: "Only a sandwich on the train." },
      { s: "Sijan",  de: "Das ist zu wenig.", en: "That's not enough." },
      { s: "Shruti", de: "Ich weiß. Ich bestelle gleich etwas.", en: "I know. I'll order something in a minute." },
      { s: "Sijan",  de: "Die Wohnung ist ohne dich viel zu still.", en: "The flat is far too quiet without you." },
      { s: "Shruti", de: "Ich vermisse dich auch.", en: "I miss you too." },
      { s: "Sijan",  de: "Wann kommst du zurück?", en: "When are you coming back?" },
      { s: "Shruti", de: "Donnerstag, mein Zug ist um sechs.", en: "Thursday, my train is at six." },
      { s: "Sijan",  de: "Ich hole dich am Bahnhof ab.", en: "I'll pick you up at the station." },
      { s: "Shruti", de: "Das ist lieb von dir.", en: "That's sweet of you." },
      { s: "Sijan",  de: "Schlaf gut. Bis morgen.", en: "Sleep well. See you tomorrow." }
    ]
  },

  {
    id: "c103", topic: "paar", couple: true,
    title: "Ein Abend nur zu zweit",
    titleEn: "An evening just for two",
    lines: [
      { s: "Shruti", de: "Heute machen wir gar nichts, oder?", en: "Today we're doing nothing at all, right?" },
      { s: "Sijan",  de: "Genau, nur wir zwei und das Sofa.", en: "Exactly, just the two of us and the sofa." },
      { s: "Shruti", de: "Handys bleiben in der Küche.", en: "Phones stay in the kitchen." },
      { s: "Sijan",  de: "Einverstanden, das tut uns gut.", en: "Agreed, that'll do us good." },
      { s: "Shruti", de: "Soll ich Popcorn machen?", en: "Shall I make popcorn?" },
      { s: "Sijan",  de: "Ja, und ich suche einen Film aus.", en: "Yes, and I'll pick a film." },
      { s: "Shruti", de: "Bitte nichts Trauriges.", en: "Please nothing sad." },
      { s: "Sijan",  de: "Eine Komödie also.", en: "A comedy then." },
      { s: "Shruti", de: "Hol bitte auch die dicke Decke.", en: "Please get the thick blanket too." },
      { s: "Sijan",  de: "Rutsch ein Stück, ich setze mich neben dich.", en: "Move over a bit, I'm sitting next to you." },
      { s: "Shruti", de: "So einen Abend brauchte ich heute.", en: "I needed an evening like this today." },
      { s: "Sijan",  de: "Solche Abende mag ich am liebsten.", en: "Evenings like this are my favourite." }
    ]
  },

  {
    id: "c104", topic: "paar", couple: true,
    title: "Nach dem Streit",
    titleEn: "After the argument",
    lines: [
      { s: "Sijan",  de: "Hast du kurz Zeit für mich?", en: "Do you have a moment for me?" },
      { s: "Shruti", de: "Ja, komm rein.", en: "Yes, come in." },
      { s: "Sijan",  de: "Es tut mir leid wegen heute Morgen.", en: "I'm sorry about this morning." },
      { s: "Shruti", de: "Du warst wirklich laut.", en: "You really were loud." },
      { s: "Sijan",  de: "Ich war müde, aber das ist keine Entschuldigung.", en: "I was tired, but that's no excuse." },
      { s: "Shruti", de: "Danke, dass du das sagst.", en: "Thank you for saying that." },
      { s: "Sijan",  de: "Was hat dich am meisten geärgert?", en: "What annoyed you the most?" },
      { s: "Shruti", de: "Du hast mich nicht ausreden lassen.", en: "You didn't let me finish speaking." },
      { s: "Sijan",  de: "Das mache ich zu oft, ich weiß.", en: "I do that too often, I know." },
      { s: "Shruti", de: "Beim nächsten Mal warten wir beide kurz.", en: "Next time let's both wait a moment." },
      { s: "Sijan",  de: "Abgemacht. Sind wir wieder gut?", en: "Agreed. Are we alright again?" },
      { s: "Shruti", de: "Ja. Komm her.", en: "Yes. Come here." }
    ]
  },

  {
    id: "c105", topic: "paar", couple: true,
    title: "Wir brauchen mehr Platz",
    titleEn: "We need more space",
    lines: [
      { s: "Shruti", de: "Unsere Wohnung wird langsam zu klein.", en: "Our flat is slowly getting too small." },
      { s: "Sijan",  de: "Findest du? Mir gefällt sie.", en: "Do you think so? I like it." },
      { s: "Shruti", de: "Mir auch, aber wir arbeiten beide zu Hause.", en: "Me too, but we both work from home." },
      { s: "Sijan",  de: "Das stimmt, ein Zimmer mehr wäre schön.", en: "That's true, one more room would be nice." },
      { s: "Shruti", de: "Und ein Balkon nach Süden.", en: "And a balcony facing south." },
      { s: "Sijan",  de: "Was können wir uns leisten?", en: "What can we afford?" },
      { s: "Shruti", de: "Hundert Euro mehr im Monat, denke ich.", en: "A hundred euros more a month, I think." },
      { s: "Sijan",  de: "Wollen wir im selben Viertel bleiben?", en: "Do we want to stay in the same neighbourhood?" },
      { s: "Shruti", de: "Ja, ich mag unsere Nachbarn.", en: "Yes, I like our neighbours." },
      { s: "Sijan",  de: "Dann schauen wir in Ruhe, ohne Stress.", en: "Then let's look calmly, without any stress." },
      { s: "Shruti", de: "Wichtig ist nur, dass wir zusammen wohnen.", en: "The only important thing is that we live together." },
      { s: "Sijan",  de: "Genau so sehe ich das auch.", en: "That's exactly how I see it too." }
    ]
  },

  {
    id: "c106", topic: "paar", couple: true,
    title: "Eine Überraschung planen",
    titleEn: "Planning a surprise",
    lines: [
      { s: "Sijan",  de: "Shruti hat nächsten Monat Geburtstag.", en: "It's Shruti's birthday next month." },
      { s: "Shruti", de: "Und was hast du vor?", en: "And what are you planning?" },
      { s: "Sijan",  de: "Ich möchte ihre Freunde einladen.", en: "I'd like to invite her friends." },
      { s: "Shruti", de: "Weiß sie schon etwas davon?", en: "Does she know anything about it yet?" },
      { s: "Sijan",  de: "Nein, es soll eine Überraschung sein.", en: "No, it's supposed to be a surprise." },
      { s: "Shruti", de: "Wo feiert ihr denn?", en: "Where are you celebrating?" },
      { s: "Sijan",  de: "Bei uns zu Hause, das ist gemütlicher.", en: "At our place, that's cosier." },
      { s: "Shruti", de: "Brauchst du Hilfe beim Kochen?", en: "Do you need help with the cooking?" },
      { s: "Sijan",  de: "Ja, für zehn Leute schaffe ich das nicht allein.", en: "Yes, for ten people I can't manage on my own." },
      { s: "Shruti", de: "Ich komme am Nachmittag vorbei.", en: "I'll come over in the afternoon." },
      { s: "Sijan",  de: "Und bitte sag ihr kein Wort.", en: "And please don't say a word to her." },
      { s: "Shruti", de: "Versprochen, ich schweige.", en: "Promise, my lips are sealed." }
    ]
  },

  {
    id: "c107", topic: "paar", couple: true,
    title: "Ein Wochenende weg",
    titleEn: "A weekend away",
    lines: [
      { s: "Shruti", de: "Sollen wir am Wochenende wegfahren?", en: "Shall we go away at the weekend?" },
      { s: "Sijan",  de: "Gern, nur wir beide.", en: "I'd love to, just the two of us." },
      { s: "Shruti", de: "In die Berge oder ans Wasser?", en: "To the mountains or to the water?" },
      { s: "Sijan",  de: "In die Berge, da ist es ruhiger.", en: "To the mountains, it's quieter there." },
      { s: "Shruti", de: "Zwei Nächte oder nur eine?", en: "Two nights or just one?" },
      { s: "Sijan",  de: "Zwei, sonst sind wir nur unterwegs.", en: "Two, otherwise we're only travelling." },
      { s: "Shruti", de: "Ich suche ein kleines Hotel.", en: "I'll look for a small hotel." },
      { s: "Sijan",  de: "Mit Frühstück, bitte.", en: "With breakfast, please." },
      { s: "Shruti", de: "Und wandern wir am Samstag?", en: "And shall we hike on Saturday?" },
      { s: "Sijan",  de: "Ja, aber nichts Anstrengendes.", en: "Yes, but nothing strenuous." },
      { s: "Shruti", de: "Abends dann gutes Essen und früh ins Bett.", en: "Then good food in the evening and an early night." },
      { s: "Sijan",  de: "Das klingt nach dem perfekten Wochenende mit dir.", en: "That sounds like the perfect weekend with you." }
    ]
  },

  {
    id: "c108", topic: "paar", couple: true,
    title: "Danke für heute",
    titleEn: "Thank you for today",
    lines: [
      { s: "Sijan",  de: "Du hast heute so viel gemacht.", en: "You did so much today." },
      { s: "Shruti", de: "Es war ein voller Tag.", en: "It was a full day." },
      { s: "Sijan",  de: "Setz dich, ich räume den Rest auf.", en: "Sit down, I'll clear up the rest." },
      { s: "Shruti", de: "Wirklich? Danke.", en: "Really? Thank you." },
      { s: "Sijan",  de: "Möchtest du noch einen Tee?", en: "Would you like another tea?" },
      { s: "Shruti", de: "Ja, aber ohne Zucker.", en: "Yes, but without sugar." },
      { s: "Sijan",  de: "Ich weiß doch, wie du ihn trinkst.", en: "I know how you drink it." },
      { s: "Shruti", de: "Manchmal vergesse ich, dir Danke zu sagen.", en: "Sometimes I forget to say thank you to you." },
      { s: "Sijan",  de: "Das musst du nicht jeden Tag.", en: "You don't have to every day." },
      { s: "Shruti", de: "Doch, ein bisschen schon.", en: "Yes I do, a little bit." },
      { s: "Sijan",  de: "Dann sage ich es auch: danke für alles.", en: "Then I'll say it too: thank you for everything." },
      { s: "Shruti", de: "Morgen machen wir es uns wieder schön.", en: "Tomorrow we'll make it nice again." }
    ]
  }

];
