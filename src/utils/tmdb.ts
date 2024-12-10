import { TMDBMovie, TMDBTVShow } from '../types/tmdb';
import { Movie } from '../types/movie';

export const formatTMDBMovie = (movie: TMDBMovie): Movie => ({
  id: movie.id,
  title: movie.title,
  posterUrl: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
  backdropUrl: `https://image.tmdb.org/t/p/original${movie.backdrop_path}`,
  releaseDate: movie.release_date,
  year: movie.release_date ? new Date(movie.release_date).getFullYear() : null,
  rating: Math.round(movie.vote_average * 10) / 10,
  duration: movie.runtime ? `${movie.runtime}min` : undefined,
  quality: 'HD',
  description: movie.overview,
  genres: movie.genres.map(g => g.name),
  genreIds: movie.genres.map(g => g.id),
  type: 'movie',
  mediaType: 'movie'
});

export const formatTMDBTVShow = (show: TMDBTVShow): Movie => ({
  id: show.id,
  title: show.name,
  posterUrl: `https://image.tmdb.org/t/p/w500${show.poster_path}`,
  backdropUrl: `https://image.tmdb.org/t/p/original${show.backdrop_path}`,
  releaseDate: show.first_air_date,
  year: show.first_air_date ? new Date(show.first_air_date).getFullYear() : null,
  rating: Math.round(show.vote_average * 10) / 10,
  quality: 'HD',
  description: show.overview,
  genres: show.genres.map(g => g.name),
  genreIds: show.genres.map(g => g.id),
  type: 'tv',
  mediaType: 'tv'
});