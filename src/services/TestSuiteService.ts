import axios, { AxiosError } from 'axios';
import { getAuthToken } from '../authentication/token'; 

const BASE_URL = 'http://localhost:8080';

interface SearchParams {
  descTestSuite?: string;
  idTeam?: number;
  idProduct?: number;
  idTestPlan?: number;
}

class TestSuiteService {
  static async getAllTestSuite(): Promise<any> {
    return this.request('get', '/api/test-suite');
  }

  static async addTestSuite(data: any): Promise<any> {
    return this.request('post', '/api/test-suite', data);
  }

  static async editTestSuite(idSuite: number, idTeam: number, idProduct: number, idTestPlan: number, descTestSuite: string): Promise<any> {
    const url = `/api/test-suite/${idSuite}`;

    const requestBody = {
      idTeam,
      idProduct,
      idTestPlan,
      descTestSuite,
    };

    return this.request('put', url, requestBody);
  }

  static async deleteTestSuite(idSuite: number): Promise<void> {
    return this.request('delete', `/api/test-suite/${idSuite}`);
  }

  static async searchTestSuite(params: SearchParams = {}): Promise<any> {
    const { descTestSuite, idTeam, idProduct, idTestPlan } = params;
    const url = '/api/test-suite';

    const requestParams: Record<string, any> = {
      idTeam,
      idProduct,
      idTestPlan
    };

    if (descTestSuite !== undefined && descTestSuite.trim() !== "") {
      requestParams.descTestSuite = descTestSuite;
    }

    return this.request('get', url, undefined, requestParams);
  }

  static async searchTestSuiteById(searchValue?: string): Promise<any> {
    return this.request('get', '/api/test-suite', undefined, { idSuite: searchValue });
  }

  static async getTestSuitesByPlan(searchValue?: number): Promise<any> {
    return this.request('get', '/api/test-suite', undefined, { idTestPlan: searchValue });
  }

  static async getTestSuitesByTeam(searchValue?: string): Promise<any> {
    return this.request('get', '/api/test-suite', undefined, { idTeam: searchValue });
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
