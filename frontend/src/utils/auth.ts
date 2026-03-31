const TOKEN_KEY = 'crm_token';
const USER_KEY = 'crm_user';

export type AuthUser = {
  id: string;
  email: string;
  fullName: string;
  role: 'admin' | 'recruiter';
};

export const saveAuth = (token: string, user: AuthUser) => {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
};

export const getToken = () => {
  return localStorage.getItem(TOKEN_KEY);
};

export const getUser = (): AuthUser | null => {
  const raw = localStorage.getItem(USER_KEY);
  return raw ? JSON.parse(raw) : null;
};

export const clearAuth = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
};

export const isAuthenticated = () => {
  return Boolean(getToken());
};

export const isAdmin = () => {
  const user = getUser();
  return user?.role === 'admin';
};
