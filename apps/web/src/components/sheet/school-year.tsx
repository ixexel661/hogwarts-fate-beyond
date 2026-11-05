import { SCHOOL_YEARS, schoolYearLabel } from "@/lib/character/rules";

import { useSheet } from "./sheet-context";

/** Schuljahr in der Fußzeile, im Bearbeitungsmodus auswählbar. */
export function SchoolYearFooter() {
  const { character, editing, update } = useSheet();

  if (!editing) return <span>{schoolYearLabel(character.schoolYear)}</span>;

  return (
    <select
      aria-label="Schuljahr"
      value={character.schoolYear}
      onChange={(event) => update({ schoolYear: Number(event.target.value) })}
      className="cursor-pointer rounded-sm bg-transparent font-display font-bold tracking-wider uppercase outline-none focus-visible:ring-2 focus-visible:ring-house-accent/50"
    >
      {SCHOOL_YEARS.map((label, index) => (
        <option key={label} value={index + 1}>
          {label}
        </option>
      ))}
    </select>
  );
}
