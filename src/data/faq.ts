/**
 * Dados fixos da FAQ (textos aprovados na demonstração 04-faq.html, com base no documento de Software).
 * 18 perguntas em 4 grupos. Os atalhos da página são gerados a partir dos próprios grupos.
 */
import type { Atalho, GrupoFaq } from '../types/institucional';

export const GRUPOS_FAQ: GrupoFaq[] = [
  {
    id: 'grupo-orientacao',
    titulo: 'Sobre a orientação',
    perguntas: [
      {
        id: 'o-que-e',
        pergunta: 'O que é o Acolhe+?',
        resposta:
          'Uma plataforma que ajuda você a saber onde buscar atendimento no SUS. Nos casos leves, ela mostra os horários livres nas UBS próximas, inclusive os que ficariam vazios porque outro paciente faltou.',
      },
      {
        id: 'diagnostico',
        pergunta: 'O Acolhe+ faz diagnóstico?',
        resposta:
          'Não. A orientação indica o serviço mais adequado a partir das suas respostas, mas não diz qual é a doença e não substitui a avaliação de um profissional de saúde nem a classificação de risco feita nas UPAs e nos prontos-socorros.',
      },
      {
        id: 'queixas',
        pergunta: 'Quais queixas a orientação atende?',
        resposta:
          'Nesta versão, cinco queixas comuns na UBS, só para adultos: gripe ou resfriado, dor de garganta, diarreia e vômito, dor de cabeça e ardência ao urinar. Outras queixas e a orientação para crianças estão previstas para as próximas etapas.',
      },
      {
        id: 'cores',
        pergunta: 'O que significam as cores e os números?',
        resposta:
          'Cada cor tem um número, do 1 (mais grave) ao 5 (menos grave): 1 · Vermelho – SAMU, 2 · Laranja – Pronto-socorro, 3 · Amarelo – UPA, 4 · Verde – UBS e 5 · Azul – UBS. O número e o destino aparecem sempre junto com a cor, para quem não distingue as cores.',
      },
      {
        // Regra: "Não sei" conta como o pior caso, por segurança.
        id: 'nao-sei',
        pergunta: 'Por que o "Não sei" leva a um resultado mais grave?',
        resposta:
          'Por segurança. Quando você não tem certeza, a orientação considera a situação mais grave, para que a dúvida não leve você a esperar quando não deveria.',
      },
      {
        id: 'emergencia',
        pergunta: 'E se for uma emergência?',
        resposta:
          'Não precisa responder a nenhuma pergunta. O botão de emergência fica em todas as telas e leva direto ao SAMU 192, com um roteiro do que falar na ligação, e ao Disque-Intoxicação (0800 722 6001), que é gratuito e funciona 24 horas.',
      },
    ],
  },
  {
    id: 'grupo-agendamento',
    titulo: 'Agendamento e confirmação',
    perguntas: [
      {
        id: 'conta',
        pergunta: 'Preciso criar uma conta?',
        resposta:
          'Para fazer a orientação, não. O login é pedido só quando você escolhe agendar na UBS ou entrar na lista do dia, com o número do Cartão SUS (CNS) e uma senha. O acesso pela conta gov.br está previsto para uma próxima etapa.',
      },
      {
        id: 'lista-do-dia',
        pergunta: 'O que é a lista do dia?',
        resposta:
          'Quando não há horário livre, você pode entrar na lista do dia de uma UBS próxima. Se uma vaga for liberada, a recepção oferece a você, e você tem 30 minutos para aceitar pelo app ou por telefone. A lista funciona só nos dias úteis.',
      },
      {
        id: 'confirmar',
        pergunta: 'Como confirmo a minha consulta?',
        resposta:
          'Você recebe o pedido de confirmação 2 ou 3 dias úteis antes da consulta e pode confirmar até 1 dia útil antes, pelo app, por telefone com a recepção ou na própria UBS.',
      },
      {
        id: 'nao-posso-ir',
        pergunta: 'E se eu não puder ir?',
        resposta:
          'Toque em "Não vou poder ir" no app ou avise a recepção por telefone. O horário volta para a agenda e pode ser usado por outra pessoa.',
      },
      {
        // Regra: sem contato válido, a consulta não é liberada sozinha; fica nas pendências da recepção.
        id: 'nao-confirmar',
        pergunta: 'O que acontece se eu não confirmar?',
        resposta:
          'Depois do prazo, o horário volta para a agenda da UBS. Se você não tiver nenhum telefone ou contato válido, a consulta não é liberada automaticamente: ela fica com a recepção, para que a falta de acesso não faça você perder a vaga.',
      },
      {
        id: 'sem-celular',
        pergunta: 'Não tenho celular nem internet. Posso usar?',
        resposta:
          'Pode. A recepção da UBS faz a orientação, o cadastro (sem senha e sem exigir telefone), o agendamento e as ofertas de vaga no balcão.',
      },
    ],
  },
  {
    id: 'grupo-dados',
    titulo: 'Dados e privacidade',
    perguntas: [
      {
        id: 'dados',
        pergunta: 'Quais dados o Acolhe+ usa?',
        resposta:
          'Só os necessários para funcionar: agenda, contato e as respostas da orientação, como pede a Lei Geral de Proteção de Dados (LGPD). A plataforma não acessa o seu prontuário.',
      },
      {
        id: 'risco-falta',
        pergunta: 'O que é o risco de falta?',
        resposta:
          'Depois do agendamento, um modelo de aprendizado de máquina estima a chance de a pessoa faltar. Esse risco serve só para pedir a confirmação mais cedo. Ele nunca tira a vaga de ninguém.',
      },
    ],
  },
  {
    id: 'grupo-ubs',
    titulo: 'Para a UBS e a secretaria',
    perguntas: [
      {
        id: 'recepcao',
        pergunta: 'Como a recepção da UBS usa o Acolhe+?',
        resposta:
          'Por um painel com a agenda, as confirmações, a lista do dia, o atendimento no balcão e os indicadores da unidade, como a taxa de faltas e o reaproveitamento de horários.',
      },
      {
        id: 'quem-paga',
        pergunta: 'Quem paga pelo Acolhe+?',
        resposta:
          'A secretaria municipal de saúde, com uma taxa de implantação e uma assinatura mensal por UBS. Para o cidadão, o uso é gratuito.',
      },
      {
        id: 'substitui',
        pergunta: 'O Acolhe+ substitui o Agenda Fácil ou o e-SUS APS?',
        resposta:
          'Não. A ideia é complementar os sistemas que o município já usa. Em uma implantação real, o Acolhe+ se integraria à agenda municipal, sem acessar o prontuário.',
      },
      {
        id: 'funcionando',
        pergunta: 'O Acolhe+ já está funcionando?',
        resposta:
          'Ainda não. O Acolhe+ é um projeto acadêmico da Global Solution 2026/2 da FIAP e não tem vínculo com a Secretaria Municipal da Saúde. O simulador mostra como o fluxo funcionaria.',
      },
    ],
  },
];

/** Atalhos da abertura: um por grupo, gerados a partir de GRUPOS_FAQ. */
export const ATALHOS_FAQ: Atalho[] = GRUPOS_FAQ.map(({ id, titulo }) => ({ id, nome: titulo }));
