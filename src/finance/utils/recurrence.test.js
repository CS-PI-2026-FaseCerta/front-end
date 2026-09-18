import { createRecurringRows, recurringOccurrencesCount } from "./recurrence.js";

const row = {
  id: "receipt-1",
  date: "2026-05-01",
  description: "Mensalidade",
  paymentType: "À vista",
  paid: true,
  attachments: [{ id: "attachment-1" }],
};

test("creates monthly recurring occurrences with the shared payment type", () => {
  const occurrences = createRecurringRows(row, "monthly", "2026-05-01");

  expect(occurrences).toHaveLength(6);
  expect(occurrences.map((occurrence) => occurrence.date)).toEqual([
    "2026-06-01",
    "2026-07-01",
    "2026-08-01",
    "2026-09-01",
    "2026-10-01",
    "2026-11-01",
  ]);
  expect(occurrences.every((occurrence) => occurrence.paymentType === "Recorrente")).toBe(true);
  expect(occurrences.every((occurrence) => occurrence.paid === false)).toBe(true);
  expect(occurrences.every((occurrence) => occurrence.attachments.length === 0)).toBe(true);
});

test("uses the expected occurrence count for each recurrence frequency", () => {
  expect(recurringOccurrencesCount("weekly")).toBe(12);
  expect(recurringOccurrencesCount("monthly")).toBe(6);
  expect(recurringOccurrencesCount("quarterly")).toBe(3);
  expect(recurringOccurrencesCount("yearly")).toBe(3);
});