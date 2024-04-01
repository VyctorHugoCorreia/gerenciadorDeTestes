import axios, { AxiosError } from 'axios';
import { getAuthToken } from '../authentication/token'; 

const BASE_URL = 'http://localhost:8080';

interface Product {
  idTeam: number;
  descProduct: string;
}

interface SearchParams {
  descProduct?: string;
  idTeam?: number;
}

class ProductService {
  static async addProduct(idTeam: number, descProduct: string): Promise<any> {
    const data: Product = {
      idTeam,
      descProduct,
    };

    return this.request('post', '/api/product', data);
  }

  static async getAllProducts(): Promise<any> {
    return this.request('get', '/api/product');
  }

  static async deleteProduct(idProduct: number): Promise<void> {
    return this.request('delete', `/api/product/${idProduct}`);
  }

  static async searchProducts(params: SearchParams = {}): Promise<any> {
    const { descProduct, idTeam} = params;
    const url = '/api/product';

    const requestParams: Record<string, any> = {
      idTeam
    };

    if (descProduct !== undefined && descProduct.trim() !== "") {
      requestParams.descProduct = descProduct;
    }

    return this.request('get', url, undefined, requestParams);
  }


  static async getProductsByTeam(searchValue?: string): Promise<any> {
    return this.request('get', '/api/product', undefined, { idTeam: searchValue });
  }

  static async editProduct(idProduct: number,  descProduct: string): Promise<any> {
    return this.request('put', `/api/product/${idProduct}`, { descProduct });
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
