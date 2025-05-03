import { useEffect, useState } from 'react';
import { Actor } from '../../types';
import { getActors, deleteActor } from '../../api/actor';
import ActorForm from './ActorForm';

const ActorAdmin = () => {
  const [actors, setActors] = useState<Actor[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  const loadActors = async () => {
    try {
      const data = await getActors();
      setActors(data);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unknown error occurred');
      }
    }
  };

  useEffect(() => {
    loadActors();
  }, []);

  useEffect(() => {
    const totalPages = actors.length === 0 ? 1 : Math.ceil(actors.length / itemsPerPage);
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [actors, currentPage, itemsPerPage]);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = actors.slice(indexOfFirstItem, indexOfLastItem);

  const handleDelete = async (id: string) => {
    try {
      await deleteActor(id);
      loadActors();
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unknown error occurred');
      }
    }
  };

  const handleCreate = () => {
    setShowForm(true);
  };

  const handleFormClose = () => {
    setShowForm(false);
    loadActors();
  };

  return (
    <div className="p-4 bg-white text-black rounded-lg max-w-6xl mx-auto my-4">
      <h2 className="text-2xl mb-4">Administrar Actores</h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <button 
        onClick={handleCreate} 
        className="mb-4 px-4 py-2 bg-gray-900 text-white rounded cursor-pointer hover:bg-gray-700 transition-colors"
      >
        Crear Nuevo Actor
      </button>
      <table className="w-full border-collapse">
        <thead>
          <tr>
            <th className="border bg-gray-100 px-4 py-3">Nombre</th>
            <th className="border bg-gray-100 px-4 py-3 text-right">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {currentItems.length === 0 ? (
            <tr>
              <td colSpan={2} className="border px-4 py-3 text-center">
                No hay actores
              </td>
            </tr>
          ) : (
            currentItems.map((actor) => (
              <tr key={actor.id}>
                <td className="border px-4 py-3">{actor.nombre}</td>
                <td className="border px-4 py-3 text-right">
                  <button 
                    onClick={() => handleDelete(actor.id)}
                    className="ml-2 px-3 py-1 bg-gray-900 text-white rounded cursor-pointer hover:bg-gray-700 transition-colors"
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
      <div className="flex gap-4 mt-4 justify-center">
        <button 
          onClick={() => setCurrentPage(prev => prev - 1)} 
          disabled={currentPage === 1}
          className="px-4 py-2 bg-gray-900 text-white rounded cursor-pointer hover:bg-gray-700 transition-colors disabled:bg-gray-600 disabled:cursor-not-allowed"
        >
          Anterior
        </button>
        <span>Página {currentPage} de {Math.ceil(actors.length / itemsPerPage) || 1}</span>
        <button 
          onClick={() => setCurrentPage(prev => prev + 1)}
          disabled={currentPage >= Math.ceil(actors.length / itemsPerPage)}
          className="px-4 py-2 bg-gray-900 text-white rounded cursor-pointer hover:bg-gray-700 transition-colors disabled:bg-gray-600 disabled:cursor-not-allowed"
        >
          Siguiente
        </button>
      </div>
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg">
            <ActorForm onClose={handleFormClose} onActorCreated={handleFormClose} />
          </div>
        </div>
      )}
    </div>
  );
};

export default ActorAdmin;