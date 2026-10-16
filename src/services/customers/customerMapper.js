const toDigits = (value) =>
  String(value ?? "").replace(/\D/g, "");

const firstValue = (...values) =>
  values.find(
    (value) =>
      value !== undefined &&
      value !== null &&
      value !== ""
  ) ?? "";

/**
 * Converte um cliente retornado pela API
 * para o formato utilizado pela listagem.
 */
export const mapCustomerFromApi = (customer = {}) => {
  const tipoPessoa = firstValue(
    customer.tipoPessoa,
    customer.tipo_pessoa,
    customer.tipo
  );

  const isCompany = tipoPessoa === "PJ";

  const document = firstValue(
    isCompany ? customer.cnpj : customer.cpf,
    customer.documento,
    customer.cpfCnpj,
    customer.cpf_cnpj
  );

  return {
    id: customer.id,

    name: firstValue(
      customer.nomeCompleto,
      customer.razaoSocial,
      customer.nome,
      customer.nome_completo,
      customer.razao_social,
      customer.name
    ),

    cpfCnpj: document,

    telefone: firstValue(
      customer.telefone,
      customer.phone
    ),

    tipo: tipoPessoa,
  };
};

/**
 * Normaliza a resposta paginada da API.
 *
 * O backend atual retorna:
 * {
 *   items: [],
 *   total,
 *   page,
 *   limit,
 *   totalPages
 * }
 *
 * Mantemos também compatibilidade com outros
 * formatos já previstos anteriormente.
 */
export const mapCustomerListResponse = (response = {}) => {
  const items =
    response.items ??
    response.content ??
    response.data ??
    (Array.isArray(response) ? response : []);

  const totalItems =
    response.total ??
    response.totalElements ??
    response.totalItems ??
    items.length;

  return {
    items: Array.isArray(items)
      ? items.map(mapCustomerFromApi)
      : [],

    totalItems: Number(totalItems) || 0,
  };
};

/**
 * Converte o formulário para o contrato REAL
 * esperado pelo CustomerCreateRequest /
 * CustomerUpdateRequest do backend.
 */
export const mapCustomerToApi = (
  form = {},
  tipo = "PF"
) => {
  const payload = {
    // Backend espera camelCase:
    tipoPessoa: tipo,

    // PF
    nomeCompleto:
      tipo === "PF"
        ? form.nomeOuRazao?.trim()
        : undefined,

    cpf:
      tipo === "PF"
        ? toDigits(form.documento)
        : undefined,

    // PJ
    razaoSocial:
      tipo === "PJ"
        ? form.nomeOuRazao?.trim()
        : undefined,

    cnpj:
      tipo === "PJ"
        ? toDigits(form.documento)
        : undefined,

    // Campos comuns
    telefone: toDigits(form.telefone),

    /**
     * NÃO remover a máscara do CEP.
     *
     * O backend valida:
     * ^\d{5}-\d{3}$
     *
     * Exemplo correto:
     * 87700-000
     */
    cep: form.cep?.trim(),

    // Backend chama este campo de logradouro.
    logradouro: form.endereco?.trim(),

    numero: form.numero?.trim(),
    complemento: form.complemento?.trim(),
    bairro: form.bairro?.trim(),
    cidade: form.cidade?.trim(),
    estado: form.estado?.trim(),
    anotacoes: form.anotacoes?.trim(),
  };

  /**
   * Campos exclusivos de PJ.
   *
   * Não devem existir no payload de PF.
   */
  if (tipo === "PJ") {
    payload.inscEstadual =
      form.inscricaoEstadual?.trim();

    payload.inscMunicipal =
      form.inscricaoMunicipal?.trim();
  }

  /**
   * Remove somente undefined.
   *
   * Dessa forma campos incompatíveis com PF/PJ
   * realmente não são enviados.
   */
  return Object.fromEntries(
    Object.entries(payload).filter(
      ([, value]) => value !== undefined
    )
  );
};

/**
 * Converte a resposta de GET /api/clientes/:id
 * para o formato utilizado pelo formulário.
 */
export const mapCustomerToForm = (customer = {}) => {
  const tipo = firstValue(
    customer.tipoPessoa,
    customer.tipo_pessoa,
    customer.tipo,
    "PF"
  );

  const document =
    tipo === "PJ"
      ? firstValue(
          customer.cnpj,
          customer.documento,
          customer.cpfCnpj
        )
      : firstValue(
          customer.cpf,
          customer.documento,
          customer.cpfCnpj
        );

  return {
    id: customer.id,

    tipo,

    nomeOuRazao: firstValue(
      customer.nomeCompleto,
      customer.razaoSocial,
      customer.nome,
      customer.nome_completo,
      customer.razao_social,
      customer.name
    ),

    documento: document,

    telefone: firstValue(
      customer.telefone,
      customer.phone
    ),

    cep: firstValue(customer.cep),

    endereco: firstValue(
      customer.logradouro,
      customer.endereco
    ),

    numero: firstValue(customer.numero),

    complemento: firstValue(
      customer.complemento
    ),

    bairro: firstValue(customer.bairro),

    cidade: firstValue(
      customer.cidade,
      customer.localidade
    ),

    estado: firstValue(
      customer.estado,
      customer.uf
    ),

    inscricaoEstadual: firstValue(
      customer.inscEstadual,
      customer.inscricaoEstadual,
      customer.inscricao_estadual
    ),

    inscricaoMunicipal: firstValue(
      customer.inscMunicipal,
      customer.inscricaoMunicipal,
      customer.inscricao_municipal
    ),

    anotacoes: firstValue(
      customer.anotacoes
    ),
  };
};

export { toDigits };