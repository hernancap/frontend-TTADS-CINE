import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import SeatSelection, { Asiento } from "./SeatSelection";
import { createEntrada } from "../api/entrada";
import { getFuncion } from "../api/funcion";
import { getAsientosAvailability } from "../api/sala"; 
import { getCuponesUser } from "../api/cupon"; 
import "./PurchaseForm.css";
import { Funcion, Cupon } from "../types";
import { useAuth } from "../hooks/useAuth"; 

const PurchaseForm = () => {
  const { id: funcionId } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [clientName, setClientName] = useState(user?.nombre || "");
  const [clientEmail, setClientEmail] = useState(user?.email || "");

  const [availableSeats, setAvailableSeats] = useState<Asiento[]>([]);
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [funcion, setFuncion] = useState<Funcion>({} as Funcion);
  const [loading, setLoading] = useState(true);

  const [cupones, setCupones] = useState<Cupon[]>([]);
  const [selectedCuponId, setSelectedCuponId] = useState<string>("");

  const totalPrice = funcion.precio ? funcion.precio * selectedSeats.length : 0;

  const selectedCupon = cupones.find(c => c.id === selectedCuponId);
  const finalPrice = selectedCupon
    ? totalPrice - (totalPrice * (selectedCupon.descuento || 0)) / 100
    : totalPrice;

  useEffect(() => {
    if (user) {
      setClientName(user.nombre);
      setClientEmail(user.email);
      getCuponesUser(user.id)
        .then(response => {
          const now = new Date();
          const validCupones = response.data.filter((c: Cupon) => new Date(c.fechaExpiracion) > now);
          validCupones.sort((a: Cupon, b: Cupon) => new Date(a.fechaExpiracion).getTime() - new Date(b.fechaExpiracion).getTime());
          setCupones(validCupones);
        })
        .catch(err => console.error("Error al obtener cupones:", err));
    }
  }, [user]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const funcionResponse = await getFuncion(funcionId!);
        setFuncion(funcionResponse.data);

        const asientosResponse = await getAsientosAvailability(funcionId!);
        setAvailableSeats(asientosResponse.data);
      } catch (error) {
        console.error("Error al obtener función o asientos:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [funcionId]);

  const handleSeatSelection = (selectedIds: string[]) => {
    setSelectedSeats(selectedIds);
  };

  const handleCouponChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCuponId(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName || !clientEmail || selectedSeats.length === 0) {
      alert("Por favor, completa tus datos y selecciona al menos un asiento.");
      return;
    }
    if (!user) {
      alert("Debes estar logueado para realizar la compra.");
      return;
    }

    try {
      const precio = funcion.precio;
      for (const seatId of selectedSeats) {
        await createEntrada({
          precio: precio,
          usuario: user.id,
          funcion: funcionId!,
          asiento: seatId,
        });
      }
      alert("Compra realizada con éxito");
      navigate("/confirmacion");
    } catch (error) {
      console.error("Error durante la compra:", error);
      alert("Error al procesar la compra. Intenta nuevamente.");
    }
  };

  if (loading) return <p>Cargando...</p>;

  return (
    <div className="purchase-form">
      <h1>Compra de Entrada</h1>
      <form onSubmit={handleSubmit} className="purchase-form__form">
        <div className="client-data">
          <label>
            Nombre:
            <input
              type="text"
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              required
            />
          </label>
          <label>
            Email:
            <input
              type="email"
              value={clientEmail}
              onChange={(e) => setClientEmail(e.target.value)}
              required
            />
          </label>
        </div>

        <div className="seat-selection-container">
          <h2>Elige tu(s) asiento(s)</h2>
          <SeatSelection asientos={availableSeats} onSelectionChange={handleSeatSelection} />
        </div>

        <div className="price-info">
          <p>
            <strong>Precio por entrada:</strong> ${funcion.precio.toFixed(2)}
          </p>
          <p>
            <strong>Precio total:</strong> ${totalPrice.toFixed(2)}
          </p>
        </div>

        <div className="coupon-selection">
          <label>
            Aplica un cupón:
            <select value={selectedCuponId} onChange={handleCouponChange}>
              <option value="">-- Sin cupón --</option>
              {cupones.map((cupon) => (
                <option key={cupon.id} value={cupon.id}>
                  {`Descuento: ${cupon.descuento}% - Expira: ${new Date(cupon.fechaExpiracion).toLocaleDateString()}`}
                </option>
              ))}
            </select>
          </label>
        </div>

        {selectedCupon && (
          <div className="final-price">
            <p>
              <strong>Total con descuento:</strong> ${finalPrice.toFixed(2)}
            </p>
          </div>
        )}

        <button type="submit" className="purchase-button">
          Comprar
        </button>
      </form>
    </div>
  );
};

export default PurchaseForm;
