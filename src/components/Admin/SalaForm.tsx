import React, { useState, useCallback } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useParams, useNavigate } from 'react-router-dom';
import { createSala, getSala, updateSala } from '../../api/sala';
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

const SalaForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch
  } = useForm<SalaFormInputs>({
    defaultValues: async () => {
      if (id) {
        const salaResponse = await getSala(id);
        const sala = salaResponse.data;
        return {
          nombre: sala.nombre,
        };
      }
      return { nombre: '', numFilas: 5, asientosPorFila: 5 };
    },
  });

  const [selectedSeats, setSelectedSeats] = useState<Asiento[]>([]);

  const numFilas = watch('numFilas');
  const asientosPorFila = watch('asientosPorFila');

  const handleGridChange = useCallback((seats: Asiento[]) => {
    setSelectedSeats(seats);
  }, []);

  const onSubmit: SubmitHandler<SalaFormInputs> = async (data) => {
    try {
      const salaData = id
        ? { nombre: data.nombre }
        : { 
            nombre: data.nombre, 
            asientos: selectedSeats.map(({ fila, numero }) => ({ fila, numero })) 
          };
  
      if (id) {
        await updateSala(id, salaData);
      } else {
        await createSala(salaData);
      }
      navigate("/admin/salas");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto bg-white">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <h3 className="text-xl font-semibold mb-4 text-center text-black">
          {id ? "Editar Sala" : "Crear Nueva Sala"}
        </h3>
        <div className="space-y-2">
          <label className="block font-bold mb-1 text-black">Nombre:</label>
          <input
            className="w-full p-2 border border-gray-300 rounded-md bg-[#333]"
            {...register("nombre", { required: "El nombre es obligatorio" })}
          />
          {errors.nombre && (
            <span className="text-red-500 text-sm">{errors.nombre.message}</span>
          )}
        </div>
        {!id && (
          <>
            <div className="space-y-2">
              <label className="block font-bold mb-1 text-black">Número de Filas:</label>
              <input
                type="number"
                className="w-full p-2 border border-gray-300 rounded-md bg-[#333]"
                {...register("numFilas", { required: "Requerido", min: 1 })}
              />
              {errors.numFilas && (
                <span className="text-red-500 text-sm">{errors.numFilas.message}</span>
              )}
            </div>
            <div className="space-y-2">
              <label className="block font-bold mb-1 text-black">Asientos por Fila:</label>
              <input
                type="number"
                className="w-full p-2 border border-gray-300 rounded-md bg-[#333]"
                {...register("asientosPorFila", { required: "Requerido", min: 1 })}
              />
              {errors.asientosPorFila && (
                <span className="text-red-500 text-sm">{errors.asientosPorFila.message}</span>
              )}
            </div>
            <div className="space-y-2">
              <label className="block font-bold mb-1 text-black">Selecciona los asientos a crear:</label>
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
            {id ? "Guardar Cambios" : "Crear Sala"}
          </button>
          <button
            type="button"
            onClick={() => navigate("/admin/salas")} 
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
