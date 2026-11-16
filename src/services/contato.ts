/**
 * Serviço do formulário de Contato (página institucional).
 */
import type { DadosContato } from '../types/institucional';
import { esperar } from './http';

/**
 * Envia a mensagem do formulário de Contato.
 * DEMONSTRAÇÃO: não existe na API Java (nem na Flask) um endpoint de contato.
 * Por isso a função só espera ~1,2 s para simular a rede e resolve sem enviar nada.
 * Os dados não são gravados nem mostrados no console, para não expor e-mail e mensagem da pessoa.
 * @param dados nome, e-mail, assunto e mensagem já validados pelo formulário
 */
export async function enviarMensagemContato(dados: DadosContato): Promise<void> {
  // O parâmetro fica na assinatura para a troca por um fetch real ser só trocar o corpo da função.
  void dados;
  await esperar(1200);
}
