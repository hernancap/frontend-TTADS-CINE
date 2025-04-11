import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import SeatSelection from "./SeatSelection";
import { getFuncion } from "../../api/funcion";
import { getAsientosFuncion } from "../../api/sala"; 
import { getCuponesUser } from "../../api/cupon"; 
import "./PurchaseForm.css";
import { Funcion, Cupon, AsientoFuncion, TipoFuncion } from "../../types";
import { useAuth } from "../../hooks/useAuth"; 
import { createPreference } from "../../api/pago";
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

const PurchaseForm = () => {
  const { id: funcionId } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [clientName, setClientName] = useState(user?.nombre || "");
  const [clientEmail, setClientEmail] = useState(user?.email || "");
  const [availableAsientosFuncion, setAvailableSeats] = useState<AsientoFuncion[]>([]);
  const [selectedAsientosFuncion, setselectedAsientosFuncion] = useState<AsientoFuncion[]>([]);
  const [funcion, setFuncion] = useState<Funcion>({} as Funcion);
  const [loading, setLoading] = useState(true);
  const [cupones, setCupones] = useState<Cupon[]>([]);
  const [selectedCuponId, setSelectedCuponId] = useState<string>("");

  const totalPrice = funcion.precio ? funcion.precio * selectedAsientosFuncion.length : 0;
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

        const asientosResponse = await getAsientosFuncion(funcionId!);
        setAvailableSeats(asientosResponse.data);
      } catch (error) {
        console.error("Error al obtener función o asientos:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [funcionId]);

  const handleSeatSelection = (selectedIds: AsientoFuncion[]) => {
    setselectedAsientosFuncion(selectedIds);
  };

  const handleCouponChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCuponId(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName || !clientEmail || selectedAsientosFuncion.length === 0) {
      alert("Por favor, completa tus datos y selecciona al menos un asiento.");
      return;
    }
    if (!user) {
      alert("Debes estar logueado para realizar la compra.");
      return;
    }

    try {
      const item = {
        id: "entrada-cine", 
        title: "Entrada Cine",
        quantity: selectedAsientosFuncion.length,
        unit_price: finalPrice / selectedAsientosFuncion.length, 
      };

      const selectedAsientosFuncionIds = selectedAsientosFuncion.map(asientoFuncion => asientoFuncion.id);
      const response = await createPreference([item], user.id, funcionId!, selectedAsientosFuncionIds);
      console.log("Preference creada:", response.preferenceId);

      localStorage.setItem('preferenceId', response.preferenceId);

      localStorage.setItem('compraDetalle', JSON.stringify({
        pelicula: funcion.pelicula.nombre,
        horario: funcion.fechaHora,
        precioPorEntrada: funcion.precio,
        cantidadEntradas: selectedAsientosFuncion.length,
        asientosSeleccionados: selectedAsientosFuncion.map(asientoFuncion => `${asientoFuncion.asiento.fila}${asientoFuncion.asiento.numero}`),
        precioTotalSinDescuento: totalPrice,
        cuponSeleccionado: selectedCupon ? { id: selectedCupon.id, descuento: selectedCupon.descuento } : null,
        precioTotalConDescuento: finalPrice,
      }));

      navigate("/pago");
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
            <input type="text" value={clientName} onChange={(e) => setClientName(e.target.value)} required />
          </label>
          <label>
            Email:
            <input type="email" value={clientEmail} onChange={(e) => setClientEmail(e.target.value)} required />
          </label>
        </div>
        <div className="function-details">
          <h2>{funcion.pelicula?.nombre}</h2>
          <div className="function-info">
            <p><strong>Tipo de función:</strong> {funcion.tipo === TipoFuncion.DOBLADA ? "DOBLADA / ESPAÑOL" : "SUBTITULADA"}</p>
            <p><strong>Fecha y hora:</strong> {format(new Date(funcion.fechaHora), "EEEE d 'de' MMMM 'a las' HH:mm 'hs'", { locale: es })}</p>
          </div>
        </div>
        <div className="seat-selection-container">
          <h2>Elige tu(s) asiento(s)</h2>
          <SeatSelection asientosFuncion ={availableAsientosFuncion} onSelectionChange={handleSeatSelection} />
        </div>
        <div className="price-info">
          <p><strong>Precio por entrada:</strong> ${funcion.precio.toFixed(2)}</p>
          <p><strong>Precio total:</strong> ${totalPrice.toFixed(2)}</p>
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
            <p><strong>Total con descuento:</strong> ${finalPrice.toFixed(2)}</p>
          </div>
        )}
        <button type="submit" className="purchase-button">Comprar</button>
      </form>
    </div>
  );
};

export default PurchaseForm;
