import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { incidentFixtures } from "../data/incidents";
import { IncidentTable } from "./IncidentTable";

describe("IncidentTable", () => {
  it("uses stable incident identifiers for selection", async () => {
    const onToggle = vi.fn();
    const user = userEvent.setup();
    render(
      <IncidentTable
        incidents={incidentFixtures.slice(0, 2)}
        isSelected={(id) => id === "INC-1041"}
        onOpen={() => undefined}
        onSelectVisible={() => undefined}
        onToggle={onToggle}
      />,
    );

    expect(screen.getByRole("checkbox", { name: "Select INC-1041" })).toBeChecked();
    await user.click(screen.getByRole("checkbox", { name: "Select INC-1042" }));
    expect(onToggle).toHaveBeenCalledWith("INC-1042");
  });

  it("passes the invoking button when incident details open", async () => {
    const onOpen = vi.fn();
    const user = userEvent.setup();
    render(
      <IncidentTable
        incidents={incidentFixtures.slice(0, 1)}
        isSelected={() => false}
        onOpen={onOpen}
        onSelectVisible={() => undefined}
        onToggle={() => undefined}
      />,
    );

    const button = screen.getByRole("button", {
      name: /INC-1042 Checkout API returning elevated 5xx responses/i,
    });
    await user.click(button);

    expect(onOpen).toHaveBeenCalledWith(incidentFixtures[0], button);
  });
});

