
import React from 'react';
import { Distributor } from '../../types';
import DistributorCard from './DistributorCard';

interface DistributorListProps {
  distributors: Distributor[];
  hoveredDistributorId: string | null;
  onCardHover: (id: string | null) => void;
}

const DistributorList: React.FC<DistributorListProps> = ({ distributors, hoveredDistributorId, onCardHover }) => {
  if (distributors.length === 0) {
    return (
      <div className="text-center py-10 px-6 bg-white rounded-lg shadow-md">
        <p className="text-gray-500 text-lg">No se encontraron distribuidores con los criterios de búsqueda actuales.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {distributors.map(distributor => (
        <DistributorCard 
          key={distributor.id} 
          distributor={distributor}
          isHovered={hoveredDistributorId === distributor.id}
          onHover={onCardHover}
        />
      ))}
    </div>
  );
};

export default DistributorList;
