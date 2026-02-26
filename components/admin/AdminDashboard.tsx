
import React, { useState, useEffect, useCallback } from 'react';
import { Distributor } from '../../types';
import DistributorForm from './DistributorForm';
import { geocodeAddress } from '../../services/geminiService';
import {
  fetchAllDistributors,
  createDistributor,
  updateDistributor,
  deleteDistributor,
} from '../../services/distributorService';

const AdminDashboard: React.FC = () => {
  const [distributors, setDistributors] = useState<Distributor[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingDistributor, setEditingDistributor] = useState<Distributor | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadDistributors = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await fetchAllDistributors();
      setDistributors(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar distribuidores.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDistributors();
  }, [loadDistributors]);

  const handleOpenForm = (distributor: Distributor | null = null) => {
    setEditingDistributor(distributor);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingDistributor(null);
  };

  const handleSave = async (
    distributorData: Omit<Distributor, 'id' | 'latitude' | 'longitude'>,
    id: string | null
  ) => {
    // Geocodificar la dirección
    const { latitude, longitude } = await geocodeAddress(distributorData);

    if (id) {
      // Actualizar existente
      await updateDistributor(id, { ...distributorData, latitude, longitude });
    } else {
      // Crear nuevo
      await createDistributor({ ...distributorData, latitude, longitude });
    }

    // Recargar la lista
    await loadDistributors();
    handleCloseForm();
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('¿Está seguro de que desea eliminar este distribuidor?')) {
      try {
        await deleteDistributor(id);
        await loadDistributors();
      } catch (err) {
        alert(err instanceof Error ? err.message : 'Error al eliminar.');
      }
    }
  };

  if (isLoading && distributors.length === 0) {
    return (
      <div className="bg-white p-12 rounded-lg shadow-md text-center">
        <div className="inline-block w-10 h-10 border-4 border-[#e98d04] border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-gray-600">Cargando distribuidores...</p>
      </div>
    );
  }

  if (error && distributors.length === 0) {
    return (
      <div className="bg-white p-8 rounded-lg shadow-md text-center">
        <p className="text-red-600 font-medium mb-4">{error}</p>
        <button
          onClick={loadDistributors}
          className="px-4 py-2 bg-[#e98d04] text-white rounded-md hover:bg-[#c27503] transition-colors"
        >
          Reintentar
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">Gestionar Distribuidores</h2>
        <button
          onClick={() => handleOpenForm()}
          className="px-4 py-2 bg-[#e98d04] text-white font-semibold rounded-lg hover:bg-[#c27503] transition-colors shadow-md"
        >
          + Crear Nuevo
        </button>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {isFormOpen && (
        <DistributorForm
          distributor={editingDistributor}
          onSave={handleSave}
          onClose={handleCloseForm}
        />
      )}

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ciudad</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dirección</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {distributors.map(d => (
              <tr key={d.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{d.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{d.city}, {d.department}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{d.address}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-4">
                  <button onClick={() => handleOpenForm(d)} className="text-[#e98d04] hover:text-[#c27503] font-semibold">Editar</button>
                  <button onClick={() => handleDelete(d.id)} className="text-red-600 hover:text-red-900 font-semibold">Eliminar</button>
                </td>
              </tr>
            ))}
            {distributors.length === 0 && (
              <tr>
                <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                  No hay distribuidores registrados. Haz clic en "Crear Nuevo" para agregar uno.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminDashboard;
