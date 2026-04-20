// @vitest-environment node

import { test, expect, describe } from "vitest";

import evaluateFormula from "../lib/formula";
import type { Assignment } from "@/types/assignment_type";
import type { ModuleOffering } from "@/types/module_offering_type";
import type { Module } from "@/types/module_type";

const dummyAssignment: Assignment & Module & ModuleOffering = {
  alpha: 4.4,
  beta: 0.15,
  delta: 1,
  share: 0.5,
  credits: 20,
  estimated_number_students: 100,
  coordinator: 1,
  h: 10,
  assignment_id: 1,
  user_id: 1,
  offering_id: 1,
  students: 100,
  custom_formula: "alpha + beta",
  code: "test",
  name: "test case",
  module_type: "teaching",
  individual: false,
  module_id: 1,
  year_id: 1,
  crit: 1,
};

describe("evaluateFormula", () => {
  test("Calculates a simple formula correctly", () => {
    const result = evaluateFormula(dummyAssignment, "alpha + beta");
    expect(result).toBe(4.55);
  });

  // multiply by 0 case
  test("Handles zeros correctly", () => {
    const result = evaluateFormula(dummyAssignment, "alpha * 0");

    expect(result).toBe(0);
  });

  // check output rounded to 2d.p.
  test("Rounds to 2 decimal places", () => {
    const result = evaluateFormula(dummyAssignment, "alpha / 3");
    expect(result).toBe(1.47);
  });

  test("Returns ERROR for invalid formula.", () => {
    const result = evaluateFormula(dummyAssignment, "alpha + beta a");
    expect(result).toBe("ERROR");
  });

  test("Returns NaN for invalid formula.", () => {
    const result = evaluateFormula(dummyAssignment, "");
    expect(result).toBe(NaN); // tells ui to replace default.
  });

  test("Rejects malicious code, returning ERROR.", () => {
    const result = evaluateFormula(dummyAssignment, "process.exit()");
    expect(result).toBe("ERROR");
  });
});
