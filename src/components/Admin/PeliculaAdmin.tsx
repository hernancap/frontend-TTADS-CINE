import { useEffect, useState } from 'react';
import { Pelicula } from '../../types';
import { getPeliculas, deletePelicula } from '../../api/pelicula';
import { useNavigate } from 'react-router-dom';

const PeliculaAdmin = () => {
  const navigate = useNavigate();
  const [peliculas, setPeliculas] = useState<Pelicula[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  const loadPeliculas = async () => {
    try {
      const response = await getPeliculas();
      setPeliculas(response.data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Ocurrió un error desconocido");
    }
  };

  useEffect(() => { loadPeliculas() }, []);
  useEffect(() => {
    const totalPages = peliculas.length === 0 ? 1 : Math.ceil(peliculas.length / itemsPerPage);
    if (currentPage > totalPages) setCurrentPage(totalPages);
  }, [peliculas, currentPage, itemsPerPage]);

  const currentItems = peliculas.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleDelete = async (id: string) => {
    try {
      await deletePelicula(id);
      loadPeliculas();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Ocurrió un error desconocido");
    }
  };

  return (
    <div className="p-4 bg-white text-black rounded-lg max-w-[1200px] mx-auto my-4">
      <h2 className="text-2xl mb-4">Administrar Películas</h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <button 
        onClick={() => navigate("/admin/peliculas/nueva")} 
        className="px-4 py-2 mb-4 bg-gray-900 text-white rounded hover:bg-gray-700 transition-colors"
      >
        Crear Nueva Película
      </button>
      <table className="w-full border-collapse">
        <thead>
          <tr>
            <th className="border p-3 bg-gray-100">Título</th>
            <th className="border p-3 bg-gray-100">Duración</th>
            <th className="border p-3 bg-gray-100">En Cartelera</th>
            <th className="border p-3 bg-gray-100">Proximamente</th>
            <th className="border p-3 bg-gray-100">Calificación</th>
            <th className="border p-3 bg-gray-100 text-right">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {currentItems.map((pelicula) => (
            <tr key={pelicula.id}>
              <td className="border p-3">{pelicula.nombre}</td>
              <td className="border p-3">{pelicula.duracion} min.</td>
              <td className="border p-3">{pelicula.enCartelera ? "Sí" : "No"}</td>
              <td className="border p-3">{pelicula.proximamente ? "Sí" : "No"}</td>
              <td className="border p-3">{pelicula.calificacion}</td>
              <td className="border p-3 text-right">
                <button 
                  onClick={() => handleDelete(pelicula.id)}
                  className="ml-2 px-3 py-1 bg-gray-900 text-white rounded hover:bg-gray-700 transition-colors"
                >
                  Eliminar
                </button>
                <button 
                  onClick={() => navigate(`/admin/peliculas/${pelicula.id}/editar`)}
                  className="ml-2 px-3 py-1 bg-gray-900 text-white rounded hover:bg-gray-700 transition-colors"
                >
                  Editar
                </button>
              </td>
            </tr>
          ))}
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
        <span>Página {currentPage} de {Math.ceil(peliculas.length / itemsPerPage) || 1}</span>
        <button 
          onClick={() => setCurrentPage(prev => prev + 1)}
          disabled={currentPage >= Math.ceil(peliculas.length / itemsPerPage)}
          className="px-4 py-2 bg-gray-900 text-white rounded disabled:bg-gray-600 disabled:cursor-not-allowed"
        >
          Siguiente
        </button>
      </div>
    </div>
  );
};

export default PeliculaAdmin;