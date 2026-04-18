import React, { useState, useEffect } from "react";
// import { FaEye, FaEyeSlash, FaMoon } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import "./ChangePassword.css";
import "./../Auth.css";
import "../../../global/components/form/Form.css";
import Header from "../../../global/components/header/Header.jsx";

import * as AppRoutes from "../../../routes/AppRoutes.jsx";

const ChangePassword = () => {
  const navigate = useNavigate();

  // Estados para os valores dos inputs
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // Estados para visibilidade das senhas (individual para cada campo)
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  // Estado para mensagens de erro
  const [errors, setErrors] = useState({
    mismatch: false,
    sameAsOld: false,
  });

  // Estado para controlar se o botão está habilitado
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);

  // Efeito para validar o formulário sempre que os dados mudarem
  useEffect(() => {
    const { currentPassword, newPassword, confirmPassword } = formData;

    // Validação: campos preenchidos
    const allFilled = currentPassword && newPassword && confirmPassword;

    // Validação: senhas coincidem
    const mismatch = newPassword !== confirmPassword && confirmPassword !== "";

    // Validação: nova senha igual à atual
    const sameAsOld = newPassword === currentPassword && newPassword !== "";

    setErrors({
      mismatch,
      sameAsOld,
    });

    // O botão só habilita se tudo estiver preenchido, coincidirem e a nova for diferente da antiga
    const canSubmit = allFilled && !mismatch && !sameAsOld;
    setIsButtonDisabled(!canSubmit);
  }, [formData]);

  // Manipulador de mudança nos inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Alternar visibilidade da senha
  const toggleVisibility = (field) => {
    setShowPasswords((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Senha alterada com sucesso! (Simulação)");
    // Aqui viria a integração com a API
  };

  // Componente interno para os ícones de Olho (SVG)
  const EyeIcon = ({ visible }) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {visible ? (
        <>
          <path d="M17.94 17.94A10.07 10.07 0 0 1 12 19c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
          <line x1="1" y1="1" x2="23" y2="23"></line>
        </>
      ) : (
        <>
          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
          <circle cx="12" cy="12" r="3"></circle>
        </>
      )}
    </svg>
  );

  return (
    <div className="auth-page change-password-page">
      <Header />
      <main className="auth-container change-password-container">
        <div className="auth-card form-container">
          <div className="card-header">
            <button
              type="button"
              className="back-button"
              onClick={() => navigate(AppRoutes.Dashboard)}
            >
              <FaArrowLeft className="arrowLeft" size={20} />
            </button>
            <h1>Alterar Senha</h1>
          </div>

          <p className="card-header-p">
            Mantenha sua conta FaseCerta segura e atualizada.
          </p>

          <form className="form" onSubmit={handleSubmit} noValidate>
            {/* Senha Atual */}
            <div className="input-group">
              <label className="form-label" htmlFor="currentPassword">
                Senha atual
              </label>
              <div className="form-input-wrapper">
                <input
                  id="currentPassword"
                  name="currentPassword"
                  type={showPasswords.current ? "text" : "password"}
                  className="form-input"
                  value={formData.currentPassword}
                  onChange={handleChange}
                  placeholder="Digite sua senha atual"
                  required
                />
                <button
                  type="button"
                  className="form-password-toggle"
                  onClick={() => toggleVisibility("current")}
                  aria-label={
                    showPasswords.current ? "Ocultar senha" : "Mostrar senha"
                  }
                >
                  <EyeIcon visible={showPasswords.current} />
                </button>
              </div>
            </div>

            {/* Nova Senha */}
            <div className="input-group">
              <label className="form-label" htmlFor="newPassword">
                Nova senha
              </label>
              <div className="form-input-wrapper">
                <input
                  id="newPassword"
                  name="newPassword"
                  type={showPasswords.new ? "text" : "password"}
                  value={formData.newPassword}
                  onChange={handleChange}
                  placeholder="Crie uma nova senha"
                  className={`form-input ${errors.sameAsOld ? "input-error" : ""}`}
                  required
                />
                <button
                  type="button"
                  className="form-password-toggle"
                  onClick={() => toggleVisibility("new")}
                  aria-label={
                    showPasswords.new ? "Ocultar senha" : "Mostrar senha"
                  }
                >
                  <EyeIcon visible={showPasswords.new} />
                </button>
              </div>
              <p className="form-text">
                Dica: use letras e números pra criar uma senha forte.
              </p>
              {errors.sameAsOld && (
                <span className="form-error-inline">
                  A nova senha não pode ser igual à senha atual.
                </span>
              )}
            </div>

            {/* Confirmar Nova Senha */}
            <div className="input-group">
              <label className="form-label" htmlFor="confirmPassword">
                Confirme a nova senha
              </label>
              <div className="form-input-wrapper">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showPasswords.confirm ? "text" : "password"}
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Repita a nova senha"
                  className={`form-input ${errors.mismatch ? "input-error" : ""}`}
                  required
                />
                <button
                  type="button"
                  className="form-password-toggle"
                  onClick={() => toggleVisibility("confirm")}
                  aria-label={
                    showPasswords.confirm ? "Ocultar senha" : "Mostrar senha"
                  }
                >
                  <EyeIcon visible={showPasswords.confirm} />
                </button>
              </div>
              {errors.mismatch && (
                <span className="form-error-inline">
                  As senhas não coincidem.
                </span>
              )}
            </div>

            <button
              type="submit"
              className="form-button"
              disabled={isButtonDisabled}
            >
              Alterar Senha
            </button>
          </form>

          <div className="auth-footer-text card-footer">
            <Link to={AppRoutes.Login} className="auth-link recovery-link">
              Esqueceu sua senha? <strong>Recuperar senha</strong>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ChangePassword;
