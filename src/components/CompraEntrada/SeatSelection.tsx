import { useState } from "react";
import "./SeatSelection.css";
import { AsientoFuncion } from "../../types"; 

interface SeatSelectionProps {
  asientos: AsientoFuncion[];
  onSelectionChange: (selectedIds: string[]) => void;
}

const SeatSelection = ({ asientos, onSelectionChange }: SeatSelectionProps) => {
	const [selected, setSelected] = useState<string[]>([]);
  
	const handleSeatClick = (id: string) => {
	  let updated: string[];
	  if (selected.includes(id)) {
		updated = selected.filter((seatId) => seatId !== id);
	  } else {
		updated = [...selected, id];
	  }
	  setSelected(updated);
	  onSelectionChange(updated);
	};
  
	const asientosPorFila = asientos.reduce((acc: Record<string, AsientoFuncion[]>, af) => {
	  const fila = af.asiento.fila;
	  if (!acc[fila]) {
		acc[fila] = [];
	  }
	  acc[fila].push(af);
	  return acc;
	}, {});
  
	const filasOrdenadas = Object.keys(asientosPorFila).sort();
  
	return (
	  <div className="seat-selection">
		{filasOrdenadas.map((fila) => {
		  const asientosOrdenados = asientosPorFila[fila].sort((a, b) => a.asiento.numero - b.asiento.numero);
  
		  const minNumero = asientosOrdenados.length > 0 ? asientosOrdenados[0].asiento.numero : 1;
  
		  return (
			<div key={fila} className="seat-row">
			  <span className="row-label">{fila}</span>
			  <div className="seat-row-buttons">
				{Array.from({ length: minNumero - 1 }).map((_, index) => (
				  <span key={`empty-${fila}-${index}`} className="seat-placeholder"></span>
				))}
  
				{asientosOrdenados.map((af) => {
				  const isSelected = selected.includes(af.id);
				  const ocupado = af.estado !== "disponible";
				  return (
					<button
					  type="button"
					  key={af.id}
					  className={`seat-button ${isSelected ? "selected" : ""}`}
					  disabled={ocupado}
					  onClick={() => handleSeatClick(af.id)}
					>
					  {`${af.asiento.fila}${af.asiento.numero}`}
					</button>
				  );
				})}
			  </div>
			</div>
		  );
		})}
	  </div>
	);
  };
  
export default SeatSelection;
