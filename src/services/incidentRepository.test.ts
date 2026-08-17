import { describe, expect, it } from "vitest";

import { DEFAULT_FILTERS } from "../domain/incident";
import { createIncidentRepository } from "./incidentRepository";

describe("incident repository", () => {
  it("returns cloned, filtered data", async () => {
    const repository = createIncidentRepository();
    const result = await repository.search({ ...DEFAULT_FILTERS, query: "checkout" });

    expect(result.map(({ id }) => id)).toEqual(["INC-1042"]);
    result[0]!.tags.push("mutated");

    const nextResult = await repository.search({
      ...DEFAULT_FILTERS,
      query: "checkout",
    });
    expect(nextResult[0]?.tags).not.toContain("mutated");
  });

  it("supports aborting pending work", async () => {
    const repository = createIncidentRepository();
    const controller = new AbortController();
    const pending = repository.search(DEFAULT_FILTERS, controller.signal);

    controller.abort();
    await expect(pending).rejects.toMatchObject({ name: "AbortError" });
  });

  it("adds responder notes to the selected incident", async () => {
    const repository = createIncidentRepository();
    const updated = await repository.addNote("INC-1042", "Escalated to payments.");

    expect(updated.notes[0]?.body).toBe("Escalated to payments.");
    expect((await repository.getById("INC-1042"))?.notes).toHaveLength(1);
  });
});

