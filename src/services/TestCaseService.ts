import axios, { AxiosError } from 'axios';

const BASE_URL = 'http://localhost:8080';

interface SearchParams {
  tituloCenario?: string;
  idTime?: number;
  idTproduto?: number;
  idFuncionalidade?: number;
  idPlano?: number;
  idSuite?: number;
  idStatus?: number;
  idCenario?: number;
  idTpcenario?:number;
  idPlataforma?:number;
  idAutomatizado?:number;

}

class TestCaseService {
  static async addTestCase(data: any): Promise<any> {
    return this.request('post', '/api/cenarioDeTeste', data);
  }

  static async updateTestCase(idCenario: number, data: any): Promise<any> {
    return this.request('put', `/api/cenarioDeTeste/${idCenario}`, data);
  }

  static async getAllTestCase(): Promise<any> {
    return this.request('get', '/api/cenarioDeTeste');
  }

  static async searchTestCase(params: SearchParams = {}): Promise<any> {
    const { tituloCenario, idTime, idTproduto, idFuncionalidade, idPlano,idSuite, idStatus,idTpcenario,idPlataforma,idAutomatizado, idCenario,  } = params;
    const url = '/api/cenarioDeTeste';

    const requestParams: Record<string, any> = {
      idTime,
      idTproduto,
      idFuncionalidade,
      idPlano,
      idSuite,
      idStatus,
      idTpcenario,
      idPlataforma,
      idAutomatizado,
      idCenario
     
    };

    if (tituloCenario !== undefined && tituloCenario.trim() !== "") {
      requestParams.tituloCenario = tituloCenario;
    }

    return this.request('get', url, undefined, requestParams);
  }

  static async deleteTestCase(testCaseId: number): Promise<void> {
    return this.request('delete', `/api/cenarioDeTeste/${testCaseId}`);
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

export default TestCaseService;
