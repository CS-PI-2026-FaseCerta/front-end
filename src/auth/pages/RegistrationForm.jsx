import React, { useState } from "react";
import "./cadastrarcliente.css";
import { FaArrowLeft } from "react-icons/fa";

const CadastrarCliente = () => {


  const [formData, setFormData] = useState({
    nome: "",
    cpf: "",
    telefone: "",
    cep: "",
    rua: "",
    numero: "",
    complemento: "",
    bairro: "",
    cidade: "",
    estado: ""
  });

  
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };


  const handleSubmit = (e) => {
    e.preventDefault();

    console.log("Dados do cliente:", formData);
    alert("Cliente cadastrado! (simulação)");
  };

  return (
    <div className="page">

      <header className="page-header">
        <div className="logo">FaseCerta</div>
      </header>

      <main className="main-content">

        <section className="card">

          <div className="card-header">
            <button
              className="back-button"
              onClick={() => window.history.back()}
            >
              <FaArrowLeft size={18} />
            </button>

            <h1>Cadastrar Cliente (PF)</h1>
          </div>

          <p className="subtitle">
            Insira as informações do cliente para registro no sistema.
          </p>

          <div className="toggle">
            <button className="active">Pessoa Física</button>
            <button>Pessoa Jurídica</button>
          </div>

          <form className="form" onSubmit={handleSubmit}>

            <input
              name="nome"
              placeholder="Digite o nome completo"
              value={formData.nome}
              onChange={handleChange}
              required
            />

            <div className="row">
              <input
                name="cpf"
                placeholder="000.000.000-00"
                value={formData.cpf}
                onChange={handleChange}
              />

              <input
                name="telefone"
                placeholder="(00) 00000-0000"
                value={formData.telefone}
                onChange={handleChange}
              />
            </div>

            {/* CEP + BOTÃO */}
            <div className="row">
              <input
                name="cep"
                placeholder="00000-000"
                value={formData.cep}
                onChange={handleChange}
              />

              <button type="button" className="btn-secondary">
                Buscar
              </button>
            </div>

            <input
              name="rua"
              placeholder="Nome da rua ou avenida"
              value={formData.rua}
              onChange={handleChange}
            />

            <div className="row">
              <input
                name="numero"
                placeholder="123"
                value={formData.numero}
                onChange={handleChange}
              />

              <input
                name="complemento"
                placeholder="Apto, bloco, etc"
                value={formData.complemento}
                onChange={handleChange}
              />
            </div>

            <input
              name="bairro"
              placeholder="Nome do bairro"
              value={formData.bairro}
              onChange={handleChange}
            />

            <div className="row">
              <input
                name="cidade"
                placeholder="Ex: São Paulo"
                value={formData.cidade}
                onChange={handleChange}
              />

              <select
                name="estado"
                value={formData.estado}
                onChange={handleChange}
              >
                <option value="">UF</option>
                <option value="PR">PR</option>
                <option value="SP">SP</option>
                <option value="RJ">RJ</option>
                <option value="SC">SC</option>
                <option value="RS">RS</option>
              </select>
            </div>

            <button type="submit" className="submit-btn">
              CADASTRAR CLIENTE
            </button>

          </form>

        </section>

      </main>

      <footer className="page-footer">
        <div>© 2024 FaseCerta</div>

        <div className="footer-links">
          <a href="#">Suporte</a>
          <a href="#">Termos de Uso</a>
          <a href="#">Política de Privacidade</a>
        </div>
      </footer>

    </div>
  );
};

export default CadastrarCliente;
