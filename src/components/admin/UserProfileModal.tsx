import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { auth, db } from '../../config/firebase';
import { updatePassword } from 'firebase/auth';
import { UserProfile } from '../../types/user';
import { Mail, Calendar, Phone, MapPin, AlertCircle, Eye, EyeOff, X, User } from 'lucide-react';
import { useAdmin } from '../../contexts/AdminContext';
import { useTMDB } from '../../hooks/useTMDB';
import { tmdb } from '../../services/tmdb';

interface UserProfileModalProps {
  user: UserProfile;
  onClose: () => void;
  onUpdate: () => void;
}

interface ExtendedUserProfile extends UserProfile {
  password?: string;
  deleteAccount?: boolean;
}

export function UserProfileModal({ user, onClose, onUpdate }: UserProfileModalProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const { register, handleSubmit, formState: { errors }, watch } = useForm<ExtendedUserProfile>({
    defaultValues: {
      ...user,
      gender: user.gender || 'male',
      favoriteGenres: user.favoriteGenres || [],
      isActive: user.isActive !== false,
      deleteAccount: false
    }
  });
  const { isAdmin } = useAdmin();
  const selectedGender = watch('gender');
  const selectedGenres = watch('favoriteGenres') || [];
  const deleteAccount = watch('deleteAccount');

  // Fetch movie and TV genres
  const { data: movieGenres } = useTMDB<{ genres: { id: number; name: string }[] }>(
    () => tmdb.getMovieGenres(),
    []
  );

  const { data: tvGenres } = useTMDB<{ genres: { id: number; name: string }[] }>(
    () => tmdb.getTVGenres(),
    []
  );

  // Combine and deduplicate genres
  const genres = movieGenres && tvGenres ? Array.from(
    new Map(
      [...movieGenres.genres, ...tvGenres.genres]
        .map(genre => [genre.id, genre])
    ).values()
  ) : [];

  const onSubmit = async (data: ExtendedUserProfile) => {
    try {
      if (data.deleteAccount) {
        // Supprimer le compte
        const userRef = doc(db, 'users', user.uid);
        await deleteDoc(userRef);
        setSuccess(true);
        setTimeout(() => {
          onUpdate();
          onClose();
        }, 1500);
        return;
      }

      const userRef = doc(db, 'users', user.uid);
      const updateData: Partial<UserProfile> = {
        firstName: data.firstName,
        lastName: data.lastName,
        username: data.username,
        phone: data.phone,
        birthDate: data.birthDate,
        address: data.address,
        postalCode: data.postalCode,
        city: data.city,
        bio: data.bio,
        gender: data.gender,
        favoriteGenres: data.favoriteGenres,
        isAdmin: isAdmin ? data.isAdmin : user.isAdmin,
        isActive: data.isActive,
        updatedAt: new Date()
      };

      // Mise à jour du profil dans Firestore
      await updateDoc(userRef, updateData);

      // Mise à jour du mot de passe si fourni
      if (data.password && auth.currentUser) {
        await updatePassword(auth.currentUser, data.password);
      }

      setSuccess(true);
      setTimeout(() => {
        onUpdate();
        onClose();
      }, 1500);
    } catch (error) {
      console.error('Erreur lors de la mise à jour:', error);
      setError('Erreur lors de la mise à jour du profil');
    }
  };

  if (!movieGenres || !tvGenres) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-gray-800 rounded-lg p-8">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-lg p-8 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white">Modifier le profil</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {error && (
          <div className="bg-red-100 border-2 border-red-400 text-red-700 px-4 py-3 rounded-lg flex items-center mb-6">
            <AlertCircle className="w-5 h-5 mr-2" />
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-100 border-2 border-green-400 text-green-700 px-4 py-3 rounded-lg flex items-center mb-6">
            {deleteAccount ? 'Compte supprimé avec succès' : 'Profil mis à jour avec succès'}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Identifiants */}
            <div className="col-span-2">
              <h3 className="text-lg font-semibold text-white mb-4">Identifiants</h3>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-gray-300 mb-2">Login (Email)</label>
                  <input
                    {...register('email')}
                    type="email"
                    disabled
                    className="w-full bg-gray-700 text-gray-400 px-4 py-2 rounded-lg cursor-not-allowed"
                  />
                </div>
                <div>
                  <label className="block text-gray-300 mb-2">Nouveau mot de passe</label>
                  <div className="relative">
                    <input
                      {...register('password')}
                      type={showPassword ? 'text' : 'password'}
                      className="w-full bg-gray-700 text-white px-4 py-2 rounded-lg pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Laisser vide pour ne pas modifier"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-2.5 text-gray-400 hover:text-white"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Informations personnelles */}
            <div className="col-span-2">
              <h3 className="text-lg font-semibold text-white mb-4">Informations personnelles</h3>
            </div>

            <div>
              <label className="block text-gray-300 mb-2">
                Prénom *
                {errors.firstName && (
                  <span className="text-red-500 text-sm ml-2">({errors.firstName.message})</span>
                )}
              </label>
              <input
                {...register('firstName', { required: 'Prénom requis' })}
                className={`w-full bg-gray-700 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 ${
                  errors.firstName ? 'border-2 border-red-500 focus:ring-red-500' : 'focus:ring-blue-500'
                }`}
              />
            </div>

            <div>
              <label className="block text-gray-300 mb-2">
                Nom *
                {errors.lastName && (
                  <span className="text-red-500 text-sm ml-2">({errors.lastName.message})</span>
                )}
              </label>
              <input
                {...register('lastName', { required: 'Nom requis' })}
                className={`w-full bg-gray-700 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 ${
                  errors.lastName ? 'border-2 border-red-500 focus:ring-red-500' : 'focus:ring-blue-500'
                }`}
              />
            </div>

            <div>
              <label className="block text-gray-300 mb-2">
                Pseudo *
                {errors.username && (
                  <span className="text-red-500 text-sm ml-2">({errors.username.message})</span>
                )}
              </label>
              <input
                {...register('username', { required: 'Pseudo requis' })}
                className={`w-full bg-gray-700 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 ${
                  errors.username ? 'border-2 border-red-500 focus:ring-red-500' : 'focus:ring-blue-500'
                }`}
              />
            </div>

            <div>
              <label className="block text-gray-300 mb-2">
                Sexe *
                {errors.gender && (
                  <span className="text-red-500 text-sm ml-2">({errors.gender.message})</span>
                )}
              </label>
              <div className="grid grid-cols-2 gap-4">
                <label className={`flex items-center justify-center p-3 rounded-lg cursor-pointer transition-colors ${
                  selectedGender === 'male' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}>
                  <input
                    type="radio"
                    value="male"
                    {...register('gender', { required: 'Sexe requis' })}
                    className="sr-only"
                  />
                  <span>Homme</span>
                </label>
                <label className={`flex items-center justify-center p-3 rounded-lg cursor-pointer transition-colors ${
                  selectedGender === 'female'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}>
                  <input
                    type="radio"
                    value="female"
                    {...register('gender', { required: 'Sexe requis' })}
                    className="sr-only"
                  />
                  <span>Femme</span>
                </label>
              </div>
            </div>

            <div>
              <label className="block text-gray-300 mb-2">
                Date de naissance *
                {errors.birthDate && (
                  <span className="text-red-500 text-sm ml-2">({errors.birthDate.message})</span>
                )}
              </label>
              <input
                {...register('birthDate', { required: 'Date de naissance requise' })}
                type="date"
                className={`w-full bg-gray-700 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 ${
                  errors.birthDate ? 'border-2 border-red-500 focus:ring-red-500' : 'focus:ring-blue-500'
                }`}
              />
            </div>

            <div>
              <label className="block text-gray-300 mb-2">Téléphone</label>
              <input
                {...register('phone')}
                type="tel"
                className="w-full bg-gray-700 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="col-span-2">
              <label className="block text-gray-300 mb-2">Adresse</label>
              <input
                {...register('address')}
                className="w-full bg-gray-700 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-gray-300 mb-2">Code postal</label>
              <input
                {...register('postalCode')}
                className="w-full bg-gray-700 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-gray-300 mb-2">Ville</label>
              <input
                {...register('city')}
                className="w-full bg-gray-700 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-gray-300 mb-2">
              Genres de films et séries préférés *
              {errors.favoriteGenres && (
                <span className="text-red-500 text-sm ml-2">({errors.favoriteGenres.message})</span>
              )}
              <span className="text-gray-400 ml-2">
                ({selectedGenres.length} sélectionné{selectedGenres.length !== 1 ? 's' : ''})
              </span>
            </label>
            <div className={`grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 ${
              errors.favoriteGenres ? 'border-2 border-red-500 rounded-lg p-3' : ''
            }`}>
              {genres.map((genre) => (
                <label
                  key={genre.id}
                  className="flex items-center space-x-2 bg-gray-700 p-3 rounded-lg cursor-pointer hover:bg-gray-600 transition-colors"
                >
                  <input
                    type="checkbox"
                    value={genre.name}
                    {...register('favoriteGenres', {
                      required: 'Sélectionnez au moins un genre',
                      validate: value => (value && value.length > 0) || 'Sélectionnez au moins un genre'
                    })}
                    className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded"
                  />
                  <span className="text-white text-sm">{genre.name}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-gray-300 mb-2">Présentation</label>
            <textarea
              {...register('bio')}
              className="w-full bg-gray-700 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 h-32"
            />
          </div>

          <div className="flex items-center gap-4">
            {isAdmin && (
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  {...register('isAdmin')}
                  className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded"
                />
                <span className="text-gray-300">Administrateur</span>
              </label>
            )}
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                {...register('isActive')}
                className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded"
              />
              <span className="text-gray-300">Activer</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                {...register('deleteAccount')}
                className="w-4 h-4 text-red-600 bg-gray-700 border-gray-600 rounded"
              />
              <span className="text-red-400">Supprimer le compte</span>
            </label>
          </div>

          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-300 hover:text-white transition-colors"
            >
              Annuler
            </button>
            <button
              type="submit"
              className={`px-4 py-2 rounded-lg transition-colors ${
                deleteAccount 
                  ? 'bg-red-600 hover:bg-red-700 text-white'
                  : 'bg-blue-600 hover:bg-blue-700 text-white'
              }`}
            >
              {deleteAccount ? 'Supprimer' : 'Enregistrer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}