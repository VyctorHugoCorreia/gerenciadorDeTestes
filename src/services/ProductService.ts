import axios, { AxiosError } from 'axios';

const BASE_URL = 'http://localhost:8080'; // Substitua pela sua URL base

class ProductService {
  static async addProduct(idTime: number, descProduto: string): Promise<any> {
    const data = {
      idTime,
      descProduto,
    };

    try {
      const response = await axios.post(`${BASE_URL}/api/produto`, data, {
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

  static async getAllProducts(): Promise<any> {
    try {
      const response = await axios.get(`${BASE_URL}/api/produto`);
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

  static async deleteProduct(productId: number): Promise<void> {
    try {
      await axios.delete(`${BASE_URL}/api/produto/${productId}`);
    } catch (error: any) {
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError;
        throw axiosError.response?.data ?? axiosError.message;
      } else {
        throw error;
      }
    }
  }


  static async searchProducts(searchValue?: string): Promise<any> {
    try {
      const response = await axios.get(`${BASE_URL}/api/produto?descProduto=${searchValue}`);
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

  static async getProductsByTeam(searchValue?: string): Promise<any> {
    try {
      const response = await axios.get(`${BASE_URL}/api/produto?idTime=${searchValue}`);
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
  


  static async editProduct(productId : number, descProduto: string) {
    const url = `${BASE_URL}/api/produto/${productId}`;

    try {
      const response = await axios.put(url, { descProduto }, {
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
}



export default ProductService;
