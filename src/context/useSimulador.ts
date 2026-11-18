import { useContext } from "react";
import { SimuladorContext, type SimuladorValor } from "./simuladorContexto";

/**
 * Hook do simulador: dá acesso ao estado do modo demonstração e ao "Reiniciar demonstração".
 * Só funciona dentro do SimuladorProvider (as abas de /simulador).
 */
export function useSimulador(): SimuladorValor {
  const contexto = useContext(SimuladorContext);
  if (!contexto) throw new Error("useSimulador deve ser usado dentro do SimuladorProvider.");
  return contexto;
}
