import { useCallback, useMemo, useRef, useState } from "react";

import { AppShell } from "./components/AppShell";
import { AsyncState } from "./components/AsyncState";
import { DashboardSummary } from "./components/DashboardSummary";
import { IncidentDrawer } from "./components/IncidentDrawer";
import { IncidentFilters } from "./components/IncidentFilters";
import { IncidentTable } from "./components/IncidentTable";
import { LiveRegion } from "./components/LiveRegion";
import { SelectionToolbar } from "./components/SelectionToolbar";
import { SkipLink } from "./components/SkipLink";
import {
  DEFAULT_FILTERS,
  summarizeIncidents,
  type Incident,
  type IncidentFilters as Filters,
} from "./domain/incident";
import { useDebouncedValue } from "./hooks/useDebouncedValue";
import { useIncidentQuery } from "./hooks/useIncidentQuery";
import { useKeyboardShortcut } from "./hooks/useKeyboardShortcut";
import { useLocalStorage } from "./hooks/useLocalStorage";
import { usePersistentSelection } from "./hooks/usePersistentSelection";
import { incidentRepository } from "./services/incidentRepository";

export function App() {
  const [filters, setFilters] = useState<Filters>(DEFAULT_FILTERS);
  const [density, setDensity] = useLocalStorage<"comfortable" | "compact">(
    "incident-density",
    "comfortable",
  );
  const [activeIncident, setActiveIncident] = useState<Incident | null>(null);
  const [announcement, setAnnouncement] = useState("");
  const searchInputRef = useRef<HTMLInputElement>(null);
  const drawerTriggerRef = useRef<HTMLButtonElement | null>(null);
  const debouncedQuery = useDebouncedValue(filters.query, 180);
  const requestFilters = useMemo(
    () => ({ ...filters, query: debouncedQuery }),
    [debouncedQuery, filters],
  );
  const query = useIncidentQuery(incidentRepository, requestFilters);
  const selection = usePersistentSelection();
  const summary = useMemo(() => summarizeIncidents(query.data), [query.data]);

  useKeyboardShortcut(
    "/",
    useCallback(() => searchInputRef.current?.focus(), []),
  );

  const closeDrawer = useCallback(() => {
    setActiveIncident(null);
    window.setTimeout(() => drawerTriggerRef.current?.focus(), 0);
  }, []);

  function openDrawer(incident: Incident, trigger: HTMLButtonElement) {
    drawerTriggerRef.current = trigger;
    setActiveIncident(incident);
  }

  async function addNote(body: string) {
    if (!activeIncident) return;
    const updated = await incidentRepository.addNote(activeIncident.id, body);
    setActiveIncident(updated);
    setAnnouncement(`Note saved to ${updated.id}`);
    query.refresh();
  }

  const isLoading = query.status === "loading" || query.status === "idle";

  return (
    <>
      <SkipLink />
      <AppShell>
        <LiveRegion
          message={
            announcement ||
            (query.status === "ready"
              ? `${query.data.length} incidents shown`
              : query.status === "loading"
                ? "Refreshing incidents"
                : "")
          }
        />

        <div className="workspace-header">
          <div>
            <p className="eyebrow">Current shift</p>
            <h2>Operations overview</h2>
            <p>Review active impact, preserve context, and record responder notes.</p>
          </div>
          <label className="density-control">
            <span>Table density</span>
            <select
              value={density}
              onChange={(event) =>
                setDensity(event.currentTarget.value as typeof density)
              }
            >
              <option value="comfortable">Comfortable</option>
              <option value="compact">Compact</option>
            </select>
          </label>
        </div>

        <DashboardSummary summary={summary} />
        <IncidentFilters
          filters={filters}
          inputRef={searchInputRef}
          onChange={setFilters}
        />

        <section className={`incident-panel density-${density}`} aria-labelledby="queue-heading">
          <div className="section-heading-row queue-heading-row">
            <div>
              <p className="eyebrow">Triage queue</p>
              <h2 id="queue-heading">Matching incidents</h2>
            </div>
            {isLoading && query.data.length > 0 ? (
              <span className="refresh-status" role="status">
                <span className="spinner small" aria-hidden="true" />
                Refreshing
              </span>
            ) : null}
          </div>

          <SelectionToolbar count={selection.selectedCount} onClear={selection.clear} />
          <AsyncState
            error={query.error}
            hasResults={query.data.length > 0}
            isLoading={isLoading}
            onRetry={query.refresh}
          />

          {query.data.length > 0 ? (
            <IncidentTable
              incidents={query.data}
              isSelected={selection.isSelected}
              onOpen={openDrawer}
              onSelectVisible={selection.selectVisible}
              onToggle={selection.toggle}
            />
          ) : null}
        </section>
      </AppShell>

      {activeIncident ? (
        <IncidentDrawer
          key={activeIncident.id}
          incident={activeIncident}
          onAddNote={addNote}
          onClose={closeDrawer}
        />
      ) : null}
    </>
  );
}

