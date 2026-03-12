import type { Assignment } from "@/types/assignment_type";
import type { ModuleOffering } from "@/types/module_offering_type";
import type { Module } from "@/types/module_type";

export default function evaluateFormula(assignment: Assignment & Module & ModuleOffering, text: string) {
    const replacements: Record<string, number | string> = {
        alpha: assignment.alpha,
        beta: assignment.beta,
        delta: assignment.delta ?? 0,
        share: assignment.share ?? 0,
        credits: assignment.credits,
        students: assignment.estimated_number_students,
        coordinator: assignment.coordinator ?? 0,
    }

    let replacedText = text;

    // replace variables
    for (const key in replacements) {
        const assignment_value = replacements[key]
        const regex_match = new RegExp(`\\b${key}\\b`, "gi");
        replacedText = replacedText.replace(regex_match, String(assignment_value))
    }

    //replacedText = replacedText.replace(/x/gi, "*"); // Replace  "x" with "*" for multiplication.

    try {
        return Math.round(Function(`return (${replacedText})`)() * 100) / 100
    } catch {
        return "ERROR"
    }
}