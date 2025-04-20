import { User } from "@/types/user";
import { API } from "@/utils/axiosClient";

export const register = async (data: User) => {
  try {
    const response = await API.post("/auth/register", data);

    return response;
  } catch (error) {
    throw error;
  }
};
