import axios from 'axios';
import type { Candidate, CandidateStatus } from '../types/candidate';

const api = axios.create({
  baseURL: 'http://localhost:5050/api',
});

export type CreateCandidateDto = {
  fullName: string;
  birthDate: string;
  age: number;
  phone: string;
  position: string;
  unit: string;
  status: CandidateStatus;
  notes: string;
};

export const getCandidates = async (): Promise<Candidate[]> => {
  const response = await api.get('/candidates');
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
