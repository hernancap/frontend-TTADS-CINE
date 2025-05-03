import React from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { UserType, Usuario } from "../../types";
import { createUsuario, getUsuario, updateUsuario } from "../../api/usuario";
import { useParams, useNavigate } from "react-router-dom";

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
  usuario?: Usuario | null;
  onClose?: () => void;
  isAdmin?: boolean;
}

const UsuarioForm: React.FC<UsuarioFormProps> = ({ isAdmin }) => {
  const { id } = useParams();
  const isNewUser = !id;
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<UsuarioFormInputs>({
    defaultValues: async () => {
      if (id) {
        const usuarioResponse = await getUsuario(id);
        const usuario = usuarioResponse.data;
        return {
          nombre: usuario.nombre,
          email: usuario.email,
          tipo: usuario.tipo,
          password: "",
        };
      }
      return {
        nombre: "",
        email: "",
        password: "",
        tipo: UserType.COMUN,
      };
    },
  });

  const onSubmit: SubmitHandler<UsuarioFormInputs> = async (data) => {
    try {
      if (id) {
        const payload = {
          nombre: data.nombre,
          email: data.email,
          tipo: data.tipo,
          ...(data.password && { password: data.password }),
        };
        await updateUsuario(id, payload);
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
        if (id) {
          await updateUsuario(id, payload);
        } else {
          await createUsuario(payload);
        }
      }
      if (!isAdmin) {
        navigate("/login");
      } else {
        navigate("/admin/usuarios");
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="bg-white p-4 rounded-lg max-w-[600px] mx-auto my-4">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <h3 className="text-xl font-semibold mb-4 text-center text-black">
          {id ? "Editar Usuario" : "Crear Nuevo Usuario"}
        </h3>
        <div className="space-y-2">
          <label className="block font-bold mb-1 text-black">Nombre:</label>
          <input
            className="w-full p-2 border border-gray-300 rounded-md bg-[#333]"
            {...register("nombre", { required: "Nombre es requerido" })}
          />
          {errors.nombre && (
            <span className="text-red-500 text-sm">{errors.nombre.message}</span>
          )}
        </div>
        <div className="space-y-2">
          <label className="block font-bold mb-1 text-black">Email:</label>
          <input
            type="email"
            className="w-full p-2 border border-gray-300 rounded-md bg-[#333]"
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
        {isAdmin && (
          <div className="space-y-2">
            <label className="block font-bold mb-1 text-black">Tipo:</label>
            <select
              className="w-full p-2 border border-gray-300 rounded-md bg-[#333]"
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
          <label className="block font-bold mb-1 text-black">Contraseña:</label>
          <input
            type="password"
            className="w-full p-2 border border-gray-300 rounded-md bg-[#333]"
            {...register("password", {
              required: isNewUser ? "Contraseña es requerida" : false,
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
        {!id && (
          <div className="space-y-2">
            <label className="block font-bold mb-1 text-black">Confirmar Contraseña:</label>
            <input
              type="password"
              className="w-full p-2 border border-gray-300 rounded-md bg-[#333]"
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
            {id ? "Guardar Cambios" : "Crear Usuario"}
          </button>
          <button
            type="button"
            onClick={() => navigate("/admin/usuarios")} 
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
