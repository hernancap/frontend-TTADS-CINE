import { useEffect, useState } from 'react';
import { Pelicula } from '../../types';
import { getPeliculas, deletePelicula } from '../../api/pelicula';
import PeliculaForm from './PeliculaForm';
import './PeliculaAdmin.css';

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
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unknown error occurred');
      }
    }
  };

  useEffect(() => {
    loadPeliculas();
  }, []);

  useEffect(() => {
    const totalPages = peliculas.length === 0 ? 1 : Math.ceil(peliculas.length / itemsPerPage);
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [peliculas, currentPage, itemsPerPage]);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = peliculas.slice(indexOfFirstItem, indexOfLastItem);

  const handleDelete = async (id: string) => {
    try {
      await deletePelicula(id);
      loadPeliculas();
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unknown error occurred');
      }
    }
  };

  const handleEdit = (pelicula: Pelicula) => {
    setSelectedPelicula(pelicula);
    setShowForm(true);
  };

  const handleCreate = () => {
    setSelectedPelicula(null);
    setShowForm(true);
  };

  const handleFormClose = () => {
    setShowForm(false);
    loadPeliculas();
  };

  return (
    <div className="pelicula-admin">
      <h2>Administrar Películas</h2>
      {error && <p className="error">{error}</p>}
      <button onClick={handleCreate} className="create-button">
        Crear Nueva Película
      </button>
      <table className="pelicula-admin-table">
        <thead>
          <tr>
            <th>Título</th>
            <th>Género</th>
            <th className="actions-header">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {currentItems.map((pelicula) => (
            <tr key={pelicula.id}>
              <td>{pelicula.nombre}</td>
              <td>{pelicula.genero}</td>
              <td className="actions-cell">
                <button onClick={() => handleEdit(pelicula)}>Editar</button>
                <button onClick={() => handleDelete(pelicula.id)}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="pagination">
        <button 
          onClick={() => setCurrentPage(prev => prev - 1)} 
          disabled={currentPage === 1}
        >
          Anterior
        </button>
        <span>Página {currentPage} de {Math.ceil(peliculas.length / itemsPerPage) || 1}</span>
        <button 
          onClick={() => setCurrentPage(prev => prev + 1)}
          disabled={currentPage >= Math.ceil(peliculas.length / itemsPerPage)}
        >
          Siguiente
        </button>
      </div>
      {showForm && (
        <div className="modal-overlay">
          <div className="modal-content">
            <PeliculaForm pelicula={selectedPelicula} onClose={handleFormClose} />
          </div>
        </div>
      )}
    </div>
  );
};

export default PeliculaAdmin;
