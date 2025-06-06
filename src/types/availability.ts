export interface IAvailability {
  id: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  isActive: boolean;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateAvailabilityDto {
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  isActive?: boolean;
}
