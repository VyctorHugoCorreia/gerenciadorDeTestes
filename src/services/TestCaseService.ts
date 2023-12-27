import axios, { AxiosError } from 'axios';

const BASE_URL = 'http://localhost:8080'; 
class TestCaseService {

  static async addTestCase(data: any): Promise<any> {
   
  
    try {
      const response = await axios.post(`${BASE_URL}/api/cenarioDeTeste`, data, {
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

  static async updateTestCase(idCenario: number, data: any): Promise<any> {
   
  
    try {
      const response = await axios.put(`${BASE_URL}/api/cenarioDeTeste/${idCenario}`, data, {
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

  static async searchTestCaseById(searchValue?: number): Promise<any> {
    try {
      const response = await axios.get(`${BASE_URL}/api/cenarioDeTeste?idCenario=${searchValue}`);
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

  static async searchTestCaseByIdSuite(searchValue?: number): Promise<any> {
    try {
      const response = await axios.get(`${BASE_URL}/api/cenarioDeTeste?idSuite=${searchValue}`);
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

export default TestCaseService;
