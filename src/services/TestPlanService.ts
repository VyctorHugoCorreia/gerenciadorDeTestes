import axios, { AxiosError } from 'axios';
import { getAuthToken } from '../authentication/token'; 

const BASE_URL = 'http://localhost:8080';

interface SearchParams {
  descTestPlan?: string;
  idTeam?: number;
  idProduct?: number;
}

class TestPlanService {
  static async getAllTestPlan(): Promise<any> {
    return this.request('get', '/api/test-plan');
  }

  static async addTestPlan(idTeam: number, idProduct: number, descTestPlan: string): Promise<any> {
    const data = {
      idTeam,
      idProduct,
      descTestPlan,
    };

    return this.request('post', '/api/test-plan', data);
  }

  static async editTestPlan(idTestPlan: number, idTeam: number, idProduct: number, descTestPlan: string): Promise<any> {
    const url = `/api/test-plan/${idTestPlan}`;

    const requestBody = {
      idTeam,
      idProduct,
      descTestPlan,
    };

    return this.request('put', url, requestBody);
  }

  static async deleteTestPlan(idTestPlan: number): Promise<void> {
    return this.request('delete', `/api/test-plan/${idTestPlan}`);
  }

  static async getTestPlansByProduct(searchValue?: string): Promise<any> {
    return this.request('get', `/api/test-plan`, undefined, { idProduct: searchValue });
  }

  static async getTestPlansById(searchValue?: string): Promise<any> {
    return this.request('get', `/api/test-plan`, undefined, { idTestPlan: searchValue });
  }

  static async getTestPlansByTeam(searchValue?: string): Promise<any> {
    return this.request('get', `/api/test-plan`, undefined, { idTeam: searchValue });
  }

  static async searchTestPlan(params: SearchParams = {}): Promise<any> {
    const { descTestPlan, idTeam, idProduct } = params;
    const url = '/api/test-plan';

    const requestParams: Record<string, any> = {
      idTeam,
      idProduct
    };

    if (descTestPlan !== undefined && descTestPlan.trim() !== "") {
      requestParams.descTestPlan = descTestPlan;
    }

    return this.request('get', url, undefined, requestParams);
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

export default TestPlanService;
