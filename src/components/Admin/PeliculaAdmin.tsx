import { useEffect, useState } from 'react';
import { Pelicula } from '../../types';
import { getPeliculas, deletePelicula } from '../../api/pelicula';
import PeliculaForm from './PeliculaForm';

const PeliculaAdmin = () => {
  const [peliculas, setPeliculas] = useState<Pelicula[]>([]);
  const [selectedPelicula, setSelectedPelicula] = useState<Pelicula | null>(null);
  const [showForm, setShowForm] = useState(false);
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
        onClick={() => { setSelectedPelicula(null); setShowForm(true); }}
        className="px-4 py-2 mb-4 bg-gray-900 text-white rounded hover:bg-gray-700 transition-colors"
      >
        Crear Nueva Película
      </button>
      <table className="w-full border-collapse">
        <thead>
          <tr>
            <th className="border p-3 bg-gray-100">Título</th>
            <th className="border p-3 bg-gray-100">Género</th>
            <th className="border p-3 bg-gray-100 text-right">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {currentItems.map((pelicula) => (
            <tr key={pelicula.id}>
              <td className="border p-3">{pelicula.nombre}</td>
              <td className="border p-3">{pelicula.genero}</td>
              <td className="border p-3 text-right">
                <button 
                  onClick={() => handleDelete(pelicula.id)}
                  className="ml-2 px-3 py-1 bg-gray-900 text-white rounded hover:bg-gray-700 transition-colors"
                >
                  Eliminar
                </button>
                <button 
                  onClick={() => { setSelectedPelicula(pelicula); setShowForm(true); }}
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
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-8 overflow-y-auto">
          <div className="bg-white p-8 rounded-xl shadow-xl max-w-[600px] w-full max-h-[90vh]">
            <PeliculaForm pelicula={selectedPelicula} onClose={() => { setShowForm(false); loadPeliculas(); }} />
          </div>
        </div>
      )}
    </div>
  );
};

export default PeliculaAdmin;