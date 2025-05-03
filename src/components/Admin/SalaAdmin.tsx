import { useEffect, useState } from 'react';
import { Sala } from '../../types';
import { getSalas, deleteSala } from '../../api/sala';
import { useNavigate } from 'react-router-dom';

const SalaAdmin = () => {
  const navigate = useNavigate(); 
  const [salas, setSalas] = useState<Sala[]>([]);
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
    navigate(`/admin/salas/${sala.id}/editar`);
  };

  const handleCreate = () => {
    navigate("/admin/salas/nueva");
  };

  return (
    <div className="p-4 bg-white rounded-lg max-w-[1200px] mx-auto my-4 text-black">
      <h2 className="mb-4 text-2xl font-semibold">Administrar Salas</h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <button
        onClick={handleCreate}
        className="px-4 py-2 bg-gray-900 text-white rounded-md hover:bg-gray-800 mb-4"
      >
        Crear Nueva Sala
      </button>
      <table className="w-full border-collapse">
        <thead>
          <tr>
            <th className="border p-3 bg-gray-100">Nombre</th>
            <th className="border p-3 text-right bg-gray-100">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {currentItems.length === 0 ? (
            <tr>
              <td className="border p-3 text-center" colSpan={2}>
                No hay salas
              </td>
            </tr>
          ) : (
            currentItems.map((sala) => (
              <tr key={sala.id}>
                <td className="border p-3">{sala.nombre}</td>
                <td className="border p-3 text-right">
                  <button
                    onClick={() => handleEdit(sala)}
                    className="ml-2 px-2.5 py-1.5 bg-gray-900 text-white rounded-md hover:bg-gray-800"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleDelete(sala.id)}
                    className="ml-2 px-2.5 py-1.5 bg-gray-900 text-white rounded-md hover:bg-gray-800"
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
      <div className="mt-4 flex gap-4 items-center justify-center">
        <button
          onClick={() => setCurrentPage(prev => prev - 1)}
          disabled={currentPage === 1}
          className="px-4 py-2 bg-gray-900 text-white rounded-md disabled:bg-gray-600 disabled:cursor-not-allowed"
        >
          Anterior
        </button>
        <span>
          Página {currentPage} de {Math.ceil(salas.length / itemsPerPage) || 1}
        </span>
        <button
          onClick={() => setCurrentPage(prev => prev + 1)}
          disabled={currentPage >= Math.ceil(salas.length / itemsPerPage)}
          className="px-4 py-2 bg-gray-900 text-white rounded-md disabled:bg-gray-600 disabled:cursor-not-allowed"
        >
          Siguiente
        </button>
      </div>
    </div>
  );
};

export default SalaAdmin;