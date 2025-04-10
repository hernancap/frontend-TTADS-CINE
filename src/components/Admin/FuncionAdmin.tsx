import { useEffect, useState } from "react";
import { Funcion } from "../../types";
import { getFunciones, deleteFuncion } from "../../api/funcion";
import FuncionForm from "./FuncionForm";
import "./FuncionAdmin.css";
import { format } from "date-fns";
import { toZonedTime } from "date-fns-tz";

const FuncionAdmin = () => {
	const [funciones, setFunciones] = useState<Funcion[]>([]);
	const [showForm, setShowForm] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const loadFunciones = async () => {
		try {
			const response = await getFunciones();
			setFunciones(response.data);
		} catch (err: unknown) {
			if (err instanceof Error) {
				setError(err.message);
			} else {
				setError("Ocurrió un error desconocido");
			}
		}
	};

  const formatDateFromUTC = (utcDate: string): string => {
    const date = toZonedTime(utcDate, "America/Argentina/Buenos_Aires");
    return format(date, "dd/MM/yyyy HH:mm 'hs'");
};

	useEffect(() => {
		loadFunciones();
	}, []);

	const handleDelete = async (id: string) => {
		try {
			await deleteFuncion(id);
			loadFunciones();
		} catch (err: unknown) {
			if (err instanceof Error) {
				setError(err.message);
			} else {
				setError("Ocurrió un error desconocido");
			}
		}
	};

	const handleCreate = () => {
		setShowForm(true);
	};

	const handleFormClose = () => {
		setShowForm(false);
		loadFunciones();
	};

	return (
		<div className="funcion-admin">
			<h2>Administrar Funciones</h2>
			{error && <p className="error">{error}</p>}
			<button onClick={handleCreate} className="create-button">
				Crear Nueva Función
			</button>
			<table className="funcion-admin-table">
				<thead>
					<tr>
						<th>Película</th>
						<th>Sala</th>
						<th>Fecha y Hora</th>
						<th>Precio</th>
						<th className="actions-header">Acciones</th>
					</tr>
				</thead>
				<tbody>
					{funciones.map((funcion) => (
						<tr key={funcion.id}>
							<td>{funcion.pelicula.nombre}</td>
							<td>{funcion.sala.nombre}</td>
							<td>{formatDateFromUTC(funcion.fechaHora)}</td>
							<td>${funcion.precio}</td>
							<td className="actions-cell">
								<button
									onClick={() => handleDelete(funcion.id)}>
									Eliminar
								</button>
							</td>
						</tr>
					))}
				</tbody>
			</table>
			{showForm && (
			  <div className="modal-overlay">
			    <div className="modal-content">
			      <FuncionForm onClose={handleFormClose} />
			    </div>
			  </div>
			)}
		</div>
	);
};

export default FuncionAdmin;
