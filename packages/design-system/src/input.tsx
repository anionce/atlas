import { type InputHTMLAttributes, forwardRef, useId } from "react";

import { cn } from "./utils";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  help?: string;
  error?: string;
}

/**
 * Campo grande y con espacio de sobra: nunca debe sentirse como un formulario de Excel.
 * El error se anuncia inmediatamente (aria-live), no solo al enviar.
 */
export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, help, error, id, ...props }, ref) => {
    const generatedId = useId();
    const inputId = id ?? generatedId;
    const helpId = help ? `${inputId}-help` : undefined;
    const errorId = error ? `${inputId}-error` : undefined;

    return (
      <div className="flex flex-col gap-2">
        {label ? (
          <label htmlFor={inputId} className="text-foreground text-base font-medium">
            {label}
          </label>
        ) : null}
        <input
          id={inputId}
          ref={ref}
          aria-invalid={Boolean(error)}
          aria-describedby={[helpId, errorId].filter(Boolean).join(" ") || undefined}
          className={cn(
            "border-input bg-background text-foreground placeholder:text-muted-foreground focus-visible:ring-ring h-14 w-full rounded-xl border px-4 text-lg focus-visible:ring-2 focus-visible:outline-none",
            error && "border-destructive focus-visible:ring-destructive",
            className,
          )}
          {...props}
        />
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
Input.displayName = "Input";
