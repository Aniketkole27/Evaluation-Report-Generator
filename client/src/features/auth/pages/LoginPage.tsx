import { Link } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import LoginForm from '../components/LoginForm';

const LoginPage = () => {
  return (
    <div className="relative flex-1 flex items-center justify-center py-12 px-6 overflow-hidden">
      {/* Back to Home Link */}
      <div className="absolute top-15 left-38 z-20">
        <Link
          to="/"
          className="flex items-center text-sm font-medium text-text-secondary hover:text-text-primary transition-colors group"
        >
          <ChevronLeft className="mr-1 h-4 w-4 transition-transform group-hover:-translate-x-1" />
          Back to home
        </Link>
      </div>

      {/* Background Decorations (matching Landing Page Hero style) */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-btn-bg opacity-[0.03] blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-btn-bg opacity-[0.03] blur-[120px] rounded-full pointer-events-none" />

      <div className="w-full max-w-[400px] space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 relative z-10">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-extrabold tracking-tight text-text-primary">
            Welcome Back
          </h1>
          <p className="text-text-secondary text-sm">
            Enter your credentials to access your dashboard
          </p>
        </div>

        <div className="bg-bg-secondary/50 backdrop-blur-xl p-8 rounded-3xl border border-border-subtle shadow-2xl shadow-black/5">
          <LoginForm />
        </div>

        <p className="text-center text-sm text-text-secondary">
          Don't have an account?{' '}
          <Link
            to="/signup"
            className="font-semibold text-text-primary hover:underline underline-offset-4 transition-all"
          >
            Sign up for free
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
