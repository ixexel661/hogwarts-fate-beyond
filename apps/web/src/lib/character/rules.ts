// Regeln und feste Inhalte des Hogwarts-Fate-Core-Charakterbogens.

export const SKILLS = [
  { name: "Zauberkunst", usage: "Zauber wirken" },
  { name: "Verteidigung", usage: "Abwehr / Duelle" },
  { name: "Zaubertränke", usage: "Brauen / Zutaten" },
  { name: "Kräuterkunde", usage: "Pflanzenkunde" },
  { name: "Magische Wesen", usage: "Wesen verstehen" },
  { name: "Magisches Wissen", usage: "Theorie / Runen" },
  { name: "Nachforschung", usage: "Spuren / Recherche" },
  { name: "Wahrnehmung", usage: "Details erkennen" },
  { name: "Einfühlung", usage: "Absichten erkennen" },
  { name: "Überzeugen", usage: "Andere gewinnen" },
  { name: "Täuschung", usage: "Lügen / Ablenken" },
  { name: "Heimlichkeit", usage: "Schleichen" },
  { name: "Athletik", usage: "Bewegung / Ausweichen" },
  { name: "Kraft", usage: "Körperliche Stärke" },
  { name: "Willenskraft", usage: "Mut / Konzentration" },
] as const;

/** Fertigkeitenpyramide: Die Slots sind Indizes im `skills`-Array des Charakters. */
export const PYRAMID_ROWS = [
  { rating: 4, ladder: "Großartig", slots: [0] },
  { rating: 3, ladder: "Gut", slots: [1, 2] },
  { rating: 2, ladder: "Ordentlich", slots: [3, 4, 5] },
  { rating: 1, ladder: "Durchschnittlich", slots: [6, 7, 8, 9] },
] as const;

export const SKILL_SLOT_COUNT = 10;
export const STUNT_COUNT = 3;

/** Feste Kästchen pro Stressleiste, dazu kommen bis zu 3 durch die Fertigkeit. */
export const STRESS_BASE_BOXES = 4;
export const STRESS_MAX_EXTRA_BOXES = 3;
export const STRESS_TRACK_LENGTH = STRESS_BASE_BOXES + STRESS_MAX_EXTRA_BOXES;

export const STRESS_TRACKS = [
  {
    key: "physicalStress",
    label: "Körperlich",
    skill: "Kraft",
    hint: "Anzahl Kästchen abhängig von Kraft (maximal 3 zusätzliche Kästchen).",
  },
  {
    key: "mentalStress",
    label: "Mental",
    skill: "Willenskraft",
    hint: "Anzahl Kästchen abhängig von Willenskraft (maximal 3 zusätzliche Kästchen).",
  },
] as const;

export const ASPECTS = [
  { key: "highConcept", label: "Kernkonzept", prompt: "Wer bist du?" },
  { key: "trouble", label: "Dilemma", prompt: "Was bringt dich in Schwierigkeiten?" },
  { key: "background", label: "Herkunft", prompt: "Was prägt dich?" },
  { key: "relationship", label: "Beziehung", prompt: "Wer ist dir wichtig?" },
  { key: "freeAspect", label: "Freier Aspekt", prompt: "Was macht dich besonders?" },
] as const;

export const CONSEQUENCES = [
  { key: "consequenceMild", label: "Leicht", value: 2 },
  { key: "consequenceModerate", label: "Mittel", value: 4 },
  { key: "consequenceSevere", label: "Schwer", value: 6 },
] as const;

export const WAND_FIELDS = [
  { key: "wandWood", label: "Holz" },
  { key: "wandCore", label: "Kern" },
  { key: "wandLength", label: "Länge" },
  { key: "wandFlexibility", label: "Flexibilität" },
] as const;

export const HOUSE_KEYS = ["GRYFFINDOR", "HUFFLEPUFF", "RAVENCLAW", "SLYTHERIN"] as const;
export type HouseKey = (typeof HOUSE_KEYS)[number];

export const HOUSES: Record<HouseKey, { label: string }> = {
  GRYFFINDOR: { label: "Gryffindor" },
  HUFFLEPUFF: { label: "Hufflepuff" },
  RAVENCLAW: { label: "Ravenclaw" },
  SLYTHERIN: { label: "Slytherin" },
};

/** Wert für das `data-house`-Attribut, über das die Hausfarben im CSS gesetzt werden. */
export function houseDataAttr(house: HouseKey | null) {
  return house ? house.toLowerCase() : "none";
}

export const SCHOOL_YEARS = [
  "Erstes Schuljahr",
  "Zweites Schuljahr",
  "Drittes Schuljahr",
  "Viertes Schuljahr",
  "Fünftes Schuljahr",
  "Sechstes Schuljahr",
  "Siebtes Schuljahr",
] as const;

export function schoolYearLabel(year: number) {
  return SCHOOL_YEARS[year - 1] ?? SCHOOL_YEARS[0];
}

export function slotRating(slot: number) {
  return PYRAMID_ROWS.find((row) => (row.slots as readonly number[]).includes(slot))?.rating ?? 0;
}

function normalize(name: string) {
  return name.trim().toLocaleLowerCase("de");
}

/** Wert einer Fertigkeit in der Pyramide (0, wenn sie nicht eingetragen ist). */
export function skillRating(skills: readonly string[], name: string) {
  const target = normalize(name);
  let best = 0;
  skills.forEach((skill, slot) => {
    if (normalize(skill) === target) best = Math.max(best, slotRating(slot));
  });
  return best;
}

export function stressBoxCount(skills: readonly string[], skill: string) {
  return STRESS_BASE_BOXES + Math.min(skillRating(skills, skill), STRESS_MAX_EXTRA_BOXES);
}

/** Normalisierte Namen von Fertigkeiten, die mehr als einmal in der Pyramide stehen. */
export function findDuplicateSkills(skills: readonly string[]) {
  const seen = new Set<string>();
  const duplicates = new Set<string>();
  for (const skill of skills) {
    const key = normalize(skill);
    if (!key) continue;
    if (seen.has(key)) duplicates.add(key);
    seen.add(key);
  }
  return duplicates;
}

export function isDuplicateSkill(duplicates: Set<string>, skill: string) {
  return duplicates.has(normalize(skill));
}
