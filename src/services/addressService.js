export async function getAddressByCep(cep) {
    const cleanCep = cep.replace(/\D/g, "");
    if (cleanCep.length !== 8) {
        throw new Error("CEP inválido");
    }

    try {
        const response = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`);
        if (!response.ok) {
            throw new Error("Erro na comunicação com o ViaCEP");
        }

        const data = await response.json();

        if (data.erro) {
            throw new Error("CEP não encontrado");
        }

        return {
            logradouro: data.logradouro || "",
            bairro: data.bairro || "",
            localidade: data.localidade || "",
            uf: data.uf || "",
        };
    } catch (error) {
        throw new Error(error.message || "Falha ao buscar CEP");
    }
}