import axios from 'axios';
import type { Candidate, CandidateStatus } from '../types/candidate';
import { getToken } from '../utils/auth';

const api = axios.create({
  baseURL: 'http://localhost:5050/api',
});

api.interceptors.request.use((config) => {
  const token = getToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export type CreateCandidateDto = {
  fullName: string;
  birthDate: string;
  age: number;
  phone: string;
  position: string;
  unit: string;
  status: CandidateStatus;
  dateOfContact: string;
  dateOfEnrollment: string | null;
  notes: string;
};

export type UpdateCandidateDto = {
  fullName: string;
  birthDate: string;
  age: number;
  phone: string;
  position: string;
  unit: string;
  status: CandidateStatus;
  dateOfContact: string;
  dateOfEnrollment: string | null;
  notes: string;
};

export type CandidateFilters = {
  month?: string;
  status?: string;
  position?: string;
  unit?: string;
  minAge?: number;
  maxAge?: number;
};

export const getCandidates = async (
  filters?: CandidateFilters
): Promise<Candidate[]> => {
  const response = await api.get('/candidates', {
    params: filters,
  });

  return response.data;
};

export const createCandidate = async (
  payload: CreateCandidateDto
): Promise<Candidate> => {
  const response = await api.post('/candidates', payload);
  return response.data;
};

export const updateCandidateStatus = async (
  candidateId: string,
  status: CandidateStatus
): Promise<Candidate> => {
  const response = await api.put(`/candidates/${candidateId}`, { status });
  return response.data;
};

export const updateCandidate = async (
  candidateId: string,
  payload: UpdateCandidateDto
): Promise<Candidate> => {
  const response = await api.put(`/candidates/${candidateId}`, payload);
  return response.data;
};

export const deleteCandidate = async (
  candidateId: string
): Promise<{ message: string }> => {
  const response = await api.delete(`/candidates/${candidateId}`);
  return response.data;
};

export const getCandidateById = async (
  candidateId: string
): Promise<Candidate> => {
  const response = await api.get(`/candidates/${candidateId}`);
  return response.data;
};
