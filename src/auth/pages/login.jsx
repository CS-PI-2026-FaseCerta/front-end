import React, { useState } from "react";
import { FaEye, FaEyeSlash, FaMoon } from "react-icons/fa";
import "./login.css";

const Login = () => {
  const [emailOrUsername, setEmailOrUsername] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [emailOrUsernameError, setEmailOrUsernameError] = useState(false);

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
      return !value.includes(" "); // Nome de usuário não pode ter espaços
    }
  };

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

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isLoading) return;

    // Revalida antes de submeter
    const isEmailOrUsernameValid = validateEmailOrUsername(emailOrUsername);
    setEmailOrUsernameError(!isEmailOrUsernameValid);

    if (isEmailOrUsernameValid && password.length > 0) {
      setIsLoading(true);
      console.log("Credenciais:", { emailOrUsername, password, rememberMe });

      // Simulação de chamada de API
      setTimeout(() => {
        alert("Login efetuado com sucesso (simulação)!");
        setIsLoading(false);
        // Aqui você redirecionaria para o Dashboard
      }, 2000);
    } else {
      // O feedback visual já indica os erros
      console.error("Por favor, corrija os erros no formulário.");
    }
  };

  return (
    <div className="page-container">
      <header className="page-header">
        <div className="logo">FaseCerta</div>
        <div className="theme-icon">
          <FaMoon size={20} />
        </div>
      </header>

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
                className={`input-field ${
                  emailOrUsernameError ? "input-error" : ""
                }`}
                placeholder="seu@email.com ou seu_usuario"
                value={emailOrUsername}
                onChange={handleEmailOrUsernameChange}
                onBlur={handleEmailOrUsernameBlur}
              />
            </div>

            <div className="input-group">
              <div className="label-group">
                <label htmlFor="password">Senha</label>
                {/* <a href="#" className="link">
                  Esqueceu sua senha?
                </a> */}
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
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>
              <a href="#" className="link">
                Esqueceu sua senha?
              </a>
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

            <button type="submit" className="login-button" disabled={isLoading}>
              {isLoading ? "Entrando..." : "Entrar"}
            </button>

            <p className="signup-link">
              Ainda não tem uma conta? <a href="#">Cadastre-se</a>
            </p>
          </form>
        </div>
      </main>

      <footer className="page-footer">
        <span className="copyright">FaseCerta © 2026</span>
        <div className="footer-links">
          <a href="#">Suporte</a>
          <a href="#">Termos de Uso</a>
          <a href="#">Política de Privacidade</a>
        </div>
      </footer>
    </div>
  );
};

export default Login;
