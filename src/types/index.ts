/**
 * Tipos do Acolhe+ (vieram do protótipo do grupo).
 * Os nomes seguem os DTOs da API Java: cd = código (id), nm = nome, ds = descrição,
 * dt = data, nr = número, fl = flag (verdadeiro/falso), vl = valor, tp = tipo.
 */
import type { Cor } from "./orientacao";

export type TipoUnidade = "UBS" | "UPA";

/** Unidade de saúde (UBS para agendar, UPA para urgência). */
export interface Unidade {
  cdUnidade: number;
  nmUnidade: string;
  tpUnidade: TipoUnidade;
  dsEndereco: string;
  nrCep: string;
  nrTelefone: string;
}

/** Horário de atendimento de uma unidade (1:N com Unidade). */
export interface Horario {
  cdHorario: number;
  cdUnidade: number;
  dtHorario: string; // ISO
  nrDuracaoMin: number;
  flOcupado: boolean;
}

/** Cadastro do cidadão. CNS = Cartão Nacional de Saúde (Cartão SUS, 15 números). */
export interface Cidadao {
  cdCidadao: number;
  nmCidadao: string;
  nrCns: string;
  dtNascimento: string;
  dsSexo: "F" | "M";
  nrCelular: string;
  nmContatoRecado: string;
  nrContatoRecado: string;
  nrCep: string;
}

/** Dados enviados para criar ou atualizar um cidadão (o código é gerado pela API). */
export type CidadaoEntrada = Omit<Cidadao, "cdCidadao">;

export type StatusConsulta = "AGENDADA" | "CONFIRMADA" | "LIBERADA" | "REALIZADA" | "FALTA";
export type CanalConfirmacao = "APP" | "TELEFONE" | "PRESENCIAL";
export type RiscoFalta = "BAIXO" | "ALTO";

/** Consulta agendada numa UBS, com o risco de falta calculado pelo Modelo 1. */
export interface Consulta {
  cdConsulta: number;
  cdHorario: number;
  cdCidadao: number;
  cdOrientacao: number | null;
  dtAgendamento: string;
  dtConfirmacao: string | null;
  dsCanalConfirmacao: CanalConfirmacao | null;
  dsStatus: StatusConsulta;
  vlProbFalta: number;
  dsRiscoFalta: RiscoFalta;
  nmUnidade: string;
  dtHorario: string;
}

/** Pessoa aguardando encaixe na lista do dia de uma UBS. */
export interface EntradaListaDoDia {
  cdEntrada: number;
  cdCidadao: number | null;
  /** Orientação que levou à lista (ACM_LISTA_DIA.id_orientacao, NOT NULL). */
  cdOrientacao: number;
  cdUnidade: number;
  nmCidadao: string;
  dsCor: Extract<Cor, "VERDE" | "AZUL">;
  dtEntrada: string; // ISO
  /** Quem não foi encaixado no dia anterior tem prioridade. */
  flPrioridade: boolean;
  /** true quando a entrada é do próprio cidadão que usa o app. */
  flCidadao: boolean;
  status: "AGUARDANDO" | "ENCERRADA";
}

export type StatusOferta = "PENDENTE" | "ACEITA" | "RECUSADA" | "EXPIRADA";

/** Oferta de vaga liberada feita ao primeiro da lista do dia. */
export interface OfertaVaga {
  cdOferta: number;
  cdHorario: number;
  cdUnidade: number;
  cdEntrada: number;
  nmCidadao: string;
  dtCriacao: string; // ISO
  status: StatusOferta;
}

/** Formato de erro devolvido pela API Java (e pela Flask). */
export interface ErroResponse {
  status: number;
  erro: string;
}

export type CodigoDoencaBase = "DIABETES" | "HIPERTENSAO" | "PULMAO" | "CORACAO" | "RINS" | "IMUNIDADE" | "OUTRA";
export type TipoSanguineo = "A+" | "A-" | "B+" | "B-" | "AB+" | "AB-" | "O+" | "O-" | "NAO_SEI" | "";

export interface MedicamentoContinuo {
  nmMedicamento: string;
  dsDose: string;
}

/** Ficha de saúde opcional do cidadão (dado sensível — LGPD, art. 11). Prévia: sempre demonstração. */
export interface FichaSaude {
  cdCidadao: number;
  dsDoencasBase: CodigoDoencaBase[];
  dsOutraDoenca: string;
  medicamentos: MedicamentoContinuo[];
  dsAlergias: string;
  dsTipoSanguineo: TipoSanguineo;
  flConsentimento: boolean;
  dtAtualizacao: string; // ISO
}

/** Credencial do modo demonstração (a autenticação real será feita pela API Java). */
export interface CredencialCidadao {
  cdCidadao: number;
  dsSenha: string;
}

/* ---------- API Flask de IA ---------- */

/**
 * Entrada do Modelo 1 (risco de falta), enviada em POST /prever-falta.
 * Limitações desta versão:
 * - smsRecebido vai sempre false: o lembrete ainda não foi enviado no momento do agendamento.
 * - o bairro não é enviado: a API Flask usa "OUTROS".
 */
export interface PrevisaoFaltaEntrada {
  idade: number;
  sexo: "F" | "M";
  antecedenciaDias: number;
  /** 0 = domingo ... 6 = sábado (Date.getDay). */
  diaSemana: number;
  smsRecebido: boolean;
  /** Consultas do cidadão com status FALTA antes deste agendamento. */
  faltasAnteriores: number;
}

/** Resultado do Modelo 1 já convertido para os nomes usados na Consulta. */
export type PrevisaoFalta = Pick<Consulta, "vlProbFalta" | "dsRiscoFalta">;

/** Resultado do Modelo 2 (verificação de urgência). */
export interface VerificacaoUrgenciaSaida {
  urgente: boolean;
  probabilidade: number;
}

/* ---------- Painel de requisições (aba Status das APIs) ---------- */

export type NomeApi = "JAVA" | "FLASK" | "VIACEP" | "FRONT";
export type MetodoHttp = "GET" | "POST" | "PUT" | "DELETE";

/** Uma chamada feita pelo front, real ou em modo demonstração. */
export interface Requisicao {
  id: number;
  metodo: MetodoHttp;
  rota: string;
  api: NomeApi;
  /** Código HTTP da resposta; null quando nem chegou resposta (rede fora do ar). */
  status: number | null;
  tempoMs: number;
  /** true = respondida pelo mock do front (modo demonstração). */
  demonstracao: boolean;
  dtRequisicao: string; // ISO
}
