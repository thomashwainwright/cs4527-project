/* eslint-disable @typescript-eslint/no-explicit-any */
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, test, expect, vi } from "vitest";
import Fullscreen from "../ui_components/Fullscreen";

// mock image import
vi.mock("../assets/icons/close-button.svg", () => ({
  default: "close-icon",
}));

describe("Fullscreen", () => {
  test("does not render when closed", () => {
    const { container } = render(
      <Fullscreen open={false}>
        <div>Content</div>
      </Fullscreen>,
    );

    expect(container.firstChild).toBeNull();
  });

  test("renders children when open", () => {
    render(
      <Fullscreen open={true}>
        <div>Content</div>
      </Fullscreen>,
    );

    expect(screen.getByText("Content")).toBeInTheDocument();
  });

  test("calls onClose when background clicked", () => {
    const onClose = vi.fn();

    render(
      <Fullscreen open={true} onClose={onClose}>
        <div>Content</div>
      </Fullscreen>,
    );

    const backdrop = screen.getByText("Content").parentElement
      ?.previousSibling as HTMLElement;

    fireEvent.click(backdrop);

    expect(onClose).toHaveBeenCalled();
  });

  test("calls onClose when close button clicked", () => {
    const onClose = vi.fn();

    render(
      <Fullscreen open={true} onClose={onClose}>
        <div>Content</div>
      </Fullscreen>,
    );

    fireEvent.click(screen.getByAltText("Close window"));

    expect(onClose).toHaveBeenCalled();
  });
});
