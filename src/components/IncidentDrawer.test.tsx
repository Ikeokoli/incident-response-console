import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { incidentFixtures } from "../data/incidents";
import { IncidentDrawer } from "./IncidentDrawer";

describe("IncidentDrawer", () => {
  it("moves focus to the close control and supports Escape", async () => {
    const onClose = vi.fn();
    const user = userEvent.setup();
    render(
      <IncidentDrawer
        incident={incidentFixtures[0]!}
        onAddNote={async () => undefined}
        onClose={onClose}
      />,
    );

    await waitFor(() =>
      expect(screen.getByRole("button", { name: "Close incident details" })).toHaveFocus(),
    );
    await user.keyboard("{Escape}");
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("prevents an empty note and submits responder text", async () => {
    const onAddNote = vi.fn().mockResolvedValue(undefined);
    const user = userEvent.setup();
    render(
      <IncidentDrawer
        incident={incidentFixtures[0]!}
        onAddNote={onAddNote}
        onClose={() => undefined}
      />,
    );

    const submit = screen.getByRole("button", { name: "Save note" });
    expect(submit).toBeDisabled();

    await user.type(screen.getByLabelText("Add a responder note"), "Traffic shifted.");
    await user.click(submit);
    expect(onAddNote).toHaveBeenCalledWith("Traffic shifted.");
  });
});

