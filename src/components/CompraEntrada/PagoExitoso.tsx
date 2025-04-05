import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const PagoExitoso = () => {
  const navigate = useNavigate();

  useEffect(() => {
    setTimeout(() => {
      navigate("/"); 
    }, 3000);
  }, [navigate]);

  return (
    <div className="flex flex-col items-center mt-10">
      <h1 className="text-2xl text-green-600">¡Pago exitoso!</h1>
      <p>Serás redirigido en breve...</p>
    </div>
  );
};

export default PagoExitoso;
