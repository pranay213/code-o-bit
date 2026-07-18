import { z } from 'zod';
import { ROLES } from '@/constants/roles';

export const updateProfileSchema = z.object({
  username: z
    .string()
    .min(3)
    .max(30)
    .regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores')
    .optional(),
  bio: z.string().max(500).optional(),
  avatarUrl: z.string().url('Invalid URL').optional(),
  country: z.string().max(100).optional(),
});

export const updateRoleSchema = z.object({
  role: z.enum([ROLES.ADMIN, ROLES.USER]),
});

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
export type UpdateRoleInput = z.infer<typeof updateRoleSchema>;
