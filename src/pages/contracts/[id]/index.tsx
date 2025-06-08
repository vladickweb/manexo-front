import { FC } from "react";

import {
  LuArrowLeft,
  LuCalendar,
  LuClock,
  LuMapPin,
  LuUser,
} from "react-icons/lu";
import { useNavigate, useParams } from "react-router-dom";

import { useGetContract } from "@/hooks/api/useGetContract";
import { formatFullDate } from "@/utils/date";

export const ContractDetailsPage: FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: contract, isLoading } = useGetContract(id || "");

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!contract) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">
          Contrato no encontrado
        </h1>
        <p className="text-gray-600">
          El contrato que buscas no existe o no tienes permiso para verlo.
        </p>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PAID":
        return "bg-green-100 text-green-800";
      case "PENDING":
        return "bg-yellow-100 text-yellow-800";
      case "CANCELLED":
        return "bg-red-100 text-red-800";
      default:
        return "";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "PAID":
        return "Pagado";
      case "PENDING":
        return "Pendiente";
      case "CANCELLED":
        return "Cancelado";
      default:
        return "";
    }
  };

  const hoursContracted =
    Number(contract.agreedPrice) / Number(contract.service.price);

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center text-gray-600 hover:text-gray-900 mb-6"
      >
        <LuArrowLeft className="w-5 h-5 mr-2" />
        Volver atrás
      </button>

      <div className="bg-white rounded-xl shadow-sm p-6 space-y-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              {contract.service.subcategory?.description}
            </h1>
            <p className="text-gray-600">{contract.service.description}</p>
          </div>
          <span
            className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
              contract.status,
            )}`}
          >
            {getStatusText(contract.status)}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gray-100 rounded-lg">
                <LuUser className="w-5 h-5 text-gray-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Proveedor</p>
                <p className="font-medium">
                  {contract.provider.firstName} {contract.provider.lastName}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gray-100 rounded-lg">
                <LuCalendar className="w-5 h-5 text-gray-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Fecha de creación</p>
                <p className="font-medium">
                  {formatFullDate(contract.createdAt)}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gray-100 rounded-lg">
                <LuClock className="w-5 h-5 text-gray-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Última actualización</p>
                <p className="font-medium">
                  {formatFullDate(contract.updatedAt)}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gray-100 rounded-lg">
                <LuMapPin className="w-5 h-5 text-gray-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Ubicación</p>
                <p className="font-medium">
                  {contract.service.user.location?.address}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 rounded-xl p-6 space-y-4">
            <h2 className="text-lg font-semibold text-gray-900">
              Detalles del pago
            </h2>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Precio por hora</span>
                <span className="font-medium">{contract.service.price}€</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Horas contratadas</span>
                <span className="font-medium">
                  {hoursContracted.toFixed(2)} horas
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Precio acordado</span>
                <span className="font-medium">{contract.agreedPrice}€</span>
              </div>
              <div className="border-t pt-2 mt-2">
                <div className="flex justify-between">
                  <span className="font-semibold">Total</span>
                  <span className="font-bold text-lg">{contract.amount}€</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t pt-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Información adicional
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">ID del contrato</p>
              <p className="font-medium">{contract.id}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Categoría</p>
              <p className="font-medium">
                {contract.service.subcategory?.category?.name}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
