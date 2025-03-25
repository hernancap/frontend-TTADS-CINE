import { useAuth } from '../../hooks/useAuth';
import './MisCupones.css';

const MisCupones = () => {
  const { user } = useAuth();

  if (!user) return <div className="cupon-loading">Cargando cupones...</div>;

  const cupones = user.cupones || [];

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
