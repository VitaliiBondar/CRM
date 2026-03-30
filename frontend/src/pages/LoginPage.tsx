import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import { login } from '../api/auth';
import { saveAuth } from '../utils/auth';
import toast from 'react-hot-toast';

type LoginFormValues = {
  email: string;
  password: string;
};

export default function LoginPage() {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    defaultValues: {
      email: 'admin@crm.local',
      password: 'admin12345',
    },
  });

  const mutation = useMutation({
    mutationFn: login,
    onSuccess: (data) => {
      saveAuth(data.token, data.user);
      toast.success('Вхід виконано успішно');
      navigate('/dashboard');
    },
    onError: () => {
      toast.error('Невірний email або пароль');
    },
  });

  const onSubmit: SubmitHandler<LoginFormValues> = (data) => {
    mutation.mutate(data);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-md rounded-xl bg-white p-6 shadow">
        <h1 className="mb-6 text-2xl font-bold">Вхід у CRM</h1>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium">Email</label>
            <input
              {...register('email', { required: 'Введи email' })}
              className="w-full rounded border px-3 py-2"
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600">
                {errors.email.message}
              </p>
            )}
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">Пароль</label>
            <input
              type="password"
              {...register('password', { required: 'Введи пароль' })}
              className="w-full rounded border px-3 py-2"
            />
            {errors.password && (
              <p className="mt-1 text-sm text-red-600">
                {errors.password.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={mutation.isPending}
            className="w-full rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {mutation.isPending ? 'Вхід...' : 'Увійти'}
          </button>
        </form>
      </div>
    </div>
  );
}
