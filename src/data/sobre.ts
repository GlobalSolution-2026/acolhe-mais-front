/**
 * Dados fixos da página Sobre (textos aprovados na demonstração 02-sobre.html).
 * Base: seções "Problema e oportunidade" e "Mercado e Benchmark" do documento do projeto.
 */
import type { Alternativa, NumeroSimples, PontaProblema, ServicoSus } from '../types/institucional';

/** Os 4 serviços da rede, do mais simples ao de risco imediato. */
export const SERVICOS_SUS: ServicoSus[] = [
  {
    nivel: 'Porta de entrada',
    titulo: 'UBS',
    texto: 'A Unidade Básica de Saúde, perto de casa, acompanha a população do bairro e organiza o acesso ao resto da rede.',
  },
  {
    nivel: 'Urgência intermediária',
    titulo: 'UPA 24h',
    texto: 'Funciona sem parar. Estabiliza o paciente, faz a primeira avaliação e encaminha ao hospital quando é preciso internar.',
  },
  {
    nivel: 'Casos graves',
    titulo: 'Pronto-socorro',
    texto: 'Nos hospitais, cuida dos casos mais graves e dos que precisam de acompanhamento especializado.',
  },
  {
    nivel: 'Risco imediato à vida',
    titulo: 'SAMU 192',
    texto: 'Atendimento móvel de urgência. Na ligação, a pessoa segue as instruções do médico regulador.',
  },
];

/** As duas pontas do problema que o Acolhe+ liga. */
export const PONTAS_PROBLEMA: PontaProblema[] = [
  {
    rotulo: 'Ponta 1 · Na urgência',
    titulo: 'Casos leves são a maioria nas UPAs e nos prontos-socorros',
    texto:
      'Na classificação de risco, verde e azul são os casos de menor gravidade, que muitas vezes poderiam ser resolvidos na UBS. Mesmo assim, eles ocupam a maior parte dos atendimentos.',
    numeros: [
      { valor: '73,2%', texto: 'dos atendimentos de uma grande emergência de Porto Alegre foram verdes ou azuis.' },
      { valor: '~65%', texto: 'dos atendimentos de 2025 nos prontos atendimentos e na UPA de Porto Alegre.' },
      { valor: '79,9%', texto: 'dos atendimentos da UPA de Ijuí (RS) no 1º semestre de 2025.' },
    ],
  },
  {
    rotulo: 'Ponta 2 · Na UBS',
    titulo: 'Consultas marcadas ficam vazias porque o paciente falta',
    texto:
      'Quando a pessoa esquece a consulta ou não consegue avisar, o horário fica sem uso, mesmo com gente esperando. As causas incluem o tempo longo até a data e o telefone desatualizado no cadastro.',
    numeros: [
      { valor: '~25%', texto: 'de faltas nas consultas agendadas, índice relatado para o SUS.' },
      {
        valor: '26,7%',
        texto: 'das consultas da Atenção Básica de Piracicaba (SP) no 1º trimestre de 2026: 34.365 faltas.',
      },
    ],
  },
];

/** Números de São Paulo, cidade usada como referência (cenário A). */
export const NUMEROS_SAO_PAULO: NumeroSimples[] = [
  { valor: '47,9%', texto: 'da população paulistana coberta pela Saúde da Família em 2023.' },
  { valor: '~6 milhões', texto: 'de moradores sem equipe de referência (estimativa com o Censo 2022).' },
  { valor: '483 UBS', texto: 'na rede municipal em julho de 2026.' },
  { valor: '2/3', texto: 'é a meta de cobertura da prefeitura até 2028.' },
];

/** Alternativas que já existem (Tabela 6 do documento). */
export const ALTERNATIVAS: Alternativa[] = [
  {
    nome: 'Agenda Fácil',
    origem: 'Prefeitura de SP',
    faz: 'Agendar, confirmar e cancelar consultas e exames na UBS.',
    falta: 'Não orienta sobre o serviço adequado.',
  },
  {
    nome: 'e-saúdeSP',
    origem: 'Prefeitura de SP',
    faz: 'Histórico, exames, vacinas e busca de serviços.',
    falta: 'Não indica o serviço pela gravidade nem prevê faltas.',
  },
  {
    nome: 'Meu SUS Digital',
    origem: 'Ministério da Saúde',
    faz: 'Cartão SUS, vacinas, exames e agendamento na Atenção Primária.',
    falta: 'Agenda só para quem tem equipe de referência.',
  },
  {
    nome: 'e-SUS APS',
    origem: 'Ministério da Saúde',
    faz: 'Prontuário e agenda dos profissionais da UBS.',
    falta: 'Ferramenta da equipe; não prevê faltas nem redistribui horários.',
  },
  {
    nome: 'Disque Saúde 136',
    origem: 'Ministério da Saúde',
    faz: 'Informações sobre saúde e serviços do SUS.',
    falta: 'Funciona em horário comercial e não agenda consultas.',
  },
  {
    nome: 'Ada Health',
    origem: 'Empresa privada',
    faz: 'Avaliação de sintomas por perguntas.',
    falta: 'Não é ligado ao SUS nem agenda consultas.',
  },
  {
    nome: 'Doctoralia',
    origem: 'Empresa privada',
    faz: 'Agendamento, lembretes e confirmação para clínicas.',
    falta: 'Voltado ao setor privado, sem ligação com o SUS.',
  },
];

/** Linha do Acolhe+ no fim da comparação, com os limites desta versão. */
export const ACOLHE_COMPARACAO = {
  faz: 'Orientação por queixa, agendamento nas vagas liberadas, lista do dia e confirmação pelo risco de falta.',
  limites: 'Nesta versão: cinco queixas, só adultos; a integração com a agenda da prefeitura fica para depois.',
};

/** Fontes dos dados da página (autor e ano, no padrão do documento). */
export const FONTES_SOBRE = [
  'ANZILIERO et al., 2016',
  'BRASIL, 2017a',
  'CULPO et al., 2025',
  'ESTRATÉGIA..., 2018',
  'IEPS, 2022',
  'MORAIS et al., 2023',
  'PORTO ALEGRE, 2026',
  'SÃO PAULO, 2024; 2025; 2026a',
  'A TRIBUNA PIRACICABANA, 2026',
];
