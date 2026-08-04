import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Card, CardDescription, CardFooter, CardTitle, CardValue } from "./card";

describe("Card", () => {
  it("renders title, value, description and footer", () => {
    render(
      <Card>
        <CardTitle>Capacidad de compra</CardTitle>
        <CardValue>285.000 €</CardValue>
        <CardDescription>Puedes permitirte aproximadamente este importe.</CardDescription>
        <CardFooter>Ver detalles →</CardFooter>
      </Card>,
    );
    expect(screen.getByText("Capacidad de compra")).toBeInTheDocument();
    expect(screen.getByText("285.000 €")).toBeInTheDocument();
    expect(screen.getByText("Ver detalles →")).toBeInTheDocument();
  });
});
