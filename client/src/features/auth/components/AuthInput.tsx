import React from 'react';
import type { UseFormRegisterReturn } from 'react-hook-form';

interface AuthInputProps {
  label: string;
  type?: string;
  placeholder?: string;
  error?: string;
  register: UseFormRegisterReturn;
  icon?: React.ReactNode;
}

const AuthInput: React.FC<AuthInputProps> = ({
  label,
  type = 'text',
  placeholder,
  error,
  register,
  icon,
}) => {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-text-primary">
        {label}
      </label>
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary">
            {icon}
          </div>
        )}
        <input
          {...register}
          type={type}
          placeholder={placeholder}
          className={`w-full px-4 py-3 bg-bg-secondary border rounded-xl focus:outline-none focus:ring-2 transition-all duration-200 ${icon ? 'pl-10' : ''
            } ${error
              ? 'border-red-500 focus:ring-red-500/20'
              : 'border-border-strong focus:ring-text-primary/10 focus:border-text-primary'
            } text-text-primary placeholder:text-text-secondary/50`}
        />
      </div>
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
};

export default AuthInput;
