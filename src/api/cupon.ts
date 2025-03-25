import apiClient from "./client";
import { Cupon } from "../types";
import axios from "axios";

interface BackendResponse<T> {
  message: string;
  data: T;
}

interface ApiResponse<T> {
  data: T;
  status: number;
}

export const getCupones = async (): Promise<ApiResponse<Cupon[]>> => {
  try {
    const response = await apiClient.get<BackendResponse<Cupon[]>>("/cupones");
    return {
      data: response.data.data,
      status: response.status,
    };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || error.message);
    }
    throw new Error("Error al obtener cupones");
  }
};

export const getCupon = async (id: string): Promise<ApiResponse<Cupon>> => {
  try {
    const response = await apiClient.get<BackendResponse<Cupon>>(`/cupones/${id}`);
    return {
      data: response.data.data,
      status: response.status,
    };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || error.message);
    }
    throw new Error("Error al obtener el cupón");
  }
};

export const getCuponesUser = async (userId: string): Promise<ApiResponse<Cupon[]>> => {
  try {
    const response = await apiClient.get<BackendResponse<Cupon[]>>(`/cupones/usuario/${userId}`);
    return {
      data: response.data.data,
      status: response.status,
    };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || error.message);
    }
    throw new Error("Error al obtener los cupones del usuario");
  }
};


export const createCupon = async (data: {
  codigo: string;
  descuento: number;
  fechaExpiracion: string;
  usuario: string;
}): Promise<Cupon> => {
  try {
    const response = await apiClient.post<BackendResponse<Cupon>>("/cupones", data);
    return response.data.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || error.message);
    }
    throw new Error("Error al crear el cupón");
  }
};

export const updateCupon = async (
  id: string,
  data: {
    codigo?: string;
    descuento?: number;
    fechaExpiracion?: string;
  }
): Promise<Cupon> => {
  try {
    const response = await apiClient.put<BackendResponse<Cupon>>(`/cupones/${id}`, data);
    return response.data.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || error.message);
    }
    throw new Error("Error al actualizar el cupón");
  }
};

export const deleteCupon = async (id: string): Promise<void> => {
  try {
    await apiClient.delete<BackendResponse<null>>(`/cupones/${id}`);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || error.message);
    }
    throw new Error("Error al eliminar el cupón");
  }
};
