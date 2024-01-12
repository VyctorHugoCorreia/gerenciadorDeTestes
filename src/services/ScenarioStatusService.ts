import axios, { AxiosError } from 'axios';

const BASE_URL = 'http://localhost:8080';

class ScenarioStatusService {
  static async getStatusTypes(): Promise<any> {
    return this.request('get', '/api/statusCenario');
  }

  static async getStatusTypesByTeam(searchValue?: string): Promise<any> {
    return this.request('get', '/api/statusCenario', undefined, { idTime: searchValue });
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

export default ScenarioStatusService;
