import { useParams } from 'react-router-dom';
import { Film, Tv } from 'lucide-react';
import { useTMDB } from '../hooks/useTMDB';
import { MovieCard } from '../components/MovieCard';
import { formatDate } from '../utils/format';
import { tmdb } from '../services/tmdb';

interface CreditType {
  id: number;
  title?: string;
  name?: string;
  poster_path: string | null;
  release_date?: string;
  first_air_date?: string;
  vote_average: number;
  character: string;
  media_type: 'movie' | 'tv';
  genres: { id: number; name: string }[];
}

interface ActorDetails {
  name: string;
  profile_path: string;
  known_for_department: string;
  birthday: string;
  deathday: string | null;
  place_of_birth: string;
  homepage: string | null;
  biography: string;
  combined_credits?: {
    cast: CreditType[];
  };
}

export function ActorDetails() {
  const { id } = useParams();
  const { data: actor, loading } = useTMDB<ActorDetails>(
    () => tmdb.getPersonDetails(Number(id)),
    [id]
  );

  if (loading || !actor) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Filter and deduplicate movies and TV shows
  const uniqueMovies = new Map();
  const uniqueTVShows = new Map();

  actor.combined_credits?.cast?.forEach((credit: CreditType) => {
    if (!credit.poster_path) return;

    const releaseDate = credit.media_type === 'movie' 
      ? credit.release_date 
      : credit.first_air_date;

    const year = releaseDate 
      ? new Date(releaseDate).getFullYear()
      : null;

    if (!year) return;

    const item = {
      id: credit.id,
      title: credit.media_type === 'movie' ? credit.title : credit.name,
      posterUrl: `https://image.tmdb.org/t/p/w500${credit.poster_path}`,
      releaseDate: releaseDate || '',
      year,
      rating: credit.vote_average || 0,
      quality: 'HD',
      description: `Rôle : ${credit.character || 'Non spécifié'}`,
      genres: credit.genres?.map(g => g.name) || [],
      type: credit.media_type
    };

    if (credit.media_type === 'movie') {
      uniqueMovies.set(credit.id, item);
    } else if (credit.media_type === 'tv') {
      uniqueTVShows.set(credit.id, item);
    }
  });

  const movies = Array.from(uniqueMovies.values())
    .sort((a, b) => b.year - a.year);

  const tvShows = Array.from(uniqueTVShows.values())
    .sort((a, b) => b.year - a.year);

  return (
    <div className="min-h-screen bg-gray-900 py-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Left Column - Photo and Personal Info */}
          <div className="lg:w-1/3">
            <div className="sticky top-24">
              <img
                src={`https://image.tmdb.org/t/p/original${actor.profile_path}`}
                alt={actor.name}
                className="w-full rounded-lg shadow-xl mb-8"
              />
              
              <div className="space-y-6 text-white">
                <div>
                  <h3 className="text-gray-400 font-medium mb-1">Métier:</h3>
                  <p>{actor.known_for_department}</p>
                </div>
                
                {actor.birthday && (
                  <div>
                    <h3 className="text-gray-400 font-medium mb-1">Date de naissance:</h3>
                    <p>{formatDate(actor.birthday)}</p>
                  </div>
                )}
                
                {actor.place_of_birth && (
                  <div>
                    <h3 className="text-gray-400 font-medium mb-1">Lieu de naissance:</h3>
                    <p>{actor.place_of_birth}</p>
                  </div>
                )}

                {actor.deathday && (
                  <div>
                    <h3 className="text-gray-400 font-medium mb-1">Date de décès:</h3>
                    <p>{formatDate(actor.deathday)}</p>
                  </div>
                )}

                {actor.homepage && (
                  <div>
                    <h3 className="text-gray-400 font-medium mb-1">Site web:</h3>
                    <a 
                      href={actor.homepage}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-400 hover:text-blue-300"
                    >
                      {actor.homepage}
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Biography and Filmography */}
          <div className="lg:w-2/3">
            <h1 className="text-4xl font-bold text-white mb-8">{actor.name}</h1>
            
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-white mb-6">Biographie</h2>
              <div className="text-gray-300 space-y-4 leading-relaxed">
                {actor.biography ? (
                  actor.biography.split('\n').map((paragraph: string, index: number) => (
                    <p key={index}>{paragraph}</p>
                  ))
                ) : (
                  <p>Aucune biographie disponible.</p>
                )}
              </div>
            </section>

            {movies.length > 0 && (
              <section className="mb-12">
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                  <Film className="w-6 h-6" />
                  Filmographie ({movies.length})
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
                  {movies.map((movie) => (
                    <MovieCard
                      key={`movie-${movie.id}`}
                      movie={movie}
                    />
                  ))}
                </div>
              </section>
            )}

            {tvShows.length > 0 && (
              <section>
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                  <Tv className="w-6 h-6" />
                  Séries TV ({tvShows.length})
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
                  {tvShows.map((show) => (
                    <MovieCard
                      key={`tv-${show.id}`}
                      movie={show}
                    />
                  ))}
                </div>
              </section>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}