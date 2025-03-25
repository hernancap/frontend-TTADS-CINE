import React from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { Sala } from '../../types';
import { createSala, updateSala } from '../../api/sala';
import './SalaForm.css';

interface SalaFormInputs {
    nombre: string;
    numFilas: number;
    asientosPorFila: number;
}

interface SalaFormProps {
  sala: Sala | null;
  onClose: () => void;
}

const SalaForm: React.FC<SalaFormProps> = ({ sala, onClose }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SalaFormInputs>({
    defaultValues: sala
      ? {
            nombre: sala.nombre,
            numFilas: sala.numFilas,
            asientosPorFila: sala.asientosPorFila,
        }
      : {
            nombre: "",
            numFilas: 0,
            asientosPorFila: 0,
        },
  });

  const onSubmit: SubmitHandler<SalaFormInputs> = async (data) => {
    try {
      if (sala) {
        await updateSala(sala.id, data);
      } else {
        await createSala(data);
      }
      onClose();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="sala-form-container">
      <form onSubmit={handleSubmit(onSubmit)} className="sala-form">
        <h3>{sala ? "Editar Sala" : "Crear Nueva Sala"}</h3>

        <div className="form-group">
          <label>Nombre:</label>
          <input
            {...register("nombre", { required: "El nombre es obligatorio" })}
          />
          {errors.nombre && <span className="error">{errors.nombre.message}</span>}
        </div>

        <div className="form-group">
          <label>Número de Filas:</label>
          <input
            type="number"
            {...register("numFilas", {
              required: "El número de filas es obligatorio",
              min: { value: 1, message: "Mínimo 1 fila" },
              valueAsNumber: true,
            })}
          />
          {errors.numFilas && (
            <span className="error">{errors.numFilas.message}</span>
          )}
        </div>

        <div className="form-group">
          <label>Asientos por Fila:</label>
          <input
            type="number"
            {...register("asientosPorFila", {
              required: "El número de asientos es obligatorio",
              min: { value: 1, message: "Mínimo 1 asiento" },
              valueAsNumber: true,
            })}
          />
          {errors.asientosPorFila && (
            <span className="error">{errors.asientosPorFila.message}</span>
          )}
        </div>

        <div className="form-group buttons-group">
          <button type="submit" className="submit-button">
            {sala ? "Guardar Cambios" : "Crear Sala"}
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

export default SalaForm;