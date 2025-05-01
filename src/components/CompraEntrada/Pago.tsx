import { useEffect, useState } from "react";
import { initMercadoPago, Wallet } from "@mercadopago/sdk-react";
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
    initMercadoPago("TEST-cfa1c3da-473f-41ec-b9b7-9069ff09b0b9", {
       locale: 'es-AR' 
    });
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
      try {
        setCompraDetalle(JSON.parse(storedCompraDetalle));
      } catch (error) {
         console.error("Error al parsear los detalles de la compra desde localStorage:", error);
      }
    } else {
      console.error("No se encontraron detalles de la compra en localStorage");
    }

    setLoading(false);
  }, []);

  if (loading) return (
    <p className="mt-4 text-center text-base text-neutral-300 w-full">
      Cargando...
    </p>
  );
  if (!preferenceId) return (
    <p className="mt-4 text-center text-base text-red-600 w-full">
      Error al generar el pago. No se encontró ID de preferencia.
    </p>
  );

  return (
    <div className="mt-10 p-6 bg-neutral-800 rounded-lg shadow-md w-4/5 max-w-[600px] mx-auto flex flex-col items-center">
      <h1 className="text-[2.5rem] leading-tight mb-6 text-neutral-100 text-center w-full">
        Pagar con Mercado Pago
      </h1>
      {compraDetalle.pelicula && (
        <div className="mb-8 text-neutral-300 w-full">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th
                  colSpan={2}
                  className="text-2xl py-4 px-0 text-neutral-100 text-center border-b border-neutral-600"
                >
                  Detalle de tu compra
                </th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-neutral-600 last:border-b-0">
                <td className="py-2 px-0 text-left font-bold text-neutral-100 w-2/5">Película:</td>
                <td className="py-2 px-0 text-left w-3/5">{compraDetalle.pelicula}</td>
              </tr>
              <tr className="border-b border-neutral-600 last:border-b-0">
                <td className="py-2 px-0 text-left font-bold text-neutral-100 w-2/5">Horario:</td>
                <td className="py-2 px-0 text-left w-3/5">
                  {compraDetalle.horario
                    ? format(new Date(compraDetalle.horario), "EEEE, d 'de' MMMM 'de' yyyy, HH:mm", { locale: es })
                    : 'No especificado'}
                </td>
              </tr>
              <tr className="border-b border-neutral-600 last:border-b-0">
                <td className="py-2 px-0 text-left font-bold text-neutral-100 w-2/5">Precio por entrada:</td>
                <td className="py-2 px-0 text-left w-3/5">${compraDetalle.precioPorEntrada?.toFixed(2)}</td>
              </tr>
              <tr className="border-b border-neutral-600 last:border-b-0">
                <td className="py-2 px-0 text-left font-bold text-neutral-100 w-2/5">Cantidad de entradas:</td>
                <td className="py-2 px-0 text-left w-3/5">{compraDetalle.cantidadEntradas}</td>
              </tr>
              <tr className="border-b border-neutral-600 last:border-b-0">
                <td className="py-2 px-0 text-left font-bold text-neutral-100 w-2/5">Asientos seleccionados:</td>
                <td className="py-2 px-0 text-left w-3/5">{compraDetalle.asientosSeleccionados?.join(', ')}</td>
              </tr>
              <tr className="border-b border-neutral-600 last:border-b-0">
                <td className="py-2 px-0 text-left font-bold text-neutral-100 w-2/5">Precio total (sin desc.):</td>
                <td className="py-2 px-0 text-left w-3/5">${compraDetalle.precioTotalSinDescuento?.toFixed(2)}</td>
              </tr>
              {compraDetalle.cuponSeleccionado && (
                <>
                  <tr className="border-b border-neutral-600 last:border-b-0">
                    <td className="py-2 px-0 text-left font-bold text-neutral-100 w-2/5">Cupón aplicado:</td>
                    <td className="py-2 px-0 text-left w-3/5">Descuento del {compraDetalle.cuponSeleccionado.descuento}%</td>
                  </tr>
                  <tr className="border-b border-neutral-600 last:border-b-0">
                    <td className="py-2 px-0 text-left font-bold text-neutral-100 w-2/5">Precio total (con desc.):</td>
                    <td className="py-2 px-0 text-left w-3/5">${compraDetalle.precioTotalConDescuento?.toFixed(2)}</td>
                  </tr>
                </>
              )}
              {!compraDetalle.cuponSeleccionado && compraDetalle.precioTotalSinDescuento !== compraDetalle.precioTotalConDescuento && (
                <tr className="border-b border-neutral-600 last:border-b-0">
                  <td className="py-2 px-0 text-left font-bold text-neutral-100 w-2/5">Precio total:</td>
                  <td className="py-2 px-0 text-left w-3/5">${compraDetalle.precioTotalConDescuento?.toFixed(2)}</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
      <div className="mt-8 w-full flex justify-center">
        <Wallet
          initialization={{ preferenceId }}
          customization={{ texts: { valueProp: 'smart_option' } }}
        />
      </div>
    </div>
  );
};

export default Pago;