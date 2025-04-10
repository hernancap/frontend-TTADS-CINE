import { useEffect, useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import "./Favoritos.css";
import { getMe } from "../../api/usuario.ts";

const Favoritos = () => {
	const { user, login, token } = useAuth();
  	const [loading, setLoading] = useState<boolean>(!user);
  	const [error, setError] = useState<string>('');
	
  	useEffect(() => {
  	  const fetchUserData = async () => {
  	    try {
  	      const response = await getMe();
  	      login(token!, response.data);
  	    } catch (err: unknown) {
  	      if (err instanceof Error) {
  	        setError(err.message);
  	      } else {
  	        setError('Error desconocido');
  	      }
  	    } finally {
  	      setLoading(false);
  	    }
  	  };
	  
  	  if (!user || !user.favoritos || user.favoritos.length === 0) {
  	    fetchUserData();
  	  } else {
  	    setLoading(false);
  	  }
  	}, [user, token, login]);
  
  	if (loading) return <div>Cargando favoritos...</div>;
  	if (error) return <div>Error: {error}</div>;

	return (
		<div className="favoritos-container">
			<h1>Mis Favoritos</h1>
			{user?.favoritos && user.favoritos.length > 0 ? (
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
