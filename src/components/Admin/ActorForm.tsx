import React from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { createActor } from '../../api/actor';
import { Actor } from '../../types';
import './ActorForm.css';

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
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>Crear Actor</h3>
        <form onSubmit={handleSubmit(onSubmit)}>
          <label>
            Nombre:
            <input
              {...register('nombre', { required: 'El nombre es obligatorio' })}
            />
            {errors.nombre && <span className="error">{errors.nombre.message}</span>}
          </label>
          <button type="submit">Crear Actor</button>
          <button type="button" onClick={onClose}>Cancelar</button>
        </form>
      </div>
    </div>
  );
};

export default ActorForm;
