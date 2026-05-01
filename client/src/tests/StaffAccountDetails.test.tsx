/* eslint-disable @typescript-eslint/no-explicit-any */
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, test, expect, vi } from "vitest";
import AccountDetails from "../pages/StaffAccountDetails";

// mock navigation + route
const navigateMock = vi.fn();

vi.mock("react-router-dom", () => ({
  useNavigate: () => navigateMock,
  useLocation: () => ({
    pathname: "/staff/alice@test.com/account_details",
  }),
  useOutletContext: () => ({
    data: [],
    setData: vi.fn(),
    staff: {
      user_id: 1,
      name: "Alice",
      email: "alice@test.com",
      contract_hours: 100,
      allocation: 0,
    },
    setStaff: vi.fn(),
    incrementDetailsRefreshKey: vi.fn(),
  }),
}));

vi.mock("@/context/useStaff", () => ({
  useStaff: () => ({
    incrementRefreshKey: vi.fn(),
    incrementModuleRefreshKey: vi.fn(),
  }),
}));

// mock staff API
vi.mock("@/api/staff", () => ({
  fetchStaffByEmail: vi.fn(() =>
    Promise.resolve({
      name: "Alice",
      email: "alice@test.com",
      role: "teaching",
      contract_type: "TS",
      contract_hours: 1360,
      pw_changed: false,
      active: true,
    }),
  ),

  saveStaff: vi.fn(() => Promise.resolve()),
  deleteStaff: vi.fn(() => Promise.resolve()),
}));

// UI components
vi.mock("@/ui_components/Fullscreen", () => ({
  default: ({ children }: any) => <div>{children}</div>,
}));

vi.mock("@/fullscreen_popups/Confirm", () => ({
  default: ({ children }: any) => <div>{children}</div>,
}));

vi.mock("@/fullscreen_popups/OkDialog", () => ({
  default: ({ children }: any) => <div>{children}</div>,
}));

describe("AccountDetails page", () => {
  test("renders staff details", async () => {
    render(<AccountDetails />);

    expect(await screen.findByDisplayValue("Alice")).toBeInTheDocument();
    expect(screen.getByDisplayValue("alice@test.com")).toBeInTheDocument();
  });

  test("updates name input", async () => {
    render(<AccountDetails />);

    const user = userEvent.setup();

    const nameInput = await screen.findByDisplayValue("Alice");

    await user.clear(nameInput);
    await user.type(nameInput, "Bob");

    expect(nameInput).toHaveValue("Bob");
  });

  test("updates email input", async () => {
    render(<AccountDetails />);

    const user = userEvent.setup();

    const emailInput = await screen.findByDisplayValue("alice@test.com");

    await user.clear(emailInput);
    await user.type(emailInput, "bob@test.com");

    expect(emailInput).toHaveValue("bob@test.com");
  });

  test("save button exists", async () => {
    render(<AccountDetails />);

    const saveBtn = screen.getByRole("button", { name: /save/i });

    expect(saveBtn).toBeInTheDocument();
  });

  test("delete button opens confirmation", async () => {
    render(<AccountDetails />);

    const user = userEvent.setup();

    const deleteBtn = screen.getByRole("button", {
      name: /delete user/i,
    });

    await user.click(deleteBtn);

    expect(deleteBtn).toBeInTheDocument();
  });
});
