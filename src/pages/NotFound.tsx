import { useNavigate } from 'react-router-dom';

function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center h-full overflow-hidden bg-gray-100">
      <div className="text-center px-4">
        <img src="/Logo.png" alt="EVOLX" className="h-16 mb-6 mx-auto" />
        <h1 className="text-5xl font-bold text-[#333333] mb-3">404</h1>
        <h2 className="text-xl font-semibold text-[#333333] mb-3">Página não encontrada</h2>
        <p className="text-gray-600 mb-6">
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
  