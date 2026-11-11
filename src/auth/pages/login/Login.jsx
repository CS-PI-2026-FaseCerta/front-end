import React, { useEffect, useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { Link, useNavigate, useLocation } from "react-router-dom";
import Header from "../../../global/components/header/Header.jsx";
import Footer from "../../../global/components/Footer/Footer.jsx";
import {
  getRememberMe,
  saveRememberMe,
  saveSession,
} from "../../session.js";
import { loginWithApi } from "../../authService.js";
import "./Login.css";
import "./../Auth.css";
import "../../../global/components/form/Form.css";
import * as AppRoutes from "../../../routes/AppRoutes.jsx";

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [emailOrUsername, setEmailOrUsername] = useState(
    location.state?.email || ""
  );
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [emailOrUsernameError, setEmailOrUsernameError] = useState(false);

  const allFilled =
    emailOrUsername &&
    password &&
    !emailOrUsernameError &&
    !isLoading;

  useEffect(() => {
    const remembered = getRememberMe();
    if (!remembered) {
      return;
    }

    if (!location.state?.email) setEmailOrUsername(remembered.emailOrUsername || "");
    setRememberMe(true);
  }, [location.state]);

  const validateEmailOrUsername = (value) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());

  const handleEmailOrUsernameChange = (e) => {
    const value = e.target.value;
    setEmailOrUsername(value);
    if (emailOrUsernameError) {
      setEmailOrUsernameError(!validateEmailOrUsername(value));
    }
  };

  const handleEmailOrUsernameBlur = () => {
    setEmailOrUsernameError(!validateEmailOrUsername(emailOrUsername));
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleRememberMeChange = (e) => {
    setRememberMe(e.target.checked);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isLoading) return;

    if (!validateEmailOrUsername(emailOrUsername)) {
      setEmailOrUsernameError(true);
      setLoginError("Informe um e-mail válido.");
      return;
    }
    if (!password) {
      setLoginError("Informe sua senha.");
      return;
    }

    setEmailOrUsernameError(false);
    setLoginError("");
    setIsLoading(true);

    try {
      const email = emailOrUsername.trim();
      const token = await loginWithApi(email, password);
      saveSession({ token, email, rememberMe });
      saveRememberMe({ rememberMe, emailOrUsername: email });
      navigate(AppRoutes.Dashboard, { replace: true });
    } catch (error) {
      setLoginError(error.message || "Não foi possível entrar. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-page page-container">
      <Header />

      <main className="auth-container login-container">
        <div className="auth-card login-card">
          <h2 className="auth-title login-card__title">Acesse sua conta</h2>
          <p className="auth-subtitle login-card__subtitle">
            Insira seus dados para entrar
          </p>

          <form className="form" onSubmit={handleSubmit} noValidate>
            <div className="input-group">
              <label className="form-label" htmlFor="emailOrUsername">
                E-mail
              </label>
              <input
                type="text"
                id="emailOrUsername"
                className={`form-input ${emailOrUsernameError ? "input-error" : ""}`}
                placeholder="seu@email.com"
                value={emailOrUsername}
                onChange={handleEmailOrUsernameChange}
                onBlur={handleEmailOrUsernameBlur}
              />
            </div>

            <div className="input-group">
              <div className="label-group">
                <label className="form-label" htmlFor="password">
                  Senha
                </label>
              </div>
              <div className="form-input-wrapper">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  className="form-input"
                  placeholder="••••••••••"
                  value={password}
                  onChange={handlePasswordChange}
                />
                <span
                  className="form-password-toggle"
                  onClick={togglePasswordVisibility}
                  role="button"
                  aria-label={showPassword ? "Esconder senha" : "Mostrar senha"}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>
              <div className="auth-align-right">
                <Link to={AppRoutes.RecoverPassword} className="auth-link link">
                  Esqueceu sua senha?
                </Link>
              </div>
            </div>

            <div className="form-options">
              <div className="form-checkbox-group">
                <input
                  type="checkbox"
                  id="rememberMe"
                  checked={rememberMe}
                  onChange={handleRememberMeChange}
                />
                <label className="form-label" htmlFor="rememberMe">
                  Lembre de mim
                </label>
              </div>
            </div>

            {loginError && <p className="form-error">{loginError}</p>}

            <button type="submit" className="form-button" disabled={!allFilled}>
              {isLoading ? "Entrando..." : "Entrar"}
            </button>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Login;