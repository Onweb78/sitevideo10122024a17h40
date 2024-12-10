import { useState } from 'react';
import { Hero } from '../components/Hero';
import { MovieCard } from '../components/MovieCard';
import { GenreFilter } from '../components/GenreFilter';
import { useTMDB } from '../hooks/useTMDB';
import { tmdb } from '../services/tmdb';
import { TMDBMovie, TMDBTVShow, TMDBResponse } from '../types/tmdb';
import { formatTMDBMovie, formatTMDBTVShow } from '../utils/tmdb';

export function Home() {
  const [selectedGenre, setSelectedGenre] = useState<number | null>(null);

  const { data: genres } = useTMDB<{ genres: { id: number; name: string }[] }>(
    () => tmdb.getMovieGenres(),
    []
  );

  const { data: trendingMovies, loading: moviesLoading } = useTMDB<TMDBResponse<TMDBMovie>>(
    () => tmdb.getPopularMovies(selectedGenre),
    [selectedGenre]
  );

  const { data: trendingTVShows, loading: showsLoading } = useTMDB<TMDBResponse<TMDBTVShow>>(
    () => tmdb.getPopularTVShows(selectedGenre),
    [selectedGenre]
  );

  if (moviesLoading || showsLoading || !trendingMovies || !trendingTVShows || !genres) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  const featuredMovie = trendingMovies.results[0] ? {
    id: trendingMovies.results[0].id,
    title: trendingMovies.results[0].title,
    description: trendingMovies.results[0].overview,
    backdropUrl: `https://image.tmdb.org/t/p/original${trendingMovies.results[0].backdrop_path}`
  } : null;

  return (
    <div className="min-h-screen bg-gray-900">
      {featuredMovie && <Hero movie={featuredMovie} />}
      
      <div className="max-w-7xl mx-auto px-4 py-12">
        <GenreFilter 
          selectedGenre={selectedGenre} 
          onGenreSelect={setSelectedGenre}
          genres={genres.genres}
        />

        <section className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-6">Films Populaires</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {trendingMovies.results.slice(1, 11).map((movie) => (
              <MovieCard key={movie.id} movie={formatTMDBMovie(movie)} />
            ))}
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-6">Séries Populaires</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {trendingTVShows.results.slice(0, 10).map((show) => (
              <MovieCard key={show.id} movie={formatTMDBTVShow(show)} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}