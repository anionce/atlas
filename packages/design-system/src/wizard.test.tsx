import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { WizardScreen } from "./wizard";

describe("WizardScreen", () => {
  it("renders title, step label and children", () => {
    render(
      <WizardScreen
        title="Comprar una vivienda"
        stepLabel="Paso 2 de 8"
        progressValue={2}
        progressMax={8}
      >
        <p>¿Cuánto tienes ahorrado?</p>
      </WizardScreen>,
    );
    expect(screen.getByText("Comprar una vivienda")).toBeInTheDocument();
    expect(screen.getByText("Paso 2 de 8")).toBeInTheDocument();
    expect(screen.getByText("¿Cuánto tienes ahorrado?")).toBeInTheDocument();
  });

  it("only shows Atrás when onBack is provided", () => {
    const { rerender } = render(
      <WizardScreen title="t" stepLabel="s" progressValue={1} progressMax={2}>
        content
      </WizardScreen>,
    );
    expect(screen.queryByRole("button", { name: "Atrás" })).not.toBeInTheDocument();

    rerender(
      <WizardScreen title="t" stepLabel="s" progressValue={1} progressMax={2} onBack={() => {}}>
        content
      </WizardScreen>,
    );
    expect(screen.getByRole("button", { name: "Atrás" })).toBeInTheDocument();
  });

  it("disables the next button when nextDisabled is set", () => {
    const onNext = vi.fn();
    render(
      <WizardScreen
        title="t"
        stepLabel="s"
        progressValue={1}
        progressMax={2}
        onNext={onNext}
        nextDisabled
      >
        content
      </WizardScreen>,
    );
    expect(screen.getByRole("button", { name: /Continuar/ })).toBeDisabled();
  });
});
