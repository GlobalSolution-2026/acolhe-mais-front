/** Regras do atendimento no balcão (funções puras, sem React). */
import { chaveDia, isDiaUtil } from "../lib/datas";
import type { Consulta, Horario, OfertaVaga } from "../types";
import type { Orientacao } from "../types/orientacao";

export type AvaliacaoCodigo =
  | { tipo: "INEXISTENTE" }
  | { tipo: "VENCIDA"; orientacao: Orientacao }
  | { tipo: "JA_UTILIZADA"; orientacao: Orientacao }
  | { tipo: "ENCAMINHAR"; orientacao: Orientacao }
  | { tipo: "OK"; orientacao: Orientacao };

/** Orientação pronta no balcão: veio do código do app ou do questionário feito aqui. */
export interface OrientacaoBalcao {
  orientacao: Orientacao;
  /** Sinais marcados (só no questionário do balcão; a orientação salva não guarda sinais). */
  sinais: string[];
}

/** Vincular só se ainda não tem dono ou se é o mesmo cidadão. */
export const podeVincular = (o: Pick<Orientacao, "idCidadao">, idCidadao: number): boolean =>
  o.idCidadao == null || o.idCidadao === idCidadao;

/**
 * Código digitado na recepção: precisa existir, ser do mesmo dia e não ter consulta.
 * Vínculo com outra pessoa só é conferido depois do CNS (podeVincular).
 */
export function avaliarCodigo(cd: number, orientacoes: Orientacao[], consultas: Consulta[], agora: Date): AvaliacaoCodigo {
  const orientacao = orientacoes.find((o) => o.idOrientacao === cd);
  if (!orientacao) return { tipo: "INEXISTENTE" };
  if (chaveDia(orientacao.dtOrientacao) !== chaveDia(agora.toISOString())) return { tipo: "VENCIDA", orientacao };
  if (consultas.some((c) => c.idOrientacao === cd)) return { tipo: "JA_UTILIZADA", orientacao };
  if (orientacao.dsCor !== "VERDE" && orientacao.dsCor !== "AZUL") return { tipo: "ENCAMINHAR", orientacao };
  return { tipo: "OK", orientacao };
}

/** Horários futuros livres da UBS, sem oferta pendente, do mais próximo ao mais distante. */
export function horariosLivresBalcao(horarios: Horario[], ofertas: OfertaVaga[], idUnidade: number, agora: Date): Horario[] {
  return horarios
    .filter((h) => h.idUnidade === idUnidade && !h.flOcupado && isDiaUtil(new Date(h.dtHorario)) && new Date(h.dtHorario).getTime() > agora.getTime() &&
      !ofertas.some((o) => o.idHorario === h.idHorario && o.status === "PENDENTE"))
    .sort((a, b) => a.dtHorario.localeCompare(b.dtHorario));
}
