import { useState } from "react";
import "./RegistrationForm.css";

const ESTADOS_BR = [
  "AC","AL","AP","AM","BA","CE","DF","ES","GO","MA","MT","MS","MG",
  "PA","PB","PR","PE","PI","RJ","RN","RS","RO","RR","SC","SP","SE","TO"
];

export default function RegistrationForm({ onBack, onSubmit }) {
  const [tipo, setTipo] = useState("PF");

  return (
    <div className="App">
      {/* Header — usa classe do App.css */}
      <header className="page-header">
        <span className="logo">FaseCerta</span>
        <button className="theme-toggle" aria-label="Alternar tema">🌙</button>
      </header>

      {/* Conteúdo central — usa classe do App.css */}
      <main className="main-content">
        <div className="form-card">
          <div className="form-card-header">
            <button className="back-btn" onClick={onBack} aria-label="Voltar">←</button>
            <div>
              <h1 className="form-title">
                Cadastrar Cliente ({tipo === "PF" ? "PF" : "PJ"})
              </h1>
              <p className="form-subtitle">
                {tipo === "PF"
                  ? "Insira as informações do cliente para registro no sistema."
                  : "Insira as informações da empresa para registro no sistema."}
              </p>
            </div>
          </div>

          <div className="toggle-group">
            <button
              className={`toggle-btn ${tipo === "PF" ? "active" : ""}`}
              onClick={() => setTipo("PF")}
            >
              Pessoa Física
            </button>
            <button
              className={`toggle-btn ${tipo === "PJ" ? "active" : ""}`}
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

      {/* Footer — usa classes do App.css */}
      <footer className="page-footer">
        <div>
          <div className="logo">FaseCerta</div>
          <div>© 2024 FaseCerta.</div>
        </div>
        <nav className="footer-links">
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

  return (
    <div className="form-fields">
      <div className="field">
        <label className="field-label">Nome Completo</label>
        <input className="field-input" placeholder="Digite o nome completo"
          value={form.nomeCompleto} onChange={set("nomeCompleto")} />
      </div>

      <div className="field-row">
        <div className="field">
          <label className="field-label">CPF</label>
          <input className="field-input" placeholder="000.000.000-00"
            value={form.cpf} onChange={set("cpf")} maxLength={14} />
        </div>
        <div className="field">
          <label className="field-label">Telefone/WhatsApp</label>
          <input className="field-input" placeholder="(00) 00000-0000"
            value={form.telefone} onChange={set("telefone")} maxLength={15} />
        </div>
      </div>

      <div className="field">
        <label className="field-label">CEP</label>
        <div className="field-with-btn">
          <input className="field-input" placeholder="00000-000"
            value={form.cep} onChange={set("cep")} maxLength={9} />
          <button className="buscar-btn" onClick={buscarCep} disabled={loadingCep}>
            {loadingCep ? "..." : "Buscar"}
          </button>
        </div>
      </div>

      <div className="field">
        <label className="field-label">Endereço (Rua)</label>
        <input className="field-input" placeholder="Nome da rua ou avenida"
          value={form.endereco} onChange={set("endereco")} />
      </div>

      <div className="field-row">
        <div className="field field--small">
          <label className="field-label">Número</label>
          <input className="field-input" placeholder="123"
            value={form.numero} onChange={set("numero")} />
        </div>
        <div className="field">
          <label className="field-label">Complemento</label>
          <input className="field-input" placeholder="Apto, Bloco, etc."
            value={form.complemento} onChange={set("complemento")} />
        </div>
      </div>

      <div className="field">
        <label className="field-label">Bairro</label>
        <input className="field-input" placeholder="Nome do bairro"
          value={form.bairro} onChange={set("bairro")} />
      </div>

      <div className="field-row">
        <div className="field">
          <label className="field-label">Cidade</label>
          <input className="field-input" placeholder="Ex: São Paulo"
            value={form.cidade} onChange={set("cidade")} />
        </div>
        <div className="field field--estado">
          <label className="field-label">Estado</label>
          <select className="field-input field-select" value={form.estado} onChange={set("estado")}>
            <option value="">UF</option>
            {ESTADOS_BR.map((uf) => <option key={uf} value={uf}>{uf}</option>)}
          </select>
        </div>
      </div>

      <button className="submit-btn" onClick={() => onSubmit?.({ tipo: "PF", ...form })}>
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

  return (
    <div className="form-fields">
      <div className="field">
        <label className="field-label">Razão Social</label>
        <input className="field-input" placeholder="Nome empresarial completo"
          value={form.razaoSocial} onChange={set("razaoSocial")} />
      </div>

      <div className="field-row">
        <div className="field">
          <label className="field-label">CNPJ</label>
          <input className="field-input" placeholder="00.000.000/0000-00"
            value={form.cnpj} onChange={set("cnpj")} maxLength={18} />
        </div>
        <div className="field">
          <label className="field-label">CEP</label>
          <div className="field-with-btn">
            <input className="field-input" placeholder="00000-000"
              value={form.cep} onChange={set("cep")} maxLength={9} />
            <button className="buscar-btn" onClick={buscarCep} disabled={loadingCep}>
              {loadingCep ? "..." : "Buscar"}
            </button>
          </div>
        </div>
      </div>

      <div className="field">
        <label className="field-label">Endereço</label>
        <input className="field-input" placeholder="Rua, número e complemento"
          value={form.endereco} onChange={set("endereco")} />
      </div>

      <div className="field-row">
        <div className="field">
          <label className="field-label">Bairro</label>
          <input className="field-input" placeholder="Ex: Centro"
            value={form.bairro} onChange={set("bairro")} />
        </div>
        <div className="field">
          <label className="field-label">Cidade</label>
          <input className="field-input" placeholder="Cidade"
            value={form.cidade} onChange={set("cidade")} />
        </div>
        <div className="field field--estado">
          <label className="field-label">Estado</label>
          <select className="field-input field-select" value={form.estado} onChange={set("estado")}>
            <option value="">UF</option>
            {ESTADOS_BR.map((uf) => <option key={uf} value={uf}>{uf}</option>)}
          </select>
        </div>
      </div>

      <div className="field-row">
        <div className="field">
          <label className="field-label">Telefone/WhatsApp</label>
          <input className="field-input" placeholder="(00) 00000-0000"
            value={form.telefone} onChange={set("telefone")} maxLength={15} />
        </div>
        <div className="field">
          <label className="field-label">Inscrição Estadual</label>
          <input className="field-input" placeholder="Isento ou Número"
            value={form.inscricaoEstadual} onChange={set("inscricaoEstadual")} />
        </div>
      </div>

      <div className="field">
        <label className="field-label">Inscrição Municipal</label>
        <input className="field-input" placeholder="Número da inscrição"
          value={form.inscricaoMunicipal} onChange={set("inscricaoMunicipal")} />
      </div>

      <div className="field">
        <label className="field-label">Anotações</label>
        <textarea className="field-input field-textarea"
          placeholder="Informações adicionais relevantes..."
          value={form.anotacoes} onChange={set("anotacoes")} rows={4} />
      </div>

      <button className="submit-btn" onClick={() => onSubmit?.({ tipo: "PJ", ...form })}>
        CADASTRAR EMPRESA
      </button>
    </div>
  );
}