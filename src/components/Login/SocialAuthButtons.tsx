import { FcGoogle } from "react-icons/fc";

import { useGoogleAuth } from "@/hooks/api/useGoogleAuth";

export const SocialAuthButtons = () => {
  const { initiateGoogleAuth } = useGoogleAuth();

  return (
    <div className="w-full max-w-2xl">
      <button
        type="button"
        onClick={initiateGoogleAuth}
        className="w-full font-bold rounded-lg py-3 bg-red-100 text-gray-800 flex items-center justify-center transition-all duration-300 ease-in-out focus:outline-none hover:shadow-md"
      >
        <div className="bg-white p-2 rounded-full">
          <FcGoogle className="h-6 w-6" />
        </div>
        <span className="ml-4">Continuar con Google</span>
      </button>
    </div>
  );
};
