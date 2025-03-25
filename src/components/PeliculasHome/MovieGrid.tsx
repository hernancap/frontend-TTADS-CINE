import { Pelicula } from '../../types';
import MovieCard from './MovieCard';

interface Props {
    peliculas: Pelicula[];
}

const MovieGrid = ({ peliculas }: Props) => {
    return (
        <div className="movie-grid">
            {peliculas.map((pelicula) => (
                <MovieCard 
                    key={pelicula.id} 
                    pelicula={pelicula} 
                />
            ))}
        </div>
    );
};

export default MovieGrid;