import clientApi from "../axios/axios";
import type {
  AuthResponse,
  LoginPayload,
  RegisterPayload,
} from "../types/auth.type";

export const loginUser = async (
  payload: LoginPayload,
): Promise<AuthResponse> => {
  const { data } = await clientApi.post<AuthResponse>("/auth/login", payload);
  return data;
};

export const registerUser = async (
  payload: RegisterPayload,
): Promise<AuthResponse> => {
  const { data } = await clientApi.post<AuthResponse>(
    "/auth/register",
    payload,
  );

  return data;
};

export const logoutUser = (): void => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
};
