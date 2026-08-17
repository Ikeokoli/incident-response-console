import { act, renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { usePersistentSelection } from "./usePersistentSelection";

describe("usePersistentSelection", () => {
  it("retains selections that are not currently visible", () => {
    const { result } = renderHook(() => usePersistentSelection());

    act(() => result.current.toggle("INC-1042"));
    act(() => result.current.selectVisible(["INC-1038"]));

    expect(result.current.selectedIds).toEqual(new Set(["INC-1042", "INC-1038"]));
    expect(result.current.selectedCount).toBe(2);
  });

  it("clears the complete selection", () => {
    const { result } = renderHook(() => usePersistentSelection());

    act(() => result.current.selectVisible(["INC-1042", "INC-1041"]));
    act(() => result.current.clear());

    expect(result.current.selectedCount).toBe(0);
  });
});

