import { useQuery } from "@tanstack/react-query";

import axiosClient from "@/api/axiosClient";

interface AvailableSlot {
  start: string;
  end: string;
}

interface DayAvailability {
  date: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  isActive: boolean;
  availableSlots: AvailableSlot[];
}

export interface ServiceAvailabilityResponse {
  serviceId: number;
  provider: {
    id: number;
    name: string;
  };
  weekStart: string;
  weekEnd: string;
  weekAvailability: DayAvailability[];
}

export const useGetServiceAvailability = (
  serviceId: number,
  date: string,
  options?: {
    enabled?: boolean;
  },
) => {
  return useQuery<ServiceAvailabilityResponse>({
    queryKey: ["service-availability", serviceId, date],
    queryFn: async () => {
      const { data } = await axiosClient.get<ServiceAvailabilityResponse>(
        `/services/${serviceId}/availability?date=${date}`,
      );
      return data;
    },
    enabled: options?.enabled ?? true,
  });
};
