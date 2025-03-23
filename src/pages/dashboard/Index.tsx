import { DashboardLayout } from '../../Layout/DashboardLayout';
import { MapContainer, TileLayer, ZoomControl } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useState } from 'react';

function Dashboard() {
  const [mapType, setMapType] = useState('satellite');
  
  // Brazil coordinates and zoom level
  const brazilPosition: [number, number] = [-14.235004, -51.925280];
  const defaultZoom = 4;

  const mapStyles = {
    height: 'calc(100vh - 100px)',
    width: '100%',
    
  };

  return (
    <DashboardLayout>
      <div >
        <MapContainer 
          center={brazilPosition}
          zoom={defaultZoom}
          style={mapStyles}
          zoomControl={false}
        >
          <ZoomControl position="topleft" />
          <TileLayer
            url={
              mapType === 'satellite'
                ? 'https://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}'
                : 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
            }
            maxZoom={20}
            subdomains={mapType === 'satellite' ? ['mt0', 'mt1', 'mt2', 'mt3'] : 'abc'}
            attribution='&copy; Google Maps'
          />
        </MapContainer>
      </div>
    </DashboardLayout>
  );
}

export default Dashboard;