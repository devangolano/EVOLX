import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';
import toast from 'react-hot-toast';

export function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    const expirationTime = localStorage.getItem('authExpiration');
    
    if (token && expirationTime && new Date().getTime() < parseInt(expirationTime)) {
      navigate('/dashboard');
    }
  }, [navigate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (username === 'MarcusADM' && password === 'Marcus1234') {
      const expirationTime = new Date().getTime() + (24 * 60 * 60 * 1000); // 24 hours from now
      localStorage.setItem('authToken', 'user-authenticated');
      localStorage.setItem('authExpiration', expirationTime.toString());
      localStorage.setItem('isAuthenticated', 'true');
      toast.success('Usuário encontrado!');
      navigate('/dashboard');
    } else {
      toast.error('Usuário ou senha Errado!');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white">
      <form onSubmit={handleSubmit} className="w-full px-4 md:px-0 max-w-[375px] md:max-w-none md:w-[900px] md:grid md:grid-cols-2 md:gap-8">
        <div className="flex justify-center mb-12 md:mb-0 md:items-center">
          <img 
            src="https://e7.pngegg.com/pngimages/561/110/png-clipart-user-testing-logo-usertesting-logo-icons-logos-emojis-tech-companies.png" 
            alt="Logo" 
            className="w-48 md:w-96" 
          />
        </div>
        <div className="md:flex md:flex-col md:justify-center">
          <div className="mb-6">
            <label className="block text-gray-700 mb-2">Usuário</label>
            <input
              type="text"
              placeholder="Digite seu usuário"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none"
            />
          </div>
          <div className="mb-8">
            <label className="block text-gray-700 mb-2">Senha</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Digite sua senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showPassword ? (
                  <AiOutlineEyeInvisible size={20} />
                ) : (
                  <AiOutlineEye size={20} />
                )}
              </button>
            </div>
          </div>
          <button 
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded"
          >
            Confirmar
          </button>
        </div>
      </form>
    </div>
  );
}