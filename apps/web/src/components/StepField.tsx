"use client";

import { useState } from "react";
import { Check, X } from "lucide-react";

import { Button, Input, Select } from "@atlas/design-system";
import type { StepDefinition } from "@atlas/journey-engine";

const NUMERIC_TYPES = new Set(["number", "currency", "percentage"]);

/**
 * Convierte lo que se ha tecleado en un número, o `undefined` si todavía
 * no hay nada válido. No usamos `<input type="number">` para estos campos:
 * su validación nativa carácter a carácter borra el campo entero en
 * cuanto se teclea un punto en un estado intermedio (p. ej. "100." antes
 * de seguir escribiendo) — un problema real para quien teclea números
 * grandes con el punto como separador de miles, como es costumbre en
 * español.
 */
function parseNumericValue(stepType: string, raw: string): number | undefined {
  const trimmed = raw.trim();
  if (trimmed === "" || trimmed === "-") return undefined;

  if (stepType === "percentage") {
    // Los porcentajes de esta app son siempre números pequeños (0-100):
    // no necesitan separador de miles, así que el punto o la coma se
    // tratan como separador decimal.
    const parsed = Number(trimmed.replace(",", "."));
    return Number.isNaN(parsed) ? undefined : parsed;
  }

  // "currency" y "number": aquí nunca hacen falta decimales (euros
  // enteros, años enteros) — un punto o una coma solo puede ser un
  // separador de miles tecleado por costumbre, nunca un decimal real.
  const digitsOnly = trimmed.replace(/[.,\s]/g, "");
  if (digitsOnly === "" || digitsOnly === "-") return undefined;
  const parsed = Number(digitsOnly);
  return Number.isNaN(parsed) ? undefined : parsed;
}

/**
 * El texto que se ve mientras se escribe vive en estado local, separado
 * del número ya calculado — así "100." o "6." pueden mostrarse un
 * instante sin que se borren solos en cada tecla. `key={step.id}` en
 * quien la usa reinicia este estado al cambiar de pregunta.
 */
function NumericStepInput({
  step,
  value,
  label,
  help,
  error,
  onChange,
}: {
  step: StepDefinition;
  value: unknown;
  label: string;
  help?: string;
  error: string | null;
  onChange: (value: unknown) => void;
}) {
  const [text, setText] = useState(() => (typeof value === "number" ? String(value) : ""));

  return (
    <Input
      type="text"
      inputMode="decimal"
      label={label}
      help={help}
      error={error ?? undefined}
      value={text}
      onChange={(e) => {
        const raw = e.target.value;
        setText(raw);
        onChange(parseNumericValue(step.type, raw));
      }}
      autoFocus
    />
  );
}

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

  if (step.type === "select") {
    return (
      <Select
        label={label}
        help={help}
        error={error ?? undefined}
        value={typeof value === "string" ? value : ""}
        onChange={(e) => onChange(e.target.value === "" ? undefined : e.target.value)}
        autoFocus
      >
        <option value="" disabled>
          Selecciona una opción
        </option>
        {step.options?.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label[locale] ?? option.label.es}
          </option>
        ))}
      </Select>
    );
  }

  if (NUMERIC_TYPES.has(step.type)) {
    return (
      <NumericStepInput
        key={step.id}
        step={step}
        value={value}
        label={label}
        help={help}
        error={error}
        onChange={onChange}
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
