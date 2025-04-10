import { useEffect, useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import './MisCupones.css';
import { getMe } from '../../api/usuario.ts';

const MisCupones = () => {
  const { user, login, token } = useAuth();
  const [loading, setLoading] = useState<boolean>(!user);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await getMe();
        login(token!, response.data);
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

    if (!user || !user.cupones || user.cupones.length === 0) {
      fetchUserData();
    } else {
      setLoading(false);
    }
  }, [user, token, login]);

  if (loading) return <div className="cupon-loading">Cargando cupones...</div>;
  if (error) return <div className="cupon-error">Error: {error}</div>;

  const cupones = user?.cupones || [];

  return (
    <div className="cupon-container">
      <h1>Mis Cupones</h1>
      {cupones.length > 0 ? (
        <ul className="cupon-list">
          {cupones.map((cupon) => (
            <li key={cupon.id} className="cupon-item">
              <p><strong>Código:</strong> {cupon.codigo}</p>
              <p><strong>Descuento:</strong> {cupon.descuento}%</p>
              <p><strong>Expira:</strong> {new Date(cupon.fechaExpiracion).toLocaleDateString()}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p>No tienes cupones disponibles.</p>
      )}
    </div>
  );
};

export default MisCupones;
