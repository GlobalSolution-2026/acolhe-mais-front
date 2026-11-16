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
