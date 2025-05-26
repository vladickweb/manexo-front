import { FC } from "react";

import { LuMessageSquare } from "react-icons/lu";
import { useNavigate } from "react-router-dom";

import { Button } from "@/components/Button/Button";
import { IUser } from "@/types/user";

interface ContractCardProps {
  title: string;
  description: string;
  price: string;
  tag: string;
  provider: IUser;
  status: "PENDING" | "PAID" | "CANCELLED";
  contractId: string;
}

export const ContractCard: FC<ContractCardProps> = ({
  title,
  description,
  price,
  tag,
  provider,
  status,
  contractId,
}) => {
  const navigate = useNavigate();

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

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 space-y-4">
      <div className="flex items-start justify-between">
        <div className="flex items-center space-x-3">
          <img
            src={provider.avatar || "/default-avatar.png"}
            alt={`${provider.firstName} ${provider.lastName}`}
            className="w-10 h-10 rounded-full"
          />
          <div>
            <h3 className="font-semibold">
              {provider.firstName} {provider.lastName}
            </h3>
            <p className="text-sm text-gray-500">{title}</p>
          </div>
        </div>
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
            status,
          )}`}
        >
          {getStatusText(status)}
        </span>
      </div>

      <p className="text-gray-600 line-clamp-2">{description}</p>

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span className="text-lg font-semibold">{price}€</span>
          <span className="text-sm text-gray-500">/hora</span>
        </div>
        {tag && (
          <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">
            {tag}
          </span>
        )}
      </div>

      <div className="flex items-center justify-between pt-4 border-t">
        <Button
          variant="secondary"
          onClick={() => navigate(`/contracts/${contractId}`)}
          className="flex items-center"
        >
          <LuMessageSquare className="mr-2 h-4 w-4" />
          Ver contrato
        </Button>
      </div>
    </div>
  );
};
