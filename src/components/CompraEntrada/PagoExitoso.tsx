import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./PagoExitoso.css";
//import { FaCheckCircle } from "react-icons/fa"; 

const PagoExitoso = () => {
  const navigate = useNavigate();

  useEffect(() => {
    setTimeout(() => {
      navigate("/"); 
    }, 3000);
  }, [navigate]);

  return (
    <div className="pago-exitoso-container">
      {/*<FaCheckCircle className="pago-exitoso-icon" /> ¡Pago exitoso!*/}
      <h1 className="pago-exitoso-title">¡Pago exitoso!</h1>
      <p className="pago-exitoso-message">Serás redirigido en breve...</p>
       <div className="pago-exitoso-spinner"></div>
    </div>
  );
};

export default PagoExitoso;
