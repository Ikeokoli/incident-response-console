import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { DashboardSummary } from "./DashboardSummary";

describe("DashboardSummary", () => {
  it("pairs each operational metric with its value", () => {
    render(
      <DashboardSummary summary={{ total: 8, active: 6, critical: 1, unassigned: 2 }} />,
    );

    expect(screen.getByText("Visible incidents").nextElementSibling).toHaveTextContent("8");
    expect(screen.getByText("Critical").nextElementSibling).toHaveTextContent("1");
  });
});

