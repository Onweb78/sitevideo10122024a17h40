import { Link } from 'react-router-dom';
import { Star } from 'lucide-react';
import { FavoriteButton } from './FavoriteButton';
import { RatingStars } from './RatingStars';
import { Movie } from '../types/movie';
import { formatDate } from '../utils/format';

interface MovieCardProps {
  movie: Movie & { 
    type?: 'movie' | 'tv';
    mediaType?: 'movie' | 'tv';
  };
}

export function MovieCard({ movie }: MovieCardProps) {
  const contentType = movie.type || movie.mediaType || 'movie';
  const linkPath = contentType === 'tv' ? `/tv/${movie.id}` : `/movie/${movie.id}`;

  const handleClick = () => {
    window.scrollTo(0, 0);
  };

  return (
    <Link 
      to={linkPath} 
      className="group relative overflow-hidden rounded-lg transition-transform hover:scale-105"
      onClick={handleClick}
    >
      <div className="aspect-[2/3] relative">
        <img 
          src={movie.posterUrl} 
          alt={movie.title}
          className="h-full w-full object-cover rounded-lg"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-lg">
          <div className="absolute bottom-0 p-4 text-white w-full">
            <h3 className="text-lg font-bold mb-2">{movie.title}</h3>
            <div className="flex items-center justify-between gap-2">
              <span className="flex items-center gap-1">
                <Star className="w-4 h-4 text-yellow-400" />
                {movie.rating}
              </span>
              <span className="px-2 py-1 text-xs bg-blue-600 rounded-full">
                {movie.quality}
              </span>
            </div>
            <RatingStars 
              movieId={movie.id} 
              className="mt-2"
            />
          </div>
        </div>
        <FavoriteButton 
          movie={movie} 
          className="absolute top-2 right-2 opacity-0 group-hover:opacity-100"
        />
      </div>
      <div className="p-2 space-y-1">
        <h3 className="text-white truncate">{movie.title}</h3>
        <div className="text-sm text-gray-400">
          <span className="text-gray-500">Date de sortie : </span>
          {formatDate(movie.releaseDate)}
        </div>
        <div className="flex items-center">
          {[...Array(5)].map((_, index) => (
            <Star
              key={index}
              className={`w-4 h-4 ${
                index < Math.round(movie.rating / 2)
                  ? 'text-yellow-400 fill-yellow-400'
                  : 'text-gray-600'
              }`}
            />
          ))}
        </div>
        {movie.genres && movie.genres.length > 0 && (
          <div className="text-sm text-gray-400">
            <span className="text-gray-500">Genre : </span>
            <span className="text-blue-400">{movie.genres.join(', ')}</span>
          </div>
        )}
      </div>
    </Link>
  );
}