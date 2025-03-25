import React from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { Usuario, UserType } from "../../types";
import { createUsuario, updateUsuario } from "../../api/usuario";
import "./UsuarioForm.css";

const tiposUsuario = [
  { value: "comun", label: "Común" },
  { value: "admin", label: "Administrador" },
];

interface UsuarioFormInputs {
  nombre: string;
  email: string;
  password: string;
  confirmPassword?: string;
  tipo: UserType;
}

interface UsuarioFormProps {
  usuario: Usuario | null;
  onClose: () => void;
  newUser?: boolean;
}

const UsuarioForm: React.FC<UsuarioFormProps> = ({ usuario, onClose, newUser }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<UsuarioFormInputs>({
    defaultValues: usuario
      ? {
          nombre: usuario.nombre,
          email: usuario.email,
          password: "",
          tipo: usuario.tipo, 
        }
      : {
          tipo: UserType.COMUN,
        },
  });

  const onSubmit: SubmitHandler<UsuarioFormInputs> = async (data) => {
    try {
      if (usuario) {
        const payload = {
          nombre: data.nombre,
          email: data.email,
          tipo: data.tipo,
          ...(data.password && { password: data.password }),
        };
        await updateUsuario(usuario.id, payload);
      } else {
        if (!data.password) {
          throw new Error(
            "La contraseña es obligatoria para crear un nuevo usuario."
          );
        }
        const payload = {
          nombre: data.nombre,
          email: data.email,
          password: data.password,
          tipo: data.tipo,
        };
        await createUsuario(payload);
      }
      onClose();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="usuario-form-container">
      <form onSubmit={handleSubmit(onSubmit)} className="usuario-form">
        <h3>{usuario ? "Editar Usuario" : "Crear Nuevo Usuario"}</h3>

        <div className="form-group">
          <label>Nombre:</label>
          <input {...register("nombre", { required: "Nombre es requerido" })} />
          {errors.nombre && (
            <span className="error">{errors.nombre.message}</span>
          )}
        </div>

        <div className="form-group">
          <label>Email:</label>
          <input
            type="email"
            {...register("email", {
              required: "Email es requerido",
              pattern: {
                value:
                  /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: "Email inválido",
              },
            })}
          />
          {errors.email && (
            <span className="error">{errors.email.message}</span>
          )}
        </div>

        {!newUser && (
        <div className="form-group">
          <label>Tipo:</label>
          <select {...register("tipo", { required: "Tipo es requerido" })}>
            {tiposUsuario.map((tipo) => (
              <option key={tipo.value} value={tipo.value}>
                {tipo.label}
              </option>
            ))}
          </select>
          {errors.tipo && (
            <span className="error">{errors.tipo.message}</span>
          )}
        </div>
        )}

        <div className="form-group">
          <label>Contraseña:</label>
          <input
            type="password"
            {...register("password", {
              required: !usuario && "Contraseña es requerida",
              minLength: {
                value: 6,
                message: "Mínimo 6 caracteres",
              },
            })}
          />
          {errors.password && (
            <span className="error">{errors.password.message}</span>
          )}
        </div>

        {!usuario && (
          <div className="form-group">
            <label>Confirmar Contraseña:</label>
            <input
              type="password"
              {...register("confirmPassword", {
                validate: (value) =>
                  value === watch("password") || "Las contraseñas no coinciden",
              })}
            />
            {errors.confirmPassword && (
              <span className="error">{errors.confirmPassword.message}</span>
            )}
          </div>
        )}

        <div className="form-group buttons-group">
          <button type="submit" className="submit-button">
            {usuario ? "Guardar Cambios" : "Crear Usuario"}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="cancel-button"
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
};

export default UsuarioForm;
