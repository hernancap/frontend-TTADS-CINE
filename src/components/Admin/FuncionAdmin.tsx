import { useEffect, useState } from "react";
import { Funcion } from "../../types";
import { getFunciones, deleteFuncion } from "../../api/funcion";
import { format } from "date-fns";
import { toZonedTime } from "date-fns-tz";
import { useNavigate } from "react-router-dom"; 

const FuncionAdmin = () => {
  const navigate = useNavigate();
  const [funciones, setFunciones] = useState<Funcion[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  const loadFunciones = async () => {
    try {
      const response = await getFunciones();
      setFunciones(response.data);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Ocurrió un error desconocido");
      }
    }
  };

  useEffect(() => {
    loadFunciones();
  }, []);

  useEffect(() => {
    const totalPages = funciones.length === 0 ? 1 : Math.ceil(funciones.length / itemsPerPage);
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [funciones, currentPage, itemsPerPage]);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = funciones.slice(indexOfFirstItem, indexOfLastItem);

  const formatDateFromUTC = (utcDate: string): string => {
    const date = toZonedTime(utcDate, "America/Argentina/Buenos_Aires");
    return format(date, "dd/MM/yyyy HH:mm 'hs'");
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteFuncion(id);
      loadFunciones();
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Ocurrió un error desconocido");
      }
    }
  };

  return (
    <div className="p-4 bg-white text-black rounded-lg max-w-[1200px] mx-auto my-4">
      <h2 className="text-2xl mb-4">Administrar Funciones</h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <button 
        onClick={() => navigate("/admin/funciones/nueva")}
        className="px-4 py-2 mb-4 bg-gray-900 text-white rounded hover:bg-gray-700 transition-colors"
      >
        Crear Nueva Función
      </button>
      <table className="w-full border-collapse">
        <thead>
          <tr>
            <th className="border p-3 bg-gray-100">Película</th>
            <th className="border p-3 bg-gray-100">Sala</th>
            <th className="border p-3 bg-gray-100">Fecha y Hora</th>
            <th className="border p-3 bg-gray-100">Precio</th>
            <th className="border p-3 bg-gray-100 text-right">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {currentItems.length === 0 ? (
            <tr>
              <td colSpan={5} className="border p-3 text-center">No hay funciones</td>
            </tr>
          ) : (
            currentItems.map((funcion) => (
              <tr key={funcion.id}>
                <td className="border p-3">{funcion.pelicula.nombre}</td>
                <td className="border p-3">{funcion.sala.nombre}</td>
                <td className="border p-3">{formatDateFromUTC(funcion.fechaHora)}</td>
                <td className="border p-3">${funcion.precio}</td>
                <td className="border p-3 text-right">
                  <button 
                    onClick={() => handleDelete(funcion.id)}
                    className="ml-2 px-3 py-1 bg-gray-900 text-white rounded hover:bg-gray-700 transition-colors"
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
      <div className="flex justify-center gap-4 mt-4">
        <button 
          onClick={() => setCurrentPage(prev => prev - 1)}
          disabled={currentPage === 1}
          className="px-4 py-2 bg-gray-900 text-white rounded disabled:bg-gray-600 disabled:cursor-not-allowed"
        >
          Anterior
        </button>
        <span>Página {currentPage} de {Math.ceil(funciones.length / itemsPerPage) || 1}</span>
        <button 
          onClick={() => setCurrentPage(prev => prev + 1)}
          disabled={currentPage >= Math.ceil(funciones.length / itemsPerPage)}
          className="px-4 py-2 bg-gray-900 text-white rounded disabled:bg-gray-600 disabled:cursor-not-allowed"
        >
          Siguiente
        </button>
      </div>
    </div>
  );
};

export default FuncionAdmin;