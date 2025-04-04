import { useEffect } from "react";

import { useNavigate } from "react-router-dom";

import { useGetUser } from "@/hooks/api/useGetUser";
import { useUser } from "@/stores/useUser";

export const useAuth = () => {
  const navigate = useNavigate();
  const { user, accessToken, setUser } = useUser();
  const { data: userData, isLoading, isError } = useGetUser();

  useEffect(() => {
    if (accessToken && !user && !isLoading && userData) {
      const refreshToken = useUser.getState().refreshToken || "";
      setUser(userData, accessToken, refreshToken);
    }
  }, [accessToken, user, isLoading, userData, setUser]);

  useEffect(() => {
    if (isError) {
      navigate("/");
    }
  }, [isError, navigate]);

  return { user, accessToken, isLoading };
};
