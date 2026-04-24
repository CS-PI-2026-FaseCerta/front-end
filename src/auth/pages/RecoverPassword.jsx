import React, { useState, useEffect } from 'react';
import './RecoverPassword.css';
import { FaArrowLeft } from "react-icons/fa";

const RecoverPassword = () => {

  // Estado do formulário (mesmo padrão)
  const [formData, setFormData] = useState({
    email: '',
  });

  // Estado de erro
  const [errors, setErrors] = useState({
    invalidEmail: false,
  });

  // Controle do botão
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);

  // Regex de validação de e-mail
  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  // Validação (igual ao AlterarSenha)
  useEffect(() => {
    const { email } = formData;

    const isValid = validateEmail(email);

    setErrors({
      invalidEmail: email !== '' && !isValid,
    });

    const canSubmit = email && isValid;

    setIsButtonDisabled(!canSubmit);

  }, [formData]);

  // Atualização do input
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (isButtonDisabled) return;

    alert(`Link de recuperação enviado para: ${formData.email}`);
  };

  return (
    <div className="change-password-page">

      <main className="change-password-container">
        <section className="change-password-card">

          {/* HEADER */}
          <div className="card-header">
            <button 
              className="back-button"
              onClick={() => window.history.back()}
            >
              <FaArrowLeft size={20}/>
            </button>

            <h1>Recupere sua senha</h1>
          </div>

          <p className="card-header-p">
            Insira seu e-mail para receber o link de recuperação.
          </p>

          <form onSubmit={handleSubmit} noValidate>

            {/* EMAIL */}
            <div className="form-group">
              <label htmlFor="email" style={{ textAlign: "left" }}>
                E-mail
              </label>

              <div className="input-wrapper">
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Insira seu e-mail aqui"
                  className={errors.invalidEmail ? 'input-error' : ''}
                  required
                />
              </div>

              <p className="helper-text">
                Obs.: vc deve inserir o e-mail cadastrado no sistema.
              </p>

              {errors.invalidEmail && (
                <span className="error-message">
                  Insira um e-mail válido.
                </span>
              )}
            </div>

            {/* BOTÃO */}
            <button
              type="submit"
              className="submit-btn"
              disabled={isButtonDisabled}
            >
              enviar e-mail pra recuperar senha
            </button>

          </form>

        </section>
      </main>

    </div>
  );
};

export default RecoverPassword;
import React, { useState, useEffect } from 'react';
import './RecoverPassword.css';
import { FaArrowLeft } from "react-icons/fa";

const RecuperarSenha = () => {

  // Estado do formulário (mesmo padrão)
  const [formData, setFormData] = useState({
    email: '',
  });

  // Estado de erro
  const [errors, setErrors] = useState({
    invalidEmail: false,
  });

  // Controle do botão
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);

  // Regex de validação de e-mail
  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  // Validação (igual ao AlterarSenha)
  useEffect(() => {
    const { email } = formData;

    const isValid = validateEmail(email);

    setErrors({
      invalidEmail: email !== '' && !isValid,
    });

    const canSubmit = email && isValid;

    setIsButtonDisabled(!canSubmit);

  }, [formData]);

  // Atualização do input
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (isButtonDisabled) return;

    alert(`Link de recuperação enviado para: ${formData.email}`);
  };

  return (
    <div className="change-password-page">

      <main className="change-password-container">
        <section className="change-password-card">

          {/* HEADER */}
          <div className="card-header">
            <button 
              className="back-button"
              onClick={() => window.history.back()}
            >
              <FaArrowLeft size={20}/>
            </button>

            <h1>Recupere sua senha</h1>
          </div>

          <p className="card-header-p">
            Insira seu e-mail para receber o link de recuperação.
          </p>

          <form onSubmit={handleSubmit} noValidate>

            {/* EMAIL */}
            <div className="form-group">
              <label htmlFor="email" style={{ textAlign: "left" }}>
                E-mail
              </label>

              <div className="input-wrapper">
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Insira seu e-mail aqui"
                  className={errors.invalidEmail ? 'input-error' : ''}
                  required
                />
              </div>

              <p className="helper-text">
                Obs.: vc deve inserir o e-mail cadastrado no sistema.
              </p>

              {errors.invalidEmail && (
                <span className="error-message">
                  Insira um e-mail válido.
                </span>
              )}
            </div>

            {/* BOTÃO */}
            <button
              type="submit"
              className="submit-btn"
              disabled={isButtonDisabled}
            >
              enviar e-mail pra recuperar senha
            </button>

          </form>

        </section>
      </main>

    </div>
  );
};

export default RecuperarSenha;
