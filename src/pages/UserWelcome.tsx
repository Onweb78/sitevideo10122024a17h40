import { useAuth } from '../contexts/AuthContext';

export function UserWelcome() {
  const { user } = useAuth();

  return (
    <div>
      <h1 className="text-3xl font-bold text-white mb-8">
        Bienvenue {user?.username}
      </h1>
      
      <div className="bg-gray-800 rounded-lg p-6">
        <p className="text-gray-300">
          Profitez de notre catalogue de films et séries. Utilisez le menu de gauche pour accéder à votre profil et vos favoris.
        </p>
      </div>
    </div>
  );
}