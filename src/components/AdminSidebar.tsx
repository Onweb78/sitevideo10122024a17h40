import { Users, Shield, UserPlus, LogOut, LayoutDashboard, FileText, Mail, MonitorPlay } from 'lucide-react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export function AdminSidebar() {
  const { signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    }
  };

  return (
    <div className="w-64 bg-gray-800 min-h-screen p-4">
      <nav className="space-y-2">
        <NavLink
          to="/admin"
          className={({ isActive }) =>
            `flex items-center space-x-2 p-3 rounded-lg transition-colors ${
              isActive 
                ? 'bg-blue-600 text-white' 
                : 'text-gray-300 hover:bg-gray-700'
            }`
          }
          end
        >
          <LayoutDashboard className="w-5 h-5" />
          <span>Synthèse</span>
        </NavLink>

        <NavLink
          to="/admin/users"
          className={({ isActive }) =>
            `flex items-center space-x-2 p-3 rounded-lg transition-colors ${
              isActive 
                ? 'bg-blue-600 text-white' 
                : 'text-gray-300 hover:bg-gray-700'
            }`
          }
        >
          <Users className="w-5 h-5" />
          <span>Utilisateurs</span>
        </NavLink>

        <NavLink
          to="/admin/administrators"
          className={({ isActive }) =>
            `flex items-center space-x-2 p-3 rounded-lg transition-colors ${
              isActive 
                ? 'bg-blue-600 text-white' 
                : 'text-gray-300 hover:bg-gray-700'
            }`
          }
        >
          <Shield className="w-5 h-5" />
          <span>Administrateurs</span>
        </NavLink>

        <NavLink
          to="/admin/create-user"
          className={({ isActive }) =>
            `flex items-center space-x-2 p-3 rounded-lg transition-colors ${
              isActive 
                ? 'bg-blue-600 text-white' 
                : 'text-gray-300 hover:bg-gray-700'
            }`
          }
        >
          <UserPlus className="w-5 h-5" />
          <span>Création utilisateur</span>
        </NavLink>

        <NavLink
          to="/admin/pages"
          className={({ isActive }) =>
            `flex items-center space-x-2 p-3 rounded-lg transition-colors ${
              isActive 
                ? 'bg-blue-600 text-white' 
                : 'text-gray-300 hover:bg-gray-700'
            }`
          }
        >
          <FileText className="w-5 h-5" />
          <span>Pages</span>
        </NavLink>

        <NavLink
          to="/admin/ads"
          className={({ isActive }) =>
            `flex items-center space-x-2 p-3 rounded-lg transition-colors ${
              isActive 
                ? 'bg-blue-600 text-white' 
                : 'text-gray-300 hover:bg-gray-700'
            }`
          }
        >
          <MonitorPlay className="w-5 h-5" />
          <span>Publicités</span>
        </NavLink>

        <NavLink
          to="/admin/contact/email-config"
          className={({ isActive }) =>
            `flex items-center space-x-2 p-3 rounded-lg transition-colors ${
              isActive 
                ? 'bg-blue-600 text-white' 
                : 'text-gray-300 hover:bg-gray-700'
            }`
          }
        >
          <Mail className="w-5 h-5" />
          <span>Configuration email</span>
        </NavLink>

        <button
          onClick={handleSignOut}
          className="flex items-center space-x-2 p-3 rounded-lg transition-colors text-gray-300 hover:bg-gray-700 w-full"
        >
          <LogOut className="w-5 h-5" />
          <span>Déconnexion</span>
        </button>
      </nav>
    </div>
  );
}