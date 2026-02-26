import { supabase } from './supabaseClient';
import { Distributor } from '../types';

/**
 * Mapea una fila de la tabla mapa_distribuidores al tipo Distributor del frontend.
 */
const mapRowToDistributor = (row: any): Distributor => ({
    id: row.id,
    name: row.nombre,
    phone: row.telefono,
    whatsappPhone: row.whatsapp || '',
    websiteUrl: row.pagina_web || '',
    department: row.departamento,
    city: row.ciudad,
    address: row.direccion,
    description: row.descripcion || '',
    googleMapsUrl: row.google_maps_url || '',
    logoUrl: row.logo_url || '',
    latitude: row.latitud,
    longitude: row.longitud,
    activo: row.activo,
});

/**
 * Mapea los datos del frontend al formato de la tabla de Supabase.
 */
const mapDistributorToRow = (
    data: Omit<Distributor, 'id'> & { id?: string }
) => ({
    nombre: data.name,
    telefono: data.phone,
    whatsapp: data.whatsappPhone || null,
    pagina_web: data.websiteUrl || null,
    departamento: data.department,
    ciudad: data.city,
    direccion: data.address,
    descripcion: data.description || null,
    google_maps_url: data.googleMapsUrl || null,
    logo_url: data.logoUrl || null,
    latitud: data.latitude,
    longitud: data.longitude,
    activo: data.activo ?? true,
    updated_at: new Date().toISOString(),
});

/**
 * Obtiene los distribuidores activos (para la vista pública).
 */
export const fetchDistributors = async (): Promise<Distributor[]> => {
    const { data, error } = await supabase
        .from('mapa_distribuidores')
        .select('*')
        .eq('activo', true)
        .order('nombre', { ascending: true });

    if (error) {
        console.error('Error al cargar distribuidores:', error);
        throw new Error('No se pudieron cargar los distribuidores.');
    }

    return (data || []).map(mapRowToDistributor);
};

/**
 * Obtiene TODOS los distribuidores (para el panel admin).
 */
export const fetchAllDistributors = async (): Promise<Distributor[]> => {
    const { data, error } = await supabase
        .from('mapa_distribuidores')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error al cargar distribuidores (admin):', error);
        throw new Error('No se pudieron cargar los distribuidores.');
    }

    return (data || []).map(mapRowToDistributor);
};

/**
 * Crea un nuevo distribuidor.
 */
export const createDistributor = async (
    data: Omit<Distributor, 'id'>
): Promise<Distributor> => {
    const row = mapDistributorToRow(data);

    const { data: inserted, error } = await supabase
        .from('mapa_distribuidores')
        .insert(row)
        .select()
        .single();

    if (error) {
        console.error('Error al crear distribuidor:', error);
        throw new Error('No se pudo crear el distribuidor. Verifica los datos e intenta de nuevo.');
    }

    return mapRowToDistributor(inserted);
};

/**
 * Actualiza un distribuidor existente.
 */
export const updateDistributor = async (
    id: string,
    data: Partial<Omit<Distributor, 'id'>>
): Promise<Distributor> => {
    const row = mapDistributorToRow(data as Omit<Distributor, 'id'>);

    const { data: updated, error } = await supabase
        .from('mapa_distribuidores')
        .update(row)
        .eq('id', id)
        .select()
        .single();

    if (error) {
        console.error('Error al actualizar distribuidor:', error);
        throw new Error('No se pudo actualizar el distribuidor.');
    }

    return mapRowToDistributor(updated);
};

/**
 * Elimina un distribuidor (eliminación real de la base de datos).
 */
export const deleteDistributor = async (id: string): Promise<void> => {
    const { error } = await supabase
        .from('mapa_distribuidores')
        .delete()
        .eq('id', id);

    if (error) {
        console.error('Error al eliminar distribuidor:', error);
        throw new Error('No se pudo eliminar el distribuidor.');
    }
};
