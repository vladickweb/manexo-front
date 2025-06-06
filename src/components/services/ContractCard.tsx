import { FC, useMemo, useState } from "react";

import {
  LuCalendar,
  LuClock,
  LuEuro,
  LuMapPin,
  LuMessageSquare,
  LuStar,
} from "react-icons/lu";
import { useNavigate } from "react-router-dom";

import { Button } from "@/components/Button/Button";
import { UserAvatar } from "@/components/UserAvatar";
import { Contract } from "@/hooks/api/useCreateContract";

import { CreateReviewModal } from "./CreateReviewModal";

interface ContractCardProps {
  contract: Contract;
}

export const ContractCard: FC<ContractCardProps> = ({ contract }) => {
  const navigate = useNavigate();
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-ES", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const { service, provider, bookings, amount } = useMemo(
    () => contract,
    [contract],
  );

  const sortedBookings = useMemo(
    () =>
      [...bookings].sort((a, b) => {
        const dateA = new Date(`${a.date}T${a.startTime}`);
        const dateB = new Date(`${b.date}T${b.startTime}`);
        return dateA.getTime() - dateB.getTime();
      }),
    [bookings],
  );

  const firstBooking = useMemo(() => sortedBookings[0], [sortedBookings]);

  const earliestStartTime = useMemo(
    () =>
      sortedBookings.reduce(
        (earliest, booking) =>
          booking.startTime < earliest ? booking.startTime : earliest,
        sortedBookings[0].startTime,
      ),
    [sortedBookings],
  );

  const latestEndTime = useMemo(
    () =>
      sortedBookings.reduce(
        (latest, booking) =>
          booking.endTime > latest ? booking.endTime : latest,
        sortedBookings[0].endTime,
      ),
    [sortedBookings],
  );

  if (!contract?.service || !contract?.bookings?.length) {
    return null;
  }
  return (
    <>
      <div className="bg-white rounded-xl shadow-sm p-6 space-y-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <UserAvatar user={provider} size="lg" />
            <div>
              <h3 className="font-semibold">
                {provider.firstName} {provider.lastName}
              </h3>
              <p className="text-sm text-gray-500">
                {service.subcategory?.name || "Servicio"}
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <p className="text-gray-600">{service.description}</p>

          {service.user.location && (
            <div className="flex items-center text-sm text-gray-500">
              <LuMapPin className="mr-1 h-4 w-4" />
              <span>{service.user.location.address}</span>
            </div>
          )}

          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center text-gray-500">
              <LuCalendar className="mr-1 h-4 w-4" />
              <span>{formatDate(firstBooking.date)}</span>
            </div>
            <div className="flex items-center text-gray-500">
              <LuClock className="mr-1 h-4 w-4" />
              <span>{`${earliestStartTime} - ${latestEndTime}`}</span>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center space-x-2">
              <LuEuro className="h-4 w-4 text-gray-500" />
              <span className="text-lg font-semibold">{amount}€</span>
              <span className="text-sm text-gray-500">total</span>
            </div>
            <span className="text-sm text-gray-500">
              {bookings.length} {bookings.length === 1 ? "sesión" : "sesiones"}
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t">
          <div className="flex items-center gap-3 w-full justify-between">
            <Button
              variant="secondary"
              onClick={() => navigate(`/contracts/${contract.id}`)}
              className="flex items-center"
            >
              <LuMessageSquare className="mr-2 h-4 w-4" />
              Ver contrato
            </Button>
            {contract.canReview ? (
              <Button
                variant="primary"
                onClick={() => setIsReviewModalOpen(true)}
                className="flex items-center"
              >
                <LuStar className="mr-2 h-4 w-4" />
                Dejar review
              </Button>
            ) : (
              <span className="text-sm text-gray-500 font-semibold bg-green-100 px-2 py-1 rounded-full">
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
        onSuccess={() => {
          // Aquí podrías actualizar la lista de contratos o mostrar un mensaje de éxito
        }}
      />
    </>
  );
};
