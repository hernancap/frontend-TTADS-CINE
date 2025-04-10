import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./PagoFallido.css";
import { FaTimesCircle } from "react-icons/fa";

const PagoFallido = () => {
  const navigate = useNavigate();

  useEffect(() => {
    setTimeout(() => {
      navigate("/");
    }, 3000);
  }, [navigate]);

  return (
    <div className="pago-fallido-container">
      <FaTimesCircle className="pago-fallido-icon" />
      <h1 className="pago-fallido-title">¡Pago fallido!</h1>
      <p className="pago-fallido-message">Hubo un problema al procesar tu pago, se ha cancelado la compra. Serás redirigido en breve...</p>
      <div className="pago-fallido-spinner"></div>
    </div>
  );
};

export default PagoFallido;