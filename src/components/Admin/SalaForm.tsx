import React, { useState, useCallback } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { Sala } from '../../types';
import { createSala, updateSala } from '../../api/sala';
import SalaAsientosAdmin from './SalaAsientosAdmin';
import './SalaForm.css';

interface SalaFormInputs {
  nombre: string;
  numFilas?: number;
  asientosPorFila?: number;
}

interface Asiento {
  fila: string;
  numero: number;
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
    watch
  } = useForm<SalaFormInputs>({
    defaultValues: sala
      ? { nombre: sala.nombre }
      : { nombre: '', numFilas: 5, asientosPorFila: 5 },
  });

  const [selectedSeats, setSelectedSeats] = useState<Asiento[]>([]);

  const numFilas = watch('numFilas');
  const asientosPorFila = watch('asientosPorFila');

  const handleGridChange = useCallback((seats: Asiento[]) => {
    setSelectedSeats(seats);
  }, []);

  const onSubmit: SubmitHandler<SalaFormInputs> = async (data) => {
    try {
      const salaData = sala
        ? { nombre: data.nombre }
        : { 
            nombre: data.nombre, 
            asientos: selectedSeats.map(({ fila, numero }) => ({ fila, numero })) 
          };
  
      if (sala) {
        await updateSala(sala.id, salaData);
      } else {
        await createSala(salaData);
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
          <input {...register("nombre", { required: "El nombre es obligatorio" })} />
          {errors.nombre && <span className="error">{errors.nombre.message}</span>}
        </div>

        {!sala && (
          <>
            <div className="form-group">
              <label>Número de Filas:</label>
              <input type="number" {...register("numFilas", { required: "Requerido", min: 1 })} />
              {errors.numFilas && <span className="error">{errors.numFilas.message}</span>}
            </div>
            <div className="form-group">
              <label>Asientos por Fila:</label>
              <input type="number" {...register("asientosPorFila", { required: "Requerido", min: 1 })} />
              {errors.asientosPorFila && <span className="error">{errors.asientosPorFila.message}</span>}
            </div>
            <div className="form-group">
              <label>Selecciona los asientos a crear:</label>
              {numFilas && asientosPorFila && (
                <SalaAsientosAdmin
                  numFilas={Number(numFilas)}
                  asientosPorFila={Number(asientosPorFila)}
                  onGridChange={handleGridChange}
                />
              )}
            </div>
          </>
        )}

        <div className="form-group buttons-group">
          <button type="submit" className="submit-button">
            {sala ? "Guardar Cambios" : "Crear Sala"}
          </button>
          <button type="button" onClick={onClose} className="cancel-button">
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
};

export default SalaForm;
