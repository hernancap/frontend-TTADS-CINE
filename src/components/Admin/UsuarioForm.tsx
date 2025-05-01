import React from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { Usuario, UserType } from "../../types";
import { createUsuario, updateUsuario } from "../../api/usuario";

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
    <div className="bg-white p-4 rounded-lg max-w-[600px] mx-auto my-4 text-black">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <h3 className="text-xl font-semibold mb-4 text-center">
          {usuario ? "Editar Usuario" : "Crear Nuevo Usuario"}
        </h3>
        <div className="space-y-2">
          <label className="block font-bold mb-1">Nombre:</label>
          <input
            className="w-full p-2 border border-gray-300 rounded-md"
            {...register("nombre", { required: "Nombre es requerido" })}
          />
          {errors.nombre && (
            <span className="text-red-500 text-sm">{errors.nombre.message}</span>
          )}
        </div>
        <div className="space-y-2">
          <label className="block font-bold mb-1">Email:</label>
          <input
            type="email"
            className="w-full p-2 border border-gray-300 rounded-md"
            {...register("email", {
              required: "Email es requerido",
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: "Email inválido",
              },
            })}
          />
          {errors.email && (
            <span className="text-red-500 text-sm">{errors.email.message}</span>
          )}
        </div>
        {!newUser && (
          <div className="space-y-2">
            <label className="block font-bold mb-1">Tipo:</label>
            <select
              className="w-full p-2 border border-gray-300 rounded-md"
              {...register("tipo", { required: "Tipo es requerido" })}
            >
              {tiposUsuario.map((tipo) => (
                <option key={tipo.value} value={tipo.value}>
                  {tipo.label}
                </option>
              ))}
            </select>
            {errors.tipo && (
              <span className="text-red-500 text-sm">{errors.tipo.message}</span>
            )}
          </div>
        )}
        <div className="space-y-2">
          <label className="block font-bold mb-1">Contraseña:</label>
          <input
            type="password"
            className="w-full p-2 border border-gray-300 rounded-md"
            {...register("password", {
              required: !usuario && "Contraseña es requerida",
              minLength: {
                value: 6,
                message: "Mínimo 6 caracteres",
              },
            })}
          />
          {errors.password && (
            <span className="text-red-500 text-sm">{errors.password.message}</span>
          )}
        </div>
        {!usuario && (
          <div className="space-y-2">
            <label className="block font-bold mb-1">Confirmar Contraseña:</label>
            <input
              type="password"
              className="w-full p-2 border border-gray-300 rounded-md"
              {...register("confirmPassword", {
                validate: (value) =>
                  value === watch("password") || "Las contraseñas no coinciden",
              })}
            />
            {errors.confirmPassword && (
              <span className="text-red-500 text-sm">{errors.confirmPassword.message}</span>
            )}
          </div>
        )}
        <div className="flex justify-end gap-2 mt-4">
          <button
            type="submit"
            className="px-4 py-2 bg-gray-900 text-white rounded-md hover:bg-gray-800"
          >
            {usuario ? "Guardar Cambios" : "Crear Usuario"}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-black rounded-md hover:bg-gray-300"
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
};

export default UsuarioForm;
