import { useAuth } from '../contexts/AuthContext';
import { LayoutDashboard } from 'lucide-react';

export function Dashboard() {
  const { user } = useAuth();

  if (!user) {
    return null;
  }

  return (
    <div className="p-8">
      <div className="flex items-center gap-3 mb-8">
        <LayoutDashboard className="w-8 h-8 text-blue-500" />
        <h1 className="text-3xl font-bold text-white">
          Bonjour {user.username}
        </h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-gray-800 p-6 rounded-xl">
          <h2 className="text-xl font-semibold text-white mb-4">Mon profil</h2>
          <div className="space-y-2 text-gray-300">
            <p>Nom complet : {user.firstName} {user.lastName}</p>
            <p>Email : {user.email}</p>
            <p>Date de naissance : {user.birthDate}</p>
          </div>
        </div>
      </div>
    </div>
  );
}