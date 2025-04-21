import { Pelicula } from '../../types';
import { Link } from 'react-router-dom';
const API = import.meta.env.VITE_API_BASE_URL.replace('/api','')

interface Props {
  pelicula: Pelicula;
}

const MovieCard = ({ pelicula }: Props) => {
  return (
    <Link to={`/pelicula/${pelicula.id}`} className="movie-card-link">
      <div className="movie-card">
        <img 
          src={pelicula.poster_path ? `${API}/uploads/${pelicula.poster_path}` : 'src/assets/default_poster.jpeg' } 
          alt={pelicula.nombre}
          className="movie-poster"
        />
        <div className="movie-info">
          <h3>{pelicula.nombre}</h3>
        </div>
      </div>
    </Link>
  );
};

export default MovieCard;
