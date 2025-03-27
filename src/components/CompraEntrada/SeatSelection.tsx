import { useState } from "react";
import "./SeatSelection.css";

export interface Asiento {
	id: string;
	fila: string;
	numero: number;
	isOccupied: boolean;
}

interface SeatSelectionProps {
	asientos: Asiento[];
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

	const asientosPorFila = asientos.reduce(
		(acc: Record<string, Asiento[]>, asiento) => {
			if (!acc[asiento.fila]) {
				acc[asiento.fila] = [];
			}
			acc[asiento.fila].push(asiento);
			return acc;
		},
		{}
	);

	const filasOrdenadas = Object.keys(asientosPorFila).sort();

	return (
		<div className="seat-selection">
			{filasOrdenadas.map((fila) => (
				<div key={fila} className="seat-row">
					<span className="row-label">{fila}</span>
					<div className="seat-row-buttons">
						{asientosPorFila[fila]
							.sort((a, b) => a.numero - b.numero)
							.map((asiento) => (
								<button
									type="button"
									key={asiento.id}
									className={`seat-button ${
										selected.includes(asiento.id)
											? "selected"
											: ""
									}`}
									disabled={asiento.isOccupied}
									onClick={() => handleSeatClick(asiento.id)}
								>
									{`${asiento.fila}${asiento.numero}`}
								</button>
							))}
					</div>
				</div>
			))}
		</div>
	);
};

export default SeatSelection;
