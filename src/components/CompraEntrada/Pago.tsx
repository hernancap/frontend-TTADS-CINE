import { useEffect, useState } from "react";
import { initMercadoPago, Wallet } from "@mercadopago/sdk-react";
import "./Pago.css";
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface DetalleCompra {
  pelicula?: string;
  horario?: string;
  precioPorEntrada?: number;
  cantidadEntradas?: number;
  asientosSeleccionados?: string[];
  precioTotalSinDescuento?: number;
  cuponSeleccionado?: { id: string; descuento: number } | null;
  precioTotalConDescuento?: number;
}

const Pago = () => {
  const [preferenceId, setPreferenceId] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [compraDetalle, setCompraDetalle] = useState<DetalleCompra>({});

  useEffect(() => {
    initMercadoPago("TEST-cfa1c3da-473f-41ec-b9b7-9069ff09b0b9");
  }, []);

  useEffect(() => {
    const storedPreferenceId = localStorage.getItem("preferenceId");
    if (storedPreferenceId) {
      setPreferenceId(storedPreferenceId);
    } else {
      console.error("No se encontró preferenceId en localStorage");
    }

    const storedCompraDetalle = localStorage.getItem("compraDetalle");
    if (storedCompraDetalle) {
      setCompraDetalle(JSON.parse(storedCompraDetalle));
    } else {
      console.error("No se encontraron detalles de la compra en localStorage");
    }

    setLoading(false);
  }, []);

  if (loading) return <p>Cargando...</p>;
  if (!preferenceId) return <p>Error al generar el pago.</p>;

  return (
    <div className="pago-container">
      <h1 className="pago-title">Pagar con Mercado Pago</h1>
      {compraDetalle.pelicula && (
        <div className="detalle-compra">
          <table className="detalle-compra-table">
            <thead>
              <tr className="detalle-compra-header-row">
                <th colSpan={2}>Detalle de tu compra</th>
              </tr>
            </thead>
            <tbody>
              <tr className="detalle-compra-row">
                <td>Película:</td>
                <td>{compraDetalle.pelicula}</td>
              </tr>
              <tr className="detalle-compra-row">
                <td>Horario:</td>
                <td>{format(new Date(compraDetalle.horario!), "EEEE, d 'de' MMMM 'de' yyyy, HH:mm", { locale: es })}</td>
              </tr>
              <tr className="detalle-compra-row">
                <td>Precio por entrada:</td>
                <td>${compraDetalle.precioPorEntrada?.toFixed(2)}</td>
              </tr>
              <tr className="detalle-compra-row">
                <td>Cantidad de entradas:</td>
                <td>{compraDetalle.cantidadEntradas}</td>
              </tr>
              <tr className="detalle-compra-row">
                <td>Asientos seleccionados:</td>
                <td>{compraDetalle.asientosSeleccionados?.join(', ')}</td>
              </tr>
              <tr className="detalle-compra-row">
                <td>Precio total (sin descuento):</td>
                <td>${compraDetalle.precioTotalSinDescuento?.toFixed(2)}</td>
              </tr>
              {compraDetalle.cuponSeleccionado && (
                <>
                  <tr className="detalle-compra-row">
                    <td>Cupón aplicado:</td>
                    <td>Descuento del {compraDetalle.cuponSeleccionado.descuento}%</td>
                  </tr>
                  <tr className="detalle-compra-row">
                    <td>Precio total con descuento:</td>
                    <td>${compraDetalle.precioTotalConDescuento?.toFixed(2)}</td>
                  </tr>
                </>
              )}
              {!compraDetalle.cuponSeleccionado && compraDetalle.precioTotalSinDescuento !== compraDetalle.precioTotalConDescuento && (
                <tr className="detalle-compra-row">
                  <td>Precio total:</td>
                  <td>${compraDetalle.precioTotalConDescuento?.toFixed(2)}</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
      <div className="wallet-container">
        <Wallet initialization={{ preferenceId }} customization={{ texts: { valueProp: 'smart_option' } }} />
      </div>
    </div>
  );
};

export default Pago;
