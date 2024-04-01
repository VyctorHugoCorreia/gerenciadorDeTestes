import axios, { AxiosError } from 'axios';
import { getAuthToken } from '../authentication/token'; 

const BASE_URL = 'http://localhost:8080';

interface User {
  name: string;
  login: string;
  password?: string;
  oldPassword?:string;
  accessProfile: string;
}


interface SearchParams {
  name?: string;
  login?: string;
  accessProfile?: string;
}

class UserService {
 

  static async getAllUsers(): Promise<any> {
    return this.request('get', '/api/user');
  }

  static async addUser( name: string, login:string, password:string, accessProfile: string): Promise<any> {
    const data: User = {
      name,
      login,
      password,
      accessProfile
    };

    return this.request('post', '/api/user', data);
  }

  static async ActiveOrInactiveUser( id:string, status:string): Promise<any> {
    return this.request('delete', `/api/user/${id}?status=${status}`,);
  }
  static async EditUser( id:string, name: string, login:string, password:string, oldPassword:string, accessProfile: string): Promise<any> {
    const data: User = {
      name,
      login,
      password,
      oldPassword,
      accessProfile
    };

    return this.request('put', `/api/user/${id}`, data);
  }


  static async searchUsers(params: SearchParams = {}): Promise<any> {
    const { name,login,accessProfile} = params;
    const url = '/api/user';

    const requestParams: Record<string, any> = {
      
    };

    if (name !== undefined && name.trim() !== "") {
      requestParams.name = name;
    }
    if (login !== undefined && login.trim() !== "") {
      requestParams.login = login;
    }
    if (accessProfile !== undefined && accessProfile.trim() !== "") {
      requestParams.accessProfile = accessProfile;
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
