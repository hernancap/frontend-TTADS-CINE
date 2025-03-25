import apiClient from "../api/client";
import axios from "axios";

export const login = async (email: string, password: string) => {
  try {
    const response = await apiClient.post("/usuarios/login", { email, password });
    return response.data.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message || "Error de autenticación"
      );
    }
    throw new Error("Error desconocido al iniciar sesión");
  }
};