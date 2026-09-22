import React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from 'react-router-dom'
import { loginSchema, type LoginCredentials } from '../types/auth.types'
import { loginOfficer } from '../api/login'
import { useAuthStore } from '@/store/useAuthStore'
import { ROUTES } from '@/config/routes'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'

export const LoginForm: React.FC = () => {
  const navigate = useNavigate()
  const setAuth = useAuthStore((s) => s.setAuth)

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<LoginCredentials>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (data: LoginCredentials) => {
    try {
      const response = await loginOfficer(data)
      setAuth(response.user, response.token)
      navigate(ROUTES.DASHBOARD)
    } catch {
      setError('root', { message: 'Invalid credentials or unauthorized access level.' })
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {errors.root && (
        <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-lg text-xs text-rose-300">
          {errors.root.message}
        </div>
      )}

      <Input
        label="Corporate Officer Email"
        type="email"
        placeholder="officer@company.com"
        error={errors.email?.message}
        {...register('email')}
      />

      <Input
        label="Password"
        type="password"
        placeholder="••••••••"
        error={errors.password?.message}
        {...register('password')}
      />

      <Button
        type="submit"
        isLoading={isSubmitting}
        className="w-full mt-2 bg-indigo-600 hover:bg-indigo-700 text-white"
      >
        Sign In to Officer Desk
      </Button>
    </form>
  )
}
