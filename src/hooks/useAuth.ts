import { useEffect } from "react";

import { useNavigate } from "react-router-dom";

import { useGetUser } from "@/hooks/api/useGetUser";
import { useUser } from "@/stores/useUser";

export const useAuth = () => {
  const navigate = useNavigate();
  const { accessToken, refreshToken, setUser } = useUser();
  const { data: user, isLoading, isError } = useGetUser();

  useEffect(() => {
    if (isError && accessToken) {
      navigate("/", { replace: true });
    }
  }, [isError, accessToken, navigate]);

  useEffect(() => {
    if (user && accessToken) {
      setUser(user, accessToken, refreshToken || "");
    }
  }, [user, accessToken, refreshToken, setUser]);

  return {
    isLoading,
    isAuthenticated: !!accessToken,
    user,
  };
};
