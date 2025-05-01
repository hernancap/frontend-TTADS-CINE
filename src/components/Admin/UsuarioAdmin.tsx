import { useEffect, useState } from "react";
import { Usuario } from "../../types";
import { getUsuarios, deleteUsuario } from "../../api/usuario";
import UsuarioForm from "./UsuarioForm";

const UsuarioAdmin = () => {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [selectedUsuario, setSelectedUsuario] = useState<Usuario | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  const loadUsuarios = async () => {
    try {
      const response = await getUsuarios();
      setUsuarios(response.data);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Ocurrió un error desconocido");
      }
    }
  };

  useEffect(() => {
    loadUsuarios();
  }, []);

  useEffect(() => {
    const totalPages = usuarios.length === 0 ? 1 : Math.ceil(usuarios.length / itemsPerPage);
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [usuarios, currentPage, itemsPerPage]);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = usuarios.slice(indexOfFirstItem, indexOfLastItem);

  const handleDelete = async (id: string) => {
    try {
      await deleteUsuario(id);
      loadUsuarios();
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Ocurrió un error desconocido");
      }
    }
  };

  const handleEdit = (usuario: Usuario) => {
    setSelectedUsuario(usuario);
    setShowForm(true);
  };

  const handleCreate = () => {
    setSelectedUsuario(null);
    setShowForm(true);
  };

  const handleFormClose = () => {
    setShowForm(false);
    loadUsuarios();
  };

  return (
    <div className="p-4 bg-white rounded-lg max-w-[1200px] mx-auto my-4 text-black">
      <h2 className="text-2xl font-semibold mb-4">Administrar Usuarios</h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <button
        onClick={handleCreate}
        className="px-4 py-2 bg-gray-900 text-white rounded-md hover:bg-gray-800 mb-4"
      >
        Crear Nuevo Usuario
      </button>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="border border-gray-300 p-3 text-left bg-gray-100">Nombre</th>
              <th className="border border-gray-300 p-3 text-left bg-gray-100">Email</th>
              <th className="border border-gray-300 p-3 text-left bg-gray-100">Tipo</th>
              <th className="border border-gray-300 p-3 text-left bg-gray-100">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.length === 0 ? (
              <tr>
                <td className="border border-gray-300 p-3 text-center" colSpan={4}>
                  No hay usuarios
                </td>
              </tr>
            ) : (
              currentItems.map((usuario) => (
                <tr key={usuario.id}>
                  <td className="border border-gray-300 p-3">{usuario.nombre}</td>
                  <td className="border border-gray-300 p-3">{usuario.email}</td>
                  <td className="border border-gray-300 p-3">{usuario.tipo}</td>
                  <td className="border border-gray-300 p-3 text-right">
                    <button
                      onClick={() => handleEdit(usuario)}
                      className="ml-2 px-2.5 py-1.5 bg-gray-900 text-white rounded-md hover:bg-gray-800"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDelete(usuario.id)}
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
      </div>
      <div className="mt-4 flex gap-4 items-center justify-center">
        <button
          onClick={() => setCurrentPage(prev => prev - 1)}
          disabled={currentPage === 1}
          className="px-4 py-2 bg-gray-900 text-white rounded-md disabled:bg-gray-600 disabled:cursor-not-allowed"
        >
          Anterior
        </button>
        <span>
          Página {currentPage} de {Math.ceil(usuarios.length / itemsPerPage) || 1}
        </span>
        <button
          onClick={() => setCurrentPage(prev => prev + 1)}
          disabled={currentPage >= Math.ceil(usuarios.length / itemsPerPage)}
          className="px-4 py-2 bg-gray-900 text-white rounded-md disabled:bg-gray-600 disabled:cursor-not-allowed"
        >
          Siguiente
        </button>
      </div>
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-8">
          <div className="bg-white p-8 rounded-lg shadow-xl max-w-[600px] w-full max-h-[90vh] overflow-y-auto">
            <UsuarioForm usuario={selectedUsuario} onClose={handleFormClose} />
          </div>
        </div>
      )}
    </div>
  );
};

export default UsuarioAdmin;