import { contaRepository } from "../repositories/contaRepository.ts";

export const bankService = {
    async getSaldo(contaId: string) {
        const conta = await contaRepository.findById(contaId);

        if (!conta) {
            return {
                erro: 'Conta não encontrada.', 
                status: 404
            };
        }
        return {
         data: { saldo: conta.saldo },
         status: 200
        };
    },




    async transferir(
    contaOrigemId: string,
    contaDestinoId: string,
    valor: number
  ) {
 
    if (valor <= 0) {
      return { erro: 'O valor da transferência deve ser positivo', status: 400 };
    }

 
    const contaOrigem = await contaRepository.findById(contaOrigemId);
    const contaDestino = await contaRepository.findById(contaDestinoId);

    if (!contaOrigem || !contaDestino) {
      return { erro: 'Uma ou ambas as contas não foram encontradas', status: 404 };
    }
    
    
    const saldoOrigem = Number(contaOrigem.saldo);
    if (saldoOrigem < valor) {
      return { erro: 'Saldo insuficiente', status: 400 };
    }

    
    const novoSaldoOrigem = saldoOrigem - valor;
    const novoSaldoDestino = Number(contaDestino.saldo) + valor;

    const sucesso = await contaRepository.transferirSaldos(
      contaOrigemId,
      novoSaldoOrigem,
      contaDestinoId,
      novoSaldoDestino
    );

    if (sucesso) {
      return { mensagem: 'Transferência realizada com sucesso', status: 200 };
    } else {
      return { erro: 'Falha ao processar a transferência', status: 500 };
    }
  },

    async criarConta(saldoInicial: number) {
       return contaRepository.create(saldoInicial);
    }
};