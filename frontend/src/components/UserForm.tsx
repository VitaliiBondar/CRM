import React from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { createUser, type CreateUserDto } from '../api/users';

type UserFormValues = {
  email: string;
  password: string;
  fullName: string;
  role: 'admin' | 'recruiter';
};

type UserFormProps = {
  onSuccess?: () => void;
};

export default function UserForm({
  onSuccess,
}: UserFormProps): React.JSX.Element {
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UserFormValues>({
    defaultValues: {
      email: '',
      password: '',
      fullName: '',
      role: 'recruiter',
    },
  });

  const mutation = useMutation({
    mutationFn: (data: CreateUserDto) => createUser(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast.success('Користувача створено');
      reset();
      onSuccess?.();
    },
    onError: () => {
      toast.error('Не вдалося створити користувача');
    },
  });

  const onSubmit: SubmitHandler<UserFormValues> = (data) => {
    mutation.mutate(data);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="grid grid-cols-1 gap-4 md:grid-cols-2"
    >
      <div>
        <label className="mb-1 block text-sm font-medium">ПІБ</label>
        <input
          {...register('fullName', { required: 'Введи ПІБ' })}
          className="w-full rounded-lg border px-3 py-2"
        />
        {errors.fullName && (
          <p className="mt-1 text-sm text-red-600">{errors.fullName.message}</p>
        )}
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">Email</label>
        <input
          {...register('email', { required: 'Введи email' })}
          className="w-full rounded-lg border px-3 py-2"
        />
        {errors.email && (
          <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
        )}
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">Пароль</label>
        <input
          type="password"
          {...register('password', { required: 'Введи пароль' })}
          className="w-full rounded-lg border px-3 py-2"
        />
        {errors.password && (
          <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
        )}
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">Роль</label>
        <select
          {...register('role')}
          className="w-full rounded-lg border px-3 py-2"
        >
          <option value="recruiter">Рекрутер</option>
          <option value="admin">Адміністратор</option>
        </select>
      </div>

      <div className="md:col-span-2">
        <button
          type="submit"
          disabled={mutation.isPending}
          className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
        >
          {mutation.isPending ? 'Створення...' : 'Створити користувача'}
        </button>
      </div>
    </form>
  );
}
