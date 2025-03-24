import { DashboardLayout } from '../../Layout/DashboardLayout';
import { MapContainer, TileLayer, ZoomControl, useMap, ScaleControl, AttributionControl } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useState, useEffect, useRef } from 'react';
import L from 'leaflet';
import { Loading } from '../../components/Loading';
// Importar react-icons
import { FiMap, FiFilter, FiChevronDown, FiLayers } from 'react-icons/fi';

function Dashboard() {
  const [mapType, setMapType] = useState('satellite');
  const [showMapOptions, setShowMapOptions] = useState(false);
  const [showLayerControl, setShowLayerControl] = useState(false);
  const [activeLayers, setActiveLayers] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [coordinates, setCoordinates] = useState<[number, number] | null>(null);
  const mapRef = useRef<L.Map | null>(null);
  
  const brazilPosition: [number, number] = [-14.235004, -51.925280];
  const defaultZoom = 4;

  // Definindo os limites máximos do mapa
  const maxBounds = L.latLngBounds(
    L.latLng(-90, -180),
    L.latLng(90, 180)
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
    { value: 'none', label: 'Nenhum' },
  ];

  // Opções de camadas adicionais
  const layerOptions = [
    { id: 'municipios', label: 'Municípios' },
    { id: 'rodovias', label: 'Rodovias' },
    { id: 'hidrografia', label: 'Hidrografia' },
    { id: 'pontos_interesse', label: 'Pontos de Interesse' },
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
        return 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
      case 'none':
        return '';
      default:
        return 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
    }
  };

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

  // Função para alternar camadas
  const toggleLayer = (layerId: string) => {
    setActiveLayers(prev => 
      prev.includes(layerId) 
        ? prev.filter(id => id !== layerId) 
        : [...prev, layerId]
    );
  };

  // Função auxiliar para verificar se uma camada está no mapa
  const isLayerOnMap = (layer: L.Layer): boolean => {
    // Usando type assertion para acessar a propriedade protegida _map
    return !!(layer as any)._map;
  };

  // Componente para exibir as coordenadas do mouse
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

  // Componente para lidar com o carregamento do mapa
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

  // Componente para adicionar ferramentas de medição
  const MeasurementTools = () => {
    const map = useMap();
    const measureButtonRef = useRef<L.Control | null>(null);
    const polylineRef = useRef<L.Polyline | null>(null);
    const markersRef = useRef<L.Marker[]>([]);
    const isMeasuringRef = useRef<boolean>(false);
    
    useEffect(() => {
      if (!map) return;
      
      // Adicionar botão de medição personalizado
      // @ts-ignore
      const measureButton = L.control({ position: 'topleft' });
      
      measureButton.onAdd = function() {
        const div = L.DomUtil.create('div', 'leaflet-bar leaflet-control');
        div.innerHTML = `
          <a href="#" title="Ferramenta de Medição" style="display: flex; align-items: center; justify-content: center; width: 30px; height: 30px; background: white; text-decoration: none;">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M2 12h20M2 12v-2M2 12v2M12 2v20M12 2h-2M12 2h2M12 22h-2M12 22h2M20 12v-2M20 12v2M4 12v-2M4 12v2"></path>
            </svg>
          </a>
        `;
        
        L.DomEvent.on(div, 'click', function(e) {
          L.DomEvent.stopPropagation(e);
          L.DomEvent.preventDefault(e);
          
          // Iniciar ou parar modo de medição
          if (!isMeasuringRef.current) {
            startMeasuring();
          } else {
            stopMeasuring();
          }
        });
        
        return div;
      };
      
      measureButton.addTo(map);
      measureButtonRef.current = measureButton;
      
      // Função para iniciar medição
      function startMeasuring() {
        const polyline = L.polyline([], { color: 'red' });
        polylineRef.current = polyline;
        const markers: L.Marker[] = [];
        markersRef.current = markers;
        let totalDistance = 0;
        let clickCount = 0;
        
        isMeasuringRef.current = true;
        map.getContainer().style.cursor = 'crosshair';
        
        const clickHandler = (e: L.LeafletMouseEvent) => {
          const latlng = e.latlng;
          
          // Adicionar ponto à linha
          const currentLatLngs = polyline.getLatLngs() as L.LatLng[];
          currentLatLngs.push(latlng);
          polyline.setLatLngs(currentLatLngs);
          
          if (!isLayerOnMap(polyline)) {
            polyline.addTo(map);
          }
          
          // Adicionar marcador
          const marker = L.marker(latlng).addTo(map);
          markers.push(marker);
          
          // Calcular distância
          if (clickCount > 0) {
            const prevLatLng = currentLatLngs[clickCount - 1];
            const distance = prevLatLng.distanceTo(latlng);
            totalDistance += distance;
            
            // Mostrar distância total
            L.popup({ closeButton: false, offset: [0, -20] })
              .setLatLng(latlng)
              .setContent(`Distância total: ${(totalDistance / 1000).toFixed(2)} km`)
              .openOn(map);
          }
          
          clickCount++;
        };
        
        const dblClickHandler = () => {
          stopMeasuring();
        };
        
        map.on('click', clickHandler);
        map.on('dblclick', dblClickHandler);
        
        // Armazenar funções de limpeza
        const cleanup = () => {
          map.off('click', clickHandler);
          map.off('dblclick', dblClickHandler);
          
          if (isLayerOnMap(polyline)) {
            map.removeLayer(polyline);
          }
          
          markers.forEach(marker => {
            if (isLayerOnMap(marker)) {
              map.removeLayer(marker);
            }
          });
          
          map.getContainer().style.cursor = '';
          map.closePopup();
          isMeasuringRef.current = false;
        };
        
        // Armazenar função de limpeza para uso posterior
        return cleanup;
      }
      
      function stopMeasuring() {
        if (polylineRef.current && isLayerOnMap(polylineRef.current)) {
          map.removeLayer(polylineRef.current);
        }
        
        markersRef.current.forEach(marker => {
          if (isLayerOnMap(marker)) {
            map.removeLayer(marker);
          }
        });
        
        map.getContainer().style.cursor = '';
        map.closePopup();
        isMeasuringRef.current = false;
      }
      
      return () => {
        if (measureButtonRef.current) {
          map.removeControl(measureButtonRef.current);
        }
        stopMeasuring();
      };
    }, [map]);
    
    return null;
  };

  return (
    <DashboardLayout>
      {isLoading && (
        <div className="absolute inset-0 z-[9999] bg-white/80 backdrop-blur-sm flex items-center justify-center">
          <Loading />
        </div>
      )}
      <div className="relative w-full h-[calc(100vh-100px)] z-0">
        <MapContainer 
          center={brazilPosition}
          zoom={defaultZoom}
          style={mapStyles}
          zoomControl={true}
          worldCopyJump={true}
          maxBounds={maxBounds}
          maxBoundsViscosity={1.0}
          minZoom={1}
          className="z-0"
          attributionControl={false}
        >
          <MapLoader />
          <CoordinatesTracker />
          <ScaleControl position="bottomright" imperial={false} />
          <AttributionControl position="bottomright" />
          <MeasurementTools />
          
          {mapType !== 'none' && (
            <TileLayer
              url={getMapUrl(mapType)}
              maxZoom={20}
              subdomains={['mt0', 'mt1', 'mt2', 'mt3']}
              attribution='&copy; Google Maps'
              noWrap={false}
            />
          )}
          
          {/* Camadas adicionais baseadas no estado */}
          {activeLayers.includes('municipios') && (
            <TileLayer
              url="https://seu-servidor/municipios/{z}/{x}/{y}.png"
              maxZoom={20}
              attribution='&copy; Dados Municipais'
            />
          )}
          
          {activeLayers.includes('rodovias') && (
            <TileLayer
              url="https://seu-servidor/rodovias/{z}/{x}/{y}.png"
              maxZoom={20}
              attribution='&copy; Dados Rodoviários'
            />
          )}
          
          {activeLayers.includes('hidrografia') && (
            <TileLayer
              url="https://seu-servidor/hidrografia/{z}/{x}/{y}.png"
              maxZoom={20}
              attribution='&copy; Dados Hidrográficos'
            />
          )}
          
          {/* Map Type Selector */}
          <div className="absolute top-3 right-3 z-[9999]">
            <button
              onClick={() => setShowMapOptions(!showMapOptions)}
              className="flex items-center justify-between w-56 bg-white/90 backdrop-blur-sm px-4 py-2.5 rounded-lg shadow-lg border border-gray-200/50 text-sm font-medium text-gray-700 hover:bg-white/95 transition-all duration-200 group"
            >
              <div className="flex items-center">
                <FiMap className="mr-2 h-4 w-4 text-gray-500" />
                <span>{getCurrentMapTypeName()}</span>
              </div>
              <FiChevronDown className={`h-4 w-4 text-gray-500 transition-transform duration-200 ${showMapOptions ? 'rotate-180' : ''}`} />
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
                          ? 'bg-blue-50/80 text-orange-600 font-medium' 
                          : 'text-gray-700 hover:bg-gray-50/80'}
                      `}
                    >
                      <div className={`w-2 h-2 rounded-full ${mapType === option.value ? 'bg-orange-500' : 'bg-gray-300'}`} />
                      <span>{option.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          {/* Botão de Filtro */}
          <div className="absolute top-3 left-3 z-[9999]">
            <button
              className="flex items-center justify-center w-10 h-10 bg-white/90 backdrop-blur-sm rounded-lg shadow-lg border border-gray-200/50 text-gray-700 hover:bg-white/95 transition-all duration-200"
              title="Filtrar"
            >
              <FiFilter className="h-5 w-5" />
            </button>
          </div>
          
          {/* Botão de Camadas - Posicionado abaixo da ferramenta de medição */}
          <div className="absolute top-16 left-3 z-[9999]">
            <button
              onClick={() => setShowLayerControl(!showLayerControl)}
              className="flex items-center justify-center w-10 h-10 bg-white/90 backdrop-blur-sm rounded-lg shadow-lg border border-gray-200/50 text-gray-700 hover:bg-white/95 transition-all duration-200"
              title="Camadas"
            >
              <FiLayers className="h-5 w-5" />
            </button>
            
            {showLayerControl && (
              <div className="absolute top-full left-0 mt-2 bg-white/95 backdrop-blur-sm rounded-lg shadow-xl border border-gray-200/50 overflow-hidden w-56 transform transition-all duration-200">
                <div className="py-1">
                  <div className="px-4 py-2 text-sm font-medium text-gray-700 border-b border-gray-100">
                    Camadas
                  </div>
                  {layerOptions.map((layer) => (
                    <div 
                      key={layer.id}
                      onClick={() => toggleLayer(layer.id)}
                      className="px-4 py-2.5 cursor-pointer text-sm transition-all duration-150 flex items-center space-x-2 text-gray-700 hover:bg-gray-50/80"
                    >
                      <input 
                        type="checkbox" 
                        checked={activeLayers.includes(layer.id)} 
                        onChange={() => {}} 
                        className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                      />
                      <span>{layer.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          {/* Exibição de Coordenadas - Movido para o canto inferior direito */}
          {coordinates && (
            <div className="absolute bottom-16 right-3 z-[9999] bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-md shadow-md border border-gray-200/50 text-xs font-mono text-gray-700">
              {coordinates[0]}, {coordinates[1]}
            </div>
          )}
        </MapContainer>
      </div>
    </DashboardLayout>
  );
}

export default Dashboard;