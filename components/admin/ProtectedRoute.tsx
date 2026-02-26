import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

/**
 * Componente de ruta protegida.
 * - Si está cargando → muestra spinner
 * - Si no es admin → redirige a /admin/login
 * - Si es admin → renderiza las rutas hijas (Outlet)
 */
const ProtectedRoute: React.FC = () => {
    const { isAdmin, loading } = useAuth();

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100">
                <div className="text-center">
                    <div className="inline-block w-12 h-12 border-4 border-[#e98d04] border-t-transparent rounded-full animate-spin"></div>
                    <p className="mt-4 text-gray-600 font-medium">Verificando sesión...</p>
                </div>
            </div>
        );
    }

    if (!isAdmin) {
        return <Navigate to="/admin/login" replace />;
    }

    return <Outlet />;
};

export default ProtectedRoute;
