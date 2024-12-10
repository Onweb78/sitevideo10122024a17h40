import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { doc, setDoc } from 'firebase/firestore';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '../../config/firebase';
import { User, Mail, Lock, Calendar, Phone, MapPin, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useTMDB } from '../../hooks/useTMDB';
import { tmdb } from '../../services/tmdb';

interface CreateUserFormData {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  password: string;
  birthDate: string;
  address?: string;
  postalCode?: string;
  city?: string;
  phone?: string;
  bio?: string;
  gender: 'male' | 'female';
  favoriteGenres: string[];
  isAdmin: boolean;
}

const genreClassNames = {
  container: `grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2`,
  label: `flex items-center space-x-2 bg-gray-700 px-3 py-2 rounded-lg cursor-pointer hover:bg-gray-600 transition-colors text-sm`,
  checkbox: `w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded`,
  text: `text-white text-sm truncate`
};

export function AdminCreateUser() {
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { register, handleSubmit, formState: { errors }, watch, reset } = useForm<CreateUserFormData>();
  const navigate = useNavigate();
  const { user } = useAuth();
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

  const onSubmit = async (data: CreateUserFormData) => {
    if (!user) return;

    try {
      setError('');
      setSuccess(false);

      // Create the new user
      const userCredential = await createUserWithEmailAndPassword(auth, data.email, data.password);
      const { uid } = userCredential.user;

      // Create user profile in Firestore
      const userProfile = {
        uid,
        firstName: data.firstName,
        lastName: data.lastName,
        username: data.username,
        email: data.email,
        birthDate: data.birthDate,
        address: data.address || '',
        postalCode: data.postalCode || '',
        city: data.city || '',
        phone: data.phone || '',
        bio: data.bio || '',
        gender: data.gender,
        favoriteGenres: data.favoriteGenres,
        isAdmin: data.isAdmin,
        emailVerified: false,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      await setDoc(doc(db, 'users', uid), userProfile);

      // Reconnect the administrator
      if (user.email) {
        await signInWithEmailAndPassword(auth, user.email, data.password);
      }

      setSuccess(true);
      reset();

      // Redirect to users list after a short delay
      setTimeout(() => {
        navigate('/admin/users');
      }, 2000);

    } catch (err) {
      console.error('Erreur lors de la création de l\'utilisateur:', err);
      setError('Erreur lors de la création de l\'utilisateur');
    }
  };

  if (!movieGenres || !tvGenres) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-white mb-8">Création d'utilisateur</h1>

      <div className="bg-gray-800 rounded-lg p-8 max-w-2xl">
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded flex items-center mb-6">
            <AlertCircle className="w-5 h-5 mr-2" />
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded flex items-center mb-6">
            Utilisateur créé avec succès
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-300 mb-2">Prénom *</label>
              <div className="relative">
                <User className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  {...register('firstName', { required: 'Prénom requis' })}
                  className="w-full bg-gray-700 text-white pl-10 pr-4 py-2 rounded-lg"
                />
              </div>
              {errors.firstName && (
                <p className="text-red-500 text-sm mt-1">{errors.firstName.message}</p>
              )}
            </div>

            <div>
              <label className="block text-gray-300 mb-2">Nom *</label>
              <div className="relative">
                <User className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  {...register('lastName', { required: 'Nom requis' })}
                  className="w-full bg-gray-700 text-white pl-10 pr-4 py-2 rounded-lg"
                />
              </div>
              {errors.lastName && (
                <p className="text-red-500 text-sm mt-1">{errors.lastName.message}</p>
              )}
            </div>

            <div>
              <label className="block text-gray-300 mb-2">Pseudo *</label>
              <div className="relative">
                <User className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  {...register('username', { required: 'Pseudo requis' })}
                  className="w-full bg-gray-700 text-white pl-10 pr-4 py-2 rounded-lg"
                />
              </div>
              {errors.username && (
                <p className="text-red-500 text-sm mt-1">{errors.username.message}</p>
              )}
            </div>

            <div>
              <label className="block text-gray-300 mb-2">Email *</label>
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
                  className="w-full bg-gray-700 text-white pl-10 pr-4 py-2 rounded-lg"
                />
              </div>
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label className="block text-gray-300 mb-2">Mot de passe *</label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  {...register('password', {
                    required: 'Mot de passe requis',
                    minLength: {
                      value: 6,
                      message: 'Le mot de passe doit contenir au moins 6 caractères'
                    }
                  })}
                  type={showPassword ? 'text' : 'password'}
                  className="w-full bg-gray-700 text-white pl-10 pr-10 py-2 rounded-lg"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-gray-400 hover:text-white"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
              )}
            </div>

            <div>
              <label className="block text-gray-300 mb-2">Sexe *</label>
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
              {errors.gender && (
                <p className="text-red-500 text-sm mt-1">{errors.gender.message}</p>
              )}
            </div>

            <div>
              <label className="block text-gray-300 mb-2">Date de naissance *</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  {...register('birthDate', { required: 'Date de naissance requise' })}
                  type="date"
                  className="w-full bg-gray-700 text-white pl-10 pr-4 py-2 rounded-lg"
                />
              </div>
              {errors.birthDate && (
                <p className="text-red-500 text-sm mt-1">{errors.birthDate.message}</p>
              )}
            </div>

            <div>
              <label className="block text-gray-300 mb-2">Téléphone</label>
              <div className="relative">
                <Phone className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  {...register('phone')}
                  type="tel"
                  className="w-full bg-gray-700 text-white pl-10 pr-4 py-2 rounded-lg"
                />
              </div>
            </div>

            <div className="col-span-2">
              <label className="block text-gray-300 mb-2">Adresse</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  {...register('address')}
                  className="w-full bg-gray-700 text-white pl-10 pr-4 py-2 rounded-lg"
                />
              </div>
            </div>

            <div>
              <label className="block text-gray-300 mb-2">Code postal</label>
              <input
                {...register('postalCode')}
                className="w-full bg-gray-700 text-white px-4 py-2 rounded-lg"
              />
            </div>

            <div>
              <label className="block text-gray-300 mb-2">Ville</label>
              <input
                {...register('city')}
                className="w-full bg-gray-700 text-white px-4 py-2 rounded-lg"
              />
            </div>

            <div className="col-span-2">
              <label className="block text-gray-300 mb-2">
                Genres de films et séries préférés *
                {errors.favoriteGenres && (
                  <span className="text-red-500 text-sm ml-2">({errors.favoriteGenres.message})</span>
                )}
                <span className="text-gray-400 ml-2">
                  ({selectedGenres.length} sélectionné{selectedGenres.length !== 1 ? 's' : ''})
                </span>
              </label>
              <div className={`${genreClassNames.container} ${
                errors.favoriteGenres ? 'border-2 border-red-500 rounded-lg p-3' : ''
              }`}>
                {genres.map((genre) => (
                  <label
                    key={genre.id}
                    className={genreClassNames.label}
                  >
                    <input
                      type="checkbox"
                      value={genre.name}
                      {...register('favoriteGenres', {
                        required: 'Sélectionnez au moins un genre',
                        validate: value => (value && value.length > 0) || 'Sélectionnez au moins un genre'
                      })}
                      className={genreClassNames.checkbox}
                    />
                    <span className={genreClassNames.text}>{genre.name}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="col-span-2">
              <label className="block text-gray-300 mb-2">Présentation</label>
              <textarea
                {...register('bio')}
                className="w-full bg-gray-700 text-white px-4 py-2 rounded-lg h-32"
              />
            </div>

            <div className="col-span-2">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  {...register('isAdmin')}
                  className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded"
                />
                <span className="text-gray-300">Administrateur</span>
              </label>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Créer l'utilisateur
          </button>
        </form>
      </div>
    </div>
  );
}