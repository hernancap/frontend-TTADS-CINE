import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/PeliculasHome/Home';         
import PeliculaAdmin from './components/Admin/PeliculaAdmin'; 
import ActorAdmin from './components/Admin/ActorAdmin'; 
import SalaAdmin from './components/Admin/SalaAdmin';
import FuncionAdmin from './components/Admin/FuncionAdmin';
import Login from './components/Login';          
import UsuarioAdmin from './components/Admin/UsuarioAdmin';
import MyProfile from './components/Perfil/MisEntradas'; 
import MisCupones from './components/Perfil/MisCupones';
import Favoritos from './components/Perfil/Favoritos';
import { AuthProvider } from './context/authProvider';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';
import Menu from './components/Menu';
import MovieDetail from './components/PeliculasHome/MovieDetail';
import PurchaseForm from './components/CompraEntrada/PurchaseForm';
import Register from './components/Register';
import Pago from './components/CompraEntrada/Pago.tsx';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Menu />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/pelicula/:id" element={<MovieDetail />} />
          <Route path="/comprar/:id" element={<PurchaseForm />} />
          <Route path="/register" element={<Register />} />   
          <Route path="/pago" element={<Pago />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/perfil/entradas" element={<MyProfile />} />
            <Route path="/perfil/cupones" element={<MisCupones />} />
            <Route path="/perfil/favoritos" element={<Favoritos />} />
            <Route element={<AdminRoute />}>
              <Route path="/admin/peliculas" element={<PeliculaAdmin />} />
              <Route path="/admin/actors" element={<ActorAdmin />} />
              <Route path="/admin/salas" element={<SalaAdmin />} />
              <Route path="/admin/funciones" element={<FuncionAdmin />} />
              <Route path="/admin/usuarios" element={<UsuarioAdmin />} />
            </Route>
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
