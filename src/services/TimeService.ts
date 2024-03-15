import axios, { AxiosError } from 'axios';

const BASE_URL = 'http://localhost:8080';

interface Team {
  nomeTime: string;
}

interface SearchParams {
  nomeTime?: string;
}

class TeamService {
  static async addTeam(teamName: string): Promise<any> {
    const data: Team = {
      nomeTime: teamName,
    };
  
    return this.request('post', '/api/time', data);
  }
  
  static async getAllTeams(): Promise<any> {
    return this.request('get', '/api/time');
  }

  static async deleteTeam(teamId: number): Promise<void> {
    return this.request('delete', `/api/time/${teamId}`);
  }

  static async editTeam(teamId: number, newName: string): Promise<void> {
    const data: Team = {
      nomeTime: newName,
    };

    return this.request('put', `/api/time/${teamId}`, data);
  }

  static async searchTeams(params: SearchParams = {}): Promise<any> {
    const { nomeTime} = params;
    const url = '/api/time';

    const requestParams: Record<string, any> = {
      nomeTime
    };

    if (nomeTime !== undefined && nomeTime.trim() !== "") {
      requestParams.nomeTime = nomeTime;
    }

    return this.request('get', url, undefined, requestParams);
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

export default TeamService;
