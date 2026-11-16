/**
 * Tipos dos dados fixos das páginas institucionais (Home, Sobre, Solução...).
 * Os dados ficam em src/data e as páginas só os percorrem com map.
 */

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
