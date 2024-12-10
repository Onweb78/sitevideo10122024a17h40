import { useState, useEffect } from 'react';
import { FileText, Pencil, Settings, Plus } from 'lucide-react';
import { pageService, Page } from '../../services/pageService';
import { formatDate } from '../../utils/format';
import { NewPageModal } from '../../components/admin/NewPageModal';
import { PageEditorModal } from '../../components/admin/PageEditorModal';
import { PageMetadataModal } from '../../components/admin/PageMetadataModal';

export function AdminPages() {
  const [pages, setPages] = useState<Page[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [showNewPageModal, setShowNewPageModal] = useState(false);
  const [selectedPage, setSelectedPage] = useState<Page | null>(null);
  const [selectedPageMetadata, setSelectedPageMetadata] = useState<Page | null>(null);

  useEffect(() => {
    fetchPages();
  }, []);

  const fetchPages = async () => {
    try {
      const fetchedPages = await pageService.getAllPages();
      setPages(fetchedPages);
    } catch (err) {
      console.error('Error getting pages:', err);
      setError('Erreur lors de la récupération des pages');
    }
  };

  const handleCreatePage = async (page: Omit<Page, 'lastModified'>) => {
    try {
      await pageService.createPage(page);
      setShowNewPageModal(false);
      fetchPages();
    } catch (err) {
      setError('Erreur lors de la création de la page');
    }
  };

  const handleUpdateContent = async (pageId: string, content: string) => {
    try {
      await pageService.updatePageContent(pageId, content);
      setSelectedPage(null);
      fetchPages();
    } catch (err) {
      setError('Erreur lors de la mise à jour du contenu');
    }
  };

  const handleUpdateMetadata = async (pageId: string, title: string, path: string, location: string, column: string, isVisible: boolean) => {
    try {
      await pageService.updatePage(pageId, { title, path, location, column, isVisible });
      setSelectedPageMetadata(null);
      fetchPages();
    } catch (err) {
      setError('Erreur lors de la mise à jour des métadonnées');
    }
  };

  const formatLastModified = (lastModified: Date | string | number) => {
    try {
      if (lastModified instanceof Date) {
        return formatDate(lastModified.toISOString());
      }
      // Handle string timestamps from Firestore
      if (typeof lastModified === 'object' && lastModified.hasOwnProperty('seconds')) {
        return formatDate(new Date(lastModified.seconds * 1000).toISOString());
      }
      // Handle regular string dates
      return formatDate(new Date(lastModified).toISOString());
    } catch (err) {
      console.error('Error formatting date:', err);
      return 'Date invalide';
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-white">Gestion des pages</h1>
        <button
          onClick={() => setShowNewPageModal(true)}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Nouvelle page
        </button>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      <div className="bg-gray-800 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-700">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Page
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Chemin
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Emplacement
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Position
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Visibilité
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Dernière modification
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {pages.map((page) => (
                <tr key={page.id} className="hover:bg-gray-700">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <FileText className="w-5 h-5 text-gray-400 mr-3" />
                      <div className="text-sm text-white">{page.title}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-300">{page.path}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-300">
                      {page.location === 'navbar' && 'Barre de navigation'}
                      {page.location === 'footer' && 'Pied de page'}
                      {(!page.location || page.location === 'none') && 'Aucun'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-300">
                      {page.column === 'films' && 'Films'}
                      {page.column === 'series' && 'Séries TV'}
                      {page.column === 'pages' && 'Pages'}
                      {page.column === 'legal' && 'Légal'}
                      {(!page.column || page.column === 'none') && '-'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`text-sm ${page.isVisible ? 'text-green-400' : 'text-red-400'}`}>
                      {page.isVisible ? 'Oui' : 'Non'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-300">
                      {formatLastModified(page.lastModified)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-4">
                      <button
                        onClick={() => setSelectedPage(page)}
                        className="text-gray-400 hover:text-white transition-colors"
                        title="Modifier le contenu"
                      >
                        <Pencil className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => setSelectedPageMetadata(page)}
                        className="text-gray-400 hover:text-white transition-colors"
                        title="Modifier les paramètres"
                      >
                        <Settings className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showNewPageModal && (
        <NewPageModal
          onClose={() => setShowNewPageModal(false)}
          onSave={handleCreatePage}
        />
      )}

      {selectedPage && (
        <PageEditorModal
          title={selectedPage.title}
          content={selectedPage.content}
          onClose={() => setSelectedPage(null)}
          onSave={(content) => handleUpdateContent(selectedPage.id, content)}
        />
      )}

      {selectedPageMetadata && (
        <PageMetadataModal
          page={selectedPageMetadata}
          onClose={() => setSelectedPageMetadata(null)}
          onSave={handleUpdateMetadata}
        />
      )}
    </div>
  );
}