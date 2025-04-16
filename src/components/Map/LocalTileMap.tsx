import { useEffect, useState } from 'react';
import { MapContainer, TileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

interface TifInfo {
  width: number;
  height: number;
  bounds: {
    north: number;
    south: number;
    east: number;
    west: number;
  };
}

// Fix Leaflet default marker icons
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: '/node_modules/leaflet/dist/images/marker-icon-2x.png',
  iconUrl: '/node_modules/leaflet/dist/images/marker-icon.png',
  shadowUrl: '/node_modules/leaflet/dist/images/marker-shadow.png',
});

// Iturama coordinates (approximate center)
const ITURAMA_CENTER: L.LatLngTuple = [-19.7276, -50.1967];
const DEFAULT_ZOOM = 13;
const MIN_ZOOM = 10;
const MAX_ZOOM = 18; // Reduzindo o zoom máximo para melhor performance

interface LocalTileMapProps {
  className?: string;
}

export const LocalTileMap = ({ className }: LocalTileMapProps) => {
  const [mapReady, setMapReady] = useState(false);
  const [tifInfo, setTifInfo] = useState<TifInfo | null>(null);

  useEffect(() => {
    fetch('http://localhost:3000/api/tif-info')
      .then(res => res.json())
      .then(info => {
        console.log('TIF Info:', info);
        setTifInfo(info);
        setMapReady(true);
      })
      .catch(err => {
        console.error('Erro ao carregar informações do TIF:', err);
      });
  }, []);

  if (!mapReady || !tifInfo) return null;

  return (
    <MapContainer
      center={ITURAMA_CENTER}
      zoom={DEFAULT_ZOOM}
      className={className || 'h-screen w-full'}
      preferCanvas={true}
      maxBounds={[
        [tifInfo.bounds.south, tifInfo.bounds.west],
        [tifInfo.bounds.north, tifInfo.bounds.east]
      ]}
      maxBoundsViscosity={0.5}
    >
      <TileLayer
        url="http://localhost:3000/api/tiles/{z}/{x}/{y}"
        minZoom={MIN_ZOOM}
        maxZoom={MAX_ZOOM}
        attribution="Iturama 2019 Imagery"
        tileSize={256}
        noWrap={true}
        keepBuffer={2}
        updateWhenZooming={false}
        updateWhenIdle={true}
        bounds={[
          [tifInfo.bounds.south, tifInfo.bounds.west],
          [tifInfo.bounds.north, tifInfo.bounds.east]
        ]}
        errorTileUrl="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7"
      />
    </MapContainer>
  );
};
