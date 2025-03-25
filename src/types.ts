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
}

export interface Actor {
  id: string;
  nombre: string;
}

export interface Sala {
  id: string;
  nombre: string;
  numFilas: number;
  asientosPorFila: number;
  asientos: Asiento[];
}

export interface Asiento {
  id: string;
  fila: string;
  numero: number;
  isOccupied: boolean;
}

export interface Funcion {
  id: string;
  fechaHora: string;
  sala: Sala;
  pelicula: Pelicula;
  precio: number;
  isCancelled: boolean;
  isActive: boolean;
  entradas?: Entrada[];
}

export enum UserType {
  COMUN = 'comun',
  ADMIN = 'admin'
}

export interface Cupon {
  id: string;
  codigo: string;
  descuento: number;
  fechaExpiracion: string;
  usuario?: Usuario;
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

export interface Entrada {
  id: string;
  precio: number;
  fechaCompra: string;
  usuario: Usuario;
  funcion: Funcion;
  asiento: Asiento;
}
