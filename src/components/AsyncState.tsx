interface AsyncStateProps {
  error: string | null;
  hasResults: boolean;
  isLoading: boolean;
  onRetry: () => void;
}

export function AsyncState({
  error,
  hasResults,
  isLoading,
  onRetry,
}: AsyncStateProps) {
  if (error) {
    return (
      <div className="state-banner error-banner" role="alert">
        <div>
          <strong>Incidents could not be refreshed.</strong>
          <p>{error}</p>
        </div>
        <button type="button" onClick={onRetry}>
          Try again
        </button>
      </div>
    );
  }

  if (isLoading && !hasResults) {
    return (
      <div className="state-card" role="status">
        <span className="spinner" aria-hidden="true" />
        Loading incidents...
      </div>
    );
  }

  if (!isLoading && !hasResults) {
    return (
      <div className="state-card">
        <strong>No incidents match these filters.</strong>
        <p>Adjust or reset the filters to return to the active queue.</p>
      </div>
    );
  }

  return null;
}

