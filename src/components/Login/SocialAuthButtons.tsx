import { FaApple } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";

export const SocialAuthButtons = () => {
  return (
    <div className="flex flex-col md:flex-row justify-between gap-4 w-full max-w-2xl">
      <button
        type="button"
        className="w-full md:w-1/2 font-bold rounded-lg py-3 bg-red-100 text-gray-800 flex items-center justify-center transition-all duration-300 ease-in-out focus:outline-none hover:shadow-md"
      >
        <div className="bg-white p-2 rounded-full">
          <FcGoogle className="h-6 w-6" />
        </div>
        <span className="ml-4">Google</span>
      </button>

      <button
        type="button"
        className="w-full md:w-1/2 font-bold rounded-lg py-3 bg-gray-100 text-gray-800 flex items-center justify-center transition-all duration-300 ease-in-out focus:outline-none hover:shadow-md"
      >
        <div className="bg-white p-1 rounded-full">
          <FaApple className="h-6 w-6" />
        </div>
        <span className="ml-4">Apple</span>
      </button>
    </div>
  );
};
