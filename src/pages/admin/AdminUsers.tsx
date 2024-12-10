import { useState, useEffect } from 'react';
import { collection, getDocs, query, where, orderBy } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { UserProfile } from '../../types/user';
import { formatDate } from '../../utils/format';
import { Mail, Calendar, Phone, MapPin, AlertCircle, Eye, EyeOff, X, User } from 'lucide-react';
import { UserProfileModal } from '../../components/admin/UserProfileModal';

export function AdminUsers() {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);
  
  // Filter states
  const [emailFilter, setEmailFilter] = useState('');
  const [nameFilter, setNameFilter] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [genderFilter, setGenderFilter] = useState<'all' | 'male' | 'female'>('all');
  const [genreFilter, setGenreFilter] = useState<string>('all');

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const itemsPerPageOptions = [5, 10, 25, 50];

  const fetchUsers = async () => {
    try {
      setLoading(true);
      // First get all users
      const usersCollection = collection(db, 'users');
      const q = query(usersCollection, orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      
      // Then filter out admins in memory
      const usersData = snapshot.docs
        .map(doc => ({
          ...(doc.data() as UserProfile),
          uid: doc.id
        }))
        .filter(user => !user.isAdmin);

      setUsers(usersData);
    } catch (error) {
      console.error('Erreur lors de la récupération des utilisateurs:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleEditUser = (user: UserProfile) => {
    setSelectedUser(user);
  };

  // Format the date properly
  const formatCreatedAt = (date: Date | any) => {
    try {
      // Handle Firestore Timestamp
      if (date && typeof date === 'object' && 'seconds' in date) {
        return formatDate(new Date(date.seconds * 1000).toISOString());
      }
      // Handle regular Date object
      if (date instanceof Date) {
        return formatDate(date.toISOString());
      }
      // Handle string date
      if (date) {
        return formatDate(new Date(date).toISOString());
      }
      return 'Date invalide';
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Date invalide';
    }
  };

  // Filter users based on search criteria
  const filteredUsers = users.filter(user => {
    const matchEmail = user.email.toLowerCase().includes(emailFilter.toLowerCase());
    const matchName = (user.firstName + ' ' + user.lastName + ' ' + user.username)
      .toLowerCase()
      .includes(nameFilter.toLowerCase());
    const matchLocation = user.city?.toLowerCase().includes(locationFilter.toLowerCase()) ?? true;
    const matchGender = genderFilter === 'all' || user.gender === genderFilter;
    const matchGenre = genreFilter === 'all' || user.favoriteGenres?.includes(genreFilter);

    return matchEmail && matchName && matchLocation && matchGender && matchGenre;
  });

  // Calculate pagination
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentUsers = filteredUsers.slice(startIndex, endIndex);

  const clearAllFilters = () => {
    setEmailFilter('');
    setNameFilter('');
    setLocationFilter('');
    setGenderFilter('all');
    setGenreFilter('all');
    setCurrentPage(1);
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
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-white">
          Gestion des utilisateurs ({users.length})
          {filteredUsers.length !== users.length && (
            <span className="text-gray-400 text-lg ml-2">
              ({filteredUsers.length} résultat{filteredUsers.length !== 1 ? 's' : ''})
            </span>
          )}
        </h1>
        {(emailFilter || nameFilter || locationFilter || genderFilter !== 'all' || genreFilter !== 'all') && (
          <button
            onClick={clearAllFilters}
            className="flex items-center gap-2 px-3 py-1 bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500/20"
          >
            <X className="w-4 h-4" />
            Effacer les filtres
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
        <div className="relative">
          <label className="block text-gray-400 text-sm mb-1">Email</label>
          <div className="relative">
            <input
              type="text"
              value={emailFilter}
              onChange={(e) => setEmailFilter(e.target.value)}
              placeholder="Rechercher par email..."
              className="w-full bg-gray-700 text-white pl-10 pr-8 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <Mail className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
            {emailFilter && (
              <button
                onClick={() => setEmailFilter('')}
                className="absolute right-2 top-2.5 text-red-400 hover:text-red-300"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>

        <div className="relative">
          <label className="block text-gray-400 text-sm mb-1">Nom/Pseudo</label>
          <div className="relative">
            <input
              type="text"
              value={nameFilter}
              onChange={(e) => setNameFilter(e.target.value)}
              placeholder="Rechercher par nom..."
              className="w-full bg-gray-700 text-white pl-10 pr-8 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <User className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
            {nameFilter && (
              <button
                onClick={() => setNameFilter('')}
                className="absolute right-2 top-2.5 text-red-400 hover:text-red-300"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>

        <div className="relative">
          <label className="block text-gray-400 text-sm mb-1">Ville</label>
          <div className="relative">
            <input
              type="text"
              value={locationFilter}
              onChange={(e) => setLocationFilter(e.target.value)}
              placeholder="Rechercher par ville..."
              className="w-full bg-gray-700 text-white pl-10 pr-8 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <MapPin className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
            {locationFilter && (
              <button
                onClick={() => setLocationFilter('')}
                className="absolute right-2 top-2.5 text-red-400 hover:text-red-300"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>

        <div>
          <label className="block text-gray-400 text-sm mb-1">Sexe</label>
          <select
            value={genderFilter}
            onChange={(e) => setGenderFilter(e.target.value as 'all' | 'male' | 'female')}
            className="w-full bg-gray-700 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">Tous</option>
            <option value="male">Homme</option>
            <option value="female">Femme</option>
          </select>
        </div>

        <div>
          <label className="block text-gray-400 text-sm mb-1">Genre préféré</label>
          <select
            value={genreFilter}
            onChange={(e) => setGenreFilter(e.target.value)}
            className="w-full bg-gray-700 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">Tous les genres</option>
            <option value="Action">Action</option>
            <option value="Aventure">Aventure</option>
            <option value="Animation">Animation</option>
            <option value="Comédie">Comédie</option>
            <option value="Crime">Crime</option>
            <option value="Documentaire">Documentaire</option>
            <option value="Drame">Drame</option>
            <option value="Familial">Familial</option>
            <option value="Fantastique">Fantastique</option>
            <option value="Histoire">Histoire</option>
            <option value="Horreur">Horreur</option>
            <option value="Musique">Musique</option>
            <option value="Mystère">Mystère</option>
            <option value="Romance">Romance</option>
            <option value="Science-Fiction">Science-Fiction</option>
            <option value="Téléfilm">Téléfilm</option>
            <option value="Thriller">Thriller</option>
            <option value="Guerre">Guerre</option>
            <option value="Western">Western</option>
          </select>
        </div>
      </div>

      <div className="bg-gray-800 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-700">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Utilisateur
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Localisation
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Sexe
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Genres préférés
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Inscription
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Statut
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {currentUsers.map((user) => (
                <tr key={user.uid} className="hover:bg-gray-700">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-full bg-gray-600 flex items-center justify-center">
                          <span className="text-lg font-medium text-white">
                            {user.firstName.charAt(0)}{user.lastName.charAt(0)}
                          </span>
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-white">
                          {user.firstName} {user.lastName}
                        </div>
                        <div className="text-sm text-gray-400">
                          @{user.username}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-col space-y-1">
                      <div className="flex items-center text-sm text-gray-300">
                        <Mail className="w-4 h-4 mr-2" />
                        {user.email}
                      </div>
                      {user.phone && (
                        <div className="flex items-center text-sm text-gray-300">
                          <Phone className="w-4 h-4 mr-2" />
                          {user.phone}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {user.city && (
                      <div className="flex items-center text-sm text-gray-300">
                        <MapPin className="w-4 h-4 mr-2" />
                        {user.city}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                      user.gender === 'male' 
                        ? 'bg-blue-500/10 text-blue-400'
                        : 'bg-pink-500/10 text-pink-400'
                    }`}>
                      {user.gender === 'male' ? 'Homme' : 'Femme'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1">
                      {user.favoriteGenres?.slice(0, 3).map((genre, index) => (
                        <span 
                          key={index}
                          className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-700 text-gray-300"
                        >
                          {genre}
                        </span>
                      ))}
                      {user.favoriteGenres && user.favoriteGenres.length > 3 && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-700 text-gray-300">
                          +{user.favoriteGenres.length - 3}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center text-sm text-gray-300">
                      <Calendar className="w-4 h-4 mr-2" />
                      {formatCreatedAt(user.createdAt)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-3 py-1 text-sm rounded-full ${
                      user.isActive !== false
                        ? 'bg-green-500/10 text-green-400'
                        : 'bg-red-500/10 text-red-400'
                    }`}>
                      {user.isActive !== false ? 'Actif' : 'Suspendu'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button 
                      onClick={() => handleEditUser(user)}
                      className="text-gray-300 hover:text-blue-500 transition-colors"
                      title="Modifier le profil"
                    >
                      <User className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      <div className="mt-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-400">
            Afficher
          </span>
          <select
            value={itemsPerPage}
            onChange={(e) => {
              setItemsPerPage(Number(e.target.value));
              setCurrentPage(1);
            }}
            className="bg-gray-700 text-white px-3 py-1 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {itemsPerPageOptions.map(option => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
          <span className="text-sm text-gray-400">
            utilisateurs par page
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 bg-gray-700 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-600"
          >
            Précédent
          </button>
          
          <span className="text-sm text-gray-400">
            Page {currentPage} sur {totalPages}
          </span>
          
          <button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="px-3 py-1 bg-gray-700 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-600"
          >
            Suivant
          </button>
        </div>
      </div>

      {selectedUser && (
        <UserProfileModal
          user={selectedUser}
          onClose={() => setSelectedUser(null)}
          onUpdate={fetchUsers}
        />
      )}
    </div>
  );
}