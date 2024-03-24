import axios, { AxiosError } from 'axios';
import { getAuthToken } from '../authentication/token'; 

const BASE_URL = 'http://localhost:8080';

interface AcessProfile {
  id: string;
  nome: string;
}

interface SearchParams {
  id?: string;
  nome?: string;
}

class UserService {
 

  static async getAllAcessProfile(): Promise<any> {
    return this.request('get', '/api/perfilDeAcesso');
  }


  static async searchAcessProfile(params: SearchParams = {}): Promise<any> {
    const { id,nome} = params;
    const url = '/api/perfilDeAcesso';

    const requestParams: Record<string, any> = {
      
    };

    if (nome !== undefined && nome.trim() !== "") {
      requestParams.nome = nome;
    }
    if (id !== undefined && id.trim() !== "") {
      requestParams.login = id;
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

export default UserService;
