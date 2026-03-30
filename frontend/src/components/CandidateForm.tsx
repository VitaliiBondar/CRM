import React from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createCandidate, type CreateCandidateDto } from '../api/candidates';
import toast from 'react-hot-toast';

const candidateSchema = z.object({
  fullName: z.string().min(3, 'Введи ПІБ'),
  birthDate: z.string().min(1, 'Вкажи дату народження'),
  age: z.number().min(18, 'Мінімум 18 років'),
  phone: z.string().min(8, 'Вкажи телефон'),
  position: z.string().min(2, 'Вкажи посаду'),
  unit: z.string().min(2, 'Вкажи підрозділ'),
  status: z.enum(['in_work', 'documents', 'vlk', 'enrolled', 'declined']),
  dateOfContact: z.string().min(1, 'Вкажи дату звернення'),
  dateOfEnrollment: z.string().nullable(),
  notes: z.string().optional(),
});

type CandidateFormValues = z.infer<typeof candidateSchema>;

type CandidateFormProps = {
  onSuccess?: () => void;
};

export default function CandidateForm({
  onSuccess,
}: CandidateFormProps): React.JSX.Element {
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm<CandidateFormValues>({
    resolver: zodResolver(candidateSchema),
    defaultValues: {
      fullName: '',
      birthDate: '',
      age: 18,
      phone: '',
      position: '',
      unit: '',
      status: 'in_work',
      dateOfContact: '',
      dateOfEnrollment: null,
      notes: '',
    },
  });

  const selectedStatus = watch('status');

  const mutation = useMutation({
    mutationFn: (data: CreateCandidateDto) => createCandidate(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['candidates'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-candidates'] });
      reset();
      toast.success('Кандидата успішно додано');
      onSuccess?.();
    },
    onError: () => {
      toast.error('Не вдалося зберегти кандидата');
    },
  });

  const onSubmit: SubmitHandler<CandidateFormValues> = (data) => {
    mutation.mutate({
      ...data,
      dateOfEnrollment:
        data.dateOfEnrollment && data.dateOfEnrollment.trim() !== ''
          ? data.dateOfEnrollment
          : null,
      notes: data.notes ?? '',
    });
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="grid grid-cols-1 gap-4 md:grid-cols-2"
    >
      <div className="md:col-span-2">
        <label className="mb-1 block text-sm font-medium">ПІБ</label>
        <input
          {...register('fullName')}
          className="w-full rounded-lg border px-3 py-2"
        />
        {errors.fullName && (
          <p className="mt-1 text-sm text-red-600">{errors.fullName.message}</p>
        )}
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">
          Дата народження
        </label>
        <input
          type="date"
          {...register('birthDate')}
          className="w-full rounded-lg border px-3 py-2"
        />
        {errors.birthDate && (
          <p className="mt-1 text-sm text-red-600">
            {errors.birthDate.message}
          </p>
        )}
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">Вік</label>
        <input
          type="number"
          {...register('age', { valueAsNumber: true })}
          className="w-full rounded-lg border px-3 py-2"
        />
        {errors.age && (
          <p className="mt-1 text-sm text-red-600">{errors.age.message}</p>
        )}
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">Телефон</label>
        <input
          {...register('phone')}
          className="w-full rounded-lg border px-3 py-2"
        />
        {errors.phone && (
          <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>
        )}
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">Посада</label>
        <input
          {...register('position')}
          className="w-full rounded-lg border px-3 py-2"
        />
        {errors.position && (
          <p className="mt-1 text-sm text-red-600">{errors.position.message}</p>
        )}
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">Підрозділ</label>
        <input
          {...register('unit')}
          className="w-full rounded-lg border px-3 py-2"
        />
        {errors.unit && (
          <p className="mt-1 text-sm text-red-600">{errors.unit.message}</p>
        )}
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">Статус</label>
        <select
          {...register('status')}
          className="w-full rounded-lg border px-3 py-2"
        >
          <option value="in_work">В роботі</option>
          <option value="documents">Збір документів</option>
          <option value="vlk">ВЛК</option>
          <option value="enrolled">Зарахований</option>
          <option value="declined">Відмовився</option>
        </select>
        {errors.status && (
          <p className="mt-1 text-sm text-red-600">{errors.status.message}</p>
        )}
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">Дата звернення</label>
        <input
          type="date"
          {...register('dateOfContact')}
          className="w-full rounded-lg border px-3 py-2"
        />
        {errors.dateOfContact && (
          <p className="mt-1 text-sm text-red-600">
            {errors.dateOfContact.message}
          </p>
        )}
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">
          Дата зарахування
        </label>
        <input
          type="date"
          {...register('dateOfEnrollment')}
          className="w-full rounded-lg border px-3 py-2"
          disabled={selectedStatus !== 'enrolled'}
        />
        <p className="mt-1 text-xs text-gray-500">
          Якщо статус одразу "Зарахований", дата підставиться автоматично.
        </p>
      </div>

      <div className="md:col-span-2">
        <label className="mb-1 block text-sm font-medium">Нотатки</label>
        <textarea
          {...register('notes')}
          className="min-h-[100px] w-full rounded-lg border px-3 py-2"
        />
      </div>

      <div className="flex gap-3 md:col-span-2">
        <button
          type="submit"
          disabled={mutation.isPending}
          className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
        >
          {mutation.isPending ? 'Збереження...' : 'Зберегти кандидата'}
        </button>
      </div>
    </form>
  );
}
