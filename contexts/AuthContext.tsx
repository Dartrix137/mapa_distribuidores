import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { AuthUser, signIn as authSignIn, signOut as authSignOut, getCurrentSession, verifyAdminRole } from '../services/authService';

interface AuthContextType {
    user: AuthUser | null;
    isAdmin: boolean;
    loading: boolean;
    signIn: (email: string, password: string) => Promise<void>;
    signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<AuthUser | null>(null);
    const [loading, setLoading] = useState(true);

    // Al montar, verificar si hay una sesión activa con rol admin
    useEffect(() => {
        const checkSession = async () => {
            try {
                const session = await getCurrentSession();
                if (session?.user) {
                    const adminUser = await verifyAdminRole(session.user.id);
                    if (adminUser) {
                        setUser(adminUser);
                    } else {
                        // Sesión activa pero no es admin para esta app — no setear usuario
                        setUser(null);
                    }
                }
            } catch (error) {
                console.error('Error al verificar sesión:', error);
                setUser(null);
            } finally {
                setLoading(false);
            }
        };

        checkSession();
    }, []);

    const signIn = useCallback(async (email: string, password: string) => {
        const adminUser = await authSignIn(email, password);
        setUser(adminUser);
    }, []);

    const signOut = useCallback(async () => {
        await authSignOut();
        setUser(null);
    }, []);

    const value: AuthContextType = {
        user,
        isAdmin: !!user && user.role === 'admin',
        loading,
        signIn,
        signOut,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

/**
 * Hook para acceder al contexto de autenticación.
 */
export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth debe usarse dentro de un AuthProvider');
    }
    return context;
};
