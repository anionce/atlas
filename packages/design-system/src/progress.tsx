import { cn } from "./utils";

export interface ProgressProps {
  value: number;
  max?: number;
  label?: string;
  className?: string;
}

/**
 * Barra de progreso del wizard. La incertidumbre genera abandono, así que
 * siempre se muestra: "Paso X de Y".
 */
export function Progress({ value, max = 100, label, className }: ProgressProps) {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      {label ? <span className="text-muted-foreground text-sm">{label}</span> : null}
      <div
        role="progressbar"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={max}
        className="bg-muted h-2 w-full overflow-hidden rounded-full"
      >
        <div
          className="bg-primary h-full rounded-full transition-[width] duration-200"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
