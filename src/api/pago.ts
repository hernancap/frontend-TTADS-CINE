import apiClient from "./client";
import axios from "axios";

interface BackendResponse<T> {
  message: string;
  data: T;
}

export const createPreference = async (
  items: { id: string; title: string; quantity: number; unit_price: number }[],
  userId: string,
  funcionId: string,
  asientoIds: string[]
): Promise<{ preferenceId: string }> => {
  try {
    const response = await apiClient.post<BackendResponse<string>>("/mercadopago/create-preference", { items, userId, funcionId, asientoIds } );
    return { preferenceId: response.data.data };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || error.message);
    }
    throw new Error("Error desconocido al crear preferencia de pago");
  }
};
