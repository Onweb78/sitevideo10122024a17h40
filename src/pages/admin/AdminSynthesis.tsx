import { useAuth } from '../../contexts/AuthContext';

export function AdminSynthesis() {
  const { user } = useAuth();

  return (
    <div>
      <h1 className="text-3xl font-bold text-white mb-8">
        Bienvenue {user?.username}
      </h1>
      
      <div className="bg-gray-800 rounded-lg p-6">
        <p className="text-gray-300">
          Vous êtes connecté en tant qu'administrateur. Utilisez le menu de gauche pour gérer les utilisateurs et les administrateurs.
        </p>
      </div>
    </div>
  );
}