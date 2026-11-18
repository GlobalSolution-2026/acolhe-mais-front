/**
 * Dados fixos da página Solução (textos aprovados na demonstração 03-solucao.html).
 * Base: "Solução proposta", Tabela 4 (indicadores), Tabela 5 (camadas) e "Modelo de Negócio" do documento.
 */
import type {
  Atalho,
  CartaoRotulado,
  GrupoItens,
  Indicador,
  Limite,
  PassoNumerado,
  ResultadoCor,
} from '../types/institucional';

/** Atalhos da abertura, na ordem das seções da página. */
export const ATALHOS_SOLUCAO: Atalho[] = [
  { id: 'orientacao', nome: 'Orientação' },
  { id: 'vagas', nome: 'Vagas e lista do dia' },
  { id: 'confirmacao', nome: 'Confirmação' },
  { id: 'impacto', nome: 'Impacto' },
  { id: 'tecnologia', nome: 'Tecnologia' },
  { id: 'negocio', nome: 'Modelo de negócio' },
  { id: 'limites', nome: 'Limites' },
];

/** Os dois primeiros passos da orientação (o terceiro é o resultado por cor). */
export const PASSOS_SOLUCAO: PassoNumerado[] = [
  {
    titulo: 'CEP e queixa',
    texto:
      'A pessoa informa o CEP e escolhe uma de cinco queixas comuns na UBS: gripe ou resfriado, dor de garganta, diarreia e vômito, dor de cabeça ou ardência ao urinar.',
  },
  {
    // Regra: "Não sei" conta como o pior caso; sinais claros (ex.: falta de ar) só têm Sim ou Não.
    titulo: 'Perguntas curtas',
    texto:
      'Uma por vez, com nota de dor de 0 a 10. Na dúvida, "Não sei" conta como o pior caso. Sinais que a pessoa percebe com clareza, como falta de ar, têm só "Sim" ou "Não".',
  },
];

/** Para onde cada cor leva a pessoa. Verde e azul vão juntos, porque os dois levam à UBS. */
export const RESULTADOS_COR: ResultadoCor[] = [
  { cores: ['VERMELHO'], titulo: 'Vermelho – SAMU', texto: 'ligar para o 192, com roteiro do que falar.' },
  { cores: ['LARANJA'], titulo: 'Laranja – Pronto-socorro', texto: 'hospital do SUS, com acesso ao Busca Saúde.' },
  { cores: ['AMARELO'], titulo: 'Amarelo – UPA', texto: 'a UPA de referência, pela proximidade do CEP.' },
  { cores: ['VERDE', 'AZUL'], titulo: 'Verde e Azul – UBS', texto: 'horários livres nas UBS próximas.' },
];

/** Regras da lista do dia (oferta de vaga liberada), na ordem em que acontecem. */
export const ETAPAS_LISTA_DO_DIA = [
  'Um horário é liberado com pelo menos 1 hora de antecedência.',
  'A recepção oferece a vaga ao primeiro da lista, que tem 30 minutos para aceitar pelo app ou por telefone.',
  'Se ele recusar ou não responder, a oferta passa ao seguinte.',
  'Quem não foi encaixado recebe, com prioridade, o próximo horário livre, e a orientação de procurar a urgência se piorar.',
];

/**
 * Prazos de confirmação, contados em dias úteis antes da consulta.
 * Regra: risco ALTO (0,60 ou mais) antecipa o pedido e ganha lembrete; o risco nunca tira a vaga.
 */
export const PRAZOS_CONFIRMACAO: CartaoRotulado[] = [
  { rotulo: 'Risco baixo', valor: '2 dias úteis antes', texto: 'pedido de confirmação.' },
  { rotulo: 'Risco alto (0,60 ou mais)', valor: '3 dias úteis antes', texto: 'pedido de confirmação e mais um lembrete.' },
  { rotulo: 'Prazo final', valor: '1 dia útil antes', texto: 'sem confirmação, o horário volta à agenda da UBS.' },
];

/** Como a pessoa confirma ou cancela, e o que acontece com quem não tem contato. */
export const REGRAS_CONFIRMACAO = [
  'Confirma pelo app, por telefone ou na UBS; o canal fica registrado.',
  'Cancela tocando em "Não vou poder ir", e o horário vai para outra pessoa.',
  'Quem não tem nenhum contato válido não perde a vaga: a consulta fica nas pendências da recepção.',
];

/** Benefícios esperados (hipóteses a confirmar em piloto). */
export const BENEFICIOS: GrupoItens[] = [
  {
    titulo: 'Para o cidadão',
    itens: [
      'Menos dúvida sobre onde buscar atendimento.',
      'Consulta marcada na UBS nos casos leves, em vez de esperar na urgência, onde o tempo-alvo para esses casos chega a 4 horas.',
      'Pedido de socorro mais completo, com o roteiro da ligação ao SAMU 192.',
    ],
  },
  {
    titulo: 'Para a gestão municipal',
    itens: [
      'Menos casos verdes e azuis nas UPAs da região atendida.',
      'Horários que hoje ficam vazios voltando a ser usados.',
      'Um retrato da demanda que a UBS não consegue atender, pelo número de pessoas não encaixadas por dia.',
    ],
  },
];

/** Indicadores de impacto (Tabela 4). Os marcados com noPainel aparecem no painel da recepção. */
export const INDICADORES: Indicador[] = [
  {
    nome: 'Casos verdes e azuis nas UPAs',
    calculo: 'Atendimentos verdes e azuis ÷ total de atendimentos nas UPAs da região',
    origem: 'Dados das UPAs',
    noPainel: false,
  },
  {
    nome: 'Taxa de absenteísmo',
    calculo: 'Faltas ÷ consultas já ocorridas (realizadas e faltas), por UBS',
    origem: 'Plataforma',
    noPainel: true,
  },
  {
    nome: 'Reaproveitamento de horários',
    calculo: 'Horários liberados e reocupados ÷ horários liberados',
    origem: 'Plataforma',
    noPainel: true,
  },
  {
    nome: 'Tempo até a consulta',
    calculo: 'Tempo médio entre a orientação e a consulta na UBS',
    origem: 'Plataforma',
    noPainel: false,
  },
  {
    nome: 'Comparecimento após orientação',
    calculo: 'Consultas realizadas ÷ consultas já ocorridas que vieram de uma orientação',
    origem: 'Plataforma',
    noPainel: true,
  },
  {
    nome: 'Pessoas não encaixadas',
    calculo: 'Pessoas da lista do dia sem encaixe, por UBS e por dia',
    origem: 'Plataforma',
    noPainel: true,
  },
];

/** Linha de base e piloto: como os indicadores serão comparados. */
export const MEDICAO: CartaoRotulado[] = [
  {
    rotulo: 'Linha de base',
    texto: 'Cada indicador é medido nos meses anteriores à implantação e comparado com os resultados depois dela.',
  },
  {
    rotulo: 'Piloto',
    texto: '20 UBS durante 24 meses, prazo que permite comparar os indicadores com a linha de base.',
  },
];

/** Camadas da solução (Tabela 5). */
export const CAMADAS: CartaoRotulado[] = [
  {
    rotulo: 'Interface',
    valor: 'React, Vite, TypeScript e Tailwind CSS · Vercel',
    texto: 'Orientação, agendamento e lista do dia do cidadão; painel da UBS.',
  },
  {
    rotulo: 'Regras de negócio',
    valor: 'Java com Spring Boot e JDBC · Docker no Render',
    texto: 'API REST de cadastro, agendamento, lista do dia, confirmação e liberação de horários.',
  },
  {
    rotulo: 'Dados',
    valor: 'Banco de dados Oracle',
    texto: 'Cidadãos, unidades, queixas, perguntas, orientações, agenda e lista do dia.',
  },
  {
    rotulo: 'Inteligência artificial',
    valor: 'Python, aprendizado de máquina e API Flask',
    texto: 'Previsão de falta e verificação de urgência, que só pode elevar a orientação.',
  },
  {
    rotulo: 'Operação da UBS',
    valor: 'Aplicação em Python com arquivo',
    texto: 'Simula a rotina da recepção: confirmações, faltas, liberação e encaixe.',
  },
];

/** Modelo de negócio B2G: o cidadão usa de graça e a secretaria paga. */
export const MODELO_NEGOCIO: CartaoRotulado[] = [
  { rotulo: 'Quem usa', texto: 'O cidadão adulto e a recepção das UBS. Para o cidadão, o uso é gratuito.' },
  { rotulo: 'Quem paga', texto: 'A secretaria municipal de saúde (B2G), por contrato de serviço contínuo.' },
  { rotulo: 'Como cobra', texto: 'Taxa de implantação e assinatura mensal por UBS atendida.' },
];

/** Etiquetas do tema e dos Objetivos de Desenvolvimento Sustentável. */
export const ETIQUETAS_NEGOCIO = ['CitizenTech', 'ODS 3 · Saúde e Bem-Estar', 'ODS 10 · Redução das Desigualdades'];

/** O que o Acolhe+ não faz. */
export const LIMITES: Limite[] = [
  {
    destaque: 'Não faz diagnóstico',
    texto: 'nem substitui a classificação de risco feita pelos profissionais nas UPAs e prontos-socorros.',
  },
  {
    destaque: 'Não acessa o prontuário.',
    texto: 'Usa só agenda, contato e respostas da orientação, como pede a LGPD.',
  },
  {
    destaque: 'Os modelos de IA',
    texto: 'foram treinados com bases públicas de outros contextos e precisam ser revalidados com dados da rede municipal.',
  },
  {
    destaque: 'A UBS e a UPA de referência',
    texto: 'são definidas pelo CEP, o que aproxima, mas não garante, a menor distância real.',
  },
];
