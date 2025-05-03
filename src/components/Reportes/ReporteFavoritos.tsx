import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { getReporteFavoritos, ReporteFavorito } from '../../api/pelicula.ts';

const Card: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => (
  <div className={`bg-[#1e1e1e] rounded-xl shadow-lg p-6 ${className ?? ''}`}>
    {children}
  </div>
);

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

  if (loading) return <p className="text-center text-gray-400">Cargando reporte...</p>;
  if (error)   return <p className="text-center text-red-500">Error: {error}</p>;
  if (data.length === 0) return <p className="text-center text-gray-500">No hay películas favoritas próximas.</p>;

  return (
    <Card>
      <h2 className="text-2xl font-semibold mb-4 text-white text-center">
        Películas más marcadas como favoritas
      </h2>
      <div className="w-full h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            layout="vertical"
            margin={{ top: 20, right: 30, left: 100, bottom: 20 }}
          >
            <CartesianGrid stroke="#444" strokeDasharray="3 3" />
            <XAxis
              type="number"
              tick={{ fill: '#ccc' }}
              axisLine={{ stroke: '#666' }}
              tickLine={false}
            />
            <YAxis
              dataKey="nombre"
              type="category"
              tick={{ fill: '#ccc', fontSize: '0.875rem' }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              contentStyle={{ backgroundColor: '#2a2a2a', borderColor: '#444' }}
              itemStyle={{ color: '#fff' }}
            />
            <Bar dataKey="cantidadFavoritos" fill="#3b82f6" radius={[4, 4, 4, 4]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};

export default ReporteFavoritos;
