import React, { useEffect, useState } from "react";
import { FaEye, FaEyeSlash, FaMoon } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Header from "../../global/components/Header/Header.jsx";
import { getRememberMe, login as authLogin, saveRememberMe } from "../mockAuth";

import { Link } from "react-router-dom";
import "./login.css";

const Login = () => {
  const navigate = useNavigate();
  const [emailOrUsername, setEmailOrUsername] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [emailOrUsernameError, setEmailOrUsernameError] = useState(false);

  useEffect(() => {
    const remembered = getRememberMe();
    if (!remembered) {
      return;
    }

    setEmailOrUsername(remembered.emailOrUsername || "");
    setPassword(remembered.password || "");
    setRememberMe(true);
  }, []);

  const validateEmailOrUsername = (value) => {
    if (!value) return false;
    // Validação para e-mail (contém '@') ou nome de usuário (não contém espaços)
    const isEmailFormat = value.includes("@");
    if (isEmailFormat) {
      // Validação de e-mail um pouco mais robusta
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(value);
    } else {
      // Nome de usuário não pode ter espaços
      return !value.includes(" ");
    }
  };

  const handleEmailOrUsernameChange = (e) => {
    const value = e.target.value;
    setEmailOrUsername(value);
    // Remove a borda vermelha assim que o usuário corrigir o formato
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

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isLoading) return;

    const isEmailOrUsernameValid = validateEmailOrUsername(emailOrUsername);

    // 1. Valida o formato primeiro
    if (!isEmailOrUsernameValid) {
      setEmailOrUsernameError(true);
      setLoginError("");
      return;
    }

    // Formato correto: tira a borda vermelha (se houver) e tenta autenticar
    setEmailOrUsernameError(false);

    // 2. Tentativa de Autenticação
    if (password.length > 0) {
      setLoginError("");
      setIsLoading(true);
      console.log("Credenciais:", { emailOrUsername, password, rememberMe });

      // Simulação de chamada de API
      setTimeout(() => {
        const result = authLogin(emailOrUsername, password);

        if (result.success) {
          saveRememberMe({
            rememberMe,
            emailOrUsername,
            password,
          });
          console.log("Usuário autenticado:", result.user);
          navigate("/dashboard", { replace: true });
        } else {
          setLoginError(
            result.message || "E-mail/Nome de Usuário ou senha incorretos",
          );
        }
        setIsLoading(false);
      }, 1500);
    } else {
      // Se a senha estiver vazia, falha e exibe o erro geral
      setLoginError("E-mail/Nome de Usuário ou senha incorretos");
    }
  };

  return (
    <div className="page-container">
      <Header />

      <main className="login-container">
        <div className="login-card">
          <h2 className="login-card__title">Acesse sua conta</h2>
          <p className="login-card__subtitle">Insira seus dados para entrar</p>

          <form onSubmit={handleSubmit} noValidate>
            <div className="input-group">
              <label htmlFor="emailOrUsername">E-mail ou Usuário</label>
              <input
                type="text"
                id="emailOrUsername"
                className={`input-field ${emailOrUsernameError ? "input-error" : ""}`}
                placeholder="seu@email.com ou seu_usuario"
                value={emailOrUsername}
                onChange={handleEmailOrUsernameChange}
                onBlur={handleEmailOrUsernameBlur}
              />
            </div>

            <div className="input-group">
              <div className="label-group">
                <label htmlFor="password">Senha</label>
              </div>
              <div className="input-wrapper">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  className="input-field"
                  placeholder="••••••••••"
                  value={password}
                  onChange={handlePasswordChange}
                />
                <span
                  className="password-icon"
                  onClick={togglePasswordVisibility}
                  role="button"
                  aria-label={showPassword ? "Esconder senha" : "Mostrar senha"}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>
              <div style={{ textAlign: "right" }}>
                <a href="#" className="link">
                  Esqueceu sua senha?
                </a>
              </div>
            </div>

            <div className="form-options">
              <div className="checkbox-group">
                <input
                  type="checkbox"
                  id="rememberMe"
                  checked={rememberMe}
                  onChange={handleRememberMeChange}
                />
                <label htmlFor="rememberMe">Lembre de mim</label>
              </div>
            </div>

            {loginError && <p className="login-error-message">{loginError}</p>}

            <button type="submit" className="login-button" disabled={isLoading}>
              {isLoading ? "Entrando..." : "Entrar"}
            </button>

            <p className="signup-link">
              Ainda não tem uma conta?{" "}
              <Link to="/cadastroUsuario">Cadastre-se</Link>
            </p>
          </form>
        </div>
      </main>
    </div>
  );
};

export default Login;
