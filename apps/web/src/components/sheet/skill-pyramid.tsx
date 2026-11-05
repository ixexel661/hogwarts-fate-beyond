import { useId, useMemo, useState } from "react";

import {
  PYRAMID_ROWS,
  SKILLS,
  findDuplicateSkills,
  isDuplicateSkill,
  skillRating,
} from "@/lib/character/rules";
import { cn } from "@/lib/utils";

import { SheetSection } from "./parchment";
import { useSheet } from "./sheet-context";

const normalize = (value: string) => value.trim().toLocaleLowerCase("de");

export function SkillPyramid() {
  const { character } = useSheet();
  const duplicates = useMemo(() => findDuplicateSkills(character.skills), [character.skills]);

  return (
    <SheetSection title="Fertigkeitenpyramide">
      <div className="flex flex-col gap-2.5">
        {PYRAMID_ROWS.map((row) => (
          <div key={row.rating} className="flex items-center gap-2">
            <span
              title={row.ladder}
              className="w-8 shrink-0 text-right font-display text-xl font-bold text-ink sm:text-2xl"
            >
              +{row.rating}
            </span>
            <div className="flex flex-1 flex-wrap justify-center gap-1.5 sm:flex-nowrap sm:gap-2">
              {row.slots.map((slot) => (
                <SkillSlot
                  key={slot}
                  slot={slot}
                  rating={row.rating}
                  duplicate={isDuplicateSkill(duplicates, character.skills[slot] ?? "")}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
      {duplicates.size > 0 ? (
        <p role="alert" className="mt-3 text-center text-sm font-semibold text-destructive">
          Jede Fertigkeit darf nur einmal in der Pyramide stehen.
        </p>
      ) : null}
      <p className="mt-3 text-center text-sm italic text-ink/80">
        Fertigkeiten frei in die Pyramide eintragen; die Liste unten dient als Orientierung.
      </p>
    </SheetSection>
  );
}

function SkillSlot({
  slot,
  rating,
  duplicate,
}: {
  slot: number;
  rating: number;
  duplicate: boolean;
}) {
  const { character, editing, update } = useSheet();
  const listId = useId();
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const value = character.skills[slot] ?? "";

  const suggestions = useMemo(() => {
    const query = normalize(value);
    const usedElsewhere = new Set(
      character.skills.filter((_, index) => index !== slot).map(normalize),
    );
    return SKILLS.filter((skill) => {
      const name = normalize(skill.name);
      return !usedElsewhere.has(name) && name !== query && name.includes(query);
    });
  }, [character.skills, slot, value]);

  const showList = editing && open && suggestions.length > 0;

  const setSkill = (next: string) =>
    update((current) => ({
      skills: current.skills.map((skill, index) => (index === slot ? next : skill)),
    }));

  const choose = (name: string) => {
    setSkill(name);
    setOpen(false);
  };

  const onKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "ArrowDown" && showList) {
      event.preventDefault();
      setActive((index) => (index + 1) % suggestions.length);
    } else if (event.key === "ArrowUp" && showList) {
      event.preventDefault();
      setActive((index) => (index - 1 + suggestions.length) % suggestions.length);
    } else if (event.key === "Enter") {
      // Fertigkeiten sind einzeilig: Enter übernimmt den Vorschlag statt eines Zeilenumbruchs.
      event.preventDefault();
      if (showList) choose(suggestions[active]?.name ?? value);
      else setOpen(false);
    } else if (event.key === "Escape") {
      setOpen(false);
    }
  };

  return (
    // Auf schmalen Bildschirmen zwei Kästchen pro Zeile, sonst die klassische Pyramide.
    <div className="relative min-w-0 basis-[calc(50%-0.2rem)] sm:max-w-40 sm:basis-1/4">
      <div
        className={cn(
          "flex h-14 items-center rounded-[3px] border border-ink/45 bg-parchment-field/75 px-1 shadow-[inset_0_1px_3px_rgb(90_60_20/0.12)] transition-[border-color,box-shadow] focus-within:border-house-ink focus-within:ring-2 focus-within:ring-house-accent/45 sm:h-16",
          !editing && "bg-parchment-field/35 shadow-none",
          duplicate &&
            "border-destructive bg-destructive/10 ring-2 ring-destructive/30 focus-within:border-destructive focus-within:ring-destructive/40",
        )}
      >
        <textarea
          rows={1}
          value={value}
          readOnly={!editing}
          aria-label={`Fertigkeit auf +${rating}`}
          aria-invalid={duplicate || undefined}
          role={editing ? "combobox" : undefined}
          aria-expanded={editing ? showList : undefined}
          aria-controls={editing ? listId : undefined}
          aria-autocomplete={editing ? "list" : undefined}
          maxLength={60}
          onChange={(event) => {
            setSkill(event.target.value.replace(/\s*\n\s*/g, " "));
            setOpen(true);
            setActive(0);
          }}
          onFocus={() => setOpen(true)}
          onBlur={() => setOpen(false)}
          onKeyDown={onKeyDown}
          lang="de"
          className="max-h-full w-full field-sizing-content resize-none overflow-hidden bg-transparent text-center text-[0.95rem] leading-tight font-semibold hyphens-auto text-ink outline-none"
        />
      </div>
      {showList ? (
        <ul
          id={listId}
          role="listbox"
          className="absolute top-full left-1/2 z-20 mt-1 max-h-60 w-max min-w-full -translate-x-1/2 overflow-auto rounded-md border border-ink/40 bg-popover py-1 text-sm shadow-xl"
        >
          {suggestions.map((skill, index) => (
            <li
              key={skill.name}
              role="option"
              aria-selected={index === active}
              // mousedown statt click, damit das Textfeld nicht vorher den Fokus verliert
              onMouseDown={(event) => {
                event.preventDefault();
                choose(skill.name);
              }}
              onMouseEnter={() => setActive(index)}
              className={cn(
                "cursor-pointer px-3 py-1",
                index === active && "bg-house-ink text-primary-foreground",
              )}
            >
              <span className="font-semibold">{skill.name}</span>
              <span
                className={cn(
                  "ml-2 text-xs italic",
                  index === active ? "opacity-80" : "text-ink/60",
                )}
              >
                {skill.usage}
              </span>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}

export function SkillReference() {
  const { character } = useSheet();
  // Auf breiten Bögen zweispaltig, damit die Seite kompakt bleibt.
  const half = Math.ceil(SKILLS.length / 2);
  const columns = [SKILLS.slice(0, half), SKILLS.slice(half)];

  return (
    <SheetSection title="Fertigkeiten – Einsatz">
      <div className="grid sm:grid-cols-2 sm:gap-x-6">
        {columns.map((skills, column) => (
          <table
            key={column}
            className="w-full border-collapse self-start text-sm sm:text-[0.95rem]"
          >
            <thead className="sr-only">
              <tr>
                <th>Fertigkeit</th>
                <th>Einsatz</th>
                <th>Wert</th>
              </tr>
            </thead>
            <tbody>
              {skills.map((skill) => {
                const rating = skillRating(character.skills, skill.name);
                return (
                  <tr
                    key={skill.name}
                    className={cn("border-b border-ink/20", rating > 0 && "bg-house-accent/15")}
                  >
                    <th
                      scope="row"
                      className="py-1 pr-2 pl-1 text-left font-bold whitespace-nowrap"
                    >
                      {skill.name}
                    </th>
                    <td className="border-l border-ink/20 py-1 pl-2">{skill.usage}</td>
                    <td className="w-8 py-1 pr-1 text-right font-display font-bold text-house-ink">
                      {rating > 0 ? `+${rating}` : ""}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        ))}
      </div>
    </SheetSection>
  );
}
