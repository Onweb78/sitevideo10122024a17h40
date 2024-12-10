export interface Genre {
  id: number;
  name: string;
}

export interface Movie {
  id: number;
  title: string;
  posterUrl: string;
  releaseDate: string;
  year: number | null;
  rating: number;
  duration?: string;
  quality: string;
  genres?: string[];
  description: string;
  backdropUrl?: string;
  type?: 'movie' | 'tv';
  mediaType?: 'movie' | 'tv';
  genreIds?: number[];
}