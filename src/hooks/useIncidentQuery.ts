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
    const controller = new AbortController();
    let ownsResult = true;

    setState((current) => ({ ...current, error: null, status: "loading" }));

    repository.search(filters, controller.signal).then(
      (data) => {
        if (!ownsResult) return;
        setState({ data, error: null, status: "ready" });
      },
      (error: unknown) => {
        if (!ownsResult || controller.signal.aborted) return;
        setState((current) => ({
          ...current,
          error: error instanceof Error ? error.message : "Unable to load incidents",
          status: "error",
        }));
      },
    );

    return () => {
      ownsResult = false;
      controller.abort();
    };
  }, [filters, refreshKey, repository]);

  return { ...state, refresh };
}
