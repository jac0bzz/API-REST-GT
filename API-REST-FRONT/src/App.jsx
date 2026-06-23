import { useState } from 'react';
import { Building2, LogOut } from 'lucide-react';
import './index.css';
import Login from './components/Login';
import TicketList from './components/TicketList';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('access_token'));

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    setIsAuthenticated(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4 md:p-8 font-sans text-slate-800">
      <div className="max-w-6xl mx-auto">
        
        <header className="flex justify-between items-center mb-8 bg-white/80 backdrop-blur-md p-5 rounded-2xl shadow-sm border border-white/50">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-600 rounded-lg shadow-md shadow-blue-200">
              <Building2 className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-extrabold text-slate-800 tracking-tight">
              Help Desk <span className="text-blue-600">Corporativo</span>
            </h1>
          </div>
          
          {isAuthenticated && (
            <button 
              onClick={handleLogout} 
              className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 hover:bg-red-50 hover:text-red-600 hover:border-red-200 text-slate-600 font-semibold rounded-xl transition duration-200"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Cerrar Sesión</span>
            </button>
          )}
        </header>
        
        <main>
          {isAuthenticated ? (
            <TicketList />
          ) : (
            <Login onLoginSuccess={() => setIsAuthenticated(true)} />
          )}
        </main>
        
      </div>
    </div>
  );
}

export default App;