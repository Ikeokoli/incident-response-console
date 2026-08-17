import type { RefObject } from "react";

import {
  DEFAULT_FILTERS,
  type IncidentFilters as Filters,
} from "../domain/incident";

interface IncidentFiltersProps {
  filters: Filters;
  inputRef: RefObject<HTMLInputElement | null>;
  onChange: (filters: Filters) => void;
}

export function IncidentFilters({
  filters,
  inputRef,
  onChange,
}: IncidentFiltersProps) {
  return (
    <section className="filter-panel" aria-labelledby="filter-heading">
      <div className="section-heading-row">
        <div>
          <p className="eyebrow">Live queue</p>
          <h2 id="filter-heading">Find incidents</h2>
        </div>
        <button
          className="text-button"
          type="button"
          onClick={() => onChange(DEFAULT_FILTERS)}
          disabled={JSON.stringify(filters) === JSON.stringify(DEFAULT_FILTERS)}
        >
          Reset filters
        </button>
      </div>

      <div className="filter-grid">
        <div className="search-field">
          <label htmlFor="incident-search">Search incidents</label>
          <input
            id="incident-search"
            ref={inputRef}
            type="search"
            aria-describedby="incident-search-hint"
            value={filters.query}
            placeholder="Title, service, owner or tag"
            onChange={(event) =>
              onChange({ ...filters, query: event.currentTarget.value })
            }
          />
          <small id="incident-search-hint">Press / anywhere to focus search</small>
        </div>

        <label>
          <span>Status</span>
          <select
            value={filters.status}
            onChange={(event) =>
              onChange({
                ...filters,
                status: event.currentTarget.value as Filters["status"],
              })
            }
          >
            <option value="all">All statuses</option>
            <option value="investigating">Investigating</option>
            <option value="monitoring">Monitoring</option>
            <option value="resolved">Resolved</option>
          </select>
        </label>

        <label>
          <span>Severity</span>
          <select
            value={filters.severity}
            onChange={(event) =>
              onChange({
                ...filters,
                severity: event.currentTarget.value as Filters["severity"],
              })
            }
          >
            <option value="all">All severities</option>
            <option value="critical">Critical</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </label>

        <label>
          <span>Sort</span>
          <select
            value={filters.sort}
            onChange={(event) =>
              onChange({
                ...filters,
                sort: event.currentTarget.value as Filters["sort"],
              })
            }
          >
            <option value="updated-desc">Recently updated</option>
            <option value="started-desc">Recently started</option>
            <option value="severity-desc">Highest severity</option>
          </select>
        </label>
      </div>
    </section>
  );
}
