import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Mail, Lock, User, Calendar, Phone, MapPin, AlertCircle } from 'lucide-react';
import { useTMDB } from '../../hooks/useTMDB';
import { tmdb } from '../../services/tmdb';
import { SimpleCaptcha } from './SimpleCaptcha';

interface SignUpFormData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  username: string;
  birthDate: string;
  address?: string;
  postalCode?: string;
  city?: string;
  phone?: string;
  bio?: string;
  gender: 'male' | 'female';
  favoriteGenres: string[];
}

export function SignUpForm() {
  const { signUp } = useAuth();
  const [error, setError] = useState<string>('');
  const [isCaptchaValid, setIsCaptchaValid] = useState(false);
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors }, watch } = useForm<SignUpFormData>();
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

  const onSubmit = async (data: SignUpFormData) => {
    try {
      if (!isCaptchaValid) {
        setError('Veuillez compléter la vérification humaine');
        return;
      }

      setError('');
      await signUp(data.email, data.password, {
        firstName: data.firstName,
        lastName: data.lastName,
        username: data.username,
        birthDate: data.birthDate,
        address: data.address,
        postalCode: data.postalCode,
        city: data.city,
        phone: data.phone,
        bio: data.bio,
        gender: data.gender,
        favoriteGenres: data.favoriteGenres,
        isAdmin: false,
        isActive: true
      });
      navigate('/dashboard');
    } catch (err) {
      setError('Erreur lors de la création du compte');
    }
  };

  if (!movieGenres || !tvGenres) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 w-[855px] mx-auto bg-gray-800 p-8 rounded-lg">
      {error && (
        <div className="bg-red-100 border-2 border-red-400 text-red-700 px-4 py-3 rounded flex items-center mb-6">
          <AlertCircle className="w-5 h-5 mr-2" />
          {error}
        </div>
      )}

      <div className="grid grid-cols-2 gap-6">
        <div>
          <label className="block text-gray-300 mb-2">Prénom *</label>
          <div className="relative">
            <User className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
            <input
              {...register('firstName', { required: 'Prénom requis' })}
              className="w-full bg-gray-700 text-white pl-10 pr-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
              className="w-full bg-gray-700 text-white pl-10 pr-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
              className="w-full bg-gray-700 text-white pl-10 pr-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
              className="w-full bg-gray-700 text-white pl-10 pr-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
              type="password"
              className="w-full bg-gray-700 text-white pl-10 pr-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
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
              className="w-full bg-gray-700 text-white pl-10 pr-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
              className="w-full bg-gray-700 text-white pl-10 pr-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="col-span-2">
          <label className="block text-gray-300 mb-2">Adresse</label>
          <div className="relative">
            <MapPin className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
            <input
              {...register('address')}
              className="w-full bg-gray-700 text-white pl-10 pr-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
        <div className={`grid grid-cols-4 gap-3 ${
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
              <span className="text-white text-sm whitespace-nowrap">{genre.name}</span>
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

      <SimpleCaptcha onValidate={setIsCaptchaValid} />

      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors"
      >
        Créer un compte
      </button>

      <div className="text-center text-sm">
        <Link 
          to="/auth" 
          className="text-blue-400 hover:text-blue-300 transition-colors"
        >
          Déjà un compte ? Se connecter
        </Link>
      </div>
    </form>
  );
}