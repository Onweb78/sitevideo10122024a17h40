import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Menu, X, Film, Tv, Clock, Heart } from 'lucide-react';
import { useSearch } from '../hooks/useSearch';
import { SearchResults } from './SearchResults';
import { useAuth } from '../contexts/AuthContext';
import { useAdmin } from '../contexts/AdminContext';
import { pageService } from '../services/pageService';

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { query, setQuery, results, loading } = useSearch();
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [navbarPages, setNavbarPages] = useState([]);
  const searchRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();
  const { isAdmin } = useAdmin();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchNavbarPages = async () => {
      try {
        const pages = await pageService.getPagesByLocation('navbar');
        setNavbarPages(pages);
      } catch (error) {
        console.error('Error fetching navbar pages:', error);
      }
    };

    fetchNavbarPages();
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchFocused(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleNavigation = (path: string) => {
    navigate(path);
    window.scrollTo(0, 0);
    setIsMenuOpen(false);
  };

  return (
    <nav className="bg-gray-900 text-white sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <button
              onClick={() => handleNavigation('/')}
              className="flex items-center space-x-2"
            >
              <Film className="w-8 h-8 text-blue-500" />
              <span className="text-xl font-bold">VKStream</span>
            </button>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            <button
              onClick={() => handleNavigation('/movies')}
              className="hover:text-blue-500 flex items-center gap-2"
            >
              <Film className="w-4 h-4" />
              Films
            </button>
            <button
              onClick={() => handleNavigation('/series')}
              className="hover:text-blue-500 flex items-center gap-2"
            >
              <Tv className="w-4 h-4" />
              Séries
            </button>
            <button
              onClick={() => handleNavigation('/latest')}
              className="hover:text-blue-500 flex items-center gap-2"
            >
              <Clock className="w-4 h-4" />
              Nouveautés
            </button>
            <button
              onClick={() => handleNavigation('/favorites')}
              className="hover:text-blue-500 flex items-center gap-2"
            >
              <Heart className="w-4 h-4" />
              Favoris
            </button>
            {navbarPages.map(page => (
              <button
                key={page.id}
                onClick={() => handleNavigation(page.path)}
                className="hover:text-blue-500"
              >
                {page.title}
              </button>
            ))}
          </div>

          <div className="hidden md:flex items-center space-x-4">
            <div ref={searchRef} className="relative">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Rechercher..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onFocus={() => setIsSearchFocused(true)}
                  className="bg-gray-800 text-white px-4 py-2 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
                />
                {loading ? (
                  <div className="absolute right-3 top-2.5 w-5 h-5">
                    <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-blue-500"></div>
                  </div>
                ) : (
                  <Search className="absolute right-3 top-2.5 w-5 h-5 text-gray-400" />
                )}
              </div>
              {isSearchFocused && query && (
                <SearchResults 
                  results={results} 
                  onClose={() => setIsSearchFocused(false)} 
                />
              )}
            </div>

            {!user ? (
              <button
                onClick={() => handleNavigation('/auth')}
                className="bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700 transition-colors"
              >
                Connexion
              </button>
            ) : (
              <button
                onClick={() => handleNavigation(isAdmin ? "/admin" : "/profile")}
                className="text-white hover:text-blue-500 transition-colors"
              >
                {user.username}
              </button>
            )}
          </div>

          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-md hover:bg-gray-800"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <button
              onClick={() => handleNavigation('/movies')}
              className="block px-3 py-2 rounded-md hover:bg-gray-800 w-full text-left"
            >
              Films
            </button>
            <button
              onClick={() => handleNavigation('/series')}
              className="block px-3 py-2 rounded-md hover:bg-gray-800 w-full text-left"
            >
              Séries
            </button>
            <button
              onClick={() => handleNavigation('/latest')}
              className="block px-3 py-2 rounded-md hover:bg-gray-800 w-full text-left"
            >
              Nouveautés
            </button>
            <button
              onClick={() => handleNavigation('/favorites')}
              className="block px-3 py-2 rounded-md hover:bg-gray-800 w-full text-left"
            >
              Favoris
            </button>
            {navbarPages.map(page => (
              <button
                key={page.id}
                onClick={() => handleNavigation(page.path)}
                className="block px-3 py-2 rounded-md hover:bg-gray-800 w-full text-left"
              >
                {page.title}
              </button>
            ))}
            {!user ? (
              <button
                onClick={() => handleNavigation('/auth')}
                className="block px-3 py-2 rounded-md hover:bg-gray-800 w-full text-left"
              >
                Connexion
              </button>
            ) : (
              <button
                onClick={() => handleNavigation(isAdmin ? "/admin" : "/profile")}
                className="block px-3 py-2 rounded-md hover:bg-gray-800 w-full text-left"
              >
                {user.username}
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}