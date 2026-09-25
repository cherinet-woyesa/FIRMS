import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useLoginUser } from '../api/loginUser';
import { setCredentials } from '../store/authSlice';
import { ROUTES } from '@/config/routes';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

const loginSchema = z.object({
  username: z.string().min(1, 'Username is required'),
  password: z.string().min(1, 'Password is required'),
});

type LoginCredentials = z.infer<typeof loginSchema>;

export const LoginForm: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const { mutate: login, isPending } = useLoginUser();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<LoginCredentials>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = (data: LoginCredentials) => {
    login(data, {
      onSuccess: (response) => {
        dispatch(setCredentials(response.data));
        navigate(ROUTES.DASHBOARD);
      },
      onError: (error: any) => {
        setError('root', { 
          message: error?.message || 'Invalid credentials or unauthorized access level.' 
        });
      },
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full flex flex-col gap-6">
      {errors.root && (
        <div className="p-4 bg-red-50/50 border border-red-100 rounded-xl text-sm text-red-600 font-medium animate-in fade-in slide-in-from-top-2">
          {errors.root.message}
        </div>
      )}

      <div className="flex flex-col gap-4">
        <Input
          label="Username"
          type="text"
          placeholder="Enter your username"
          error={errors.username?.message}
          {...register('username')}
        />

        <Input
          label="Password"
          type="password"
          placeholder="••••••••"
          error={errors.password?.message}
          {...register('password')}
        />
      </div>

      <Button
        type="submit"
        isLoading={isPending}
        className="w-full mt-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl h-11 transition-all duration-200 font-medium tracking-wide shadow-sm hover:shadow-md"
      >
        Sign in
      </Button>
    </form>
  );
};
