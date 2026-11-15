/**
 * Contexto do simulador (Context API). Fica separado do Provider porque o React Refresh
 * só aceita componentes nos arquivos .tsx; o hook useSimulador() está em useSimulador.ts.
 */
import { createContext } from "react";
import type { CodigoQueixa, LocalOrientacao } from "../types/orientacao";
import type { EstadoSimulador } from "./estadoSimulador";

/** O que o SimuladorProvider entrega para as telas. */
export interface SimuladorValor {
  /** Estado atual do mock (modo demonstração). */
  estado: EstadoSimulador;
  /** Leitura do estado mais recente fora do render (usada pelos serviços). */
  obterEstado: () => EstadoSimulador;
  /** Altera o estado a partir do atual (as regras puras recebem o estado e devolvem um novo). */
  atualizarEstado: (fn: (atual: EstadoSimulador) => EstadoSimulador) => void;
  /** Volta tudo aos dados de exemplo (botão "Reiniciar demonstração"). */
  reiniciarDemonstracao: () => void;
  /** Sobe quando os feriados da BrasilAPI chegam (só para as telas recalcularem os dias úteis). */
  versaoFeriados: number;
  /** Começa uma orientação nova com a queixa escolhida, o CEP e o endereço (tela Início). */
  iniciarOrientacao: (codigoQueixa: CodigoQueixa, nrCep: string, local?: LocalOrientacao) => void;
}

export const SimuladorContext = createContext<SimuladorValor | null>(null);
