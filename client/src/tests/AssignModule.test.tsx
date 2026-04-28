/* eslint-disable @typescript-eslint/no-explicit-any */
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, test, expect, vi } from "vitest";
import AssignModule from "../fullscreen_popups/AssignModule";

// mock API
vi.mock("@/api/modules", () => ({
  fetchAvailableStaff: vi.fn(() =>
    Promise.resolve([
      {
        user_id: 1,
        name: "Alice",
        email: "alice@test.com",
      },
      {
        user_id: 2,
        name: "Bob",
        email: "bob@test.com",
      },
    ]),
  ),
}));

describe("AssignModule", () => {
  test("renders fetched staff", async () => {
    render(
      <AssignModule offering_id={1} moduleAssignments={[]} onAdd={vi.fn()} />,
    );

    expect(await screen.findByText("Alice")).toBeInTheDocument();
    expect(screen.getByText("Bob")).toBeInTheDocument();
  });

  test("filters out already assigned staff", async () => {
    render(
      <AssignModule
        offering_id={1}
        moduleAssignments={[{ user_id: 1 } as any]}
        onAdd={vi.fn()}
      />,
    );

    await waitFor(() => {
      expect(screen.queryByText("Alice")).not.toBeInTheDocument();
    });

    expect(screen.getByText("Bob")).toBeInTheDocument();
  });

  test("toggles row selection on click", async () => {
    render(
      <AssignModule offering_id={1} moduleAssignments={[]} onAdd={vi.fn()} />,
    );

    const row = await screen.findByText("Alice");

    // click row
    fireEvent.click(row);

    // row should now have selected style
    expect(row.closest("tr")?.className).toContain("bg-green-200");
  });

  test("calls onAdd with selected staff", async () => {
    const onAddMock = vi.fn();

    render(
      <AssignModule offering_id={1} moduleAssignments={[]} onAdd={onAddMock} />,
    );

    const row = await screen.findByText("Alice");

    // select Alice
    fireEvent.click(row);

    // click Add
    fireEvent.click(screen.getByText("Add"));

    expect(onAddMock).toHaveBeenCalled();

    const passedData = onAddMock.mock.calls[0][0];

    expect(passedData).toHaveLength(1);
    expect(passedData[0].name).toBe("Alice");
  });

  test("calls onAdd with empty array if nothing selected", async () => {
    const onAddMock = vi.fn();

    render(
      <AssignModule offering_id={1} moduleAssignments={[]} onAdd={onAddMock} />,
    );

    await screen.findByText("Alice");

    fireEvent.click(screen.getByText("Add"));

    expect(onAddMock).toHaveBeenCalledWith([]);
  });
});
