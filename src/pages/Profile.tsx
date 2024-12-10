import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from '../contexts/AuthContext';
import { User, Mail, Phone, MapPin, AlertCircle } from 'lucide-react';
import { UserProfile } from '../types/user';
import { useAdmin } from '../contexts/AdminContext';
import { useTMDB } from '../hooks/useTMDB';
import { tmdb } from '../services/tmdb';

export function Profile() {
  const { user, updateProfile } = useAuth();
  const { isAdmin } = useAdmin();
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState(false);
  const { register, handleSubmit, formState: { errors }, watch } = useForm<UserProfile>({
    defaultValues: user || undefined
  });
  const selectedGender = watch('gender');
  const selectedGenres = watch('favoriteGenres') || [];

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

  const onSubmit = async (data: Partial<UserProfile>) => {
    try {
      setError('');
      setSuccess(false);
      await updateProfile({
        ...data,
        isAdmin: isAdmin ? data.isAdmin : user?.isAdmin // Préserve le statut admin si non admin
      });
      setSuccess(true);
    } catch (err) {
      setError('Erreur lors de la mise à jour du profil');
    }
  };

  if (!user || !movieGenres || !tvGenres) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white">Chargement...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8">Mon Profil</h1>

        <div className="bg-gray-800 rounded-xl p-8">
          {error && (
            <div className="bg-red-100 border-2 border-red-400 text-red-700 px-4 py-3 rounded-lg flex items-center mb-6">
              <AlertCircle className="w-5 h-5 mr-2" />
              {error}
            </div>
          )}

          {success && (
            <div className="bg-green-100 border-2 border-green-400 text-green-700 px-4 py-3 rounded-lg flex items-center mb-6">
              Profil mis à jour avec succès
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-300 mb-2">
                  Prénom *
                  {errors.firstName && (
                    <span className="text-red-500 text-sm ml-2">({errors.firstName.message})</span>
                  )}
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <input
                    {...register('firstName', { required: 'Prénom requis' })}
                    className={`w-full bg-gray-700 text-white px-10 py-2 rounded-lg focus:outline-none focus:ring-2 ${
                      errors.firstName ? 'border-2 border-red-500 focus:ring-red-500' : 'focus:ring-blue-500'
                    }`}
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-300 mb-2">
                  Nom *
                  {errors.lastName && (
                    <span className="text-red-500 text-sm ml-2">({errors.lastName.message})</span>
                  )}
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <input
                    {...register('lastName', { required: 'Nom requis' })}
                    className={`w-full bg-gray-700 text-white px-10 py-2 rounded-lg focus:outline-none focus:ring-2 ${
                      errors.lastName ? 'border-2 border-red-500 focus:ring-red-500' : 'focus:ring-blue-500'
                    }`}
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-300 mb-2">
                  Pseudo *
                  {errors.username && (
                    <span className="text-red-500 text-sm ml-2">({errors.username.message})</span>
                  )}
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <input
                    {...register('username', { required: 'Pseudo requis' })}
                    className={`w-full bg-gray-700 text-white px-10 py-2 rounded-lg focus:outline-none focus:ring-2 ${
                      errors.username ? 'border-2 border-red-500 focus:ring-red-500' : 'focus:ring-blue-500'
                    }`}
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-300 mb-2">Email *</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <input
                    {...register('email')}
                    type="email"
                    disabled
                    className="w-full bg-gray-700 text-gray-400 px-10 py-2 rounded-lg cursor-not-allowed"
                  />
                </div>
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
                <div className="relative">
                  <Phone className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <input
                    {...register('phone')}
                    type="tel"
                    className="w-full bg-gray-700 text-white px-10 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="md:col-span-2">
                <label className="block text-gray-300 mb-2">Adresse</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <input
                    {...register('address')}
                    className="w-full bg-gray-700 text-white px-10 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
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

            <div className="flex justify-end">
              <button
                type="submit"
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Mettre à jour
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}