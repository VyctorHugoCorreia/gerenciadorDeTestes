// TeamService.ts
import axios, { AxiosError } from 'axios';

const BASE_URL = 'http://localhost:8080'; // Altere para a porta correta do seu backend
class TeamService {
  static async addTeam(teamName: string): Promise<any> {
    const data = {
      nomeTime: teamName,
    };
  
    try {
      const response = await axios.post(`${BASE_URL}/api/time`, data, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
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
  
 
  static async getAllTimes(): Promise<any> {
    try {
      const response = await axios.get(`${BASE_URL}/api/time`);
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

  static async deleteTeam(teamId: number): Promise<void> {
    try {
      await axios.delete(`${BASE_URL}/api/time/${teamId}`);
    } catch (error: any) {
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError;
        throw axiosError.response?.data ?? axiosError.message;
      } else {
        throw error;
      }
    }
  }

  static async editTeam(teamId: number, newName: string): Promise<void> {
    const data = {
      nomeTime: newName,
    };

    try {
      await axios.put(`${BASE_URL}/api/time/${teamId}`, data, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
    } catch (error: any) {
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError;
        throw axiosError.response?.data ?? axiosError.message;
      } else {
        throw error;
      }
    }
  }

  static async searchTimes(searchValue?: string): Promise<any> {
    try {
      const response = await axios.get(`${BASE_URL}/api/time?nomeTime=${searchValue}`);
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
