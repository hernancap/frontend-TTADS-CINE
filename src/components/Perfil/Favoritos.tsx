import { useAuth } from "../../hooks/useAuth";
import "./Favoritos.css";

const Favoritos = () => {
	const { user } = useAuth();

	if (!user) return <div>Cargando favoritos...</div>;

	return (
		<div className="favoritos-container">
			<h1>Mis Favoritos</h1>
			{user.favoritos && user.favoritos.length > 0 ? (
				<ul className="favoritos-list">
					{user.favoritos?.map((pelicula) => (
						<li key={pelicula.id}>
							<h3>{pelicula.nombre}</h3>
							<p>Género: {pelicula.genero}</p>
							<p>Duración: {pelicula.duracion} min</p>
						</li>
					))}
				</ul>
			) : (
				<p>No tienes películas favoritas.</p>
			)}
		</div>
	);
};

export default Favoritos;
