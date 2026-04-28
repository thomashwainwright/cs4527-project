/* eslint-disable @typescript-eslint/no-explicit-any */
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, test, expect, vi } from "vitest";
import Confirm from "../fullscreen_popups/Confirm";

describe("Confirm component", () => {
  test("renders children content", () => {
    render(
      <Confirm onYes={vi.fn()} onNo={vi.fn()}>
        Are you sure?
      </Confirm>,
    );

    expect(screen.getByText("Are you sure?")).toBeInTheDocument();
  });

  test("renders Yes and No buttons", () => {
    render(
      <Confirm onYes={vi.fn()} onNo={vi.fn()}>
        Confirm action
      </Confirm>,
    );

    expect(screen.getByText("Yes")).toBeInTheDocument();
    expect(screen.getByText("No")).toBeInTheDocument();
  });

  test("calls onYes when Yes button is clicked", () => {
    const onYesMock = vi.fn();

    render(
      <Confirm onYes={onYesMock} onNo={vi.fn()}>
        Confirm action
      </Confirm>,
    );

    fireEvent.click(screen.getByText("Yes"));

    expect(onYesMock).toHaveBeenCalledTimes(1);
  });

  test("calls onNo when No button is clicked", () => {
    const onNoMock = vi.fn();

    render(
      <Confirm onYes={vi.fn()} onNo={onNoMock}>
        Confirm action
      </Confirm>,
    );

    fireEvent.click(screen.getByText("No"));

    expect(onNoMock).toHaveBeenCalledTimes(1);
  });
});
