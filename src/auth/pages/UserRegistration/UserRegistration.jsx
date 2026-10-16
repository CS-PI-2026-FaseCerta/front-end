import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../../authService.js";
import { getCurrentUser } from "../../session.js";
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
    const isAdmin = getCurrentUser()?.perfil === "admin";

    const [form, setForm] = useState({
        email: "",
        username: "",
        password: "",
        confirm: "",
        perfil: isAdmin ? "GESTOR" : "TECNICO",
    });

    const [showPass, setShowPass] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    const [emailError, setEmailError] = useState(false);

    const [isLoading, setIsLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");
    const [submitError, setSubmitError] = useState("");

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
        form.password.length >= 6 &&
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!allFilled) return;
        setIsLoading(true);
        setSubmitError("");
        setSuccessMessage("");
        try {
            await registerUser({
                username: form.username,
                email: form.email,
                password: form.password,
                perfil: form.perfil,
            });
            setSuccessMessage("Usuário cadastrado com sucesso!");
            setForm({ email: "", username: "", password: "", confirm: "", perfil: isAdmin ? "GESTOR" : "TECNICO" });
        } catch (error) {
            setSubmitError(error.status === 403
                ? "Você não tem permissão para cadastrar esse perfil."
                : error.status === 409
                ? "Este e-mail já está cadastrado."
                : error.response
                ? error.message || "Não foi possível cadastrar o usuário."
                : "Não foi possível conectar ao servidor.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="auth-page page-container">
            <Header />

            <main className="login-container">
                <div className="login-card">
                    <div className="auth-card-header">
                        <button
                            onClick={() => navigate(-1)}
                            className="auth-back-button"
                            aria-label="Voltar"
                        >
                            <FaArrowLeft size={18} />
                        </button>
                        <h2 className="auth-title login-card__title">Cadastrar usuário</h2>
                    </div>
                    <p className="auth-subtitle login-card__subtitle">
                        Adicione um usuário ao sistema com o perfil permitido pela sua conta.
                    </p>

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

                        <div className="input-group">
                            <label className="form-label" htmlFor="perfil">Perfil de acesso</label>
                            <select
                                id="perfil"
                                name="perfil"
                                className="form-input"
                                value={form.perfil}
                                onChange={updateField}
                                disabled={isLoading}
                            >
                                {isAdmin && <option value="GESTOR">Gestor</option>}
                                <option value="TECNICO">Técnico</option>
                            </select>
                        </div>
                        {submitError && <p className="form-error" role="alert">{submitError}</p>}
                        <p className="form-text">A senha deve ter pelo menos 6 caracteres.</p>
                        {/* MENSAGEM DE SUCESSO */}
                        {successMessage && <p className="form-success">{successMessage}</p>}

                        <button type="submit" className="form-button" disabled={!allFilled}>
                            {isLoading ? "Cadastrando..." : "Criar conta!"}
                        </button>

                        <p className="auth-footer-text signup-link">
                            <Link to={AppRoutes.Dashboard} className="auth-link">Voltar ao painel</Link>
                        </p>
                    </form>
                </div>
            </main>
            <Footer />
        </div>
    );
}