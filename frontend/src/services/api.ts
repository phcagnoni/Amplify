/**
 * Serviço de API para comunicação com o backend Amplify
 * Integração Frontend (React) <-> Backend (FastAPI)
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

// ==================== TIPOS ====================

export interface Usuario {
  id: string;
  name: string;
  email: string;
}

export interface LoginResponse {
  success: boolean;
  user: Usuario;
  token: string;
}

export interface Vertice {
  id: number;
  nome: string;
  tipo: 'musica' | 'artista' | 'genero' | 'desconhecido';
}

export interface VerticeDetalhado extends Vertice {
  conexoes: Array<{
    id: number;
    nome: string;
    tipo: string;
    peso: number;
  }>;
  total_conexoes: number;
}

export interface Musica {
  id: number;
  nome: string;
  artistas: string[];
  generos: string[];
}

export interface MusicaDetalhada {
  id: number;
  nome: string;
  artistas: Array<{ id: number; nome: string }>;
  generos: Array<{ id: number; nome: string }>;
}

export interface Recomendacao {
  id: number;
  nome: string;
  artistas: string[];
  generos: string[];
  score: number;
}

export interface GrafoInfo {
  vertices: number;
  arestas: number;
  vertices_por_tipo: {
    [key: string]: number;
  };
}

// ==================== FUNÇÕES AUXILIARES ====================

class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

async function fetchAPI<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const defaultHeaders: HeadersInit = {
    'Content-Type': 'application/json',
  };

  // Adiciona token se existir
  const token = localStorage.getItem('amplify_token');
  if (token) {
    defaultHeaders['Authorization'] = `Bearer ${token}`;
  }

  const config: RequestInit = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  };

  try {
    const response = await fetch(url, config);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new ApiError(
        response.status,
        errorData.detail || `Erro ${response.status}: ${response.statusText}`
      );
    }

    return await response.json();
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new Error(`Erro de conexão: ${error instanceof Error ? error.message : 'Desconhecido'}`);
  }
}

// ==================== AUTENTICAÇÃO ====================

export const authAPI = {
  /**
   * Realiza login do usuário
   */
  async login(email: string, password: string): Promise<LoginResponse> {
    const response = await fetchAPI<LoginResponse>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    
    // Salva token no localStorage
    if (response.token) {
      localStorage.setItem('amplify_token', response.token);
      localStorage.setItem('amplify_user', JSON.stringify(response.user));
    }
    
    return response;
  },

  /**
   * Realiza registro de novo usuário
   */
  async register(email: string, password: string): Promise<{ success: boolean; message: string }> {
    return fetchAPI('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  },

  /**
   * Realiza logout
   */
  logout(): void {
    localStorage.removeItem('amplify_token');
    localStorage.removeItem('amplify_user');
  },

  /**
   * Retorna usuário logado do localStorage
   */
  getCurrentUser(): Usuario | null {
    const userStr = localStorage.getItem('amplify_user');
    return userStr ? JSON.parse(userStr) : null;
  },
};

// ==================== GRAFO ====================

export const grafoAPI = {
  /**
   * Obtém informações gerais do grafo
   */
  async getInfo(): Promise<GrafoInfo> {
    return fetchAPI('/api/grafo/info');
  },

  /**
   * Lista todos os vértices ou filtra por tipo
   */
  async listarVertices(tipo?: string): Promise<{ vertices: Vertice[]; total: number }> {
    const query = tipo ? `?tipo=${encodeURIComponent(tipo)}` : '';
    return fetchAPI(`/api/grafo/vertices${query}`);
  },

  /**
   * Obtém detalhes de um vértice específico
   */
  async getVertice(id: number): Promise<VerticeDetalhado> {
    return fetchAPI(`/api/grafo/vertices/${id}`);
  },

  /**
   * Cria um novo vértice
   */
  async criarVertice(nome: string, tipo: string): Promise<{ success: boolean; id: number }> {
    return fetchAPI('/api/grafo/vertices', {
      method: 'POST',
      body: JSON.stringify({ nome, tipo }),
    });
  },

  /**
   * Cria uma aresta entre dois vértices
   */
  async criarAresta(
    vertice1: string,
    vertice2: string,
    peso: number = 1.0
  ): Promise<{ success: boolean }> {
    return fetchAPI('/api/grafo/arestas', {
      method: 'POST',
      body: JSON.stringify({ vertice1, vertice2, peso }),
    });
  },

  /**
   * Salva o grafo em arquivo
   */
  async salvar(caminho: string = 'Grafo.txt'): Promise<{ success: boolean; message: string }> {
    return fetchAPI(`/api/grafo/salvar?caminho=${encodeURIComponent(caminho)}`, {
      method: 'POST',
    });
  },

  /**
   * Carrega o grafo de um arquivo
   */
  async carregar(caminho: string = 'Grafo.txt'): Promise<{ success: boolean; message: string }> {
    return fetchAPI(`/api/grafo/carregar?caminho=${encodeURIComponent(caminho)}`, {
      method: 'POST',
    });
  },
};

// ==================== MÚSICAS ====================

export const musicasAPI = {
  /**
   * Lista músicas com filtros opcionais
   */
  async listar(filters?: {
    genero?: string;
    artista?: string;
  }): Promise<{ musicas: Musica[]; total: number }> {
    const params = new URLSearchParams();
    if (filters?.genero) params.append('genero', filters.genero);
    if (filters?.artista) params.append('artista', filters.artista);
    
    const query = params.toString() ? `?${params.toString()}` : '';
    return fetchAPI(`/api/musicas${query}`);
  },

  /**
   * Obtém detalhes de uma música específica
   */
  async getDetalhes(id: number): Promise<MusicaDetalhada> {
    return fetchAPI(`/api/musicas/${id}`);
  },
};

// ==================== RECOMENDAÇÕES ====================

export const recomendacoesAPI = {
  /**
   * Gera recomendações musicais
   */
  async gerar(params?: {
    usuario_id?: string;
    genero?: string;
    artista?: string;
    limite?: number;
  }): Promise<{ recomendacoes: Recomendacao[]; total: number }> {
    return fetchAPI('/api/recomendacoes', {
      method: 'POST',
      body: JSON.stringify(params || {}),
    });
  },
};

// ==================== SPOTIFY ====================

export const spotifyAPI = {
  /**
   * Importa um artista do Spotify
   */
  async importarArtista(artistaNome: string): Promise<{ success: boolean; message: string }> {
    return fetchAPI('/api/spotify/import-artista', {
      method: 'POST',
      body: JSON.stringify({ artista_nome: artistaNome }),
    });
  },
};

// ==================== HEALTH CHECK ====================

export const healthAPI = {
  /**
   * Verifica se a API está online
   */
  async check(): Promise<{ status: string; grafo: { vertices: number; arestas: number } }> {
    return fetchAPI('/api/health');
  },
};

// Exporta tudo junto também
export default {
  auth: authAPI,
  grafo: grafoAPI,
  musicas: musicasAPI,
  recomendacoes: recomendacoesAPI,
  spotify: spotifyAPI,
  health: healthAPI,
};
