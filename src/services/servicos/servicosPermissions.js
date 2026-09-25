import { getCurrentUser } from "../../auth/mockAuth";

const WRITE_PROFILES = new Set(["admin", "gestor"]);

// Regra apenas de apresentação: a autorização efetiva continua sendo do back-end.
export const canManageServices = () => {
  const profile = getCurrentUser()?.perfil;
  return WRITE_PROFILES.has(String(profile ?? "").trim().toLowerCase());
};
