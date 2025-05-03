import { useState } from "react";
import { AsientoFuncion } from "../../types";

interface SeatSelectionProps {
  asientosFuncion: AsientoFuncion[];
  onSelectionChange: (selectedAsientosFuncion: AsientoFuncion[]) => void;
}

const SeatSelection = ({ asientosFuncion, onSelectionChange }: SeatSelectionProps) => {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const handleSeatClick = (asientoFuncion: AsientoFuncion) => {
    if (asientoFuncion.estado !== "disponible") return;

    const id = asientoFuncion.id;
    let updatedIds: string[];

    if (selectedIds.includes(id)) {
      updatedIds = selectedIds.filter((asientoId) => asientoId !== id);
    } else {
      updatedIds = [...selectedIds, id];
    }

    const updatedObjects = asientosFuncion.filter((af) => updatedIds.includes(af.id));

    setSelectedIds(updatedIds);
    onSelectionChange(updatedObjects);
  };

  const asientosPorFila = asientosFuncion.reduce((acc: Record<string, AsientoFuncion[]>, af) => {
    const fila = af.asiento.fila;
    if (!acc[fila]) {
      acc[fila] = [];
    }
    acc[fila].push(af);
    acc[fila].sort((a, b) => a.asiento.numero - b.asiento.numero);
    return acc;
  }, {});

  const filasOrdenadas = Object.keys(asientosPorFila).sort();

  const numerosAsiento = asientosFuncion.map(a => a.asiento.numero);
  const numeroMinGlobal = numerosAsiento.length > 0 ? Math.min(...numerosAsiento) : 1;
  const numeroMaxGlobal = numerosAsiento.length > 0 ? Math.max(...numerosAsiento) : 1;

  const baseButtonClasses = [
    "w-10 h-10",
    "border rounded",
    "flex items-center justify-center",
    "text-xs font-medium",
    "transition duration-150 ease-in-out",
    "cursor-pointer",
  ].join(" ");

  const availableClasses = ["bg-neutral-800", "text-neutral-200", "hover:bg-neutral-700", "hover:border-neutral-500"];
  const selectedClasses  = ["bg-green-600", "border-green-700", "text-white", "hover:bg-green-700"];
  const occupiedClasses  = ["bg-neutral-600/50", "border-neutral-700", "text-neutral-400/60", "cursor-not-allowed"];

  return (
    <div className="overflow-x-auto max-w-full bg-gray-200 p-4 rounded-md shadow-inner">
      <div className="flex flex-col gap-3 my-2 min-w-max">
        {filasOrdenadas.map((fila) => (
          <div key={fila} className="flex items-center gap-2">
            <span className="font-bold w-8 text-center text-sm text-gray-600">{fila}</span>
            <div className="flex flex-nowrap gap-2">
              {Array.from({ length: numeroMaxGlobal - numeroMinGlobal + 1 }, (_, i) => {
                const numeroActual = numeroMinGlobal + i;
                const af = asientosPorFila[fila]?.find(a => a.asiento.numero === numeroActual);

                if (!af) {
                  return <span key={`ph-${fila}${numeroActual}`} className="w-10 h-10 rounded opacity-0"/>;
                }

                const isSelected = selectedIds.includes(af.id);
                const isOccupied = af.estado !== "disponible";

                let classes = [baseButtonClasses];
                if (isOccupied) {
                  classes = classes.concat(occupiedClasses);
                } else if (isSelected) {
                  classes = classes.concat(selectedClasses);
                } else {
                  classes = classes.concat(availableClasses);
                }

                return (
                  <button
                    key={af.id}
                    type="button"
                    className={classes.join(" ")}
                    disabled={isOccupied}
                    onClick={() => handleSeatClick(af)}
                    aria-label={`Asiento ${fila}${af.asiento.numero} - ${isOccupied ? 'Ocupado' : isSelected ? 'Seleccionado' : 'Disponible'}`}
                  >
                    {`${fila}${af.asiento.numero}`}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
         <div className="flex flex-wrap gap-x-4 gap-y-1 justify-center mt-4 pt-3 border-t border-gray-300">
            <div className="flex items-center gap-1">
                <span className="w-4 h-4 rounded border border-neutral-600 bg-neutral-800 inline-block"></span>
                <span className="text-xs text-gray-600">Disponible</span>
            </div>
            <div className="flex items-center gap-1">
                <span className="w-4 h-4 rounded border border-green-700 bg-green-600 inline-block"></span>
                <span className="text-xs text-gray-600">Seleccionado</span>
            </div>
            <div className="flex items-center gap-1">
                <span className="w-4 h-4 rounded border border-neutral-700 bg-neutral-600/50 inline-block"></span>
                <span className="text-xs text-gray-600">Ocupado</span>
            </div>
        </div>
      </div>
    </div>
  );
};

export default SeatSelection;