/**
 * Liga o cadastro e a ficha de saúde ao questionário de orientação (funções puras; veio do protótipo).
 * Quando a orientação é "Para mim" e a pessoa está logada, idade e sexo vêm do cadastro e algumas
 * doenças vêm da ficha, para não perguntar de novo. A tela avisa o que foi usado (transparência, LGPD).
 */
import { idadeEm } from "../lib/datas";
import type { Cidadao, CodigoDoencaBase, FichaSaude } from "../types";
import type { CodigoQueixa, OrientacaoEmAndamento, Respostas } from "../types/orientacao";
import { perguntasDaQueixa } from "./regrasOrientacao";

/** Doenças da ficha que permitem responder "SIM" a cada pergunta (hipertensão sozinha não conta). */
const DOENCAS_POR_PERGUNTA: Record<string, CodigoDoencaBase[]> = {
  P9: ["DIABETES", "PULMAO", "CORACAO", "RINS", "IMUNIDADE"],
  D11: ["DIABETES"],
  U7: ["DIABETES", "IMUNIDADE"],
};

/** Nome da doença no aviso de transparência. */
const NOME_DOENCA: Partial<Record<CodigoDoencaBase, string>> = {
  DIABETES: "diabetes",
  PULMAO: "doença do pulmão",
  CORACAO: "doença do coração",
  RINS: "doença dos rins",
  IMUNIDADE: "baixa imunidade",
};

/** Respostas tiradas do cadastro/ficha e a lista do que foi usado (para o aviso). */
export interface DadosDaFicha {
  respostas: Respostas;
  /** O que foi usado, para o aviso de transparência (ex.: "idade", "sexo", "diabetes"). */
  usados: string[];
}

const NADA: DadosDaFicha = { respostas: {}, usados: [] };

/**
 * Respostas tiradas do cadastro e da ficha, só quando a orientação é para a própria pessoa (PF1 = PARA_MIM).
 * Regra: doenças só geram respostas positivas; se a ficha não tem a doença, a pergunta continua sendo feita.
 * Regra: a gestação (PF3) nunca vem da ficha.
 */
export function respostasDaFicha(
  queixa: CodigoQueixa,
  respostas: Respostas,
  cidadao: Cidadao | null,
  ficha: FichaSaude | null,
  hoje: Date,
): DadosDaFicha {
  if (!cidadao || respostas["PF1"] !== "PARA_MIM") return NADA;
  const r: Respostas = {};
  const usados: string[] = [];
  const idade = idadeEm(cidadao.dtNascimento, hoje);
  if (idade !== null) {
    r["PF2"] = idade;
    usados.push("idade");
  }
  r["SX"] = cidadao.dsSexo;
  usados.push("sexo");

  const daQueixa = new Map(perguntasDaQueixa(queixa).map((p) => [p.codigo, p]));
  for (const [codigo, doencas] of Object.entries(DOENCAS_POR_PERGUNTA)) {
    const pergunta = daQueixa.get(codigo);
    const presentes = pergunta ? doencas.filter((d) => ficha?.dsDoencasBase.includes(d)) : [];
    if (presentes.length === 0) continue;
    // Perguntas de marcar (P9, U7) recebem as doenças da ficha, que usam os mesmos valores das opções.
    r[codigo] = pergunta?.tipoResposta === "MULTIPLA" ? presentes : "SIM";
    for (const d of presentes) {
      const nome = NOME_DOENCA[d];
      if (nome && !usados.includes(nome)) usados.push(nome);
    }
  }
  return { respostas: r, usados };
}

/** Partes do estado usadas na orientação. */
export interface FontesOrientacao {
  orientacaoAtual: OrientacaoEmAndamento | null;
  cidadaos: Cidadao[];
  idCidadaoAtual: number | null;
  fichas: FichaSaude[];
}

/**
 * Respostas efetivas da orientação atual: as digitadas valem mais que as do cadastro/ficha.
 * @returns null quando não há orientação em andamento
 */
export function respostasEfetivas(fontes: FontesOrientacao, hoje: Date): DadosDaFicha | null {
  const atual = fontes.orientacaoAtual;
  if (!atual) return null;
  const cidadao = fontes.cidadaos.find((c) => c.idCidadao === fontes.idCidadaoAtual) ?? null;
  const ficha = cidadao ? fontes.fichas.find((f) => f.idCidadao === cidadao.idCidadao) ?? null : null;
  const daFicha = respostasDaFicha(atual.codigoQueixa, atual.respostas, cidadao, ficha, hoje);
  return { respostas: { ...daFicha.respostas, ...atual.respostas }, usados: daFicha.usados };
}

/** A orientação usou dado da ficha de saúde (além de idade e sexo do cadastro)? */
export function usouFicha(usados: string[]): boolean {
  return usados.some((u) => u !== "idade" && u !== "sexo");
}

/** Aviso de transparência: "Usamos dados do seu cadastro e da sua ficha de saúde: idade, sexo e diabetes." */
export function textoAvisoFicha(usados: string[]): string {
  const comFicha = usouFicha(usados);
  const lista = usados.length > 1 ? `${usados.slice(0, -1).join(", ")} e ${usados[usados.length - 1]}` : (usados[0] ?? "");
  return `Usamos dados do seu cadastro${comFicha ? " e da sua ficha de saúde" : ""}: ${lista}.`;
}
