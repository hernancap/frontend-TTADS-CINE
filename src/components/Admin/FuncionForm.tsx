import React from "react";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { Funcion, Pelicula, Sala } from "../../types";
import { createFuncion,	updateFuncion } from "../../api/funcion";
import { getPeliculas } from "../../api/pelicula";
import { getSalas } from "../../api/sala";
import AsyncSelect from "react-select/async";
import { StylesConfig } from "react-select";
import "./FuncionForm.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { parseISO } from 'date-fns';
import { format as formatTZ, toZonedTime } from 'date-fns-tz';

interface Option {
	value: string;
	label: string;
}

interface FuncionFormInputs {
	fechaHora: string;
	sala: Option | null; 
	pelicula: Option | null;
	precio: number;
}

interface FuncionFormProps {
	funcion: Funcion | null;
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

const FuncionForm: React.FC<FuncionFormProps> = ({ funcion, onClose }) => {
	const {
		register,
		handleSubmit,
		control,
		formState: { errors },
	} = useForm<FuncionFormInputs>({
		defaultValues: funcion
			? {
					fechaHora: new Date(funcion.fechaHora)
						.toISOString()
						.slice(0, 16),
					sala: {
						value: funcion.sala.id,
						label: funcion.sala.nombre,
					},
					pelicula: {
						value: funcion.pelicula.id,
						label: funcion.pelicula.nombre,
					},
					precio: funcion.precio,
			  }
			: {
					fechaHora: "",
					sala: null,
					pelicula: null,
					precio: 0,
			  },
	});

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
		try {
			const funcionData = {
				fechaHora: new Date(data.fechaHora),
				sala: data.sala?.value || "", 
				pelicula: data.pelicula?.value || "", 
				precio: Number(data.precio),
			};

			if (funcion) {
				await updateFuncion(funcion.id, funcionData);
			} else {
				await createFuncion(funcionData);
			}
			onClose();
		} catch (error) {
			console.error(error);
		}
	};

	return (
		<div className="funcion-form-container">
			<form onSubmit={handleSubmit(onSubmit)} className="funcion-form">
				<h3>{funcion ? "Editar Función" : "Crear Nueva Función"}</h3>

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
								onChange={(selected) =>
									field.onChange(selected)
								}
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
								onChange={(selected) =>
									field.onChange(selected)
								}
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
  <label>Fecha y Hora:</label>
  <Controller
    name="fechaHora"
    control={control}
    rules={{ required: "Seleccione fecha y hora" }}
    render={({ field }) => {
      const timeZone = 'America/Argentina/Buenos_Aires';
      return (
        <DatePicker
          {...field}
          selected={
            field.value ? 
            toZonedTime(parseISO(field.value), timeZone) : 
            null
          }
          onChange={(date) => {
            if (date) {
              const utcDate = formatTZ(date, "yyyy-MM-dd'T'HH:mm:ssXXX", {
                timeZone: 'UTC'
              });
              field.onChange(utcDate);
            }
          }}
          showTimeSelect
          dateFormat="dd/MM/yyyy HH:mm"
          timeFormat="HH:mm"
          timeIntervals={15}
          placeholderText="Seleccione fecha y hora"
          className="datetime-input"
          locale="es"
        />
      );
    }}
  />
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

				<div className="form-group buttons-group">
					<button type="submit" className="submit-button">
						{funcion ? "Guardar Cambios" : "Crear Función"}
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
