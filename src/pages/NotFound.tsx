import { useNavigate } from 'react-router-dom';

function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="text-center">
        <img src="/Logo.png" alt="EVOLX" className="h-20 mb-8 mx-auto" />
        <h1 className="text-6xl font-bold text-[#333333] mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-[#333333] mb-4">Página não encontrada</h2>
        <p className="text-gray-600 mb-8">
          A página que você está procurando ainda não existe, está em desenvolvimento.
        </p>
        <button
          onClick={() => navigate(-1)}
          className="bg-[#FF6B00] text-white px-6 py-2 rounded-md hover:bg-[#e66000] transition-colors duration-200 font-medium"
        >
          Voltar
        </button>
      </div>
    </div>
  );
}

export default NotFound;
  