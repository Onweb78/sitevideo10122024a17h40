import { useState, useEffect } from 'react';

interface Rating {
  movieId: number;
  rating: number;
  timestamp: number;
}

export function useRatings() {
  const [ratings, setRatings] = useState<Rating[]>(() => {
    const saved = localStorage.getItem('ratings');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('ratings', JSON.stringify(ratings));
  }, [ratings]);

  const rateMovie = (movieId: number, rating: number) => {
    setRatings(prev => {
      const existing = prev.findIndex(r => r.movieId === movieId);
      if (existing !== -1) {
        return prev.map(r => 
          r.movieId === movieId 
            ? { ...r, rating, timestamp: Date.now() }
            : r
        );
      }
      return [...prev, { movieId, rating, timestamp: Date.now() }];
    });
  };

  const getRating = (movieId: number): number | null => {
    const rating = ratings.find(r => r.movieId === movieId);
    return rating ? rating.rating : null;
  };

  return { ratings, rateMovie, getRating };
}