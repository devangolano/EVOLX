import React, { useRef, useState, useCallback } from 'react';
import { FiChevronDown, FiChevronRight, FiFile, FiUpload, FiFolder, FiEdit2, FiTrash2, FiMapPin, FiHome, FiEye, FiMail, FiImage, FiDownload } from 'react-icons/fi';
import { IoMdClose } from 'react-icons/io';
import L from 'leaflet';
import 'leaflet.markercluster/dist/leaflet.markercluster';
import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';
import proj4 from 'proj4';
import { Loading } from '../Loading';

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

interface LoteInfo {
  properties: any;
  geometry?: any;
  category?: string;
  fileName?: string;
}

interface InfoSidebarProps {
  lote: LoteInfo | null;
  onClose: () => void;
  activeCategory?: Category | null;
  activeFile?: UploadedFile | null;
}

const InfoSidebar: React.FC<InfoSidebarProps> = ({ lote, onClose, activeCategory, activeFile }) => {
  const imageInputRef = useRef<HTMLInputElement>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [isAtributosOpen, setIsAtributosOpen] = useState(false);

  if (!lote) return null;

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const actionButtons = [
    { icon: FiEdit2, label: 'Editar' },
    { icon: FiTrash2, label: 'Remover' },
    { icon: FiMapPin, label: 'Endereço' },
    { icon: FiHome, label: 'Propriedade' }
  ];

  const secondRowButtons = [
    { icon: FiEye, label: 'Vista' },
    { icon: FiMail, label: 'Processo\nAdministrativo' },
    { icon: FiImage, label: 'Imagens' },
    { icon: FiDownload, label: 'Exportar' }
  ];

  return (
    <div className="fixed top-0 right-0 w-96 h-full bg-white shadow-lg overflow-y-auto" style={{ zIndex: 1500 }}>
      {/* Botão de fechar */}
      <div className="absolute top-2 right-2 z-50">
        <button 
          onClick={onClose}
          className="p-1 hover:bg-gray-100 rounded-full transition-colors"
          aria-label="Fechar"
        >
          <IoMdClose size={24} className="text-gray-600" />
        </button>
      </div>

      <div className="p-4 space-y-4 mt-8">
        {/* Área de imagem */}
        <div 
          className="w-full h-64 bg-gray-100 rounded-lg flex items-center justify-center cursor-pointer relative overflow-hidden"
          onClick={() => imageInputRef.current?.click()}
        >
          {previewImage ? (
            <img src={previewImage} alt="Preview" className="w-full h-full object-cover" />
          ) : (
            <div className="text-center">
              <div className="text-gray-400 mb-2">
                <FiImage size={48} className="mx-auto" />
              </div>
              <span className="text-gray-500">Sem imagem disponível</span>
            </div>
          )}
          <input
            type="file"
            ref={imageInputRef}
            className="hidden"
            accept="image/*"
            onChange={handleImageUpload}
          />
        </div>

        {/* Botões de ação - primeira linha */}
        <div className="grid grid-cols-4 gap-2">
          {actionButtons.map((button) => (
            <button
              key={button.label}
              className="flex flex-col items-center justify-center p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              <button.icon size={24} />
              <span className="text-xs mt-1 text-center whitespace-pre-line">{button.label}</span>
            </button>
          ))}
        </div>

        {/* Botões de ação - segunda linha */}
        <div className="grid grid-cols-4 gap-2">
          {secondRowButtons.map((button) => (
            <button
              key={button.label}
              className="flex flex-col items-center justify-center p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              <button.icon size={24} />
              <span className="text-xs mt-1 text-center whitespace-pre-line">{button.label}</span>
            </button>
          ))}
        </div>

        {/* Seções expansíveis */}
        <div className="space-y-1">
          <div className="w-full">
            <button 
              className="w-full text-left py-2 px-3 bg-blue-500 text-white rounded flex items-center justify-between"
              onClick={() => setIsAtributosOpen(!isAtributosOpen)}
            >
              <span>Atributos</span>
              <FiChevronRight className={`transform transition-transform ${isAtributosOpen ? 'rotate-90' : ''}`} />
            </button>
            {isAtributosOpen && (
              <div className="mt-1 bg-white rounded p-2">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-0.5 px-1 text-gray-600">Atributo</th>
                      <th className="text-left py-0.5 px-1 text-gray-600">Valor</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b">
                      <td className="py-0.5 px-1 text-gray-700">Nome da Camada Geográfica</td>
                      <td className="py-0.5 px-1 text-gray-900">{activeFile?.name || '-'}</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-0.5 px-1 text-gray-700">Tipo da Camada Geográfica</td>
                      <td className="py-0.5 px-1 text-gray-900">{activeCategory?.name?.toUpperCase() || '-'}</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-0.5 px-1 text-gray-700">Latitude</td>
                      <td className="py-0.5 px-1 text-gray-900">
                        {(() => {
                          const lat = lote.geometry?.coordinates?.[1];
                          if (!lat) return '-';
                          try {
                            return Number(lat).toFixed(6) + '°';
                          } catch {
                            return '-';
                          }
                        })()}
                      </td>
                    </tr>
                    <tr className="border-b last:border-0">
                      <td className="py-0.5 px-1 text-gray-700">Longitude</td>
                      <td className="py-0.5 px-1 text-gray-900">
                        {(() => {
                          const lng = lote.geometry?.coordinates?.[0];
                          if (!lng) return '-';
                          try {
                            return Number(lng).toFixed(6) + '°';
                          } catch {
                            return '-';
                          }
                        })()}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}
          </div>

          <button className="w-full text-left py-2 px-3 bg-blue-500 text-white rounded flex items-center justify-between">
            <span>Cadastro Técnico</span>
            <FiChevronRight />
          </button>

          <button className="w-full text-left py-2 px-3 bg-blue-500 text-white rounded flex items-center justify-between">
            <span>Edificações</span>
            <FiChevronRight />
          </button>

          <button className="w-full text-left py-2 px-3 bg-blue-500 text-white rounded flex items-center justify-between">
            <span>Processos Administrativos</span>
            <FiChevronRight />
          </button>

          <button className="w-full text-left py-2 px-3 bg-blue-500 text-white rounded flex items-center justify-between">
            <span>Propriedades</span>
            <FiChevronRight />
          </button>

          <button className="w-full text-left py-2 px-3 bg-blue-500 text-white rounded flex items-center justify-between">
            <span>Proprietários</span>
            <FiChevronRight />
          </button>
        </div>
      </div>
    </div>
  );
};

const CATEGORIES: Category[] = [
  {
    id: 'iturama-mg',
    name: 'ITURAMA-MG',
    isOpen: false,
    files: [],
    subcategories: [
      {
        id: 'infraestrutura-basica',
        name: 'INFRAESTRUTURA BÁSICA',
        isOpen: false,
        files: []
      },
      {
        id: 'setores-divisoes',
        name: 'SETORES E DIVISÕES',
        isOpen: false,
        files: []
      },
      {
        id: 'transportes',
        name: 'TRANSPORTES',
        isOpen: false,
        files: []
      },
      {
        id: 'educacao',
        name: 'EDUCAÇÃO',
        isOpen: false,
        files: []
      },
      {
        id: 'saude',
        name: 'SAÚDE',
        isOpen: false,
        files: []
      },
      {
        id: 'seguranca',
        name: 'SEGURANÇA',
        isOpen: false,
        files: []
      },
      {
        id: 'comercio-servicos',
        name: 'COMÉRCIO E SERVIÇOS',
        isOpen: false,
        files: []
      },
      {
        id: 'alimentacao-lazer',
        name: 'ALIMENTAÇÃO E LAZER',
        isOpen: false,
        files: []
      },
      {
        id: 'areas-verdes',
        name: 'ÁREAS VERDES',
        isOpen: false,
        files: []
      },
      {
        id: 'turismo-cultura',
        name: 'TURISMO E CULTURA',
        isOpen: false,
        files: []
      },
      {
        id: 'industrias-agricultura',
        name: 'INDÚSTRIAS E AGRICULTURA',
        isOpen: false,
        files: []
      },
      {
        id: 'habitacao',
        name: 'HABITAÇÃO',
        isOpen: false,
        files: []
      },
      {
        id: 'saneamento-energia',
        name: 'SANEAMENTO E ENERGIA',
        isOpen: false,
        files: []
      },
      {
        id: 'comunicacoes',
        name: 'COMUNICAÇÕES',
        isOpen: false,
        files: []
      },
      {
        id: 'eventos-feiras',
        name: 'EVENTOS E FEIRAS',
        isOpen: false,
        files: []
      },
      {
        id: 'obras-construcoes',
        name: 'OBRAS E CONSTRUÇÕES',
        isOpen: false,
        files: []
      },
      {
        id: 'meio-ambiente',
        name: 'MEIO AMBIENTE',
        isOpen: false,
        files: []
      },
      {
        id: 'iluminacao-publica',
        name: 'ILUMINAÇÃO PÚBLICA',
        isOpen: false,
        files: []
      },
      {
        id: 'uso-solo-urbano',
        name: 'USO DO SOLO URBANO',
        isOpen: false,
        files: []
      }
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
    'infraestrutura-basica': '#74bf9d', // cinza
    'setores-divisoes': '#FFD700', // amarelo dourado
    'transportes': '#FF4500', // laranja avermelhado
    'educacao': '#4169E1', // azul royal
    'saude': '#FF0000', // vermelho
    'seguranca': '#000080', // azul marinho
    'comercio-servicos': '#32CD32', // verde lima
    'alimentacao-lazer': '#FF1493', // rosa profundo
    'areas-verdes': '#228B22', // verde floresta
    'turismo-cultura': '#8B4513', // marrom sela
    'industrias-agricultura': '#A0522D', // siena
    'habitacao': '#FF8C00', // laranja escuro
    'saneamento-energia': '#4682B4', // azul aço
    'comunicacoes': '#9370DB', // roxo médio
    'eventos-feiras': '#FF69B4', // rosa quente
    'obras-construcoes': '#DAA520', // goldenrod
    'meio-ambiente': '#006400', // verde escuro
    'iluminacao-publica': '#FFD700', // amarelo
    'uso-solo-urbano': '#8B008B', // magenta escuro
  };
  return colorMap[categoryId] || '#3388ff'; // azul como cor padrão
};

export const LayersSidebar: React.FC<LayersSidebarProps> = ({ isOpen, map }) => {
  const fileInputRefs = useRef<{ [key: string]: HTMLInputElement | null }>({});
  const [categories, setCategories] = useState<Category[]>(CATEGORIES);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedLote, setSelectedLote] = useState<LoteInfo | null>(null);
  const [activeCategory, setActiveCategory] = useState<Category | null>(null);
  const [activeFile, setActiveFile] = useState<UploadedFile | null>(null);

  if (!isOpen) return null;

  const handleFileUpload = useCallback(async (event: React.ChangeEvent<HTMLInputElement>, categoryId: string) => {
    const file = event.target.files?.[0];
    if (!file || !map) return;

    try {
      setIsLoading(true);
      const reader = new FileReader();

      reader.onload = async (e) => {
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
              // Para polígonos, adicionar um marcador no centroide
              const layer = L.geoJSON(feature);
              const center = layer.getBounds().getCenter();
              
              // Criar um marcador personalizado para cada lote
              const marker = L.marker([center.lat, center.lng], {
                icon: L.divIcon({
                  html: `
                    <div class="flex items-center justify-center" style="width: 30px; height: 30px;">
                      <div class="w-4 h-4 bg-blue-600 rounded-full shadow-lg border-2 border-white transform hover:scale-110 transition-transform duration-200" 
                           style="box-shadow: 0 0 10px rgba(0,0,0,0.2);">
                      </div>
                    </div>`,
                  className: 'custom-marker-icon',
                  iconSize: [30, 30],
                  iconAnchor: [15, 15]
                })
              });

              // Adicionar evento de clique para abrir o sidebar
              marker.on('click', () => {
                handleMarkerClick({
                  properties: feature.properties,
                  geometry: feature.geometry,
                  category: categoryId,
                  fileName: fileName
                });
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

        } catch (error) {
          console.error('Error processing file:', error);
        } finally {
          setIsLoading(false);
          event.target.value = '';
        }
      };
      reader.readAsText(file);

    } catch (error) {
      console.error('Error reading file:', error);
      setIsLoading(false);
    }
  }, [map]);

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

  const handleMarkerClick = (lote: LoteInfo) => {
    setSelectedLote(lote);
    const foundCategory = categories.find(category => category.id === lote.category) || null;
    setActiveCategory(foundCategory);
    
    const foundFile = foundCategory?.files.find(file => file.name === lote.fileName) || null;
    setActiveFile(foundFile);
  };

  return (
    <>
      <div className="w-80 h-full bg-white shadow-lg overflow-y-auto flex-shrink-0">
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
      {isLoading && (
        <div className="fixed inset-0" style={{ zIndex: 9999 }}>
          <Loading />
        </div>
      )}
      {selectedLote && (
        <InfoSidebar 
          lote={selectedLote} 
          onClose={() => setSelectedLote(null)} 
          activeCategory={activeCategory} 
          activeFile={activeFile} 
        />
      )}
    </>
  );
};
