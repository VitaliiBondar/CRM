import api from './api';
import type { User, UserRole } from '../types/user';

export type CreateUserDto = {
  email: string;
  password: string;
  fullName: string;
  role: UserRole;
};

export const getUsers = async (): Promise<User[]> => {
  const response = await api.get('/users');
  return response.data;
};

export const createUser = async (payload: CreateUserDto): Promise<User> => {
  const response = await api.post('/users', payload);
  return response.data;
};
