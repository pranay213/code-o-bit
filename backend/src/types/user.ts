import { Role } from '@/constants/roles';

export interface UserProfile {
  id: string;
  username: string;
  email: string;
  role: Role;
  bio: string;
  avatarUrl: string;
  country: string;
  solvedCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface UpdateProfileDto {
  username?: string;
  bio?: string;
  avatarUrl?: string;
  country?: string;
}

export interface UpdateRoleDto {
  role: Role;
}
