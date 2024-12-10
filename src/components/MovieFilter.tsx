import { TrendingUp, Star, Calendar, Clapperboard } from 'lucide-react';

type FilterType = 'popular' | 'top_rated' | 'upcoming' | 'now_playing';

interface MovieFilterProps {
  selectedFilter: FilterType;
  onFilterSelect: (filter: FilterType) => void;
}

export function MovieFilter({ selectedFilter, onFilterSelect }: MovieFilterProps) {
  const filters = [
    { id: 'popular', label: 'Populaire', icon: TrendingUp },
    { id: 'top_rated', label: 'Les mieux notés', icon: Star },
    { id: 'upcoming', label: 'À venir', icon: Calendar },
    { id: 'now_playing', label: 'En salle', icon: Clapperboard },
  ] as const;

  return (
    <div className="flex flex-wrap gap-2 mb-8">
      {filters.map(({ id, label, icon: Icon }) => (
        <button
          key={id}
          onClick={() => onFilterSelect(id as FilterType)}
          className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            selectedFilter === id
              ? 'bg-blue-600 text-white'
              : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
          }`}
        >
          <Icon className="w-4 h-4" />
          {label}
        </button>
      ))}
    </div>
  );
}