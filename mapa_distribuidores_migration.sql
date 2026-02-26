-- ==========================================
-- MIGRACIÓN: Tabla mapa_distribuidores
-- (Ejecutar directamente en Supabase SQL Editor)
-- Esta migración NO modifica tablas existentes.
-- ==========================================

-- Crear tabla solo si no existe
CREATE TABLE IF NOT EXISTS mapa_distribuidores (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nombre TEXT NOT NULL,
    telefono TEXT NOT NULL,
    whatsapp TEXT,
    pagina_web TEXT,
    departamento TEXT NOT NULL,
    ciudad TEXT NOT NULL,
    direccion TEXT NOT NULL,
    descripcion TEXT,
    google_maps_url TEXT,
    logo_url TEXT,
    latitud DOUBLE PRECISION NOT NULL,
    longitud DOUBLE PRECISION NOT NULL,
    activo BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Habilitar Row Level Security
ALTER TABLE mapa_distribuidores ENABLE ROW LEVEL SECURITY;

-- Política: Lectura pública de distribuidores activos (incluye usuarios anónimos)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'mapa_distribuidores' 
        AND policyname = 'Lectura pública de mapa distribuidores'
    ) THEN
        CREATE POLICY "Lectura pública de mapa distribuidores"
        ON mapa_distribuidores FOR SELECT
        USING (activo = true);
    END IF;
END
$$;

-- Política: Solo admins pueden insertar, actualizar y eliminar
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'mapa_distribuidores' 
        AND policyname = 'Admins pueden gestionar mapa distribuidores'
    ) THEN
        CREATE POLICY "Admins pueden gestionar mapa distribuidores"
        ON mapa_distribuidores FOR ALL
        USING (
            EXISTS (SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role = 'admin')
        );
    END IF;
END
$$;
