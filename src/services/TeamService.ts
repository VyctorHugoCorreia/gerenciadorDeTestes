import axios, { AxiosError } from 'axios';
import { getAuthToken } from '../authentication/token'; 

const BASE_URL = 'http://localhost:8080';

class TeamService {

  static async addTeam(nameTeam: string): Promise<any> {
    const data = {
      nameTeam: nameTeam,
    };
  
    return this.request('post', '/api/team', data);
  }
  
  static async getAllTeams(): Promise<any> {
    return this.request('get', '/api/team');
  }

  static async deleteTeam(idTeam: number): Promise<void> {
    return this.request('delete', `/api/team/${idTeam}`);
  }

  static async editTeam(idTeam: number, newName: string): Promise<void> {
    const data = {
      nameTeam: newName,
    };
    return this.request('put', `/api/team/${idTeam}`, data);
  }

  static async searchTeams(params: { nameTeam?: string } = {}): Promise<any> {
    const { nameTeam } = params;
    const url = '/api/team';

    const requestParams: Record<string, any> = {
      nameTeam
    };

    if (nameTeam !== undefined && nameTeam.trim() !== "") {
      requestParams.nameTeam = nameTeam;
    }

    return this.request('get', url, undefined, requestParams);
  }

  private static async request(
    method: 'get' | 'post' | 'put' | 'delete', 
    url: string, 
    data?: any, 
    params?: any, 
  ): Promise<any> {
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

export default TeamService;
