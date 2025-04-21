import api from './api';

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

export const uploadCsv = async (file: File, userId: string): Promise<any> => {
  const token = localStorage.getItem("token-flix-wrapped");
  const formData = new FormData();
  formData.append("file", file);
  formData.append("userId", userId);

  const response = await api.post(`${apiBaseUrl}/upload`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    },
  });

  const message: string = response.data.message;
  const match = message.match(/ID (\w+) para/);
  if (match && match[1]) return match[1];
  throw new Error("ID de upload não encontrado.");
};

export const checkUploadStatus = async (uploadId: string) => {
  const token = localStorage.getItem("token-flix-wrapped");
  const response = await api.get(`${apiBaseUrl}/upload/status/${uploadId}`,
    {
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      }
    }
  );
  return response.data.data;
};

export const deleteHistory = async () => {
  const token = localStorage.getItem("token-flix-wrapped");
  const response = await api.delete(`${apiBaseUrl}/user-history`,
    {
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      }
    }
  );
  return response.data.data;
};
