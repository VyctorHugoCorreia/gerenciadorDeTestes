import axios, { AxiosError } from 'axios';
import { getAuthToken } from '../authentication/token'; 

const BASE_URL = 'http://localhost:8080';

interface SearchParams {
  titleScenario?: string;
  idTeam?: number;
  idProduct?: number;
  idTestPlan?: number;
  idTestSuite?: number;
  idScenarioStatus?: number;
  idScenario?: number;
  idScenarioType?:number;
  idPlatformType?:number;
  idAutomationStatus?:number;

}

class TestCaseService {
  static async addTestCase(data: any): Promise<any> {
    return this.request('post', '/api/scenario', data);
  }

  static async updateTestCase(idScenario: number, data: any): Promise<any> {
    return this.request('put', `/api/scenario/${idScenario}`, data);
  }

  static async getAllTestCase(): Promise<any> {
    return this.request('get', '/api/scenario');
  }

  static async searchTestCase(params: SearchParams = {}): Promise<any> {
    const { titleScenario, idTeam, idProduct, idTestPlan,idTestSuite, idScenarioStatus,idScenarioType,idPlatformType,idAutomationStatus, idScenario,  } = params;
    const url = '/api/scenario';

    const requestParams: Record<string, any> = {
      idTeam,
      idProduct,
      idTestPlan,
      idTestSuite,
      idScenarioStatus,
      idScenarioType,
      idPlatformType,
      idAutomationStatus,
      idScenario
     
    };

    if (titleScenario !== undefined && titleScenario.trim() !== "") {
      requestParams.titleScenario = titleScenario;
    }

    return this.request('get', url, undefined, requestParams);
  }

  static async deleteTestCase(testCaseId: number): Promise<void> {
    return this.request('delete', `/api/scenario/${testCaseId}`);
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

export default TestCaseService;
