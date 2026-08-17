import type { IncidentSeverity, IncidentStatus } from "../domain/incident";

export function IncidentStatusBadge({ status }: { status: IncidentStatus }) {
  const label = status.charAt(0).toUpperCase() + status.slice(1);
  return <span className={`badge status-${status}`}>{label}</span>;
}

export function IncidentSeverityBadge({
  severity,
}: {
  severity: IncidentSeverity;
}) {
  const label = severity.charAt(0).toUpperCase() + severity.slice(1);
  return (
    <span className={`badge severity-${severity}`}>
      <span className="severity-symbol" aria-hidden="true" />
      {label}
    </span>
  );
}

