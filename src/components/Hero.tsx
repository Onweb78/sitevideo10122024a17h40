import { Play } from 'lucide-react';
import { Link } from 'react-router-dom';

interface HeroMovie {
  id: number;
  title: string;
  description: string;
  backdropUrl: string;
}

interface HeroProps {
  movie: HeroMovie;
}

export function Hero({ movie }: HeroProps) {
  return (
    <div className="relative h-[70vh] overflow-hidden">
      <img
        src={movie.backdropUrl}
        alt={movie.title}
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-black via-black/50 to-transparent">
        <div className="max-w-7xl mx-auto px-4 h-full flex items-center">
          <div className="max-w-2xl text-white">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">{movie.title}</h1>
            <p className="text-lg mb-8">{movie.description}</p>
            <Link
              to={`/movie/${movie.id}`}
              className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-full font-semibold hover:bg-blue-700 transition-colors"
            >
              <Play className="w-5 h-5" />
              Regarder maintenant
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}