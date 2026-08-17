interface SelectionToolbarProps {
  count: number;
  onClear: () => void;
}

export function SelectionToolbar({ count, onClear }: SelectionToolbarProps) {
  if (count === 0) return null;

  return (
    <div className="selection-toolbar">
      <strong>
        {count} {count === 1 ? "incident" : "incidents"} selected
      </strong>
      <button className="text-button" type="button" onClick={onClear}>
        Clear selection
      </button>
    </div>
  );
}

