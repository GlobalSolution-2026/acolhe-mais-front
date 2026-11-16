/**
 * Dados fixos da página Contato (aprovados na demonstração 05-contato.html).
 * Os dados de contato são de exemplo, do projeto acadêmico.
 */
import type { CanalContato } from '../types/institucional';

/** Cartões de contato da coluna esquerda. */
export const CANAIS_CONTATO: CanalContato[] = [
  { rotulo: 'E-mail', valor: 'contato@acolheplus.com.br', detalhe: 'Resposta em até 1 dia útil' },
  { rotulo: 'Telefone', valor: '(11) 4000-0000', detalhe: 'Segunda a sexta, das 8h às 18h' },
  { rotulo: 'Endereço', valor: 'FIAP · Av. Paulista, 1106 · Bela Vista', detalhe: 'São Paulo – SP, 01311-000' },
];

/** Opções do campo Assunto do formulário. */
export const ASSUNTOS_CONTATO = [
  'Dúvida sobre a orientação',
  'Problema no site',
  'Sou de uma UBS ou secretaria',
  'Outro assunto',
];
