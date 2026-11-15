/**
 * Serviços da API Flask de IA (VITE_FLASK_URL).
 * - Modelo 1, risco de falta: POST /prever-falta
 * - Modelo 2, verificação de urgência: POST /verificar-urgencia
 * - Situação da API: GET /status
 * Sem VITE_FLASK_URL, cada função usa a mesma simulação do protótipo (modo demonstração).
 */
import { LIMIAR_RISCO_ALTO } from "../data/configuracoes";
import { idadeEm } from "../lib/datas";
import type { Cidadao, Consulta, Horario, PrevisaoFalta, PrevisaoFaltaEntrada, VerificacaoUrgenciaSaida } from "../types";
import type { VerificacaoUrgenciaEntrada } from "../types/orientacao";
import { requisitar, simular } from "./http";
import { classificarRiscoFalta } from "./regrasAgendamento";

/** URL da API Flask; vazia = modo demonstração. */
export const FLASK_URL: string | undefined = import.meta.env.VITE_FLASK_URL || undefined;

/**
 * Converte a resposta do Modelo 1 para os nomes da Consulta (vlProbFalta e dsRiscoFalta).
 * O risco é sempre recalculado pelo limiar do front (0,60), para valer a mesma regra em todo lugar.
 */
// TODO: conferir nomes com a API Flask. O planejamento usa { probabilidade, risco };
// o protótipo usava { vlProbFalta, dsRiscoFalta }. Aqui os dois formatos são aceitos.
export function converterPrevisao(json: unknown): PrevisaoFalta {
  const dados = (json ?? {}) as { probabilidade?: unknown; vlProbFalta?: unknown };
  const bruto = dados.probabilidade ?? dados.vlProbFalta;
  if (typeof bruto !== "number") throw new Error("A API de IA respondeu sem a probabilidade de falta.");
  const vlProbFalta = Math.round(bruto * 100) / 100;
  return { vlProbFalta, dsRiscoFalta: classificarRiscoFalta(vlProbFalta) };
}

/**
 * Converte a resposta do Modelo 2.
 * TODO: conferir nomes com a API Flask (planejado: { urgente, probabilidade }).
 */
export function converterUrgencia(json: unknown): VerificacaoUrgenciaSaida {
  const dados = (json ?? {}) as { urgente?: unknown; probabilidade?: unknown };
  if (typeof dados.urgente !== "boolean") throw new Error("A API de IA respondeu sem o campo urgente.");
  return { urgente: dados.urgente, probabilidade: typeof dados.probabilidade === "number" ? dados.probabilidade : 0 };
}

/**
 * GET /status — API Flask
 * Confere se a API de IA está no ar. Usada na aba Status das APIs.
 * Erros esperados: sem resposta (Render "dormindo" ou fora do ar).
 */
export async function verificarStatusFlask(): Promise<{ status: string }> {
  if (FLASK_URL) {
    const resposta = await requisitar(`${FLASK_URL}/status`, "FLASK");
    return resposta.json();
  }
  // Modo demonstração: responde como se a API estivesse no ar.
  return simular("GET", "/status", "FLASK", () => ({ status: "ok" }));
}

/**
 * POST /prever-falta — API Flask (Modelo 1)
 * Calcula a probabilidade de a pessoa faltar à consulta. Usada ao agendar e na aba IA – Risco de falta.
 * Erros esperados: 400 (faltou campo).
 */
export async function preverFalta(dados: PrevisaoFaltaEntrada): Promise<PrevisaoFalta> {
  if (FLASK_URL) {
    const resposta = await requisitar(`${FLASK_URL}/prever-falta`, "FLASK", { method: "POST", body: JSON.stringify(dados) });
    return converterPrevisao(await resposta.json());
  }
  // Modo demonstração (simulação do protótipo): antecedência de 7 dias ou mais → faixa alta (0,60–0,95);
  // menos que isso → faixa baixa (0,05–0,59). Os valores são em centésimos, sem erro de arredondamento.
  return simular("POST", "/prever-falta", "FLASK", () => {
    const vlProbFalta = dados.antecedenciaDias >= 7
      ? (60 + Math.round(Math.random() * 35)) / 100
      : (5 + Math.round(Math.random() * 54)) / 100;
    return { vlProbFalta, dsRiscoFalta: classificarRiscoFalta(vlProbFalta) };
  });
}

/**
 * POST /verificar-urgencia — API Flask (Modelo 2)
 * Confere se um caso que deu verde ou azul pode ser urgente. Usada no fim da orientação e na aba IA – Verificação de urgência.
 * Regra: o resultado só pode ELEVAR a cor (verde/azul → amarelo), nunca baixar. Quem aplica é a orientação.
 * Erros esperados: 400 (faltou campo).
 */
export async function verificarUrgencia(dados: VerificacaoUrgenciaEntrada): Promise<VerificacaoUrgenciaSaida> {
  if (FLASK_URL) {
    const resposta = await requisitar(`${FLASK_URL}/verificar-urgencia`, "FLASK", { method: "POST", body: JSON.stringify(dados) });
    return converterUrgencia(await resposta.json());
  }
  // Modo demonstração (regra do protótipo): urgente quando dor >= 7 e idade >= 65.
  // A probabilidade é só ilustrativa: sobe com a dor e fica acima de 0,5 quando é urgente.
  return simular("POST", "/verificar-urgencia", "FLASK", () => {
    const urgente = dados.nrDor >= 7 && dados.idade >= 65;
    const probabilidade = urgente ? Math.min(0.95, 0.6 + dados.nrDor * 0.03) : Math.min(0.45, 0.05 + dados.nrDor * 0.04);
    return { urgente, probabilidade: Math.round(probabilidade * 100) / 100 };
  });
}

/**
 * Monta a entrada do Modelo 1 a partir do horário escolhido, do cadastro e do histórico de consultas.
 * @param consultas consultas já existentes (para contar as faltas anteriores do cidadão)
 * @param agora momento do agendamento
 */
export function montarEntradaPrevisao(horario: Horario, cidadao: Cidadao, consultas: Consulta[], agora: Date): PrevisaoFaltaEntrada {
  const dtHorario = new Date(horario.dtHorario);
  return {
    idade: idadeEm(cidadao.dtNascimento, agora) ?? 0,
    sexo: cidadao.dsSexo,
    // Antecedência em dias corridos, arredondada para cima (agendar para amanhã = 1).
    antecedenciaDias: Math.max(0, Math.ceil((dtHorario.getTime() - agora.getTime()) / 86_400_000)),
    diaSemana: dtHorario.getDay(),
    // Limitação desta versão: o lembrete ainda não foi enviado no momento do agendamento.
    smsRecebido: false,
    faltasAnteriores: consultas.filter((c) =>
      c.idCidadao === cidadao.idCidadao && c.dsStatus === "FALTA" && new Date(c.dtHorario).getTime() < agora.getTime()).length,
  };
}

/**
 * Previsão de falta que nunca trava o agendamento.
 * Regra: se a API de IA falhar, a consulta é marcada como risco ALTO (no limiar de 0,60),
 * o lado mais cuidadoso: o pedido de confirmação sai 3 dias úteis antes, com lembrete.
 */
export async function preverFaltaSemTravar(dados: PrevisaoFaltaEntrada): Promise<PrevisaoFalta> {
  try {
    return await preverFalta(dados);
  } catch {
    return { vlProbFalta: LIMIAR_RISCO_ALTO, dsRiscoFalta: "ALTO" };
  }
}
