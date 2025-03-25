import { createContext } from 'react';
import { Usuario } from '../types';

interface AuthContextType {
  user: Usuario | null;
  token: string | null;
  isLoading: boolean;
  login: (token: string, userData: Usuario) => void;
  logout: () => void;
  setUser: React.Dispatch<React.SetStateAction<Usuario | null>>; 
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  token: null,
  isLoading: true,
  login: () => {},
  logout: () => {},
  setUser: () => {}, 
});