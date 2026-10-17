/* PYLON IX Core — isolated, offline, zero-cost prototype.
   No API calls, storage, tracking or external dependencies. */
export const PYLON_VERSION = "0.1.0";
export const PYLON_BRAND = Object.freeze({ name: "PYLON IX", shortName: "PYLON" });
const STRINGS = {
  de: {
    greeting: "Ich bin PYLON IX. Frag mich nach Helden, KvK, Account oder Allianz.",
    unknown: "Dazu fehlen mir noch verlässliche Daten. Öffne das passende PHALANX-Modul oder gib mir mehr Kontext.",
    heroes: "Für eine Heldenempfehlung brauche ich Sterne, Skills, Generation und dein Ziel. Nutze den Heldenrechner.",
    kvk: "Prüfe KvK Prep, Power-Trends und Gegnerdaten. Ohne aktuelle Daten gebe ich keine Risikobewertung ab.",
    account: "Für einen Account-Plan benötige ich deinen aktuellen Stand und dein Ziel. Persönliche Daten bleiben zunächst lokal.",
    alliance: "Für Allianzvergleiche nutze Mitgliederzahl, Power und aktuelle Reports. Fehlende Werte werden nicht geschätzt."
  },
  en: {
    greeting: "I'm PYLON IX. Ask about heroes, KvK, your account or alliance.",
    unknown: "I don't have reliable data for that yet. Open the relevant PHALANX module or provide more context.",
    heroes: "For hero advice, I need stars, skills, generation and your goal. Use the Hero Calculator.",
    kvk: "Review KvK Prep, power trends and opponent data. I won't rate risk without current data.",
    account: "For an account plan, I need your current status and goal. Personal data stays local for now.",
    alliance: "Alliance comparisons need member counts, power and current reports. Missing values won't be guessed."
  },
  fr: {
    greeting: "Je suis PYLON IX. Posez vos questions sur les héros, le KvK, votre compte ou votre alliance.",
    unknown: "Je manque de données fiables. Ouvrez le module PHALANX approprié ou donnez plus de contexte.",
    heroes: "Pour conseiller vos héros, il me faut les étoiles, compétences, génération et objectif. Utilisez le calculateur.",
    kvk: "Consultez KvK Prep, les tendances de puissance et les adversaires. Aucun risque ne sera estimé sans données.",
    account: "Pour planifier votre compte, il me faut votre situation et votre objectif. Les données restent locales.",
    alliance: "Comparer les alliances nécessite membres, puissance et rapports récents. Les données absentes ne sont pas inventées."
  }
};
export const MODULES = Object.freeze({
  heroes: "hero-calculator", kvk: "kvk-prep",
  account: "account-intelligence", alliance: "alliance-comparison"
});
export function askPylon(question, { language = "en" } = {}) {
  const lang = Object.hasOwn(STRINGS, language) ? language : "en";
  const text = String(question ?? "").trim().toLowerCase();
  const strings = STRINGS[lang];
  if (!text) return { text: strings.greeting, intent: "greeting", module: null, confidence: "rule" };
  const rules = [
    ["heroes", /held|hero|héro|skill|stern|star|étoile|splitter|formation/],
    ["kvk", /kvk|gegner|opponent|adversaire|matchmaking|battle|kampf|bataille/],
    ["account", /account|konto|compte|upgrade|aufwert|amélior|progress/],
    ["alliance", /allianz|alliance|mitglied|member|membre|vergleich|compar/]
  ];
  const intent = rules.find(([, regex]) => regex.test(text))?.[0] ?? "unknown";
  return { text: strings[intent], intent, module: MODULES[intent] ?? null, confidence: "rule" };
}
