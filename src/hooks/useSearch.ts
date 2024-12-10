import { useState, useEffect, useCallback } from 'react';
import { debounce } from '../utils/debounce';
import { tmdb } from '../services/tmdb';
import { TMDBMovie, TMDBTVShow } from '../types/tmdb';

interface SearchResultBase {
  id: number;
  media_type: 'movie' | 'tv';
  poster_path: string | null;
}

type SearchResult = (TMDBMovie | TMDBTVShow) & SearchResultBase;

export function useSearch() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const searchMovies = useCallback(
    debounce(async (searchQuery: string) => {
      if (!searchQuery.trim()) {
        setResults([]);
        return;
      }

      try {
        setLoading(true);
        const data = await tmdb.searchMulti(searchQuery);
        const typedResults = data.results as SearchResult[];
        setResults(typedResults.filter(result => 
          (result.media_type === 'movie' || result.media_type === 'tv') && 
          result.poster_path !== null
        ));
      } catch (err) {
        setError(err instanceof Error ? err : new Error('An error occurred'));
      } finally {
        setLoading(false);
      }
    }, 300),
    []
  );

  useEffect(() => {
    searchMovies(query);
  }, [query, searchMovies]);

  return { query, setQuery, results, loading, error };
}