import { supabase } from './supabaseClient';
import type { Session, User, AuthChangeEvent } from '@supabase/supabase-js';

export interface AuthUser {
    id: string;
    email: string;
    nombre: string;
    role: string;
}

/**
 * Inicia sesión con email y contraseña usando Supabase Auth.
 * Después verifica que el usuario tenga rol 'admin' en la tabla 'users'.
 * Si no es admin, cierra la sesión y lanza un error.
 */
export const signIn = async (email: string, password: string): Promise<AuthUser> => {
    // 1. Autenticar con Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
    });

    if (authError) {
        throw new Error('Credenciales inválidas. Verifica tu email y contraseña.');
    }

    if (!authData.user) {
        throw new Error('No se pudo obtener la información del usuario.');
    }

    // 2. Verificar rol admin en la tabla 'users'
    const { data: userData, error: userError } = await supabase
        .from('users')
        .select('id, email, nombre, role')
        .eq('id', authData.user.id)
        .single();

    if (userError || !userData) {
        await supabase.auth.signOut();
        throw new Error('No se encontró el usuario en el sistema. Contacta al administrador.');
    }

    if (userData.role !== 'admin') {
        await supabase.auth.signOut();
        throw new Error('Acceso denegado. Solo los administradores pueden acceder a este panel.');
    }

    return {
        id: userData.id,
        email: userData.email,
        nombre: userData.nombre,
        role: userData.role,
    };
};

/**
 * Cierra la sesión actual.
 */
export const signOut = async (): Promise<void> => {
    const { error } = await supabase.auth.signOut();
    if (error) {
        throw new Error('Error al cerrar sesión.');
    }
};

/**
 * Obtiene la sesión actual del usuario.
 */
export const getCurrentSession = async (): Promise<Session | null> => {
    const { data: { session } } = await supabase.auth.getSession();
    return session;
};

/**
 * Verifica si el usuario actual tiene rol admin.
 * Retorna los datos del usuario admin o null.
 */
export const verifyAdminRole = async (userId: string): Promise<AuthUser | null> => {
    const { data, error } = await supabase
        .from('users')
        .select('id, email, nombre, role')
        .eq('id', userId)
        .eq('role', 'admin')
        .single();

    if (error || !data) {
        return null;
    }

    return {
        id: data.id,
        email: data.email,
        nombre: data.nombre,
        role: data.role,
    };
};

/**
 * Listener para cambios de estado de autenticación.
 */
export const onAuthStateChange = (
    callback: (event: AuthChangeEvent, session: Session | null) => void
) => {
    return supabase.auth.onAuthStateChange(callback);
};
