import React, { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { createNote, getNotes } from '../api/notes';
import type { Note } from '../types/note';

type Props = {
  candidateId: string;
};

export default function CandidateNotes({
  candidateId,
}: Props): React.JSX.Element {
  const [text, setText] = useState('');
  const queryClient = useQueryClient();

  const { data: notes, isLoading } = useQuery({
    queryKey: ['notes', candidateId],
    queryFn: () => getNotes(candidateId),
  });

  const mutation = useMutation({
    mutationFn: createNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes', candidateId] });
      setText('');
      toast.success('Нотатку додано');
    },
    onError: () => {
      toast.error('Помилка при додаванні нотатки');
    },
  });

  const handleAdd = () => {
    if (!text.trim()) return;

    mutation.mutate({
      candidateId,
      text,
    });
  };

  return (
    <div className="rounded-xl bg-white p-5 shadow">
      <h3 className="mb-4 text-lg font-semibold">Нотатки</h3>

      <div className="mb-4 flex gap-2">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="flex-1 rounded border px-3 py-2"
          placeholder="Додати нотатку..."
        />

        <button
          onClick={handleAdd}
          className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
          disabled={mutation.isPending}
        >
          Додати
        </button>
      </div>

      <div className="space-y-3">
        {isLoading && <p>Завантаження...</p>}

        {!isLoading && notes && notes.length === 0 && (
          <p className="text-sm text-gray-500">Нотаток ще немає</p>
        )}

        {notes?.map((note: Note) => (
          <div key={note._id} className="rounded-lg border bg-gray-50 p-3">
            <p className="text-sm">{note.text}</p>
            <p className="mt-1 text-xs text-gray-400">
              {new Date(note.createdAt).toLocaleString('uk-UA')}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
