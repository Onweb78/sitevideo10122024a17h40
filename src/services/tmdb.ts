import axios from 'axios';
import { StreamingAvailability } from '../types/streaming';
import { streamingServices } from '../data/streamingServices';
import { TMDBMovie, TMDBTVShow, TMDBResponse } from '../types/tmdb';

const TMDB_API_KEY = '639bea9faaa25fe3d3af829a1d58e6bc';
const BASE_URL = 'https://api.themoviedb.org/3';

export function getImageUrl(path: string | null, size: 'w92' | 'w154' | 'w185' | 'w342' | 'w500' | 'w780' | 'original' = 'w500'): string {
  if (!path) return '/placeholder.jpg';
  return `https://image.tmdb.org/t/p/${size}${path}`;
}

class TMDBService {
  private api = axios.create({
    baseURL: BASE_URL,
    params: {
      api_key: TMDB_API_KEY,
      language: 'fr-FR'
    }
  });

  async getMovieGenres() {
    const { data } = await this.api.get('/genre/movie/list');
    return data;
  }

  async getTVGenres() {
    const { data } = await this.api.get('/genre/tv/list');
    return data;
  }

  async getMoviesByFilter(filter: 'popular' | 'top_rated' | 'upcoming' | 'now_playing', genreId: number | null = null, page = 1): Promise<TMDBResponse<TMDBMovie>> {
    const params: Record<string, any> = {
      page,
      with_genres: genreId || undefined
    };

    let endpoint = genreId ? '/discover/movie' : `/movie/${filter}`;

    if (filter === 'top_rated') {
      params.sort_by = 'vote_average.desc';
      params.vote_count_gte = 100;
    } else if (filter === 'upcoming') {
      params.sort_by = 'primary_release_date.asc';
      params.primary_release_date_gte = new Date().toISOString().split('T')[0];
    } else if (filter === 'now_playing') {
      params.sort_by = 'primary_release_date.desc';
      const oneMonthAgo = new Date();
      oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
      params.primary_release_date_lte = new Date().toISOString().split('T')[0];
      params.primary_release_date_gte = oneMonthAgo.toISOString().split('T')[0];
    } else {
      params.sort_by = 'popularity.desc';
    }

    const { data } = await this.api.get(endpoint, { params });

    // Get full details for each movie
    const movies = await Promise.all(
      data.results.map(async (movie: TMDBMovie) => {
        const { data: details } = await this.api.get(`/movie/${movie.id}`, {
          params: {
            append_to_response: 'credits,videos'
          }
        });
        return details;
      })
    );

    return {
      ...data,
      results: movies
    };
  }

  async getTVShowsByFilter(filter: 'popular' | 'top_rated' | 'on_the_air' | 'airing_today', genreId: number | null = null, page = 1): Promise<TMDBResponse<TMDBTVShow>> {
    const params = {
      page,
      with_genres: genreId || undefined
    };

    const endpoint = genreId ? '/discover/tv' : `/tv/${filter}`;
    const { data } = await this.api.get(endpoint, { params });

    // Get full details for each show
    const shows = await Promise.all(
      data.results.map(async (show: TMDBTVShow) => {
        const { data: details } = await this.api.get(`/tv/${show.id}`, {
          params: {
            append_to_response: 'credits,videos'
          }
        });
        return details;
      })
    );

    return {
      ...data,
      results: shows
    };
  }

  async getPopularMovies(genreId: number | null = null, page = 1) {
    return this.getMoviesByFilter('popular', genreId, page);
  }

  async getPopularTVShows(genreId: number | null = null, page = 1) {
    return this.getTVShowsByFilter('popular', genreId, page);
  }

  async getLatestMovies(genreId: number | null = null, page = 1) {
    const params = {
      page,
      with_genres: genreId || undefined,
      sort_by: 'release_date.desc',
      'primary_release_date.lte': new Date().toISOString().split('T')[0],
      'primary_release_date.gte': new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    };

    const endpoint = genreId ? '/discover/movie' : '/movie/now_playing';
    const { data } = await this.api.get(endpoint, { params });

    // Get full details for each movie
    const movies = await Promise.all(
      data.results.map(async (movie: TMDBMovie) => {
        const { data: details } = await this.api.get(`/movie/${movie.id}`, {
          params: {
            append_to_response: 'credits,videos'
          }
        });
        return details;
      })
    );

    return {
      ...data,
      results: movies
    };
  }

  async getLatestTVShows(genreId: number | null = null, page = 1) {
    const params = {
      page,
      with_genres: genreId || undefined,
      sort_by: 'first_air_date.desc',
      'first_air_date.lte': new Date().toISOString().split('T')[0],
      'first_air_date.gte': new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    };

    const endpoint = genreId ? '/discover/tv' : '/tv/on_the_air';
    const { data } = await this.api.get(endpoint, { params });

    // Get full details for each show
    const shows = await Promise.all(
      data.results.map(async (show: TMDBTVShow) => {
        const { data: details } = await this.api.get(`/tv/${show.id}`, {
          params: {
            append_to_response: 'credits,videos'
          }
        });
        return details;
      })
    );

    return {
      ...data,
      results: shows
    };
  }

  async getMovieDetails(movieId: number) {
    const { data } = await this.api.get(`/movie/${movieId}`, {
      params: {
        append_to_response: 'credits,videos,similar'
      }
    });

    // Get full details for similar movies
    if (data.similar?.results) {
      data.similar.results = await Promise.all(
        data.similar.results.map(async (movie: TMDBMovie) => {
          const { data: details } = await this.api.get(`/movie/${movie.id}`, {
            params: {
              append_to_response: 'credits,videos'
            }
          });
          return details;
        })
      );
    }

    return data;
  }

  async getTVShowDetails(tvId: number) {
    const { data } = await this.api.get(`/tv/${tvId}`, {
      params: {
        append_to_response: 'credits,videos,similar'
      }
    });

    // Get full details for similar shows
    if (data.similar?.results) {
      data.similar.results = await Promise.all(
        data.similar.results.map(async (show: TMDBTVShow) => {
          const { data: details } = await this.api.get(`/tv/${show.id}`, {
            params: {
              append_to_response: 'credits,videos'
            }
          });
          return details;
        })
      );
    }

    return data;
  }

  async getPersonDetails(personId: number) {
    const { data } = await this.api.get(`/person/${personId}`, {
      params: {
        append_to_response: 'combined_credits'
      }
    });

    // Get full details for each credit
    if (data.combined_credits?.cast) {
      data.combined_credits.cast = await Promise.all(
        data.combined_credits.cast.map(async (credit: any) => {
          try {
            const { data: details } = await this.api.get(
              `/${credit.media_type}/${credit.id}`,
              {
                params: {
                  append_to_response: 'credits,videos'
                }
              }
            );
            return { ...credit, ...details };
          } catch (error) {
            console.error(`Error fetching details for ${credit.media_type}/${credit.id}:`, error);
            return credit;
          }
        })
      );
    }

    return data;
  }

  async searchMulti(query: string) {
    if (!query.trim()) return { results: [] };
    const { data } = await this.api.get('/search/multi', {
      params: { query }
    });
    return data;
  }

  async getStreamingAvailability(): Promise<StreamingAvailability> {
    return {
      subscription: [
        streamingServices.netflix,
        streamingServices.prime,
        streamingServices.max
      ],
      rental: [
        { service: streamingServices.googleplay, price: 3.99 },
        { service: streamingServices.appletv, price: 4.99 },
        { service: streamingServices.youtube, price: 3.99 }
      ],
      purchase: [
        { service: streamingServices.googleplay, price: 9.99 },
        { service: streamingServices.appletv, price: 11.99 },
        { service: streamingServices.microsoft, price: 9.99 }
      ]
    };
  }
}

export const tmdb = new TMDBService();