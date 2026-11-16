import { useCallback } from 'react';
import { useSimulador } from '../context/useSimulador';
import { agora } from '../lib/relogio';
import { listaDoDiaAberta } from '../services/regrasAgendamento';

/**
 * Coloca o cidadão logado na lista do dia da UBS, com a cor e o código da orientação em andamento.
 * Veio do protótipo (hooks/useEntrarNaListaDoDia). Usado nos horários da UBS e na volta do login.
 * Regras: só entra quem fez a orientação e deu verde ou azul, e só em dia útil.
 * @returns função que recebe a UBS e devolve true se a pessoa entrou na lista
 */
export function useEntrarNaListaDoDia() {
  const { obterEstado, entrarNaListaDoDia } = useSimulador();
  return useCallback(
    (idUnidade: number): boolean => {
      // Lê o estado mais recente: na volta do login, o render ainda não tem a conta nova.
      const resultado = obterEstado().orientacaoAtual?.resultado;
      if (!idUnidade || !listaDoDiaAberta(agora()) || (resultado?.dsCor !== 'VERDE' && resultado?.dsCor !== 'AZUL')) return false;
      entrarNaListaDoDia(idUnidade, resultado.dsCor, resultado.idOrientacao);
      return true;
    },
    [obterEstado, entrarNaListaDoDia],
  );
}
