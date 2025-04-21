import { MoreVertical } from "lucide-react";

import { Button } from "@/components/Button/Button";

interface ServiceCardProps {
  title: string;
  description: string;
  price: number;
  category: string;
  onEdit?: () => void;
  onDelete?: () => void;
}

export const ServiceCard = ({
  title,
  description,
  price,
  category,
  onEdit,
  onDelete,
}: ServiceCardProps) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <div className="flex justify-between items-start">
        <h3 className="text-lg font-semibold">{title}</h3>
        <div className="relative">
          <Button variant="default" className="p-1" onClick={() => {}}>
            <MoreVertical className="h-4 w-4" />
          </Button>
          <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
            <div className="py-1">
              <button
                onClick={onEdit}
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                Editar
              </button>
              <button
                onClick={onDelete}
                className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      </div>
      <p className="mt-2 text-gray-600">{description}</p>
      <div className="mt-4 flex justify-between items-center">
        <span className="text-lg font-bold text-primary">${price}</span>
        <span className="text-sm text-gray-500">{category}</span>
      </div>
    </div>
  );
};
