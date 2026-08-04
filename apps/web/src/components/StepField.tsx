"use client";

import { Check, X } from "lucide-react";

import { Button, Input } from "@atlas/design-system";
import type { StepDefinition } from "@atlas/journey-engine";

const NUMERIC_TYPES = new Set(["number", "currency", "percentage"]);

export interface StepFieldProps {
  step: StepDefinition;
  value: unknown;
  error: string | null;
  onChange: (value: unknown) => void;
  locale?: string;
}

export function StepField({ step, value, error, onChange, locale = "es" }: StepFieldProps) {
  const label = step.label[locale] ?? step.label.es;
  const help = step.help?.[locale] ?? step.help?.es;

  if (step.type === "boolean") {
    return (
      <div className="flex flex-col gap-3">
        <span className="text-foreground text-base font-medium">{label}</span>
        <div className="flex gap-3">
          <Button
            type="button"
            variant={value === true ? "primary" : "secondary"}
            onClick={() => onChange(true)}
          >
            <Check className="size-4" strokeWidth={2.5} />
            Sí
          </Button>
          <Button
            type="button"
            variant={value === false ? "primary" : "secondary"}
            onClick={() => onChange(false)}
          >
            <X className="size-4" strokeWidth={2.5} />
            No
          </Button>
        </div>
        {help ? <p className="text-muted-foreground text-sm">{help}</p> : null}
        {error ? (
          <p role="alert" className="text-destructive text-sm font-medium">
            {error}
          </p>
        ) : null}
      </div>
    );
  }

  if (NUMERIC_TYPES.has(step.type)) {
    return (
      <Input
        type="number"
        inputMode="decimal"
        label={label}
        help={help}
        error={error ?? undefined}
        value={typeof value === "number" ? value : ""}
        onChange={(e) => {
          const raw = e.target.value;
          onChange(raw === "" ? undefined : Number(raw));
        }}
        autoFocus
      />
    );
  }

  return (
    <Input
      type="text"
      label={label}
      help={help}
      error={error ?? undefined}
      value={typeof value === "string" ? value : ""}
      onChange={(e) => onChange(e.target.value)}
      autoFocus
    />
  );
}
