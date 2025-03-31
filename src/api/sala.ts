import apiClient from './client';
import { Sala } from '../types';
import axios from 'axios';
import { AsientoFuncion } from "../types";

interface BackendResponse<T> {
  message: string;
  data: T;
}

interface ApiResponse<T> {
  data: T;
  status: number;
}

export const getSalas = async (): Promise<ApiResponse<Sala[]>> => {
  try {
    const response = await apiClient.get<BackendResponse<Sala[]>>('/salas');
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

export const getSala = async (id: string): Promise<ApiResponse<Sala>> => {
  try {
    const response = await apiClient.get<BackendResponse<Sala>>(`/salas/${id}`);
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

export const createSala = async (sala: Partial<Sala>): Promise<Sala> => {
  try {
    const response = await apiClient.post<BackendResponse<Sala>>('/salas', sala);
    return response.data.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(`API Error: ${error.response?.data?.message || error.message}`);
    }
    throw new Error('Unknown error occurred');
  }
};

export const updateSala = async (id: string, sala: Partial<Sala>): Promise<Sala> => {
  try {
    const response = await apiClient.put<BackendResponse<Sala>>(`/salas/${id}`, sala);
    return response.data.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(`API Error: ${error.response?.data?.message || error.message}`);
    }
    throw new Error('Unknown error occurred');
  }
};

export const deleteSala = async (id: string): Promise<void> => {
  try {
    await apiClient.delete<BackendResponse<null>>(`/salas/${id}`);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(`API Error: ${error.response?.data?.message || error.message}`);
    }
    throw new Error('Unknown error occurred');
  }
};

export const getAsientosFuncion = async (funcionId: string): Promise<ApiResponse<AsientoFuncion[]>> => {
  try {
    const response = await apiClient.get<BackendResponse<AsientoFuncion[]>>(`/asientofuncion/disponibilidad/${funcionId}`);
    return { data: response.data.data, status: response.status };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || error.message);
    }
    throw new Error("Error desconocido al obtener asientos");
  }
};
