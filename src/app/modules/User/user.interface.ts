import { UserRole, UserStatuses } from '@prisma/client';

export type Iusers = {
  id: string;
  email: string;
  role: UserRole;
  password: string;
  needs_password_change: boolean;
  status: UserStatuses;
  created_at: Date;
  updated_at: Date;
};
