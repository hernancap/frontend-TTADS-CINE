import React, { useState } from "react";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import AsyncSelect from "react-select/async";
import ActorForm from "./ActorForm";
import { Actor } from "../../types";
import { createPelicula, getPelicula, updatePelicula } from "../../api/pelicula";
import { getActors } from "../../api/actor";
import { useNavigate, useParams } from "react-router-dom";

interface Option {
  value: string;
  label: string;
}

interface PeliculaFormInputs {
  nombre: string;
  genero: string;
  duracion: number;
  director: string;
  actors: Actor[];
  enCartelera: boolean;
  proximamente: boolean;
  calificacion: string;
  poster?: FileList;
  sinopsis: string;
}

const PeliculaForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { register, handleSubmit, control, setValue, getValues, formState: { errors } } = useForm<PeliculaFormInputs>({
    defaultValues: async () => {
      if (id) {
        const peliculaResponse = await getPelicula(id);
        const pelicula = peliculaResponse.data;
        return {
          nombre: pelicula.nombre,
          genero: pelicula.genero,
          duracion: Number(pelicula.duracion),
          director: pelicula.director,
          actors: pelicula.actors,
          enCartelera: pelicula.enCartelera,
          proximamente: pelicula.proximamente,
          calificacion: pelicula.calificacion,
          sinopsis: pelicula.sinopsis,
        };
      }
      return {
          nombre: "",
          genero: "",
          duracion: 0,
          director: "",
          actors: [],
          enCartelera: false,
          proximamente: true,
          calificacion: "ATP",
          sinopsis: "",
        };
      },
    });

  const navigate = useNavigate();
  const [isActorModalOpen, setIsActorModalOpen] = useState(false);

  const loadActorOptions = async (inputValue: string): Promise<Option[]> => {
    try {
      const actors: Actor[] = await getActors();
      return actors
        .filter((actor) =>
          actor.nombre.toLowerCase().includes(inputValue.toLowerCase())
        )
        .map((actor) => ({
          value: actor.id,
          label: actor.nombre,
        }));
    } catch (error) {
      console.error(error);
      return [];
    }
  };

  const onSubmit: SubmitHandler<PeliculaFormInputs> = async (data) => {
    try {
      const formData = new FormData();
      formData.append("nombre", data.nombre);
      formData.append("genero", data.genero);
      formData.append("duracion", data.duracion.toString());
      formData.append("director", data.director);
      formData.append("enCartelera", data.enCartelera.toString());
      formData.append("proximamente", data.proximamente.toString());
      formData.append("calificacion", data.calificacion);
      formData.append("sinopsis", data.sinopsis.toString());
      data.actors.forEach((actor) => formData.append("actors", actor.id));
      if (data.poster && data.poster.length > 0) {
        formData.append("poster", data.poster[0]);
      }
      if (id) {
        await updatePelicula(id, formData);
      } else {
        await createPelicula(formData);
      }
      navigate("/admin/peliculas");
    } catch (error) {
      console.error("Error al guardar:", error);
    }
  };

  return (
    <div className="p-4">
      <form 
        onSubmit={handleSubmit(onSubmit)} 
        className="bg-white p-6 rounded-lg max-w-[600px] w-full mx-auto shadow-md space-y-4"
      > 
        <h3 className="text-xl font-semibold mb-4 text-center text-black">
          {id ? "Editar Película" : "Crear Nueva Película"}
        </h3>
        <div className="mb-4">
          <label className="block mb-1 font-bold text-black">Nombre:</label>
          <input
            {...register("nombre", { required: "El nombre es obligatorio" })}
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 bg-[#333] text-white"
          />
          {errors.nombre && (
            <span className="text-red-500 text-sm mt-1 block">{errors.nombre.message}</span>
          )}
        </div>
        <div className="mb-4">
          <label className="block mb-1 font-bold text-black">Género:</label>
          <input
            {...register("genero", { required: "El género es obligatorio" })}
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 bg-[#333] text-white"
          />
          {errors.genero && (
            <span className="text-red-500 text-sm mt-1 block">{errors.genero.message}</span>
          )}
        </div>
        <div className="mb-4">
          <label className="block mb-1 font-bold text-black">Duración (minutos):</label>
          <input
            type="number"
            {...register("duracion", { 
              required: "La duración es obligatoria",
              valueAsNumber: true 
            })}
            className="w-full px-3 py-2 border border-gray-300 rounded bg-[#333] text-white"
          />
          {errors.duracion && (
            <span className="text-red-500 text-sm mt-1 block">{errors.duracion.message}</span>
          )}
        </div>
        <div className="mb-4">
          <label className="block mb-1 font-bold text-black">Director:</label>
          <input
            {...register("director", { required: "El director es obligatorio" })}
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 bg-[#333] text-white"
          />
          {errors.director && (
            <span className="text-red-500 text-sm mt-1 block">{errors.director.message}</span>
          )}
        </div>
        <div className="mb-4">
          <label className="block mb-1 font-bold text-black">Calificación:</label>
          <select
            {...register("calificacion", { required: "La calificación es obligatoria" })}
            className="w-full px-3 py-2 border border-gray-300 rounded bg-[#333] text-white"
          >
            <option value="ATP">ATP</option>
            <option value="+13">+13</option>
            <option value="+16">+16</option>
            <option value="+18">+18</option>
          </select>
          {errors.calificacion && (
            <span className="text-red-500 text-sm mt-1 block">{errors.calificacion.message}</span>
          )}
        </div>
        <div className="mb-4">
          <label className="block mb-1 font-bold text-black">Actores:</label>
          <Controller
            control={control}
            name="actors"
            render={({ field: { onChange, value } }) => (
              <AsyncSelect<Option, true>
                cacheOptions
                defaultOptions
                isMulti
                loadOptions={loadActorOptions}
                className="w-full rounded"
                styles={{
                  control: (base) => ({
                    ...base,
                    borderColor: "#ddd",
                    minHeight: "40px",
                    boxShadow: "none",
                    backgroundColor: "#333",
                  }),
                  input: (base) => ({
                    ...base,
                    color: "white",
                  }),
                  menu: (base) => ({ ...base, zIndex: 9999 }),
                  option: (base) => ({
                    ...base,
                    color: "black",
                    cursor: "pointer",
                  }),
                  multiValueRemove: (base) => ({
                    ...base,
                    color: "black",
                  }),
                }}
                onChange={(selected) => onChange(
                  selected.map(opt => ({ id: opt.value, nombre: opt.label }))
                )}
                value={value?.map(actor => ({ value: actor.id, label: actor.nombre }))}
                placeholder="Busca y selecciona actores..."
              />
            )}
          />
          <button
            type="button"
            onClick={() => setIsActorModalOpen(true)}
            className="mt-2 px-4 py-2 bg-gray-900 text-white rounded hover:bg-gray-700 transition-colors"
          >
            Crear Actor
          </button>
        </div>
        <div className="mb-4">
          <label className="block mb-1 font-bold text-black">Sinopsis:</label>
          <textarea
            {...register("sinopsis", { required: "La sinopsis es obligatoria" })}
            className="w-full px-3 py-2 border border-gray-300 rounded resize-y min-h-[120px] bg-[#333] text-white"
            placeholder="Ingrese la sinopsis de la película..."
          />
          {errors.sinopsis && (
            <span className="text-red-500 text-sm mt-1 block">{errors.sinopsis.message}</span>
          )}
        </div>
        <div className="flex gap-4 mb-4">
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="enCartelera"
              {...register("enCartelera")}
              className="rounded"
            />
            <label htmlFor="enCartelera" className="font-bold text-black">En cartelera</label>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="proximamente"
              {...register("proximamente")}
              className="rounded"
            />
            <label htmlFor="proximamente" className="font-bold text-black">Próximamente</label>
          </div>
        </div>
        <div className="mb-4">
          <label className="block mb-1 font-bold text-black">Poster:</label>
          <input
            type="file"
            accept="image/*"
            {...register("poster")}
            className="w-full px-3 py-2 border border-gray-300 rounded text-black"
          />
        </div>
        <div className="flex justify-end gap-2 mt-4">
          <button
            type="submit"
            className="px-4 py-2 bg-gray-900 text-white rounded hover:bg-gray-700 transition-colors"
          >
            {id ? "Guardar Cambios" : "Crear Película"}
          </button>
          <button
            type="button"
            onClick={() => navigate("/admin/peliculas")} 
            className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 transition-colors"
          >
            Cancelar
          </button>
        </div>
      </form>
      {isActorModalOpen && (
        <ActorForm
          onClose={() => setIsActorModalOpen(false)}
          onActorCreated={(newActor) => {
            const currentActors = getValues("actors") || [];
            setValue("actors", [...currentActors, newActor]);
          }}
        />
      )}
    </div>
  );
};

export default PeliculaForm;