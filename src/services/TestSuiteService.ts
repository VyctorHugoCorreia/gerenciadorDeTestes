
import axios, { AxiosError } from 'axios';

const BASE_URL = 'http://localhost:8080'; // Altere para a porta correta do seu backend

class TestSuiteService {
   
  static async getAllTestSuite(): Promise<any> {
    try {
      const response = await axios.get(`${BASE_URL}/api/suiteDeTeste`);
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
  static async addTestSuite(idTime: number, idTproduto: number, idPlano: number, descSuite: string): Promise<any> {
    const data = {
      idTime,
      idTproduto,
      idPlano,
      descSuite,
    };

    try {
      const response = await axios.post(`${BASE_URL}/api/suiteDeTeste`, data, {
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
  
  static async editTestSuite(idSuite: number,idTime: number, idTproduto: number, idPlano: number, descSuite: string) {
    const url = `${BASE_URL}/api/suiteDeTeste/${idSuite}`;
  
    try {
      const requestBody = {
        idTime: idTime,
        idTproduto: idTproduto,
        idPlano: idPlano,
        descSuite: descSuite,
      };
  
      const response = await axios.put(url, requestBody, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const axiosError = error;
        throw axiosError.response?.data ?? axiosError.message;
      } else {
        throw error;
      }
    }
  }

  static async deleteTestSuite(idSuite: number): Promise<void> {
    try {
      await axios.delete(`${BASE_URL}/api/suiteDeTeste/${idSuite}`);
    } catch (error: any) {
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError;
        throw axiosError.response?.data ?? axiosError.message;
      } else {
        throw error;
      }
    }
  }
  static async searchTestSuite(searchValue?: string): Promise<any> {
    try {
      const response = await axios.get(`${BASE_URL}/api/suiteDeTeste?descSuite=${searchValue}`);
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

export default TestSuiteService;
