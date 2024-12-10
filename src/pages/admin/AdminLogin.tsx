import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Mail, Lock, AlertCircle } from 'lucide-react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { useAuth } from '../../contexts/AuthContext';
import { useAdmin } from '../../contexts/AdminContext';

interface AdminLoginFormData {
  email: string;
  password: string;
}

export function AdminLogin() {
  const [error, setError] = useState<string>('');
  const { register, handleSubmit, formState: { errors } } = useForm<AdminLoginFormData>();
  const navigate = useNavigate();
  const { signIn } = useAuth();
  const { isAdmin, isLoading, checkAdminStatus } = useAdmin();

  useEffect(() => {
    const checkAccess = async () => {
      await checkAdminStatus();
      if (!isLoading && isAdmin) {
        navigate('/admin/dashboard', { replace: true });
      }
    };

    checkAccess();
  }, [isAdmin, isLoading, navigate, checkAdminStatus]);

  const onSubmit = async (data: AdminLoginFormData) => {
    try {
      setError('');
      
      const userCredential = await signIn(data.email, data.password);
      const userDoc = await getDoc(doc(db, 'users', userCredential.uid));
      const userData = userDoc.data();

      if (!userData?.isAdmin) {
        setError('Accès non autorisé - Vous devez être administrateur');
        return;
      }

      await checkAdminStatus();
      navigate('/admin/dashboard', { replace: true });
      
    } catch (err) {
      console.error('Erreur de connexion:', err);
      setError('Email ou mot de passe incorrect');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full space-y-8 bg-gray-800 p-8 rounded-xl">
        <div>
          <h2 className="text-center text-3xl font-bold text-white mb-8">
            Administration
          </h2>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded flex items-center">
              <AlertCircle className="w-5 h-5 mr-2" />
              {error}
            </div>
          )}

          <div>
            <label className="block text-gray-300 mb-2">Email</label>
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
                className="w-full bg-gray-700 text-white px-10 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="admin@example.com"
              />
            </div>
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
            )}
          </div>

          <div>
            <label className="block text-gray-300 mb-2">Mot de passe</label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <input
                {...register('password', { required: 'Mot de passe requis' })}
                type="password"
                className="w-full bg-gray-700 text-white px-10 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="••••••••"
              />
            </div>
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Se connecter
          </button>
        </form>
      </div>
    </div>
  );
}