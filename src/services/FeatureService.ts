import axios, { AxiosError } from 'axios';

const BASE_URL = 'http://localhost:8080';
class FeatureService {
   
  static async getAllFeatures(): Promise<any> {
    try {
      const response = await axios.get(`${BASE_URL}/api/funcionalidade`);
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
  static async addFeature(idTime: number, idTproduto: number, descFuncionalidade: string): Promise<any> {
    const data = {
      idTime,
      idTproduto,
      descFuncionalidade,
    };

    try {
      const response = await axios.post(`${BASE_URL}/api/funcionalidade`, data, {
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
  
  static async editFeature(idFuncionalidade: number,idTime: number, idTproduto: number, descFuncionalidade: string) {
    const url = `${BASE_URL}/api/funcionalidade/${idFuncionalidade}`;
  
    try {
      const requestBody = {
        idTime: idTime,
        idTproduto: idTproduto,
        descFuncionalidade: descFuncionalidade,
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

  static async deleteFeature(featureId: number): Promise<void> {
    try {
      await axios.delete(`${BASE_URL}/api/funcionalidade/${featureId}`);
    } catch (error: any) {
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError;
        throw axiosError.response?.data ?? axiosError.message;
      } else {
        throw error;
      }
    }
  }
  static async searchFeatures(searchValue?: string): Promise<any> {
    try {
      const response = await axios.get(`${BASE_URL}/api/funcionalidade?descFuncionalidade=${searchValue}`);
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

export default FeatureService;
