import axios, { AxiosResponse } from 'axios';
import { 
  ILoginCredentials, 
  IRegisterData, 
  IAuthResponse, 
  IUser, 
  IGadget,
  IApiResponse,
  IPagination
} from '../types';

// Create axios instance
const api = axios.create({
  baseURL: '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: (credentials: ILoginCredentials): Promise<AxiosResponse<IAuthResponse>> =>
    api.post('/auth/login', credentials),
    
  register: (userData: IRegisterData): Promise<AxiosResponse<IAuthResponse>> =>
    api.post('/auth/register', userData),
    
  getProfile: (): Promise<AxiosResponse<IUser>> =>
    api.get('/auth/profile'),
    
  updateProfile: (profileData: Partial<IUser>): Promise<AxiosResponse<IUser>> =>
    api.put('/auth/profile', profileData),
    
  changePassword: (passwordData: { currentPassword: string; newPassword: string }): Promise<AxiosResponse<{ message: string }>> =>
    api.patch('/auth/change-password', passwordData),
};

// Gadget API
export const gadgetAPI = {
  getAllGadgets: (params?: {
    page?: number;
    limit?: number;
    search?: string;
    category?: string;
    brand?: string;
    minPrice?: number;
    maxPrice?: number;
    minRating?: number;
    inStock?: boolean;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }): Promise<AxiosResponse<IApiResponse<IGadget[]>>> =>
    api.get('/gadgets', { params }),
    
  getGadgetById: (id: string): Promise<AxiosResponse<IApiResponse<IGadget>>> =>
    api.get(`/gadgets/${id}`),
    
  getFeaturedGadgets: (limit?: number): Promise<AxiosResponse<IApiResponse<IGadget[]>>> =>
    api.get('/gadgets/featured', { params: { limit } }),
    
  getGadgetsByCategory: (category: string, params?: {
    page?: number;
    limit?: number;
  }): Promise<AxiosResponse<IApiResponse<IGadget[]>>> =>
    api.get(`/gadgets/category/${category}`, { params }),
    
  searchGadgets: (query: string, params?: {
    page?: number;
    limit?: number;
  }): Promise<AxiosResponse<IApiResponse<IGadget[]>>> =>
    api.get('/gadgets/search', { params: { q: query, ...params } }),
    
  getGadgetStats: (): Promise<AxiosResponse<IApiResponse<any>>> =>
    api.get('/gadgets/stats'),
};

// Admin Gadget API
export const adminGadgetAPI = {
  getAllGadgets: (params?: {
    page?: number;
    limit?: number;
    search?: string;
    category?: string;
    isActive?: boolean;
  }): Promise<AxiosResponse<IApiResponse<IGadget[]>>> =>
    api.get('/gadgets/admin/all', { params }),
    
  createGadget: (gadgetData: Partial<IGadget>): Promise<AxiosResponse<IApiResponse<IGadget>>> =>
    api.post('/gadgets/admin', gadgetData),
    
  updateGadget: (id: string, gadgetData: Partial<IGadget>): Promise<AxiosResponse<IApiResponse<IGadget>>> =>
    api.put(`/gadgets/admin/${id}`, gadgetData),
    
  deleteGadget: (id: string): Promise<AxiosResponse<IApiResponse<IGadget>>> =>
    api.delete(`/gadgets/admin/${id}`),
    
  permanentDeleteGadget: (id: string): Promise<AxiosResponse<IApiResponse<void>>> =>
    api.delete(`/gadgets/admin/${id}/permanent`),
};

export default api;
