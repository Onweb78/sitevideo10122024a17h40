import React from 'react';
import { Heart } from 'lucide-react';
import { useFavorites } from '../hooks/useFavorites';
import { Movie } from '../types/movie';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

interface FavoriteButtonProps {
  movie: Movie;
  className?: string;
}

export function FavoriteButton({ movie, className = '' }: FavoriteButtonProps) {
  const { isFavorite, addFavorite, removeFavorite } = useFavorites();
  const { user } = useAuth();
  const navigate = useNavigate();
  const isInFavorites = isFavorite(movie.id);

  const toggleFavorite = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!user) {
      navigate('/auth');
      return;
    }

    try {
      if (isInFavorites) {
        await removeFavorite(movie.id);
      } else {
        await addFavorite({
          id: movie.id,
          title: movie.title,
          posterUrl: movie.posterUrl,
          releaseDate: movie.releaseDate,
          year: movie.year,
          rating: movie.rating,
          quality: movie.quality || 'HD',
          description: movie.description,
          backdropUrl: movie.backdropUrl,
          genres: movie.genres || [],
          type: movie.type || 'movie',
          mediaType: movie.mediaType || 'movie'
        });
      }
    } catch (error) {
      console.error('Erreur lors de la gestion des favoris:', error);
    }
  };

  return (
    <button
      onClick={toggleFavorite}
      className={`p-2 rounded-full transition-all ${
        isInFavorites 
          ? 'bg-red-500 text-white hover:bg-red-600' 
          : 'bg-gray-800/80 text-gray-300 hover:bg-gray-700'
      } ${className}`}
      aria-label={isInFavorites ? 'Retirer des favoris' : 'Ajouter aux favoris'}
    >
      <Heart
        className={`w-5 h-5 ${isInFavorites ? 'fill-current' : ''}`}
      />
    </button>
  );
}