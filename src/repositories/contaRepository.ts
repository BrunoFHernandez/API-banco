import {PrismaClient } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';

const prisma = new PrismaClient();

interface ContaData {
    id: string;
    saldo: Decimal;
}


export const contaRepository = {
 async findById(id: string): Promise<ContaData | null> {
    const conta = await prisma.conta.findUnique({ where: { id } });
    return conta ? { id: conta.id, saldo: conta.saldo } : null;
  },
  async create (saldoInicial: number) {
    const novaConta = await prisma.conta.create({
        data: {
            saldo: saldoInicial,
        },
    });
    return novaConta;
  },

  async transferirSaldos(
    contaOrigemId: string,
    novoSaldoOrigem: number,
    contaDestinoId: string,
    novoSaldoDestino: number
  ) {
    try {
        await prisma.$transaction([
            prisma.conta.update({
                where: { id: contaOrigemId },
                data: { saldo: novoSaldoOrigem },
            }),
            prisma.conta.update({
                where: { id: contaDestinoId },
                data: { saldo: novoSaldoDestino },
            }),
        ]);
        return true;
    } catch (error) {
        console.error('Falha na transação de transferência:', error);
        return false;
    }
  }
}