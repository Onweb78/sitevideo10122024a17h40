import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Ad } from '../types/ad';
import { adService } from '../services/adService';
import { useLocation } from 'react-router-dom';

export function InterstitialAd() {
  const [ad, setAd] = useState<Ad | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const location = useLocation();

  useEffect(() => {
    let displayTimeoutId: NodeJS.Timeout;
    let initialTimeoutId: NodeJS.Timeout;

    const showAd = async () => {
      try {
        const activeAd = await adService.getActiveAd();
        
        if (activeAd) {
          setAd(activeAd);
          setIsVisible(true);

          // Fermer automatiquement après la durée spécifiée
          const duration = activeAd.displayDuration || 10;
          displayTimeoutId = setTimeout(() => {
            setIsVisible(false);
          }, duration * 1000);
        }
      } catch (error) {
        console.error('Error showing ad:', error);
      }
    };

    // Attendre un peu avant d'afficher la pub pour une meilleure expérience utilisateur
    initialTimeoutId = setTimeout(() => {
      showAd();
    }, 1000);

    return () => {
      if (displayTimeoutId) clearTimeout(displayTimeoutId);
      if (initialTimeoutId) clearTimeout(initialTimeoutId);
    };
  }, [location.pathname]); // Relancer l'effet à chaque changement de route

  const handleClose = () => {
    setIsVisible(false);
    setAd(null);
  };

  if (!isVisible || !ad) return null;

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[9999] p-4">
      <div className="relative bg-gray-800 rounded-lg max-w-2xl w-full">
        <button
          onClick={handleClose}
          className="absolute -top-2 -right-2 bg-gray-700 text-white p-1 rounded-full hover:bg-gray-600 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-6">
          {ad.imageUrl && (
            <img
              src={ad.imageUrl}
              alt={ad.title}
              className="w-full h-auto rounded-lg mb-4"
              loading="eager"
            />
          )}

          <h2 className="text-xl font-bold text-white mb-4">{ad.title}</h2>
          
          <div 
            className="text-gray-300 mb-6 prose prose-invert max-w-none"
            dangerouslySetInnerHTML={{ __html: ad.content }}
          />

          {ad.link && (
            <a
              href={ad.link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              En savoir plus
            </a>
          )}
        </div>
      </div>
    </div>
  );
}