import { z } from "zod";

import { HOUSE_KEYS, SKILL_SLOT_COUNT, STRESS_TRACK_LENGTH, STUNT_COUNT } from "./rules";

const line = z.string().max(300);
const text = z.string().max(3000);

export const characterSheetSchema = z.object({
  // Persönliche Angaben
  name: z.string().max(100),
  age: z.string().max(50),
  origin: line,
  house: z.enum(HOUSE_KEYS).nullable(),
  schoolYear: z.number().int().min(1).max(7),

  // Charakteraspekte
  highConcept: line,
  trouble: line,
  background: line,
  relationship: line,
  freeAspect: line,

  // Fertigkeitenpyramide
  skills: z.array(z.string().max(60)).length(SKILL_SLOT_COUNT),

  // Zauberstab
  wandWood: line,
  wandCore: line,
  wandLength: line,
  wandFlexibility: line,
  wandSpecial: text,

  // Stunts, Stress, Konsequenzen
  stunts: z.array(text).length(STUNT_COUNT),
  physicalStress: z.array(z.boolean()).length(STRESS_TRACK_LENGTH),
  mentalStress: z.array(z.boolean()).length(STRESS_TRACK_LENGTH),
  consequenceMild: line,
  consequenceModerate: line,
  consequenceSevere: line,

  notes: z.string().max(20000),
});

export type CharacterSheet = z.infer<typeof characterSheetSchema>;
export type CharacterPatch = Partial<CharacterSheet>;
export type Character = CharacterSheet & { id: string; updatedAt: Date };

export const characterIdInput = z.object({ id: z.string().min(1) });

export const createCharacterInput = z.object({
  name: z.string().trim().min(1, "Bitte gib einen Namen ein.").max(100),
});

export const updateCharacterInput = z.object({
  id: z.string().min(1),
  patch: characterSheetSchema.partial(),
});
