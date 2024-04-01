import axios, { AxiosError } from 'axios';

const BASE_URL = 'http://localhost:8080';



interface User {
  login: string;
  password?: string;
  oldPassword?:string;
}


class ChangePasswordService {

  static async EditPassword(login:string, password:string, oldPassword:string): Promise<any> {
    const data: User = {
      login,
      password,
      oldPassword,
    };

    return this.request('put', `/api/change-password`, data);
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

export default ChangePasswordService;
