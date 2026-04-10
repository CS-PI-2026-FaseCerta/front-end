import React, { useState } from "react";
import { Link } from 'react-router-dom';
import "./CadastroUsuario.css";

export default function CadastroUsuario() {
    const [form, setForm] = useState({
        email: "",
        username: "",
        password: "",
        confirm: "",
    });

    const [showPass, setShowPass] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    const isMatch = form.password === form.confirm;
    const allFilled =
        form.email && form.username && form.password && form.confirm && isMatch;

    function updateField(e) {
        setForm({ ...form, [e.target.name]: e.target.value });
    }

    return (
        <div className="cadastro-wrapper">
            {/* NAVBAR */}
            <nav className="cadastro-navbar">
                <div className="cadastro-logo">FaseCerta</div>
            </nav>

            {/* MAIN */}
            <main className="cadastro-main">
                <div className="cadastro-card">
                    <h1>Crie sua conta</h1>
                    <p className="cadastro-subtitle">Insira seus dados para começar</p>

                    <form className="cadastro-form">
                        {/* EMAIL */}
                        <div className="cadastro-input-group">
                            <label>E-mail</label>
                            <input
                                type="email"
                                name="email"
                                placeholder="seu@email.com"
                                value={form.email}
                                onChange={updateField}
                            />
                        </div>

                        {/* USERNAME */}
                        <div className="cadastro-input-group">
                            <label>Nome de Usuário</label>
                            <input
                                type="text"
                                name="username"
                                placeholder="Como quer ser chamado?"
                                value={form.username}
                                onChange={updateField}
                            />
                        </div>

                        {/* SENHA */}
                        <div className="cadastro-input-group">
                            <label>Senha</label>
                            <div className="cadastro-input-wrapper">
                                <input
                                    type={showPass ? "text" : "password"}
                                    name="password"
                                    value={form.password}
                                    onChange={updateField}
                                />
                                <i
                                    className={`far ${showPass ? "fa-eye-slash" : "fa-eye"} cadastro-eye`}
                                    onClick={() => setShowPass(!showPass)}
                                ></i>
                            </div>
                        </div>

                        {/* CONFIRMAR SENHA */}
                        <div className="cadastro-input-group">
                            <label>Confirme sua senha</label>
                            <div className="cadastro-input-wrapper">
                                <input
                                    type={showConfirm ? "text" : "password"}
                                    name="confirm"
                                    value={form.confirm}
                                    onChange={updateField}
                                    style={{
                                        border: form.confirm && !isMatch ? "1px solid #e53e3e" : "",
                                    }}
                                />
                                <i
                                    className={`far ${showConfirm ? "fa-eye-slash" : "fa-eye"} cadastro-eye`}
                                    onClick={() => setShowConfirm(!showConfirm)}
                                ></i>
                            </div>

                            <span
                                className="cadastro-info-text"
                                style={{
                                    color: form.confirm && !isMatch ? "#e53e3e" : "var(--text-secondary)",
                                }}
                            >
                                <i className={form.confirm && !isMatch ? "fas fa-times-circle" : "fas fa-info-circle"}></i>
                                {form.confirm && !isMatch
                                    ? " As senhas não coincidem!"
                                    : " As senhas devem coincidir para prosseguir."}
                            </span>
                        </div>

                        {/* BOTÃO */}
                        <button className="cadastro-btn" disabled={!allFilled}>
                            Criar conta!
                        </button>
                    </form>

                    <div className="cadastro-login-link">
                        <p>
                            Já tem conta? <Link to="/login">Entre Aqui</Link>
                        </p>
                    </div>
                </div>
            </main>

            {/* FOOTER */}
            <footer className="cadastro-footer">
                <div className="footer-left">
                    <span>FaseCerta © 2026</span>
                </div>
                <div className="footer-right">
                    <a href="#">Suporte</a>
                    <a href="#">Termos de Uso</a>
                    <a href="#">Política de Privacidade</a>
                </div>
            </footer>
        </div>
    );
}