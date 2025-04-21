import { useEffect } from "react";

import { useNavigate } from "react-router-dom";

import { useGetUser } from "@/hooks/api/useGetUser";
import { useUser } from "@/stores/useUser";

export const useAuth = () => {
  const navigate = useNavigate();
  const { accessToken } = useUser();
  const { data: user, isLoading, isError } = useGetUser();

  useEffect(() => {
    if (isError) {
      navigate("/", { replace: true });
    }
  }, [isError, navigate]);

  return {
    isLoading,
    isAuthenticated: !!accessToken,
    user,
  };
};
