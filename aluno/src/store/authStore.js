import { create } from 'zustand';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

export const useAuthStore = create((set) => ({
  user: null,
  token: null,
  loading: false,
  error: null,

  loadFromStorage: () => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    if (token && user) {
      set({ token, user: JSON.parse(user) });
    }
  },

  login: async (email, password) => {
    set({ loading: true, error: null });
    try {
      const response = await axios.post(`${API_URL}/auth/login`, {
        email,
        password,
      });
      const { token, user } = response.data;
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      set({ token, user, loading: false });
      return true;
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Erro ao fazer login';
      set({ error: errorMessage, loading: false });
      return false;
    }
  },

  register: async (email, password, name) => {
    set({ loading: true, error: null });
    try {
      const response = await axios.post(`${API_URL}/auth/register`, {
        email,
        password,
        name,
        role: 'student',
      });
      const { token, user } = response.data;
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      set({ token, user, loading: false });
      return true;
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Erro ao registrar';
      set({ error: errorMessage, loading: false });
      return false;
    }
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    set({ user: null, token: null });
  },
}));
