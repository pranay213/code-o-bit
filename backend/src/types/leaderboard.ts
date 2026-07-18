export interface LeaderboardEntry {
  rank: number;
  userId: string;
  username: string;
  avatarUrl: string;
  country: string;
  solvedCount: number;
  rating: number;
}

export interface LeaderboardQuery {
  page?: number;
  limit?: number;
  country?: string;
}
