import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import HomeIcon from '../assets/logo-cine.png';

const Menu = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login'); 
  };

  return (
    <nav className="relative z-50 flex justify-between items-center p-1 bg-[#333] text-white">
      <div className="flex justify-between items-center p-2 bg-[#333] text-white">
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
    </nav>
  );
};

export default Menu;
