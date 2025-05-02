import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { getMe } from '../../api/usuario';
import { format } from 'date-fns';
import { toZonedTime } from 'date-fns-tz';

const MyProfile = () => {
  const navigate = useNavigate();
  const { user, login, token } = useAuth();
  const [loading, setLoading] = useState<boolean>(!user);
  const [error, setError] = useState<string>('');

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

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

    if (!user || !user.entradas || user.entradas.length === 0) {
      fetchUserData();
    } else {
      setLoading(false);
    }
  }, [user, token, login]);

  if (loading) {
    return <div className="text-white text-xl mt-8 text-center">Cargando información...</div>;
  }
  if (error) {
    return <div className="text-red-500 text-xl mt-8 text-center">Error: {error}</div>;
  }
  if (!user) {
    return <div className="text-red-500 text-xl mt-8 text-center">No se encontró usuario.</div>;
  }

  const entradasOrdenadas = [...(user.entradas || [])].sort(
    (a, b) => new Date(b.fechaCompra).getTime() - new Date(a.fechaCompra).getTime()
  );

  const totalPages = Math.ceil(entradasOrdenadas.length / itemsPerPage);
  const startIdx = (currentPage - 1) * itemsPerPage;
  const currentEntries = entradasOrdenadas.slice(startIdx, startIdx + itemsPerPage);

  const formatDateFromUTC = (utcDate: string): string => {
    const date = toZonedTime(utcDate, 'America/Argentina/Buenos_Aires');
    return format(date, "dd/MM/yyyy HH:mm 'hs'");
  };

  return (
    <div className="p-4 max-w-2xl mx-auto bg-[#1e1e1e] text-white rounded-lg">
      <h1 className="text-4xl mb-2 text-center">Mi Perfil</h1>
      <h2 className="text-2xl mb-4 text-center">Entradas Compradas</h2>
      {entradasOrdenadas.length > 0 ? (
        <>
          <ul className="space-y-4">
            {currentEntries.map((entrada) => (
              <li
                key={entrada.id}
                className="bg-[#2a2a2a] border border-[#444] rounded-md p-4 hover:bg-[#3a3a3a] transition-colors duration-300"
              >
                <p className="mt-1">
                  <strong>Película:</strong> {entrada.funcion.pelicula.nombre}
                </p>
                <p className="mt-1">
                  <strong>Duración:</strong> {entrada.funcion.pelicula.duracion} minutos
                </p>
                <p className="mt-1">
                  <strong>Fecha y Hora:</strong> {formatDateFromUTC(entrada.funcion.fechaHora)}
                </p>
                <p className="mt-1">
                  <strong>Sala:</strong> {entrada.funcion.sala.nombre}
                </p>
                <p className="mt-1">
                  <strong>Asiento:</strong>{' '}
                  {entrada.asientoFuncion.asiento.fila}
                  {entrada.asientoFuncion.asiento.numero}
                </p>
                <p className="mt-1">
                  <strong>Precio:</strong> ${entrada.precio}
                </p>
                <p className="mt-1">
                  <strong>Comprado:</strong> {formatDateFromUTC(entrada.fechaCompra)}
                </p>
                <div className="mt-3 text-right">
                  {!entrada.usada && new Date(entrada.funcion.fechaHora) > new Date() ? (
                    <button
                      onClick={() => navigate(`/entrada/${entrada.id}/qr`)}
                      className="px-4 py-2 bg-green-600 text-white font-semibold rounded hover:bg-green-700 transition"
                    >
                      Mostrar QR
                    </button>
                  ) : (
                    <button
                      disabled
                      className="px-4 py-2 bg-red-600 text-white font-semibold rounded opacity-50 cursor-not-allowed"
                    >
                      QR expirado
                    </button>
                  )}
                </div>
              </li>
            ))}
          </ul>
          <nav className="flex justify-center gap-2 mt-6">
            <button
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 rounded disabled:opacity-50 hover:bg-gray-200"
            >
              Anterior
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-3 py-1 rounded ${
                  page === currentPage ? 'bg-blue-600 text-white' : 'hover:bg-gray-200'
                }`}
              >
                {page}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-3 py-1 rounded disabled:opacity-50 hover:bg-gray-200"
            >
              Siguiente
            </button>
          </nav>
        </>
      ) : (
        <p className="text-center italic text-gray-400">No tienes entradas compradas.</p>
      )}
    </div>
  );
};

export default MyProfile;
