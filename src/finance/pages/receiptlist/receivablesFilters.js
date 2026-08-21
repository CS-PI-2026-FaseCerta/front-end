export const filterByDate = (itemDate, targetMonth, targetYear) => {
  if (!itemDate) return false;
  // Add timezone offset to prevent off-by-one errors due to UTC conversion if needed, 
  // but since we are just comparing month/year of ISO strings (YYYY-MM-DD), simple string matching or UTC methods is safer.
  // We'll extract directly from the YYYY-MM-DD string format if possible.
  const [yearStr, monthStr] = itemDate.split("-");
  return parseInt(monthStr, 10) === targetMonth && parseInt(yearStr, 10) === targetYear;
};

export const filterByColumnString = (itemValue, filterValue) => {
  if (!filterValue) return true;
  if (!itemValue) return false;
  return itemValue.toString().toLowerCase().includes(filterValue.toLowerCase());
};

export const filterByCategory = (itemValue, filterValue) => {
  if (!filterValue) return true;
  return itemValue === filterValue;
};

export const filterByPaymentType = (itemValue, filterValue) => {
  if (!filterValue) return true;
  return itemValue === filterValue;
};

export const filterByPaymentMethod = (itemValue, filterValue) => {
  if (!filterValue) return true;
  return itemValue === filterValue;
};

export const filterByStatus = (itemValue, filterValue) => {
  if (!filterValue) return true;
  const isPaid = filterValue === "true" || filterValue === true;
  return itemValue === isPaid;
};

export const applyReceivablesFilters = (data, filters) => {
  return data.filter((item) => {
    // Month filter (mandatory)
    if (!filterByDate(item.date, filters.month, filters.year)) {
      return false;
    }
    
    // Column filters
    if (filters.date && !filterByColumnString(item.date, filters.date)) return false;
    if (filters.description && !filterByColumnString(item.description, filters.description)) return false;
    if (filters.client && !filterByColumnString(item.client, filters.client)) return false;
    
    // Select based filters
    if (filters.category && !filterByCategory(item.category, filters.category)) return false;
    if (filters.paymentType && !filterByPaymentType(item.paymentType, filters.paymentType)) return false;
    if (filters.paymentMethod && !filterByPaymentMethod(item.paymentMethod, filters.paymentMethod)) return false;
    if (filters.paid !== undefined && filters.paid !== "" && !filterByStatus(item.paid, filters.paid)) return false;

    // Value filter (usually text contains or exactly matches if formatted)
    if (filters.value && !filterByColumnString(item.value.toString(), filters.value.replace(/\D/g, ""))) return false;

    return true;
  });
};
