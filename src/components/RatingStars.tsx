import { Star } from 'lucide-react';
import { useRatings } from '../hooks/useRatings';

interface RatingStarsProps {
  movieId: number;
  className?: string;
}

export function RatingStars({ movieId, className = '' }: RatingStarsProps) {
  const { getRating, rateMovie } = useRatings();
  const userRating = getRating(movieId);
  const stars = [1, 2, 3, 4, 5];

  return (
    <div className={`flex items-center gap-1 ${className}`}>
      {stars.map((star) => (
        <button
          key={star}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            rateMovie(movieId, star);
          }}
          className="group relative"
          aria-label={`Rate ${star} stars`}
        >
          <Star
            className={`w-6 h-6 transition-colors ${
              (userRating && star <= userRating)
                ? 'fill-yellow-400 text-yellow-400'
                : 'text-gray-400 hover:text-yellow-400'
            }`}
          />
          <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
            {star} étoile{star > 1 ? 's' : ''}
          </span>
        </button>
      ))}
    </div>
  );
}