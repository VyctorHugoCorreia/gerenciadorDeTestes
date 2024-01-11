import axios, { AxiosError } from 'axios';

const BASE_URL = 'http://localhost:8080'; 
class TestCaseService {

  static async addHistoryStatusScenario(data: any): Promise<any> {
   
  
    try {
      const response = await axios.post(`${BASE_URL}/api/historyStatusScenario`, data, {
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

  static async searchHistoryByTestCaseId(searchValue?: number): Promise<any> {
    try {
      const response = await axios.get(`${BASE_URL}/api/historyStatusScenario?idCenario=${searchValue}`);
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

export default TestCaseService;
