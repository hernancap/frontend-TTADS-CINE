import { Pelicula } from '../../types';
import MovieCard from './MovieCard';

interface Props {
    peliculas: Pelicula[];
}

const MovieGrid = ({ peliculas }: Props) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 justify-items-center">
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