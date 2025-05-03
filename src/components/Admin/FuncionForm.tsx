import React, { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { Pelicula, Sala, TipoFuncion } from "../../types";
import { createFuncion } from "../../api/funcion";
import { getPeliculas } from "../../api/pelicula";
import { getSalas } from "../../api/sala";
import AsyncSelect from "react-select/async";
import { format, addDays } from "date-fns";
import { useNavigate } from "react-router-dom";

interface Option {
  value: string;
  label: string;
  duracion?: number;
}

interface FuncionFormInputs {
  sala: Option | null;
  pelicula: Option | null;
  precio: number;
  tipo: TipoFuncion; 
}

const generateTimesArray = (): string[] => {
  const times: string[] = [];
  const startHour = 12;
  const endHour = 22;
  for (let hour = startHour; hour <= endHour; hour++) {
    for (let minute = 0; minute < 60; minute += 20) {
      if (hour === endHour && minute > 0) break;
      const timeString = `${hour.toString().padStart(2, "0")}:${minute
        .toString()
        .padStart(2, "0")}`;
      times.push(timeString);
    }
  }
  return times;
};

const FuncionForm: React.FC = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    watch,
  } = useForm<FuncionFormInputs>({
    defaultValues: {
      sala: null,
      pelicula: null,
      precio: 0,
	  tipo: TipoFuncion.SUBTITULADA 
    },
  });

  const [selectedDates, setSelectedDates] = useState<Date[]>([]);
  const [selectedTimes, setSelectedTimes] = useState<string[]>([]);
  const [blockedTimes, setBlockedTimes] = useState<Set<string>>(new Set());
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [daysArray, setDaysArray] = useState<Date[]>([]);
  const timesArray = generateTimesArray();
  const pelicula = watch("pelicula");
  const peliculaDuracion = pelicula?.duracion || 0;

  useEffect(() => {
    const today = new Date();
    const days: Date[] = [];
    for (let i = 0; i < 14; i++) {
      days.push(addDays(today, i));
    }
    setDaysArray(days);
  }, []);

  useEffect(() => {
    setSelectedTimes([]);
    setBlockedTimes(new Set());
  }, [pelicula]);

  useEffect(() => {
    if (!peliculaDuracion) return;

    const nuevosBloqueos = new Set<string>();

    selectedTimes.forEach(time => {
		const [hora, minuto] = time.split(":").map(Number);
		const inicio = new Date(2000, 0, 1, hora, minuto);
		const fin = new Date(inicio.getTime() + peliculaDuracion * 60 * 1000); 

		timesArray.forEach(t => {
			const [h, m] = t.split(":").map(Number);
			const tiempoActual = new Date(2000, 0, 1, h, m);
			if (tiempoActual >= inicio && tiempoActual < fin) {
				nuevosBloqueos.add(t);
			  }
			});
		  });

    setBlockedTimes(nuevosBloqueos);
  }, [selectedTimes, peliculaDuracion, timesArray]);

  const toggleDateSelection = (day: Date) => {
    setSelectedDates((prev) => {
      if (prev.some((d) => format(d, "yyyy-MM-dd") === format(day, "yyyy-MM-dd"))) {
        return prev.filter((d) => format(d, "yyyy-MM-dd") !== format(day, "yyyy-MM-dd"));
      } else {
        return [...prev, day];
      }
    });
  };

  const toggleTimeSelection = (time: string) => {
    setSelectedTimes(prev => 
      prev.includes(time) 
        ? prev.filter(t => t !== time) 
        : [...prev, time]
    );
  };

  const loadPeliculas = async (inputValue: string): Promise<Option[]> => {
    try {
      const response = await getPeliculas();
      return response.data
        .filter((p: Pelicula) =>
          p.nombre.toLowerCase().includes(inputValue.toLowerCase())
        )
        .map((p: Pelicula) => ({
          value: p.id,
          label: p.nombre,
          duracion: p.duracion
        }));
    } catch (error) {
      console.error(error);
      return [];
    }
  };

  const loadSalas = async (inputValue: string): Promise<Option[]> => {
    try {
      const response = await getSalas();
      return response.data
        .filter((s: Sala) =>
          s.nombre.toLowerCase().includes(inputValue.toLowerCase())
        )
        .map((s: Sala) => ({
          value: s.id,
          label: s.nombre,
        }));
    } catch (error) {
      console.error(error);
      return [];
    }
  };

  const onSubmit = async (data: FuncionFormInputs) => {
    if (selectedDates.length === 0 || selectedTimes.length === 0) {
      alert("Debe seleccionar al menos una fecha y un horario.");
      return;
    }
    try {
      for (const date of selectedDates) {
        for (const time of selectedTimes) {
          const [hours, minutes] = time.split(":").map(Number);
          const dateTime = new Date(date);
          dateTime.setHours(hours, minutes, 0, 0);
          const funcionData = {
            fechaHora: dateTime,
            sala: data.sala?.value || "",
            pelicula: data.pelicula?.value || "",
            precio: Number(data.precio),
			      tipo: data.tipo,
          };
          await createFuncion(funcionData);
        }
      }
      navigate("/admin/funciones"); 
    } catch (error) {
      setSubmitError(
        error instanceof Error ? error.message : "Error desconocido"
      );
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <h3 className="text-xl font-semibold mb-4 text-center">Crear Nuevas Funciones</h3>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="mb-4">
        <label className="block font-bold mb-2">Sala:</label>
        <Controller
          name="sala"
          control={control}
          rules={{ required: "Seleccione una sala" }}
          render={({ field }) => (
            <AsyncSelect
              {...field}
              cacheOptions
              defaultOptions
              loadOptions={loadSalas}
              onChange={(selected) => field.onChange(selected)}
              value={field.value}
              placeholder="Buscar sala..."
              styles={{
                control: (base) => ({
                  ...base,
                  borderColor: "#ddd",
                  boxShadow: "none",
                  minHeight: "40px",
                }),
                menu: (base) => ({ ...base, zIndex: 9999 }),
              }}
              className="rounded"
            />
          )}
        />
        {errors.sala && <span className="text-red-500 text-sm mt-1">{errors.sala.message}</span>}
      </div>
      <div className="mb-4">
        <label className="block font-bold mb-2">Película:</label>
        <Controller
          name="pelicula"
          control={control}
          rules={{ required: "Seleccione una película" }}
          render={({ field }) => (
            <AsyncSelect
              {...field}
              cacheOptions
              defaultOptions
              loadOptions={loadPeliculas}
              onChange={(selected) => field.onChange(selected)}
              value={field.value}
              placeholder="Buscar película..."
              styles={{
                control: (base) => ({
                  ...base,
                  borderColor: "#ddd",
                  boxShadow: "none",
                  minHeight: "40px",
                }),
                menu: (base) => ({ ...base, zIndex: 9999 }),
              }}
              className="rounded"
            />
          )}
        />
        {errors.pelicula && <span className="text-red-500 text-sm mt-1">{errors.pelicula.message}</span>}
      </div>
      <div className="mb-4">
        <label className="block font-bold mb-2">Tipo de función:</label>
        <select
          {...register("tipo", { required: "Seleccione el tipo de función" })}
          className="w-full px-3 py-2 border border-gray-300 rounded text-base"
        >
          <option value={TipoFuncion.SUBTITULADA}>Subtitulada</option>
          <option value={TipoFuncion.DOBLADA}>Doblada / Español</option>
        </select>
        {errors.tipo && <span className="text-red-500 text-sm mt-1">{errors.tipo.message}</span>}
      </div>
      <div className="mb-4">
        <label className="block font-bold mb-2">Precio:</label>
        <input
          type="number"
          {...register("precio", {
            required: "Ingrese el precio",
            min: { value: 1, message: "El precio mínimo es 1" },
          })}
          className="w-full px-3 py-2 border border-gray-300 rounded"
        />
        {errors.precio && <span className="text-red-500 text-sm mt-1">{errors.precio.message}</span>}
      </div>
      <div className="mb-4">
        <label className="block font-bold mb-2">Fechas:</label>
        <div className="flex flex-wrap gap-2">
          {daysArray.map((day, index) => (
            <button
              key={index}
              type="button"
              className={`
                px-4 py-2 border border-gray-300 rounded 
                transition-all hover:bg-gray-100 
                ${selectedDates.some(d => format(d, "yyyy-MM-dd") === format(day, "yyyy-MM-dd"))
                  ? "bg-green-500 text-white hover:bg-green-600"
                  : "bg-white text-gray-700"
                }
              `}
              onClick={() => toggleDateSelection(day)}
            >
              {format(day, "dd/MM")}
            </button>
          ))}
        </div>
      </div>
      <div className="mb-4">
        <label className="block font-bold mb-2">Horarios:</label>
        <div className="flex flex-wrap gap-2">
          {timesArray.map((time, index) => {
            const isBlocked = blockedTimes.has(time) && !selectedTimes.includes(time);
            return (
              <button
                key={index}
                type="button"
                className={`
                  px-4 py-2 border rounded transition-all 
                  ${isBlocked 
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed opacity-70 border-gray-400" 
                    : selectedTimes.includes(time) 
                      ? "bg-green-500 text-white hover:bg-green-600" 
                      : "bg-white text-gray-700 hover:bg-gray-100 border-gray-300"
                  }
                `}
                onClick={() => !isBlocked && toggleTimeSelection(time)}
                disabled={isBlocked}
              >
                {time}
              </button>
            );
          })}
        </div>
      </div>
      {submitError && (
        <div className="text-red-500 bg-red-100 p-2 rounded my-4">
          ⚠️ {submitError}
        </div>
      )}
      <div className="flex justify-end gap-2 mt-4">
        <button 
          type="submit" 
          className="px-4 py-2 bg-gray-900 text-white rounded hover:bg-gray-700 transition-colors"
        >
          Crear Funciones
        </button>
        <button
          type="button"
          onClick={() => navigate("/admin/funciones")}
          className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 transition-colors"
        >
          Cancelar
        </button>
      </div>
      </form>
    </div>
  );
};

export default FuncionForm;
