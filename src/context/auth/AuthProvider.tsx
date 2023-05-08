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

export const AuthProvider: FC<AuthProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, AUTH_INITIAL_STATE);

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

  const logout = () => {
    Cookies.remove('token');
    dispatch({
      type: '[AUTH] - Logout'
    });
  };

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


  useEffect(() => {
    revalidateToken();
  }, []);

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

  useEffect(() => {
    checkToken();
  }, []);


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
