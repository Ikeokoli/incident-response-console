import { useEffect, useRef, useState } from "react";

import { formatIncidentTime, type Incident } from "../domain/incident";
import { IncidentSeverityBadge, IncidentStatusBadge } from "./IncidentBadges";

interface IncidentDrawerProps {
  incident: Incident;
  onAddNote: (body: string) => Promise<void>;
  onClose: () => void;
}

export function IncidentDrawer({
  incident,
  onAddNote,
  onClose,
}: IncidentDrawerProps) {
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const [note, setNote] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    closeButtonRef.current?.focus();

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!note.trim() || isSaving) return;

    setError(null);
    setIsSaving(true);

    try {
      await onAddNote(note);
      setNote("");
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "Unable to save note");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="drawer-backdrop" onMouseDown={onClose}>
      <aside
        className="incident-drawer"
        role="dialog"
        aria-modal="true"
        aria-labelledby="incident-drawer-title"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="drawer-header">
          <div>
            <span className="incident-id">{incident.id}</span>
            <h2 id="incident-drawer-title">{incident.title}</h2>
          </div>
          <button
            ref={closeButtonRef}
            className="icon-button"
            type="button"
            aria-label="Close incident details"
            onClick={onClose}
          >
            ×
          </button>
        </div>

        <div className="drawer-badges">
          <IncidentSeverityBadge severity={incident.severity} />
          <IncidentStatusBadge status={incident.status} />
        </div>

        <p className="drawer-summary">{incident.summary}</p>

        <dl className="detail-list">
          <div>
            <dt>Service</dt>
            <dd>{incident.service}</dd>
          </div>
          <div>
            <dt>Owner</dt>
            <dd>{incident.owner}</dd>
          </div>
          <div>
            <dt>Started</dt>
            <dd>{formatIncidentTime(incident.startedAt)}</dd>
          </div>
          <div>
            <dt>Updated</dt>
            <dd>{formatIncidentTime(incident.updatedAt)}</dd>
          </div>
        </dl>

        <section aria-labelledby="notes-heading">
          <h3 id="notes-heading">Responder notes</h3>
          {incident.notes.length === 0 ? (
            <p className="muted">No notes have been added.</p>
          ) : (
            <ol className="notes-list">
              {incident.notes.map((incidentNote) => (
                <li key={incidentNote.id}>
                  <p>{incidentNote.body}</p>
                  <small>
                    {incidentNote.author} · {formatIncidentTime(incidentNote.createdAt)}
                  </small>
                </li>
              ))}
            </ol>
          )}
        </section>

        <form className="note-form" onSubmit={handleSubmit}>
          <label htmlFor="incident-note">Add a responder note</label>
          <textarea
            id="incident-note"
            value={note}
            rows={4}
            onChange={(event) => setNote(event.currentTarget.value)}
          />
          {error ? <p className="field-error" role="alert">{error}</p> : null}
          <button type="submit" disabled={!note.trim() || isSaving}>
            {isSaving ? "Saving note..." : "Save note"}
          </button>
        </form>
      </aside>
    </div>
  );
}

