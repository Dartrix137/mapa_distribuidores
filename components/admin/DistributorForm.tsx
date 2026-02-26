
import React, { useState, useEffect, useMemo } from 'react';
import { Distributor } from '../../types';
import { colombiaData } from '../../data/colombiaData';

interface DistributorFormProps {
  distributor: Distributor | null;
  onSave: (distributorData: Omit<Distributor, 'id' | 'latitude' | 'longitude'>, id: string | null) => Promise<void>;
  onClose: () => void;
}

const DistributorForm: React.FC<DistributorFormProps> = ({ distributor, onSave, onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    logoUrl: '',
    department: '',
    city: '',
    address: '',
    phone: '',
    whatsappPhone: '',
    description: '',
    googleMapsUrl: '',
    websiteUrl: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (distributor) {
      setFormData({
        name: distributor.name,
        logoUrl: distributor.logoUrl,
        department: distributor.department,
        city: distributor.city,
        address: distributor.address,
        phone: distributor.phone,
        whatsappPhone: distributor.whatsappPhone || '',
        description: distributor.description || '',
        googleMapsUrl: distributor.googleMapsUrl || '',
        websiteUrl: distributor.websiteUrl || '',
      });
    }
  }, [distributor]);

  const availableCities = useMemo(() => {
    const dept = colombiaData.find(d => d.departamento === formData.department);
    return dept ? dept.ciudades : colombiaData.flatMap(d => d.ciudades);
  }, [formData.department]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      await onSave(formData, distributor ? distributor.id : null);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Ocurrió un error desconocido.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const inputClasses = "p-2 border border-gray-300 rounded-md w-full bg-white text-gray-900 focus:ring-2 focus:ring-[#e98d04] outline-none placeholder-gray-400 transition-all";

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-2xl overflow-y-auto max-h-[90vh]">
        <h2 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-2">{distributor ? 'Editar' : 'Crear'} Distribuidor</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Nombre del distribuidor" required className={inputClasses} />
            <input type="text" name="phone" value={formData.phone} onChange={handleChange} placeholder="Teléfono Público" required className={inputClasses} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-3 bg-green-50 rounded-md border border-green-100">
              <label className="block text-xs font-bold text-green-700 mb-1 uppercase tracking-tight">Botón de WhatsApp</label>
              <input
                type="text"
                name="whatsappPhone"
                value={formData.whatsappPhone}
                onChange={handleChange}
                placeholder="Número (ej: 3101234567)"
                className={inputClasses + " border-green-200 focus:ring-green-500"}
              />
            </div>
            <div className="p-3 bg-blue-50 rounded-md border border-blue-100">
              <label className="block text-xs font-bold text-blue-700 mb-1 uppercase tracking-tight">Página Web</label>
              <input
                type="url"
                name="websiteUrl"
                value={formData.websiteUrl}
                onChange={handleChange}
                placeholder="https://ejemplo.com"
                className={inputClasses + " border-blue-200 focus:ring-blue-500"}
              />
            </div>
          </div>

          <div>
            <input type="text" name="department" list="departamentos-list" value={formData.department} onChange={handleChange} placeholder="Departamento" required className={inputClasses} autoComplete="off" />
            <datalist id="departamentos-list">
              {colombiaData.map(d => <option key={d.id} value={d.departamento} />)}
            </datalist>
          </div>

          <div>
            <input type="text" name="city" list="ciudades-list" value={formData.city} onChange={handleChange} placeholder="Ciudad" required className={inputClasses} autoComplete="off" />
            <datalist id="ciudades-list">
              {availableCities.map((city, index) => <option key={`${city}-${index}`} value={city} />)}
            </datalist>
          </div>

          <input type="text" name="address" value={formData.address} onChange={handleChange} placeholder="Dirección completa" required className={inputClasses} />
          <textarea name="description" value={formData.description} onChange={handleChange} placeholder="Descripción corta (ej: Especialistas en...)" required className={inputClasses} rows={2}></textarea>
          <input type="url" name="googleMapsUrl" value={formData.googleMapsUrl} onChange={handleChange} placeholder="Link directo de Google Maps (opcional)" className={inputClasses} />
          <input type="url" name="logoUrl" value={formData.logoUrl} onChange={handleChange} placeholder="URL del logo" required className={inputClasses} />

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <div className="flex justify-end space-x-4 pt-4">
            <button type="button" onClick={onClose} disabled={isLoading} className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors disabled:opacity-50">Cancelar</button>
            <button type="submit" disabled={isLoading} className="px-4 py-2 bg-[#e98d04] text-white rounded-md hover:bg-[#c27503] transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-semibold shadow-md">
              {isLoading ? 'Guardando...' : 'Guardar Cambios'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DistributorForm;
