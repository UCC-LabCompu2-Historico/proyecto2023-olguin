import { useContext, useEffect, useRef } from 'react';
import Image from 'next/image';
import { ChatContext } from '@/context/chat';
import { Avatar, TypingEffect } from '../ui';
import { GptIcon } from '../ui/icons/GptIcon';
import { AuthContext } from '@/context/auth';
import { UiContext } from '@/context/ui';


/* 
  Componente que contiene la lista de mensajes del chat
  @returns {React.ReactElement} - Componente MessageList
*/
export const MessageList = () => {

  const { messages, loading } = useContext(ChatContext);
  const bottomRef = useRef<null | HTMLDivElement>(null)

  const { user } = useContext(AuthContext);
  const { theme } = useContext(UiContext);

  /* 
    Hook que se ejecuta cuando se actualiza el estado de messages y hace scroll hacia abajo
  */
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages]); 

  return (
      <div className='h-[500px] sm:h-[70vh] overflow-auto sidebar-scroll-bar'>
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex gap-4 p-8 w-3/4 m-auto 
              ${message.ia && theme == 'dark' && 'bg-gptlightgray'} 
              ${message.ia && theme == 'light' && 'bg-slate-100 text-slate-900'}
              ${!message.ia && theme == 'light' &&'bg-slate-50 text-slate-900 font-semibold'}`}
          >
            <Avatar>
              {message.ia ? (
                <GptIcon />
              ) : (
                <Image
                  src={`${user?.avatar ? user?.avatar : '/avatar.webp'}`}
                  alt='user'
                  width={40}
                  height={40}
                  className='rounded-md'
                />
              )}
            </Avatar>
            <div className='self-center'>
              {message.ia ? (
                <TypingEffect text={message.message} />
              ) : (
                message.message
              )}
            </div>
          </div>
        ))}
        {loading && (
          <div className='flex gap-4 p-8 w-3/4 m-auto'>
            <Avatar>
              <GptIcon />
            </Avatar>
            <p className='self-center animate-pulse'>▋</p>
          </div>
        )}
        <div ref={bottomRef} />
      </div>
    
  );
};
