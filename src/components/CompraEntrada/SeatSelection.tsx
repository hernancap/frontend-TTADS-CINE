import { useState } from "react";
import "./SeatSelection.css";
import { AsientoFuncion } from "../../types"; 

interface SeatSelectionProps {
  asientosFuncion: AsientoFuncion[];
  onSelectionChange: (selectedAsientosFuncion: AsientoFuncion[]) => void;
}

const SeatSelection = ({ asientosFuncion, onSelectionChange }: SeatSelectionProps) => {
	const [selectedIds, setSelectedIds] = useState<string[]>([]);
	const [selectedAsientosFuncionObjects, setSelectedAsientosFuncionObjects] = useState<AsientoFuncion[]>([]);
  
	const handleSeatClick = (asientoFuncion: AsientoFuncion) => {
	  const id = asientoFuncion.id;
	  let updatedIds: string[];
      let updatedObjects: AsientoFuncion[];

	  if (selectedIds.includes(id)) {
		updatedIds = selectedIds.filter((asientoId) => asientoId !== id);
      	updatedObjects = selectedAsientosFuncionObjects.filter((asientoFuncion) => asientoFuncion.id !== id);
	  } else {
		updatedIds = [...selectedIds, id];
      	updatedObjects = [...selectedAsientosFuncionObjects, asientoFuncion];
	  }
	  
	  setSelectedIds(updatedIds);
      setSelectedAsientosFuncionObjects(updatedObjects);
      onSelectionChange(updatedObjects);
	};
  
	const asientosPorFila = asientosFuncion.reduce((acc: Record<string, AsientoFuncion[]>, af) => {
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
	
				  {asientosOrdenados.map((asientoFuncion) => {
					const isSelected = selectedIds.includes(asientoFuncion.id);
					const ocupado = asientoFuncion.estado !== "disponible";
					return (
					  <button
						type="button"
						key={asientoFuncion.id}
						className={`seat-button ${isSelected ? "selected" : ""}`}
						disabled={ocupado}
						onClick={() => handleSeatClick(asientoFuncion)} 
					  >
						{`${asientoFuncion.asiento.fila}${asientoFuncion.asiento.numero}`}
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
