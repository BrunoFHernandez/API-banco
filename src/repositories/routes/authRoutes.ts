
import { Router } from "express";
import { authService } from "../../services/authService";

const router = Router();

router.post("/register", async (req, res) => {
  const { email, senha } = req.body;
  try {
    const user = await authService.register(email, senha);
    res.status(201).json({ mensagem: "Usuário criado", id: user.id });
  } catch (err: any) {
    res.status(400).json({ erro: err.message });
  }
});

router.post("/login", async (req, res) => {
  const { email, senha } = req.body;
  try {
    const token = await authService.login(email, senha);
    res.json({ token });
  } catch (err: any) {
    res.status(401).json({ erro: err.message });
  }
});

export default router;
