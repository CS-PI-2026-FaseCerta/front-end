import { createId } from "../pages/expenselist/utils/expenseList.utils.js";

const RECURRENCE_CONFIG = {
  weekly: { count: 12, days: 7 },
  monthly: { count: 6, months: 1 },
  quarterly: { count: 3, months: 3 },
  yearly: { count: 3, months: 12 },
};

export const createRecurringRows = (row, frequency, startDate) => {
  const config = RECURRENCE_CONFIG[frequency] ?? RECURRENCE_CONFIG.monthly;
  const firstDate = new Date(`${startDate}T12:00:00`);

  return Array.from({ length: config.count }, (_, index) => {
    const occurrenceDate = new Date(firstDate);
    if (config.days) {
      occurrenceDate.setDate(occurrenceDate.getDate() + config.days * (index + 1));
    } else {
      occurrenceDate.setMonth(occurrenceDate.getMonth() + config.months * (index + 1));
    }

    return {
      ...row,
      id: createId(),
      date: occurrenceDate.toISOString().slice(0, 10),
      paymentType: "Recorrente",
      paid: false,
      attachments: [],
      recurrence: { frequency, startDate },
    };
  });
};

export const recurringOccurrencesCount = (frequency) =>
  (RECURRENCE_CONFIG[frequency] ?? RECURRENCE_CONFIG.monthly).count;