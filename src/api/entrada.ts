import apiClient from './client';
import axios from 'axios';
import { Entrada } from '../types';

interface BackendResponse<T> {
  message: string;
  data: T;
}

export const createEntrada = async (data: {
  precio: number;
  usuario: string;
  funcion: string;
  asiento: string;
}): Promise<Entrada> => {
  try {
    const response = await apiClient.post<BackendResponse<Entrada>>('/entradas', data);
    return response.data.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || error.message);
    }
    throw new Error('Error desconocido al crear entrada');
  }
};
