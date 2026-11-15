/**
 * Provider do simulador: guarda o estado do modo demonstração (unidades, horários, cidadãos,
 * consultas, lista do dia...) e o salva no localStorage a cada mudança.
 * Também liga os serviços (services/api.ts) a este estado, para o modo demonstração funcionar.
 */
import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { conectarStore } from "../services/api";
import { carregarFeriados } from "../lib/feriados";
import { carregarPreferenciaSimulacao } from "../lib/relogio";
import { estadoInicial, lerEstadoSalvo, salvarEstado, type EstadoSimulador } from "./estadoSimulador";
import { SimuladorContext } from "./simuladorContexto";

/** Primeiro estado: o salvo no navegador (se for de hoje) ou os dados de exemplo. */
function carregarEstado(): EstadoSimulador {
  // A preferência de simular dia útil vem antes: ela define o "hoje" da semente.
  carregarPreferenciaSimulacao();
  return lerEstadoSalvo() ?? estadoInicial();
}

/**
 * Envolve as abas do simulador e fornece o estado do mock.
 * @param children telas do simulador
 */
export function SimuladorProvider({ children }: { children: ReactNode }) {
  const [estado, setEstado] = useState<EstadoSimulador>(carregarEstado);
  // Cópia do estado mais recente para os serviços lerem sem esperar o próximo render.
  const ref = useRef(estado);
  // Muda quando os feriados da BrasilAPI chegam, para as telas recalcularem os dias úteis.
  const [versaoFeriados, setVersaoFeriados] = useState(0);

  // Salva no localStorage a cada mudança (F5 não perde a demonstração).
  useEffect(() => {
    salvarEstado(estado);
  }, [estado]);

  // Busca os feriados nacionais deste ano e do próximo (se falhar, vale a lista fixa).
  useEffect(() => {
    let ativo = true;
    const ano = new Date().getFullYear();
    void Promise.all([carregarFeriados(ano), carregarFeriados(ano + 1)]).then(() => {
      if (ativo) setVersaoFeriados((v) => v + 1);
    });
    return () => {
      ativo = false;
    };
  }, []);

  /** Lê o estado mais recente (os serviços chamam isto depois do await). */
  const obterEstado = useCallback(() => ref.current, []);

  /** Aplica uma mudança no estado e já deixa a cópia (ref) atualizada. */
  const atualizarEstado = useCallback((fn: (atual: EstadoSimulador) => EstadoSimulador) => {
    const novo = fn(ref.current);
    ref.current = novo;
    setEstado(novo);
  }, []);

  /** Volta aos dados de exemplo (botão "Reiniciar demonstração"). */
  const reiniciarDemonstracao = useCallback(() => {
    const novo = estadoInicial();
    ref.current = novo;
    setEstado(novo);
  }, []);

  // Liga os serviços a este estado enquanto o simulador estiver aberto.
  useEffect(() => {
    conectarStore({ obterEstado, atualizarEstado });
    return () => conectarStore(null);
  }, [obterEstado, atualizarEstado]);

  // versaoFeriados entra nas dependências para as telas renderizarem de novo quando os feriados chegam.
  const valor = useMemo(
    () => ({ estado, obterEstado, atualizarEstado, reiniciarDemonstracao, versaoFeriados }),
    [estado, obterEstado, atualizarEstado, reiniciarDemonstracao, versaoFeriados],
  );

  return <SimuladorContext.Provider value={valor}>{children}</SimuladorContext.Provider>;
}
