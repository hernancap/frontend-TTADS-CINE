import apiClient from './client';
import axios from 'axios';
import { Actor } from '../types';

interface BackendResponse<T> {
  message: string;
  data: T;
}

export const getActors = async (): Promise<Actor[]> => {
  try {
    const response = await apiClient.get<BackendResponse<Actor[]>>('/actors');
    return response.data.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || error.message);
    }
    throw new Error('Unknown error occurred');
  }
};

export const createActor = async (actor: { nombre: string }): Promise<Actor> => {
  try {
    const response = await apiClient.post<BackendResponse<Actor>>('/actors', actor);
    return response.data.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || error.message);
    }
    throw new Error('Unknown error occurred');
  }
};

export const deleteActor = async (id: string): Promise<void> => {
  try {
    await apiClient.delete(`/actors/${id}`);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || error.message);
    }
    throw new Error('Unknown error occurred');
  }
};
