import { createContext } from 'react';
import { Messages } from '@/interfaces';

interface ChatContextProps {
  messages: Messages[];
  loading: boolean;

  sendMessage: (message: Messages) => void;
  deleteChat: () => void;
}

/* 
  Contexto que se encarga de manejar el estado de la aplicacion relacionado con el chat
*/
export const ChatContext = createContext({} as ChatContextProps);
