"use client"

import { useState, useEffect  } from "react"
import { FaChevronDown, FaChevronUp } from "react-icons/fa"
import { FiX } from "react-icons/fi"
import { BiChevronsLeft, BiChevronLeft, BiChevronRight, BiChevronsRight } from "react-icons/bi"
import { FiFilter } from "react-icons/fi"

interface CardPageProps {
  title: string
  columns: {
    key: string
    header: string
  }[]
  data: any[]
  showFilters?: boolean
  itemsPerPage?: number
  onClose?: () => void
}

export function CardPage({ title, columns, data, showFilters = true, itemsPerPage = 10, onClose }: CardPageProps) {
  const [currentPage, setCurrentPage] = useState(1)
  const [filtersVisible, setFiltersVisible] = useState(false)
  const [filterType, setFilterType] = useState("nome")
  const [filterValue, setFilterValue] = useState("")
  const [filteredData, setFilteredData] = useState(data)

  // Reset to first page when filter changes
useEffect(() => {
    setCurrentPage(1);
  }, [filteredData]);

  const handleFilter = () => {
    if (!filterValue.trim()) {
      setFilteredData(data);
      return;
    }

    const filtered = data.filter(item => {
      const value = item[filterType]?.toString().toLowerCase() || '';
      return value.includes(filterValue.toLowerCase());
    });

    setFilteredData(filtered);
  };

  const totalPages = Math.ceil(filteredData.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentData = filteredData.slice(startIndex, endIndex)

  return (
    <div className="w-full flex flex-col border border-gray-200 rounded-lg overflow-hidden">
      {/* Title and Close Button */}
      <div className="bg-white text-black p-4 flex justify-between items-center">
        <h2 className="text-xl font-medium">{title}</h2>
        {onClose && (
          <button onClick={onClose} className="text-red-500 hover:text-red-700">
            <FiX size={24} />
          </button>
        )}
      </div>

      {/* Update the filter section */}
      {showFilters && (
        <div className="bg-gray-100 p-4 border-y border-gray-200">
          <button
            className="text-orange-600 hover:text-orange-700 flex items-center gap-2 font-medium"
            onClick={() => setFiltersVisible(!filtersVisible)}
          >
            <span className="text-orange-500">EXIBIR FILTROS</span>
            {filtersVisible ? (
              <FaChevronUp size={14} className="text-orange-500" />
            ) : (
              <FaChevronDown size={14} className="text-orange-500" />
            )}
          </button>

          {filtersVisible && (
            <div className="mt-4">
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Tipo</label>
                <div className="relative">
                  <select
                    className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm rounded-md appearance-none"
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                  >
                    {columns.map(column => (
                      <option key={column.key} value={column.key}>
                        {column.header}
                      </option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                    <FaChevronDown size={12} className="text-gray-400" />
                  </div>
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Pesquisar</label>
                <input
                  type="text"
                  value={filterValue}
                  onChange={(e) => setFilterValue(e.target.value)}
                  placeholder="Pesquisar"
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                />
              </div>

              <button 
                onClick={handleFilter}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-orange-500 hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
              >
                <FiFilter className="mr-2 h-5 w-5" />
                Filtrar
              </button>
            </div>
          )}
        </div>
      )}

      {/* Update table to use filteredData */}
      <div className="overflow-x-auto flex-grow">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-100">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider"
                >
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {currentData.length > 0 ? (
              currentData.map((row, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  {columns.map((column) => (
                    <td key={column.key} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {row[column.key]}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length} className="px-6 py-4 text-center text-sm text-gray-500">
                  Nenhum registro encontrado
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Update pagination to use filteredData.length */}
      <div className="bg-gray-100 p-3 flex items-center justify-between border-t border-gray-200">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentPage(1)}
            disabled={currentPage === 1}
            className="p-1 disabled:opacity-50 text-gray-700"
            aria-label="Primeira página"
          >
            <BiChevronsLeft size={20} />
          </button>
          <button
            onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
            className="p-1 disabled:opacity-50 text-gray-700"
            aria-label="Página anterior"
          >
            <BiChevronLeft size={20} />
          </button>
          <span className="text-sm text-gray-700 mx-2">
            {currentPage}/{totalPages || 1}
          </span>
          <button
            onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
            disabled={currentPage === totalPages || totalPages === 0}
            className="p-1 disabled:opacity-50 text-gray-700"
            aria-label="Próxima página"
          >
            <BiChevronRight size={20} />
          </button>
          <button
            onClick={() => setCurrentPage(totalPages)}
            disabled={currentPage === totalPages || totalPages === 0}
            className="p-1 disabled:opacity-50 text-gray-700"
            aria-label="Última página"
          >
            <BiChevronsRight size={20} />
          </button>
        </div>
        <div className="text-sm text-gray-700">Número de Registros: {filteredData.length}</div>
      </div>
    </div>
  )
}

