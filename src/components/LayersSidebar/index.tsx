import React, { useRef, useState } from 'react';
import { FiChevronDown, FiChevronRight, FiFile, FiUpload, FiFolder } from 'react-icons/fi';
import L from 'leaflet';
import 'leaflet.markercluster/dist/leaflet.markercluster';
import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';
import proj4 from 'proj4';

// Define the EPSG:31982 projection
proj4.defs('EPSG:31982', '+proj=utm +zone=22 +south +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs');

interface LayersSidebarProps {
  isOpen: boolean;
  map: L.Map | null;
}

interface UploadedFile {
  name: string;
  category: string;
  data: GeoJSON.FeatureCollection;
  visible: boolean;
  layer?: L.GeoJSON;
  markers?: L.LayerGroup;
}

interface Category {
  id: string;
  name: string;
  isOpen: boolean;
  files: UploadedFile[];
  subcategories?: Category[];
}

const CATEGORIES: Category[] = [
  {
    id: 'iturama-mg',
    name: 'ITURAMA-MG',
    isOpen: false,
    files: [],
    subcategories: [
      {
        id: 'meio-ambiente',
        name: 'MEIO AMBIENTE',
        isOpen: false,
        files: [],
        subcategories: [
          { id: 'arborizacao-urbana', name: 'Arborização Urbana', isOpen: false, files: [] },
          { id: 'nascentes', name: 'Nascentes', isOpen: false, files: [] },
          { id: 'cursos-dagua', name: 'Cursos D\'água', isOpen: false, files: [] },
          { id: 'acudes', name: 'Açudes', isOpen: false, files: [] },
        ]
      },
      { id: 'energia', name: 'ENERGIA', isOpen: false, files: [] },
      { id: 'transito', name: 'TRÂNSITO', isOpen: false, files: [] },
      { id: 'topografia', name: 'TOPOGRAFIA', isOpen: false, files: [] },
      { id: 'cadastro-agropecuario', name: 'CADASTRO AGROPECUÁRIO', isOpen: false, files: [] },
      { id: 'cadastro-imobiliario', name: 'CADASTRO IMOBILIÁRIO', isOpen: false, files: [] },
      { id: 'limites', name: 'LIMITES', isOpen: false, files: [] },
      { id: 'leitura-agua', name: 'LEITURA ÁGUA', isOpen: false, files: [] },
      { id: 'ortofotos', name: 'ORTOFOTOS', isOpen: false, files: [] },
    ]
  }
];

const transformCoordinates = (coordinates: number[], inverse = false): number[] => {
  const [x, y] = coordinates;
  const [transformedX, transformedY] = inverse 
    ? proj4('EPSG:4326', 'EPSG:31982', [x, y]) 
    : proj4('EPSG:31982', 'EPSG:4326', [x, y]);
  return [transformedX, transformedY];
};

const transformGeoJSON = (geojson: GeoJSON.FeatureCollection): GeoJSON.FeatureCollection => {
  const transformed = JSON.parse(JSON.stringify(geojson));
  
  transformed.features.forEach((feature: GeoJSON.Feature) => {
    if (feature.geometry.type === 'Polygon') {
      feature.geometry.coordinates = feature.geometry.coordinates.map((ring: number[][]) =>
        ring.map((coord: number[]) => transformCoordinates(coord))
      );
    }
  });

  return transformed;
};

const getCategoryColor = (categoryId: string): string => {
  // Mapa de cores por categoria
  const colorMap: { [key: string]: string } = {
    'MEIO AMBIENTE': '#3388ff', // azul
    'ENERGIA': '#ff3333', // vermelho
    'TRÂNSITO': '#33ff33', // verde
    'TOPOGRAFIA': '#ff9933', // laranja
    'CADASTRO AGROPECUÁRIO': '#9933ff', // roxo
    'CADASTRO IMOBILIÁRIO': '#ff33ff', // rosa
    'LIMITES': '#33ffff', // ciano
    'LEITURA ÁGUA': '#ffff33', // amarelo
    'ORTOFOTOS': '#666666', // cinza
  };
  return colorMap[categoryId] || '#3388ff'; // azul como cor padrão
};

export const LayersSidebar: React.FC<LayersSidebarProps> = ({ isOpen, map }) => {
  const fileInputRefs = useRef<{ [key: string]: HTMLInputElement | null }>({});
  const [categories, setCategories] = useState<Category[]>(CATEGORIES);

  if (!isOpen) return null;

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>, categoryId: string) => {
    const file = event.target.files?.[0];
    if (!file || !map) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const geojson = JSON.parse(e.target?.result as string) as GeoJSON.FeatureCollection;
        if (geojson.type !== 'FeatureCollection') {
          throw new Error('Arquivo inválido: Deve ser um GeoJSON FeatureCollection');
        }

        const fileName = file.name.replace('.geojson', '');
        const color = getCategoryColor(categoryId);
        
        // Transform coordinates from EPSG:31982 to EPSG:4326
        const transformedGeoJSON = transformGeoJSON(geojson);

        // Create a marker cluster group
        const markers = (L as any).markerClusterGroup({
          maxClusterRadius: 50, // Distância para agrupar os marcadores
          spiderfyOnMaxZoom: true, // Espalha os marcadores quando dá zoom máximo
          showCoverageOnHover: false,
          zoomToBoundsOnClick: true,
          iconCreateFunction: function(cluster: any) {
            const count = cluster.getChildCount();
            // Estilo do círculo vermelho com número
            return L.divIcon({
              html: `
                <div class="flex items-center justify-center rounded-full text-white font-medium" 
                     style="width: 25px; height: 25px; background-color: #DC2626; box-shadow: 0 0 0 4px rgba(220, 38, 38, 0.2);">
                  ${count}
                </div>`,
              className: 'custom-cluster-icon',
              iconSize: L.point(25, 25),
              iconAnchor: L.point(12, 12)
            });
          }
        });

        // Add markers for each feature
        transformedGeoJSON.features.forEach(feature => {
          if (feature.geometry.type === 'Point') {
            const coords = feature.geometry.coordinates;
            const marker = L.marker([coords[1], coords[0]], {
              icon: L.divIcon({
                html: `
                  <div class="flex items-center justify-center" style="width: 25px; height: 25px;">
                    <div class="w-3 h-3 bg-blue-500 rounded-full shadow-lg border-2 border-white"></div>
                  </div>`,
                className: 'custom-marker-icon',
                iconSize: [25, 25],
                iconAnchor: [12, 12]
              })
            });
            markers.addLayer(marker);
          } else if (feature.geometry.type === 'Polygon' || feature.geometry.type === 'MultiPolygon') {
            // For polygons, add a marker at the centroid
            const layer = L.geoJSON(feature);
            const center = layer.getBounds().getCenter();
            const marker = L.marker([center.lat, center.lng], {
              icon: L.divIcon({
                html: `
                  <div class="flex items-center justify-center" style="width: 25px; height: 25px;">
                    <div class="w-3 h-3 bg-blue-500 rounded-full shadow-lg border-2 border-white"></div>
                  </div>`,
                className: 'custom-marker-icon',
                iconSize: [25, 25],
                iconAnchor: [12, 12]
              })
            });
            markers.addLayer(marker);
          }
        });

        // Add the markers to the map
        markers.addTo(map);

        // Create the polygon layer with style
        const layer = L.geoJSON(transformedGeoJSON, {
          style: {
            color: color,
            weight: 2,
            opacity: 1,
            fillOpacity: 0.2
          }
        }).addTo(map);

        // Fit map to layer bounds
        const bounds = layer.getBounds();
        map.fitBounds(bounds);

        // Update state with new file
        setCategories(prev => {
          const updateCategoryFiles = (cats: Category[]): Category[] => {
            return cats.map(cat => {
              if (cat.id === categoryId) {
                const filtered = cat.files.filter(f => {
                  if (f.name === fileName && f.layer) {
                    f.layer.removeFrom(map);
                    f.markers?.removeFrom(map);
                    return false;
                  }
                  return true;
                });

                return {
                  ...cat,
                  isOpen: true,
                  files: [...filtered, {
                    name: fileName,
                    category: categoryId,
                    data: geojson,
                    layer: layer,
                    markers: markers,
                    visible: true
                  }]
                };
              }
              if (cat.subcategories) {
                return { ...cat, subcategories: updateCategoryFiles(cat.subcategories) };
              }
              return cat;
            });
          };
          return updateCategoryFiles(prev);
        });

        event.target.value = '';
      } catch (error) {
        alert('Erro ao processar o arquivo: ' + error);
      }
    };
    reader.readAsText(file);
  };

  const toggleCategory = (categoryId: string) => {
    setCategories(prev => {
      const updateCategory = (cats: Category[]): Category[] => {
        return cats.map(cat => {
          if (cat.id === categoryId) {
            return { ...cat, isOpen: !cat.isOpen };
          }
          if (cat.subcategories) {
            return { ...cat, subcategories: updateCategory(cat.subcategories) };
          }
          return cat;
        });
      };
      return updateCategory(prev);
    });
  };

  const toggleLayer = (categoryId: string, fileName: string) => {
    if (!map) return;

    setCategories(prev => {
      const updateCategoryLayers = (cats: Category[]): Category[] => {
        return cats.map(cat => {
          if (cat.id === categoryId) {
            return {
              ...cat,
              files: cat.files.map(file => {
                if (file.name === fileName) {
                  if (file.visible) {
                    file.layer?.removeFrom(map);
                    file.markers?.removeFrom(map);
                  } else {
                    file.layer?.addTo(map);
                    file.markers?.addTo(map);
                  }
                  return { ...file, visible: !file.visible };
                }
                return file;
              })
            };
          }
          if (cat.subcategories) {
            return { ...cat, subcategories: updateCategoryLayers(cat.subcategories) };
          }
          return cat;
        });
      };
      return updateCategoryLayers(prev);
    });
  };

  return (
    <div className="h-full bg-white overflow-y-auto border-r border-gray-200" style={{ width: '280px' }}>
      {categories.map(category => (
        <div key={category.id} className="border-b border-gray-100">
          <div 
            className="flex items-center py-1.5 px-3 cursor-pointer hover:bg-gray-50 transition-colors"
            onClick={() => toggleCategory(category.id)}
          >
            {category.isOpen ? 
              <FiChevronDown className="w-3.5 h-3.5 mr-1.5 text-gray-500" /> : 
              <FiChevronRight className="w-3.5 h-3.5 mr-1.5 text-gray-500" />
            }
            <FiFolder className={`w-3.5 h-3.5 mr-1.5 ${category.isOpen ? 'text-blue-500' : 'text-yellow-500'}`} />
            <span className="text-xs font-medium text-gray-700 flex-1">{category.name}</span>
          </div>

          {category.isOpen && (
            <div className="pl-6 pr-2 pb-1.5">
              {category.subcategories ? (
                // Render subcategories
                category.subcategories.map(subcategory => (
                  <div key={subcategory.id}>
                    <div 
                      className="flex items-center py-1.5 px-2 cursor-pointer hover:bg-gray-50 transition-colors"
                      onClick={() => toggleCategory(subcategory.id)}
                    >
                      {subcategory.isOpen ? 
                        <FiChevronDown className="w-3.5 h-3.5 mr-1.5 text-gray-500" /> : 
                        <FiChevronRight className="w-3.5 h-3.5 mr-1.5 text-gray-500" />
                      }
                      <FiFolder className={`w-3.5 h-3.5 mr-1.5 ${subcategory.isOpen ? 'text-blue-500' : 'text-yellow-500'}`} />
                      <span className="text-xs font-medium text-gray-700 flex-1">{subcategory.name}</span>
                    </div>

                    {subcategory.isOpen && (
                      <div className="pl-6 pr-2 pb-1.5">
                        {/* Files list */}
                        {subcategory.files.map(file => (
                          <div 
                            key={file.name} 
                            className="flex items-center py-1.5 px-2 hover:bg-gray-50 rounded transition-colors"
                          >
                            <input
                              type="checkbox"
                              checked={file.visible}
                              onChange={() => toggleLayer(subcategory.id, file.name)}
                              className="form-checkbox h-3.5 w-3.5 text-blue-500 rounded border-gray-300 focus:ring-blue-500"
                            />
                            <FiFile className="w-3.5 h-3.5 mx-1.5 text-gray-400" />
                            <span className="text-sm text-gray-600 truncate">{file.name}</span>
                          </div>
                        ))}

                        {/* Upload button */}
                        <div 
                          className="flex items-center py-1.5 px-2 text-blue-600 cursor-pointer hover:bg-gray-50 rounded transition-colors"
                          onClick={() => fileInputRefs.current[subcategory.id]?.click()}
                        >
                          <FiUpload className="w-3.5 h-3.5 mr-1.5" />
                          <span className="text-sm">Carregar arquivo</span>
                          <input
                            type="file"
                            accept=".geojson"
                            ref={(el) => {
                              fileInputRefs.current[subcategory.id] = el;
                            }}
                            style={{ display: 'none' }}
                            onChange={(e) => handleFileUpload(e, subcategory.id)}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                ))
              ) : (
                // Render category files
                <>
                  {/* Files list */}
                  {category.files.map(file => (
                    <div 
                      key={file.name} 
                      className="flex items-center py-1.5 px-2 hover:bg-gray-50 rounded transition-colors"
                    >
                      <input
                        type="checkbox"
                        checked={file.visible}
                        onChange={() => toggleLayer(category.id, file.name)}
                        className="form-checkbox h-3.5 w-3.5 text-blue-500 rounded border-gray-300 focus:ring-blue-500"
                      />
                      <FiFile className="w-3.5 h-3.5 mx-1.5 text-gray-400" />
                      <span className="text-sm text-gray-600 truncate">{file.name}</span>
                    </div>
                  ))}

                  {/* Upload button */}
                  <div 
                    className="flex items-center py-1.5 px-2 text-blue-600 cursor-pointer hover:bg-gray-50 rounded transition-colors"
                    onClick={() => fileInputRefs.current[category.id]?.click()}
                  >
                    <FiUpload className="w-3.5 h-3.5 mr-1.5" />
                    <span className="text-sm">Carregar arquivo</span>
                    <input
                      type="file"
                      accept=".geojson"
                      ref={(el) => {
                        fileInputRefs.current[category.id] = el;
                      }}
                      style={{ display: 'none' }}
                      onChange={(e) => handleFileUpload(e, category.id)}
                    />
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};
