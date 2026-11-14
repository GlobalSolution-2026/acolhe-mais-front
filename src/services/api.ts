
// Quando a equipa de Java fizer o deploy no Render, basta trocar esta URL
const BASE_URL = 'https://api-java-acolhemais-exemplo.onrender.com';

/**
 * Função utilitária centralizada para usar o Fetch API
 * Garante que cumprimos a exigência do PDF e facilita o tratamento de erros
 */
async function fetchConfig<T>(endpoint: string, options?: RequestInit): Promise<T> {
  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(errorData?.erro || `Erro na requisição: ${response.status}`);
    }

    if (response.status === 204) {
      return {} as T;
    }

    return await response.json();
  } catch (error) {
    console.error('Erro na API:', error);
    throw error;
  }
}

// SERVIÇOS EXPORTADOS PARA USAR NAS PÁGINAS

export const api = {
  // Exemplo de operação de LEITURA (GET) exigida pelo edital
  get: <T>(endpoint: string) => fetchConfig<T>(endpoint, { method: 'GET' }),

  // Exemplo de operação de ESCRITA (POST) exigida pelo edital
  post: <T>(endpoint: string, data: unknown) => 
    fetchConfig<T>(endpoint, { method: 'POST', body: JSON.stringify(data) }),

  // Operações adicionais se o teu sistema precisar
  put: <T>(endpoint: string, data: unknown) => 
    fetchConfig<T>(endpoint, { method: 'PUT', body: JSON.stringify(data) }),
    
  delete: <T>(endpoint: string) => fetchConfig<T>(endpoint, { method: 'DELETE' }),
};