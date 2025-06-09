import { useEffect, useState } from "react";

import { useLocation, useNavigate } from "react-router-dom";

import { useGoogleAuth } from "@/hooks/api/useGoogleAuth";

export const AuthSuccess = () => {
  const { handleAuthSuccess } = useGoogleAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    const processAuthSuccess = async () => {
      if (isProcessing) {
        return;
      }

      const params = new URLSearchParams(location.search);
      const accessToken = params.get("access_token");
      const refreshToken = params.get("refresh_token");

      if (!accessToken || !refreshToken) {
        navigate("/", { replace: true });
        return;
      }

      try {
        setIsProcessing(true);
        await handleAuthSuccess(accessToken, refreshToken);
      } catch (error) {
        console.error("❌ Error processing auth success:", error);
        navigate("/", { replace: true });
      } finally {
        setIsProcessing(false);
      }
    };

    processAuthSuccess();
  }, [location.search, navigate, handleAuthSuccess, isProcessing]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
    </div>
  );
};
