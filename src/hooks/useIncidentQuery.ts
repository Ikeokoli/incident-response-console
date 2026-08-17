import { useCallback, useEffect, useState } from "react";

import type { Incident, IncidentFilters } from "../domain/incident";
import type { IncidentRepository } from "../services/incidentRepository";

interface IncidentQueryState {
  data: Incident[];
  error: string | null;
  status: "idle" | "loading" | "ready" | "error";
}

export function useIncidentQuery(
  repository: IncidentRepository,
  filters: IncidentFilters,
) {
  const [refreshKey, setRefreshKey] = useState(0);
  const [state, setState] = useState<IncidentQueryState>({
    data: [],
    error: null,
    status: "idle",
  });

  const refresh = useCallback(() => {
    setRefreshKey((current) => current + 1);
  }, []);

  useEffect(() => {
    setState((current) => ({ ...current, error: null, status: "loading" }));

    repository.search(filters).then(
      (data) => setState({ data, error: null, status: "ready" }),
      (error: unknown) =>
        setState((current) => ({
          ...current,
          error: error instanceof Error ? error.message : "Unable to load incidents",
          status: "error",
        })),
    );
  }, [filters, refreshKey, repository]);

  return { ...state, refresh };
}

