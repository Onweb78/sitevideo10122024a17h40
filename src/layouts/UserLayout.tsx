import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useAdmin } from '../contexts/AdminContext';
import { UserSidebar } from '../components/UserSidebar';

export function UserLayout() {
  const { user } = useAuth();
  const { isAdmin } = useAdmin();

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  if (isAdmin) {
    return <Navigate to="/admin/users" replace />;
  }

  return (
    <div className="flex min-h-screen">
      <UserSidebar />
      <main className="flex-1 p-8">
        <Outlet />
      </main>
    </div>
  );
}