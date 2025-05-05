import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { getReporteEntradasPorPelicula, ReporteEntradaPorPelicula } from '../../api/entrada.ts';

const Card: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => (
  <div className={`bg-[#1e1e1e] rounded-xl shadow-lg p-6 ${className ?? ''}`}>
    {children}
  </div>
);

const ReporteEntradas: React.FC = () => {
  const [data, setData] = useState<ReporteEntradaPorPelicula[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getReporteEntradasPorPelicula()
    .then((res) => {
      const sortedData = res.slice().sort((a: ReporteEntradaPorPelicula, b: ReporteEntradaPorPelicula) => 
        b.cantidad - a.cantidad
      );
      setData(sortedData);
    })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="text-center text-gray-400">Cargando reporte...</p>;
  if (error)   return <p className="text-center text-red-500">Error: {error}</p>;

  return (
    <Card className="mb-8">
      <h2 className="text-2xl font-semibold mb-4 text-white text-center">
        Entradas vendidas por película (últimos 7 días)
      </h2>
      <div className="w-full h-[800px]">
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
              dataKey="pelicula"
              type="category"
              tick={{ fill: '#ccc', fontSize: '0.875rem' }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              contentStyle={{ backgroundColor: '#2a2a2a', borderColor: '#444' }}
              itemStyle={{ color: '#fff' }}
            />
            <Bar dataKey="cantidad" fill="#10b981" radius={[4, 4, 4, 4]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};

export default ReporteEntradas;
