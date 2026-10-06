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

export const getExpenseErrorMessage = (
  error,
  fallback = "Não foi possível concluir a operação.",
) => {
  const status = error?.response?.status;
  const data = error?.response?.data;
  const validationMessage =
    data && typeof data === "object" ? collectValidationMessages(data) : "";
  const message =
    typeof data === "string"
      ? data
      : validationMessage ||
        data?.message ||
        data?.error ||
        data?.detail;

  if (message) return message;
  if (status === 404) return "Despesa não encontrada ou removida.";
  if (status === 401) return "Sua sessão expirou. Faça login novamente.";
  if (status === 403) return "Você não tem autorização para acessar despesas.";
  if (!error?.response) return "Não foi possível conectar ao servidor.";
  return fallback;
};
