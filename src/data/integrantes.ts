/**
 * Dados dos integrantes do grupo (decisoes-front.md, seção 7, e demonstração 06-integrantes.html).
 * Fotos: arquivos em public/integrantes/<RM>.jpeg, referenciados no campo foto.
 * Sem foto, ou se a imagem não carregar, o AvatarIntegrante mostra as iniciais.
 * RMs e links: lista enviada pelo grupo (os RMs batem com os nomes das fotos). Turmas conferidas pelo grupo (1TDSPI, 1TDSPO e 1TDSPW).
 */
import type { Integrante } from '../types/institucional';

export const INTEGRANTES: Integrante[] = [
  {
    rm: '570281',
    nome: 'Ana Carolina Orcelli Bautzer',
    funcao: 'Líder do projeto',
    turma: '1TDSPI',
    disciplinas: ['Software Engineering', 'Banco de Dados', 'Front-End', 'IA'],
    contribuicoes: [
      { titulo: 'Coordenação', texto: 'Organização do grupo, dos prazos e da integração entre as disciplinas.' },
      {
        titulo: 'Documento de Software',
        texto: 'Problema, solução, modelo de negócio, precificação e backlog no Trello.',
      },
      { titulo: 'Protótipo e simulador', texto: 'Telas do cidadão e da recepção da UBS e o simulador do site.' },
      { titulo: 'Banco de dados', texto: 'Modelagem das tabelas e scripts SQL no Oracle.' },
      {
        titulo: 'Risco de falta',
        texto:
          'Modelo de aprendizado de máquina que estima a chance de o paciente faltar e antecipa a confirmação (risco alto a partir de 0,60).',
      },
    ],
    github: 'https://github.com/anabautzer',
    linkedin: 'https://www.linkedin.com/in/ana-bautzer/',
    foto: '/integrantes/570281.jpeg',
  },
  {
    rm: '570451',
    nome: 'Cauã Mathias Bertini',
    funcao: 'Back-end (Python)',
    turma: '1TDSPI',
    disciplinas: ['Python'],
    contribuicoes: [
      {
        titulo: 'Rotina da recepção',
        texto:
          'Aplicação em Python que simula a agenda do dia: confirmações, faltas, liberação de horários e encaixe da lista do dia.',
      },
      { titulo: 'Persistência', texto: 'Gravação e leitura dos dados em arquivo.' },
    ],
    github: 'https://github.com/cauabertini',
    linkedin: 'https://www.linkedin.com/in/caua-mathias-bertini/',
    foto: '/integrantes/570451.jpeg',
  },
  {
    rm: '570412',
    nome: 'Eduardo Lima de Souza',
    funcao: 'Front-end',
    turma: '1TDSPI',
    disciplinas: ['Front-End'],
    contribuicoes: [
      {
        titulo: 'Páginas do site',
        texto: 'Home, Sobre, Solução, FAQ, Contato e Integrantes em React, Vite, TypeScript e Tailwind CSS.',
      },
      { titulo: 'Rotas e layout', texto: 'Organização das rotas, cabeçalho, rodapé e painel de integrantes.' },
      { titulo: 'Publicação', texto: 'Deploy do front na Vercel.' },
    ],
    github: 'https://github.com/duduutech',
    linkedin: 'https://www.linkedin.com/in/duduutech/',
    foto: '/integrantes/570412.jpeg',
  },
  {
    rm: '568780',
    nome: 'Nicolas Frazão Vieira Molina',
    funcao: 'Inteligência artificial',
    turma: '1TDSPO',
    disciplinas: ['IA'],
    contribuicoes: [
      {
        titulo: 'Verificação de urgência',
        texto:
          'Modelo que confere se um caso classificado como verde ou azul deveria ir à UPA; ele só pode elevar a orientação.',
      },
      { titulo: 'API de IA', texto: 'Disponibilização dos modelos por uma API em Flask.' },
    ],
    github: 'https://github.com/Frazaomol',
    linkedin: 'https://www.linkedin.com/in/nicolas-molina-3a9257355/',
    foto: '/integrantes/568780.jpeg',
  },
  {
    rm: '573178',
    nome: 'Nicolas Rodrigues Martins',
    // "NM" já é do Nicolas Molina; aqui usa nome e segundo nome, como na demonstração.
    iniciais: 'NR',
    funcao: 'Back-end (Java)',
    turma: '1TDSPW',
    disciplinas: ['Java'],
    contribuicoes: [
      {
        titulo: 'API REST',
        texto: 'Spring Boot com JDBC: cadastro, agendamento, lista do dia, confirmação e liberação de horários.',
      },
      { titulo: 'Publicação', texto: 'API em Docker no Render, consumida pelo front.' },
    ],
    github: 'https://github.com/NickRM22',
    linkedin: 'https://www.linkedin.com/in/nicolas-rodrigues-martins-126607360/',
    foto: '/integrantes/573178.jpeg',
  },
];
