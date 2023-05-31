import { FC, useEffect, useReducer } from 'react';
import Cookies from 'js-cookie';
import { authReducer, AuthContext } from './';
import { IUser } from '@/interfaces';
import { updateImage } from '@/utils';
import { signInWithGoogle } from '@/firebase';

export interface AuthState {
  isLogged: boolean;
  user?: IUser;
}

interface AuthProviderProps {
  children: React.ReactNode;
}

const AUTH_INITIAL_STATE: AuthState = {
  isLogged: false,
  user: undefined
};


/*
  Provider que se encarga de manejar la autenticacion de la aplicacion
  @param {React.ReactNode} children - Componentes hijos
  @returns {React.ReactElement} - Componente AuthProvider
*/
export const AuthProvider: FC<AuthProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, AUTH_INITIAL_STATE);

  /*
    Funcion que se encarga de realizar el login de un usuario en la aplicacion haciendo uso de la API de la aplicacion.
    @param {IUser} user - Usuario a loguear
    @returns {Promise<boolean>} - True si el login fue exitoso, false en caso contrario
  */
  const login = async (user: IUser) => {
    try {
      const checkUser = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(user)
      });
      const data = await checkUser.json();

      if (data.ok) {
        const { user, token } = data;
        dispatch({
          type: '[AUTH] - Login',
          payload: user
        });
        Cookies.set('token', token);
        return true;
      }
    } catch (err) {
      console.log(err);
      Cookies.remove('token');
    }
    return false;
  };

  /*
    Funcion que se encarga de registrar un usuario en la aplicacion haciendo uso de la API de la aplicacion. Hace un dispatch del action [AUTH] - Login y por ultimo setea la cookie del token para mantener la sesion activa
    @param {IUser} user - Usuario a registrar
    @returns {Promise<boolean>} - True si el registro fue exitoso, false en caso contrario
  */
  const register = async (user: IUser) => {
    try {
      const newUser = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(user)
      });
      const data = await newUser.json();

      if (data.ok) {
        const { user, token } = data;
        dispatch({
          type: '[AUTH] - Login',
          payload: user
        });
        Cookies.set('token', token);
        return true;
      }
    } catch (err) {
      console.log(err);
      Cookies.remove('token');
    }
    return false;
  };

  /* 
    Funcion que se encarga de cerrar sesion de un usuario en la aplicacion. Remueve la cookie del token y hace un dispatch del action [AUTH] - Logout
  */
  const logout = () => {
    Cookies.remove('token');
    dispatch({
      type: '[AUTH] - Logout'
    });
  };

  /* 
    Funcion que se encarga de actualizar los datos del usuario haciendo uso de la API de la aplicacion. En primer lugar obtiene el token de acceso de las cookies, si no existe el token hace un dispatch del action [AUTH] - Logout. En caso de que exista el token, hace un fetch a la API de la aplicacion para actualizar los datos del usuario. Si la respuesta es exitosa hace un dispatch del action [AUTH] - Login y por ultimo setea la cookie del token para mantener la sesion activa. En caso de que la respuesta no sea exitosa hace un dispatch del action [AUTH] - Logout
    @param {string} _id - ID del usuario a actualizar
    @param {string} name - Nombre del usuario a actualizar
    @param {string} email - Email del usuario a actualizar
    @param {File} avatar - Avatar del usuario a actualizar
    @param {string} password - Password del usuario a actualizar
    @returns {Promise<void>} -
  */
  const updateUser = async (
    _id: string,
    name?: string,
    email?: string,
    avatar?: File,
    password?: string
  ) => {
    const token = Cookies.get('token');
    if (!token) {
      dispatch({
        type: '[AUTH] - Logout'
      });
      return;
    }

    try {
      let imageUrl = '';

      if (avatar) imageUrl = await updateImage(avatar);

      const response = await fetch('/api/auth/update-user', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ _id, name, email, password, imageUrl })
      });
      const data = await response.json();

      if (data.ok) {
        const { user } = data;
        dispatch({
          type: '[AUTH] - Login',
          payload: user
        });
        Cookies.set('token', token);
      }
    } catch (err) {
      console.log(err);
      Cookies.remove('token');
      dispatch({
        type: '[AUTH] - Logout'
      });
    }
  };

  /* 
    Funcion que se encarga de realizar el registro y login del usuario por medio de google haciendo uso de la API de la aplicacion.
    @returns {Promise<boolean>} - True si el registro y login fue exitoso, false en caso contrario

  */
  const startSignInWithGoogle = async () => {
    try{
      let user; 
      const result = await signInWithGoogle(); 

      if(result.ok){
        user = result.user; 
        const response = await fetch('/api/auth/google', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(user)
        }); 
        const data = await response.json(); 
        if(data.ok){
          const { user, token } = data; 
          dispatch({
            type: '[AUTH] - Login',
            payload: user
          });
          Cookies.set('token', token);
          return true; 
        }
        return false; 
      }
      return false; 

    }catch(err){

      console.log(err); 
      Cookies.remove('token');
      dispatch({
        type: '[AUTH] - Logout'
      });
      return false;
    }
  }

  /*
    Hook de react que se encarga de revalidar el token cada vez que se renderiza el componente
  */
  useEffect(() => {
    revalidateToken();
  }, []);

  /*
    Funcion que se encarga de revalidar el token de autenticacion del usuario haciendo uso de la API de la aplicacion. En primer lugar obtiene el token de acceso de las cookies, si no existe el token hace un dispatch del action [AUTH] - Logout. En caso de que exista el token, hace un fetch a la API de la aplicacion para revalidar el token. Si la respuesta es exitosa hace un dispatch del action [AUTH] - Login y por ultimo setea la cookie del token para mantener la sesion activa. En caso de que la respuesta no sea exitosa hace un dispatch del action [AUTH] - Logout
    @returns {Promise<void>} -
  */
  const revalidateToken = async () => {
    const token = Cookies.get('token');
    if (!token) {
      dispatch({
        type: '[AUTH] - Logout'
      });
      return;
    }

    try {
      const response = await fetch('/api/auth/validate-token', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();

      if (data.ok) {
        const { user } = data;
        dispatch({
          type: '[AUTH] - Login',
          payload: user
        });
        Cookies.set('token', token);
      }
    } catch (err) {
      console.log(err);
      Cookies.remove('token');
      dispatch({
        type: '[AUTH] - Logout'
      });
    }
  };

  /*
    Hook de react que se encarga de validar el token de autenticacion del usuario cada vez que se renderiza el componente
  */
  useEffect(() => {
    checkToken();
  }, []);

  
  /*
    Funcion que se encarga de validar el token de autenticacion del usuario haciendo uso de la API de la aplicacion. En primer lugar obtiene el token de acceso de las cookies, si no existe el token hace un dispatch del action [AUTH] - Logout. En caso de que exista el token, hace un fetch a la API de la aplicacion para validar el token. Si la respuesta es exitosa hace un dispatch del action [AUTH] - Login y por ultimo setea la cookie del token para mantener la sesion activa. En caso de que la respuesta no sea exitosa hace un dispatch del action [AUTH] - Logout
    @returns {Promise<void>} -
  */
  const checkToken = async () => {
    try {
      const token = Cookies.get('token');
      if (!token) {
        dispatch({
          type: '[AUTH] - Logout'
        });
        return;
      }

      const response = await fetch('/api/auth/validate-token', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();

      if (data.ok) {
        const { user } = data;
        dispatch({
          type: '[AUTH] - Login',
          payload: user
        });
        Cookies.set('token', token);
      }
    } catch (err) {
      console.log(err);
      Cookies.remove('token');
      dispatch({
        type: '[AUTH] - Logout'
      });
    }
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,

        login,
        register,
        logout,
        updateUser,
        startSignInWithGoogle
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
