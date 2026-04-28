/* eslint-disable @typescript-eslint/no-explicit-any */
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, test, expect, vi } from "vitest";
import LoadFormulaPopup from "../fullscreen_popups/LoadFormulaPopup";

// mock API
vi.mock("@/api/modules", () => ({
  fetchOtherYearsFormula: vi.fn(() =>
    Promise.resolve([
      {
        year_id: 1,
        label: "2023/24",
        custom_formula: "credits * 2",
      },
      {
        year_id: 2,
        label: "2022/23",
        custom_formula: null,
      },
    ]),
  ),
}));

describe("LoadFormulaPopup", () => {
  test("renders title with module code", () => {
    render(
      <LoadFormulaPopup
        offering_id={1}
        user_id={1}
        code="COMP101"
        loadFormula={vi.fn()}
      />,
    );

    expect(
      screen.getByText("Load formula from other year for COMP101"),
    ).toBeInTheDocument();
  });

  test("renders fetched academic years", async () => {
    render(
      <LoadFormulaPopup
        offering_id={1}
        user_id={1}
        code="COMP101"
        loadFormula={vi.fn()}
      />,
    );

    expect(await screen.findByText("2023/24")).toBeInTheDocument();
    expect(screen.getByText("2022/23")).toBeInTheDocument();
  });

  test("displays formula values (or None)", async () => {
    render(
      <LoadFormulaPopup
        offering_id={1}
        user_id={1}
        code="COMP101"
        loadFormula={vi.fn()}
      />,
    );

    await screen.findByText("2023/24");

    expect(screen.getByText("credits * 2")).toBeInTheDocument();
    expect(screen.getByText("None")).toBeInTheDocument();
  });

  test("calls loadFormula when a row is clicked", async () => {
    const loadFormulaMock = vi.fn();

    render(
      <LoadFormulaPopup
        offering_id={1}
        user_id={1}
        code="COMP101"
        loadFormula={loadFormulaMock}
      />,
    );

    const row = await screen.findByText("2023/24");

    fireEvent.click(row);

    expect(loadFormulaMock).toHaveBeenCalledTimes(1);

    const passedArg = loadFormulaMock.mock.calls[0][0];
    expect(passedArg.label).toBe("2023/24");
  });

  test("shows 'No data' when API returns empty array", async () => {
    const { fetchOtherYearsFormula } = await import("@/api/modules");

    (fetchOtherYearsFormula as any).mockResolvedValueOnce([]);

    render(
      <LoadFormulaPopup
        offering_id={1}
        user_id={1}
        code="COMP101"
        loadFormula={vi.fn()}
      />,
    );

    await waitFor(() => {
      expect(screen.getByText("No data")).toBeInTheDocument();
    });
  });
});
