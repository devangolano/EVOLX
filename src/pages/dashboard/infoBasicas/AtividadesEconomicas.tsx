import { CardPage } from '../../../components/CardPage';
import { Loading } from '../../../components/Loading';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { DashboardLayout } from '../../../Layout/DashboardLayout';

export function AtividadesEconomicas() {
  const navigate = useNavigate();
  const columns = [
    { key: 'sequential', header: 'Sequencial' },
    { key: 'nome', header: 'Nome' },
  ];

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
    { sequential: '1', nome: 'ALBERTO JOSÉ' },
  ];

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
            title="Atividades Econômicas"
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
