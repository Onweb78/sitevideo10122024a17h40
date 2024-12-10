import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { pageService } from '../services/pageService';

export function DynamicPage() {
  const { pageId } = useParams();
  const navigate = useNavigate();
  const [content, setContent] = useState('');
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        // Récupérer toutes les pages
        const pages = await pageService.getAllPages();
        
        // Trouver la page qui correspond au chemin actuel
        const currentPage = pages.find(page => {
          const pathWithoutSlash = page.path.replace(/^\//, '');
          return pathWithoutSlash === pageId;
        });

        if (currentPage) {
          setContent(currentPage.content);
          setTitle(currentPage.title);
        } else {
          // Rediriger vers la page d'accueil si la page n'existe pas
          navigate('/');
        }
      } catch (error) {
        console.error('Error fetching page content:', error);
        navigate('/');
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, [pageId, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-white mb-8">{title}</h1>
        <div 
          className="prose prose-invert max-w-none"
          dangerouslySetInnerHTML={{ __html: content }}
        />
      </div>
    </div>
  );
}