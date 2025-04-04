import { Navigate, Route, Routes } from "react-router-dom";

import { LandingPage } from "@/modules/LandingPage";
import { useUser } from "@/stores/useUser";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const user = useUser((s) => s.user);

  if (!user) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

const Services = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Nuestros Servicios</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Servicio 1</h2>
          <p className="text-gray-600">Descripción del servicio 1</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Servicio 2</h2>
          <p className="text-gray-600">Descripción del servicio 2</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Servicio 3</h2>
          <p className="text-gray-600">Descripción del servicio 3</p>
        </div>
      </div>
    </div>
  );
};

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route
        path="/services"
        element={
          <ProtectedRoute>
            <Services />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;
