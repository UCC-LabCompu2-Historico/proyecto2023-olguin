import { FC, useEffect, useReducer, useState } from 'react';
import { ChatContext, chatReducer } from './';
import { Messages } from '@/interfaces';

interface ChatProviderProps {
  children: React.ReactNode;
}

export interface ChatState {
  messages: Messages[];
  loading: boolean;
}

const CHAT_INITIAL_STATE: ChatState = {
  messages: [],
  loading: false
};

/*
  Provider que se encarga de manejar el estado de la aplicacion relacionado con el chat
*/
export const ChatProvider: FC<ChatProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(chatReducer, CHAT_INITIAL_STATE);
  const { messages } = state;
  const lastMessage = messages[messages.length - 1];

  /*
    Hook de react checkea si el ultimo mensaje enviado fue enviado por el usuario o por la IA, si fue enviado por el usuario entonces se envia ese mensaje a la IA para que responda, esto se hara cada vez que el usuario envie un mensaje.
  */
  useEffect(() => {
    if (lastMessage?.ia) return;
    sendIaMessage();
  }, [lastMessage]);

  /*
    Funcion que se encarga de iniciar el loading de la aplicacion
    @returns {void}
  */
  const startLoading = () => {
    dispatch({
      type: '[CHAT] - Start Loading',
      payload: true
    });
  };

  /*
    Funcion que se encarga de detener el loading de la aplicacion
    @returns {void}
  */
  const stopLoading = () => {
    dispatch({
      type: '[CHAT] - Stop Loading',
      payload: false
    });
  };

  /*
    Funcion que se encarga de hacer un dispatch de la accion [CHAT] - Send Message la cual unicamente se encarga de agregar un nuevo mensaje al estado de la aplicacion
    @param {Messages} message - Mensaje a agregar
    @returns {void}
  */
  const sendMessage = (message: Messages) => {
    dispatch({
      type: '[CHAT] - Send Message',
      payload: message
    });
  };
  
  /*
    Funcion que se encarga de enviar un mensaje a la IA para que responda por medio de la API de la aplicacion. Esta funcion se encarga de hacer un dispatch de la accion [CHAT] - Send Message la cual unicamente se encarga de agregar un nuevo mensaje al estado de la aplicacion
    @returns {void}
  */
  const sendIaMessage = async () => {
    startLoading();

    if (!lastMessage) return;

    const response = await fetch('/api', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ prompt: lastMessage })
    });

    const dataJSON = await response.json();
    const { data } = dataJSON;

    const iaResponse = {
      id: Math.random(),
      message: data?.message.content,
      ia: true
    };

    stopLoading();

    dispatch({
      type: '[CHAT] - Send Message',
      payload: iaResponse
    });
  };

  /*
    Funcion que se encarga de hacer un dispatch de la accion [CHAT] - Delete Chat la cual eliminara todos los mensajes del estado de la aplicacion
    @returns {void}
  */
  const deleteChat = () => {
    dispatch({
      type: '[CHAT] - Delete Chat',
      payload: []
    });
  };

  return (
    <ChatContext.Provider
      value={{
        ...state,

        sendMessage,
        deleteChat
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};
