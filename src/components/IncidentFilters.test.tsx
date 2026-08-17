import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createRef } from "react";
import { describe, expect, it, vi } from "vitest";

import { DEFAULT_FILTERS } from "../domain/incident";
import { IncidentFilters } from "./IncidentFilters";

describe("IncidentFilters", () => {
  it("exposes labelled filter controls", () => {
    render(
      <IncidentFilters
        filters={DEFAULT_FILTERS}
        inputRef={createRef<HTMLInputElement>()}
        onChange={() => undefined}
      />,
    );

    expect(screen.getByRole("searchbox", { name: "Search incidents" })).toBeVisible();
    expect(screen.getByRole("combobox", { name: "Status" })).toBeVisible();
    expect(screen.getByRole("combobox", { name: "Severity" })).toBeVisible();
    expect(screen.getByRole("combobox", { name: "Sort" })).toBeVisible();
  });

  it("reports user changes without mutating the current filters", async () => {
    const onChange = vi.fn();
    const user = userEvent.setup();
    render(
      <IncidentFilters
        filters={DEFAULT_FILTERS}
        inputRef={createRef<HTMLInputElement>()}
        onChange={onChange}
      />,
    );

    await user.type(screen.getByRole("searchbox", { name: "Search incidents" }), "api");

    expect(onChange).toHaveBeenLastCalledWith({ ...DEFAULT_FILTERS, query: "i" });
    expect(DEFAULT_FILTERS.query).toBe("");
  });
});

