import api from './api';
import { InsightResponse } from "./insight.types";

// Obtendo a URL base do .env
const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

export const getInsights = async (
  userId: string,
  includeTitles = false
): Promise<InsightResponse[]> => {
  const token = sessionStorage.getItem("token-flix-wrapped");

  const response = await api.get<InsightResponse[]>(
    `${apiBaseUrl}/insights/${userId}`, 
    {
      params: { includeTitles },
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      }
    }
  );

  return response.data;
};
