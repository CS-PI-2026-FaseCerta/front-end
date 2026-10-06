const collectValidationMessages = (data) => {
  const validation = data?.errors ?? data?.violations ?? data?.fieldErrors;

  if (Array.isArray(validation)) {
    return validation
      .map((item) => item?.message ?? item?.defaultMessage ?? item)
      .filter(Boolean)
      .join(" ");
  }

  if (validation && typeof validation === "object") {
    return Object.values(validation)
      .flatMap((value) => (Array.isArray(value) ? value : [value]))
      .map((item) => item?.message ?? item?.defaultMessage ?? item)
      .filter(Boolean)
      .join(" ");
  }

  return "";
};

