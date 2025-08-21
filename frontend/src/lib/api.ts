import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: string;
}

export interface Recipe {
  id: string;
  title: string;
  description?: string;
  ingredients: string[];
  instructions: string[];
  prepTime: number;
  cookTime: number;
  servings: number;
  difficulty: string;
  cuisine?: string;
  imageUrl?: string;
  isPublic: boolean;
  authorId: string;
  author: {
    id: string;
    name: string;
  };
  averageRating: number;
  ratingCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateRecipeData {
  title: string;
  description?: string;
  ingredients: string[];
  instructions: string[];
  prepTime: number;
  cookTime: number;
  servings: number;
  difficulty: string;
  cuisine?: string;
  imageUrl?: string;
  isPublic?: boolean;
}

export interface Rating {
  id: string;
  rating: number;
  comment?: string;
  userId: string;
  user: {
    id: string;
    name: string;
  };
  createdAt: string;
}

// Auth API
export const authAPI = {
  register: async (data: { email: string; password: string; name: string }) => {
    const response = await api.post('/auth/register', data);
    return response.data;
  },

  login: async (data: { email: string; password: string }) => {
    const response = await api.post('/auth/login', data);
    return response.data;
  },
};

// Recipes API
export const recipesAPI = {
  getAll: async (query?: string) => {
    const params = query ? { q: query } : {};
    const response = await api.get('/recipes', { params });
    return response.data;
  },

  getMyRecipes: async () => {
    const response = await api.get('/recipes/my-recipes');
    return response.data;
  },

  getById: async (id: string) => {
    const response = await api.get(`/recipes/${id}`);
    return response.data;
  },

  create: async (data: CreateRecipeData) => {
    const response = await api.post('/recipes', data);
    return response.data;
  },

  update: async (id: string, data: Partial<CreateRecipeData>) => {
    const response = await api.patch(`/recipes/${id}`, data);
    return response.data;
  },

  delete: async (id: string) => {
    const response = await api.delete(`/recipes/${id}`);
    return response.data;
  },

  rate: async (id: string, data: { rating: number; comment?: string }) => {
    const response = await api.post(`/recipes/${id}/rate`, data);
    return response.data;
  },
};

export default api;
