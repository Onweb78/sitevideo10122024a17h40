import { useState, useEffect } from 'react';
import { doc, setDoc, deleteDoc, collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '../config/firebase';
import { useAuth } from '../contexts/AuthContext';
import { Movie } from '../types/movie';

export function useFavorites() {
  const [favorites, setFavorites] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) {
      setFavorites([]);
      setLoading(false);
      return;
    }

    const q = query(
      collection(db, 'favorites'),
      where('userId', '==', user.uid)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const favs: Movie[] = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        favs.push({
          id: data.movieId,
          title: data.title,
          posterUrl: data.posterUrl,
          releaseDate: data.releaseDate,
          year: data.year,
          rating: data.rating,
          quality: data.quality || 'HD',
          description: data.description,
          backdropUrl: data.backdropUrl,
          genres: data.genres || [],
          type: data.type || 'movie',
          mediaType: data.mediaType || 'movie'
        });
      });
      setFavorites(favs);
      setLoading(false);
    }, (error) => {
      console.error("Erreur lors de la récupération des favoris:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  const addFavorite = async (movie: Movie) => {
    if (!user) return;

    try {
      const favoriteRef = doc(db, 'favorites', `${user.uid}_${movie.id}`);
      await setDoc(favoriteRef, {
        userId: user.uid,
        movieId: movie.id,
        title: movie.title,
        posterUrl: movie.posterUrl,
        releaseDate: movie.releaseDate,
        year: movie.year,
        rating: movie.rating,
        quality: movie.quality || 'HD',
        description: movie.description,
        backdropUrl: movie.backdropUrl,
        genres: movie.genres || [],
        type: movie.type || 'movie',
        mediaType: movie.mediaType || 'movie',
        createdAt: new Date()
      });
    } catch (error) {
      console.error("Erreur lors de l'ajout aux favoris:", error);
      throw error;
    }
  };

  const removeFavorite = async (movieId: number) => {
    if (!user) return;
    
    try {
      const favoriteRef = doc(db, 'favorites', `${user.uid}_${movieId}`);
      await deleteDoc(favoriteRef);
    } catch (error) {
      console.error("Erreur lors de la suppression des favoris:", error);
      throw error;
    }
  };

  const isFavorite = (movieId: number): boolean => {
    return favorites.some(movie => movie.id === movieId);
  };

  return {
    favorites,
    loading,
    addFavorite,
    removeFavorite,
    isFavorite
  };
}