import React, { useState } from "react";
import { Link } from 'react-router-dom';
import { FaEye, FaEyeSlash } from "react-icons/fa";
import Footer from "../../global/components/Footer/Footer.jsx";
import Header from "../../global/components/Header/Header.jsx";
import "./login.css";

export default function CadastroUsuario() {
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

    const allFilled = form.email && form.username && form.password && form.confirm && isMatch && !emailError && !isLoading;

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
            setIsLoading(true); // Começa o carregamento
            setSuccessMessage("");

            console.log("Iniciando cadastro...", form);

            // Simulação de chamada de API (2 segundos)
            setTimeout(() => {
                setIsLoading(false); // Para o carregamento
                setSuccessMessage("Cadastro realizado com sucesso!");

            }, 2000);
        }
    };

    return (
        <div className="page-container">
            <Header />

            <main className="login-container">
                <div className="login-card">
                    <h2 className="login-card__title">Crie sua conta</h2>
                    <p className="login-card__subtitle">Insira seus dados para começar</p>

                    <form onSubmit={handleSubmit} noValidate>

                        <div className="input-group">
                            <label htmlFor="email">E-mail</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                className={`input-field ${emailError ? "input-error" : ""}`}
                                placeholder="seu@email.com"
                                value={form.email}
                                onChange={updateField}
                                onBlur={handleEmailBlur}
                                disabled={isLoading}
                            />
                            {emailError && (
                                <p className="login-error-message" style={{ marginTop: "8px", textAlign: "left" }}>
                                    E-mail inválido!
                                </p>
                            )}
                        </div>

                        <div className="input-group">
                            <label htmlFor="username">Nome de Usuário</label>
                            <input
                                type="text"
                                id="username"
                                name="username"
                                className="input-field"
                                placeholder="Como quer ser chamado?"
                                value={form.username}
                                onChange={updateField}
                                disabled={isLoading}
                            />
                        </div>

                        <div className="input-group">
                            <label htmlFor="password">Senha</label>
                            <div className="input-wrapper">
                                <input
                                    type={showPass ? "text" : "password"}
                                    id="password"
                                    name="password"
                                    className="input-field"
                                    placeholder="••••••••••"
                                    value={form.password}
                                    onChange={updateField}
                                    disabled={isLoading}
                                />
                                <span className="password-icon" onClick={() => !isLoading && setShowPass(!showPass)}>
                                    {showPass ? <FaEyeSlash /> : <FaEye />}
                                </span>
                            </div>
                        </div>

                        <div className="input-group">
                            <label htmlFor="confirm">Confirme sua senha</label>
                            <div className="input-wrapper">
                                <input
                                    type={showConfirm ? "text" : "password"}
                                    id="confirm"
                                    name="confirm"
                                    className={`input-field ${form.confirm && !isMatch ? "input-error" : ""}`}
                                    placeholder="••••••••••"
                                    value={form.confirm}
                                    onChange={updateField}
                                    disabled={isLoading}
                                />
                                <span className="password-icon" onClick={() => !isLoading && setShowConfirm(!showConfirm)}>
                                    {showConfirm ? <FaEyeSlash /> : <FaEye />}
                                </span>
                            </div>

                            {form.confirm && !isMatch && (
                                <p className="login-error-message" style={{ marginTop: "8px", textAlign: "left" }}>
                                    As senhas não coincidem!
                                </p>
                            )}
                        </div>

                        {/* MENSAGEM DE SUCESSO */}
                        {successMessage && (
                            <p style={{ color: "#28a745", marginTop: "10px", textAlign: "center", fontWeight: "bold" }}>
                                {successMessage}
                            </p>
                        )}

                        <button
                            type="submit"
                            className="login-button"
                            disabled={!allFilled}
                            style={{ marginTop: "1rem" }}
                        >
                            {isLoading ? "Cadastrando..." : "Criar conta!"}
                        </button>

                        <p className="signup-link">
                            Já tem conta? <Link to="/login" style={{ pointerEvents: isLoading ? "none" : "auto" }}>Entre Aqui</Link>
                        </p>
                    </form>
                </div>
            </main>

            <Footer />
        </div>
    );
}