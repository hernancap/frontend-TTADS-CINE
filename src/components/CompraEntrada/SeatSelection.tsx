import { useState } from "react";
import "./SeatSelection.css";
import { AsientoFuncion } from "../../types"; 

interface SeatSelectionProps {
  asientosFuncion: AsientoFuncion[];
  onSelectionChange: (selectedAsientosFuncion: AsientoFuncion[]) => void;
}

const SeatSelection = ({ asientosFuncion, onSelectionChange }: SeatSelectionProps) => {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const handleSeatClick = (asientoFuncion: AsientoFuncion) => {
    const id = asientoFuncion.id;
    let updatedIds: string[];
    let updatedObjects: AsientoFuncion[];

    if (selectedIds.includes(id)) {
      updatedIds = selectedIds.filter((asientoId) => asientoId !== id);
      updatedObjects = asientosFuncion.filter((af) => updatedIds.includes(af.id));
    } else {
      updatedIds = [...selectedIds, id];
      updatedObjects = [...asientosFuncion.filter((af) => updatedIds.includes(af.id))];
    }

    setSelectedIds(updatedIds);
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
  const numeroMinGlobal = Math.min(...asientosFuncion.map(a => a.asiento.numero));
  const numeroMaxGlobal = Math.max(...asientosFuncion.map(a => a.asiento.numero));

  return (
    <div className="seat-selection-wrapper">
      <div className="seat-selection">
        {filasOrdenadas.map((fila) => {
          const asientosOrdenados = asientosPorFila[fila].sort((a, b) => a.asiento.numero - b.asiento.numero);

          return (
            <div key={fila} className="seat-row">
              <span className="row-label">{fila}</span>
              <div className="seat-row-buttons">
                {Array.from({ length: numeroMaxGlobal - numeroMinGlobal + 1 }, (_, i) => {
                  const numeroActual = numeroMinGlobal + i;
                  const asientoFuncion = asientosOrdenados.find(a => a.asiento.numero === numeroActual);

                  if (!asientoFuncion) {
                    return (
                      <span
                        key={`placeholder-${fila}-${numeroActual}`}
                        className="seat-placeholder"
                      />
                    );
                  }

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
    </div>
  );
};

export default SeatSelection;
