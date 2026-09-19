const toDigits = (value) => String(value ?? "").replace(/\D/g, "");

const firstValue = (...values) => values.find((value) => value !== undefined && value !== null && value !== "") ?? "";

export const mapCustomerFromApi = (customer = {}) => {
  const tipoPessoa = firstValue(customer.tipo_pessoa, customer.tipoPessoa, customer.tipo);
  const isCompany = tipoPessoa === "PJ";
  const document = firstValue(
    customer.documento,
    isCompany ? customer.cnpj : customer.cpf,
    customer.cpf_cnpj,
    customer.cpfCnpj,
  );

  return {
    id: customer.id,
    name: firstValue(customer.nome, customer.razao_social, customer.razaoSocial, customer.nome_completo, customer.name),
    cpfCnpj: document,
    telefone: firstValue(customer.telefone, customer.phone),
    tipo: tipoPessoa,
  };
};

export const mapCustomerListResponse = (response = {}) => {
  const items = response.content ?? response.items ?? response.data ?? (Array.isArray(response) ? response : []);
  const totalItems = response.totalElements ?? response.total ?? response.totalItems ?? items.length;

  return {
    items: Array.isArray(items) ? items.map(mapCustomerFromApi) : [],
    totalItems: Number(totalItems) || 0,
  };
};

export const mapCustomerToApi = (form = {}, tipo = "PF") => {
  const payload = {
    tipo_pessoa: tipo,
    nome: tipo === "PF" ? form.nomeOuRazao : undefined,
    razao_social: tipo === "PJ" ? form.nomeOuRazao : undefined,
    cpf: tipo === "PF" ? toDigits(form.documento) : undefined,
    cnpj: tipo === "PJ" ? toDigits(form.documento) : undefined,
    telefone: toDigits(form.telefone),
    cep: toDigits(form.cep),
    endereco: form.endereco,
    numero: form.numero,
    complemento: form.complemento,
    bairro: form.bairro,
    cidade: form.cidade,
    estado: form.estado,
    anotacoes: form.anotacoes,
  };

  if (tipo === "PJ") {
    payload.inscricao_estadual = form.inscricaoEstadual;
    payload.inscricao_municipal = form.inscricaoMunicipal;
  }

  return Object.fromEntries(Object.entries(payload).filter(([, value]) => value !== undefined));
};

export const mapCustomerToForm = (customer = {}) => {
  const tipo = customer.tipo_pessoa ?? customer.tipoPessoa ?? customer.tipo ?? "PF";
  const document = tipo === "PJ"
    ? firstValue(customer.cnpj, customer.documento, customer.cpfCnpj)
    : firstValue(customer.cpf, customer.documento, customer.cpfCnpj);

    return {
    id: customer.id,
    tipo,
    nomeOuRazao: firstValue(
      customer.nome,
      customer.razao_social,
      customer.razaoSocial,
      customer.nome_completo,
      customer.name
    ),
    documento: document,
    telefone: firstValue(customer.telefone, customer.phone),
    cep: firstValue(customer.cep),
    endereco: firstValue(customer.endereco, customer.logradouro),
    numero: firstValue(customer.numero),
    complemento: firstValue(customer.complemento),
    bairro: firstValue(customer.bairro),
    cidade: firstValue(customer.cidade, customer.localidade),
    estado: firstValue(customer.estado, customer.uf),
    inscricaoEstadual: firstValue(
      customer.inscricao_estadual,
      customer.inscricaoEstadual
    ),
    inscricaoMunicipal: firstValue(
      customer.inscricao_municipal,
      customer.inscricaoMunicipal
    ),
    anotacoes: firstValue(customer.anotacoes),
  };
};

export { toDigits };
