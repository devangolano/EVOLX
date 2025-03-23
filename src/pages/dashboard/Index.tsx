import { DashboardLayout } from '../../Layout/DashboardLayout';
import { MapContainer, TileLayer, ZoomControl, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useState, useEffect } from 'react';
import L from 'leaflet';
import { Loading } from '../../components/Loading';

function Dashboard() {
  const [mapType, setMapType] = useState('satellite');
  const [showMapOptions, setShowMapOptions] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
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

  // Add this component to handle map load
  const MapLoader = () => {
    const map = useMap();
    
    useEffect(() => {
      map.whenReady(() => {
        setIsLoading(false);
      });
    }, [map]);
    
    return null;
  };

  return (
    <DashboardLayout>
      {isLoading && <Loading />}
      <div className="relative w-full h-[calc(100vh-100px)] z-0">
        <MapContainer 
          center={brazilPosition}
          zoom={defaultZoom}
          style={mapStyles}
          zoomControl={false}
          worldCopyJump={true}
          maxBounds={maxBounds}
          maxBoundsViscosity={1.0}
          minZoom={1}
          className="z-0"
        >
          <MapLoader />
          <ZoomControl position="topleft" />
          <TileLayer
            url={getMapUrl(mapType)}
            maxZoom={20}
            subdomains={['mt0', 'mt1', 'mt2', 'mt3']}
            attribution='&copy; Google Maps'
            noWrap={false}
          />
          
          {/* Map Type Selector - Updated z-index */}
          <div className="absolute top-3 right-3 z-[9999]"> {/* Increased z-index */}
            <button
              onClick={() => setShowMapOptions(!showMapOptions)}
              className="flex items-center justify-between w-56 bg-white/90 backdrop-blur-sm px-4 py-2.5 rounded-lg shadow-lg border border-gray-200/50 text-sm font-medium text-gray-700 hover:bg-white/95 transition-all duration-200 group"
            >
              <div className="flex items-center">
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className="h-4 w-4 mr-2 text-gray-500" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                </svg>
                <span>{getCurrentMapTypeName()}</span>
              </div>
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className={`h-4 w-4 text-gray-500 transition-transform duration-200 ${showMapOptions ? 'rotate-180' : ''}`} 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            
            {showMapOptions && (
              <div className="absolute top-full right-0 mt-2 bg-white/95 backdrop-blur-sm rounded-lg shadow-xl border border-gray-200/50 overflow-hidden w-56 transform transition-all duration-200">
                <div className="py-1">
                  {mapTypeOptions.map((option) => (
                    <div 
                      key={option.value}
                      onClick={() => handleMapTypeSelect(option.value)}
                      className={`
                        px-4 py-2.5 cursor-pointer text-sm transition-all duration-150
                        flex items-center space-x-2
                        ${mapType === option.value 
                          ? 'bg-blue-50/80 text-blue-600 font-medium' 
                          : 'text-gray-700 hover:bg-gray-50/80'}
                      `}
                    >
                      <div className={`w-2 h-2 rounded-full ${mapType === option.value ? 'bg-blue-500' : 'bg-gray-300'}`} />
                      <span>{option.label}</span>
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