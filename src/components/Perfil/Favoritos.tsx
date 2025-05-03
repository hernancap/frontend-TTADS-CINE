import { useEffect, useState } from "react";
import { useAuth } from "../../hooks/useAuth";
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
        setError(err instanceof Error ? err.message : 'Error desconocido');
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

  if (loading) return <div className="text-white text-xl mt-8 text-center">Cargando favoritos...</div>;
  if (error) return <div className="text-red-500 text-xl mt-8 text-center">Error: {error}</div>;

  return (
    <div className="p-4 max-w-2xl mx-auto bg-[#1e1e1e] text-white rounded-lg">
      <h1 className="text-3xl mb-4 text-center">Mis Favoritos</h1>
      {user?.favoritos && user.favoritos.length > 0 ? (
        <ul className="space-y-4">
          {user.favoritos.map((pelicula) => (
            <li 
              key={pelicula.id} 
              className="bg-[#2a2a2a] border border-[#444] rounded-md p-4 hover:bg-[#3a3a3a] transition-colors"
            >
              <h3 className="text-xl font-semibold">{pelicula.nombre}</h3>
              <p className="mt-1">Género: {pelicula.genero}</p>
              <p className="mt-1">Duración: {pelicula.duracion} min</p>
              <p className="mt-1">En Cartelera: {pelicula.enCartelera ? "Sí" : "No"}</p>
              <p className="mt-1">Próximamente: {pelicula.proximamente ? "Sí" : "No"}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-center text-gray-400 italic">No tienes películas favoritas.</p>
      )}
    </div>
  );
};

export default Favoritos;