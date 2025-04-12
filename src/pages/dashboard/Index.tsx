// src/pages/Dashboard.tsx

import { DashboardLayout } from '../../Layout/DashboardLayout';
import { MapContainer, TileLayer, useMap, ScaleControl, ZoomControl } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useState, useEffect, useRef } from 'react';
import L from 'leaflet';
import { Loading } from '../../components/Loading';
import { LayersSidebar } from '../../components/LayersSidebar';
import { FiMap, FiChevronDown } from 'react-icons/fi';

function Dashboard() {
  const [mapType, setMapType] = useState('satellite');
  const [showMapOptions, setShowMapOptions] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [coordinates, setCoordinates] = useState<[number, number] | null>(null);
  const [showLayersSidebar, setShowLayersSidebar] = useState(true);
  const mapRef = useRef<L.Map | null>(null);
  
  const brazilPosition: [number, number] = [-14.235004, -51.925280];
  const defaultZoom = 4;

  const maxBounds = L.latLngBounds(
    L.latLng(-90, -180),
    L.latLng(90, 180)
  );

  const mapStyles = {
    height: 'calc(100vh - 64px)',
    width: '100%',
  };

  const mapTypeOptions = [
    { value: 'hybrid', label: 'Google Híbrido' },
    { value: 'satellite', label: 'Google Satélite' },
    { value: 'terrain', label: 'Google Terreno' },
    { value: 'roadmap', label: 'Google Roteiro' },
    { value: 'osm', label: 'Open Street' },
    { value: 'none', label: 'Nenhum' },
  ];

  const getMapUrl = (type: string) => {
    switch (type) {
      case 'hybrid':
        return 'https://{s}.google.com/vt/lyrs=s,h&x={x}&y={y}&z={z}';
      case 'satellite':
        return 'https://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}';
      case 'terrain':
        return 'https://{s}.google.com/vt/lyrs=p&x={x}&y={y}&z={z}';
      case 'roadmap':
        return 'https://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}';
      case 'osm':
        return 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
      case 'none':
        return '';
      default:
        return 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
    }
  };

  const handleMapTypeSelect = (type: string) => {
    setMapType(type);
    setShowMapOptions(false);
  };

  const getCurrentMapTypeName = () => {
    const option = mapTypeOptions.find(opt => opt.value === mapType);
    return option ? option.label : '';
  };

  const CoordinatesTracker = () => {
    const map = useMap();
    
    useEffect(() => {
      mapRef.current = map;
      
      const updateCoordinates = (e: L.LeafletMouseEvent) => {
        setCoordinates([
          parseFloat(e.latlng.lat.toFixed(6)),
          parseFloat(e.latlng.lng.toFixed(6))
        ]);
      };
      
      map.on('mousemove', updateCoordinates);
      
      return () => {
        map.off('mousemove', updateCoordinates);
      };
    }, [map]);
    
    return null;
  };

  const MapLoader = () => {
    const map = useMap();
    
    useEffect(() => {
      map.whenReady(() => {
        setTimeout(() => {
          setIsLoading(false);
        }, 500);
      });
    }, [map]);
    
    return null;
  };

  const LayersControl = () => {
    const map = useMap();
    
    useEffect(() => {
      const layersButton = new L.Control({ position: 'topleft' });
      
      layersButton.onAdd = function() {
        const div = L.DomUtil.create('div', 'leaflet-bar leaflet-control');
        div.innerHTML = `
          <a href="#" title="Camadas" style="font-size: 18px; display: flex; align-items: center; justify-content: center; width: 30px; height: 30px; background: white; text-decoration: none; margin-top: 5px;">
            <svg stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path>
            </svg>
          </a>
        `;
        
        L.DomEvent.on(div, 'click', function(e) {
          L.DomEvent.stopPropagation(e);
          L.DomEvent.preventDefault(e);
          setShowLayersSidebar(!showLayersSidebar);
        });
        
        return div;
      };
      
      layersButton.addTo(map);
      
      return () => {
        map.removeControl(layersButton);
      };
    }, [map]);
    
    return null;
  };

  return (
    <DashboardLayout>
      <div className="relative w-full h-full flex">
        {showLayersSidebar && <LayersSidebar 
          isOpen={true} 
          map={mapRef.current}
        />}
        
        <div className="flex-1 relative w-full">
          <div className="absolute inset-0">
            <MapContainer
              center={coordinates || brazilPosition}
              zoom={defaultZoom}
              style={mapStyles}
              maxBounds={maxBounds}
              ref={mapRef}
              zoomControl={false}
            >
              {mapType !== 'none' && (
                <TileLayer
                  url={getMapUrl(mapType)}
                  subdomains={['mt0', 'mt1', 'mt2', 'mt3']}
                />
              )}
              <ZoomControl position="topleft" />
              <LayersControl />
              <ScaleControl position="bottomright" imperial={false} />
              <CoordinatesTracker />
              <MapLoader />
            </MapContainer>
          </div>

          <div className="absolute top-4 right-4" style={{ zIndex: 1100 }}>
            <div className="relative">
              <button
                className="bg-white px-4 py-2 rounded-lg shadow-md flex items-center gap-2"
                onClick={() => setShowMapOptions(!showMapOptions)}
              >
                <FiMap />
                <span>{getCurrentMapTypeName()}</span>
                <FiChevronDown className={`transform transition-transform ${showMapOptions ? 'rotate-180' : ''}`} />
              </button>
              
              {showMapOptions && (
                <div className="absolute top-full right-0 mt-2 bg-white rounded-lg shadow-lg">
                  {mapTypeOptions.map(option => (
                    <button
                      key={option.value}
                      className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                      onClick={() => handleMapTypeSelect(option.value)}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {coordinates && (
            <div className="absolute bottom-4 left-4 bg-white px-4 py-2 rounded-lg shadow-md" style={{ zIndex: 1100 }}>
              Lat: {coordinates[0]}, Lng: {coordinates[1]}
            </div>
          )}

          {isLoading && (
            <div className="absolute inset-0 bg-white/80 flex items-center justify-center" style={{ zIndex: 2000 }}>
              <Loading />
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}

export default Dashboard;