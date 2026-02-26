
import React, { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Distributor } from '../../types';
import MapComponent from './MapComponent';
import DistributorList from './DistributorList';
import FilterPanel from './FilterPanel';
import { fetchDistributors } from '../../services/distributorService';

const PublicView: React.FC = () => {
  const [distributors, setDistributors] = useState<Distributor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState({ department: '', city: '' });
  const [hoveredDistributorId, setHoveredDistributorId] = useState<string | null>(null);

  useEffect(() => {
    const loadDistributors = async () => {
      try {
        setIsLoading(true);
        const data = await fetchDistributors();
        setDistributors(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error al cargar distribuidores.');
      } finally {
        setIsLoading(false);
      }
    };

    loadDistributors();
  }, []);

  const filteredDistributors = useMemo(() => {
    return distributors.filter(d =>
      d.department.toLowerCase().includes(filters.department.toLowerCase()) &&
      d.city.toLowerCase().includes(filters.city.toLowerCase())
    );
  }, [distributors, filters]);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      <header className="bg-white shadow-md border-b-4 border-[#e98d04]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-2 md:py-3 flex justify-between items-center">
          <a href="https://solidview.com.co/" target="_blank" rel="noopener noreferrer" className="flex flex-col items-start hover:opacity-90 transition-opacity">
            <div className="h-14 md:h-20 flex items-center">
              <img
                src="https://solidview.com.co/wp-content/uploads/2025/03/Recurso-27-1.webp"
                alt="SolidView Logo"
                className="h-full w-auto object-contain"
              />
            </div>
          </a>
          <Link to="/admin/login" title="Acceso Admin" className="text-gray-400 hover:text-[#e98d04] transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0012 11z" clipRule="evenodd" />
            </svg>
          </Link>
        </div>
      </header>
      <main className="container mx-auto p-4 sm:p-6 lg:p-8">
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="inline-block w-12 h-12 border-4 border-[#e98d04] border-t-transparent rounded-full animate-spin"></div>
              <p className="mt-4 text-gray-600 font-medium">Cargando distribuidores...</p>
            </div>
          </div>
        ) : error ? (
          <div className="text-center py-20">
            <p className="text-red-600 font-medium mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-[#e98d04] text-white rounded-md hover:bg-[#c27503] transition-colors"
            >
              Reintentar
            </button>
          </div>
        ) : (
          <>
            <div className="flex flex-col lg:flex-row gap-8">
              <div className="flex-grow lg:w-2/3">
                <div className="h-[400px] md:h-[600px] w-full rounded-lg shadow-lg overflow-hidden border-2 border-[#fce9cf]">
                  <MapComponent
                    distributors={filteredDistributors}
                    hoveredDistributorId={hoveredDistributorId}
                    onMarkerHover={setHoveredDistributorId}
                  />
                </div>
              </div>
              <div className="lg:w-1/3">
                <FilterPanel onFilterChange={setFilters} distributors={distributors} />
              </div>
            </div>
            <div className="mt-12">
              <h2 className="text-2xl font-semibold mb-6 text-gray-700">Listado de Distribuidores</h2>
              <DistributorList
                distributors={filteredDistributors}
                hoveredDistributorId={hoveredDistributorId}
                onCardHover={setHoveredDistributorId}
              />
            </div>
          </>
        )}
      </main>
      <footer className="bg-white mt-12 py-4 text-center text-sm text-gray-500 border-t">
        © {new Date().getFullYear()} Red de Distribuidores de Colombia. Todos los derechos reservados.
      </footer>
    </div>
  );
};

export default PublicView;
