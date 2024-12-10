import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Play, Star, Calendar } from 'lucide-react';
import { useTMDB } from '../hooks/useTMDB';
import { tmdb } from '../services/tmdb';
import { MovieCard } from '../components/MovieCard';
import { FavoriteButton } from '../components/FavoriteButton';
import { StreamingOptions } from '../components/StreamingOptions';
import { formatDate } from '../utils/format';
import { TMDBTVShow } from '../types/tmdb';

export function TVShowDetails() {
  const { id } = useParams();
  const [showTrailer, setShowTrailer] = useState(false);
  
  const { data: show, loading: showLoading } = useTMDB<TMDBTVShow>(
    () => tmdb.getTVShowDetails(Number(id)),
    [id]
  );

  const { data: streamingAvailability, loading: streamingLoading } = useTMDB(
    () => tmdb.getStreamingAvailability(),
    [id]
  );

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (showLoading || streamingLoading || !show || !streamingAvailability) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  const trailer = show.videos?.results.find(
    (video: { site: string; type: string }) => video.site === 'YouTube' && video.type === 'Trailer'
  );

  const creator = show.credits?.crew.find(
    person => person.job === 'Creator' || person.job === 'Executive Producer'
  );

  const cast = show.credits?.cast.slice(0, 10) || [];
  const similarShows = show.similar?.results.slice(0, 10) || [];

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="relative h-[70vh]">
        <img
          src={`https://image.tmdb.org/t/p/original${show.backdrop_path}`}
          alt={show.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/50">
          <div className="max-w-7xl mx-auto px-4 h-full flex items-center">
            <div className="max-w-3xl">
              <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
                {show.name}
              </h1>
              <div className="flex items-center gap-6 text-gray-300 mb-6">
                <span className="flex items-center gap-2">
                  <Star className="w-5 h-5 text-yellow-400" />
                  {show.vote_average.toFixed(1)}
                </span>
                <span className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  {formatDate(show.first_air_date)}
                </span>
                {show.genres && show.genres.length > 0 && (
                  <span className="text-blue-400">
                    {show.genres.map(genre => genre.name).join(', ')}
                  </span>
                )}
              </div>
              <p className="text-lg text-gray-300 mb-8 line-clamp-3">
                {show.overview}
              </p>
              <div className="flex items-center gap-4">
                {trailer && (
                  <button
                    onClick={() => setShowTrailer(true)}
                    className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-full font-semibold hover:bg-blue-700 transition-colors"
                  >
                    <Play className="w-5 h-5" />
                    Voir la bande annonce
                  </button>
                )}
                <FavoriteButton
                  movie={{
                    id: show.id,
                    title: show.name,
                    posterUrl: `https://image.tmdb.org/t/p/w500${show.poster_path}`,
                    releaseDate: show.first_air_date,
                    year: new Date(show.first_air_date).getFullYear(),
                    rating: show.vote_average,
                    quality: 'HD',
                    description: show.overview,
                    genres: show.genres?.map(g => g.name),
                    backdropUrl: `https://image.tmdb.org/t/p/original${show.backdrop_path}`,
                    type: 'tv'
                  }}
                  className="bg-gray-800/80"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid md:grid-cols-3 gap-12 mb-12">
          <div className="md:col-span-2">
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-white mb-6">Synopsis</h2>
              <p className="text-gray-300 leading-relaxed">{show.overview}</p>
            </section>

            {cast.length > 0 && (
              <section className="mb-12">
                <h2 className="text-2xl font-bold text-white mb-6">Casting</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                  {cast.map((actor) => (
                    <a
                      key={`${actor.id}-${actor.character}`}
                      href={`/actor/${actor.id}`}
                      className="group"
                    >
                      <img
                        src={actor.profile_path
                          ? `https://image.tmdb.org/t/p/w185${actor.profile_path}`
                          : '/placeholder-actor.jpg'
                        }
                        alt={actor.name}
                        className="w-full aspect-[2/3] object-cover rounded-lg mb-2"
                      />
                      <h4 className="text-white font-medium group-hover:text-blue-400 transition-colors">
                        {actor.name}
                      </h4>
                      <p className="text-sm text-gray-400">{actor.character}</p>
                    </a>
                  ))}
                </div>
              </section>
            )}

            <section className="mb-12">
              <StreamingOptions availability={streamingAvailability} />
            </section>
          </div>

          <div>
            <div className="bg-gray-800 rounded-lg p-6">
              <h3 className="text-xl font-bold text-white mb-4">Informations</h3>
              <dl className="space-y-4">
                {creator && (
                  <div>
                    <dt className="text-gray-400">Créateur</dt>
                    <dd className="text-white mt-1">{creator.name}</dd>
                  </div>
                )}
                {show.genres && show.genres.length > 0 && (
                  <div>
                    <dt className="text-gray-400">Genre</dt>
                    <dd className="text-white mt-1 flex flex-wrap gap-2">
                      {show.genres.map(genre => (
                        <span key={genre.id} className="bg-blue-600 px-2 py-1 rounded-full text-sm">
                          {genre.name}
                        </span>
                      ))}
                    </dd>
                  </div>
                )}
                {show.production_countries && (
                  <div>
                    <dt className="text-gray-400">Pays de production</dt>
                    <dd className="text-white mt-1">
                      {show.production_countries.map(country => country.name).join(', ')}
                    </dd>
                  </div>
                )}
                {show.spoken_languages && (
                  <div>
                    <dt className="text-gray-400">Langues</dt>
                    <dd className="text-white mt-1">
                      {show.spoken_languages.map(lang => lang.name).join(', ')}
                    </dd>
                  </div>
                )}
              </dl>
            </div>
          </div>
        </div>

        {showTrailer && trailer && (
          <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50">
            <div className="relative w-full max-w-4xl mx-4">
              <button
                onClick={() => setShowTrailer(false)}
                className="absolute -top-12 right-0 text-white hover:text-gray-300"
              >
                Fermer
              </button>
              <div className="aspect-video">
                <iframe
                  src={`https://www.youtube.com/embed/${trailer.key}`}
                  title="Trailer"
                  className="w-full h-full"
                  allowFullScreen
                ></iframe>
              </div>
            </div>
          </div>
        )}

        {similarShows.length > 0 && (
          <section>
            <h2 className="text-2xl font-bold text-white mb-6">Séries similaires</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
              {similarShows.map((similar) => (
                <MovieCard
                  key={similar.id}
                  movie={{
                    id: similar.id,
                    title: similar.name,
                    posterUrl: `https://image.tmdb.org/t/p/w500${similar.poster_path}`,
                    releaseDate: similar.first_air_date,
                    year: new Date(similar.first_air_date).getFullYear(),
                    rating: similar.vote_average,
                    quality: 'HD',
                    description: similar.overview,
                    genres: similar.genres?.map(g => g.name) || [],
                    backdropUrl: `https://image.tmdb.org/t/p/original${similar.backdrop_path}`,
                    type: 'tv'
                  }}
                />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}