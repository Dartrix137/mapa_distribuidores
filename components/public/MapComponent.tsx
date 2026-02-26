
import React from 'react';
import { MapContainer, TileLayer, Marker, Tooltip, useMap } from 'react-leaflet';
import L from 'leaflet';
import { Distributor } from '../../types';
import { COLOMBIA_CENTER, COLOMBIA_ZOOM } from '../../constants';
import { useEffect } from 'react';

/**
 * Creates a custom Leaflet DivIcon with the brand logo inside.
 * The marker is styled as a solid brand pin using the color #e98d04.
 */
const createCustomIcon = (isHighlighted: boolean) => {
  const size = isHighlighted ? 54 : 44;
  const logoSize = isHighlighted ? 34 : 28;
  const brandColor = "#e98d04";

  return L.divIcon({
    className: 'custom-solidview-marker',
    html: `
      <div style="
        position: relative;
        width: ${size}px;
        height: ${size}px;
        background: ${brandColor};
        border-radius: 50% 50% 50% 8%;
        transform: rotate(-45deg);
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
        transition: all 0.2s ease-in-out;
        border: none;
      ">
        <div style="
          width: ${logoSize}px;
          height: ${logoSize}px;
          transform: rotate(45deg);
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
        ">
          <img 
            src="https://solidview.com.co/wp-content/uploads/2026/02/Recurso-55.png" 
            alt="SolidView"
            style="
              width: 100%;
              height: 100%;
              object-fit: contain;
            "
          />
        </div>
      </div>
    `,
    iconSize: [size, size],
    iconAnchor: [size / 2, size],
    tooltipAnchor: [size / 2, -size / 2],
  });
};

interface MapComponentProps {
  distributors: Distributor[];
  hoveredDistributorId: string | null;
  onMarkerHover: (id: string | null) => void;
}

// Helper component to fix Leaflet map size issues when container dimensions change
const MapUpdater = () => {
  const map = useMap();
  useEffect(() => {
    // Invalidate size on mount and after a short delay to ensure DOM is fully rendered
    map.invalidateSize();
    const timer = setTimeout(() => {
      map.invalidateSize();
    }, 250);

    // Also invalidate on window resize to keep it responsive
    const handleResize = () => map.invalidateSize();
    window.addEventListener('resize', handleResize);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', handleResize);
    };
  }, [map]);
  return null;
};

const MapComponent: React.FC<MapComponentProps> = ({ distributors, hoveredDistributorId, onMarkerHover }) => {
  return (
    <MapContainer center={COLOMBIA_CENTER} zoom={COLOMBIA_ZOOM} style={{ height: '100%', width: '100%', minHeight: '400px' }}>
      <MapUpdater />
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      {distributors.map((d) => (
        <Marker
          key={d.id}
          position={[d.latitude, d.longitude]}
          icon={createCustomIcon(hoveredDistributorId === d.id)}
          eventHandlers={{
            mouseover: () => onMarkerHover(d.id),
            mouseout: () => onMarkerHover(null),
            click: (e) => {
              const map = e.target._map;
              map.flyTo(e.latlng, 15, {
                duration: 1.5
              });
            },
          }}
        >
          <Tooltip permanent={false} direction="top" offset={[0, -20]}>
            <div className="font-sans p-1">
              <p className="font-bold text-base text-[#e98d04] border-b pb-1 mb-1">{d.name}</p>
              <p className="text-xs text-gray-600 italic mb-2 max-w-[200px]">{d.description}</p>
              <div className="text-[11px] text-gray-500 space-y-0.5">
                <p className="flex items-center">
                  <span className="font-semibold mr-1">📍</span> {d.address}, {d.city}
                </p>
                <p className="flex items-center">
                  <span className="font-semibold mr-1">📞</span> {d.phone}
                </p>
              </div>
            </div>
          </Tooltip>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default MapComponent;
