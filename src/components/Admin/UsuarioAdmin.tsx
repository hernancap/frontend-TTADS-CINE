import { useEffect, useState } from "react";
import { Usuario } from "../../types";
import { getUsuarios, deleteUsuario } from "../../api/usuario";
import UsuarioForm from "./UsuarioForm";
import "./UsuarioAdmin.css";

const UsuarioAdmin = () => {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [selectedUsuario, setSelectedUsuario] = useState<Usuario | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
    <div className="usuario-admin">
      <h2>Administrar Usuarios</h2>
      {error && <p className="error">{error}</p>}
      <button onClick={handleCreate} className="create-button">
        Crear Nuevo Usuario
      </button>
      <table className="usuario-admin-table">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Email</th>
            <th>Tipo</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {usuarios.map((usuario) => (
            <tr key={usuario.id}>
              <td>{usuario.nombre}</td>
              <td>{usuario.email}</td>
              <td>{usuario.tipo}</td>
              <td className="actions-cell">
                <button onClick={() => handleEdit(usuario)}>Editar</button>
                <button onClick={() => handleDelete(usuario.id)}>
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {showForm && (
        <div className="modal-overlay">
          <div className="modal-content">
            <UsuarioForm usuario={selectedUsuario} onClose={handleFormClose} />
          </div>
        </div>
      )}
    </div>
  );
};

export default UsuarioAdmin;
