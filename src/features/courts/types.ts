export type CourtSummary = {
  id: string;
  name: string;
  isActive: boolean;
};

export type AvailabilitySlot = {
  startsAt: string;
  endsAt: string;
  amountFjd: number;
  isAvailable: boolean;
};
