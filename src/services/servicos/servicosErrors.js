const getApiMessage = (data) => {
  if (typeof data === "string") return data;
  return data?.message ?? data?.error ?? data?.detail ?? "";
};

export const getServiceErrorMessage = (
  error,
  fallback = "Não foi possível concluir a operação.",
) => {
  const status = error?.response?.status;
  const apiMessage = getApiMessage(error?.response?.data);

  if (status === 403) {
    return "Você não possui permissão para realizar esta operação.";
  }

  if (status === 404) {
    return "Serviço não encontrado ou já removido.";
  }

  if (status === 401) {
    return "Sua sessão expirou. Faça login novamente.";
  }

  if (apiMessage) return apiMessage;
  if (!error?.response) return "Não foi possível conectar ao servidor.";
  return fallback;
};
