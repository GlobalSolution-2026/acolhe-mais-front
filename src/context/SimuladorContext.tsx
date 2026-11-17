/**
 * Provider do simulador: guarda o estado do modo demonstração (unidades, horários, cidadãos,
 * consultas, lista do dia...) e o salva no localStorage a cada mudança.
 * Também liga os serviços (services/api.ts) a este estado, para o modo demonstração funcionar.
 */
import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { conectarStore } from "../services/api";
import { carregarFeriados } from "../lib/feriados";
import { agora, carregarPreferenciaSimulacao } from "../lib/relogio";
import { entradaDoCidadao, listaDoDiaAberta, vincularEntradaSemLogin } from "../services/regrasAgendamento";
import { finalizarOferta, oferecerHorario, simularPrazo, vencerOfertas } from "../services/simulacao";
import type { Consulta, EntradaListaDoDia, Horario } from "../types";
import { iniciarQuestionario, responderNoQuestionario, trocarQueixaNoQuestionario, voltarNoQuestionario } from "../services/regrasOrientacao";
import type { CodigoQueixa, LocalOrientacao, OrientacaoEmAndamento, Resposta, ResultadoFinal } from "../types/orientacao";
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

  /** Começa uma orientação nova (a anterior, se houver, é substituída). */
  const iniciarOrientacao = useCallback(
    (codigoQueixa: CodigoQueixa, nrCep: string, local: LocalOrientacao = {}) =>
      atualizarEstado((e) => ({ ...e, orientacaoAtual: iniciarQuestionario(codigoQueixa, nrCep, local) })),
    [atualizarEstado],
  );

  /** Altera a orientação em andamento (se não houver nenhuma, não faz nada). */
  const alterarOrientacao = useCallback(
    (fn: (o: OrientacaoEmAndamento) => OrientacaoEmAndamento) =>
      atualizarEstado((e) => (e.orientacaoAtual ? { ...e, orientacaoAtual: fn(e.orientacaoAtual) } : e)),
    [atualizarEstado],
  );

  const responder = useCallback(
    (codigo: string, valor: Resposta) => alterarOrientacao((o) => responderNoQuestionario(o, codigo, valor)),
    [alterarOrientacao],
  );

  const voltarPergunta = useCallback(() => alterarOrientacao(voltarNoQuestionario), [alterarOrientacao]);

  const trocarQueixa = useCallback(
    (codigoQueixa: CodigoQueixa) => alterarOrientacao((o) => trocarQueixaNoQuestionario(o, codigoQueixa)),
    [alterarOrientacao],
  );

  const definirResultado = useCallback(
    (resultado: ResultadoFinal) => alterarOrientacao((o) => ({ ...o, resultado })),
    [alterarOrientacao],
  );

  const definirCidadaoAtual = useCallback(
    (idCidadao: number, nmCidadao?: string) =>
      atualizarEstado((e) => ({
        ...e,
        idCidadaoAtual: idCidadao,
        // Regra: a entrada na lista do dia feita sem login passa a ser desta conta.
        // O nome vem de quem chamou (cadastro da API); o mock é só o plano B.
        listaDoDia: vincularEntradaSemLogin(e.listaDoDia, idCidadao, nmCidadao ?? e.cidadaos.find((c) => c.idCidadao === idCidadao)?.nmCidadao),
      })),
    [atualizarEstado],
  );

  const sair = useCallback(() => atualizarEstado((e) => ({ ...e, idCidadaoAtual: null })), [atualizarEstado]);

  /** Regras: a lista do dia só abre em dia útil e a mesma pessoa não entra duas vezes. */
  const entrarNaListaDoDia = useCallback(
    (idUnidade: number, dsCor: EntradaListaDoDia["dsCor"], idOrientacao: number, nmCidadao?: string) =>
      atualizarEstado((e) => {
        if (!listaDoDiaAberta(agora()) || entradaDoCidadao(e.listaDoDia, e.idCidadaoAtual)) return e;
        const entrada: EntradaListaDoDia = {
          idEntrada: Math.max(0, ...e.listaDoDia.map((x) => x.idEntrada)) + 1,
          idUnidade,
          idCidadao: e.idCidadaoAtual,
          idOrientacao,
          // Nome do cadastro da API quando vier; senão, do mock (modo demonstração).
          nmCidadao: nmCidadao ?? e.cidadaos.find((c) => c.idCidadao === e.idCidadaoAtual)?.nmCidadao ?? "Você",
          dsCor,
          dtEntrada: agora().toISOString(),
          flPrioridade: false,
          flCidadao: true,
          status: "AGUARDANDO",
        };
        return { ...e, listaDoDia: [...e.listaDoDia, entrada] };
      }),
    [atualizarEstado],
  );

  const responderOferta = useCallback(
    (idOferta: number, resposta: "ACEITA" | "RECUSADA" | "EXPIRADA") =>
      atualizarEstado((e) => finalizarOferta(e, idOferta, resposta, agora())),
    [atualizarEstado],
  );

  const selecionarUnidadeRecepcao = useCallback(
    (idUnidade: number) => atualizarEstado((e) => ({ ...e, idUnidadeRecepcao: idUnidade })),
    [atualizarEstado],
  );

  const oferecerVaga = useCallback(
    (horario: Horario, consultas: Consulta[]) => atualizarEstado((e) => oferecerHorario(e, horario, agora(), consultas)),
    [atualizarEstado],
  );

  /** Libera as consultas não confirmadas da UBS da recepção e devolve o resumo do que aconteceu. */
  const simularPassagemPrazo = useCallback(() => {
    const { novoEstado, resumo } = simularPrazo(ref.current, agora());
    atualizarEstado(() => novoEstado);
    return resumo;
  }, [atualizarEstado]);

  const vencerPrazoOfertas = useCallback(() => atualizarEstado((e) => vencerOfertas(e, agora(), true)), [atualizarEstado]);

  // Regra: quem não foi encaixado no dia ganha prioridade no próximo dia útil.
  const encerrarDia = useCallback(
    () =>
      atualizarEstado((e) => ({
        ...e,
        listaDoDia: e.listaDoDia.map((x) => (x.status === "AGUARDANDO" ? { ...x, flPrioridade: true } : x)),
      })),
    [atualizarEstado],
  );

  // A cada segundo, vence as ofertas de vaga cujo prazo de 30 min (simulados) acabou e repassa a vaga.
  useEffect(() => {
    const relogio = setInterval(() => {
      const novo = vencerOfertas(ref.current, agora());
      if (novo !== ref.current) atualizarEstado(() => novo);
    }, 1000);
    return () => clearInterval(relogio);
  }, [atualizarEstado]);

  // Liga os serviços a este estado enquanto o simulador estiver aberto.
  useEffect(() => {
    conectarStore({ obterEstado, atualizarEstado });
    return () => conectarStore(null);
  }, [obterEstado, atualizarEstado]);

  // versaoFeriados entra nas dependências para as telas renderizarem de novo quando os feriados chegam.
  const valor = useMemo(
    () => ({
      estado, obterEstado, atualizarEstado, reiniciarDemonstracao, versaoFeriados,
      iniciarOrientacao, responder, voltarPergunta, trocarQueixa, definirResultado,
      definirCidadaoAtual, sair, entrarNaListaDoDia, responderOferta,
      selecionarUnidadeRecepcao, oferecerVaga, simularPassagemPrazo, vencerPrazoOfertas, encerrarDia,
    }),
    [estado, obterEstado, atualizarEstado, reiniciarDemonstracao, versaoFeriados,
      iniciarOrientacao, responder, voltarPergunta, trocarQueixa, definirResultado,
      definirCidadaoAtual, sair, entrarNaListaDoDia, responderOferta,
      selecionarUnidadeRecepcao, oferecerVaga, simularPassagemPrazo, vencerPrazoOfertas, encerrarDia],
  );

  return <SimuladorContext.Provider value={valor}>{children}</SimuladorContext.Provider>;
}
