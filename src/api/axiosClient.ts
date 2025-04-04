import axios from "axios";

import { useUser } from "@/stores/useUser";

const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 10000,
});

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
  (error) => Promise.reject(error),
);

export default axiosClient;
