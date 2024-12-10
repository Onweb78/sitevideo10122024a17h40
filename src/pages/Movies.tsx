import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { MovieCard } from '../components/MovieCard';
import { GenreFilter } from '../components/GenreFilter';
import { MovieFilter } from '../components/MovieFilter';
import { useTMDB } from '../hooks/useTMDB';
import { tmdb } from '../services/tmdb';
import { TMDBMovie, TMDBResponse } from '../types/tmdb';
import { formatTMDBMovie } from '../utils/tmdb';

export function Movies() {
  const [searchParams] = useSearchParams();
  const filterFromUrl = searchParams.get('filter') as 'popular' | 'top_rated' | 'upcoming' | 'now_playing' | null;
  
  const [selectedGenre, setSelectedGenre] = useState<number | null>(null);
  const [selectedFilter, setSelectedFilter] = useState<'popular' | 'top_rated' | 'upcoming' | 'now_playing'>(
    filterFromUrl || 'popular'
  );
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    // If no filter in URL or filter is 'popular', set to popular
    if (!filterFromUrl) {
      setSelectedFilter('popular');
    } else {
      setSelectedFilter(filterFromUrl);
    }
  }, [filterFromUrl]);

  const { data: movies, loading } = useTMDB<TMDBResponse<TMDBMovie>>(
    () => tmdb.getMoviesByFilter(selectedFilter, selectedGenre, currentPage),
    [selectedFilter, selectedGenre, currentPage]
  );

  const { data: genres } = useTMDB<{ genres: { id: number; name: string }[] }>(
    () => tmdb.getMovieGenres(),
    []
  );

  if (loading || !movies || !genres) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  const handleGenreSelect = (genreId: number | null) => {
    setSelectedGenre(genreId);
    setCurrentPage(1);
  };

  const handleFilterSelect = (filter: 'popular' | 'top_rated' | 'upcoming' | 'now_playing') => {
    setSelectedFilter(filter);
    setCurrentPage(1);
  };

  const loadMore = () => {
    setCurrentPage((prev) => prev + 1);
  };

  return (
    <div className="min-h-screen bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-white mb-8">Films</h1>
        
        <MovieFilter 
          selectedFilter={selectedFilter}
          onFilterSelect={handleFilterSelect}
        />

        <GenreFilter 
          selectedGenre={selectedGenre} 
          onGenreSelect={handleGenreSelect}
          genres={genres.genres}
        />

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {movies.results.map((movie) => (
            <MovieCard key={movie.id} movie={formatTMDBMovie(movie)} />
          ))}
        </div>

        {currentPage < movies.total_pages && (
          <div className="mt-12 text-center">
            <button
              onClick={loadMore}
              className="bg-blue-600 text-white px-6 py-3 rounded-full font-semibold hover:bg-blue-700 transition-colors"
            >
              Charger plus
            </button>
          </div>
        )}
      </div>
    </div>
  );
}