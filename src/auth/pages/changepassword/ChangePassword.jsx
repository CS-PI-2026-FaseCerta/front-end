import React, { useState, useEffect } from "react";
// import { FaEye, FaEyeSlash, FaMoon } from "react-icons/fa";
import "./ChangePassword.css";
import Header from "../../../global/components/Header/Header";
import Footer from "../../../global/components/Footer/Footer";
import { FaArrowLeft } from "react-icons/fa";

const ChangePassword = () => {
  // Estados para os valores dos inputs
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const [errors, setErrors] = useState({
    mismatch: false,
    sameAsOld: false,
  });

  const [isButtonDisabled, setIsButtonDisabled] = useState(true);

  useEffect(() => {
    const { currentPassword, newPassword, confirmPassword } = formData;

    const allFilled = currentPassword && newPassword && confirmPassword;

    const mismatch = newPassword !== confirmPassword && confirmPassword !== "";

    const sameAsOld = newPassword === currentPassword && newPassword !== "";

    setErrors({
      mismatch,
      sameAsOld,
    });

    const canSubmit = allFilled && !mismatch && !sameAsOld;
    setIsButtonDisabled(!canSubmit);
  }, [formData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const toggleVisibility = (field) => {
    setShowPasswords((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Senha alterada com sucesso! (Simulação)");
  };

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
    <div className="change-password-page">
      <Header/>
      <main className="change-password-container">
        <section className="change-password-card">
          <div className="card-header">
            <button className="back-button">
              <FaArrowLeft size={20} />
            </button>
            <h1>Alterar Senha</h1>
          </div>

          <p className="card-header-p">
            Mantenha sua conta FaseCerta segura e atualizada.
          </p>

          <form onSubmit={handleSubmit} noValidate>
            {/* Senha Atual */}
            <div className="form-group">
              <label htmlFor="currentPassword" style={{ textAlign: "left" }}>
                Senha atual
              </label>
              <div className="input-wrapper">
                <input
                  id="currentPassword"
                  name="currentPassword"
                  type={showPasswords.current ? "text" : "password"}
                  value={formData.currentPassword}
                  onChange={handleChange}
                  placeholder="Digite sua senha atual"
                  required
                />
                <button
                  type="button"
                  className="toggle-password"
                  onClick={() => toggleVisibility("current")}
                  aria-label={
                    showPasswords.current ? "Ocultar senha" : "Mostrar senha"
                  }
                >
                  <EyeIcon visible={showPasswords.current} />
                </button>
              </div>
            </div>

            {}
            <div className="form-group">
              <label htmlFor="newPassword" style={{ textAlign: "left" }}>
                Nova senha
              </label>
              <div className="input-wrapper">
                <input
                  id="newPassword"
                  name="newPassword"
                  type={showPasswords.new ? "text" : "password"}
                  value={formData.newPassword}
                  onChange={handleChange}
                  placeholder="Crie uma nova senha"
                  className={errors.sameAsOld ? "input-error" : ""}
                  required
                />
                <button
                  type="button"
                  className="toggle-password"
                  onClick={() => toggleVisibility("new")}
                  aria-label={
                    showPasswords.new ? "Ocultar senha" : "Mostrar senha"
                  }
                >
                  <EyeIcon visible={showPasswords.new} />
                </button>
              </div>
              <p className="helper-text">
                Dica: use letras e números pra criar uma senha forte.
              </p>
              {errors.sameAsOld && (
                <span className="error-message">
                  A nova senha não pode ser igual à senha atual.
                </span>
              )}
            </div>

            {}
            <div className="form-group">
              <label htmlFor="confirmPassword" style={{ textAlign: "left" }}>
                Confirme a nova senha
              </label>
              <div className="input-wrapper">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showPasswords.confirm ? "text" : "password"}
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Repita a nova senha"
                  className={errors.mismatch ? "input-error" : ""}
                  required
                />
                <button
                  type="button"
                  className="toggle-password"
                  onClick={() => toggleVisibility("confirm")}
                  aria-label={
                    showPasswords.confirm ? "Ocultar senha" : "Mostrar senha"
                  }
                >
                  <EyeIcon visible={showPasswords.confirm} />
                </button>
              </div>
              {errors.mismatch && (
                <span className="error-message">As senhas não coincidem.</span>
              )}
            </div>

            <button
              type="submit"
              className="submit-btn"
              disabled={isButtonDisabled}
            >
              Alterar Senha
            </button>
          </form>

          <div className="card-footer">
            <a href="#" className="recovery-link">
              Esqueceu sua senha? <strong>Recuperar senha</strong>
            </a>
          </div>
        </section>
      </main>
      <Footer/>
    </div>
  );
};

export default ChangePassword;
