import React from "react";
import UsuarioForm from "./Admin/UsuarioForm";
import { useNavigate } from "react-router-dom";

const Register: React.FC = () => {
  const navigate = useNavigate();

  const handleClose = () => {
    navigate("/login");
  };

  return (
    <div>
      <UsuarioForm usuario={null} onClose={handleClose} newUser={true} />
    </div>
  );
};

export default Register;