import bcrypt from 'bcrypt'

export const bcryptService = {
  generateHash: async (password: string) => {
    const salt = bcrypt.genSaltSync(10);
    return bcrypt.hash(password, salt);
  },

  checkPassword: async (password: string, hash: string) => {
    return bcrypt.compare(password, hash);
  }
}