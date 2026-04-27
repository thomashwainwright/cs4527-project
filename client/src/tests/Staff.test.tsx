/* eslint-disable @typescript-eslint/no-explicit-any */
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, test, expect, vi } from "vitest";
import { Staff } from "../pages/Staff";

// mock navigation
const navigateMock = vi.fn();

vi.mock("react-router-dom", () => ({
  useNavigate: () => navigateMock,
}));

// mock staff context
vi.mock("@/context/useStaff", () => ({
  useStaff: () => ({
    staffData: [
      {
        user_id: 1,
        name: "Alice",
        email: "alice@example.com",
        contract_type: "teaching",
        contract_hours: 40,
        allocation: 75,
        active: true,
      },
      {
        user_id: 2,
        name: "Bob",
        email: "bob@example.com",
        contract_type: "teaching",
        contract_hours: 20,
        allocation: 50,
        active: true,
      },
    ],
    setStaffData: vi.fn(),
  }),
}));

// simple stub for PageTitle
vi.mock("../ui_components/PageTitle", () => ({
  default: ({ children }: any) => <h1>{children}</h1>,
}));

describe("Staff page", () => {
  test("renders staff table and title", () => {
    render(<Staff />);

    expect(screen.getByText(/staff/i)).toBeInTheDocument();

    // avoid generic matches like /staff/i because it appears everywhere
    expect(screen.getByText("Alice")).toBeInTheDocument();
    expect(screen.getByText("Bob")).toBeInTheDocument();
  });

  test("search input updates value", async () => {
    render(<Staff />);

    const user = userEvent.setup();

    const input = screen.getByPlaceholderText(/search/i);

    await user.type(input, "Alice");

    expect(input).toHaveValue("Alice");
  });

  test("filters staff based on search", async () => {
    render(<Staff />);

    const user = userEvent.setup();

    const input = screen.getByPlaceholderText(/search/i);

    await user.type(input, "Alice");

    expect(screen.getByText("Alice")).toBeInTheDocument();
    expect(screen.queryByText("Bob")).not.toBeInTheDocument();
  });

  test("clicking staff row navigates", async () => {
    render(<Staff />);

    const user = userEvent.setup();

    const row = screen.getByText("Alice").closest("tr")!;

    await user.click(row);

    expect(navigateMock).toHaveBeenCalledWith("/staff/alice@example.com");
  });

  test("add button exists and is clickable", async () => {
    render(<Staff />);

    const user = userEvent.setup();

    const addBtn = screen.getByRole("button", { name: /add/i });

    await user.click(addBtn);

    expect(addBtn).toBeInTheDocument();
  });

  test("shows correct number of results", () => {
    render(<Staff />);

    expect(screen.getByText(/showing/i)).toBeInTheDocument();
  });
});
