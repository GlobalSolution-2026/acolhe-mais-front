/**
 * Conclusão da orientação e escolha das unidades indicadas (veio do protótipo, services/orientacao.ts).
 * Junta as regras (inspiradas em Manchester), a verificação de urgência da IA e o salvamento da orientação.
 */
import { obterQueixa } from "../data/queixas";
import type { Unidade } from "../types";
import type { CodigoQueixa, Respostas, ResultadoFinal } from "../types/orientacao";
import { salvarOrientacao } from "./api";
import { verificarUrgencia } from "./ia";
import { calcularOrientacao, DESTINO_POR_COR } from "./regrasOrientacao";

/** Opções que indicam alteração do estado mental, por pergunta de marcar. */
const SINAIS_ESTADO_MENTAL: Record<string, string[]> = {
  P4: ["CONFUSO", "SONOLENTO", "DESMAIOU"],
  D3a: ["CONFUSO", "SONOLENTO", "DESMAIOU"],
  U1: ["CONFUSO", "SONOLENTO", "DESMAIOU"],
  C3: ["CONFUSAO"],
};

/** Estado mental alerta = nenhuma pergunta marcou confusão, sonolência ou desmaio (entrada do Modelo 2). */
export const estadoMentalAlerta = (r: Respostas): boolean =>
  !Object.entries(SINAIS_ESTADO_MENTAL).some(([codigo, valores]) => {
    const marcadas = r[codigo];
    return Array.isArray(marcadas) && valores.some((v) => marcadas.includes(v));
  });

/**
 * Conclui a orientação: aplica as regras, chama a verificação de urgência e salva a orientação.
 * Regra: o Modelo 2 só pode ELEVAR a cor (verde/azul → amarelo), nunca baixar; por isso ele só é chamado
 * quando as regras deram verde ou azul.
 * Regra: se a API de IA falhar, a orientação segue com a cor das regras (não pode travar) e marca
 * flVerificacaoIndisponivel para a tela mostrar um aviso discreto.
 * @param idCidadao só quando a orientação é "Para mim" e há login (fica vinculada ao cadastro para a UBS)
 */
export async function concluirOrientacao(queixa: CodigoQueixa, respostas: Respostas, idCidadao: number | null = null): Promise<ResultadoFinal> {
  const regras = calcularOrientacao(queixa, respostas);
  const nrDor = typeof respostas["DOR"] === "number" ? respostas["DOR"] : null;
  let { dsCor } = regras;
  let flElevadaModelo = false;
  let flVerificacaoIndisponivel = false;

  if (dsCor === "VERDE" || dsCor === "AZUL") {
    const sexo = respostas["SX"] === "M" ? "M" : respostas["SX"] === "F" ? "F" : null;
    try {
      const { urgente } = await verificarUrgencia({
        idade: typeof respostas["PF2"] === "number" ? respostas["PF2"] : 0,
        sexo,
        // Trauma só é perguntado na dor de cabeça (C5); nas outras queixas vai false.
        trauma: respostas["C5"] === "SIM",
        nrDor: nrDor ?? 0,
        estadoMentalAlerta: estadoMentalAlerta(respostas),
      });
      if (urgente) {
        dsCor = "AMARELO";
        flElevadaModelo = true;
      }
    } catch {
      flVerificacaoIndisponivel = true;
    }
  }

  const dsDestino = DESTINO_POR_COR[dsCor];
  const salva = await salvarOrientacao({ idQueixa: obterQueixa(queixa).idQueixa, dsCor, dsDestino, nrDor, flElevadaModelo, idCidadao });
  return { idOrientacao: salva.idOrientacao, dsCor, dsDestino, sinaisMarcados: regras.sinaisMarcados, nrDor, flElevadaModelo, flVerificacaoIndisponivel };
}

/** Três primeiros números do CEP (região), usados para achar a unidade mais perto. */
const prefixoCep = (cep: string) => cep.replace(/\D/g, "").slice(0, 3);

/**
 * UPA de referência: a de CEP mais próximo, comparando os 3 primeiros números.
 * (Aproximação do protótipo: sem mapa, o prefixo do CEP indica a região.)
 */
export function upaMaisProxima(upas: Unidade[], nrCep: string): Unidade | null {
  const alvo = Number(prefixoCep(nrCep));
  let melhor: Unidade | null = null;
  let menor = Infinity;
  for (const u of upas) {
    const distancia = Math.abs(Number(prefixoCep(u.nrCep)) - alvo);
    if (distancia < menor) {
      menor = distancia;
      melhor = u;
    }
  }
  return melhor;
}

/** UBS na ordem de proximidade: mesmo prefixo de CEP primeiro, depois a menor diferença entre prefixos. */
export function ordenarUbsPorCep(ubs: Unidade[], nrCep: string): Unidade[] {
  const alvo = prefixoCep(nrCep);
  return [...ubs].sort((a, b) => {
    const da = prefixoCep(a.nrCep) === alvo ? 0 : 1;
    const db = prefixoCep(b.nrCep) === alvo ? 0 : 1;
    if (da !== db) return da - db;
    return Math.abs(Number(prefixoCep(a.nrCep)) - Number(alvo)) - Math.abs(Number(prefixoCep(b.nrCep)) - Number(alvo));
  });
}
