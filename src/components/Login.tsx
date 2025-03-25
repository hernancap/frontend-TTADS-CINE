import React, { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { Link, useNavigate, useLocation } from "react-router-dom";
import "./Login.css";
import { useAuth } from "../hooks/useAuth.ts";
import { login as loginService } from "../services/auth";

interface LoginInputs {
	email: string;
	password: string;
}

const Login: React.FC = () => {
	const { login } = useAuth();
	const navigate = useNavigate();
	const location = useLocation();
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<LoginInputs>();

	const [isSubmitting, setIsSubmitting] = useState(false);

	const onSubmit: SubmitHandler<LoginInputs> = async (data) => {
		setIsSubmitting(true);
		try {
			const { token, user } = await loginService(
				data.email,
				data.password
			);
			login(token, user);
			console.log("Login exitoso");
			navigate(location.state?.from?.pathname || '/');
		} catch (error) {
			if (error instanceof Error) {
				console.error("Error de login:", error.message);
			}
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<div className="login-container">
			<h2>Login</h2>
			<form onSubmit={handleSubmit(onSubmit)} className="form">
				<div className="form-group">
					<label>Email:</label>
					<input
						type="email"
						{...register("email", {
							required: "El correo es obligatorio",
						})}
					/>
					{errors.email && (
						<span className="error">{errors.email.message}</span>
					)}
				</div>
				<div className="form-group">
					<label>Contraseña:</label>
					<input
						type="password"
						{...register("password", {
							required: "La contraseña es obligatoria",
						})}
					/>
					{errors.password && (
						<span className="error">{errors.password.message}</span>
					)}
				</div>
				<button
					type="submit"
					className="button"
					disabled={isSubmitting}
				>
					{isSubmitting ? "Iniciando..." : "Iniciar Sesión"}
				</button>
			</form>
			<p>
				¿No tienes cuenta?{" "}
				<Link to="/register">Crear una nueva cuenta</Link>
			</p>
		</div>
	);
};

export default Login;
