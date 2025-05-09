import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import HomeIcon from '../assets/logo-cine.png';
import { useState } from 'react';
import { FaBars, FaTimes } from 'react-icons/fa';

const Menu = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isReportsOpen, setIsReportsOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login'); 
  };

  return (
    <nav className="relative z-50 bg-[#333] text-white">
      <div className="hidden md:flex justify-between items-center p-2">
        <div className="flex items-center gap-4">
        <Link to="/" className="px-4 py-2 rounded hover:bg-white/10 transition-colors">
        <img 
          src={HomeIcon} 
          alt="Home" 
          className="w-8 h-8"
        />
        </Link>
        {user && (
          <div className="relative group">
            <span className="px-4 py-2 rounded hover:bg-white/10 cursor-pointer">Mi Perfil</span>
            <div className="absolute top-full left-0 hidden group-hover:block mt-1 w-48 bg-[#444] shadow-md rounded">
              <Link to="/perfil/entradas" className="block px-4 py-2 text-white hover:bg-[#555] transition-colors">Entradas</Link>
              <Link to="/perfil/cupones" className="block px-4 py-2 text-white hover:bg-[#555] transition-colors">Mis Cupones</Link>
              <Link to="/perfil/favoritos" className="block px-4 py-2 text-white hover:bg-[#555] transition-colors">Favoritos</Link>
            </div>
          </div>
        )}
        {user && user.tipo === 'admin' && (
        <div className="flex gap-4">
          <div className="relative group">
            <span className="px-4 py-2 rounded hover:bg-white/10 cursor-pointer">Admin</span>
            <div className="absolute top-full left-0 hidden group-hover:block mt-1 w-48 bg-[#444] shadow-md rounded">
              <Link to="/admin/peliculas" className="block px-4 py-2 text-white hover:bg-[#555] transition-colors">Administrar Películas</Link>
              <Link to="/admin/actors" className="block px-4 py-2 text-white hover:bg-[#555] transition-colors">Administrar Actores</Link>
              <Link to="/admin/salas" className="block px-4 py-2 text-white hover:bg-[#555] transition-colors">Administrar Salas</Link>
              <Link to="/admin/funciones" className="block px-4 py-2 text-white hover:bg-[#555] transition-colors">Administrar Funciones</Link>
              <Link to="/admin/usuarios" className="block px-4 py-2 text-white hover:bg-[#555] transition-colors">Administrar Usuarios</Link>              
            </div>
          </div>
          <div className="relative group">
            <span className="px-4 py-2 rounded hover:bg-white/10 cursor-pointer">Reportes</span>
            <div className="absolute top-full left-0 hidden group-hover:block mt-1 w-48 bg-[#444] shadow-md rounded">
              <Link to="/reportes/entradas" className="block px-4 py-2 text-white hover:bg-[#555] transition-colors">Reporte de Entradas</Link>
              <Link to="/reportes/favoritos" className="block px-4 py-2 text-white hover:bg-[#555] transition-colors">Reporte de Favoritos</Link>
            </div>
          </div>
        </div>
      )}
      </div>
      <div className="flex items-center gap-4">
        {user ? (
          <div className="flex items-center gap-4">
            <span className="text-gray-300 text-base">Bienvenido, {user.nombre}</span>
            <button 
              onClick={handleLogout} 
              className="px-4 py-2 bg-white rounded hover:bg-[#999] transition-colors text-black"
            >
              Cerrar sesión
            </button>
          </div>
        ) : (
          <Link to="/login" className="block px-4 py-2 text-white hover:bg-[#555] transition-colors">Login</Link>
        )}
      </div>
      </div>

        <div className="md:hidden flex justify-between items-center p-2">
        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2"
        >
          <FaBars className="h-6 w-6 text-white" />
        </button>
        {isMobileMenuOpen && (
          <div className="fixed inset-0 bg-[#333] z-50 p-4">
            <div className="flex justify-end">
              <button 
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-white"
              >
                <FaTimes className="h-6 w-6" />
              </button>
            </div>
            <div className="flex flex-col space-y-4 mt-8">
              <Link 
                to="/" 
                className="flex items-center p-2 hover:bg-[#444] rounded"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <img 
                  src={HomeIcon} 
                  alt="Home" 
                  className="w-8 h-8"
                />
              </Link>
              {user && (
                <>
                  <div>
                    <button 
                      onClick={() => setIsProfileOpen(!isProfileOpen)}
                      className="w-full text-left text-white text-lg p-2 hover:bg-[#444] rounded"
                    >
                      Mi Perfil ▼
                    </button>
                    {isProfileOpen && (
                      <div className="ml-4 space-y-2 mt-2">
                        <Link 
                          to="/perfil/entradas" 
                          className="block text-white p-2 hover:bg-[#555] rounded"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          Entradas
                        </Link>
                        <Link 
                          to="/perfil/cupones" 
                          className="block text-white p-2 hover:bg-[#555] rounded"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          Mis Cupones
                        </Link>
                        <Link 
                          to="/perfil/favoritos" 
                          className="block text-white p-2 hover:bg-[#555] rounded"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          Favoritos
                        </Link>
                      </div>
                    )}
                  </div>
                  {user.tipo === 'admin' && (
                    <>
                      <div>
                        <button 
                          onClick={() => setIsAdminOpen(!isAdminOpen)}
                          className="w-full text-left text-white text-lg p-2 hover:bg-[#444] rounded"
                        >
                          Admin ▼
                        </button>
                        {isAdminOpen && (
                          <div className="ml-4 space-y-2 mt-2">
                            <Link 
                              to="/admin/peliculas" 
                              className="block text-white p-2 hover:bg-[#555] rounded"
                              onClick={() => setIsMobileMenuOpen(false)}
                            >
                              Películas
                            </Link>
                            <Link 
                              to="/admin/actors" 
                              className="block text-white p-2 hover:bg-[#555] rounded"
                              onClick={() => setIsMobileMenuOpen(false)}
                            >
                              Actores
                            </Link>
                            <Link 
                              to="/admin/salas" 
                              className="block text-white p-2 hover:bg-[#555] rounded"
                              onClick={() => setIsMobileMenuOpen(false)}
                            >
                              Salas
                            </Link>
                            <Link 
                              to="/admin/funciones" 
                              className="block text-white p-2 hover:bg-[#555] rounded"
                              onClick={() => setIsMobileMenuOpen(false)}
                            >
                              Funciones
                            </Link>
                            <Link 
                              to="/admin/usuarios" 
                              className="block text-white p-2 hover:bg-[#555] rounded"
                              onClick={() => setIsMobileMenuOpen(false)}
                            >
                              Usuarios
                            </Link>
                          </div>
                        )}
                      </div>
                      <div>
                        <button 
                          onClick={() => setIsReportsOpen(!isReportsOpen)}
                          className="w-full text-left text-white text-lg p-2 hover:bg-[#444] rounded"
                        >
                          Reportes ▼
                        </button>
                        {isReportsOpen && (
                          <div className="ml-4 space-y-2 mt-2">
                            <Link 
                              to="/reportes/entradas" 
                              className="block text-white p-2 hover:bg-[#555] rounded"
                              onClick={() => setIsMobileMenuOpen(false)}
                            >
                              Entradas
                            </Link>
                            <Link 
                              to="/reportes/favoritos" 
                              className="block text-white p-2 hover:bg-[#555] rounded"
                              onClick={() => setIsMobileMenuOpen(false)}
                            >
                              Favoritos
                            </Link>
                          </div>
                        )}
                      </div>
                    </>
                  )}
                  <div className="mt-4 pt-4 border-t border-[#555]">
                    <span className="text-gray-300">Bienvenido, {user.nombre}</span>
                    <button 
                      onClick={handleLogout} 
                      className="w-full mt-2 text-left text-white bg-red-600 p-2 rounded hover:bg-red-700"
                    >
                      Cerrar sesión
                    </button>
                  </div>
                </>
              )}
              {!user && (
                <Link 
                  to="/login" 
                  className="text-white text-lg p-2 hover:bg-[#444] rounded"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Login
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Menu;
