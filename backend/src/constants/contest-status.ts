export const CONTEST_STATUS = {
  UPCOMING: 'upcoming',
  ONGOING: 'ongoing',
  ENDED: 'ended',
} as const;

export type ContestStatus = (typeof CONTEST_STATUS)[keyof typeof CONTEST_STATUS];
