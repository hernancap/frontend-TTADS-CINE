import { useEffect, useState } from 'react';
import { Actor } from '../../types';
import { getActors, deleteActor } from '../../api/actor';
import ActorForm from './ActorForm';
import './ActorAdmin.css';

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
    <div className="actor-admin">
      <h2>Administrar Actores</h2>
      {error && <p className="error">{error}</p>}
      <button onClick={handleCreate} className="create-button">
        Crear Nuevo Actor
      </button>
      <table className="actor-admin-table">
        <thead>
          <tr>
            <th>Nombre</th>
            <th className="actions-header">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {currentItems.length === 0 ? (
            <tr>
              <td colSpan={2}>No hay actores</td>
            </tr>
          ) : (
            currentItems.map((actor) => (
              <tr key={actor.id}>
                <td>{actor.nombre}</td>
                <td className="actions-cell">
                  <button onClick={() => handleDelete(actor.id)}>Eliminar</button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
      <div className="pagination">
        <button 
          onClick={() => setCurrentPage(prev => prev - 1)} 
          disabled={currentPage === 1}
        >
          Anterior
        </button>
        <span>Página {currentPage} de {Math.ceil(actors.length / itemsPerPage) || 1}</span>
        <button 
          onClick={() => setCurrentPage(prev => prev + 1)}
          disabled={currentPage >= Math.ceil(actors.length / itemsPerPage)}
        >
          Siguiente
        </button>
      </div>
      {showForm && (
        <div className="modal-overlay">
          <div className="modal-content">
            <ActorForm onClose={handleFormClose} onActorCreated={handleFormClose} />
          </div>
        </div>
      )}
    </div>
  );
};

export default ActorAdmin;