/* eslint-disable @typescript-eslint/no-explicit-any */
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, test, expect, vi } from "vitest";
import OkDialog from "../fullscreen_popups/OkDialog";

describe("OkDialog component", () => {
  test("renders children content", () => {
    render(<OkDialog onOk={vi.fn()}>Saved successfully</OkDialog>);

    expect(screen.getByText("Saved successfully")).toBeInTheDocument();
  });

  test("renders Ok button", () => {
    render(<OkDialog onOk={vi.fn()}>Message</OkDialog>);

    expect(screen.getByText("Ok")).toBeInTheDocument();
  });

  test("calls onOk when button is clicked", () => {
    const onOkMock = vi.fn();

    render(<OkDialog onOk={onOkMock}>Message</OkDialog>);

    fireEvent.click(screen.getByText("Ok"));

    expect(onOkMock).toHaveBeenCalledTimes(1);
  });
});
