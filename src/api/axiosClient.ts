import axios from "axios";

const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 10000,
});

axiosClient.interceptors.request.use(
  (config) => {
    // TODO: Add authorization token when available
    return config;
  },
  (error) => Promise.reject(error),
);

axiosClient.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject(error),
);

export default axiosClient;
