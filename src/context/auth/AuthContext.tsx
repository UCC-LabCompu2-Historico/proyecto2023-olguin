import { IUser } from '@/interfaces';
import { createContext } from 'react';

interface AuthContextProps {
  isLogged: boolean;
  user?: IUser;

  login: (user: IUser) => Promise<boolean>;
  register: (user: IUser) => Promise<boolean>;
  logout: () => void;
  updateUser: (id:string,name?:string, email?:string,avatar?:File,password?:string) => Promise<void>;
  startSignInWithGoogle: () => Promise<boolean>;
}

/*
  Contexto que se encarga de manejar la autenticacion de la aplicacion
  @returns {React.Context} - Contexto de autenticacion
*/
export const AuthContext = createContext({} as AuthContextProps);
