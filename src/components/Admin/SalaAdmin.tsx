import { useEffect, useState } from 'react';
import { Sala } from '../../types';
import { getSalas, deleteSala } from '../../api/sala';
import SalaForm from './SalaForm';
import './SalaAdmin.css';

const SalaAdmin = () => {
  const [salas, setSalas] = useState<Sala[]>([]);
  const [selectedSala, setSelectedSala] = useState<Sala | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadSalas = async () => {
    try {
      const response = await getSalas();
      setSalas(response.data);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unknown error occurred');
      }
    }
  };

  useEffect(() => {
    loadSalas();
  }, []);

  const handleDelete = async (id: string) => {
    try {
      await deleteSala(id);
      loadSalas();
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unknown error occurred');
      }
    }
  };

  const handleEdit = (sala: Sala) => {
    setSelectedSala(sala);
    setShowForm(true);
  };

  const handleCreate = () => {
    setSelectedSala(null);
    setShowForm(true);
  };

  const handleFormClose = () => {
    setShowForm(false);
    loadSalas();
  };

  return (
    <div className="sala-admin">
      <h2>Administrar Salas</h2>
      {error && <p className="error">{error}</p>}
      <button onClick={handleCreate} className="create-button">
        Crear Nueva Sala
      </button>
      <table className="sala-admin-table">
        <thead>
          <tr>
            <th>Nombre</th>
            <th className="actions-header">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {salas.map((sala) => (
            <tr key={sala.id}>
              <td>{sala.nombre}</td>
              <td className="actions-cell">
                <button onClick={() => handleEdit(sala)}>Editar</button>
                <button onClick={() => handleDelete(sala.id)}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {showForm && (
      <div className="modal-overlay">
        <div className="modal-content">
          <SalaForm sala={selectedSala} onClose={handleFormClose} />
        </div>
      </div>
    )}
    </div>
  );
};

export default SalaAdmin;