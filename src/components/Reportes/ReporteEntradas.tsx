import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { getReporteEntradasPorPelicula, ReporteEntradaPorPelicula } from '../../api/entrada.ts';

const ReporteEntradas: React.FC = () => {
  const [data, setData] = useState<ReporteEntradaPorPelicula[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getReporteEntradasPorPelicula()
      .then(setData)
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Cargando reporte...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div style={{ width: '100%', height: 400 }}>
      <h2>Entradas vendidas por película (últimos 7 días)</h2>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} layout="vertical" margin={{ top: 20, right: 30, left: 100, bottom: 20 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis type="number" />
          <YAxis dataKey="pelicula" type="category" />
          <Tooltip />
          <Bar dataKey="cantidad" fill="#8884d8" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ReporteEntradas;
