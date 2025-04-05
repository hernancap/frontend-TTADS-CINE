import { useEffect, useState } from 'react';
import { initMercadoPago, Wallet } from '@mercadopago/sdk-react';

const Pago = () => {
  const [preferenceId, setPreferenceId] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    initMercadoPago('TEST-cfa1c3da-473f-41ec-b9b7-9069ff09b0b9');
  }, []);

  useEffect(() => {
    const storedPreferenceId = localStorage.getItem('preferenceId');
    if (storedPreferenceId) {
      setPreferenceId(storedPreferenceId);
    } else {
      console.error('No se encontró preferenceId en localStorage');
    }
    setLoading(false);
  }, []);

  if (loading) return <p>Cargando...</p>;
  if (!preferenceId) return <p>Error al generar el pago.</p>;

  return (
    <div className="flex flex-col items-center mt-10">
      <h1 className="text-2xl mb-4">Pagar con Mercado Pago</h1>
      <Wallet initialization={{ preferenceId }} customization={{ texts: { valueProp: 'smart_option' } }} />
    </div>
  );
};

export default Pago;
