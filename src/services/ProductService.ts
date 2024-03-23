import axios, { AxiosError } from 'axios';
import { getAuthToken } from '../authentication/token'; 

const BASE_URL = 'http://localhost:8080';

interface Product {
  idTime: number;
  descProduto: string;
}

interface SearchParams {
  descProduto?: string;
  idTime?: number;
}

class ProductService {
  static async addProduct(idTime: number, descProduto: string): Promise<any> {
    const data: Product = {
      idTime,
      descProduto,
    };

    return this.request('post', '/api/produto', data);
  }

  static async getAllProducts(): Promise<any> {
    return this.request('get', '/api/produto');
  }

  static async deleteProduct(productId: number): Promise<void> {
    return this.request('delete', `/api/produto/${productId}`);
  }

  static async searchProducts(params: SearchParams = {}): Promise<any> {
    const { descProduto, idTime} = params;
    const url = '/api/produto';

    const requestParams: Record<string, any> = {
      idTime
    };

    if (descProduto !== undefined && descProduto.trim() !== "") {
      requestParams.descProduto = descProduto;
    }

    return this.request('get', url, undefined, requestParams);
  }


  static async getProductsByTeam(searchValue?: string): Promise<any> {
    return this.request('get', '/api/produto', undefined, { idTime: searchValue });
  }

  static async editProduct(productId: number,  descProduto: string): Promise<any> {
    return this.request('put', `/api/produto/${productId}`, { descProduto });
  }

  private static async request(method: 'get' | 'post' | 'put' | 'delete', url: string, data?: any, params?: any): Promise<any> {
    try {
      const config: Record<string, any> = {
        method,
        url: `${BASE_URL}${url}`,
        headers: {
          Authorization: `Bearer ${getAuthToken()}` 
        }
      };

      if (data && method !== 'get') {
        config.data = data;
      }

      if (params && method === 'get') {
        config.params = params;
      }

      const response = await axios(config);
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

export default ProductService;
