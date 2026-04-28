/* eslint-disable @typescript-eslint/no-explicit-any */
import { render, screen } from "@testing-library/react";
import { describe, test, expect, vi } from "vitest";
import DoughnutChart from "../ui_components/DoughnutChart";

// mock Doughnut component
const doughnutMock = vi.fn();

vi.mock("react-chartjs-2", () => ({
  Doughnut: (props: any) => {
    doughnutMock(props);
    return <div data-testid="doughnut-chart" />;
  },
}));

describe("DoughnutChart", () => {
  const mockData = {
    labels: ["A", "B", "C"],
    datasets: [
      {
        data: [10, 20, 30],
      },
    ],
  };

  test("renders title", () => {
    render(<DoughnutChart data={mockData} title="My Chart" />);

    expect(screen.getByText("My Chart")).toBeInTheDocument();
  });

  test("renders doughnut chart", () => {
    render(<DoughnutChart data={mockData} title="Chart" />);

    expect(screen.getByTestId("doughnut-chart")).toBeInTheDocument();
  });

  test("passes correct data to Doughnut", () => {
    render(<DoughnutChart data={mockData} title="Chart" />);

    expect(doughnutMock).toHaveBeenCalledWith(
      expect.objectContaining({
        data: mockData,
      }),
    );
  });

  test("passes correct options to Doughnut", () => {
    render(<DoughnutChart data={mockData} title="Chart" />);

    expect(doughnutMock).toHaveBeenCalledWith(
      expect.objectContaining({
        options: expect.objectContaining({
          cutout: "65%",
          plugins: {
            legend: { position: "bottom" },
          },
        }),
      }),
    );
  });
});
