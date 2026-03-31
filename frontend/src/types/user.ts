export type UserRole = 'admin' | 'recruiter';

export type User = {
  _id: string;
  email: string;
  fullName: string;
  role: UserRole;
  createdAt: string;
  updatedAt: string;
};
