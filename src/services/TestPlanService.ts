
import axios, { AxiosError } from 'axios';

const BASE_URL = 'http://localhost:8080'; // Altere para a porta correta do seu backend
class TestPlanService {
   
  static async getAllTestPlan(): Promise<any> {
    try {
      const response = await axios.get(`${BASE_URL}/api/planoDeTeste`);
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
  static async addTestPlan(idTime: number, idTproduto: number, descPlano: string): Promise<any> {
    const data = {
      idTime,
      idTproduto,
      descPlano,
    };

    try {
      const response = await axios.post(`${BASE_URL}/api/planoDeTeste`, data, {
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
  
  static async editTestPlan(idPlano: number,idTime: number, idTproduto: number, descPlano: string) {
    const url = `${BASE_URL}/api/planoDeTeste/${idPlano}`;
  
    try {
      const requestBody = {
        idTime: idTime,
        idTproduto: idTproduto,
        descPlano: descPlano,
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

  static async deleteTestPlan(idPlano: number): Promise<void> {
    try {
      await axios.delete(`${BASE_URL}/api/planoDeTeste/${idPlano}`);
    } catch (error: any) {
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError;
        throw axiosError.response?.data ?? axiosError.message;
      } else {
        throw error;
      }
    }
  }
  static async searchTestPlan(searchValue?: string): Promise<any> {
    try {
      const response = await axios.get(`${BASE_URL}/api/planoDeTeste?descPlano=${searchValue}`);
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

  static async getTestPlansByProduct(searchValue?: string): Promise<any> {
    try {
      const response = await axios.get(`${BASE_URL}/api/planoDeTeste?idTproduto=${searchValue}`);
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

export default TestPlanService;
