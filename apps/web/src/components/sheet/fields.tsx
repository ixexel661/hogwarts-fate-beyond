import type { CharacterPatch, CharacterSheet } from "@/lib/character/schema";
import { cn } from "@/lib/utils";

import { fieldClass } from "./parchment";
import { useSheet } from "./sheet-context";

/** Alle Felder des Charakters, die einen einzelnen Text enthalten. */
export type TextFieldKey = {
  [K in keyof CharacterSheet]-?: CharacterSheet[K] extends string ? K : never;
}[keyof CharacterSheet];

interface BoundFieldProps {
  field: TextFieldKey;
  /** Auch im Spielmodus änderbar (Stress, Konsequenzen, Notizen). */
  playable?: boolean;
  id?: string;
  className?: string;
  placeholder?: string;
  "aria-label"?: string;
}

function useBoundField(field: TextFieldKey, playable?: boolean) {
  const { character, editing, update } = useSheet();
  return {
    value: character[field],
    readOnly: !editing && !playable,
    onChange: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      update({ [field]: event.target.value } as CharacterPatch),
  };
}

export function SheetInput({ field, playable, className, ...props }: BoundFieldProps) {
  const bound = useBoundField(field, playable);
  return <input type="text" {...props} {...bound} className={cn(fieldClass, "h-10", className)} />;
}

export function SheetTextarea({
  field,
  playable,
  className,
  rows = 2,
  ...props
}: BoundFieldProps & { rows?: number }) {
  const bound = useBoundField(field, playable);
  return (
    <textarea
      {...props}
      {...bound}
      rows={rows}
      className={cn(fieldClass, "field-sizing-content resize-none leading-snug", className)}
    />
  );
}
