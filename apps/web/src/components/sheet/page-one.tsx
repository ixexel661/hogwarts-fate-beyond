import { useId } from "react";

import { ASPECTS, HOUSES, HOUSE_KEYS, type HouseKey } from "@/lib/character/rules";
import { cn } from "@/lib/utils";

import { SheetInput, SheetTextarea } from "./fields";
import {
  Divider,
  FieldLabel,
  Illustration,
  SheetPage,
  SheetSection,
  fieldClass,
} from "./parchment";
import { SchoolYearFooter } from "./school-year";
import { useSheet } from "./sheet-context";
import { SkillPyramid, SkillReference } from "./skill-pyramid";

export function PageOne() {
  return (
    <SheetPage
      page={1}
      subtitle="Charakter · Aspekte · Fertigkeiten"
      footer={<SchoolYearFooter />}
      left={<Illustration name="castle" className="w-full max-w-44" />}
      right={<Illustration name="owl-letter" className="w-full max-w-28" />}
    >
      <PersonalSection />
      <Divider />
      <AspectsSection />
      <Divider />
      <SkillPyramid />
      <SkillReference />
    </SheetPage>
  );
}

function PersonalSection() {
  const id = useId();
  return (
    <SheetSection title="Persönliche Angaben">
      <div className="grid gap-x-4 gap-y-3 sm:grid-cols-[minmax(0,1fr)_14rem]">
        <div>
          <FieldLabel htmlFor={`${id}-name`}>Name</FieldLabel>
          <SheetInput id={`${id}-name`} field="name" />
        </div>
        <div>
          <FieldLabel htmlFor={`${id}-age`}>Alter</FieldLabel>
          <SheetInput id={`${id}-age`} field="age" />
        </div>
        <div>
          <FieldLabel htmlFor={`${id}-origin`}>Herkunft</FieldLabel>
          <SheetInput id={`${id}-origin`} field="origin" />
        </div>
        <div>
          <FieldLabel htmlFor={`${id}-house`}>Haus (nach Einteilung)</FieldLabel>
          <HouseSelect id={`${id}-house`} />
        </div>
      </div>
    </SheetSection>
  );
}

function HouseSelect({ id }: { id: string }) {
  const { character, editing, update } = useSheet();
  const label = character.house ? HOUSES[character.house].label : "";

  if (!editing) {
    return (
      <input
        id={id}
        type="text"
        readOnly
        value={label}
        placeholder="Noch nicht eingeteilt"
        className={cn(fieldClass, "h-10 font-semibold text-house-ink")}
      />
    );
  }

  return (
    <select
      id={id}
      value={character.house ?? ""}
      onChange={(event) => update({ house: (event.target.value || null) as HouseKey | null })}
      className={cn(fieldClass, "h-10 cursor-pointer font-semibold text-house-ink")}
    >
      <option value="">Noch nicht eingeteilt</option>
      {HOUSE_KEYS.map((key) => (
        <option key={key} value={key}>
          {HOUSES[key].label}
        </option>
      ))}
    </select>
  );
}

function AspectsSection() {
  const id = useId();
  return (
    <SheetSection title="Charakteraspekte">
      <div className="flex flex-col gap-3">
        {ASPECTS.map((aspect) => (
          <div
            key={aspect.key}
            className="grid items-center gap-x-4 gap-y-1 sm:grid-cols-[10.5rem_minmax(0,1fr)]"
          >
            <label htmlFor={`${id}-${aspect.key}`} className="leading-tight">
              <span className="block text-sm font-bold tracking-wider uppercase sm:text-[0.9rem]">
                {aspect.label}
              </span>
              <span className="text-sm text-ink/85 sm:text-[0.95rem]">{aspect.prompt}</span>
            </label>
            <SheetTextarea
              id={`${id}-${aspect.key}`}
              field={aspect.key}
              rows={1}
              className="min-h-12 py-2.5 text-[1.05rem]"
            />
          </div>
        ))}
      </div>
    </SheetSection>
  );
}
