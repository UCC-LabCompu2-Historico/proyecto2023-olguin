import { FC, createContext } from 'react';

interface UiContextProps {
    theme: string;
    sidebar: boolean;

    toggleTheme: () => void;
    openSidebar: () => void;
    closeSidebar: () => void;
}

/* 
    Contexto que se encarga de manejar el estado de la aplicacion relacionado con la interfaz de usuario
*/
export const UiContext = createContext({} as UiContextProps);