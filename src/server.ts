// src/server.ts
import express from 'express';
import { bankService } from './services/bankService';
import authRoutes from './repositories/routes/authRoutes';
import { authMiddleware } from './middlewares/authMiddleware';

const app = express();
const PORT = 3000;


app.use(express.json());


app.use('/api/auth', authRoutes);


app.get('/api/saldo/:contaId', authMiddleware, async (req, res) => {
    const { contaId } = req.params;
    const { data, status, erro } = await bankService.getSaldo(contaId);
    if (erro) {
        return res.status(status).json({ erro });
    }
    res.status(status).json({ data });
});

app.post('/api/transferir', authMiddleware, async (req, res) => {
    const { contaOrigem, contaDestino, valor } = req.body;

    if (!contaOrigem || !contaDestino || typeof valor !== 'number') {
        return res.status(400).json({ erro: 'Dados de transferência inválidos.' });
    }

    const { mensagem, status, erro } = await bankService.transferir(contaOrigem, contaDestino, valor);
    if (erro) {
        return res.status(status).json({ erro });
    }
    res.status(status).json({ mensagem });
});

app.post('/api/criar_conta', authMiddleware, async (req, res) => {
    const saldoInicial = req.body.saldoInicial || 0;
    const novaConta = await bankService.criarConta(saldoInicial);

    res.status(201).json({
        mensagem: 'Conta criada com sucesso.',
        conta_id: novaConta.id,
    });
});


app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error(err);
    res.status(500).json({ erro: 'Erro interno do servidor' });
});


app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
