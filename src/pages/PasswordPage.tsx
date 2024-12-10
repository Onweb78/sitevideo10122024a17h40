import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from '../contexts/AuthContext';
import { Lock, AlertCircle } from 'lucide-react';

interface PasswordFormData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export function PasswordPage() {
  const { user, changePassword } = useAuth();
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState(false);
  const { register, handleSubmit, formState: { errors }, reset } = useForm<PasswordFormData>();

  const onSubmit = async (data: PasswordFormData) => {
    try {
      setError('');
      setSuccess(false);

      if (data.newPassword !== data.confirmPassword) {
        setError('Les mots de passe ne correspondent pas');
        return;
      }

      await changePassword(data.currentPassword, data.newPassword);
      setSuccess(true);
      reset();
    } catch (err) {
      if (err instanceof Error) {
        if (err.message.includes('auth/wrong-password')) {
          setError('Le mot de passe actuel est incorrect');
        } else if (err.message.includes('auth/weak-password')) {
          setError('Le nouveau mot de passe est trop faible');
        } else {
          setError('Erreur lors du changement de mot de passe');
        }
      }
    }
  };

  if (!user) {
    return null;
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-white mb-8">Changer le mot de passe</h1>

      <div className="max-w-md bg-gray-800 rounded-xl p-8">
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded flex items-center mb-6">
            <AlertCircle className="w-5 h-5 mr-2" />
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded flex items-center mb-6">
            Mot de passe modifié avec succès
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label className="block text-gray-300 mb-2">Mot de passe actuel</label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <input
                type="password"
                {...register('currentPassword', { required: 'Mot de passe actuel requis' })}
                className="w-full bg-gray-700 text-white px-10 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            {errors.currentPassword && (
              <p className="text-red-500 text-sm mt-1">{errors.currentPassword.message}</p>
            )}
          </div>

          <div>
            <label className="block text-gray-300 mb-2">Nouveau mot de passe</label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <input
                type="password"
                {...register('newPassword', {
                  required: 'Nouveau mot de passe requis',
                  minLength: {
                    value: 6,
                    message: 'Le mot de passe doit contenir au moins 6 caractères'
                  }
                })}
                className="w-full bg-gray-700 text-white px-10 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            {errors.newPassword && (
              <p className="text-red-500 text-sm mt-1">{errors.newPassword.message}</p>
            )}
          </div>

          <div>
            <label className="block text-gray-300 mb-2">Confirmer le nouveau mot de passe</label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <input
                type="password"
                {...register('confirmPassword', {
                  required: 'Confirmation du mot de passe requise'
                })}
                className="w-full bg-gray-700 text-white px-10 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            {errors.confirmPassword && (
              <p className="text-red-500 text-sm mt-1">{errors.confirmPassword.message}</p>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Changer le mot de passe
          </button>
        </form>
      </div>
    </div>
  );
}