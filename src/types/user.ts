export enum UserRole {
  ADMIN = 'admin',
  STAFF = 'staff',
  CLIENT = 'client'
}

export interface User {
  id: string;
  email: string;
  role: UserRole;
  created_at: string;
}
