import axios, { AxiosError } from 'axios';

const BASE_URL = 'http://localhost:8080';

interface Feature {
  idTime: number;
  idTproduto: number;
  descFuncionalidade: string;
}

class FeatureService {
  static async getAllFeatures(): Promise<any> {
    return this.request('get', '/api/funcionalidade');
  }

  static async addFeature(idTime: number, idTproduto: number, descFuncionalidade: string): Promise<any> {
    const data: Feature = {
      idTime,
      idTproduto,
      descFuncionalidade,
    };

    return this.request('post', '/api/funcionalidade', data);
  }

  static async editFeature(idFuncionalidade: number, idTime: number, idTproduto: number, descFuncionalidade: string): Promise<any> {
    const data: Feature = {
      idTime,
      idTproduto,
      descFuncionalidade,
    };

    return this.request('put', `/api/funcionalidade/${idFuncionalidade}`, data);
  }

  static async deleteFeature(featureId: number): Promise<void> {
    return this.request('delete', `/api/funcionalidade/${featureId}`);
  }

  static async searchFeatures(searchValue?: string): Promise<any> {
    return this.request('get', '/api/funcionalidade', undefined, { descFuncionalidade: searchValue });
  }

  static async getFeatureByProduct(searchValue?: string): Promise<any> {
    return this.request('get', '/api/funcionalidade', undefined, { idProduto: searchValue });
  }

  static async getFeatureByTeam(searchValue?: string): Promise<any> {
    return this.request('get', '/api/funcionalidade', undefined, { idTime: searchValue });
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

export default FeatureService;
