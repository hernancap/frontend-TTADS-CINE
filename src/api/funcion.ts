import apiClient from "./client";
import { Funcion, TipoFuncion } from "../types";
import axios from "axios";

interface BackendResponse<T> {
  message: string;
  data: T;
}

interface ApiResponse<T> {
  data: T;
  status: number;
}

interface UpdateFuncionPayload {
  fechaHora?: string;
  sala?: string;
  pelicula?: string;
  precio?: number;
  tipo?: TipoFuncion; 
}

export const getFunciones = async (): Promise<ApiResponse<Funcion[]>> => {
  try {
    const response = await apiClient.get<BackendResponse<Funcion[]>>("/funciones");
    return {
      data: response.data.data,
      status: response.status,
    };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        `API Error: ${error.response?.data?.message || error.message}`
      );
    }
    throw new Error("Error desconocido al obtener funciones");
  }
};

export const getFuncionesByPelicula = async (peliculaId: string): Promise<ApiResponse<Funcion[]>> => {
  try {
    const response = await apiClient.get<BackendResponse<Funcion[]>>(`/funciones?pelicula=${peliculaId}`);
    return {
      data: response.data.data,
      status: response.status,
    };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        `API Error: ${error.response?.data?.message || error.message}`
      );
    }
    throw new Error("Error desconocido al obtener funciones");
  }
};

export const getFuncion = async (id: string): Promise<ApiResponse<Funcion>> => {
  try {
    const response = await apiClient.get<BackendResponse<Funcion>>(`/funciones/${id}`);
    return {
      data: response.data.data,
      status: response.status,
    };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        `API Error: ${error.response?.data?.message || error.message}`
      );
    }
    throw new Error("Error desconocido al obtener la función");
  }
};

export const createFuncion = async (data: {
  fechaHora: Date;
  sala: string;
  pelicula: string;
  precio: number;
  tipo: TipoFuncion; 
}): Promise<Funcion> => {
  try {
    const response = await apiClient.post<BackendResponse<Funcion>>("/funciones",
      {
        fechaHora: data.fechaHora.toISOString(),
        sala: data.sala,
        pelicula: data.pelicula,
        precio: data.precio,
        tipo: data.tipo 
      }
    );
    return response.data.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || error.message);
    }
    throw new Error("Error desconocido al crear la función");
  }
};

export const updateFuncion = async (
  id: string,
  data: {
    fechaHora?: Date;
    sala?: string;
    pelicula?: string;
    precio?: number;
    tipo?: TipoFuncion; 
  }
): Promise<Funcion> => {
  try {
    const payload: UpdateFuncionPayload = {
      ...data,
      fechaHora: data.fechaHora ? data.fechaHora.toISOString() : undefined,
    };

    const response = await apiClient.put<BackendResponse<Funcion>>(
      `/funciones/${id}`,
      payload
    );

    return response.data.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        `API Error: ${error.response?.data?.message || error.message}`
      );
    }
    throw new Error("Error desconocido al actualizar la función");
  }
};

export const deleteFuncion = async (id: string): Promise<void> => {
  try {
    await apiClient.delete<BackendResponse<null>>(`/funciones/${id}`);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        `API Error: ${error.response?.data?.message || error.message}`
      );
    }
    throw new Error("Error desconocido al eliminar la función");
  }
};
