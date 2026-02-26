# 🗺️ Mapa de Distribuidores - SolidView

Aplicación web interactiva que muestra la **red de distribuidores autorizados de SolidView** en Colombia. Permite a los usuarios explorar distribuidores en un mapa y a los administradores gestionar la información de la red.

## ✨ Características

### Mapa Público
- **Mapa interactivo** de Colombia con ubicaciones de distribuidores usando Leaflet
- **Filtro por departamentos y ciudades** para encontrar distribuidores cercanos
- Tarjetas con información detallada de cada distribuidor (contacto, dirección, etc.)

### Panel de Administración
- Autenticación segura con Supabase Auth
- **CRUD completo** de distribuidores (crear, editar, eliminar)
- Gestión de ubicaciones con coordenadas geográficas

## 🛠️ Stack Tecnológico

| Tecnología | Uso |
|---|---|
| **React 19** + TypeScript | Frontend SPA |
| **Vite 6** | Build tool y dev server |
| **Leaflet** + React Leaflet | Mapa interactivo |
| **Supabase** | Base de datos, autenticación y API |
| **TailwindCSS** | Estilos |
| **Nginx** | Servidor web en producción |

## 🚀 Instalación Local

### Prerrequisitos

- Node.js >= 18
- Cuenta de [Supabase](https://supabase.com) con las tablas configuradas

### Configuración

1. Clonar el repositorio:
   ```bash
   git clone https://github.com/tu-usuario/mapa-distribuidores.git
   cd mapa-distribuidores
   ```

2. Instalar dependencias:
   ```bash
   npm install
   ```

3. Configurar variables de entorno:
   ```bash
   cp .env.example .env.local
   ```
   Editar `.env.local` con tus credenciales:
   ```
   VITE_SUPABASE_URL=https://tu-url.supabase.co
   VITE_SUPABASE_ANON_KEY=tu-anon-key
   VITE_GEMINI_API_KEY=tu-api-key
   ```

4. Ejecutar en modo desarrollo:
   ```bash
   npm run dev
   ```
   La aplicación estará disponible en `http://localhost:3000`

## 🐳 Despliegue con Docker

### Build local

```bash
docker build \
  --build-arg VITE_SUPABASE_URL=https://tu-url.supabase.co \
  --build-arg VITE_SUPABASE_ANON_KEY=tu-anon-key \
  --build-arg VITE_GEMINI_API_KEY=tu-api-key \
  -t mapa-distribuidores .
```

### Ejecutar

```bash
docker run -p 3000:3000 mapa-distribuidores
```

### Despliegue con Dokploy

1. Crear un nuevo servicio de tipo **Application** en Dokploy
2. Conectar el repositorio de GitHub
3. Configurar:
   - **Build Type**: Dockerfile
   - **Dockerfile Path**: `./Dockerfile`
4. Agregar **Build Arguments** en la configuración del servicio:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   - `VITE_GEMINI_API_KEY`
5. Configurar el dominio/subdominio con HTTPS en la sección **Domains**
6. Hacer deploy

> **Nota:** Las variables `VITE_*` se inyectan en tiempo de build (Vite las reemplaza en el código). Por eso se configuran como **Build Arguments** en Dokploy, no como variables de entorno runtime.

## 📁 Estructura del Proyecto

```
mapa_distribuidores/
├── components/
│   ├── admin/          # Panel de administración
│   │   ├── AdminDashboard.tsx
│   │   ├── AdminView.tsx
│   │   ├── DistributorForm.tsx
│   │   ├── Login.tsx
│   │   └── ProtectedRoute.tsx
│   └── public/         # Vista pública del mapa
│       ├── DistributorCard.tsx
│       ├── DistributorList.tsx
│       ├── FilterPanel.tsx
│       ├── MapComponent.tsx
│       └── PublicView.tsx
├── contexts/
│   └── AuthContext.tsx
├── data/
│   └── colombiaData.ts # Departamentos y ciudades
├── services/
│   ├── authService.ts
│   ├── distributorService.ts
│   ├── geminiService.ts
│   └── supabaseClient.ts
├── Dockerfile
├── nginx.conf
├── index.html
├── App.tsx
└── vite.config.ts
```

## 📄 Licencia

Proyecto privado — © SolidView
