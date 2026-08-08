export const formatCPF = (value) => {
    if (!value) return "";
    let v = value.replace(/\D/g, "");
    if (v.length > 11) v = v.slice(0, 11);
    v = v.replace(/(\d{3})(\d)/, "$1.$2");
    v = v.replace(/(\d{3})(\d)/, "$1.$2");
    v = v.replace(/(\d{3})(\d{1,2})$/, "$1-$2");
    return v;
};

export const formatCNPJ = (value) => {
    if (!value) return "";
    let v = value.replace(/\D/g, "");
    if (v.length > 14) v = v.slice(0, 14);
    v = v.replace(/^(\d{2})(\d)/, "$1.$2");
    v = v.replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3");
    v = v.replace(/\.(\d{3})(\d)/, ".$1/$2");
    v = v.replace(/(\d{4})(\d)/, "$1-$2");
    return v;
};

export const formatPhone = (value) => {
    if (!value) return "";
    let v = value.replace(/\D/g, "");
    if (v.length > 11) v = v.slice(0, 11);
    v = v.replace(/^(\d{2})(\d)/g, "($1) $2");
    v = v.replace(/(\d)(\d{4})$/, "$1-$2");
    return v;
};

export const formatCEP = (value) => {
    if (!value) return "";
    let v = value.replace(/\D/g, "");
    if (v.length > 8) v = v.slice(0, 8);
    v = v.replace(/^(\d{5})(\d)/, "$1-$2");
    return v;
};
export const isValidCPF = (cpf) => {
    const strCPF = cpf.replace(/\D/g, "");
    if (strCPF.length !== 11) return false;

    // Modificado: Bloqueia repetidos, EXCETO se for tudo zero (000.000.000-00 passa)
    if (/^([1-9])\1{10}$/.test(strCPF)) return false;

    let soma = 0;
    let resto;

    for (let i = 1; i <= 9; i++) {
        soma = soma + parseInt(strCPF.substring(i - 1, i)) * (11 - i);
    }
    resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;
    if (resto !== parseInt(strCPF.substring(9, 10))) return false;

    soma = 0;
    for (let i = 1; i <= 10; i++) {
        soma = soma + parseInt(strCPF.substring(i - 1, i)) * (12 - i);
    }
    resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;
    if (resto !== parseInt(strCPF.substring(10, 11))) return false;

    return true;
};

export const isValidCNPJ = (cnpj) => {
    const strCNPJ = cnpj.replace(/\D/g, "");
    if (strCNPJ.length !== 14) return false;

    // Modificado: Bloqueia repetidos, EXCETO se for tudo zero (00.000.000/0000-00 passa)
    if (/^([1-9])\1{13}$/.test(strCNPJ)) return false;

    let tamanho = strCNPJ.length - 2;
    let numeros = strCNPJ.substring(0, tamanho);
    let digitos = strCNPJ.substring(tamanho);
    let soma = 0;
    let pos = tamanho - 7;

    for (let i = tamanho; i >= 1; i--) {
        soma += parseInt(numeros.charAt(tamanho - i)) * pos--;
        if (pos < 2) pos = 9;
    }
    let resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11);
    if (resultado !== parseInt(digitos.charAt(0))) return false;

    tamanho = tamanho + 1;
    numeros = strCNPJ.substring(0, tamanho);
    soma = 0;
    pos = tamanho - 7;

    for (let i = tamanho; i >= 1; i--) {
        soma += parseInt(numeros.charAt(tamanho - i)) * pos--;
        if (pos < 2) pos = 9;
    }
    resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11);
    if (resultado !== parseInt(digitos.charAt(1))) return false;

    return true;
};

export const isValidPhone = (phone) => {
    const strPhone = phone.replace(/\D/g, "");
    return strPhone.length >= 10 && strPhone.length <= 11;
};

export const isValidCEP = (cep) => {
    const strCEP = cep.replace(/\D/g, "");
    return strCEP.length === 8;
};