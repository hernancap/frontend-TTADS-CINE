export enum Calificacion {
	ATP = "ATP",
	M13 = "+13",
	M16 = "+16",
	M18 = "+18",
}

export interface Pelicula {
  id: string;
  nombre: string;
  genero: string;
  duracion: number;
  director: string;
  actors: Actor[];
  poster_path?: string;
  enCartelera: boolean;    
  proximamente: boolean;   
  favoritos?: Usuario[];
  calificacion: Calificacion;
  sinopsis: string;
}

export interface Actor {
  id: string;
  nombre: string;
}

export interface Sala {
  id: string;
  nombre: string;
  asientos: Asiento[];
}

export interface Asiento {
  id?: string;
  fila: string;
  numero: number;
}

export enum TipoFuncion {
  SUBTITULADA = "SUBTITULADA",
  DOBLADA = "DOBLADA / ESPAÑOL",
}

export interface Funcion {
  id: string;
  fechaHora: string;
  sala: Sala;
  pelicula: Pelicula;
  precio: number;
  entradas?: Entrada[];
  tipo: TipoFuncion;
}

export interface Cupon {
  id: string;
  codigo: string;
  descuento: number;
  fechaExpiracion: string;
  usuario?: Usuario;
}

export enum UserType {
  COMUN = 'comun',
  ADMIN = 'admin'
}

export interface Usuario {
  id: string;
  nombre: string;
  email: string;
  password?: string;
  entradas: Entrada[];
  tipo: UserType;
  cupones?: Cupon[];      
  favoritos?: Pelicula[];
}

export enum EstadoAsiento {
  DISPONIBLE = "disponible",
  RESERVADO = "reservado",
  VENDIDO = "vendido",
}

export interface AsientoFuncion {
  id: string; 
  asiento: Asiento; 
  estado: EstadoAsiento;
}

export interface Entrada {
  id: string;
  precio: number;
  fechaCompra: string;
  usuario: Usuario;
  funcion: Funcion;
  asientoFuncion: AsientoFuncion;
  usada: boolean;
}
