import { useNavigate } from "react-router-dom";

import axiosClient from "@/api/axiosClient";
import { useUser } from "@/stores/useUser";

export const useGoogleAuth = () => {
  const setUser = useUser((s) => s.setUser);
  const setTokens = useUser((s) => s.setTokens);
  const navigate = useNavigate();

  const initiateGoogleAuth = () => {
    const redirectUri = `${window.location.origin}/auth/google/callback`;
    const authUrl = `${import.meta.env.VITE_API_URL}/auth/google?redirect_uri=${encodeURIComponent(redirectUri)}`;

    window.location.href = authUrl;
  };

  const handleAuthSuccess = async (
    accessToken: string,
    refreshToken: string,
  ) => {
    try {
      setTokens(accessToken, refreshToken);

      const { data: user } = await axiosClient.get("/auth/me");

      setUser(user);

      navigate("/search", { replace: true });
    } catch (error) {
      console.error("❌ Error processing auth success:", error);
      navigate("/", { replace: true });
    }
  };

  return {
    initiateGoogleAuth,
    handleAuthSuccess,
  };
};
