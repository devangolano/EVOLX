// src/pages/Dashboard.tsx

import { DashboardLayout } from '../../Layout/DashboardLayout';
import { MapContainer, TileLayer, ScaleControl, ZoomControl, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useState, useEffect, useRef } from 'react';
import L from 'leaflet';
import { LayersSidebar } from '../../components/LayersSidebar';
import proj4 from 'proj4';


// Fix Leaflet default marker icons
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: '/node_modules/leaflet/dist/images/marker-icon-2x.png',
  iconUrl: '/node_modules/leaflet/dist/images/marker-icon.png',
  shadowUrl: '/node_modules/leaflet/dist/images/marker-shadow.png',
});

// Iturama coordinates (approximate center)
// Centro aproximado de Iturama em coordenadas UTM (EPSG:31982)
const ITURAMA_CENTER: L.LatLngTuple = [-19.7276, -50.1967];

// Limites da imagem TIF (baseado no geoTransform)
const TIF_BOUNDS = L.latLngBounds(
  L.latLng(-19.9, -50.3), // Sul-Oeste
  L.latLng(-19.6, -50.0)  // Norte-Leste
);
const DEFAULT_ZOOM = 15;

function Dashboard() {
  const [showLayersSidebar, setShowLayersSidebar] = useState(true);
  const [coordinates, setCoordinates] = useState<L.LatLngTuple | null>(null);
  const mapRef = useRef<L.Map | null>(null);

  // Define the coordinate systems
  useEffect(() => {
    proj4.defs('EPSG:31982', '+proj=utm +zone=22 +south +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs');
  }, []);


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
        {showLayersSidebar && <LayersSidebar isOpen={true} map={mapRef.current} />}
        <div className="flex-1">
          <div style={{ height: '100%', width: '100%' }}>
            <MapContainer
              center={ITURAMA_CENTER}
              zoom={DEFAULT_ZOOM}
              maxBounds={TIF_BOUNDS}
              maxBoundsViscosity={1.0}
              minZoom={12}
              maxZoom={16}
              style={{ height: '100%', width: '100%' }}
            >
              {/* GeoJSON layer will be added here once we have the data */}
              <TileLayer
                url="http://localhost:3000/api/tiles/{z}/{x}/{y}"
                minZoom={12}
                maxZoom={19}
                tileSize={256}
                attribution="Iturama 2019 Imagery"
              />
              <ZoomControl position="topleft" />
              <LayersControl />
              <ScaleControl position="bottomright" imperial={false} />
              <CoordinatesTracker />
            </MapContainer>
          </div>

          {coordinates && (
            <div className="absolute bottom-4 left-4 bg-white px-4 py-2 rounded-lg shadow-md" style={{ zIndex: 1100 }}>
              Lat: {coordinates[0]}, Lng: {coordinates[1]}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}

export default Dashboard;