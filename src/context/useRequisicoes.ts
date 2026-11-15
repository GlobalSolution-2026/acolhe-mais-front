import { useContext } from "react";
import { RequisicoesContext, type RequisicoesValor } from "./requisicoesContexto";

/**
 * Hook do painel de requisições: lista das últimas chamadas e o botão de limpar.
 * Só funciona dentro do RequisicoesProvider (as abas de /simulador).
 */
export function useRequisicoes(): RequisicoesValor {
  const contexto = useContext(RequisicoesContext);
  if (!contexto) throw new Error("useRequisicoes deve ser usado dentro do RequisicoesProvider.");
  return contexto;
}
