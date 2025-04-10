import React, { useState, useEffect, useMemo } from 'react';
import './SalaAsientosAdmin.css';

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
    <div className="admin-seat-grid">
      {grid.map(rowObj => (
        <div key={rowObj.row} className="seat-row">
          <span className="row-label">{rowObj.row}</span>
          <div className="seat-row-buttons">
            {rowObj.seats.map(seat => {
              const isSelected = selected.some(s => s.fila === seat.fila && s.numero === seat.numero);
              return (
                <button
                  type="button"
                  key={`${seat.fila}${seat.numero}`}
                  className={`seat-button ${isSelected ? 'selected' : ''}`}
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
  );
};

export default SalaAsientosAdmin;