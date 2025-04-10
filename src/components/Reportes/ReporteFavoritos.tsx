import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { getReporteFavoritos } from '../../api/pelicula.ts';

interface ReporteFavorito {
  id: string;
  nombre: string;
  cantidadFavoritos: number;
}

const ReporteFavoritos: React.FC = () => {
  const [data, setData] = useState<ReporteFavorito[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getReporteFavoritos()
      .then(res => setData(res.data))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Cargando reporte...</p>;
  if (error) return <p>Error: {error}</p>;
  if (data.length === 0) return <p>No hay películas favoritas próximas.</p>;

  return (
    <div style={{ width: '100%', height: 400 }}>
      <h2>Películas más marcadas como favoritas</h2>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} layout="vertical" margin={{ top: 20, right: 30, left: 100, bottom: 20 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis type="number" />
          <YAxis dataKey="nombre" type="category" />
          <Tooltip />
          <Bar dataKey="cantidadFavoritos" fill="#82ca9d" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ReporteFavoritos;
