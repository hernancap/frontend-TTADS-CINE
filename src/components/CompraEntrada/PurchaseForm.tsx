import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import SeatSelection from "./SeatSelection";
import { getFuncion } from "../../api/funcion";
import { getAsientosFuncion } from "../../api/sala";
import { getCuponesUser } from "../../api/cupon";
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

  const precioPorEntrada = funcion?.precio ?? 0;
  const totalPrice = precioPorEntrada * selectedAsientosFuncion.length;
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
          const validCupones = response.data
            .filter((c: Cupon) => new Date(c.fechaExpiracion) > now)
            .sort((a: Cupon, b: Cupon) => new Date(a.fechaExpiracion).getTime() - new Date(b.fechaExpiracion).getTime());
          setCupones(validCupones);
        })
        .catch(err => console.error("Error al obtener cupones:", err));
    }
  }, [user]);

  useEffect(() => {
    const fetchData = async () => {
      if (!funcionId) {
         console.error("funcionId no está definido");
         setLoading(false);
         return;
      }
      setLoading(true);
      try {
        const funcionResponse = await getFuncion(funcionId);
        setFuncion(funcionResponse.data);

        const asientosResponse = await getAsientosFuncion(funcionId);
        setAvailableSeats(asientosResponse.data);
      } catch (error) {
        console.error("Error al obtener función o asientos:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [funcionId]);

  const handleSeatSelection = (selectedSeats: AsientoFuncion[]) => {
    setselectedAsientosFuncion(selectedSeats);
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
      navigate('/login');
      return;
    }
    if (!funcion || !funcion.pelicula || !funcionId) {
       alert("Error: Faltan datos de la función para procesar la compra.");
       return;
    }

    try {
      const unitPriceFinal = selectedAsientosFuncion.length > 0
        ? finalPrice / selectedAsientosFuncion.length
        : 0;

      const item = {
        id: `entrada-${funcionId}`,
        title: `Entrada ${funcion.pelicula.nombre} - ${format(new Date(funcion.fechaHora), "dd/MM HH:mm", { locale: es })}`,
        description: `Asientos: ${selectedAsientosFuncion.map(af => `${af.asiento.fila}${af.asiento.numero}`).join(', ')}`,
        quantity: selectedAsientosFuncion.length,
        unit_price: unitPriceFinal, 
        currency_id: 'ARS' 
      };

      const selectedAsientosFuncionIds = selectedAsientosFuncion.map(asientoFuncion => asientoFuncion.id);
      const response = await createPreference([item], user.id, funcionId, selectedAsientosFuncionIds);
      console.log("Preference creada:", response.preferenceId);

      localStorage.setItem('preferenceId', response.preferenceId);
      localStorage.setItem('compraDetalle', JSON.stringify({
        pelicula: funcion.pelicula.nombre,
        horario: funcion.fechaHora,
        precioPorEntrada: precioPorEntrada,
        cantidadEntradas: selectedAsientosFuncion.length,
        asientosSeleccionados: selectedAsientosFuncion.map(asientoFuncion => `${asientoFuncion.asiento.fila}${asientoFuncion.asiento.numero}`),
        precioTotalSinDescuento: totalPrice,
        cuponSeleccionado: selectedCupon ? { id: selectedCupon.id, descuento: selectedCupon.descuento } : null,
        precioTotalConDescuento: finalPrice,
      }));

      navigate("/pago");

    } catch (error) {
      console.error("Error durante la creación de la preferencia:", error);
      alert("Error al procesar la compra. Intenta nuevamente o contacta soporte.");
    }
  };

  if (loading) return <p className="text-center text-neutral-300 mt-10 text-lg">Cargando detalles de la función...</p>;
  if (!loading && !funcion?.id) return <p className="text-center text-red-500 mt-10 text-lg">No se pudo cargar la información de la función.</p>;

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-3xl font-bold text-center mb-6 text-neutral-100">Compra de Entrada</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-6 bg-white p-6 border border-gray-200 rounded-lg shadow-lg text-gray-800"> 
        <div className="flex flex-col gap-4">
          <h2 className="text-xl font-semibold mb-2 text-gray-700">Tus Datos</h2>
          <label className="flex flex-col font-semibold text-gray-700">
            Nombre:
            <input
              type="text"
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              required
              className="p-2 border border-gray-300 rounded mt-1 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder:text-gray-400"
              placeholder="Tu nombre completo"
            />
          </label>
          <label className="flex flex-col font-semibold text-gray-700">
            Email:
            <input
              type="email"
              value={clientEmail}
              onChange={(e) => setClientEmail(e.target.value)}
              required
              className="p-2 border border-gray-300 rounded mt-1 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder:text-gray-400"
              placeholder="tu.email@ejemplo.com"
            />
          </label>
        </div>
        <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
          <h2 className="text-xl font-semibold mb-3 text-slate-800">
            {funcion.pelicula?.nombre ?? 'Película no encontrada'}
          </h2>
          <div className="text-sm space-y-1 text-gray-700"> 
            <p>
              <strong className="text-slate-700">Tipo:</strong> {funcion.tipo === TipoFuncion.DOBLADA ? "DOBLADA / ESPAÑOL" : "SUBTITULADA"}
            </p>
            <p>
              <strong className="text-slate-700">Fecha y hora:</strong> {funcion.fechaHora
                ? format(new Date(funcion.fechaHora), "EEEE d 'de' MMMM 'a las' HH:mm 'hs'", { locale: es })
                : 'Fecha no disponible'
              }
            </p>
             <p>
               <strong className="text-slate-700">Precio por entrada:</strong> ${precioPorEntrada.toFixed(2)}
             </p>
          </div>
        </div>
        <div className="mt-4">
          <h2 className="text-xl font-semibold mb-3 text-gray-700">Elige tu(s) asiento(s)</h2>
          <SeatSelection asientosFuncion={availableAsientosFuncion} onSelectionChange={handleSeatSelection} />
        </div>
        {selectedAsientosFuncion.length > 0 && (
          <div className="flex flex-col gap-2 p-4 border border-gray-200 rounded-lg bg-gray-100">
             <h3 className="text-lg font-semibold text-gray-700 mb-1">Resumen</h3>
             <p className="text-lg font-medium text-gray-800">
               {selectedAsientosFuncion.length} entrada(s) x ${precioPorEntrada.toFixed(2)} = <strong className="text-black">${totalPrice.toFixed(2)}</strong>
             </p>
          </div>
        )}
        {cupones.length > 0 && selectedAsientosFuncion.length > 0 && (
          <div className="flex flex-col gap-2 p-4 border border-gray-200 rounded-lg bg-gray-100">
            <label className="flex flex-col font-semibold text-gray-700">
              Aplica un cupón:
              <select
                value={selectedCuponId}
                onChange={handleCouponChange}
                className="mt-2 p-2 border border-gray-300 rounded bg-neutral-700 text-white cursor-pointer transition-colors duration-200 ease-in-out hover:border-gray-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="">-- Sin cupón --</option>
                {cupones.map((cupon) => (
                  <option key={cupon.id} value={cupon.id}>
                    {`DTO ${cupon.descuento}% - ${cupon.codigo} (Exp: ${new Date(cupon.fechaExpiracion).toLocaleDateString('es-AR')})`}
                  </option>
                ))}
              </select>
            </label>
          </div>
        )}
        {selectedCupon && selectedAsientosFuncion.length > 0 && (
          <div className="flex flex-col gap-2 p-4 border border-green-300 rounded-lg bg-green-50">
             <p className="text-xl font-bold text-green-700">
               Total con descuento: ${finalPrice.toFixed(2)}
             </p>
             <p className="text-sm text-green-600">Se aplicó un {selectedCupon.descuento}% de descuento.</p>
          </div>
        )}
        <button
          type="submit"
          disabled={selectedAsientosFuncion.length === 0 || loading}
          className="self-center mt-4 py-3 px-8 bg-green-600 text-white font-semibold border-none rounded cursor-pointer transition duration-200 ease-in-out hover:bg-green-700 hover:scale-[1.03] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:bg-gray-400 disabled:cursor-not-allowed disabled:scale-100"
        >
          {loading ? 'Procesando...' : `Continuar al Pago ($${finalPrice.toFixed(2)})`}
        </button>
      </form>
    </div>
  );
};

export default PurchaseForm;