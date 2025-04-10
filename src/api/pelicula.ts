import apiClient from './client';
import { Pelicula } from '../types';
import axios from 'axios';

interface BackendResponse<T> {
  message: string;
  data: T;
}

interface ApiResponse<T> {
  data: T;
  status: number;
}

export const getPeliculas = async (params?: Record<string, string | number | boolean>): Promise<ApiResponse<Pelicula[]>> => {
  try {
    const response = await apiClient.get<BackendResponse<Pelicula[]>>('/peliculas', { params });
    return {
      data: response.data.data,
      status: response.status
    };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(`API Error: ${error.response?.data?.message || error.message}`);
    }
    throw new Error('Unknown error occurred');
  }
};

export const getPelicula = async (id: string): Promise<ApiResponse<Pelicula>> => {
  try {
    const response = await apiClient.get<BackendResponse<Pelicula>>(`/peliculas/${id}`);
    return {
      data: response.data.data,
      status: response.status
    };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(`API Error: ${error.response?.data?.message || error.message}`);
    }
    throw new Error('Unknown error occurred');
  }
};


export const createPelicula = async (peliculaData: FormData): Promise<Pelicula> => {
  try {
    const response = await apiClient.post<BackendResponse<Pelicula>>('/peliculas', peliculaData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(`API Error: ${error.response?.data?.message || error.message}`);
    }
    throw new Error('Unknown error occurred');
  }
};

export const updatePelicula = async (id: string, peliculaData: FormData): Promise<Pelicula> => {
  try {
    const response = await apiClient.put<BackendResponse<Pelicula>>(`/peliculas/${id}`, peliculaData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(`API Error: ${error.response?.data?.message || error.message}`);
    }
    throw new Error('Unknown error occurred');
  }
};

export const deletePelicula = async (id: string): Promise<void> => {
  try {
    await apiClient.delete<BackendResponse<null>>(`/peliculas/${id}`);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(`API Error: ${error.response?.data?.message || error.message}`);
    }
    throw new Error('Unknown error occurred');
  }
};

export const getReporteFavoritos = async (): Promise<ApiResponse<{ id: string; nombre: string; cantidadFavoritos: number }[]>> => {
  try {
    const response = await apiClient.get<BackendResponse<{ id: string; nombre: string; cantidadFavoritos: number }[]>>('/peliculas/reportes/favoritos');
    return {
      data: response.data.data,
      status: response.status
    };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(`API Error: ${error.response?.data?.message || error.message}`);
    }
    throw new Error('Unknown error occurred');
  }
};

