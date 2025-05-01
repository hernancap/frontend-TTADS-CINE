import { useEffect, useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
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
        setError(err instanceof Error ? err.message : 'Error desconocido');
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

  if (loading) return <div className="text-white text-xl mt-8 text-center">Cargando cupones...</div>;
  if (error) return <div className="text-red-500 text-xl mt-8 text-center">Error: {error}</div>;

  const cupones = user?.cupones || [];

  return (
    <div className="p-4 max-w-2xl mx-auto bg-[#1e1e1e] text-white rounded-lg">
      <h1 className="text-3xl mb-4 text-center">Mis Cupones</h1>
      {cupones.length > 0 ? (
        <ul className="space-y-4">
          {cupones.map((cupon) => (
            <li 
              key={cupon.id} 
              className="bg-[#2a2a2a] border border-[#444] rounded-md p-4 hover:bg-[#3a3a3a] transition-colors"
            >
              <p className="mt-1"><strong>Código:</strong> {cupon.codigo}</p>
              <p className="mt-1"><strong>Descuento:</strong> {cupon.descuento}%</p>
              <p className="mt-1"><strong>Expira:</strong> {new Date(cupon.fechaExpiracion).toLocaleDateString()}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-center text-gray-400 italic">No tienes cupones disponibles.</p>
      )}
    </div>
  );
};

export default MisCupones;