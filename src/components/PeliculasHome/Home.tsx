import React, { useEffect, useState } from 'react';
import { getPeliculas } from '../../api/pelicula.ts';
import { Pelicula } from '../../types.ts';
import MovieGrid from './MovieGrid.tsx';
import Proximamente from './Proximamente.tsx';

const Home: React.FC = () => {
  const [peliculas, setPeliculas] = useState<Pelicula[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPeliculas = async () => {
      try {
        const response = await getPeliculas({ enCartelera: true});
        setPeliculas(response.data);
      } catch (err) {
        console.error(err);
        setError('Error al cargar las películas');
      } finally {
        setLoading(false);
      }
    };
    fetchPeliculas();
  }, []);

  if (loading) return <div>Cargando...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="container">
      <h1>Cartelera</h1>
      <MovieGrid peliculas={peliculas} />
      <Proximamente />
    </div>
  );
};

export default Home;
