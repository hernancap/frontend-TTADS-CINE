import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Pelicula, Funcion, TipoFuncion } from '../../types';
import { getPelicula } from '../../api/pelicula';
import { getFuncionesByPelicula } from '../../api/funcion';
import { format, addDays, startOfDay, isSameDay } from 'date-fns';
import { es } from 'date-fns/locale';
import { toZonedTime } from 'date-fns-tz';
import { useAuth } from '../../hooks/useAuth';
import { updateUsuario } from '../../api/usuario';

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
    const date = toZonedTime(utcDate, "America/Argentina/Buenos_Aires");
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

  if (loading) return <p className="text-white text-xl mt-8 text-center">Cargando...</p>;
  if (!pelicula) return <p className="text-red-500 text-xl mt-8 text-center">No se encontró la película.</p>;

  return (
    <div className="max-w-[1200px] mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">{pelicula.nombre}</h1>
      <img 
        src={pelicula.poster_path ? `http://localhost:3000/uploads/${pelicula.poster_path}` : 'src/assets/default_poster.jpeg'}
        alt={pelicula.nombre}
        className="w-full max-w-[300px] block mb-4 rounded-lg"
      />
      <div className="mb-8">
        <p className="mb-2"><strong>Género:</strong> {pelicula.genero}</p>
        <p className="mb-2"><strong>Duración:</strong> {pelicula.duracion} minutos</p>
        <p className="mb-2"><strong>Director:</strong> {pelicula.director}</p>
        <p className="mb-2"><strong>Clasificación:</strong> {pelicula.calificacion}</p>
        <p className="mb-4"><strong>Sinopsis:</strong> {pelicula.sinopsis}</p>
        <div className="flex flex-wrap gap-2">
          <strong>Actores:</strong>
          {pelicula.actors.map(actor => (
            <span 
              key={actor.id} 
              className="bg-gray-200 text-gray-700 px-2 py-1 rounded"
            >
              {actor.nombre}
            </span>
          ))}
        </div>
      </div>
      {pelicula.proximamente ? (
        <div className="my-4 text-center">
          <button 
            onClick={handleToggleFavorite} 
            className={`px-6 py-2 rounded transition-colors ${
              isFavorite 
                ? 'bg-gray-800 border border-orange-500 text-gray-300 hover:bg-gray-700' 
                : 'bg-orange-500 text-white hover:bg-orange-600'
            }`}
          >
            {isFavorite ? "Eliminar de Favoritos" : "Agregar a Favoritos"}
          </button>
        </div>
      ) : (
        <section className="mt-8">
          <h2 className="text-2xl mb-4">Funciones</h2>
          <div className="flex gap-2 mb-4 overflow-x-auto">
            {next7Days.map((day) => (
              <button
                key={day.toISOString()}
                className={`flex-1 p-2 border rounded transition-all text-black ${
                  isSameDay(day, selectedDate) 
                    ? 'bg-orange-200 border-orange-400' 
                    : 'bg-gray-100 border-gray-300 hover:bg-gray-200'
                }`}
                onClick={() => setSelectedDate(day)}
              >
                {format(day, "EEE dd", { locale: es })}
              </button>
            ))}
          </div>
          {funcionesFiltradas.length > 0 ? (
            <div className="space-y-6">
              {[[TipoFuncion.DOBLADA, 'Doblada'], [TipoFuncion.SUBTITULADA, 'Subtitulada']].map(([tipo, label]) => (
                funcionesFiltradas.some(f => f.tipo === tipo) && (
                  <div key={tipo as string} className="space-y-3">
                    <h3 className="text-gray-400 text-lg border-b border-gray-300 pb-1">
                      {label}
                    </h3>
                    <div className="flex flex-wrap gap-4">
                      {funcionesFiltradas
                        .filter(f => f.tipo === tipo)
                        .sort((a, b) => new Date(a.fechaHora).getTime() - new Date(b.fechaHora).getTime())
                        .map((funcion) => (
                          <Link 
                            key={funcion.id} 
                            to={`/comprar/${funcion.id}`}
                            className="px-4 py-3 bg-gray-100 border border-gray-300 rounded transition-all hover:bg-gray-200 hover:scale-105 text-black"
                          >
                            {formatDateFromUTC(funcion.fechaHora)}
                          </Link>
                        ))}
                    </div>
                  </div>
                )
              ))}
            </div>
          ) : (
            <p className="text-gray-400">No hay funciones disponibles para el día seleccionado.</p>
          )}
        </section>
      )}
    </div>
  );
};

export default MovieDetail;