export type IncidentStatus = "investigating" | "monitoring" | "resolved";

export type IncidentSeverity = "critical" | "high" | "medium" | "low";

export type IncidentSort = "updated-desc" | "started-desc" | "severity-desc";

export interface IncidentNote {
  id: string;
  author: string;
  body: string;
  createdAt: string;
}

export interface Incident {
  id: string;
  title: string;
  summary: string;
  status: IncidentStatus;
  severity: IncidentSeverity;
  service: string;
  owner: string;
  startedAt: string;
  updatedAt: string;
  tags: string[];
  notes: IncidentNote[];
}

export interface IncidentFilters {
  query: string;
  status: "all" | IncidentStatus;
  severity: "all" | IncidentSeverity;
  sort: IncidentSort;
}

export interface IncidentSummary {
  total: number;
  active: number;
  critical: number;
  unassigned: number;
}

export const DEFAULT_FILTERS: IncidentFilters = {
  query: "",
  status: "all",
  severity: "all",
  sort: "updated-desc",
};

const severityRank: Record<IncidentSeverity, number> = {
  critical: 4,
  high: 3,
  medium: 2,
  low: 1,
};

export function filterIncidents(
  incidents: Incident[],
  filters: IncidentFilters,
): Incident[] {
  const query = filters.query.trim().toLocaleLowerCase();

  return incidents.filter((incident) => {
    const matchesStatus =
      filters.status === "all" || incident.status === filters.status;
    const matchesSeverity =
      filters.severity === "all" || incident.severity === filters.severity;
    const searchable = [
      incident.title,
      incident.summary,
      incident.service,
      incident.owner,
      ...incident.tags,
    ]
      .join(" ")
      .toLocaleLowerCase();

    return matchesStatus && matchesSeverity && (!query || searchable.includes(query));
  });
}

export function sortIncidents(
  incidents: Incident[],
  sort: IncidentSort,
): Incident[] {
  return [...incidents].sort((left, right) => {
    if (sort === "severity-desc") {
      const severityDifference =
        severityRank[right.severity] - severityRank[left.severity];
      if (severityDifference !== 0) return severityDifference;
    }

    const field = sort === "started-desc" ? "startedAt" : "updatedAt";
    return Date.parse(right[field]) - Date.parse(left[field]);
  });
}

export function summarizeIncidents(incidents: Incident[]): IncidentSummary {
  return incidents.reduce<IncidentSummary>(
    (summary, incident) => ({
      total: summary.total + 1,
      active: summary.active + (incident.status === "resolved" ? 0 : 1),
      critical: summary.critical + (incident.severity === "critical" ? 1 : 0),
      unassigned: summary.unassigned + (incident.owner === "Unassigned" ? 1 : 0),
    }),
    { total: 0, active: 0, critical: 0, unassigned: 0 },
  );
}

export function formatIncidentTime(value: string): string {
  return new Intl.DateTimeFormat("en-GB", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

