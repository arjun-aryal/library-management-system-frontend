import axios, { AxiosError, type AxiosInstance } from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api/v1";

const clientApi: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

clientApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

clientApi.interceptors.response.use(
  (response) => response,
  (error: AxiosError<any>) => {
    const data = error.response?.data;

    // for validation erro
    if (data?.errors && Array.isArray(data.errors)) {
      const validationMessage = data.errors
        .map((err: any) => `${err.path}: ${err.message}`)
        .join(", ");

      return Promise.reject(new Error(validationMessage));
    }
    const message = data?.message || error.message || "Something went wrong";

    return Promise.reject(new Error(message));
  },
);
export default clientApi;
