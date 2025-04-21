import axios, { AxiosError } from "axios";

import { useUser } from "@/stores/useUser";

// Extender la interfaz de configuración de Axios
declare module "axios" {
  interface InternalAxiosRequestConfig {
    _retry?: boolean;
  }
}

const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 10000,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Variable para controlar si estamos en proceso de refresh
let isRefreshing = false;
// Cola de callbacks pendientes
let failedQueue: {
  resolve: (value?: unknown) => void;
  reject: (reason?: unknown) => void;
}[] = [];

const processQueue = (error: Error | null, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

axiosClient.interceptors.request.use(
  (config) => {
    const { accessToken } = useUser.getState();

    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

axiosClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config;

    if (!originalRequest) {
      return Promise.reject(error);
    }

    // Si el error es 401 y no estamos ya intentando refrescar
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // Si ya estamos refrescando, añadir a la cola
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return axiosClient(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const { refreshToken } = useUser.getState();

      if (!refreshToken) {
        useUser.getState().logout();
        return Promise.reject(error);
      }

      try {
        // Intentar refrescar el token
        const response = await axiosClient.post("/auth/refresh", {
          refreshToken,
        });

        const { accessToken: newAccessToken, refreshToken: newRefreshToken } =
          response.data;

        // Actualizar tokens en el store
        useUser
          .getState()
          .setUser(useUser.getState().user!, newAccessToken, newRefreshToken);

        // Actualizar el header de la petición original
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

        // Procesar cola de peticiones pendientes
        processQueue(null, newAccessToken);

        return axiosClient(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError as Error);
        useUser.getState().logout();
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  },
);

export default axiosClient;
