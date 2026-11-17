/**
 * Provider do painel de requisições: guarda as últimas chamadas feitas pelo front
 * (método, rota, API, status, tempo e se foi real ou demonstração) para o balão de requisições.
 * Quem registra cada chamada é services/http.ts (requisitar e simular).
 */
import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { conectarPainelRequisicoes } from "../services/http";
import type { Requisicao } from "../types";
import { RequisicoesContext } from "./requisicoesContexto";

/** Quantas chamadas o painel guarda (as mais antigas saem). */
const LIMITE_REQUISICOES = 30;

/**
 * Envolve o simulador e escuta as chamadas feitas pelos serviços.
 * @param children telas do simulador
 */
export function RequisicoesProvider({ children }: { children: ReactNode }) {
  const [requisicoes, setRequisicoes] = useState<Requisicao[]>([]);
  // Contador para dar um id único a cada chamada (usado como key na lista).
  const proximoId = useRef(1);

  /** Recebe uma chamada do serviço e coloca no topo da lista. */
  const registrar = useCallback((dados: Omit<Requisicao, "id" | "dtRequisicao">) => {
    const nova: Requisicao = { ...dados, id: proximoId.current++, dtRequisicao: new Date().toISOString() };
    setRequisicoes((lista) => [nova, ...lista].slice(0, LIMITE_REQUISICOES));
  }, []);

  const limparRequisicoes = useCallback(() => setRequisicoes([]), []);

  // Liga o serviço ao painel enquanto o simulador estiver aberto.
  useEffect(() => {
    conectarPainelRequisicoes(registrar);
    return () => conectarPainelRequisicoes(null);
  }, [registrar]);

  const valor = useMemo(() => ({ requisicoes, limparRequisicoes }), [requisicoes, limparRequisicoes]);

  return <RequisicoesContext.Provider value={valor}>{children}</RequisicoesContext.Provider>;
}
