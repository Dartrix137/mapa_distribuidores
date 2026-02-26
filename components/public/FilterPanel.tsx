
import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Distributor } from '../../types';

interface FilterPanelProps {
  onFilterChange: React.Dispatch<React.SetStateAction<{ department: string; city: string }>>;
  distributors: Distributor[];
}

const FilterPanel: React.FC<FilterPanelProps> = ({ onFilterChange, distributors }) => {
  const [deptInput, setDeptInput] = useState('');
  const [cityInput, setCityInput] = useState('');
  const [showCitySuggestions, setShowCitySuggestions] = useState(false);
  const [showDeptSuggestions, setShowDeptSuggestions] = useState(false);
  
  const cityRef = useRef<HTMLDivElement>(null);
  const deptRef = useRef<HTMLDivElement>(null);

  const uniqueDepartments = useMemo(() => {
    return Array.from(new Set(distributors.map(d => d.department))).sort();
  }, [distributors]);

  const uniqueCities = useMemo(() => {
    return Array.from(new Set(distributors.map(d => d.city))).sort();
  }, [distributors]);

  const filteredCities = useMemo(() => {
    if (!cityInput) return uniqueCities;
    return uniqueCities.filter(city => 
      city.toLowerCase().startsWith(cityInput.toLowerCase())
    );
  }, [cityInput, uniqueCities]);

  const filteredDepts = useMemo(() => {
    if (!deptInput) return uniqueDepartments;
    return uniqueDepartments.filter(dept => 
      dept.toLowerCase().startsWith(deptInput.toLowerCase())
    );
  }, [deptInput, uniqueDepartments]);

  // Handle clicks outside of dropdowns
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (cityRef.current && !cityRef.current.contains(event.target as Node)) {
        setShowCitySuggestions(false);
      }
      if (deptRef.current && !deptRef.current.contains(event.target as Node)) {
        setShowDeptSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleDeptChange = (val: string) => {
    setDeptInput(val);
    onFilterChange(prev => ({ ...prev, department: val }));
  };

  const handleCityChange = (val: string) => {
    setCityInput(val);
    onFilterChange(prev => ({ ...prev, city: val }));
  };

  const selectSuggestion = (type: 'dept' | 'city', value: string) => {
    if (type === 'dept') {
      handleDeptChange(value);
      setShowDeptSuggestions(false);
    } else {
      handleCityChange(value);
      setShowCitySuggestions(false);
    }
  };

  const inputClasses = "w-full px-4 py-2 bg-white text-gray-900 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#e98d04] focus:border-transparent transition-all placeholder-gray-400";
  const dropdownClasses = "absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-xl max-h-48 overflow-y-auto";
  const itemClasses = "px-4 py-2 hover:bg-[#fff8ed] hover:text-[#e98d04] cursor-pointer transition-colors border-b last:border-0 border-gray-50 text-sm";

  return (
    <div className="bg-white p-6 rounded-lg shadow-md sticky top-8 border border-gray-100">
      <h3 className="text-xl font-semibold mb-4 text-gray-800 border-b pb-2">Filtrar Búsqueda</h3>
      <div className="space-y-6">
        {/* Department Filter */}
        <div className="relative" ref={deptRef}>
          <label htmlFor="department" className="block text-sm font-medium text-gray-700 mb-1">
            Departamento
          </label>
          <input
            type="text"
            name="department"
            id="department"
            autoComplete="off"
            value={deptInput}
            onFocus={() => setShowDeptSuggestions(true)}
            onChange={(e) => handleDeptChange(e.target.value)}
            className={inputClasses}
            placeholder="Ej: Cundinamarca"
          />
          {showDeptSuggestions && filteredDepts.length > 0 && (
            <div className={dropdownClasses}>
              {filteredDepts.map(dept => (
                <div 
                  key={dept} 
                  className={itemClasses}
                  onClick={() => selectSuggestion('dept', dept)}
                >
                  {dept}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* City Filter */}
        <div className="relative" ref={cityRef}>
          <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
            Ciudad
          </label>
          <input
            type="text"
            name="city"
            id="city"
            autoComplete="off"
            value={cityInput}
            onFocus={() => setShowCitySuggestions(true)}
            onChange={(e) => handleCityChange(e.target.value)}
            className={inputClasses}
            placeholder="Ej: Bogotá"
          />
          {showCitySuggestions && filteredCities.length > 0 && (
            <div className={dropdownClasses}>
              {filteredCities.map(city => (
                <div 
                  key={city} 
                  className={itemClasses}
                  onClick={() => selectSuggestion('city', city)}
                >
                  {city}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="mt-6 p-3 bg-[#fff8ed] rounded-md border border-[#fce9cf]">
        <div className="flex items-start">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-[#e98d04] mr-2 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-xs text-[#c27503] leading-snug">
            Los resultados se filtran automáticamente mientras escribes. Selecciona una opción del listado para mayor precisión.
          </p>
        </div>
      </div>
    </div>
  );
};

export default FilterPanel;
