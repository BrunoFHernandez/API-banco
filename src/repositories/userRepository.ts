import { PrismaClient } from "@prisma/client";
import { hash, compare } from "bcrypt";

const prisma = new PrismaClient();

export interface UserData {
  id: string;
  email: string;
  senha: string;
}

export const userRepository = {
  async create(email: string, senha: string) {
    const senhaHash = await hash(senha, 10);
    return prisma.usuario.create({
      data: { email, senha: senhaHash },
    });
  },

  async findByEmail(email: string): Promise<UserData | null> {
    return prisma.usuario.findUnique({ where: { email } });
  },

  async checkPassword(usuario: UserData, senha: string) {
    return compare(senha, usuario.senha);
  },
};
