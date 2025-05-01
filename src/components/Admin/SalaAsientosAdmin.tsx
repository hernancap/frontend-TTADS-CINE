import React, { useState, useEffect, useMemo } from 'react';

interface Asiento {
  fila: string;
  numero: number;
}

interface SalaAsientosAdminProps {
  numFilas: number;
  asientosPorFila: number;
  onGridChange: (selectedSeats: Asiento[]) => void;
}

const SalaAsientosAdmin: React.FC<SalaAsientosAdminProps> = ({ numFilas, asientosPorFila, onGridChange }) => {
  const [selected, setSelected] = useState<Asiento[]>([]);

  useEffect(() => {
    if (!numFilas || !asientosPorFila) return;
    const allSeats: Asiento[] = [];
    for (let i = 0; i < numFilas; i++) {
      const rowLetter = String.fromCharCode(65 + i);
      for (let j = 1; j <= asientosPorFila; j++) {
        allSeats.push({ fila: rowLetter, numero: j });
      }
    }    
    setSelected(allSeats);
    onGridChange(allSeats);
  }, [numFilas, asientosPorFila, onGridChange]);

  const toggleSeat = (asiento: Asiento) => {
    const exists = selected.some(s => s.fila === asiento.fila && s.numero === asiento.numero);
    const updated = exists 
      ? selected.filter(s => !(s.fila === asiento.fila && s.numero === asiento.numero))
      : [...selected, asiento];
    setSelected(updated);
    onGridChange(updated);
  };

  const grid = useMemo(() => {
    const grid = [];
    for (let i = 0; i < numFilas; i++) {
      const rowLetter = String.fromCharCode(65 + i);
      const rowSeats: Asiento[] = [];
      for (let j = 1; j <= asientosPorFila; j++) {
        rowSeats.push({ fila: rowLetter, numero: j });
      }
      grid.push({ row: rowLetter, seats: rowSeats });
    }
    return grid;
  }, [numFilas, asientosPorFila]);

  if (!numFilas || !asientosPorFila) {
    return <div>No se ha definido el tamaño.</div>;
  }

  return (
    <div className="overflow-x-auto max-w-full">
      <div className="flex flex-col gap-4 mt-4 min-w-max">
        {grid.map(rowObj => (
          <div key={rowObj.row} className="flex items-center gap-2">
            <span className="font-bold min-w-[1.5rem] text-center">{rowObj.row}</span>
            <div className="flex gap-[0.3rem] flex-wrap">
              {rowObj.seats.map(seat => {
                const isSelected = selected.some(s => s.fila === seat.fila && s.numero === seat.numero);
                return (
                  <button
                    type="button"
                    key={`${seat.fila}${seat.numero}`}
                    className={`w-[50px] h-[50px] border border-gray-600 rounded-md cursor-pointer transition-colors duration-200 ${
                      isSelected 
                        ? 'bg-green-600 text-white hover:bg-gray-700' 
                        : 'bg-gray-800 text-gray-200 hover:bg-gray-100'
                    }`}
                    onClick={() => toggleSeat(seat)}
                  >
                    {seat.fila}{seat.numero}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SalaAsientosAdmin;