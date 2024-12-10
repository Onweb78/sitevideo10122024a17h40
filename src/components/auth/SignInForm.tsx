import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Mail, Lock, AlertCircle } from 'lucide-react';
import { NotRegisteredModal } from './NotRegisteredModal';
import { SuspendedAccountModal } from './SuspendedAccountModal';

interface SignInFormData {
  email: string;
  password: string;
}

export function SignInForm() {
  const { signIn } = useAuth();
  const [error, setError] = useState<string>('');
  const [showNotRegisteredModal, setShowNotRegisteredModal] = useState(false);
  const [showSuspendedModal, setShowSuspendedModal] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm<SignInFormData>();
  const navigate = useNavigate();

  const onSubmit = async (data: SignInFormData) => {
    try {
      setError('');
      await signIn(data.email, data.password);
      navigate('/');
    } catch (err) {
      if ((err as Error).message === 'NOT_REGISTERED') {
        setShowNotRegisteredModal(true);
      } else if ((err as Error).message === 'ACCOUNT_SUSPENDED') {
        setShowSuspendedModal(true);
      } else {
        setError('Email ou mot de passe incorrect');
      }
    }
  };

  return (
    <div className="w-full max-w-sm mx-auto">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded flex items-center">
            <AlertCircle className="w-5 h-5 mr-2" />
            {error}
          </div>
        )}

        <div>
          <label className="block text-gray-300 text-sm mb-1">Email</label>
          <div className="relative">
            <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
            <input
              {...register('email', { 
                required: 'Email requis',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Email invalide'
                }
              })}
              type="email"
              className="w-full bg-gray-700 text-white pl-10 pr-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="votre@email.com"
            />
          </div>
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
          )}
        </div>

        <div>
          <label className="block text-gray-300 text-sm mb-1">Mot de passe</label>
          <div className="relative">
            <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
            <input
              {...register('password', { required: 'Mot de passe requis' })}
              type="password"
              className="w-full bg-gray-700 text-white pl-10 pr-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="••••••••"
            />
          </div>
          {errors.password && (
            <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
          )}
        </div>

        <button
          type="submit"
          className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg transition-colors mt-6"
        >
          Se connecter
        </button>

        <div className="text-center text-sm">
          <Link 
            to="/auth?mode=signup" 
            className="text-blue-400 hover:text-blue-300 transition-colors"
          >
            Pas encore de compte ? S'inscrire
          </Link>
        </div>
      </form>

      {showNotRegisteredModal && (
        <NotRegisteredModal onClose={() => setShowNotRegisteredModal(false)} />
      )}

      {showSuspendedModal && (
        <SuspendedAccountModal onClose={() => setShowSuspendedModal(false)} />
      )}
    </div>
  );
}