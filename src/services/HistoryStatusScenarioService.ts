import axios, { AxiosError } from 'axios';
import { getAuthToken } from '../authentication/token'; 

const BASE_URL = 'http://localhost:8080';

class historyStatusScenarioService {
  static async addHistoryStatusScenario(data: any): Promise<any> {
    return this.request('post', '/api/historyStatusScenario', data);
  }

  static async searchHistoryByTestCaseId(searchValue?: string): Promise<any> {
    return this.request('get', '/api/historyStatusScenario', undefined, { idCenario: searchValue });
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

export default historyStatusScenarioService;
