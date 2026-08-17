import { incidentFixtures } from "../data/incidents";
import {
  filterIncidents,
  sortIncidents,
  type Incident,
  type IncidentFilters,
} from "../domain/incident";

export interface IncidentRepository {
  search(filters: IncidentFilters, signal?: AbortSignal): Promise<Incident[]>;
  getById(id: string, signal?: AbortSignal): Promise<Incident | null>;
  addNote(id: string, body: string, signal?: AbortSignal): Promise<Incident>;
}

function cloneIncident(incident: Incident): Incident {
  return {
    ...incident,
    tags: [...incident.tags],
    notes: incident.notes.map((note) => ({ ...note })),
  };
}

function abortError(): Error {
  const error = new Error("The operation was aborted");
  error.name = "AbortError";
  return error;
}

function wait(duration: number, signal?: AbortSignal): Promise<void> {
  return new Promise((resolve, reject) => {
    if (signal?.aborted) {
      reject(abortError());
      return;
    }

    const timeout = window.setTimeout(resolve, duration);
    signal?.addEventListener(
      "abort",
      () => {
        window.clearTimeout(timeout);
        reject(abortError());
      },
      { once: true },
    );
  });
}

function searchLatency(filters: IncidentFilters): number {
  const queryLength = filters.query.trim().length;
  return queryLength > 0 && queryLength <= 2 ? 420 : 120;
}

export function createIncidentRepository(
  seed: Incident[] = incidentFixtures,
): IncidentRepository {
  let incidents = seed.map(cloneIncident);
  let noteSequence = 1;

  return {
    async search(filters, signal) {
      await wait(searchLatency(filters), signal);
      return sortIncidents(filterIncidents(incidents, filters), filters.sort).map(
        cloneIncident,
      );
    },

    async getById(id, signal) {
      await wait(80, signal);
      const incident = incidents.find((candidate) => candidate.id === id);
      return incident ? cloneIncident(incident) : null;
    },

    async addNote(id, body, signal) {
      await wait(140, signal);
      const incident = incidents.find((candidate) => candidate.id === id);

      if (!incident) {
        throw new Error(`Incident ${id} was not found`);
      }

      const updated: Incident = {
        ...incident,
        updatedAt: new Date().toISOString(),
        notes: [
          ...incident.notes,
          {
            id: `note-${noteSequence++}`,
            author: "Current responder",
            body: body.trim(),
            createdAt: new Date().toISOString(),
          },
        ],
      };

      incidents = incidents.map((candidate) =>
        candidate.id === id ? updated : candidate,
      );

      return cloneIncident(updated);
    },
  };
}

export const incidentRepository = createIncidentRepository();

