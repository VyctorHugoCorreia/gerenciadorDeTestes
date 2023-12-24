import axios, { AxiosError } from 'axios';

const BASE_URL = 'http://localhost:8080'; 

class ScenarioStatusService {
  
  static async getStatusTypes(): Promise<any> {
    try {
      const response = await axios.get(`${BASE_URL}/api/statusCenario`);
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

export default ScenarioStatusService;
