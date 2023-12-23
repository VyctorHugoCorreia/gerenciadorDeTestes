import axios, { AxiosError } from 'axios';

const BASE_URL = 'http://localhost:8080'; 
class TeamService {
  
  static async getAllTestCase(): Promise<any> {
    try {
      const response = await axios.get(`${BASE_URL}/api/cenarioDeTeste`);
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


  static async searchTestCase(searchValue?: string): Promise<any> {
    try {
      const response = await axios.get(`${BASE_URL}/api/cenarioDeTeste?tituloCenario=${searchValue}`);
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


  static async deleteTestCase(tesCaseId: number): Promise<void> {
    try {
      await axios.delete(`${BASE_URL}/api/cenarioDeTeste/${tesCaseId}`);
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
