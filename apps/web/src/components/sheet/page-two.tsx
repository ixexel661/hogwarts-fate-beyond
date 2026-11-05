import { EraserIcon } from "lucide-react";
import { useId } from "react";

import { Button } from "@/components/ui/button";
import {
  CONSEQUENCES,
  STRESS_BASE_BOXES,
  STRESS_TRACKS,
  STRESS_TRACK_LENGTH,
  STUNT_COUNT,
  WAND_FIELDS,
  skillRating,
  stressBoxCount,
} from "@/lib/character/rules";
import type { CharacterPatch } from "@/lib/character/schema";
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

export function PageTwo() {
  return (
    <SheetPage
      page={2}
      subtitle="Zauberstab · Stunts · Stress · Konsequenzen"
      footer={<SchoolYearFooter />}
      left={<Illustration name="crest" className="w-full max-w-24" />}
      right={<Illustration name="owl-flying" className="w-full max-w-32" />}
    >
      <WandSection />
      <Divider />
      <StuntsSection />
      <Divider />
      <StressSection />
      <Divider />
      <ConsequencesSection />
      <NotesSection />
    </SheetPage>
  );
}

function WandSection() {
  const id = useId();
  return (
    <SheetSection title="Zauberstab">
      <div className="grid gap-x-4 gap-y-3 sm:grid-cols-2">
        {WAND_FIELDS.map((wand) => (
          <div key={wand.key}>
            <FieldLabel htmlFor={`${id}-${wand.key}`}>{wand.label}</FieldLabel>
            <SheetInput id={`${id}-${wand.key}`} field={wand.key} />
          </div>
        ))}
        <div className="sm:col-span-2">
          <FieldLabel htmlFor={`${id}-special`}>Besondere Eigenschaften</FieldLabel>
          <SheetTextarea id={`${id}-special`} field="wandSpecial" className="min-h-14" />
        </div>
      </div>
      <Illustration name="wand" className="mx-auto mt-4 w-4/5 max-w-md" />
    </SheetSection>
  );
}

function StuntsSection() {
  const id = useId();
  const { character, editing, update } = useSheet();

  return (
    <SheetSection title="Besondere Fähigkeiten / Stunts">
      <div className="flex flex-col gap-3">
        {Array.from({ length: STUNT_COUNT }, (_, index) => (
          <div
            key={index}
            className="grid items-center gap-x-4 gap-y-1 sm:grid-cols-[5.5rem_minmax(0,1fr)]"
          >
            <FieldLabel htmlFor={`${id}-${index}`} className="mb-0">
              Stunt {index + 1}
            </FieldLabel>
            <textarea
              id={`${id}-${index}`}
              rows={2}
              value={character.stunts[index] ?? ""}
              readOnly={!editing}
              onChange={(event) =>
                update((current) => ({
                  stunts: current.stunts.map((stunt, i) =>
                    i === index ? event.target.value : stunt,
                  ),
                }))
              }
              className={cn(fieldClass, "min-h-16 field-sizing-content resize-none leading-snug")}
            />
          </div>
        ))}
      </div>
    </SheetSection>
  );
}

function StressSection() {
  const { character, update } = useSheet();
  const hasStress = character.physicalStress.some(Boolean) || character.mentalStress.some(Boolean);
  const empty = Array.from({ length: STRESS_TRACK_LENGTH }, () => false);

  return (
    <SheetSection
      title="Stress"
      action={
        <Button
          variant="ghost"
          size="sm"
          disabled={!hasStress}
          onClick={() => update({ physicalStress: empty, mentalStress: empty })}
          className="text-sm text-house-ink"
        >
          <EraserIcon />
          Stress leeren
        </Button>
      }
    >
      <div className="grid gap-6 sm:grid-cols-2 sm:gap-0 sm:divide-x sm:divide-house-ink/30">
        {STRESS_TRACKS.map((track) => (
          <StressTrack key={track.key} track={track} />
        ))}
      </div>
    </SheetSection>
  );
}

function StressTrack({ track }: { track: (typeof STRESS_TRACKS)[number] }) {
  const { character, update } = useSheet();
  const rating = skillRating(character.skills, track.skill);
  const count = stressBoxCount(character.skills, track.skill);
  const boxes = character[track.key];
  const groupLabel = `${track.label}er Stress`;

  const toggle = (box: number) =>
    update(
      (current) =>
        ({
          [track.key]: current[track.key].map((checked, i) => (i === box ? !checked : checked)),
        }) as CharacterPatch,
    );

  return (
    <div className="sm:px-4 sm:first:pl-0 sm:last:pr-0">
      <h3 className="text-sm font-bold tracking-wider uppercase sm:text-[0.9rem]">{track.label}</h3>
      <p className="text-sm leading-snug text-ink/80">{track.hint}</p>

      <div role="group" aria-label={groupLabel} className="mt-3 grid grid-cols-7 gap-1.5 sm:gap-2">
        {boxes.map((checked, box) => {
          const active = box < count;
          const marked = active && checked;
          return (
            <button
              key={box}
              type="button"
              role="checkbox"
              aria-checked={marked}
              aria-label={active ? `Kästchen ${box + 1}` : `Kästchen ${box + 1} (nicht verfügbar)`}
              disabled={!active}
              onClick={() => toggle(box)}
              className={cn(
                "relative aspect-square rounded-[3px] border-2 transition-colors outline-none focus-visible:ring-2 focus-visible:ring-house-accent/60",
                active
                  ? "cursor-pointer border-ink/55 bg-parchment-field/75 shadow-[inset_0_1px_3px_rgb(90_60_20/0.15)] hover:border-house-ink"
                  : "cursor-not-allowed border-dashed border-ink/25",
                marked && "border-house-ink bg-house-ink/10",
              )}
            >
              {marked ? <InkCross /> : null}
            </button>
          );
        })}
      </div>

      {/* Klammer unter den zusätzlichen Kästchen wie auf dem Bogen */}
      <div aria-hidden className="grid grid-cols-7 gap-1.5 sm:gap-2">
        <div
          className="flex flex-col items-center text-ink/75"
          style={{
            gridColumn: `${STRESS_BASE_BOXES + 1} / span ${STRESS_TRACK_LENGTH - STRESS_BASE_BOXES}`,
          }}
        >
          <svg
            viewBox="0 0 100 12"
            preserveAspectRatio="none"
            className="mt-1 h-2.5 w-full fill-none stroke-current"
          >
            <path
              d="M1 1 Q1 6 8 6 H44 Q50 6 50 11 Q50 6 56 6 H92 Q99 6 99 1"
              vectorEffect="non-scaling-stroke"
              strokeWidth="1.2"
            />
          </svg>
          <span className="text-xs whitespace-nowrap">+ bis zu 3 Kästchen</span>
        </div>
      </div>

      <p className="mt-1 text-xs text-ink/70 italic">
        {track.skill} {rating > 0 ? `+${rating}` : "nicht in der Pyramide"} → {count} Kästchen
      </p>
    </div>
  );
}

/** Handgezeichnetes Kreuz für abgehakte Stresskästchen. */
function InkCross() {
  return (
    <svg
      aria-hidden
      viewBox="0 0 24 24"
      className="absolute inset-[12%] fill-none stroke-house-ink"
      strokeWidth="2.6"
      strokeLinecap="round"
    >
      <path d="M4 4.5 C 9 9, 14 14.5, 20 19.5" />
      <path d="M19.5 4 C 14.5 8.5, 9 14, 4.5 20" />
    </svg>
  );
}

function ConsequencesSection() {
  const id = useId();
  return (
    <SheetSection title="Konsequenzen">
      <div className="flex flex-col gap-3">
        {CONSEQUENCES.map((consequence) => (
          <div
            key={consequence.key}
            className="grid grid-cols-[6.5rem_minmax(0,1fr)] items-center gap-3"
          >
            <FieldLabel htmlFor={`${id}-${consequence.key}`} className="mb-0">
              {consequence.label} ({consequence.value})
            </FieldLabel>
            <SheetInput id={`${id}-${consequence.key}`} field={consequence.key} playable />
          </div>
        ))}
      </div>
      <p className="mt-4 text-center text-sm italic text-ink/80">
        Fate-Punkte werden mit physischen Tokens verwaltet.
      </p>
    </SheetSection>
  );
}

function NotesSection() {
  const id = useId();
  return (
    <SheetSection title="Notizen">
      <SheetTextarea
        id={`${id}-notes`}
        aria-label="Notizen"
        field="notes"
        playable
        rows={5}
        placeholder="Inventar, Kontakte, Hinweise …"
        className="min-h-32"
      />
    </SheetSection>
  );
}
