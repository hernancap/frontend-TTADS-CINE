import React, { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { Link, useNavigate, useLocation } from "react-router-dom";
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
		<div className="max-w-xs mx-auto my-8 p-4 border border-gray-300 rounded-lg">
		  <h2 className="text-2xl font-semibold mb-4">Login</h2>
		  <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col">
			<div className="mb-4">
			  <label className="block mb-1 text-sm font-medium">Email:</label>
			  <input
				type="email"
				className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
				{...register("email", { required: "El correo es obligatorio" })}
			  />
			  {errors.email && (
				<span className="text-red-500 text-sm mt-1">{errors.email.message}</span>
			  )}
			</div>
			<div className="mb-4">
			  <label className="block mb-1 text-sm font-medium">Contraseña:</label>
			  <input
				type="password"
				className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
				{...register("password", { required: "La contraseña es obligatoria" })}
			  />
			  {errors.password && (
				<span className="text-red-500 text-sm mt-1">{errors.password.message}</span>
			  )}
			</div>
			<button
			  type="submit"
			  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors disabled:opacity-50"
			  disabled={isSubmitting}
			>
			  {isSubmitting ? "Iniciando..." : "Iniciar Sesión"}
			</button>
		  </form>
		  <p className="mt-4 text-sm text-center">
			¿No tienes cuenta?{" "}
			<Link 
			  to="/register" 
			  className="text-blue-600 hover:underline"
			>
			  Crear una nueva cuenta
			</Link>
		  </p>
		</div>
	  );
	};

export default Login;
