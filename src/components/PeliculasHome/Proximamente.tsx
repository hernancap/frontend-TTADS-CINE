import React, { useEffect, useState, useRef } from 'react';
import { Pelicula } from '../../types';
import { getPeliculas } from '../../api/pelicula'; 
import MovieCard from './MovieCard';

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
        console.error('Error al cargar la información:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProximamente();
  }, []);

  const scrollLeft = () => {
    carouselRef.current?.scrollBy({ left: -320, behavior: 'smooth' });
  };

  const scrollRight = () => {
    carouselRef.current?.scrollBy({ left: 320, behavior: 'smooth' });
  };

  if (loading) return <div className="text-white text-xl mt-8 text-center">Cargando próximas películas...</div>;

  return (
    <div className="max-w-6xl mx-auto p-4">
      <h2 className="text-2xl text-white text-center mb-4">Próximamente</h2>
      <div className="relative">
        <button 
          className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/80 rounded-full w-10 h-10 flex items-center justify-center text-white z-10 hover:bg-black"
          onClick={scrollLeft}
        >
          ‹
        </button>
        <div 
          className="flex gap-4 overflow-x-auto pb-4 scroll-smooth [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
          ref={carouselRef}
        >
          {peliculas.map(pelicula => (
            <div key={pelicula.id} className="w-[300px] flex-none">
              <MovieCard pelicula={pelicula} />
            </div>
          ))}
        </div>
        <button 
          className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/80 rounded-full w-10 h-10 flex items-center justify-center text-white z-10 hover:bg-black"
          onClick={scrollRight}
        >
          ›
        </button>
      </div>
    </div>
  );
};

export default Proximamente;