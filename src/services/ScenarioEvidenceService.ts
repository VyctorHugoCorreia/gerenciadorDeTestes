import axios, { AxiosError } from 'axios';
import { getAuthToken } from '../authentication/token'; 

const BASE_URL = 'http://localhost:8080';

class ScenarioEvidenceService {

  static async addScenarioEvidence(idScenario: string, fileName: string, fileData: File): Promise<any> {
    const formData = new FormData();
    formData.append('idScenario', idScenario);
    formData.append('fileName', fileName);
    formData.append('fileData', fileData);
  
    return this.request('post', '/api/scenario-evidence', formData);
  }

  static async getScenarioEvidence(idScenario: string): Promise<any> {
    return this.request('get', `/api/scenario-evidence/${idScenario}`);
  }
  

  static async deleteTeam(idScenario: number): Promise<void> {
    return this.request('delete', `/api/scenario-evidence/${idScenario}`);
  }



  private static async request(
    method: 'get' | 'post' | 'put' | 'delete', 
    url: string, 
    data?: any, 
    params?: any, 
  ): Promise<any> {
    try {
      const config: Record<string, any> = {
        method,
        url: `${BASE_URL}${url}`,
        headers: {
          Authorization: `Bearer ${getAuthToken()}`,
          'Content-Type': 'multipart/form-data' 
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

export default ScenarioEvidenceService;
