import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaTimesCircle } from "react-icons/fa";

const PagoFallido = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/");
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-neutral-100 bg-gradient-to-br from-neutral-800 to-neutral-900 p-4">
      <FaTimesCircle
        className="text-[4rem] text-[#f44336] mb-4 drop-shadow-lg"
      />
      <h1
        className="text-4xl sm:text-5xl font-bold text-[##FF8A80] mb-3 drop-shadow-md text-center"
      >
        ¡Pago fallido!
      </h1>
      <p className="text-lg sm:text-xl text-neutral-200 mb-8 text-center px-4">
        Hubo un problema al procesar tu pago, se ha cancelado la compra. Serás redirigido en breve...
      </p>
      <div
        className="w-12 h-12 border-4 border-white/20 border-t-[#FF8A80] rounded-full animate-spin mt-4"
        role="status"
        aria-live="polite"
      >
        <span className="sr-only">Redirigiendo...</span>
      </div>
    </div>
  );
};

export default PagoFallido;
