import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { decodeToken, getAuthToken, SESSION_CHANGE_EVENT } from "./session";

export default function AuthSessionMonitor() {
  const navigate = useNavigate();
  const location = useLocation();
  useEffect(() => {
    let timeoutId;
    const checkSession = () => {
      window.clearTimeout(timeoutId);
      const token = getAuthToken();
      const claims = token ? decodeToken(token) : null;
      if (!claims) {
        if (location.pathname !== "/login" && location.pathname !== "/recuperarSenha" && location.pathname !== "/alterarSenha") {
          // A rota protegida faz a verificação na navegação; após um logout externo
          // ou expiração com o app aberto, precisamos forçar o redirecionamento.
          navigate("/login", { replace: true });
        }
        return;
      }
      timeoutId = window.setTimeout(checkSession, Math.max(0, claims.exp * 1000 - Date.now() + 50));
    };
    const onVisibility = () => { if (!document.hidden) checkSession(); };
    checkSession();
    window.addEventListener("storage", checkSession);
    window.addEventListener("focus", checkSession);
    window.addEventListener(SESSION_CHANGE_EVENT, checkSession);
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      window.clearTimeout(timeoutId);
      window.removeEventListener("storage", checkSession);
      window.removeEventListener("focus", checkSession);
      window.removeEventListener(SESSION_CHANGE_EVENT, checkSession);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [location.pathname, navigate]);
  return null;
}
