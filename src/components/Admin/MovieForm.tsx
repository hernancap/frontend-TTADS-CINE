import React, { useState } from "react";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import AsyncSelect from "react-select/async";
import ActorForm from "./ActorForm";
import { Pelicula, Actor } from "../../types";
import { createPelicula, updatePelicula } from "../../api/pelicula";
import { getActors } from "../../api/actor";
import "./MovieForm.css";
import { StylesConfig } from "react-select";

interface Option {
	value: string;
	label: string;
}

interface MovieFormInputs {
	nombre: string;
	genero: string;
	duracion: number;
	director: string;
	actors: Actor[];
	enCartelera: boolean;
	proximamente: boolean;
	poster?: FileList;
}

interface MovieFormProps {
	pelicula: Pelicula | null;
	onClose: () => void;
}

const customSelectStyles: StylesConfig<Option, true> = {
	control: (provided) => ({
		...provided,
		backgroundColor: "#fff",
		borderColor: "#ddd",
		minHeight: "40px",
		boxShadow: "none",
	}),
	input: (provided) => ({
		...provided,
		color: "#000",
	}),
	placeholder: (provided) => ({
		...provided,
		color: "#666",
	}),
	singleValue: (provided) => ({
		...provided,
		color: "#000",
	}),
	multiValue: (provided) => ({
		...provided,
		backgroundColor: "#eee",
	}),
	multiValueLabel: (provided) => ({
		...provided,
		color: "#333",
	}),
	menu: (provided) => ({
		...provided,
		zIndex: 9999,
	}),
};

const MovieForm: React.FC<MovieFormProps> = ({ pelicula, onClose }) => {
	const {
		register,
		handleSubmit,
		control,
		setValue,
		getValues,
		formState: { errors },
	} = useForm<MovieFormInputs>({
		defaultValues: pelicula
			? {
					nombre: pelicula.nombre,
					genero: pelicula.genero,
					duracion: Number(pelicula.duracion),
					director: pelicula.director,
					actors: pelicula.actors,
					enCartelera: pelicula.enCartelera,
					proximamente: pelicula.proximamente,
			  }
			: {
					nombre: "",
					genero: "",
					duracion: 0,
					director: "",
					actors: [],
					enCartelera: false,
					proximamente: true,
			  },
	});

	const [isActorModalOpen, setIsActorModalOpen] = useState(false);

	const loadActorOptions = async (inputValue: string): Promise<Option[]> => {
		try {
			const actors: Actor[] = await getActors();
			return actors
				.filter((actor) =>
					actor.nombre
						.toLowerCase()
						.includes(inputValue.toLowerCase())
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

	const onSubmit: SubmitHandler<MovieFormInputs & { poster?: FileList }> = async (data) => {
		try {
		  const formData = new FormData();
		  formData.append("nombre", data.nombre);
		  formData.append("genero", data.genero);
		  formData.append("duracion", data.duracion.toString());
		  formData.append("director", data.director);
		  formData.append("enCartelera", data.enCartelera.toString());
		  formData.append("proximamente", data.proximamente.toString());
		  
		  data.actors.forEach((actor, index) => {
			formData.append(`actors[${index}]`, actor.id);
		  });
	  
		  if (data.poster && data.poster.length > 0) {
			formData.append("poster", data.poster[0]);
		  }
	  
		  if (pelicula) {
			await updatePelicula(pelicula.id, formData);
		  } else {
			await createPelicula(formData);
		  }
		  onClose();
		} catch (error) {
		  console.error(error);
		}
	  };
  

	const handleActorCreated = (newActor: Actor) => {
		const currentActors = getValues("actors") || [];
		setValue("actors", [...currentActors, newActor]);
	};

	return (
		<div className="movie-form-container">
			<form onSubmit={handleSubmit(onSubmit)} className="movie-form">
				<h3>{pelicula ? "Editar Película" : "Crear Nueva Película"}</h3>

				<div className="form-group">
					<label>Nombre:</label>
					<input
						{...register("nombre", {
							required: "El nombre es obligatorio",
						})}
					/>
					{errors.nombre && (
						<span className="error">{errors.nombre.message}</span>
					)}
				</div>

				<div className="form-group">
					<label>Género:</label>
					<input
						{...register("genero", {
							required: "El género es obligatorio",
						})}
					/>
					{errors.genero && (
						<span className="error">{errors.genero.message}</span>
					)}
				</div>

				<div className="form-group">
					<label>Duración (minutos):</label>
					<input
						type="number"
						{...register("duracion", {
							required: "La duración es obligatoria",
							valueAsNumber: true,
						})}
					/>
					{errors.duracion && (
						<span className="error">{errors.duracion.message}</span>
					)}
				</div>

				<div className="form-group">
					<label>Director:</label>
					<input
						{...register("director", {
							required: "El director es obligatorio",
						})}
					/>
					{errors.director && (
						<span className="error">{errors.director.message}</span>
					)}
				</div>

				<div className="form-group">
					<label>Actores:</label>
					<Controller
						control={control}
						name="actors"
						render={({ field: { onChange, value } }) => (
							<AsyncSelect<Option, true>
								cacheOptions
								defaultOptions
								isMulti
								loadOptions={loadActorOptions}
								styles={customSelectStyles}
								onChange={(selectedOptions) =>
									onChange(
										selectedOptions.map((option) => ({
											id: option.value,
											nombre: option.label,
										}))
									)
								}
								value={
									Array.isArray(value)
										? value.map((actor: Actor) => ({
												value: actor.id,
												label: actor.nombre,
										  }))
										: []
								}
								placeholder="Busca y selecciona actores..."
							/>
						)}
					/>
					<button
						type="button"
						onClick={() => setIsActorModalOpen(true)}
						className="create-actor-button"
					>
						Crear Actor
					</button>
				</div>

				<div className="form-group">
					<label>En cartelera</label>
					<input type="checkbox" {...register("enCartelera")} />
				</div>

				<div className="form-group">
					<label>Próximamente</label>
					<input type="checkbox" {...register("proximamente")} />
				</div>

				<div className="form-group">
					<label>Poster:</label>
					<input
						type="file"
						accept="image/*"
						{...register("poster")}
					/>
				</div>

				<div className="form-group buttons-group">
					<button type="submit" className="submit-button">
						{pelicula ? "Guardar Cambios" : "Crear Película"}
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

			{isActorModalOpen && (
				<ActorForm
					onClose={() => setIsActorModalOpen(false)}
					onActorCreated={handleActorCreated}
				/>
			)}
		</div>
	);
};

export default MovieForm;
