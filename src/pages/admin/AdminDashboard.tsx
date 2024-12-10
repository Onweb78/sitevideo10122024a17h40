import { useEffect, useState } from 'react';
import { auth } from '../../config/firebase';
import { useNavigate } from 'react-router-dom';

export function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAdmin = async () => {
      try {
        const user = auth.currentUser;
        if (!user) {
          navigate('/admin');
          return;
        }

        const token = await user.getIdTokenResult();
        if (!token.claims.admin) {
          navigate('/admin');
        }
        setLoading(false);
      } catch (error) {
        navigate('/admin');
      }
    };

    checkAdmin();
  }, [navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8">Administration</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Contenu du tableau de bord admin */}
        </div>
      </div>
    </div>
  );
}