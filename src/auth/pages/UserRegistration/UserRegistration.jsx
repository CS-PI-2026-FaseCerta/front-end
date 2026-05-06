import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { FaArrowLeft } from "react-icons/fa";
import Header from "../../../global/components/header/Header.jsx";
import Footer from "../../../global/components/Footer/Footer.jsx";
import "./UserRegistration.css";
import "../../../auth/pages/Auth.css";
import "../../../global/components/form/Form.css";

import * as AppRoutes from "../../../routes/AppRoutes.jsx";

export default function CadastroUsuario() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    username: "",
    password: "",
    confirm: "",
  });

  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [emailError, setEmailError] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const validateEmail = (value) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(value);
  };

  const isMatch = form.password === form.confirm;

  const allFilled =
    form.email &&
    form.username &&
    form.password &&
    form.confirm &&
    isMatch &&
    !emailError &&
    !isLoading;

  function updateField(e) {
    setForm({ ...form, [e.target.name]: e.target.value });

    if (e.target.name === "email" && emailError) {
      setEmailError(!validateEmail(e.target.value));
    }
  }

  const handleEmailBlur = () => {
    if (form.email) {
      setEmailError(!validateEmail(form.email));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (allFilled) {
      setIsLoading(true);
      setSuccessMessage("");

      console.log("Iniciando cadastro...", form);

      // -- Simulação de chamada de API (2 segundos)
      setTimeout(() => {
        setIsLoading(false);
        setSuccessMessage("Cadastro realizado com sucesso!");
      }, 2000);
    }
  };

  return (
    <div className="auth-page page-container">
      <Header />

      <main className="login-container">
        <div className="login-card">
          <button onClick={() => navigate(-1)} className="back-button" style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
            <FaArrowLeft />
          </button>
          <h2 className="login-card__title">Crie sua conta</h2>
          <p className="login-card__subtitle">Insira seus dados para começar</p>

          <form className="form" onSubmit={handleSubmit} noValidate>
            <div className="input-group">
              <label className="form-label" htmlFor="email">
                E-mail
              </label>
              <input
                type="email"
                id="email"
                name="email"
                className={`form-input ${emailError ? "input-error" : ""}`}
                placeholder="seu@email.com"
                value={form.email}
                onChange={updateField}
                onBlur={handleEmailBlur}
                disabled={isLoading}
              />
              {emailError && (
                <p className="form-error-inline">E-mail inválido!</p>
              )}
            </div>

            <div className="input-group">
              <label className="form-label" htmlFor="username">
                Nome de Usuário
              </label>
              <input
                type="text"
                id="username"
                name="username"
                className="form-input"
                placeholder="Como quer ser chamado?"
                value={form.username}
                onChange={updateField}
                disabled={isLoading}
              />
            </div>

            <div className="input-group">
              <label className="form-label" htmlFor="password">
                Senha
              </label>
              <div className="form-input-wrapper">
                <input
                  type={showPass ? "text" : "password"}
                  id="password"
                  name="password"
                  className="form-input"
                  placeholder="••••••••••"
                  value={form.password}
                  onChange={updateField}
                  disabled={isLoading}
                />
                <span
                  className="form-password-toggle"
                  onClick={() => !isLoading && setShowPass(!showPass)}
                >
                  {showPass ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>
            </div>

            <div className="input-group">
              <label className="form-label" htmlFor="confirm">
                Confirme sua senha
              </label>
              <div className="form-input-wrapper">
                <input
                  type={showConfirm ? "text" : "password"}
                  id="confirm"
                  name="confirm"
                  className={`form-input ${form.confirm && !isMatch ? "input-error" : ""}`}
                  placeholder="••••••••••"
                  value={form.confirm}
                  onChange={updateField}
                  disabled={isLoading}
                />
                <span
                  className="form-password-toggle"
                  onClick={() => !isLoading && setShowConfirm(!showConfirm)}
                >
                  {showConfirm ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>

              {form.confirm && !isMatch && (
                <p className="form-error-inline">As senhas não coincidem!</p>
              )}
            </div>

            {/* MENSAGEM DE SUCESSO */}
            {successMessage && <p className="form-success">{successMessage}</p>}

            <button type="submit" className="form-button" disabled={!allFilled}>
              {isLoading ? "Cadastrando..." : "Criar conta!"}
            </button>

            <p className="auth-footer-text signup-link">
              Já tem conta?{" "}
              <Link
                to={AppRoutes.Login}
                className="auth-link"
                style={{ pointerEvents: isLoading ? "none" : "auto" }}
              >
                Entre Aqui
              </Link>
            </p>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
}
