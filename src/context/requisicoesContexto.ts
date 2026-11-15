/**
 * Contexto do painel de requisições (aba Status das APIs).
 * Fica separado do Provider por causa do React Refresh; o hook está em useRequisicoes.ts.
 */
import { createContext } from "react";
import type { Requisicao } from "../types";

/** O que o RequisicoesProvider entrega para as telas. */
export interface RequisicoesValor {
  /** Últimas chamadas, da mais nova para a mais antiga. */
  requisicoes: Requisicao[];
  /** Limpa o painel. */
  limparRequisicoes: () => void;
}

export const RequisicoesContext = createContext<RequisicoesValor | null>(null);
