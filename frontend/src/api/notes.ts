import api from './api';
import type { Note } from '../types/note';

export const getNotes = async (candidateId: string): Promise<Note[]> => {
  const res = await api.get(`/notes/${candidateId}`);
  return res.data;
};

export const createNote = async (data: {
  candidateId: string;
  text: string;
}): Promise<Note> => {
  const res = await api.post('/notes', data);
  return res.data;
};
