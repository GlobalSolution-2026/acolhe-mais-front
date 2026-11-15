/**
 * ViaCEP (API externa, gratuita): completa o endereço a partir do CEP.
 * GET https://viacep.com.br/ws/{cep}/json/ — chamada sempre real (não tem modo demonstração).
 * Se falhar, o CEP sozinho basta: as telas seguem sem o endereço completo.
 */
import type { EnderecoCep, LocalOrientacao } from "../types/orientacao";
import { requisitar } from "./http";

export const VIACEP_URL = "https://viacep.com.br/ws";

/** Formato da resposta do ViaCEP (só os campos usados). */
interface RespostaViaCep {
  logradouro?: string;
  bairro?: string;
  localidade?: string;
  uf?: string;
  erro?: boolean | string;
}

/**
 * GET viacep.com.br/ws/{cep}/json/ — API externa
 * Busca o endereço do CEP. Usada no Início do celular e no cadastro.
 * @returns o endereço, ou null se o CEP não existir ou não tiver 8 números
 * @throws em falha de rede ou HTTP (a tela segue só com o CEP)
 */
export async function buscarEndereco(cep: string, signal?: AbortSignal): Promise<EnderecoCep | null> {
  const digitos = cep.replace(/\D/g, "");
  if (digitos.length !== 8) return null;
  const resposta = await requisitar(`${VIACEP_URL}/${digitos}/json/`, "VIACEP", { signal });
  const dados = (await resposta.json()) as RespostaViaCep;
  if (dados.erro) return null; // o ViaCEP responde erro: true (ou "true") quando o CEP não existe
  return { dsLogradouro: dados.logradouro ?? "", dsBairro: dados.bairro ?? "", nmCidade: dados.localidade ?? "", sgUf: dados.uf ?? "" };
}

/** "Rua X, 123, apto 4 – Bairro, Cidade/UF · CEP 00000-000" (partes vazias são omitidas). */
export function formatarEndereco(
  e: EnderecoCep,
  extra: { nrEndereco?: string | undefined; dsComplemento?: string | undefined; nrCep?: string | undefined } = {},
): string {
  const rua = [e.dsLogradouro, extra.nrEndereco, extra.dsComplemento].filter(Boolean).join(", ");
  const cidadeUf = [e.nmCidade, e.sgUf].filter(Boolean).join("/");
  const local = [e.dsBairro, cidadeUf].filter(Boolean).join(", ");
  const texto = [rua, local].filter(Boolean).join(" – ");
  if (!extra.nrCep) return texto;
  return texto ? `${texto} · CEP ${extra.nrCep}` : `CEP ${extra.nrCep}`;
}

/** Endereço para a ligação ao SAMU: completo com ViaCEP; sem ele, CEP com número/complemento digitados. */
export function enderecoParaLigacao(nrCep: string, local: LocalOrientacao): string {
  const { endereco, nrEndereco, dsComplemento } = local;
  if (endereco) return formatarEndereco(endereco, { nrEndereco, dsComplemento, nrCep });
  return [`CEP ${nrCep}`, nrEndereco ? `nº ${nrEndereco}` : "", dsComplemento].filter(Boolean).join(", ");
}
