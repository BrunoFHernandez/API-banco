import { userRepository } from "../repositories/userRepository";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "segredo_supersecreto";

export const authService = {
  async register(email: string, senha: string) {
    const existing = await userRepository.findByEmail(email);
    if (existing) throw new Error("Email já cadastrado");
    return userRepository.create(email, senha);
  },

  async login(email: string, senha: string) {
    const usuario = await userRepository.findByEmail(email);
    if (!usuario) throw new Error("Email ou senha inválidos");

    const valid = await userRepository.checkPassword(usuario, senha);
    if (!valid) throw new Error("Email ou senha inválidos");

    const token = jwt.sign({ id: usuario.id, email: usuario.email }, JWT_SECRET, {
      expiresIn: "1h",
    });

    return token;
  },

  verifyToken(token: string) {
    return jwt.verify(token, JWT_SECRET);
  },
};
