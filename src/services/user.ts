import bcrypt from 'bcrypt';
import { User } from '@/models';
export class UserService {
  private user:typeof User;

  constructor() {
    this.user = User;
  }

  private async hashPassword(password: string) {
    try {
      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(password, salt);

      return hash;
    } catch (err) {
      throw new Error(`Internal server error:${err}`);
    }
  }

  private async comparePassword(password: string, hash: string) {
    try {
      const result = await bcrypt.compare(password, hash);
      return result;
    } catch (err) {
      throw new Error(`Internal server error:${err}`);
    }
  }

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

  public async getUserById(id: string) {
    try {
      const user = await this.user.findById(id).lean();
      if (!user) return false;

      return user;
    } catch (err) {
      throw new Error(`Internal server error:${err}`);
    }
  }

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
