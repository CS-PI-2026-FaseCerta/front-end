import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import Header from "../../../global/components/header/Header.jsx";
import Footer from "../../../global/components/Footer/Footer.jsx";
import "./../Auth.css";
import "../../../global/components/form/Form.css";
import * as AppRoutes from "../../../routes/AppRoutes.jsx";

const RecoverPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [timer, setTimer] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const resendTimeoutRef = useRef(null);

  const validateEmail = (value) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(value.trim());
  };

  useEffect(() => {
    if (timer === 0) {
      return undefined;
    }

    const timeoutId = window.setTimeout(() => {
      setTimer((currentTimer) => Math.max(currentTimer - 1, 0));
    }, 1000);

    return () => window.clearTimeout(timeoutId);
  }, [timer]);

  useEffect(() => {
    return () => {
      if (resendTimeoutRef.current) {
        window.clearTimeout(resendTimeoutRef.current);
      }
    };
  }, []);

  const handleChange = (e) => {
    const { value } = e.target;
    setEmail(value);

    if (emailError && validateEmail(value)) {
      setEmailError("");
    }
  };

  const handleBlur = () => {
    if (!validateEmail(email)) {
      setEmailError("Insira um e-mail válido.");
      return;
    }

    setEmailError("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (isLoading || timer > 0 || !validateEmail(email)) return;

    setEmailError("");
    setIsLoading(true);
    setSuccessMessage("");

    if (resendTimeoutRef.current) {
      window.clearTimeout(resendTimeoutRef.current);
    }

    const submittedEmail = email.trim();

    resendTimeoutRef.current = window.setTimeout(() => {
      setSuccessMessage(
        `Código de recuperação enviado para ${submittedEmail}.`,
      );
      setTimer(60);
      setIsLoading(false);
    }, 600);
  };

  const submitLabel = isLoading
    ? "Enviando..."
    : timer > 0
      ? `Reenviar código em ${timer}s`
      : successMessage
        ? "Reenviar código"
        : "Enviar código";

  const isEmailValid = validateEmail(email);
  const isSubmitDisabled = isLoading || timer > 0 || !isEmailValid;

  return (
    <div className="auth-page">
      <Header />

      <main className="auth-container">
        <section className="auth-card">
          <div className="auth-card-header">
            <button
              type="button"
              className="auth-back-button"
              onClick={() => navigate(AppRoutes.Login)}
              aria-label="Voltar para o login"
            >
              <FaArrowLeft size={18} />
            </button>

            <h1 className="auth-title">Recuperar senha</h1>
          </div>

          <p className="auth-subtitle">
            Informe o e-mail cadastrado para receber o código de recuperação.
          </p>

          <form className="form" onSubmit={handleSubmit} noValidate>
            <div className="input-group">
              <label className="form-label" htmlFor="email">
                E-mail
              </label>

              <input
                id="email"
                name="email"
                type="email"
                value={email}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`form-input ${emailError ? "input-error" : ""}`}
                placeholder="Insira seu e-mail aqui"
                autoComplete="email"
                aria-invalid={Boolean(emailError)}
                aria-describedby={
                  emailError ? "recover-password-error" : undefined
                }
                required
              />

              <p className="form-text">
                Use o mesmo e-mail já cadastrado no sistema.
              </p>

              {emailError && (
                <span id="recover-password-error" className="form-error-inline">
                  {emailError}
                </span>
              )}
            </div>

            {successMessage && <p className="form-success">{successMessage}</p>}

            <button
              type="submit"
              className="form-button"
              disabled={isSubmitDisabled}
            >
              {submitLabel}
            </button>

            <p className="auth-footer-text">
              Lembrou da senha?{" "}
              <Link className="auth-link" to={AppRoutes.Login}>
                Voltar ao login
              </Link>
            </p>
          </form>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default RecoverPassword;
