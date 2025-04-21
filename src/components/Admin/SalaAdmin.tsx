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
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

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

  useEffect(() => {
    const totalPages = salas.length === 0 ? 1 : Math.ceil(salas.length / itemsPerPage);
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [salas, currentPage, itemsPerPage]);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = salas.slice(indexOfFirstItem, indexOfLastItem);

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
          {currentItems.length === 0 ? (
            <tr>
              <td colSpan={2}>No hay salas</td>
            </tr>
          ) : (
            currentItems.map((sala) => (
              <tr key={sala.id}>
                <td>{sala.nombre}</td>
                <td className="actions-cell">
                  <button onClick={() => handleEdit(sala)}>Editar</button>
                  <button onClick={() => handleDelete(sala.id)}>Eliminar</button>
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
        <span>
          Página {currentPage} de {Math.ceil(salas.length / itemsPerPage) || 1}
        </span>
        <button 
          onClick={() => setCurrentPage(prev => prev + 1)}
          disabled={currentPage >= Math.ceil(salas.length / itemsPerPage)}
        >
          Siguiente
        </button>
      </div>
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