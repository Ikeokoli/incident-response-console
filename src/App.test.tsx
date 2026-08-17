import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import { App } from "./App";

describe("App", () => {
  it("loads the self-contained incident queue", async () => {
    render(<App />);

    expect(
      await screen.findByRole("button", {
        name: /INC-1042 Checkout API returning elevated 5xx responses/i,
      }),
    ).toBeVisible();
  });

  it("preserves a selected incident while filters hide and restore it", async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(await screen.findByRole("checkbox", { name: "Select INC-1042" }));
    await user.type(screen.getByRole("searchbox", { name: "Search incidents" }), "warehouse");

    expect(
      await screen.findByRole("button", { name: /INC-1035 Warehouse replication lag/i }),
    ).toBeVisible();
    expect(screen.getByText("1 incident selected")).toBeVisible();

    await user.clear(screen.getByRole("searchbox", { name: "Search incidents" }));
    expect(await screen.findByRole("checkbox", { name: "Select INC-1042" })).toBeChecked();
  });
});

