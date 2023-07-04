import { FC } from 'react';

interface AvatarProps {
  children: React.ReactNode;
}
/* 
  Componente que contiene el avatar del usuario
  @param {React.ReactNode} children - Componentes hijos
  @returns {React.ReactElement} - Componente Avatar
*/
export const Avatar: FC<AvatarProps> = ({ children }) => {
  return (
    <div className='w-[40px] h-[40px] flex items-center justify-center rounded-sm'>
      {children}
    </div>
  );
};
