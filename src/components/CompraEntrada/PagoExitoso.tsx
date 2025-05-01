import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaCheckCircle } from "react-icons/fa";

const PagoExitoso = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/"); 
    }, 3000); 

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-neutral-100 bg-gradient-to-br from-neutral-800 to-neutral-900 p-4">
      <FaCheckCircle
        className="text-6xl text-green-500 mb-5 drop-shadow-lg" 
      />
      <h1
        className="text-4xl sm:text-5xl font-bold text-lime-300 mb-3 text-center drop-shadow-md"
      >
        ¡Pago exitoso!
      </h1>
      <p
        className="text-lg sm:text-xl text-neutral-200 mb-8 text-center" 
      >
        Tu compra ha sido procesada. Serás redirigido en breve...
      </p>
      <div
        className="w-12 h-12 border-4 border-white/20 border-t-lime-300 rounded-full animate-spin mt-4"
        role="status"
        aria-live="polite" 
      >
         <span className="sr-only">Redirigiendo...</span> 
      </div>
    </div>
  );
};

export default PagoExitoso;