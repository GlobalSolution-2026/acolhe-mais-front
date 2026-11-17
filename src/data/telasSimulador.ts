/**
 * Nome de cada tela do simulador, a partir da chave usada em data/endpointsApi.ts.
 * Cidadão e Recepção usam o título já escrito nas explicações; IA e Status têm nome fixo aqui.
 * Usado na tabela da aba Status das APIs ("Telas: ...").
 */
import { EXPLICACOES_TELAS } from "./explicacoesCidadao";
import { EXPLICACOES_RECEPCAO } from "./explicacoesRecepcao";

/** Telas que não têm arquivo de explicações (o texto fica na própria página). */
const OUTRAS_TELAS: Record<string, string> = {
  "ia-risco-falta": "IA – Risco de falta",
  "ia-urgencia": "IA – Verificação de urgência",
  status: "Status das APIs",
};

/**
 * Nome da tela para mostrar ao usuário (ex.: "cidadao/agendar" → "Cidadão · Agendar").
 * @param tela chave da tela (ex.: "recepcao/balcao")
 * @returns o título da tela, ou a própria chave se ela não for encontrada
 */
export function nomeDaTela(tela: string): string {
  if (tela.startsWith("cidadao/")) return EXPLICACOES_TELAS[tela.slice("cidadao/".length)]?.titulo ?? tela;
  if (tela.startsWith("recepcao/")) return EXPLICACOES_RECEPCAO[tela.slice("recepcao/".length)]?.titulo ?? tela;
  return OUTRAS_TELAS[tela] ?? tela;
}
