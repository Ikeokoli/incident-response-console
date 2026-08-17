import type { MouseEvent } from "react";

import { formatIncidentTime, type Incident } from "../domain/incident";
import { IncidentSeverityBadge, IncidentStatusBadge } from "./IncidentBadges";

interface IncidentTableProps {
  incidents: Incident[];
  isSelected: (id: string) => boolean;
  onOpen: (incident: Incident, trigger: HTMLButtonElement) => void;
  onSelectVisible: (ids: string[]) => void;
  onToggle: (id: string) => void;
}

export function IncidentTable({
  incidents,
  isSelected,
  onOpen,
  onSelectVisible,
  onToggle,
}: IncidentTableProps) {
  const allVisibleSelected =
    incidents.length > 0 && incidents.every((incident) => isSelected(incident.id));

  function handleOpen(event: MouseEvent<HTMLButtonElement>, incident: Incident) {
    onOpen(incident, event.currentTarget);
  }

  return (
    <div className="table-scroll">
      <table>
        <caption className="sr-only">
          Incidents matching the current filters
        </caption>
        <thead>
          <tr>
            <th className="checkbox-column" scope="col">
              <input
                type="checkbox"
                aria-label="Select every visible incident"
                checked={allVisibleSelected}
                onChange={() => onSelectVisible(incidents.map(({ id }) => id))}
              />
            </th>
            <th scope="col">Incident</th>
            <th scope="col">Severity</th>
            <th scope="col">Status</th>
            <th scope="col">Owner</th>
            <th scope="col">Updated</th>
          </tr>
        </thead>
        <tbody>
          {incidents.map((incident) => (
            <tr key={incident.id}>
              <td className="checkbox-column">
                <input
                  type="checkbox"
                  aria-label={`Select ${incident.id}`}
                  checked={isSelected(incident.id)}
                  onChange={() => onToggle(incident.id)}
                />
              </td>
              <th scope="row">
                <button
                  className="incident-link"
                  type="button"
                  onClick={(event) => handleOpen(event, incident)}
                >
                  <span className="incident-id">{incident.id}</span>
                  <span>{incident.title}</span>
                  <small>{incident.service}</small>
                </button>
              </th>
              <td>
                <IncidentSeverityBadge severity={incident.severity} />
              </td>
              <td>
                <IncidentStatusBadge status={incident.status} />
              </td>
              <td>{incident.owner}</td>
              <td>
                <time dateTime={incident.updatedAt}>
                  {formatIncidentTime(incident.updatedAt)}
                </time>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

