import { useState, useEffect } from 'react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { UserProfile } from '../../types/user';
import { formatDate } from '../../utils/format';
import { Mail, Calendar, Phone, MapPin, UserCog } from 'lucide-react';
import { UserProfileModal } from '../../components/admin/UserProfileModal';

export function AdminAdministrators() {
  const [administrators, setAdministrators] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAdmin, setSelectedAdmin] = useState<UserProfile | null>(null);

  const fetchAdministrators = async () => {
    try {
      const usersCollection = collection(db, 'users');
      const adminQuery = query(usersCollection, where('isAdmin', '==', true));
      const snapshot = await getDocs(adminQuery);
      const adminsData = snapshot.docs.map(doc => ({
        ...(doc.data() as UserProfile),
        uid: doc.id
      }));
      setAdministrators(adminsData);
    } catch (error) {
      console.error('Erreur lors de la récupération des administrateurs:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdministrators();
  }, []);

  const handleEditAdmin = (admin: UserProfile) => {
    setSelectedAdmin(admin);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-white mb-8">Gestion des administrateurs</h1>
      
      <div className="bg-gray-800 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-700">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Administrateur
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Localisation
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Inscription
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {administrators.map((admin) => (
                <tr key={admin.uid} className="hover:bg-gray-700">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-full bg-blue-600 flex items-center justify-center">
                          <span className="text-lg font-medium text-white">
                            {admin.firstName.charAt(0)}{admin.lastName.charAt(0)}
                          </span>
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-white">
                          {admin.firstName} {admin.lastName}
                        </div>
                        <div className="text-sm text-gray-400">
                          @{admin.username}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-col space-y-1">
                      <div className="flex items-center text-sm text-gray-300">
                        <Mail className="w-4 h-4 mr-2" />
                        {admin.email}
                      </div>
                      {admin.phone && (
                        <div className="flex items-center text-sm text-gray-300">
                          <Phone className="w-4 h-4 mr-2" />
                          {admin.phone}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {admin.city && (
                      <div className="flex items-center text-sm text-gray-300">
                        <MapPin className="w-4 h-4 mr-2" />
                        {admin.city}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center text-sm text-gray-300">
                      <Calendar className="w-4 h-4 mr-2" />
                      {formatDate(admin.createdAt instanceof Date ? admin.createdAt.toISOString() : admin.createdAt)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button 
                      onClick={() => handleEditAdmin(admin)}
                      className="text-gray-300 hover:text-blue-500 transition-colors"
                      title="Modifier le profil"
                    >
                      <UserCog className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {selectedAdmin && (
        <UserProfileModal
          user={selectedAdmin}
          onClose={() => setSelectedAdmin(null)}
          onUpdate={fetchAdministrators}
        />
      )}
    </div>
  );
}