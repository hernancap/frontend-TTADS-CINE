import React from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { createActor } from '../../api/actor';
import { Actor } from '../../types';

interface ActorFormInputs {
  nombre: string;
}

interface ActorFormProps {
  onClose: () => void;
  onActorCreated: (actor: Actor) => void;
}

const ActorForm: React.FC<ActorFormProps> = ({ onClose, onActorCreated }) => {
  const { register, handleSubmit, formState: { errors }, reset } = useForm<ActorFormInputs>();

  const onSubmit: SubmitHandler<ActorFormInputs> = async (data) => {
    try {
      const newActor = await createActor({ nombre: data.nombre });
      onActorCreated(newActor);
      reset();
      onClose();
    } catch (error) {
      console.error('Error creando actor:', error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-[1000]">
      <div className="bg-white p-6 rounded-lg max-w-[400px] w-[90%] mx-auto text-black">
        <h3 className="text-xl font-semibold mt-0 text-center text-black">Crear Actor</h3>
        <form onSubmit={handleSubmit(onSubmit)} className="mt-4">
          <label className="block mb-2">
            Nombre:
            <input
              {...register('nombre', { required: 'El nombre es obligatorio' })}
              className="w-full px-3 py-2 mb-4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
            />
            {errors.nombre && (
              <span className="text-red-500 text-sm block mt-1">{errors.nombre.message}</span>
            )}
          </label>
          <div className="flex justify-end gap-2">
            <button 
              type="submit" 
              className="px-4 py-2 bg-blue-600 text-white rounded hover:opacity-90 transition-opacity"
            >
              Crear Actor
            </button>
            <button 
              type="button" 
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 transition-colors"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ActorForm;