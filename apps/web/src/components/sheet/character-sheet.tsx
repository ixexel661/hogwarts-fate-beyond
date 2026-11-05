import { useNavigate } from "@tanstack/react-router";
import {
  TriangleAlertIcon,
  ArrowLeftIcon,
  CheckIcon,
  CloudCheckIcon,
  LoaderCircleIcon,
  PencilIcon,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { houseDataAttr } from "@/lib/character/rules";

import { PageOne } from "./page-one";
import { PageTwo } from "./page-two";
import { type SaveStatus, useSheet } from "./sheet-context";

export function CharacterSheet() {
  const { character } = useSheet();

  return (
    <div data-house={houseDataAttr(character.house)} className="pb-12">
      <SheetToolbar />
      <div className="mx-auto grid max-w-[110rem] items-start gap-8 px-2 pt-6 sm:px-6 2xl:grid-cols-2">
        <PageOne />
        <PageTwo />
      </div>
    </div>
  );
}

function SheetToolbar() {
  const { character, editing, status, flush } = useSheet();
  const navigate = useNavigate();

  const goBack = async () => {
    await flush();
    await navigate({ to: "/" });
  };

  const toggleEditing = () =>
    navigate({
      to: "/characters/$characterId",
      params: { characterId: character.id },
      search: editing ? {} : { edit: true },
      replace: true,
    });

  return (
    <div className="parchment sticky top-0 z-30 border-b border-house-ink/40 shadow-lg">
      <div className="mx-auto flex max-w-[110rem] items-center gap-2 px-3 py-2 sm:px-6">
        <Button variant="ghost" size="lg" onClick={goBack} className="text-sm">
          <ArrowLeftIcon />
          <span className="hidden sm:inline">Übersicht</span>
        </Button>
        <p className="min-w-0 flex-1 truncate text-center font-display text-base font-bold text-house-ink sm:text-lg">
          {character.name.trim() || "Unbenannt"}
        </p>
        <SaveIndicator status={status} />
        <Button size="lg" onClick={toggleEditing} className="min-w-28 text-sm">
          {editing ? <CheckIcon /> : <PencilIcon />}
          {editing ? "Fertig" : "Bearbeiten"}
        </Button>
      </div>
      <p className="bg-house-ink py-0.5 text-center text-xs text-primary-foreground">
        {editing
          ? "Bearbeitungsmodus: Alle Felder sind änderbar."
          : "Spielmodus: Stress, Konsequenzen und Notizen sind änderbar."}
      </p>
    </div>
  );
}

function SaveIndicator({ status }: { status: SaveStatus }) {
  const content = {
    saved: { icon: <CloudCheckIcon />, label: "Gespeichert" },
    pending: { icon: <LoaderCircleIcon className="animate-spin" />, label: "Speichert …" },
    saving: { icon: <LoaderCircleIcon className="animate-spin" />, label: "Speichert …" },
    error: { icon: <TriangleAlertIcon />, label: "Nicht gespeichert" },
  }[status];

  return (
    <p
      aria-live="polite"
      className={
        status === "error"
          ? "flex items-center gap-1.5 text-sm font-semibold text-destructive [&_svg]:size-4"
          : "flex items-center gap-1.5 text-sm text-ink/70 [&_svg]:size-4"
      }
    >
      {content.icon}
      <span className="hidden md:inline">{content.label}</span>
    </p>
  );
}
