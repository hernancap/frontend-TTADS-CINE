import apiClient from "./client";
import { Usuario } from "../types";
import axios from "axios";

interface BackendResponse<T> {
    message: string;
    data: T;
}

interface ApiResponse<T> {
    data: T;
    status: number;
}

export const getUsuarios = async (): Promise<ApiResponse<Usuario[]>> => {
    try {
        const response = await apiClient.get<BackendResponse<Usuario[]>>("/usuarios");
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
        throw new Error("Error desconocido al obtener usuarios");
    }
};

export const getUsuario = async (id: string): Promise<ApiResponse<Usuario>> => {
    try {
        const response = await apiClient.get<BackendResponse<Usuario>>(`/usuarios/${id}`);
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
        throw new Error("Error desconocido al obtener el usuario");
    }
};

export const createUsuario = async (data: {
    nombre: string;
    email: string;
    password: string;
}): Promise<Usuario> => {
    try {
        const response = await apiClient.post<BackendResponse<Usuario>>("/usuarios", data);
        return response.data.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            throw new Error(
                `API Error: ${error.response?.data?.message || error.message}`
            );
        }
        throw new Error("Error desconocido al crear el usuario");
    }
};

export const updateUsuario = async (
    id: string,
    usuario: Partial<Omit<Usuario, 'favoritos'> & { favoritos: string[] }> 
): Promise<Usuario> => {
    try {
        const response = await apiClient.put<BackendResponse<Usuario>>(
            `/usuarios/${id}`,
            usuario
        );
        return response.data.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            throw new Error(
                `API Error: ${error.response?.data?.message || error.message}`
            );
        }
        throw new Error("Error desconocido al actualizar el usuario");
    }
};

export const deleteUsuario = async (id: string): Promise<void> => {
    try {
        await apiClient.delete<BackendResponse<null>>(`/usuarios/${id}`);
    } catch (error) {
        if (axios.isAxiosError(error)) {
            throw new Error(
                `API Error: ${error.response?.data?.message || error.message}`
            );
        }
        throw new Error("Error desconocido al eliminar el usuario");
    }
};
