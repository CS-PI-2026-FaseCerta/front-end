
import BaseService from "../BaseService";
import {
  mapCustomerListResponse,
  mapCustomerFromApi,
  mapCustomerToApi,
} from "./customerMapper";

const isDocumentSearch = (value) => /^[\d.\-/\s]+$/.test(value);

class CustomersService extends BaseService {
  constructor() {
    super("/api/clientes");
  }

  async listCustomers({ page = 1, limit = 10, nome, documento } = {}) {
    const params = { page, limit };

    if (nome?.trim()) params.nome = nome.trim();
    if (documento?.trim()) params.documento = documento.replace(/\D/g, "");

    const response = await this.api.get(this.endPoint, { params });
    return mapCustomerListResponse(response.data);
  }

  async getCustomerById(id) {
    const response = await this.api.get(`${this.endPoint}/${id}`);
    return { ...response.data, ...mapCustomerFromApi(response.data) };
  }

  async createCustomer(data) {
    const response = await this.api.post(this.endPoint, mapCustomerToApi(data, data.tipo));
    return mapCustomerFromApi(response.data);
  }

  async updateCustomer(id, data) {
    const response = await this.api.patch(`${this.endPoint}/${id}`, mapCustomerToApi(data, data.tipo));
    return mapCustomerFromApi(response.data);
  }

  async deleteCustomer(id) {
    return this.api.delete(`${this.endPoint}/${id}`);
  }

  buildSearchParams(searchTerm) {
    const value = String(searchTerm ?? "").trim();
    if (!value) return {};
    return isDocumentSearch(value) ? { documento: value } : { nome: value };
  }
}

const customersService = new CustomersService();

export default customersService;
