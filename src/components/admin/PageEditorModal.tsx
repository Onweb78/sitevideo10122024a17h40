import { useState, useRef, useEffect } from 'react';
import { 
  X, Bold, Italic, Underline, List, ListOrdered, 
  AlignLeft, AlignCenter, AlignRight, Link2, Image,
  Heading1, Heading2, Quote, Code, Undo, Redo,
  Type, Palette
} from 'lucide-react';

interface PageEditorModalProps {
  title: string;
  content: string;
  onClose: () => void;
  onSave: (content: string) => void;
}

export function PageEditorModal({ title, content, onClose, onSave }: PageEditorModalProps) {
  const [editedContent, setEditedContent] = useState(content);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showFontSizeMenu, setShowFontSizeMenu] = useState(false);
  const editorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Initialiser le contenu de l'éditeur
    if (editorRef.current) {
      editorRef.current.innerHTML = content;
    }
  }, [content]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editorRef.current) {
      onSave(editorRef.current.innerHTML);
    }
  };

  const execCommand = (command: string, value: string | null = null) => {
    document.execCommand(command, false, value);
    if (editorRef.current) {
      setEditedContent(editorRef.current.innerHTML);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      execCommand('insertHTML', '&nbsp;&nbsp;&nbsp;&nbsp;');
    }
  };

  const handleInput = () => {
    if (editorRef.current) {
      setEditedContent(editorRef.current.innerHTML);
    }
  };

  const handleLink = () => {
    const url = prompt('Entrez l\'URL du lien:');
    if (url) {
      execCommand('createLink', url);
    }
  };

  const handleImage = () => {
    const url = prompt('Entrez l\'URL de l\'image:');
    if (url) {
      execCommand('insertImage', url);
    }
  };

  const handleFontSize = (size: string) => {
    execCommand('fontSize', size);
    setShowFontSizeMenu(false);
  };

  const handleColor = (color: string) => {
    execCommand('foreColor', color);
    setShowColorPicker(false);
  };

  const colors = [
    '#ffffff', '#ff0000', '#00ff00', '#0000ff',
    '#ffff00', '#ff00ff', '#00ffff', '#ffa500'
  ];

  const fontSizes = [
    { label: 'Petit', value: '1' },
    { label: 'Normal', value: '3' },
    { label: 'Grand', value: '5' },
    { label: 'Très grand', value: '7' }
  ];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-lg w-full max-w-4xl max-h-[90vh] flex flex-col">
        <div className="flex justify-between items-center p-6 border-b border-gray-700">
          <h2 className="text-xl font-semibold text-white">Modifier {title}</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 flex flex-col p-6">
          <div className="bg-gray-700 p-2 rounded-t-lg flex flex-wrap gap-2">
            {/* Historique */}
            <div className="flex gap-1 border-r border-gray-600 pr-2">
              <button
                type="button"
                onClick={() => execCommand('undo')}
                className="p-2 hover:bg-gray-600 rounded"
                title="Annuler"
              >
                <Undo className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => execCommand('redo')}
                className="p-2 hover:bg-gray-600 rounded"
                title="Rétablir"
              >
                <Redo className="w-4 h-4" />
              </button>
            </div>

            {/* Formatage de texte */}
            <div className="flex gap-1 border-r border-gray-600 pr-2">
              <button
                type="button"
                onClick={() => execCommand('bold')}
                className="p-2 hover:bg-gray-600 rounded"
                title="Gras"
              >
                <Bold className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => execCommand('italic')}
                className="p-2 hover:bg-gray-600 rounded"
                title="Italique"
              >
                <Italic className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => execCommand('underline')}
                className="p-2 hover:bg-gray-600 rounded"
                title="Souligné"
              >
                <Underline className="w-4 h-4" />
              </button>
            </div>

            {/* Listes */}
            <div className="flex gap-1 border-r border-gray-600 pr-2">
              <button
                type="button"
                onClick={() => execCommand('insertUnorderedList')}
                className="p-2 hover:bg-gray-600 rounded"
                title="Liste à puces"
              >
                <List className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => execCommand('insertOrderedList')}
                className="p-2 hover:bg-gray-600 rounded"
                title="Liste numérotée"
              >
                <ListOrdered className="w-4 h-4" />
              </button>
            </div>

            {/* Alignement */}
            <div className="flex gap-1 border-r border-gray-600 pr-2">
              <button
                type="button"
                onClick={() => execCommand('justifyLeft')}
                className="p-2 hover:bg-gray-600 rounded"
                title="Aligner à gauche"
              >
                <AlignLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => execCommand('justifyCenter')}
                className="p-2 hover:bg-gray-600 rounded"
                title="Centrer"
              >
                <AlignCenter className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => execCommand('justifyRight')}
                className="p-2 hover:bg-gray-600 rounded"
                title="Aligner à droite"
              >
                <AlignRight className="w-4 h-4" />
              </button>
            </div>

            {/* Titres et styles */}
            <div className="flex gap-1 border-r border-gray-600 pr-2">
              <button
                type="button"
                onClick={() => execCommand('formatBlock', '<h1>')}
                className="p-2 hover:bg-gray-600 rounded"
                title="Titre 1"
              >
                <Heading1 className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => execCommand('formatBlock', '<h2>')}
                className="p-2 hover:bg-gray-600 rounded"
                title="Titre 2"
              >
                <Heading2 className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => execCommand('formatBlock', '<blockquote>')}
                className="p-2 hover:bg-gray-600 rounded"
                title="Citation"
              >
                <Quote className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => execCommand('formatBlock', '<pre>')}
                className="p-2 hover:bg-gray-600 rounded"
                title="Code"
              >
                <Code className="w-4 h-4" />
              </button>
            </div>

            {/* Insertion */}
            <div className="flex gap-1 border-r border-gray-600 pr-2">
              <button
                type="button"
                onClick={handleLink}
                className="p-2 hover:bg-gray-600 rounded"
                title="Insérer un lien"
              >
                <Link2 className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={handleImage}
                className="p-2 hover:bg-gray-600 rounded"
                title="Insérer une image"
              >
                <Image className="w-4 h-4" />
              </button>
            </div>

            {/* Taille de police */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowFontSizeMenu(!showFontSizeMenu)}
                className="p-2 hover:bg-gray-600 rounded"
                title="Taille de police"
              >
                <Type className="w-4 h-4" />
              </button>
              {showFontSizeMenu && (
                <div className="absolute top-full left-0 mt-1 bg-gray-700 rounded-lg shadow-lg z-10">
                  {fontSizes.map((size) => (
                    <button
                      key={size.value}
                      type="button"
                      onClick={() => handleFontSize(size.value)}
                      className="block w-full px-4 py-2 text-left hover:bg-gray-600 text-sm"
                    >
                      {size.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Couleur */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowColorPicker(!showColorPicker)}
                className="p-2 hover:bg-gray-600 rounded"
                title="Couleur du texte"
              >
                <Palette className="w-4 h-4" />
              </button>
              {showColorPicker && (
                <div className="absolute top-full left-0 mt-1 bg-gray-700 p-2 rounded-lg shadow-lg z-10">
                  <div className="grid grid-cols-4 gap-1">
                    {colors.map((color) => (
                      <button
                        key={color}
                        type="button"
                        onClick={() => handleColor(color)}
                        className="w-6 h-6 rounded"
                        style={{ backgroundColor: color }}
                        title={color}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div
            className="flex-1 bg-gray-900 rounded-b-lg p-4 overflow-y-auto"
            style={{ minHeight: '400px' }}
          >
            <div
              ref={editorRef}
              className="prose prose-invert max-w-none min-h-full"
              contentEditable
              onInput={handleInput}
              onKeyDown={handleKeyDown}
              style={{ outline: 'none' }}
              dir="ltr"
            />
          </div>

          <div className="flex justify-end gap-4 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-300 hover:text-white transition-colors"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Enregistrer
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}