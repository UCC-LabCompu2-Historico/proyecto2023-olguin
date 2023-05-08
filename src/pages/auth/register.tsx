import { useContext, useState } from 'react';
import { useForm } from 'react-hook-form';
import { AuthLayOut } from '@/components';
import { AuthContext } from '@/context/auth';
import { useRouter } from 'next/router';
import Link from 'next/link';

type FormDataType = {
  name: string;
  email: string;
  password: string;
};

const RegisterPage = () => {
  const [showErrors, setShowErrors] = useState<boolean>(false);
  const [ errorMessage, setErrorMessage ] = useState<string>('');
  const {register,handleSubmit,formState: { errors }} = useForm<FormDataType>();
  const { register: registerUser } = useContext(AuthContext);
  const router = useRouter();

  const onSubmit = async (data: FormDataType) => {
    const { name, email, password } = data;
    const ok = await registerUser({ name, email, password });
    if (ok) {
      setShowErrors(false);
      router.replace('/'); 
      return;
    }
    setShowErrors(true);
    setErrorMessage('Ya existe un usuario con ese email');
    setTimeout(() => {
      setShowErrors(false);
    }, 3000);
    return; 
  };

  return (
    <AuthLayOut
      title='Registrarse'
      description='El usuario debe registrarse para continuar'
      fullUrlImage='https://res.cloudinary.com/dqsqafh2n/image/upload/v1682522852/chatGPT-users/Screenshot_2023-04-26_122225_nlp7p5.png'
    >
      <div className='sm:shadow-lg sm:shadow-gray-900 rounded-lg md:w-[30vw] md:h-[500pxvh] 2xl:h-3/4'>
        <h1 className='text-4xl text-gray-50 mb-10 text-center mt-[15vh]'>
          Registrarse
        </h1>
        {
          showErrors && (
            <div className='flex justify-center'>
              <span className='text-red-500 text-xs italic mb-5'>
                {errorMessage}
              </span>
            </div>
          )
        }
        <form
          className='flex flex-col items-center'
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className='mb-4 flex flex-col'>
            <label
              className='block text-gray-50 text-sm font-semibold mb-2'
              htmlFor='name'
            >
              Nombre
            </label>
            <input
              className='shadow appearance-none border rounded w-[300px] py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
              id='name'
              type='text'
              placeholder='Nombre'
              {...register('name', {
                required: 'El nombre es requerido',
                minLength: {
                  value: 3,
                  message: 'El nombre debe tener al menos 3 caracteres'
                }
              })}
            />
            {errors.name && (
              <span className='text-red-500 text-sm'>
                {errors.name.message}
              </span>
            )}
          </div>
          <div className='mb-4 flex flex-col'>
            <label
              className='block text-gray-50 text-sm font-semibold mb-2'
              htmlFor='email'
            >
              Email
            </label>
            <input
              className='shadow appearance-none border rounded w-[300px] py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
              id='email'
              type='email'
              placeholder='user@email.com'
              {...register('email', {
                required: 'El email es requerido',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'El email no es válido'
                }
              })}
            />
            {errors.email && (
              <span className='text-red-500 text-sm'>
                {errors.email.message}
              </span>
            )}
          </div>
          <div className='mb-4 flex flex-col'>
            <label
              className='block text-gray-50 text-sm font-semibold mb-2'
              htmlFor='password'
            >
              Password
            </label>
            <input
              className='shadow appearance-none border rounded w-[300px] py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
              id='password'
              type='password'
              placeholder='********'
              {...register('password', {
                required: 'El password es requerido',
                minLength: {
                  value: 6,
                  message: 'El password debe tener al menos 6 caracteres'
                }
              })}
            />
            {errors.password && (
              <span className='text-red-500 text-sm'>
                {errors.password.message}
              </span>
            )}
          </div>
          <button
            className='bg-gptlogo hover:bg-green-700 text-white font-bold sm:py-2 sm:px-2 rounded-full focus:outline-none focus:shadow-outline sm:w-1/2 w-1/2 h-12'
            type='submit'
          >
            Registrarse
          </button>
        </form>
        <Link
          href='/auth/login'
          passHref
          legacyBehavior
        >
          <a className='flex justify-end mr-10 text-gray-50 underline mt-5 mb-10'>¿Ya tienes cuenta?</a>
        </Link>
      </div>
    </AuthLayOut>
  );
};

export default RegisterPage;
