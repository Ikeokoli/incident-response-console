import { useEffect } from "react";

export function useKeyboardShortcut(key: string, action: () => void) {
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      const target = event.target;
      const isEditing =
        target instanceof HTMLInputElement ||
        target instanceof HTMLTextAreaElement ||
        target instanceof HTMLSelectElement;

      if (!isEditing && event.key === key && !event.metaKey && !event.ctrlKey) {
        event.preventDefault();
        action();
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [action, key]);
}

