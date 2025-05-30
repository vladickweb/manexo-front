import { FC } from "react";

import { Avatar, Divider, Group, Rating, Stack, Text } from "@mantine/core";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { AnimatePresence, motion } from "framer-motion";
import { LuX } from "react-icons/lu";

import { useGetServiceReviews } from "@/hooks/api/useReviews";

interface ReviewsModalProps {
  isOpen: boolean;
  onClose: () => void;
  serviceId: string | number;
}

export const ReviewsModal: FC<ReviewsModalProps> = ({
  isOpen,
  onClose,
  serviceId,
}) => {
  const { data: reviewsData, isLoading } = useGetServiceReviews(
    String(serviceId),
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-2xl font-bold">Reseñas del servicio</h2>
                  {reviewsData && (
                    <div className="flex items-center gap-2 mt-1">
                      <Rating
                        value={reviewsData.averageRating}
                        fractions={2}
                        readOnly
                        color="orange"
                        size="md"
                      />
                      <Text size="sm" c="dimmed">
                        {reviewsData.totalReviews} reseñas
                      </Text>
                    </div>
                  )}
                </div>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <LuX className="w-5 h-5" />
                </button>
              </div>

              {isLoading ? (
                <div className="flex justify-center items-center h-40">
                  <Text>Cargando reseñas...</Text>
                </div>
              ) : (
                <Stack gap="lg">
                  {reviewsData?.reviews.map((review) => (
                    <div key={review.id} className="space-y-2">
                      <Group>
                        <Avatar size="md" radius="xl" color="blue">
                          {review.user.firstName[0]}
                          {review.user.lastName[0]}
                        </Avatar>
                        <div>
                          <Text fw={500}>
                            {review.user.firstName} {review.user.lastName}
                          </Text>
                          <Text size="sm" c="dimmed">
                            {format(
                              new Date(review.createdAt),
                              "d 'de' MMMM 'de' yyyy",
                              {
                                locale: es,
                              },
                            )}
                          </Text>
                        </div>
                      </Group>
                      <Rating
                        value={review.rating}
                        readOnly
                        color="orange"
                        size="sm"
                      />
                      <Text size="sm">{review.comment}</Text>
                      <Divider />
                    </div>
                  ))}
                </Stack>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
