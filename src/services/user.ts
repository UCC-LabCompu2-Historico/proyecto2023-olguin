import bcrypt from 'bcrypt';
import { User } from '@/models';


/*
  Clase que se encarga de manejar las peticiones a la base de datos relacionadas con los usuarios
*/
export class UserService {
  private user:typeof User;

  constructor() {
    this.user = User;
  }

  /*
    Metodo que se encarga de encriptar la contraseña del usuario
    @param {string} password - Contraseña del usuario
    @return {Promise<string>} - Contraseña encriptada
  */
  private async hashPassword(password: string) {
    try {
      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(password, salt);

      return hash;
    } catch (err) {
      throw new Error(`Internal server error:${err}`);
    }
  }

  /*
    Metodo que se encarga de comparar la contraseña del usuario con la contraseña encriptada
    @param {string} password - Contraseña del usuario
    @param {string} hash - Contraseña encriptada
    @return {Promise<boolean>} - Resultado de la comparacion
  */
  private async comparePassword(password: string, hash: string) {
    try {
      const result = await bcrypt.compare(password, hash);
      return result;
    } catch (err) {
      throw new Error(`Internal server error:${err}`);
    }
  }

  /*
    Metodo que se encarga de registrar un nuevo usuario en la base de datos
    @param {string} name - Nombre del usuario
    @param {string} email - Correo electronico del usuario
    @param {string} password - Contraseña del usuario
    @return {Promise<IUser>} - Usuario registrado
  */
  public async register(name: string, email: string, password: string) {
    try {
      if (!name || !email || !password) throw new Error('Missing fields');
      if (password.length < 6)
        throw new Error('Password must be at least 6 characters long');
      if (!email.includes('@')) throw new Error('Invalid email address');

      const user = await this.user.find({ email: email }).lean();
      if (JSON.stringify(user) !== '[]') {
        return false;
      }

      const hash = await this.hashPassword(password);
      const newUser = new this.user({ name, email, password: hash });
      const savedUser = await newUser.save();

      return savedUser;
    } catch (err) {
      throw new Error(`Internal server error:${err}`);
    }
  }

  /*
    Metodo que se encarga de loguear un usuario en la base de datos
    @param {string} email - Correo electronico del usuario
    @param {string} password - Contraseña del usuario
    @return {Promise<IUser>} - Usuario logueado
  */
  public async login(email: string, password: string) {
    try {
      const user = await this.user.findOne({ email: email }).lean();
      if (!user) return false;

      const result = await this.comparePassword(password, user.password);
      if (!result) return false;

      return user;
    } catch (err) {
      throw new Error(`Internal server error:${err}`);
    }
  }

  /*
    Metodo que se encarga de obtener un usuario de la base de datos
    @param {string} id - Id del usuario
    @return {Promise<IUser>} - Usuario obtenido
  */
  public async getUserById(id: string) {
    try {
      const user = await this.user.findById(id).lean();
      if (!user) return false;

      return user;
    } catch (err) {
      throw new Error(`Internal server error:${err}`);
    }
  }

  /*
    Metodo que se encarga de actualizar la informacion de un usuario en la base de datos
    @param {string} id - Id del usuario
    @param {string} name - Nombre del usuario
    @param {string} email - Correo electronico del usuario
    @param {string} imageUrl - Url de la imagen del usuario
    @param {string} password - Contraseña del usuario
    @return {Promise<IUser>} - Usuario actualizado
  */
  public async updateUSerInfo(id?: string,name?: string,email?: string,imageUrl?: string, password?: string) {
    try {
      const user = await this.user.findById(id).lean();

      if (!user) return false;

      if (name && name !== '') {
        user.name = name;
      }
      if (email && email !== '') {
        user.email = email;
      }
      if (imageUrl && imageUrl !== '') {
        user.avatar = imageUrl;
      }
      if (password && password !== '') {
        const hash = await this.hashPassword(password);
        user.password = hash;
      }

      const updatedUser = await this.user
        .findByIdAndUpdate(id, user, { new: true })
        .lean();
      return updatedUser;

    } catch (err) {
      throw new Error(`Internal server error:${err}`);
    }
  }
}
