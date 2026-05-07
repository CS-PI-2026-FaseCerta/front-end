import { useState } from "react";
import "./RegistrationForm.css";

const ESTADOS_BR = [
  "AC","AL","AP","AM","BA","CE","DF","ES","GO","MA","MT","MS","MG",
  "PA","PB","PR","PE","PI","RJ","RN","RS","RO","RR","SC","SP","SE","TO"
];

export default function RegistrationForm({ onBack, onSubmit }) {
  const [tipo, setTipo] = useState("PF"); // "PF" ou "PJ"

  return (
    <div className="reg-page">
      <header className="reg-header">
        <span className="reg-brand">FaseCerta</span>
        <button className="reg-theme-toggle" aria-label="Alternar tema">🌙</button>
      </header>

      <main className="reg-main">
        <div className="reg-card">
          <div className="reg-card-header">
            <button className="reg-back-btn" onClick={onBack} aria-label="Voltar">←</button>
            <div>
              <h1 className="reg-title">
                Cadastrar Cliente ({tipo === "PF" ? "PF" : "PJ"})
              </h1>
              <p className="reg-subtitle">
                {tipo === "PF"
                  ? "Insira as informações do cliente para registro no sistema."
                  : "Insira as informações da empresa para registro no sistema."}
              </p>
            </div>
          </div>

          <div className="reg-toggle-group">
            <button
              className={`reg-toggle-btn ${tipo === "PF" ? "active" : ""}`}
              onClick={() => setTipo("PF")}
            >
              Pessoa Física
            </button>
            <button
              className={`reg-toggle-btn ${tipo === "PJ" ? "active" : ""}`}
              onClick={() => setTipo("PJ")}
            >
              Pessoa Jurídica
            </button>
          </div>

          {tipo === "PF" ? (
            <PessoaFisicaForm onSubmit={onSubmit} />
          ) : (
            <PessoaJuridicaForm onSubmit={onSubmit} />
          )}
        </div>
      </main>

      <footer className="reg-footer">
        <span className="reg-brand">FaseCerta</span>
        <p className="reg-footer-copy">© 2024 FaseCerta.</p>
        <nav className="reg-footer-links">
          <a href="#">Suporte</a>
          <a href="#">Termos de Uso</a>
          <a href="#">Política de Privacidade</a>
        </nav>
      </footer>
    </div>
  );
}

/* ─── Pessoa Física ─── */
function PessoaFisicaForm({ onSubmit }) {
  const [form, setForm] = useState({
    nomeCompleto: "", cpf: "", telefone: "", cep: "",
    endereco: "", numero: "", complemento: "", bairro: "",
    cidade: "", estado: "",
  });
  const [loadingCep, setLoadingCep] = useState(false);

  const set = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const buscarCep = async () => {
    const cep = form.cep.replace(/\D/g, "");
    if (cep.length !== 8) return;
    setLoadingCep(true);
    try {
      const res = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
      const data = await res.json();
      if (!data.erro) {
        setForm((f) => ({
          ...f,
          endereco: data.logradouro || "",
          bairro: data.bairro || "",
          cidade: data.localidade || "",
          estado: data.uf || "",
        }));
      }
    } catch (_) {}
    setLoadingCep(false);
  };

  const handleSubmit = () => {
    onSubmit?.({ tipo: "PF", ...form });
  };

  return (
    <div className="reg-form">
      <div className="reg-field">
        <label className="reg-label">Nome Completo</label>
        <input className="reg-input" placeholder="Digite o nome completo"
          value={form.nomeCompleto} onChange={set("nomeCompleto")} />
      </div>

      <div className="reg-row">
        <div className="reg-field">
          <label className="reg-label">CPF</label>
          <input className="reg-input" placeholder="000.000.000-00"
            value={form.cpf} onChange={set("cpf")} maxLength={14} />
        </div>
        <div className="reg-field">
          <label className="reg-label">Telefone/WhatsApp</label>
          <input className="reg-input" placeholder="(00) 00000-0000"
            value={form.telefone} onChange={set("telefone")} maxLength={15} />
        </div>
      </div>

      <div className="reg-field">
        <label className="reg-label">CEP</label>
        <div className="reg-input-with-btn">
          <input className="reg-input" placeholder="00000-000"
            value={form.cep} onChange={set("cep")} maxLength={9} />
          <button className="reg-buscar-btn" onClick={buscarCep} disabled={loadingCep}>
            {loadingCep ? "..." : "Buscar"}
          </button>
        </div>
      </div>

      <div className="reg-field">
        <label className="reg-label">Endereço (Rua)</label>
        <input className="reg-input" placeholder="Nome da rua ou avenida"
          value={form.endereco} onChange={set("endereco")} />
      </div>

      <div className="reg-row">
        <div className="reg-field reg-field--small">
          <label className="reg-label">Número</label>
          <input className="reg-input" placeholder="123"
            value={form.numero} onChange={set("numero")} />
        </div>
        <div className="reg-field">
          <label className="reg-label">Complemento</label>
          <input className="reg-input" placeholder="Apto, Bloco, etc."
            value={form.complemento} onChange={set("complemento")} />
        </div>
      </div>

      <div className="reg-field">
        <label className="reg-label">Bairro</label>
        <input className="reg-input" placeholder="Nome do bairro"
          value={form.bairro} onChange={set("bairro")} />
      </div>

      <div className="reg-row">
        <div className="reg-field">
          <label className="reg-label">Cidade</label>
          <input className="reg-input" placeholder="Ex: São Paulo"
            value={form.cidade} onChange={set("cidade")} />
        </div>
        <div className="reg-field reg-field--estado">
          <label className="reg-label">Estado</label>
          <select className="reg-input reg-select" value={form.estado} onChange={set("estado")}>
            <option value="">UF</option>
            {ESTADOS_BR.map((uf) => <option key={uf} value={uf}>{uf}</option>)}
          </select>
        </div>
      </div>

      <button className="reg-submit-btn" onClick={handleSubmit}>
        CADASTRAR CLIENTE
      </button>
    </div>
  );
}

/* ─── Pessoa Jurídica ─── */
function PessoaJuridicaForm({ onSubmit }) {
  const [form, setForm] = useState({
    razaoSocial: "", cnpj: "", cep: "", endereco: "", bairro: "",
    cidade: "", estado: "", telefone: "", inscricaoEstadual: "",
    inscricaoMunicipal: "", anotacoes: "",
  });
  const [loadingCep, setLoadingCep] = useState(false);

  const set = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const buscarCep = async () => {
    const cep = form.cep.replace(/\D/g, "");
    if (cep.length !== 8) return;
    setLoadingCep(true);
    try {
      const res = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
      const data = await res.json();
      if (!data.erro) {
        setForm((f) => ({
          ...f,
          endereco: data.logradouro || "",
          bairro: data.bairro || "",
          cidade: data.localidade || "",
          estado: data.uf || "",
        }));
      }
    } catch (_) {}
    setLoadingCep(false);
  };

  const handleSubmit = () => {
    onSubmit?.({ tipo: "PJ", ...form });
  };

  return (
    <div className="reg-form">
      <div className="reg-field">
        <label className="reg-label">Razão Social</label>
        <input className="reg-input" placeholder="Nome empresarial completo"
          value={form.razaoSocial} onChange={set("razaoSocial")} />
      </div>

      <div className="reg-row">
        <div className="reg-field">
          <label className="reg-label">CNPJ</label>
          <input className="reg-input" placeholder="00.000.000/0000-00"
            value={form.cnpj} onChange={set("cnpj")} maxLength={18} />
        </div>
        <div className="reg-field">
          <label className="reg-label">CEP</label>
          <div className="reg-input-with-btn">
            <input className="reg-input" placeholder="00000-000"
              value={form.cep} onChange={set("cep")} maxLength={9} />
            <button className="reg-buscar-btn" onClick={buscarCep} disabled={loadingCep}>
              {loadingCep ? "..." : "Buscar"}
            </button>
          </div>
        </div>
      </div>

      <div className="reg-field">
        <label className="reg-label">Endereço</label>
        <input className="reg-input" placeholder="Rua, número e complemento"
          value={form.endereco} onChange={set("endereco")} />
      </div>

      <div className="reg-row">
        <div className="reg-field">
          <label className="reg-label">Bairro</label>
          <input className="reg-input" placeholder="Ex: Centro"
            value={form.bairro} onChange={set("bairro")} />
        </div>
        <div className="reg-field">
          <label className="reg-label">Cidade</label>
          <input className="reg-input" placeholder="Cidade"
            value={form.cidade} onChange={set("cidade")} />
        </div>
        <div className="reg-field reg-field--estado">
          <label className="reg-label">Estado</label>
          <select className="reg-input reg-select" value={form.estado} onChange={set("estado")}>
            <option value="">UF</option>
            {ESTADOS_BR.map((uf) => <option key={uf} value={uf}>{uf}</option>)}
          </select>
        </div>
      </div>

      <div className="reg-row">
        <div className="reg-field">
          <label className="reg-label">Telefone/WhatsApp</label>
          <input className="reg-input" placeholder="(00) 00000-0000"
            value={form.telefone} onChange={set("telefone")} maxLength={15} />
        </div>
        <div className="reg-field">
          <label className="reg-label">Inscrição Estadual</label>
          <input className="reg-input" placeholder="Isento ou Número"
            value={form.inscricaoEstadual} onChange={set("inscricaoEstadual")} />
        </div>
      </div>

      <div className="reg-field">
        <label className="reg-label">Inscrição Municipal</label>
        <input className="reg-input" placeholder="Número da inscrição"
          value={form.inscricaoMunicipal} onChange={set("inscricaoMunicipal")} />
      </div>

      <div className="reg-field">
        <label className="reg-label">Anotações</label>
        <textarea className="reg-input reg-textarea"
          placeholder="Informações adicionais relevantes..."
          value={form.anotacoes} onChange={set("anotacoes")} rows={4} />
      </div>

      <button className="reg-submit-btn" onClick={handleSubmit}>
        CADASTRAR EMPRESA
      </button>
    </div>
  );
}