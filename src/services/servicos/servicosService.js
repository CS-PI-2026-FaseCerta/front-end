import BaseService from "../BaseService";
import {
  mapServiceFromApi,
  mapServiceListResponse,
  mapServiceToApi,
} from "./servicosMapper";

class ServicosService extends BaseService {
  constructor() {
    super("/api/servicos");
  }

  async listServices({
    page = 1,
    limit = 10,
    nome,
    categoria,
    tipo_cobranca,
  } = {}) {
    const params = { page, limit };

    if (nome?.trim()) params.nome = nome.trim();
    if (categoria?.trim()) params.categoria = categoria.trim();
    if (tipo_cobranca === "REAL" || tipo_cobranca === "US") {
      params.tipo_cobranca = tipo_cobranca;
    }

    const response = await this.api.get(this.endPoint, { params });
    return mapServiceListResponse(response.data);
  }

  async getServiceById(id) {
    const response = await this.api.get(`${this.endPoint}/${id}`);
    return mapServiceFromApi(response.data);
  }

  async createService(data) {
    const response = await this.api.post(this.endPoint, mapServiceToApi(data));
    return mapServiceFromApi(response.data);
  }

  async updateService(id, data) {
    const response = await this.api.patch(`${this.endPoint}/${id}`, mapServiceToApi(data));
    return mapServiceFromApi(response.data);
  }

  async deleteService(id) {
    return this.api.delete(`${this.endPoint}/${id}`);
  }
}

const servicosService = new ServicosService();


export default servicosService;
