import { type SelectHTMLAttributes, forwardRef, useId } from "react";

import { cn } from "./utils";

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  help?: string;
  error?: string;
}

/**
 * Mismo lenguaje visual que Input (altura, radio, foco), pero con una
 * flecha propia porque el <select> nativo pierde su apariencia con appearance-none.
 */
export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, help, error, id, children, ...props }, ref) => {
    const generatedId = useId();
    const selectId = id ?? generatedId;
    const helpId = help ? `${selectId}-help` : undefined;
    const errorId = error ? `${selectId}-error` : undefined;

    return (
      <div className="flex flex-col gap-2">
        {label ? (
          <label htmlFor={selectId} className="text-foreground text-base font-medium">
            {label}
          </label>
        ) : null}
        <div className="relative">
          <select
            id={selectId}
            ref={ref}
            aria-invalid={Boolean(error)}
            aria-describedby={[helpId, errorId].filter(Boolean).join(" ") || undefined}
            className={cn(
              "border-input bg-background text-foreground focus-visible:ring-ring h-14 w-full appearance-none rounded-xl border px-4 pr-12 text-lg focus-visible:ring-2 focus-visible:outline-none",
              error && "border-destructive focus-visible:ring-destructive",
              className,
            )}
            {...props}
          >
            {children}
          </select>
          <svg
            className="text-muted-foreground pointer-events-none absolute top-1/2 right-4 size-5 -translate-y-1/2"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="m6 9 6 6 6-6" />
          </svg>
        </div>
        {help ? (
          <p id={helpId} className="text-muted-foreground text-sm">
            {help}
          </p>
        ) : null}
        {error ? (
          <p id={errorId} role="alert" className="text-destructive text-sm font-medium">
            {error}
          </p>
        ) : null}
      </div>
    );
  },
);
Select.displayName = "Select";
