import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, ArrowRight, AlertCircle } from 'lucide-react';
import AuthInput from './AuthInput';
import { ROUTES } from '../../../app/routes/paths';

// ── Static credentials ─────────────────────────────────────────────────────
const VALID_USER = {
  username: 'Aniket Kole',
  email: 'aniketkole@gmail.com',
  password: 'Aniket@2005',
};

const LoginForm = () => {
  const navigate = useNavigate();
  const [authError, setAuthError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: { email: '', password: '' },
  });

  const onSubmit = async (data: any) => {
    setAuthError(null);
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const isValid =
      data.email.trim().toLowerCase() === VALID_USER.email &&
      data.password === VALID_USER.password;

    if (!isValid) {
      setAuthError('Invalid credentials. Please check your username, email, and password.');
      return;
    }

    localStorage.setItem('auth_user', JSON.stringify({ name: VALID_USER.username, email: VALID_USER.email }));
    navigate(ROUTES.APP.TEACHER.DASHBOARD);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <AuthInput
        label="Email Address"
        type="email"
        placeholder="name@company.com"
        register={register('email', {
          required: 'Email is required',
          pattern: {
            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
            message: 'Invalid email address',
          },
        })}
        error={errors.email?.message}
        icon={<Mail size={18} />}
      />

      <AuthInput
        label="Password"
        type="password"
        placeholder="••••••••"
        register={register('password', {
          required: 'Password is required',
          minLength: { value: 8, message: 'Password must be at least 8 characters' },
        })}
        error={errors.password?.message}
        icon={<Lock size={18} />}
      />

      {authError && (
        <div className="flex items-start gap-3 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 animate-in fade-in slide-in-from-top-2">
          <AlertCircle size={16} className="flex-shrink-0 mt-0.5" />
          <p className="text-sm font-medium">{authError}</p>
        </div>
      )}

      <div className="flex items-center justify-between">
        <label className="flex items-center space-x-2 cursor-pointer">
          <input
            type="checkbox"
            className="w-4 h-4 rounded border-border-strong bg-bg-secondary text-btn-bg focus:ring-text-primary/20"
          />
          <span className="text-sm text-text-secondary">Remember me</span>
        </label>
        <a href="#" className="text-sm font-medium text-text-primary hover:underline underline-offset-4">
          Forgot password?
        </a>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full flex items-center justify-center px-8 py-4 border border-transparent text-base font-medium rounded-xl text-btn-text bg-btn-bg hover:bg-btn-hover transition-all duration-300 hover:scale-[1.02] disabled:opacity-70 disabled:cursor-not-allowed"
      >
        {isSubmitting ? (
          <div className="h-5 w-5 border-2 border-btn-text/30 border-t-btn-text rounded-full animate-spin" />
        ) : (
          <>
            Sign In
            <ArrowRight className="ml-2 h-5 w-5" />
          </>
        )}
      </button>
    </form>
  );
};

export default LoginForm;
