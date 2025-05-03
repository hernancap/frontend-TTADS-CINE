import { BrowserRouter, Routes, Route } from 'react-router-dom';
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
import EntradaQR from './components/Perfil/EntradaQR.tsx';
import { AuthProvider } from './context/authProvider';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';
import Menu from './components/Menu';
import MovieDetail from './components/PeliculasHome/MovieDetail';
import PurchaseForm from './components/CompraEntrada/PurchaseForm';
import Register from './components/Register';
import Pago from './components/CompraEntrada/Pago.tsx';
import './App.css';
import PagoExitoso from './components/CompraEntrada/PagoExitoso.tsx';
import PagoFallido from './components/CompraEntrada/PagoFallido.tsx';
import ReporteEntradas from './components/Reportes/ReporteEntradas.tsx';
import ReporteFavoritos from './components/Reportes/ReporteFavoritos.tsx';
import PeliculaForm from './components/Admin/PeliculaForm.tsx';
import FuncionForm from './components/Admin/FuncionForm.tsx';
import SalaForm from './components/Admin/SalaForm.tsx';
import UsuarioForm from './components/Admin/UsuarioForm.tsx';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Menu />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/pelicula/:id" element={<MovieDetail />} />
          <Route path="/register" element={<Register />} />       
          <Route element={<ProtectedRoute />}>
            <Route path="/perfil/entradas" element={<MyProfile />} />
            <Route path="/perfil/cupones" element={<MisCupones />} />
            <Route path="/perfil/favoritos" element={<Favoritos />} />
            <Route path="/perfil/entrada/:entradaId" element={<EntradaQR />} />
            <Route path="/pago" element={<Pago />} />
            <Route path="/pago-exitoso" element={<PagoExitoso />} />
            <Route path="/pago-fallido" element={<PagoFallido />} />
            <Route path="/comprar/:id" element={<PurchaseForm />} />
            <Route element={<AdminRoute />}>
              <Route path="/admin/peliculas" element={<PeliculaAdmin />} />
              <Route path="/admin/actors" element={<ActorAdmin />} />
              <Route path="/admin/salas" element={<SalaAdmin />} />
              <Route path="/admin/funciones" element={<FuncionAdmin />} />
              <Route path="/admin/usuarios" element={<UsuarioAdmin />} />
              <Route path="/reportes/entradas" element={<ReporteEntradas />} />
              <Route path="/reportes/favoritos" element={<ReporteFavoritos />} />
              <Route path="/admin/peliculas/nueva" element={<PeliculaForm />} />
              <Route path="/admin/peliculas/:id/editar" element={<PeliculaForm />} />
              <Route path="/admin/funciones/nueva" element={<FuncionForm />} />
              <Route path="/admin/salas/nueva" element={<SalaForm />} />
              <Route path="/admin/salas/:id/editar" element={<SalaForm />} />
              <Route path="/admin/usuarios/nuevo" element={<UsuarioForm isAdmin={true} />} />
              <Route path="/admin/usuarios/:id/editar" element={<UsuarioForm isAdmin={true} />} />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
