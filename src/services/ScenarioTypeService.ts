import axios, { AxiosError } from 'axios';

const BASE_URL = 'http://localhost:8080'; 
class ScenarioTypeService {
  
  static async getScenarioTypes(): Promise<any> {
    try {
      const response = await axios.get(`${BASE_URL}/api/tipoCenario`);
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

  static async getScenarioTypeByTeam(searchValue?: string): Promise<any> {
    try {
      const response = await axios.get(`${BASE_URL}/api/tipoCenario?idTime=${searchValue}`);
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

export default ScenarioTypeService;
