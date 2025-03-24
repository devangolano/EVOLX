import { CardPage } from '../../../components/CardPage';
import { Loading } from '../../../components/Loading';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { DashboardLayout } from '../../../Layout/DashboardLayout';

export function CadastroPessoa() {
  const navigate = useNavigate();
  
  const formatCPF = (cpf: string) => {
    if (!cpf) return ""
    return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4")
  }

  const formatCNPJ = (cnpj: string) => {
    if (!cnpj) return ""
    return cnpj.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, "$1.$2.$3/$4-$5")
  }

     // Exemplo de dados para a tabela
     const columns = [
        { key: "sequencial", header: "Sequencial" },
        { key: "nome", header: "nome" },
        {
          key: "cpf",
          header: "CPF",
          render: (value: string) => formatCPF(value),
        },
        {
          key: "cnpj",
          header: "CNPJ",
          render: (value: string) => formatCNPJ(value),
        },
      ]

  const [isLoading, setIsLoading] = useState(true);

  const handleClose = () => {
    navigate('/dashboard');
  };

  useEffect(() => {
    // Simulate loading time
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const data = [
    { sequencial: "1", nome: "RAQUEL AVI DALPIAZ", cpf: "03887638921", cnpj: "" },
    { sequencial: "2", nome: "IPM SISTEMAS LTDA", cpf: "", cnpj: "01258027000141" },
  ]

  return (
    <DashboardLayout>
      {isLoading && (
        <div className="absolute inset-0 z-[9999] bg-white/80 backdrop-blur-sm flex items-center justify-center">
          <Loading />
        </div>
      )}
      <div className="min-h-screen bg-white p-4">
        <div className="max-w-5xl mx-auto">
          <CardPage
            title="Cadastro de Pessoas"
            columns={columns}
            data={data}
            showFilters={true}
            onClose={handleClose}
          />
        </div>
      </div>
    </DashboardLayout>
  );
}
