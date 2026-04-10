import React, { useState, useEffect } from "react";
import "./CadastroUsuario.css";

export default function CadastroUsuario() {

    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirm, setConfirm] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [match, setMatch] = useState(true);
    const [allFilled, setAllFilled] = useState(false);

    useEffect(() => {
        setMatch(password === confirm);
    }, [password, confirm]);

    useEffect(() => {
        setAllFilled(
            email.trim() &&
            username.trim() &&
            password.trim() &&
            confirm.trim() &&
            match
        );
    }, [email, username, password, confirm, match]);

    function handleSubmit(e) {
        e.preventDefault();
        alert("Cadastro enviado com sucesso!");
    }

    return (
        <>
            {/* NAVBAR */}
            <nav className="navbar">
                <div className="logo">FaseCerta</div>
            </nav>

            <main className="main-content">
                <div className="card">
                    <h1>Crie sua conta</h1>
                    <p className="subtitle">Insira seus dados para começar</p>

                    <form onSubmit={handleSubmit}>

                        {/* EMAIL */}
                        <div className="input-group">
                            <label htmlFor="email">E-mail</label>
                            <input
                                type="email"
                                id="email"
                                placeholder="seu@email.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>

                        {/* USERNAME */}
                        <div className="input-group">
                            <label htmlFor="username">Nome de Usuário</label>
                            <input
                                type="text"
                                id="username"
                                placeholder="Como quer ser chamado?"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                            />
                        </div>

                        {/* SENHA */}
                        <div className="input-group">
                            <label htmlFor="password">Senha</label>
                            <div className="input-wrapper">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    id="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                                <i
                                    className={`far ${showPassword ? "fa-eye-slash" : "fa-eye"} toggle-password`}
                                    onClick={() => setShowPassword(!showPassword)}
                                ></i>
                            </div>
                        </div>

                        {/* CONFIRMAR SENHA */}
                        <div className="input-group">
                            <label htmlFor="confirm-password">Confirme sua senha</label>
                            <div className="input-wrapper">
                                <input
                                    type={showConfirm ? "text" : "password"}
                                    id="confirm-password"
                                    value={confirm}
                                    onChange={(e) => setConfirm(e.target.value)}
                                    style={{
                                        border: confirm.length > 0 && !match
                                            ? "1px solid var(--error-color)"
                                            : "1px solid transparent"
                                    }}
                                />
                                <i
                                    className={`far ${showConfirm ? "fa-eye-slash" : "fa-eye"} toggle-password`}
                                    onClick={() => setShowConfirm(!showConfirm)}
                                ></i>
                            </div>

                            <span
                                className="info-text"
                                style={{
                                    color: confirm.length > 0 && !match
                                        ? "var(--error-color)"
                                        : "var(--text-secondary)"
                                }}
                            >
                                {confirm.length > 0 && !match ? (
                                    <>
                                        <i className="fas fa-times-circle"></i>
                                        As senhas não coincidem!
                                    </>
                                ) : (
                                    <>
                                        <i className="fas fa-info-circle"></i>
                                        As senhas devem coincidir para prosseguir.
                                    </>
                                )}
                            </span>
                        </div>

                        <button type="submit" className="btn-primary" disabled={!allFilled}>
                            Criar conta!
                        </button>

                    </form>

                    <div className="login-link">
                        <p>Já tem conta? <a href="#">Entre Aqui</a></p>
                    </div>
                </div>
            </main>

            <footer className="footer">
                <div className="footer-left">
                    <span>FaseCerta © 2026</span>
                </div>
                <div className="footer-right">
                    <a href="#">Suporte</a>
                    <a href="#">Termos de Uso</a>
                    <a href="#">Política de Privacidade</a>
                </div>
            </footer>
        </>
    );
}