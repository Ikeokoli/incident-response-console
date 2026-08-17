import { describe, expect, it } from "vitest";

import { incidentFixtures } from "../data/incidents";
import {
  DEFAULT_FILTERS,
  filterIncidents,
  sortIncidents,
  summarizeIncidents,
} from "./incident";

describe("incident domain behavior", () => {
  it("searches across user-visible incident fields", () => {
    expect(
      filterIncidents(incidentFixtures, { ...DEFAULT_FILTERS, query: "payments" }),
    ).toHaveLength(1);
    expect(
      filterIncidents(incidentFixtures, { ...DEFAULT_FILTERS, query: "unassigned" }),
    ).toHaveLength(2);
  });

  it("combines status and severity filters", () => {
    const filtered = filterIncidents(incidentFixtures, {
      ...DEFAULT_FILTERS,
      severity: "high",
      status: "monitoring",
    });

    expect(filtered.map(({ id }) => id)).toEqual(["INC-1041", "INC-1039"]);
  });

  it("orders incidents by severity without mutating input", () => {
    const originalIds = incidentFixtures.map(({ id }) => id);
    const sorted = sortIncidents(incidentFixtures, "severity-desc");

    expect(sorted[0]?.severity).toBe("critical");
    expect(incidentFixtures.map(({ id }) => id)).toEqual(originalIds);
  });

  it("summarizes the visible result set", () => {
    expect(summarizeIncidents(incidentFixtures)).toEqual({
      total: 10,
      active: 8,
      critical: 1,
      unassigned: 2,
    });
  });
});

