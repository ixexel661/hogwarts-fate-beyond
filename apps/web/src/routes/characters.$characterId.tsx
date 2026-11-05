import { Link, createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

import { CharacterSheet } from "@/components/sheet/character-sheet";
import { SheetProvider } from "@/components/sheet/sheet-context";
import { Button } from "@/components/ui/button";
import { getCharacter } from "@/server/characters";

const searchSchema = z.object({
  edit: z.boolean().optional().catch(undefined),
});

export const Route = createFileRoute("/characters/$characterId")({
  validateSearch: searchSchema,
  loader: ({ params }) => getCharacter({ data: { id: params.characterId } }),
  head: ({ loaderData }) => ({
    meta: [{ title: `${loaderData?.name.trim() || "Charakter"} – Charakterbogen` }],
  }),
  component: CharacterSheetRoute,
  notFoundComponent: CharacterNotFound,
});

function CharacterSheetRoute() {
  const character = Route.useLoaderData();
  const { edit } = Route.useSearch();

  return (
    <SheetProvider key={character.id} initial={character} editing={edit === true}>
      <CharacterSheet />
    </SheetProvider>
  );
}

function CharacterNotFound() {
  return (
    <div className="mx-auto max-w-md px-4 py-16">
      <div className="parchment rounded-md p-8 text-center shadow-xl">
        <h1 className="font-display text-2xl font-bold">Charakter nicht gefunden</h1>
        <p className="mt-2 italic">Dieser Bogen ist wohl im Verbotenen Wald verschwunden.</p>
        <Button className="mt-6" nativeButton={false} render={<Link to="/" />}>
          Zur Übersicht
        </Button>
      </div>
    </div>
  );
}
