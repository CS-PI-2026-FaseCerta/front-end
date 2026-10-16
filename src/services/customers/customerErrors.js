export const getCustomerErrorMessage = (error, fallback = "Não foi possível concluir a operação.") => {
  const status = error?.response?.status;
  const data = error?.response?.data;
  const message = typeof data === "string"
    ? data
    : data?.message ?? data?.error ?? data?.detail;

  if (message) return message;
  if (status === 404) return "Cliente não encontrado ou removido.";
  if (status === 409) return "Já existe um cliente com esses dados.";
  if (status === 401) return "Sua sessão expirou. Faça login novamente.";
  if (!error?.response) return "Não foi possível conectar ao servidor.";
  return fallback;
};

export const isCustomerNotFound = (error) => error?.response?.status === 404;
export const isCustomerConflict = (error) => error?.response?.status === 409;
