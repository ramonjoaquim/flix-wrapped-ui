import api from './api';
// Obtendo a URL base do .env
const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

// Função para autenticar com o Google
export const loginWithGoogle = async (googleToken: string): Promise<any> => {
  try {
    const response = await api.post(
      `${apiBaseUrl}/auth/google`,
      { token: googleToken },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Erro ao fazer login:", error);
    throw new Error("Falha na autenticação");
  }
};

export const getMe = async (): Promise<any> => {
  const token = sessionStorage.getItem("token-flix-wrapped");

  const response = await api.get<any>(
    `${apiBaseUrl}/auth/me`,
    {
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      }
    }
  );

  return response.data;
};
