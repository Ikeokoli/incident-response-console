import { useCallback, useMemo, useState } from "react";

export function usePersistentSelection() {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(() => new Set());

  const toggle = useCallback((id: string) => {
    setSelectedIds((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const selectVisible = useCallback((ids: string[]) => {
    setSelectedIds((current) => new Set([...current, ...ids]));
  }, []);

  const clear = useCallback(() => setSelectedIds(new Set()), []);

  return useMemo(
    () => ({
      clear,
      isSelected: (id: string) => selectedIds.has(id),
      selectedCount: selectedIds.size,
      selectedIds,
      selectVisible,
      toggle,
    }),
    [clear, selectVisible, selectedIds, toggle],
  );
}

