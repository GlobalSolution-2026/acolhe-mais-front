/**
 * Endpoints que o front usa, agrupados por controller, com a tela do simulador onde aparecem.
 * Mostrados na aba Status das APIs (seção 7 do CLAUDE.md). Todos já existem na API Java (branch main).
 */
import type { MetodoHttp, NomeApi } from "../types";

/** Um endpoint na tabela. */
export interface EndpointDocumentado {
  metodo: MetodoHttp;
  rota: string;
  /** Telas do simulador que chamam este endpoint. */
  onde: string;
}

/** Um grupo da tabela (controller da API Java ou a API Flask). */
export interface GrupoEndpoints {
  nome: string;
  api: NomeApi;
  endpoints: EndpointDocumentado[];
}

export const GRUPOS_ENDPOINTS: GrupoEndpoints[] = [
  {
    nome: "Unidade",
    api: "JAVA",
    endpoints: [
      { metodo: "GET", rota: "/unidades", onde: "Cidadão: UBS próximas e UPA indicada · Recepção: seleção da UBS e UPA no balcão" },
      { metodo: "GET", rota: "/unidades/{id}", onde: "Cidadão: topo dos horários e Agendar" },
    ],
  },
  {
    nome: "Horário",
    api: "JAVA",
    endpoints: [
      { metodo: "GET", rota: "/unidades/{id}/horarios", onde: "Cidadão: horários da UBS e Agendar · Recepção: agenda, pendentes, indicadores e balcão" },
    ],
  },
  {
    nome: "Cidadão",
    api: "JAVA",
    endpoints: [
      { metodo: "POST", rota: "/cidadaos", onde: "Cidadão: criar conta · Recepção: cadastro no balcão e na agenda" },
      { metodo: "GET", rota: "/cidadaos/{id}", onde: "Cidadão: perfil, editar perfil e Agendar" },
      { metodo: "GET", rota: "/cidadaos?cns={nrCns}", onde: "Recepção: buscar no balcão e na agenda" },
      { metodo: "PUT", rota: "/cidadaos/{id}", onde: "Cidadão: editar perfil e Agendar · Recepção: conferir cadastro no balcão" },
    ],
  },
  {
    nome: "Consulta",
    api: "JAVA",
    endpoints: [
      { metodo: "GET", rota: "/consultas", onde: "Cidadão: minhas consultas e avisos · Recepção: agenda, pendentes e indicadores" },
      { metodo: "POST", rota: "/consultas", onde: "Cidadão: Agendar · Recepção: agenda, balcão e lista do dia" },
      { metodo: "PUT", rota: "/consultas/{id}/status", onde: "Cidadão: confirmar e cancelar · Recepção: presença, falta e confirmações" },
    ],
  },
  {
    nome: "Auth",
    api: "JAVA",
    endpoints: [{ metodo: "POST", rota: "/cidadaos/login", onde: "Cidadão: Entrar" }],
  },
  {
    nome: "IA (Flask)",
    api: "FLASK",
    endpoints: [
      { metodo: "GET", rota: "/status", onde: "Status das APIs" },
      { metodo: "POST", rota: "/prever-falta", onde: "Cidadão e Recepção: ao agendar · IA – Risco de falta" },
      { metodo: "POST", rota: "/verificar-urgencia", onde: "Cidadão: resultado da orientação · Recepção: orientação no balcão · IA – Verificação de urgência" },
    ],
  },
  {
    nome: "ViaCEP",
    api: "VIACEP",
    endpoints: [{ metodo: "GET", rota: "/ws/{cep}/json/", onde: "Cidadão: Início (endereço pelo CEP)" }],
  },
];
