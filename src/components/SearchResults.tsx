import { Link } from 'react-router-dom';
import { Star } from 'lucide-react';
import { TMDBMovie, TMDBTVShow } from '../types/tmdb';
import { getImageUrl } from '../services/tmdb';

interface SearchResultsProps {
  results: (TMDBMovie | TMDBTVShow)[];
  onClose: () => void;
}

export function SearchResults({ results, onClose }: SearchResultsProps) {
  if (results.length === 0) {
    return (
      <div className="absolute top-full mt-2 w-full bg-gray-800 rounded-lg shadow-xl p-4">
        <p className="text-gray-400">Aucun résultat trouvé</p>
      </div>
    );
  }

  return (
    <div className="absolute top-full mt-2 w-full bg-gray-800 rounded-lg shadow-xl overflow-hidden max-h-[70vh] overflow-y-auto">
      {results.map((result) => {
        const isMovie = 'title' in result;
        const title = isMovie ? result.title : result.name;
        const path = isMovie ? `/movie/${result.id}` : `/tv/${result.id}`;
        const year = new Date(isMovie ? result.release_date : result.first_air_date).getFullYear();

        return (
          <Link
            key={result.id}
            to={path}
            className="flex items-center gap-4 p-4 hover:bg-gray-700 transition-colors"
            onClick={onClose}
          >
            <img
              src={getImageUrl(result.poster_path, 'w92')}
              alt={title}
              className="w-12 h-18 object-cover rounded"
            />
            <div className="flex-1 min-w-0">
              <h4 className="text-white font-medium truncate">{title}</h4>
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <span>{year}</span>
                <span className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-yellow-400" />
                  {result.vote_average.toFixed(1)}
                </span>
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
}