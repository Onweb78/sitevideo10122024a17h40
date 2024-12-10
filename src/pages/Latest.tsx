import { useState } from 'react';
import { MovieCard } from '../components/MovieCard';
import { GenreFilter } from '../components/GenreFilter';
import { useTMDB } from '../hooks/useTMDB';
import { tmdb } from '../services/tmdb';
import { TMDBMovie, TMDBTVShow, TMDBResponse } from '../types/tmdb';
import { formatTMDBMovie, formatTMDBTVShow } from '../utils/tmdb';

export function Latest() {
  const [selectedGenre, setSelectedGenre] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const { data: latestMovies, loading: moviesLoading } = useTMDB<TMDBResponse<TMDBMovie>>(
    () => tmdb.getLatestMovies(selectedGenre, currentPage),
    [selectedGenre, currentPage]
  );

  const { data: latestTVShows, loading: showsLoading } = useTMDB<TMDBResponse<TMDBTVShow>>(
    () => tmdb.getLatestTVShows(selectedGenre, currentPage),
    [selectedGenre, currentPage]
  );

  const { data: movieGenres } = useTMDB<{ genres: { id: number; name: string }[] }>(
    () => tmdb.getMovieGenres(),
    []
  );

  const { data: tvGenres } = useTMDB<{ genres: { id: number; name: string }[] }>(
    () => tmdb.getTVGenres(),
    []
  );

  if (moviesLoading || showsLoading || !latestMovies || !latestTVShows || !movieGenres || !tvGenres) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500" />
      </div>
    );
  }

  // Fusionner et dédupliquer les genres des films et séries
  const allGenres = Array.from(new Map(
    [...movieGenres.genres, ...tvGenres.genres]
      .map(genre => [genre.id, genre])
  ).values());

  const loadMore = () => {
    setCurrentPage((prev) => prev + 1);
  };

  // Filtrer et trier le contenu
  const allContent = [
    ...latestMovies.results.map(movie => ({
      ...formatTMDBMovie(movie),
      type: 'movie' as const,
      genreIds: movie.genres?.map(g => g.id) || []
    })),
    ...latestTVShows.results.map(show => ({
      ...formatTMDBTVShow(show),
      type: 'tv' as const,
      genreIds: show.genres?.map(g => g.id) || []
    }))
  ]
  .filter(item => !selectedGenre || item.genreIds.includes(selectedGenre))
  .sort((a, b) => (b.year || 0) - (a.year || 0));

  const totalPages = Math.max(latestMovies.total_pages, latestTVShows.total_pages);

  return (
    <div className="min-h-screen bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-white mb-8">Nouveautés</h1>
        
        <GenreFilter 
          selectedGenre={selectedGenre} 
          onGenreSelect={setSelectedGenre}
          genres={allGenres}
        />

        {allContent.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {allContent.map((item) => (
              <MovieCard 
                key={`${item.type}-${item.id}`} 
                movie={item} 
              />
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-400 py-12">
            Aucun contenu trouvé pour ce genre.
          </div>
        )}

        {currentPage < totalPages && allContent.length > 0 && (
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