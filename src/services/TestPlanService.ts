import axios, { AxiosError } from 'axios';

const BASE_URL = 'http://localhost:8080';

class TestPlanService {
  static async getAllTestPlan(): Promise<any> {
    return this.request('get', '/api/planoDeTeste');
  }

  static async addTestPlan(idTime: number, idTproduto: number, descPlano: string): Promise<any> {
    const data = {
      idTime,
      idTproduto,
      descPlano,
    };

    return this.request('post', '/api/planoDeTeste', data);
  }

  static async editTestPlan(idPlano: number, idTime: number, idTproduto: number, descPlano: string): Promise<any> {
    const url = `/api/planoDeTeste/${idPlano}`;

    const requestBody = {
      idTime,
      idTproduto,
      descPlano,
    };

    return this.request('put', url, requestBody);
  }

  static async deleteTestPlan(idPlano: number): Promise<void> {
    return this.request('delete', `/api/planoDeTeste/${idPlano}`);
  }

  static async searchTestPlan(searchValue?: string): Promise<any> {
    return this.request('get', `/api/planoDeTeste`, undefined, { descPlano: searchValue });
  }

  static async getTestPlansByProduct(searchValue?: string): Promise<any> {
    return this.request('get', `/api/planoDeTeste`, undefined, { idTproduto: searchValue });
  }

  static async getTestPlansById(searchValue?: string): Promise<any> {
    return this.request('get', `/api/planoDeTeste`, undefined, { idPlano: searchValue });
  }

  static async getTestPlansByTeam(searchValue?: string): Promise<any> {
    return this.request('get', `/api/planoDeTeste`, undefined, { idTime: searchValue });
  }

  private static async request(method: 'get' | 'post' | 'put' | 'delete', url: string, data?: any, params?: any): Promise<any> {
    try {
      const config: Record<string, any> = {
        method,
        url: `${BASE_URL}${url}`,
      };

      if (data && method !== 'get') {
        config.data = data;
      }

      if (params && method === 'get') {
        config.params = params;
      }

      const response = await axios(config);
      return response.data;
    } catch (error: any) {
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError;
        throw axiosError.response?.data ?? axiosError.message;
      } else {
        throw error;
      }
    }
  }
}

export default TestPlanService;
