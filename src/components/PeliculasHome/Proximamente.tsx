import React, { useEffect, useState, useRef } from 'react';
import { Pelicula } from '../../types';
import { getPeliculas } from '../../api/pelicula'; 
import MovieCard from './MovieCard';
import './Proximamente.css';

const Proximamente: React.FC = () => {
  const [peliculas, setPeliculas] = useState<Pelicula[]>([]);
  const [loading, setLoading] = useState(true);

  const carouselRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchProximamente = async () => {
      try {
        const response = await getPeliculas({ proximamente: true });
        const proximamente = response.data.filter(
          pelicula => !pelicula.enCartelera && pelicula.proximamente
        );
        setPeliculas(proximamente);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchProximamente();
  }, []);

  const scrollLeft = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({
        left: -320,
        behavior: 'smooth'
      });
    }
  };

  const scrollRight = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({
        left: 320,
        behavior: 'smooth'
      });
    }
  };

  if (loading) return <div>Cargando próximas películas...</div>;

  return (
    <div className="upcoming-carousel">
      <h2>Próximamente</h2>
      <div className="carousel-wrapper">
        <button className="carousel-btn left" onClick={scrollLeft}>
          &#9664;
        </button>
        <div className="carousel-container" ref={carouselRef}>
          {peliculas.map(pelicula => (
            <MovieCard key={pelicula.id} pelicula={pelicula} />
          ))}
        </div>
        <button className="carousel-btn right" onClick={scrollRight}>
          &#9654;
        </button>
      </div>
    </div>
  );
};

export default Proximamente;
