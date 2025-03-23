import { useState } from 'react';
import { FaBars } from 'react-icons/fa';
import { AiOutlineDown, AiOutlineRight } from "react-icons/ai";
import { FiLogOut } from "react-icons/fi";  // Add this import
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [openMenus, setOpenMenus] = useState<number[]>([]);
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear session storage
    sessionStorage.clear();
    // Clear local storage if you're using it
    localStorage.clear();
    // Show logout notification
        toast.success('Sessão encerrada com sucesso!');
    // Redirect to login page
    navigate('/');
  };

  const menuItems = [
    { title: 'Configurações', path: '/dashboard/config' },
    { 
      title: 'Informações Básicas', 
      path: '/dashboard/info',
      submenu: [
        { title: 'Atividades Econômicas', path: '/dashboard/info/economic-activities' },
        { title: 'Bairros', path: '/dashboard/info/neighborhoods' },
        { title: 'Cadastro de Pessoas', path: '/dashboard/info/people-registration' },
        { title: 'Cadastro de Profissionais', path: '/dashboard/info/professional-registration' },
        { title: 'Classificação Pessoa Grupo', path: '/dashboard/info/person-group-classification' },
        { title: 'Classificação Pessoa', path: '/dashboard/info/person-classification' },
        { title: 'Grau Parentesco', path: '/dashboard/info/kinship-degree' },
        { title: 'Grupo de Curso', path: '/dashboard/info/course-group' },
        { title: 'Grupo Motivo Visita', path: '/dashboard/info/visit-reason-group' },
        { title: 'Motivo Visita', path: '/dashboard/info/visit-reason' },
        { title: 'Necessidade Especial', path: '/dashboard/info/special-needs' },
        { title: 'Setor', path: '/dashboard/info/sector' },
        { title: 'Situação Imóvel', path: '/dashboard/info/property-situation' },
        { title: 'Situação Prop. Rural', path: '/dashboard/info/rural-property-situation' },
        { title: 'Tipo Acesso Prop.', path: '/dashboard/info/property-access-type' },
        { title: 'Tipo Documento', path: '/dashboard/info/document-type' },
        { title: 'Tipo Responsável', path: '/dashboard/info/responsible-type' }
      ]
    },
    { 
      title: 'Escolar', 
      path: '/dashboard/school',
      submenu: [
        { title: 'Escolas', path: '/dashboard/school/schools' }
      ]
    },
    { 
      title: 'Censo Agropecuário', 
      path: '/dashboard/agricultural-census',
      submenu: [
        { title: 'Classificação', path: '/dashboard/agricultural-census/classification' },
        { title: 'Tipo Produto', path: '/dashboard/agricultural-census/product-type' },
        { title: 'Produtos', path: '/dashboard/agricultural-census/products' },
        { title: 'Unidades de Produção', path: '/dashboard/agricultural-census/production-units' }
      ]
    },
    { 
      title: 'Processo Administrativo', 
      path: '/dashboard/administrative',
      submenu: [
        { title: 'Processo Administrativo', path: '/dashboard/administrative/process' },
        { title: 'Tipo de Processo', path: '/dashboard/administrative/process-type' },
        { title: 'Status', path: '/dashboard/administrative/status' }
      ]
    },
    { 
      title: 'Propriedade', 
      path: '/dashboard/property',
      submenu: [
        { title: 'Distrito', path: '/dashboard/property/district' },
        { title: 'Forma de Obtenção', path: '/dashboard/property/acquisition-form' },
        { title: 'Litígio', path: '/dashboard/property/litigation' },
        { title: 'Localidade Rural', path: '/dashboard/property/rural-location' },
        { title: 'Piscina', path: '/dashboard/property/pool' },
        { title: 'Situação Propriedade', path: '/dashboard/property/property-situation' },
        { title: 'Situação Quadra', path: '/dashboard/property/block-situation' },
        { title: 'Tipo de Patrimônio', path: '/dashboard/property/heritage-type' },
        { title: 'Zoneamento', path: '/dashboard/property/zoning' },
        { title: 'Configuração', path: '/dashboard/property/configuration' }
      ]
    },
    { 
      title: 'Cadastro Imobiliário', 
      path: '/dashboard/real-estate',
      submenu: [
        { title: 'Tipo de Edificação', path: '/dashboard/real-estate/building-type' },
        { title: 'Configuração', path: '/dashboard/real-estate/configuration' }
      ]
    },
    { 
      title: 'Ponto Diverso', 
      path: '/dashboard/misc',
      submenu: [
        { title: 'Configuração', path: '/dashboard/misc/configuration' }
      ]
    },
    { 
      title: 'Cemitério', 
      path: '/dashboard/cemetery',
      submenu: [
        { title: 'Tipo de Túmulo', path: '/dashboard/cemetery/tomb-type' },
        { title: 'Configuração Edificação', path: '/dashboard/cemetery/building-configuration' },
        { title: 'Configuração Propriedade', path: '/dashboard/cemetery/property-configuration' }
      ]
    },
    { 
      title: 'Relatórios', 
      path: '/dashboard/reports',
      submenu: [
        { title: 'Bairros Consolidado', path: '/dashboard/reports/neighborhoods-consolidated' },
        { title: 'Distritos Consolidado', path: '/dashboard/reports/districts-consolidated' },
        { title: 'Cadastro Imobiliário', path: '/dashboard/reports/real-estate' },
        { title: 'Exportar dados XLS/CSV', path: '/dashboard/reports/export' }
      ]
    },
    { 
      title: 'GIS', 
      path: '/dashboard/gis',
      submenu: [
        { title: 'Mapa Inicial', path: '/dashboard/gis/initial-map' },
        { title: 'Camadas', path: '/dashboard/gis/layers' },
        { title: 'Ícone', path: '/dashboard/gis/icon' },
        { title: 'Marcador Imagem', path: '/dashboard/gis/image-marker' },
        { title: 'Tipo Ponto', path: '/dashboard/gis/point-type' }
      ]
    },
    { title: 'Sair', path: '/logout',
      icon: <FiLogOut size={18} className="mr-3 text-red-500" />
    }
  ];

  const toggleMenu = (index: number) => {
    setOpenMenus(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-30 w-72 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out flex flex-col shadow-xl`}>
        {/* Sidebar Header */}
        <div className="bg-[#c4c3c3] p-6 flex-shrink-0">
          <div className="flex items-center justify-between mb-6">
            <img src="/Logo.png" alt="GeoEfficace" className="w-48" />
            <button 
              onClick={() => setIsSidebarOpen(false)} 
              className="text-[#333333] font-bold hover:bg-[#0079b6] p-2 rounded-full transition-colors duration-200"
            >
              ✕
            </button>
          </div>
          <div className="text-white text-sm font-medium px-2 py-1 bg-[#797878] rounded">
            Marcus ADM
          </div>
        </div>

        {/* Sidebar Body */}
        <div className="bg-white flex-1 overflow-y-auto">
          <div className="flex flex-col h-full">
            <div className="flex-1 py-4">
              {menuItems.slice(0, -1).map((item, index) => (
                <div key={index} className="mb-1">
                  {index === 0 ? (
                    <p className="text-center font-semibold px-4 py-3 text-gray-700 border-b border-gray-100">
                      {item.title}
                    </p>
                  ) : (
                    <>
                      <div
                        className="flex items-center px-6 py-3 text-gray-700 hover:bg-blue-50 transition-colors duration-200 cursor-pointer"
                        onClick={() => toggleMenu(index)}
                      >
                        {openMenus.includes(index) ? (
                          <AiOutlineDown className="mr-3 text-[#0088cc]" size={16} />
                        ) : (
                          <AiOutlineRight className="mr-3 text-[#0088cc]" size={16} />
                        )}
                        <span className="font-medium">{item.title}</span>
                      </div>
                      {item.submenu && openMenus.includes(index) && (
                        <div className="pl-12 bg-gray-50">
                          {item.submenu.map((subItem, subIndex) => (
                            <Link
                              key={subIndex}
                              to={subItem.path}
                              className="block py-2.5 px-4 text-gray-600 hover:bg-blue-50 hover:text-[#0088cc] transition-colors duration-200 text-sm"
                            >
                              {subItem.title}
                            </Link>
                          ))}
                        </div>
                      )}
                    </>
                  )}
                </div>
              ))}
            </div>
            {/* Sair button */}
            <div className="mt-auto border-t border-gray-100">
              <button
                onClick={handleLogout}
                className="flex items-center px-6 py-4 w-full text-left text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors duration-200 font-medium"
              >
                {menuItems[menuItems.length - 1].icon}
                {menuItems[menuItems.length - 1].title}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1">
        {/* Header */}
        <header className="bg-[#c4c3c3] p-4 border-b-2 border-orange-400 text-white flex justify-between items-center">
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="text-2xl text-[#333333]"
          >
            <FaBars />
          </button>
          <img src="/Logo.png" alt="GeoEfficace" className="h-8" />
        </header>

        {/* Page Content */}
        <main className="">
          {children}
        </main>
      </div>

      {/* Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  );
}