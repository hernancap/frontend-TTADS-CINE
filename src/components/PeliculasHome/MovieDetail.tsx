import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Pelicula, Funcion } from '../../types';
import { getPelicula } from '../../api/pelicula';
import { getFuncionesByPelicula } from '../../api/funcion';
import { format, addDays, startOfDay, isSameDay } from 'date-fns';
import { es } from 'date-fns/locale';
import { toZonedTime } from 'date-fns-tz';
import { useAuth } from '../../hooks/useAuth';
import { updateUsuario } from '../../api/usuario'; 
import './MovieDetail.css';

const MovieDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [pelicula, setPelicula] = useState<Pelicula | null>(null);
  const [funciones, setFunciones] = useState<Funcion[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<Date>(startOfDay(new Date()));

  const { user, setUser } = useAuth();

  const next7Days = Array.from({ length: 7 }, (_, index) =>
    addDays(startOfDay(new Date()), index)
  );

  useEffect(() => {
    const fetchMovieData = async () => {
      try {
        const movieResponse = await getPelicula(id!);
        setPelicula(movieResponse.data);

        const funcionesResponse = await getFuncionesByPelicula(id!);
        setFunciones(funcionesResponse.data);
      } catch (error) {
        console.error('Error al cargar la información:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchMovieData();
  }, [id]);

  const formatDateFromUTC = (utcDate: string): string => {
    const date = toZonedTime(utcDate, "UTC");
    return format(date, "HH:mm 'hs'");
  };

  const funcionesFiltradas = funciones.filter((funcion) => {
    const funcionDate = startOfDay(new Date(funcion.fechaHora));
    return isSameDay(funcionDate, selectedDate);
  });

  const isFavorite = user?.favoritos?.some(fav => 
    typeof fav === 'string' ? fav === pelicula?.id : fav.id === pelicula?.id
  );

  const handleToggleFavorite = async () => {
    if (!user || !pelicula) return;
  
    const currentIds = (user.favoritos || [])
    .map(fav => typeof fav === 'string' ? fav : fav.id);

  const updatedIds = currentIds.includes(pelicula.id)
    ? currentIds.filter(id => id !== pelicula.id)
    : [...currentIds, pelicula.id];
  
    try {
      const updatedUser = await updateUsuario(user.id, { favoritos: updatedIds });
      if (setUser) setUser(updatedUser);
    } catch (error) {
      console.error("Error actualizando favoritos:", error);
    }
  };
  
  

  if (loading) return <p>Cargando...</p>;
  if (!pelicula) return <p>No se encontró la película.</p>;

  return (
    <div className="movie-detail">
      <h1>{pelicula.nombre}</h1>
      <img
        src={pelicula.poster_path || 'https://via.placeholder.com/300x450'}
        alt={pelicula.nombre}
        className="movie-detail-poster"
      />
      <div className="movie-detail-info">
        <p><strong>Género:</strong> {pelicula.genero}</p>
        <p><strong>Duración:</strong> {pelicula.duracion} minutos</p>
        <p><strong>Director:</strong> {pelicula.director}</p>
        <div className="actors">
          <strong>Actores:</strong>
          {pelicula.actors.map(actor => (
            <span key={actor.id} className="actor-tag">
              {actor.nombre}
            </span>
          ))}
        </div>
      </div>

      {pelicula.proximamente ? (
        <div className="movie-favorite">
          <button 
            onClick={handleToggleFavorite} 
            className={`favorite-button ${isFavorite ? 'remove' : ''}`}
          >
            {isFavorite ? "Eliminar de Favoritos" : "Agregar a Favoritos"}
          </button>
        </div>
      ) : (
        <section className="movie-functions">
          <h2>Funciones</h2>
          <div className="date-tabs">
            {next7Days.map((day) => (
              <button
                key={day.toISOString()}
                className={`tab-button ${isSameDay(day, selectedDate) ? 'active' : ''}`}
                onClick={() => setSelectedDate(day)}
              >
                {format(day, "EEE dd", { locale: es })}
              </button>
            ))}
          </div>
          {funcionesFiltradas.length > 0 ? (
            <div className="horarios-grid">
              {funcionesFiltradas.map((funcion) => (
                <Link key={funcion.id} to={`/comprar/${funcion.id}`} className="horario-button">
                  {formatDateFromUTC(funcion.fechaHora)}
                </Link>
              ))}
            </div>
          ) : (
            <p>No hay funciones disponibles para el día seleccionado.</p>
          )}
        </section>
      )}
    </div>
  );
};

export default MovieDetail;
