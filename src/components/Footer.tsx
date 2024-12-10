import { Film, Twitter, Github } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { pageService, Page } from '../services/pageService';

export function Footer() {
  const [footerPages, setFooterPages] = useState<{
    films: Page[];
    series: Page[];
    pages: Page[];
    legal: Page[];
  }>({
    films: [],
    series: [],
    pages: [],
    legal: []
  });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFooterPages = async () => {
      try {
        const pages = await pageService.getPagesByLocation('footer');
        
        // Group pages by column
        const groupedPages = pages.reduce((acc, page) => {
          const column = page.column || 'pages';
          if (!acc[column]) {
            acc[column] = [];
          }
          acc[column].push(page);
          return acc;
        }, {
          films: [],
          series: [],
          pages: [],
          legal: []
        });

        setFooterPages(groupedPages);
      } catch (error) {
        console.error('Error fetching footer pages:', error);
      }
    };

    fetchFooterPages();
  }, []);

  const handleNavigation = (path: string) => {
    navigate(path);
    window.scrollTo(0, 0);
  };

  return (
    <footer className="bg-gray-900 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
          {/* Logo and Description */}
          <div className="col-span-1">
            <div 
              onClick={() => handleNavigation('/')}
              className="flex items-center space-x-2 mb-4 cursor-pointer"
            >
              <Film className="w-8 h-8 text-blue-500" />
              <span className="text-xl font-bold text-white">VKStream</span>
            </div>
            <p className="text-gray-400 text-sm">
              VKStream est votre destination de streaming préférée pour regarder les derniers films et séries en haute qualité.
            </p>
            <div className="flex space-x-4 mt-4">
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <Github className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Films Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Films</h3>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => handleNavigation('/movies')}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Films Populaires
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNavigation('/movies?filter=top_rated')}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Les Mieux Notés
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNavigation('/movies?filter=upcoming')}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  À Venir
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNavigation('/movies?filter=now_playing')}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  En Salle
                </button>
              </li>
              {footerPages.films.map(page => (
                <li key={page.id}>
                  <button
                    onClick={() => handleNavigation(page.path)}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    {page.title}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Series Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Séries TV</h3>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => handleNavigation('/series')}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Séries Populaires
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNavigation('/series?filter=top_rated')}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Les Mieux Notées
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNavigation('/series?filter=on_the_air')}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  En Cours
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNavigation('/series?filter=airing_today')}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Diffusées Aujourd'hui
                </button>
              </li>
              {footerPages.series.map(page => (
                <li key={page.id}>
                  <button
                    onClick={() => handleNavigation(page.path)}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    {page.title}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Pages Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Pages</h3>
            <ul className="space-y-2">
              {footerPages.pages.map(page => (
                <li key={page.id}>
                  <button
                    onClick={() => handleNavigation(page.path)}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    {page.title}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Légal</h3>
            <ul className="space-y-2">
              {footerPages.legal.map(page => (
                <li key={page.id}>
                  <button
                    onClick={() => handleNavigation(page.path)}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    {page.title}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-800">
          <p className="text-center text-gray-400 text-sm">
            © {new Date().getFullYear()} VKStream. Tous droits réservés.
          </p>
        </div>
      </div>
    </footer>
  );
}