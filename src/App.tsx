
import { FC } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import AppRoutes from './Routes/AppRoutes';

const App: FC = () => {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50">
        <AppRoutes />
        <Toaster 
          position="top-right"
          toastOptions={{
            duration: 3000,
            success: {
              style: {
                background: '#4aed88',
                color: '#fff',
              },
              iconTheme: {
                primary: '#fff',
                secondary: '#4aed88'
              },
            },
            error: {
              style: {
                background: '#E74C3C',
                color: '#fff',
              },
              iconTheme: {
                primary: '#fff',
                secondary: '#E74C3C'
              },
            },
          }}
        />
      </div>
    </BrowserRouter>
  );
};

export default App;
