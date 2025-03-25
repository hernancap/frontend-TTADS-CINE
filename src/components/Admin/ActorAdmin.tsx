import { useEffect, useState } from 'react';
import { Actor } from '../../types';
import { getActors, deleteActor } from '../../api/actor';
import ActorForm from './ActorForm';
import './ActorAdmin.css';

const ActorAdmin = () => {
  const [actors, setActors] = useState<Actor[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
          {actors.map((actor) => (
            <tr key={actor.id}>
              <td>{actor.nombre}</td>
              <td className="actions-cell">
                <button onClick={() => handleDelete(actor.id)}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {showForm && <ActorForm onClose={handleFormClose} onActorCreated={() => handleFormClose()} />}
    </div>
  );
};

export default ActorAdmin;
