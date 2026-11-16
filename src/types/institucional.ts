/**
 * Tipos dos dados fixos das páginas institucionais (Home, Sobre, Solução...).
 * Os dados ficam em src/data e as páginas só os percorrem com map.
 */
import type { Cor } from './orientacao';

/** Número de destaque com a fonte de onde ele veio (ex.: "~25%" das consultas perdidas por falta). */
export interface NumeroDestaque {
  /** Valor em destaque, já formatado (ex.: "72,7 mi"). */
  valor: string;
  /** Frase que explica o número. */
  texto: string;
  /** Autor e ano, no padrão do documento (ex.: "IEPS, 2022"). */
  fonte: string;
}

/** Cartão simples com título e texto (ex.: os públicos de "Para quem é"). */
export interface CartaoTexto {
  titulo: string;
  texto: string;
}

/** Passo de uma sequência numerada (o número vem da posição na lista). */
export type PassoNumerado = CartaoTexto;

/** Número sem fonte própria (a fonte fica na lista geral da página). */
export type NumeroSimples = Pick<NumeroDestaque, 'valor' | 'texto'>;

/** Serviço da rede do SUS (ex.: UBS, "Porta de entrada"). */
export interface ServicoSus extends CartaoTexto {
  /** Nível de atendimento, mostrado acima do nome. */
  nivel: string;
}

/** Uma das duas pontas do problema (urgência lotada e faltas na UBS). */
export interface PontaProblema extends CartaoTexto {
  /** Rótulo pequeno acima do título (ex.: "Ponta 1 · Na urgência"). */
  rotulo: string;
  numeros: NumeroSimples[];
}

/** Alternativa já existente, comparada com o Acolhe+ (Tabela 6 do documento). */
export interface Alternativa {
  nome: string;
  /** Quem oferece (ex.: "Prefeitura de SP"). */
  origem: string;
  /** O que a alternativa faz. */
  faz: string;
  /** O que falta para resolver o problema do Acolhe+. */
  falta: string;
}

/** Atalho para uma seção da mesma página (âncora). */
export interface Atalho {
  /** id da seção, sem o "#". */
  id: string;
  nome: string;
}

/** Linha do resultado da orientação: uma ou mais cores e o destino. */
export interface ResultadoCor {
  cores: Cor[];
  /** Nome em negrito (ex.: "Vermelho – SAMU"). */
  titulo: string;
  texto: string;
}

/** Cartão com rótulo pequeno, valor em destaque opcional e texto (prazos, camadas, modelo de negócio). */
export interface CartaoRotulado {
  rotulo: string;
  valor?: string;
  texto: string;
}

/** Grupo com título e lista de itens (ex.: benefícios para o cidadão). */
export interface GrupoItens {
  titulo: string;
  itens: string[];
}

/** Indicador de impacto (Tabela 4 do documento). */
export interface Indicador {
  nome: string;
  /** Como o indicador é calculado. */
  calculo: string;
  /** De onde vem o dado (ex.: "Plataforma"). */
  origem: string;
  /** true quando o indicador aparece no painel da recepção. */
  noPainel: boolean;
}

/** Limite da solução: trecho em destaque e o resto da frase. */
export interface Limite {
  destaque: string;
  texto: string;
}

/** Pergunta da FAQ. O id liga o botão à resposta (aria-controls) e serve de chave. */
export interface PerguntaFaq {
  id: string;
  pergunta: string;
  resposta: string;
}

/** Grupo de perguntas da FAQ. O id vira a âncora do atalho (ex.: "#grupo-orientacao"). */
export interface GrupoFaq {
  id: string;
  titulo: string;
  perguntas: PerguntaFaq[];
}

/** Dados do formulário de Contato (react-hook-form). */
export interface DadosContato {
  nome: string;
  email: string;
  /** Um dos assuntos de ASSUNTOS_CONTATO ("" enquanto nada foi escolhido). */
  assunto: string;
  mensagem: string;
}

/** Canal de contato mostrado em cartão (e-mail, telefone, endereço). */
export interface CanalContato {
  rotulo: string;
  valor: string;
  /** Linha menor abaixo do valor (ex.: horário de atendimento). */
  detalhe: string;
}
