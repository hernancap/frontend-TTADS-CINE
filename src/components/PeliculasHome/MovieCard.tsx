import { Pelicula } from '../../types';
import { Link } from 'react-router-dom';
const API = import.meta.env.VITE_API_BASE_URL.replace('/api','')

interface Props {
  pelicula: Pelicula;
}

const MovieCard = ({ pelicula }: Props) => {
  return (
    <Link 
      to={`/pelicula/${pelicula.id}`} 
      className="block max-w-sm w-full mx-auto"
    >
      <div className="bg-white text-black border border-gray-300 rounded-lg overflow-hidden shadow-md hover:scale-102 transition-transform cursor-pointer">
        <img 
          src={pelicula.poster_path ? `${API}/uploads/${pelicula.poster_path}` : 'src/assets/default_poster.jpeg'} 
          alt={pelicula.nombre}
          className="w-full aspect-[2/3] object-cover"
        />
        <div className="p-3 flex flex-col gap-2">
          <h3 className="text-xl font-semibold mb-2">{pelicula.nombre}</h3>
          <div className="flex justify-between text-sm">
            <span>{pelicula.genero}</span>
            <span>{pelicula.duracion} min</span>
          </div>
          <div className="flex flex-wrap gap-1">
            {pelicula.actors.map(actor => (
              <span 
                key={actor.id} 
                className="bg-gray-200 text-gray-700 px-2 py-0.5 rounded"
              >
                {actor.nombre}
              </span>
            ))}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default MovieCard;
