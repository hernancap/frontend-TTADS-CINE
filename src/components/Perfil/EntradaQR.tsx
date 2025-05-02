import React from 'react';
import { useParams } from 'react-router-dom';
import QRCode from 'react-qr-code';
import { format } from 'date-fns';
import { toZonedTime } from 'date-fns-tz';
import { useAuth } from "../../hooks/useAuth";

const EntradaQR: React.FC = () => {
  const { entradaId } = useParams<{ entradaId: string }>();
  const { user } = useAuth();
  const entrada = user?.entradas.find((e) => e.id === entradaId);

  if (!entrada) {
    return <p className="text-red-500 text-center mt-8">Entrada no encontrada</p>;
  }

  const fmt = (utc: string) => format(toZonedTime(utc, 'America/Argentina/Cordoba'), "dd/MM/yyyy HH:mm 'hs'");

  return (
    <div className="flex flex-col items-center justify-center p-8 space-y-6 bg-[#1e1e1e] text-white rounded-lg max-w-md mx-auto">
      <h1 className="text-3xl font-bold">Tu Entrada</h1>
      <p><strong>Película:</strong> {entrada.funcion.pelicula.nombre}</p>
      <p><strong>Fecha:</strong> {fmt(entrada.funcion.fechaHora)}</p>
      <p><strong>Sala:</strong> {entrada.funcion.sala.nombre}</p>
      <p><strong>Asiento:</strong> {entrada.asientoFuncion.asiento.fila}{entrada.asientoFuncion.asiento.numero}</p>

      <div className="p-4 bg-white rounded-lg">
        <QRCode
          value={entrada.id}
          size={200}
          level="M"
        />
      </div>
      <p className="text-sm text-gray-400">Muestra este código al ingresar a la sala</p>
    </div>
  );
};

export default EntradaQR;
