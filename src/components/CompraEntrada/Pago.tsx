import { useEffect, useState } from 'react';
import { initMercadoPago, Wallet } from '@mercadopago/sdk-react';
import { createPreference } from '../../api/pago';

const Pago = () => {
  const [preferenceId, setPreferenceId] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    initMercadoPago('TEST-cfa1c3da-473f-41ec-b9b7-9069ff09b0b9');
    console.log('MercadoPago inicializado con la clave pública');
  }, []);

  useEffect(() => {
    const fetchPreference = async () => {
      try {
        const paymentDataStr = localStorage.getItem('paymentData');
        console.log('Contenido de localStorage paymentData:', paymentDataStr);
        if (!paymentDataStr) {
          throw new Error('No se encontraron datos de pago en localStorage');
        }
        const item = JSON.parse(paymentDataStr);
        console.log('Objeto de pago parseado:', item);

        const response = await createPreference([item]);
        console.log('Respuesta de createPreference:', response);

        if (!response.preferenceId) {
          console.error('La respuesta no contiene preferenceId:', response);
          throw new Error('La respuesta de la API no contiene preferenceId');
        }
        setPreferenceId(response.preferenceId);
      } catch (error) {
        console.error('Error al crear la preferencia:', error);
      } finally {
        setLoading(false);
        console.log('Finalizó el fetch de la preferencia, loading:', false);
      }
    };

    fetchPreference();
  }, []);

  if (loading) {
    console.log('Mostrando estado de carga...');
    return <p>Cargando...</p>;
  }

  if (!preferenceId) {
    console.error('No se obtuvo preferenceId, mostrando error en UI');
    return <p>Error al generar el pago.</p>;
  }

  console.log('Mostrando Wallet con preferenceId:', preferenceId);
  return (
    <div className="flex flex-col items-center mt-10">
      <h1 className="text-2xl mb-4">Pagar con Mercado Pago</h1>
      <Wallet initialization={{ preferenceId }} customization={{ texts: { valueProp: 'smart_option' } }} />
    </div>
  );
};

export default Pago;
