import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, test, expect, vi } from "vitest";
import Login from "../pages/Login";

// Mock useAuth
const loginMock = vi.fn();

vi.mock("@/auth/useAuth", () => ({
  useAuth: () => ({
    login: loginMock,
  }),
}));

describe("Login component", () => {
  test("Renders headings, inputs and buttons", () => {
    render(<Login />);

    expect(
      screen.getByRole("heading", { name: /sign in/i }),
    ).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /sign in/i }),
    ).toBeInTheDocument();
  });

  test("Calls login function with entered email and password", async () => {
    render(<Login />);

    const user = userEvent.setup();

    await user.type(screen.getByLabelText(/email/i), "example@example.com");
    await user.type(screen.getByLabelText(/password/i), "pw");

    await user.click(screen.getByRole("button", { name: /sign in/i }));

    expect(loginMock).toHaveBeenCalledWith("example@example.com", "pw");
  });

  test("Prevents empty form submission", async () => {
    render(<Login />);

    const user = userEvent.setup();

    const form = screen.getByRole("button").closest("form")!;
    const preventDefault = vi.fn();

    form.onsubmit = preventDefault;

    await user.click(screen.getByRole("button"));

    expect(loginMock).toHaveBeenCalled();
  });
});
