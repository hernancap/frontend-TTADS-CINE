import React, { useState, useEffect } from "react";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { Pelicula, Sala, TipoFuncion } from "../../types";
import { createFuncion } from "../../api/funcion";
import { getPeliculas } from "../../api/pelicula";
import { getSalas } from "../../api/sala";
import AsyncSelect from "react-select/async";
import { StylesConfig } from "react-select";
import "./FuncionForm.css";
import { format, addDays } from "date-fns";

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

interface FuncionFormProps {
  onClose: () => void;
}

const customSelectStyles: StylesConfig<Option> = {
  control: (provided) => ({
    ...provided,
    backgroundColor: "#fff",
    borderColor: "#ddd",
    minHeight: "40px",
    boxShadow: "none",
  }),
  menu: (provided) => ({
    ...provided,
    zIndex: 9999,
  }),
};

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

const FuncionForm: React.FC<FuncionFormProps> = ({ onClose }) => {
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

  const onSubmit: SubmitHandler<FuncionFormInputs> = async (data) => {
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
      onClose();
    } catch (error) {
      setSubmitError(
        error instanceof Error ? error.message : "Error desconocido"
      );
    }
  };

	return (
		<div className="funcion-form-container">
			<form onSubmit={handleSubmit(onSubmit)} className="funcion-form">
				<h3>Crear Nuevas Funciones</h3>
				<div className="form-group">
					<label>Sala:</label>
					<Controller
						name="sala"
						control={control}
						rules={{ required: "Seleccione una sala" }}
						render={({ field }) => (
							<AsyncSelect<Option>
								{...field}
								styles={customSelectStyles}
								cacheOptions
								defaultOptions
								loadOptions={loadSalas}
								onChange={(selected) => field.onChange(selected)}
								value={field.value}
								placeholder="Buscar sala..."
							/>
						)}
					/>
					{errors.sala && (
						<span className="error">{errors.sala.message}</span>
					)}
				</div>

				<div className="form-group">
					<label>Pelicula:</label>
					<Controller
						name="pelicula"
						control={control}
						rules={{ required: "Seleccione una película" }}
						render={({ field }) => (
							<AsyncSelect<Option>
								{...field}
								styles={customSelectStyles}
								cacheOptions
								defaultOptions
								loadOptions={loadPeliculas}
								onChange={(selected) => field.onChange(selected)}
								value={field.value}
								placeholder="Buscar película..."
							/>
						)}
					/>
					{errors.pelicula && (
						<span className="error">{errors.pelicula.message}</span>
					)}
				</div>

				<div className="form-group">
				  <label>Tipo de función:</label>
				  <select
				    {...register("tipo", { required: "Seleccione el tipo de función" })}
				    className="tipo-select"
				  >
				    <option value={TipoFuncion.SUBTITULADA}>Subtitulada</option>
				    <option value={TipoFuncion.DOBLADA}>Doblada / Español</option>
				  </select>
				  {errors.tipo && (
				    <span className="error">{errors.tipo.message}</span>
				  )}
				</div>

				<div className="form-group">
					<label>Precio:</label>
					<input
						type="number"
						{...register("precio", {
							required: "Ingrese el precio",
							min: { value: 1, message: "El precio mínimo es 1" },
						})}
					/>
					{errors.precio && (
						<span className="error">{errors.precio.message}</span>
					)}
				</div>

				<div className="form-group">
					<label>Fechas:</label>
					<div className="button-grid">
						{daysArray.map((day, index) => (
							<button
								type="button"
								key={index}
								className={`date-button ${
									selectedDates.some(
										(d) => format(d, "yyyy-MM-dd") === format(day, "yyyy-MM-dd")
									)
										? "selected"
										: ""
								}`}
								onClick={() => toggleDateSelection(day)}
							>
								{format(day, "dd/MM")}
							</button>
						))}
					</div>
				</div>

						<div className="form-group">
        		  <label>Horarios:</label>
        		  <div className="button-grid">
        		    {timesArray.map((time, index) => {
        		      const isBlocked = blockedTimes.has(time) && !selectedTimes.includes(time);
        		      return (
        		        <button
        		          type="button"
        		          key={index}
        		          className={`time-button ${
        		            selectedTimes.includes(time) ? "selected" : ""
        		          } ${isBlocked ? "disabled" : ""}`}
        		          onClick={() => toggleTimeSelection(time)}
        		          disabled={isBlocked}
        		        >
        		          {time}
        		        </button>
        		      );
        		    })}
        		  </div>
        		</div>

				{submitError && (
				  <div className="error-message">
				    ⚠️ {submitError}
				  </div>
				)}

				<div className="form-group buttons-group">
					<button type="submit" className="submit-button">
						{"Crear Funciones"}
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

export default FuncionForm;
