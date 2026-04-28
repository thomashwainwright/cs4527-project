/* eslint-disable @typescript-eslint/no-explicit-any */
import { render, screen } from "@testing-library/react";
import { describe, test, expect, vi } from "vitest";
import PageTitle from "../ui_components/PageTitle";

// mock AcademicYearSelector
vi.mock("../ui_components/AcademicYearSelector", () => ({
  default: () => <div data-testid="year-selector" />,
}));

describe("PageTitle", () => {
  test("renders title text", () => {
    render(<PageTitle>Dashboard</PageTitle>);

    expect(screen.getByText("Dashboard")).toBeInTheDocument();
  });

  test("renders AcademicYearSelector", () => {
    render(<PageTitle>Title</PageTitle>);

    expect(screen.getByTestId("year-selector")).toBeInTheDocument();
  });

  test("renders children inside heading", () => {
    render(<PageTitle>Modules</PageTitle>);

    const heading = screen.getByRole("heading");

    expect(heading).toHaveTextContent("Modules");
  });
});
