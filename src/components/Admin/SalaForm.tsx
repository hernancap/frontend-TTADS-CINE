import React, { useState, useCallback } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { Sala } from '../../types';
import { createSala, updateSala } from '../../api/sala';
import SalaAsientosAdmin from './SalaAsientosAdmin';

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
    <div className="bg-white p-4 rounded-lg max-w-[600px] mx-auto my-4 text-black">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <h3 className="text-xl font-semibold mb-4 text-center">
          {sala ? "Editar Sala" : "Crear Nueva Sala"}
        </h3>
        
        <div className="space-y-2">
          <label className="block font-bold mb-1">Nombre:</label>
          <input
            className="w-full p-2 border border-gray-300 rounded-md"
            {...register("nombre", { required: "El nombre es obligatorio" })}
          />
          {errors.nombre && (
            <span className="text-red-500 text-sm">{errors.nombre.message}</span>
          )}
        </div>

        {!sala && (
          <>
            <div className="space-y-2">
              <label className="block font-bold mb-1">Número de Filas:</label>
              <input
                type="number"
                className="w-full p-2 border border-gray-300 rounded-md"
                {...register("numFilas", { required: "Requerido", min: 1 })}
              />
              {errors.numFilas && (
                <span className="text-red-500 text-sm">{errors.numFilas.message}</span>
              )}
            </div>
            
            <div className="space-y-2">
              <label className="block font-bold mb-1">Asientos por Fila:</label>
              <input
                type="number"
                className="w-full p-2 border border-gray-300 rounded-md"
                {...register("asientosPorFila", { required: "Requerido", min: 1 })}
              />
              {errors.asientosPorFila && (
                <span className="text-red-500 text-sm">{errors.asientosPorFila.message}</span>
              )}
            </div>

            <div className="space-y-2">
              <label className="block font-bold mb-1">Selecciona los asientos a crear:</label>
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

        <div className="flex justify-end gap-2 mt-4">
          <button
            type="submit"
            className="px-4 py-2 bg-gray-900 text-white rounded-md hover:bg-gray-800"
          >
            {sala ? "Guardar Cambios" : "Crear Sala"}
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

export default SalaForm;
