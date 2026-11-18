/**
 * Dados fixos da Home (textos aprovados na demonstração 01-home.html).
 */
import type { CartaoTexto, NumeroDestaque, PassoNumerado } from '../types/institucional';

/** As 5 queixas atendidas pela orientação, que giram no título do topo. */
export const QUEIXAS_HOME = [
  'gripe ou resfriado',
  'dor de garganta',
  'diarreia e vômito',
  'dor de cabeça',
  'ardência ao urinar',
];

/** Números do problema mostrados ao lado do título, com a fonte de cada um. */
export const NUMEROS_PROBLEMA: NumeroDestaque[] = [
  {
    valor: '72,7 mi',
    texto: 'de pessoas sem equipe de Saúde da Família de referência em 2021.',
    fonte: 'IEPS, 2022',
  },
  {
    valor: '~25%',
    texto: 'das consultas agendadas no SUS se perdem porque o paciente falta.',
    fonte: 'Morais et al., 2023',
  },
  {
    valor: '69,7%',
    texto: 'dos atendimentos de um grande serviço de emergência foram pouco urgentes (verde).',
    fonte: 'Anziliero et al., 2016',
  },
];

/** Os 3 passos da seção "Como funciona a orientação". */
export const PASSOS_ORIENTACAO: PassoNumerado[] = [
  {
    titulo: 'Conte o que está sentindo',
    texto: 'Informe o CEP e escolha a queixa entre cinco das mais comuns na UBS.',
  },
  {
    // Regra: na dúvida ("Não sei"), a orientação considera o pior caso, por segurança.
    titulo: 'Responda perguntas curtas',
    texto: 'Uma por vez. Na dúvida, toque em "Não sei": a orientação considera a situação mais grave.',
  },
  {
    titulo: 'Veja onde ir',
    texto: 'SAMU 192, pronto-socorro, UPA ou UBS. Nos casos leves, você já agenda na UBS mais próxima.',
  },
];

/** Os 3 públicos da seção "Para quem é". */
export const PUBLICOS: CartaoTexto[] = [
  {
    titulo: 'Cidadão',
    texto: 'Orientação e agendamento gratuitos. Quem não tem celular é atendido pela recepção da UBS.',
  },
  {
    titulo: 'Recepção da UBS',
    texto: 'Agenda, confirmações e lista do dia em um só painel.',
  },
  {
    titulo: 'Secretaria municipal',
    texto: 'Horários que ficariam vazios voltam a ser usados, e casos leves deixam de lotar as UPAs.',
  },
];
