import { useEffect, useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import apiClient from '../../api/client';
import './MisEntradas.css'; 

const MyProfile = () => {
  const { user, login, token } = useAuth();
  const [loading, setLoading] = useState<boolean>(!user);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await apiClient.get('/usuarios/me');
        login(token!, response.data.data);
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('Error desconocido');
        }
      } finally {
        setLoading(false);
      }
    };

    if (!user || !user.entradas || user.entradas.length === 0) {
      fetchUserData();
    } else {
      setLoading(false);
    }
  }, [user, token, login]);

  if (loading) return <div className="profile-loading">Cargando información...</div>;
  if (error) return <div className="profile-error">Error: {error}</div>;
  if (!user) return <div className="profile-error">No se encontró usuario.</div>;

  const entradasOrdenadas = [...user.entradas].sort((a, b) => 
    new Date(b.fechaCompra).getTime() - new Date(a.fechaCompra).getTime()
  );

  return (
    <div className="profile-container">
      <h1 className="profile-title">Mi Perfil</h1>
      <h2 className="profile-subtitle">Entradas Compradas</h2>
      {entradasOrdenadas.length > 0 ? (
        <ul className="entrada-list">
          {entradasOrdenadas.map((entrada) => (
            <li key={entrada.id} className="entrada-item">
              <p><strong>Película:</strong> {entrada.funcion.pelicula.nombre}</p>
              <p><strong>Fecha y Hora:</strong> {new Date(entrada.funcion.fechaHora).toLocaleString()}</p>
              <p>
                <strong>Sala:</strong> {entrada.funcion.sala ? entrada.funcion.sala.nombre : 'Sin sala'}
              </p>
              <p>
                <strong>Asiento:</strong> {entrada.asiento.fila}{entrada.asiento.numero}
              </p>
              <p><strong>Precio:</strong> ${entrada.precio}</p>
              <p><strong>Comprado:</strong> {new Date(entrada.fechaCompra).toLocaleString()}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p className="no-entradas">No tienes entradas compradas.</p>
      )}
    </div>
  );
};

export default MyProfile;
