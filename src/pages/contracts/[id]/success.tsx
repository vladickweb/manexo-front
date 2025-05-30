import { LuLoader } from "react-icons/lu";
import { useNavigate, useParams } from "react-router-dom";

import { Loader } from "@/components/Loader/Loader";
import { useGetContract } from "@/hooks/api/useGetContract";

export const ContractSuccessPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: contract, isLoading } = useGetContract(id || "");

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full mx-auto p-8 bg-white rounded-2xl shadow-sm">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-6">
            <LuLoader className="w-8 h-8 text-green-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            ¡Pago completado con éxito!
          </h1>
          <p className="text-gray-600 mb-8">
            Tu servicio ha sido contratado correctamente
          </p>
        </div>

        {contract && (
          <div className="space-y-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <h2 className="font-semibold mb-2">Detalles del contrato</h2>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Servicio:</span>
                  <span className="font-medium">
                    {contract.service.subcategory?.description}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Monto:</span>
                  <span className="font-medium">{contract.amount}€</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Estado:</span>
                  <span className="font-medium text-green-600">
                    {contract.status === "paid" ? "Pagado" : "Pendiente"}
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={() => navigate("/services")}
              className="w-full py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
            >
              Ir a mis servicios
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
