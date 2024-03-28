import axios, { AxiosError } from 'axios';

const BASE_URL = 'http://localhost:8080';

interface Login {
  login: string;
  password: string;
}

interface User {
  login: string;
  password?: string;
  senhaAntiga?:string;
}


class LoginService {
  static async postLogin(login: string, password: string): Promise<any> {
    const data: Login = {
      login: login,
      password: password,
    };
  
    return this.request('post', '/api/login', data);
  }
  
  static async EditPassword(login:string, password:string, senhaAntiga:string): Promise<any> {
    const data: User = {
      login,
      password,
      senhaAntiga,
    };

    return this.request('put', `/api/login/trocar-senha`, data);
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

export default LoginService;
