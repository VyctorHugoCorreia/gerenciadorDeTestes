import axios, { AxiosError } from 'axios';
import { getAuthToken } from '../authentication/token'; 

const BASE_URL = 'http://localhost:8080';

interface User {
  nome: string;
  login: string;
  senha: string;
  perfilDeAcesso: string;
}


interface SearchParams {
  nome?: string;
  login?: string;
  perfilDeAcesso?: string;
}

class UserService {
 

  static async getAllUsers(): Promise<any> {
    return this.request('get', '/api/usuarios');
  }

  static async addUser( nome: string, login:string, senha:string, perfilDeAcesso: string): Promise<any> {
    const data: User = {
      nome,
      login,
      senha,
      perfilDeAcesso
    };

    return this.request('post', '/api/usuarios', data);
  }


  static async searchUsers(params: SearchParams = {}): Promise<any> {
    const { nome,login,perfilDeAcesso} = params;
    const url = '/api/usuarios';

    const requestParams: Record<string, any> = {
      
    };

    if (nome !== undefined && nome.trim() !== "") {
      requestParams.nome = nome;
    }
    if (login !== undefined && login.trim() !== "") {
      requestParams.login = login;
    }
    if (perfilDeAcesso !== undefined && perfilDeAcesso.trim() !== "") {
      requestParams.perfilDeAcesso = perfilDeAcesso;
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
