
import React from 'react';
import { Distributor } from '../../types';

interface DistributorCardProps {
  distributor: Distributor;
  isHovered: boolean;
  onHover: (id: string | null) => void;
}

const DistributorCard: React.FC<DistributorCardProps> = ({ distributor, isHovered, onHover }) => {
  // Check if whatsappPhone exists and is not just whitespace
  const hasWhatsapp = !!distributor.whatsappPhone && distributor.whatsappPhone.trim() !== '';
  const hasWebsite = !!distributor.websiteUrl && distributor.websiteUrl.trim() !== '';
  const hasMaps = !!distributor.googleMapsUrl && distributor.googleMapsUrl.trim() !== '';
  
  let whatsappUrl = '';
  if (hasWhatsapp) {
    // Sanitize phone number for WhatsApp link
    const sanitizedPhone = distributor.whatsappPhone!.replace(/\D/g, '');
    const phoneWithCode = sanitizedPhone.startsWith('57') ? sanitizedPhone : `57${sanitizedPhone}`;
    whatsappUrl = `https://wa.me/${phoneWithCode}`;
  }

  return (
    <div 
      className={`bg-white rounded-lg shadow-lg overflow-hidden flex flex-col transform transition-all duration-300 ${isHovered ? 'scale-105 shadow-2xl ring-2 ring-[#e98d04]' : 'shadow-md'}`}
      onMouseEnter={() => onHover(distributor.id)}
      onMouseLeave={() => onHover(null)}
    >
      <div className="p-6 flex-grow">
        <div className="flex items-center space-x-6 mb-6">
          <div className="flex-shrink-0">
            <img
              src={distributor.logoUrl}
              alt={`${distributor.name} logo`}
              className="w-24 h-24 rounded-lg object-cover border-2 border-gray-100 shadow-sm"
            />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-gray-800 leading-tight mb-1">{distributor.name}</h3>
            <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">{distributor.city}, {distributor.department}</p>
          </div>
        </div>
        <div className="space-y-4 text-gray-700">
          <div className="flex items-start bg-gray-50 p-3 rounded-md border-l-4 border-[#e98d04]">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 text-[#e98d04] flex-shrink-0 mt-0.5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" /></svg>
            <span className="italic text-sm leading-snug">{distributor.description}</span>
          </div>
          <div className="space-y-2 px-1">
            <p className="flex items-center text-sm">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 text-[#e98d04]" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" /></svg>
              {distributor.address}
            </p>
            <p className="flex items-center text-sm font-semibold">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 text-[#e98d04]" viewBox="0 0 20 20" fill="currentColor"><path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" /></svg>
              {distributor.phone}
            </p>
          </div>
        </div>
      </div>
      
      <div className="px-6 pb-6 mt-auto space-y-2">
        {hasWhatsapp && (
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center justify-center py-2.5 px-4 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors text-sm font-bold shadow-md active:scale-95"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 448 512">
              <path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-5.5-2.8-23.2-8.5-44.2-27.3-16.4-14.6-27.4-32.7-30.6-38.2-3.2-5.6-.3-8.6 2.5-11.3 2.5-2.5 5.5-6.5 8.3-9.7 2.8-3.3 3.7-5.6 5.6-9.3 1.9-3.7 1-7-0.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-0.2-6.9-0.2-10.6-0.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 13.2 5.8 23.5 9.2 31.6 11.8 13.3 4.2 25.4 3.6 35 2.2 10.7-1.5 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z" />
            </svg>
            Contactar por WhatsApp
          </a>
        )}

        <div className={`flex gap-2 ${hasWebsite && hasMaps ? 'flex-row' : 'flex-col'}`}>
          {hasWebsite && (
            <a
              href={distributor.websiteUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={`flex-1 flex items-center justify-center py-2.5 px-4 bg-[#1e40af] text-white rounded-md hover:bg-[#1e3a8a] transition-colors text-sm font-bold shadow-md active:scale-95`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
              </svg>
              Sitio Web
            </a>
          )}

          {hasMaps && (
            <a
              href={distributor.googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={`flex-1 flex items-center justify-center py-2.5 px-4 bg-[#e98d04] text-white rounded-md hover:bg-[#c27503] transition-colors text-sm font-bold shadow-md active:scale-95`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Ver en Mapas
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

export default DistributorCard;
