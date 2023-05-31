import { FC, useEffect, useReducer } from 'react';
import { UiContext, uiReducer } from './';
import Cookies from 'js-cookie';

interface UiProviderProps {
  children: React.ReactNode;
}

export interface UiState {
  theme: string;
  sidebar: boolean;
}

const UI_INITIAL_STATE: UiState = {
  theme: 'dark',
  sidebar: false
};

/* 
  Provider que se encarga de manejar el estado de la aplicacion relacionado con la interfaz de usuario
  @param {React.ReactNode} children - Componentes hijos
*/
export const UiProvider: FC<UiProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(uiReducer, UI_INITIAL_STATE);

  /*
    Hook de react que se encarga de verificar si el usuario tiene una preferencia de tema guardada en las cookies, si es asi entonces se cambia el tema de la aplicacion a la preferencia del usuario
  */
  useEffect(() => {
    const theme = Cookies.get('theme');
    if (theme) {
      dispatch({
        type: '[UI] - Toggle Theme',
        payload: theme
      });
    }
  }, []);


  /*
    Funcion que se encarga de cambiar el tema de la aplicacion y guardar la preferencia del usuario en las cookies
    @returns {void}
  */
  const toggleTheme = () => {
    if (state.theme === 'dark') {
      Cookies.set('theme', 'light');
    } else {
      Cookies.set('theme', 'dark');
    }

    dispatch({
      type: '[UI] - Toggle Theme',
      payload: state.theme === 'dark' ? 'light' : 'dark'
    });
  };

  /* 
    Funcion que se encarga de abrir el sidebar de la aplicacion unicamente en dispositivos moviles
    @returns {void}
  */
  const openSidebar = () => {
    dispatch({
      type: '[UI] - Open Sidebar',
      payload: true
    });
  }

  /*
    Funcion que se encarga de cerrar el sidebar de la aplicacion unicamente en dispositivos moviles
    @returns {void}
  */
  const closeSidebar = () => {
    dispatch({
      type: '[UI] - Open Sidebar',
      payload:false
    });
  }

  return (
    <UiContext.Provider
      value={{
        ...state,

        toggleTheme,
        openSidebar,
        closeSidebar
      }}
    >
      {children}
    </UiContext.Provider>
  );
};
