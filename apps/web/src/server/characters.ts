import prisma from "@hogwarts-fate-beyond/db";
import { notFound } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";

import { SKILL_SLOT_COUNT, STRESS_TRACK_LENGTH, STUNT_COUNT } from "@/lib/character/rules";
import {
  type Character,
  characterIdInput,
  createCharacterInput,
  updateCharacterInput,
} from "@/lib/character/schema";

export const listCharacters = createServerFn({ method: "GET" }).handler(async () => {
  return prisma.character.findMany({
    select: { id: true, name: true, house: true, highConcept: true, updatedAt: true },
    orderBy: { updatedAt: "desc" },
  });
});

export const getCharacter = createServerFn({ method: "GET" })
  .validator(characterIdInput)
  .handler(async ({ data }): Promise<Character> => {
    const character = await prisma.character.findUnique({
      where: { id: data.id },
      omit: { createdAt: true },
    });
    if (!character) throw notFound();
    return character;
  });

export const createCharacter = createServerFn({ method: "POST" })
  .validator(createCharacterInput)
  .handler(async ({ data }) => {
    const character = await prisma.character.create({
      data: {
        name: data.name,
        skills: Array.from({ length: SKILL_SLOT_COUNT }, () => ""),
        stunts: Array.from({ length: STUNT_COUNT }, () => ""),
        physicalStress: Array.from({ length: STRESS_TRACK_LENGTH }, () => false),
        mentalStress: Array.from({ length: STRESS_TRACK_LENGTH }, () => false),
      },
      select: { id: true },
    });
    return character;
  });

export const updateCharacter = createServerFn({ method: "POST" })
  .validator(updateCharacterInput)
  .handler(async ({ data }) => {
    const character = await prisma.character.update({
      where: { id: data.id },
      data: data.patch,
      select: { updatedAt: true },
    });
    return character;
  });

export const deleteCharacter = createServerFn({ method: "POST" })
  .validator(characterIdInput)
  .handler(async ({ data }) => {
    await prisma.character.delete({ where: { id: data.id } });
    return { ok: true };
  });
