import { DashboardLayout } from '../../Layout/DashboardLayout';
import { MapContainer, TileLayer, ZoomControl } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useState, useEffect } from 'react';
import L from 'leaflet';

function Dashboard() {
  const [mapType, setMapType] = useState('satellite');
  const [showMapOptions, setShowMapOptions] = useState(false);
  
  const brazilPosition: [number, number] = [-14.235004, -51.925280];
  const defaultZoom = 4;

  // Definindo os limites máximos do mapa (todo o mundo)
  const maxBounds = L.latLngBounds(
    L.latLng(-90, -180), // Canto sudoeste
    L.latLng(90, 180)    // Canto nordeste
  );

  const mapStyles = {
    height: 'calc(100vh - 100px)',
    width: '100%',
  };

  const mapTypeOptions = [
    { value: 'hybrid', label: 'Google Híbrido' },
    { value: 'satellite', label: 'Google Satélite' },
    { value: 'terrain', label: 'Google Terreno' },
    { value: 'roadmap', label: 'Google Roteiro' },
    { value: 'mapbox', label: 'Mapbox' },
    { value: 'osm', label: 'Open Street' },
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
      case 'mapbox':
        return 'https://api.mapbox.com/styles/v1/mapbox/streets-v11/tiles/{z}/{x}/{y}?access_token=SEU_TOKEN_MAPBOX';
      case 'osm':
      default:
        return 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
    }
  };

  // Função para lidar com o evento de redimensionamento da janela
  useEffect(() => {
    const handleResize = () => {
      const mapElement = document.querySelector('.leaflet-container');
      if (mapElement) {
        // Forçar um redimensionamento do mapa
        window.dispatchEvent(new Event('resize'));
      }
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Função para selecionar o tipo de mapa e ocultar o seletor
  const handleMapTypeSelect = (type: string) => {
    setMapType(type);
    setShowMapOptions(false);
  };

  // Função para obter o nome do tipo de mapa atual
  const getCurrentMapTypeName = () => {
    const option = mapTypeOptions.find(opt => opt.value === mapType);
    return option ? option.label : '';
  };

  return (
    <DashboardLayout>
      <div className="relative w-full h-[calc(100vh-100px)]">
        <MapContainer 
          center={brazilPosition}
          zoom={defaultZoom}
          style={mapStyles}
          zoomControl={false}
          worldCopyJump={true}
          maxBounds={maxBounds}
          maxBoundsViscosity={1.0}
          minZoom={1}
        >
          <ZoomControl position="topleft" />
          <TileLayer
            url={getMapUrl(mapType)}
            maxZoom={20}
            subdomains={['mt0', 'mt1', 'mt2', 'mt3']}
            attribution='&copy; Google Maps'
            noWrap={false}
          />
          
          {/* Botão para mostrar/ocultar as opções de mapa */}
          <div className="absolute top-3 right-3 z-[1000]">
            <button
              onClick={() => setShowMapOptions(!showMapOptions)}
              className="flex items-center justify-between w-full bg-white px-4 py-2 rounded-md shadow-md border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <span>{getCurrentMapTypeName()}</span>
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className={`h-4 w-4 ml-2 transition-transform ${showMapOptions ? 'rotate-180' : ''}`} 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            
            {/* Card de opções de mapa */}
            {showMapOptions && (
              <div className="absolute top-full right-0 mt-1 bg-white rounded-md shadow-lg border border-gray-200 overflow-hidden w-48">
                <div className="py-1">
                  {mapTypeOptions.map((option) => (
                    <div 
                      key={option.value}
                      onClick={() => handleMapTypeSelect(option.value)}
                      className={`
                        px-4 py-2 cursor-pointer text-sm transition-colors
                        ${mapType === option.value 
                          ? 'bg-gray-100 text-gray-900 font-medium' 
                          : 'text-gray-700 hover:bg-gray-50'}
                      `}
                    >
                      {option.label}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </MapContainer>
      </div>
    </DashboardLayout>
  );
}

export default Dashboard;