import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth'; 
import { firebaseAuth } from './config';



const googleProvider = new GoogleAuthProvider(); 

/*
    Funcion que se encarga de iniciar sesion con google haciendo uso de firebase
    @returns {Promise<{ok: boolean, user: any, error?: string}>} - Promesa que se resuelve cuando se inicia sesion o cuando ocurre un error
*/
export const signInWithGoogle = async() => {
    
    try{
        const result = await signInWithPopup(firebaseAuth, googleProvider);
        const { displayName, email, uid,providerId, photoURL } = result.user; 

        return {
            ok: true,
            user: {
                displayName,
                email,
                uid,
                providerId,
                photoURL
            }
        }
    }catch(err:any){
        console.log(err); 
        return {
            ok: false,
            error: err.message
        }
    }
}
