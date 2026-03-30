import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5050/api',
});

export type LoginDto = {
  email: string;
  password: string;
};

export type LoginResponse = {
  token: string;
  user: {
    id: string;
    email: string;
    fullName: string;
    role: string;
  };
};

export const login = async (payload: LoginDto): Promise<LoginResponse> => {
  const response = await api.post('/auth/login', payload);
  return response.data;
};
