import type { IncidentSummary } from "../domain/incident";

export function DashboardSummary({ summary }: { summary: IncidentSummary }) {
  const metrics = [
    { label: "Visible incidents", value: summary.total },
    { label: "Active", value: summary.active },
    { label: "Critical", value: summary.critical },
    { label: "Unassigned", value: summary.unassigned },
  ];

  return (
    <dl className="summary-grid" aria-label="Incident summary">
      {metrics.map((metric) => (
        <div className="summary-card" key={metric.label}>
          <dt>{metric.label}</dt>
          <dd>{metric.value}</dd>
        </div>
      ))}
    </dl>
  );
}

