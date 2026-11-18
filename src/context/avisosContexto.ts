/**
 * Contexto dos avisos do cidadão logado (sino do celular e tela Avisos).
 * Fica separado do hook por causa do React Refresh; os hooks estão em hooks/useAvisos.ts.
 */
import { createContext } from "react";
import type { Consulta, OfertaVaga } from "../types";

/** O que o Celular entrega para as telas: os mesmos avisos que o sino conta. */
export interface AvisosValor {
  /** Consultas de quem está logado que estão na janela de confirmação (vêm de GET /consultas). */
  confirmacoes: Consulta[];
  /** Ofertas de vaga da lista do dia para quem está logado (só no front, demonstração). */
  ofertas: OfertaVaga[];
  /** Número mostrado no sino: confirmações + ofertas. */
  total: number;
  carregando: boolean;
  erro: string | null;
  /** Busca os avisos de novo (depois de confirmar, cancelar ou agendar). */
  recarregar: () => void;
}

export const AvisosContext = createContext<AvisosValor | null>(null);
