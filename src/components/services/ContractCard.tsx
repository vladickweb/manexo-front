import { useMemo, useState } from "react";

import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Calendar, Clock, MapPin, Star, User } from "lucide-react";
import { LuMessageSquare, LuStar } from "react-icons/lu";
import { useNavigate } from "react-router-dom";

import { Button } from "@/components/Button/Button";
import { Contract } from "@/hooks/api/useCreateContract";

import { CreateReviewModal } from "./CreateReviewModal";

interface ContractCardProps {
  contract: Contract;
  isProvider: boolean;
  showAddToCalendar?: boolean;
}

export const ContractCard = ({
  contract,
  isProvider,
  showAddToCalendar = false,
}: ContractCardProps) => {
  const navigate = useNavigate();
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const otherUser = isProvider ? contract.client : contract.provider;
  const booking = contract.bookings[0];

  const { service } = useMemo(() => contract, [contract]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "paid":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "paid":
        return "Pagado";
      case "pending":
        return "Pendiente";
      case "cancelled":
        return "Cancelado";
      default:
        return status;
    }
  };

  const handleAddToCalendar = () => {
    if (!booking?.date || !booking?.startTime || !booking?.endTime) {
      alert("No se han encontrado eventos válidos que añadir a tu calendario.");
      return;
    }

    const bookingDate = new Date(booking.date);

    const [startHours, startMinutes] = booking.startTime.split(":").map(Number);
    const [endHours, endMinutes] = booking.endTime.split(":").map(Number);

    const startDate = new Date(bookingDate);
    startDate.setHours(startHours, startMinutes, 0, 0);

    const endDate = new Date(bookingDate);
    endDate.setHours(endHours, endMinutes, 0, 0);

    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      alert("No se han encontrado eventos válidos que añadir a tu calendario.");
      return;
    }

    const pad = (n: number) => n.toString().padStart(2, "0");
    const formatICSDate = (date: Date) =>
      `${date.getUTCFullYear()}${pad(date.getUTCMonth() + 1)}${pad(date.getUTCDate())}T${pad(date.getUTCHours())}${pad(date.getUTCMinutes())}00Z`;

    const icsContent = `BEGIN:VCALENDAR\nVERSION:2.0\nBEGIN:VEVENT\nSUMMARY:${contract.service.subcategory.name} con ${otherUser.firstName} ${otherUser.lastName}\nDESCRIPTION:Servicio contratado en Menexo\nDTSTART:${formatICSDate(startDate)}\nDTEND:${formatICSDate(endDate)}\nLOCATION:-\nEND:VEVENT\nEND:VCALENDAR`;

    const blob = new Blob([icsContent], { type: "text/calendar" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `evento-menexo.ics`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (!contract?.service || !contract?.bookings?.length) {
    return null;
  }

  return (
    <>
      <div className="bg-white rounded-3xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-4">
          <div className="flex justify-between items-start mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <User className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900">
                  {otherUser.firstName} {otherUser.lastName}
                </h3>
                <p className="text-sm text-gray-500">{otherUser.email}</p>
              </div>
            </div>
            <span
              className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                contract.status,
              )}`}
            >
              {getStatusText(contract.status)}
            </span>
          </div>

          <div className="space-y-3">
            <div className="flex items-center text-sm text-gray-600">
              <Calendar className="w-4 h-4 mr-2" />
              <span>
                {format(new Date(booking.date), "EEEE d 'de' MMMM", {
                  locale: es,
                })}
              </span>
            </div>

            <div className="flex items-center text-sm text-gray-600">
              <Clock className="w-4 h-4 mr-2" />
              <span>
                {booking.startTime} - {booking.endTime}
              </span>
            </div>

            <div className="flex items-center text-sm text-gray-600">
              <MapPin className="w-4 h-4 mr-2" />
              <span>{contract.service.user.location?.address}</span>
            </div>

            {contract.service.reviews.length > 0 && (
              <div className="flex items-center text-sm text-gray-600">
                <Star className="w-4 h-4 mr-2 text-yellow-400" />
                <span>
                  {(
                    contract.service.reviews.reduce(
                      (acc, review) => acc + review.rating,
                      0,
                    ) / contract.service.reviews.length
                  ).toFixed(1)}{" "}
                  ({contract.service.reviews.length} reseñas)
                </span>
              </div>
            )}
          </div>

          <div className="mt-4 pt-4 border-t border-gray-100">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">Precio acordado</span>
              <span className="font-medium text-gray-900">
                {contract.agreedPrice}€
              </span>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 px-4 py-3 border-t border-gray-100">
          <div className="flex items-center justify-between gap-3">
            <Button
              variant="secondary"
              onClick={() => navigate(`/contracts/${contract.id}`)}
              className="flex-1 flex items-center justify-center"
            >
              <LuMessageSquare className="mr-2 h-4 w-4" />
              Ver contrato
            </Button>
            {contract.canReview ? (
              <Button
                variant="primary"
                onClick={() => setIsReviewModalOpen(true)}
                className="flex-1 flex items-center justify-center"
              >
                <LuStar className="mr-2 h-4 w-4" />
                Dejar review
              </Button>
            ) : showAddToCalendar ? (
              <Button
                variant="primary"
                onClick={handleAddToCalendar}
                className="flex-1 flex items-center justify-center"
              >
                <Calendar className="mr-2 h-4 w-4" />
                Añadir al calendario
              </Button>
            ) : (
              <span className="flex-1 text-sm text-gray-500 font-semibold bg-green-100 px-4 py-2 rounded-lg text-center">
                Evaluado
              </span>
            )}
          </div>
        </div>
      </div>

      <CreateReviewModal
        serviceId={service.id.toString()}
        isOpen={isReviewModalOpen}
        onClose={() => setIsReviewModalOpen(false)}
      />
    </>
  );
};
