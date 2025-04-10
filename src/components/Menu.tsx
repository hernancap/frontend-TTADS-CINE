import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import './Menu.css';

const Menu = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login'); 
  };

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <Link to="/" className="nav-button">Home</Link>
        {user && (
          <div className="dropdown">
            <span className="nav-button dropdown-title">Mi Perfil</span>
            <div className="dropdown-content">
              <Link to="/perfil/entradas" className="nav-button">Entradas</Link>
              <Link to="/perfil/cupones" className="nav-button">Mis Cupones</Link>
              <Link to="/perfil/favoritos" className="nav-button">Favoritos</Link>
            </div>
          </div>
        )}
        {user && user.tipo === 'admin' && (
        <div className="admin-dropdowns">
          <div className="dropdown">
            <span className="nav-button dropdown-title">Admin</span>
            <div className="dropdown-content">
              <Link to="/admin/peliculas" className="nav-button">Administrar Películas</Link>
              <Link to="/admin/actors" className="nav-button">Administrar Actores</Link>
              <Link to="/admin/salas" className="nav-button">Administrar Salas</Link>
              <Link to="/admin/funciones" className="nav-button">Administrar Funciones</Link>
              <Link to="/admin/usuarios" className="nav-button">Administrar Usuarios</Link>              
            </div>
          </div>
          <div className="dropdown">
            <span className="nav-button dropdown-title">Reportes</span>
            <div className="dropdown-content">
              <Link to="/reportes/entradas" className="nav-button">Reporte de Entradas</Link>
              <Link to="/reportes/favoritos" className="nav-button">Reporte de Favoritos</Link>
            </div>
          </div>
        </div>
      )}
      </div>
      <div className="navbar-right">
        {user ? (
          <div className="user-menu">
            <span className="welcome-message">Bienvenido, {user.nombre}</span>
            <button 
              onClick={handleLogout} 
              className="nav-button logout-button"
            >
              Cerrar sesión
            </button>
          </div>
        ) : (
          <Link to="/login" className="nav-button">Login</Link>
        )}
      </div>
    </nav>
  );
};

export default Menu;
