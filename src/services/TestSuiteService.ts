import axios, { AxiosError } from 'axios';
import { getAuthToken } from '../authentication/token'; 

const BASE_URL = 'http://localhost:8080';

interface SearchParams {
  descSuite?: string;
  idTeam?: number;
  idProduct?: number;
  idPlano?: number;
}

class TestSuiteService {
  static async getAllTestSuite(): Promise<any> {
    return this.request('get', '/api/suiteDeTeste');
  }

  static async addTestSuite(data: any): Promise<any> {
    return this.request('post', '/api/suiteDeTeste', data);
  }

  static async editTestSuite(idSuite: number, idTeam: number, idProduct: number, idPlano: number, descSuite: string): Promise<any> {
    const url = `/api/suiteDeTeste/${idSuite}`;

    const requestBody = {
      idTeam,
      idProduct,
      idPlano,
      descSuite,
    };

    return this.request('put', url, requestBody);
  }

  static async deleteTestSuite(idSuite: number): Promise<void> {
    return this.request('delete', `/api/suiteDeTeste/${idSuite}`);
  }

  static async searchTestSuite(params: SearchParams = {}): Promise<any> {
    const { descSuite, idTeam, idProduct, idPlano } = params;
    const url = '/api/suiteDeTeste';

    const requestParams: Record<string, any> = {
      idTeam,
      idProduct,
      idPlano
    };

    if (descSuite !== undefined && descSuite.trim() !== "") {
      requestParams.descSuite = descSuite;
    }

    return this.request('get', url, undefined, requestParams);
  }

  static async searchTestSuiteById(searchValue?: string): Promise<any> {
    return this.request('get', '/api/suiteDeTeste', undefined, { idSuite: searchValue });
  }

  static async getTestSuitesByPlan(searchValue?: number): Promise<any> {
    return this.request('get', '/api/suiteDeTeste', undefined, { idPlano: searchValue });
  }

  static async getTestSuitesByTeam(searchValue?: string): Promise<any> {
    return this.request('get', '/api/suiteDeTeste', undefined, { idTeam: searchValue });
  }

  private static async request(method: 'get' | 'post' | 'put' | 'delete', url: string, data?: any, params?: any): Promise<any> {
    try {
      const config: Record<string, any> = {
        method,
        url: `${BASE_URL}${url}`,
        headers: {
          Authorization: `Bearer ${getAuthToken()}` 
        }
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

export default TestSuiteService;
