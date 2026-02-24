
import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '@/store';

export function AdminRoute() {
    const { user, isAuthenticated } = useAuthStore();

    // Check if authenticated and is admin
    if (!isAuthenticated || !user || !user.isAdmin) {
        return <Navigate to="/login" replace />;
    }

    return <Outlet />;
}
