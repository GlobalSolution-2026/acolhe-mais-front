/**
 * Tipos do Acolhe+ (vieram do protótipo do grupo, com os nomes da API Java).
 * Os nomes seguem os DTOs da API Java (repositório Acolhe-Mais-Java): id = identificador,
 * nm = nome, ds = descrição, dt = data, nr = número, fl = flag (verdadeiro/falso), vl = valor, tp = tipo.
 * Campos marcados com "TODO: aguardando a API Java" ainda não vêm da API (pedidos ao colega);
 * no modo demonstração o mock preenche todos.
 */
import type { Cor } from "./orientacao";

export type TipoUnidade = "UBS" | "UPA";

/** Unidade de saúde (UBS para agendar, UPA para urgência). UnidadeSaidaDTO da API. */
export interface Unidade {
  idUnidade: number;
  nmUnidade: string;
  tpUnidade: TipoUnidade;
  dsEndereco: string;
  /** Só números (VARCHAR2(8) no banco); a tela formata com formatarCep. */
  nrCep: string;
  /** Só números, com DDD; a tela formata com formatarTelefone. */
  nrTelefone: string;
}

/** Horário de atendimento de uma unidade (1:N com Unidade). HorarioSaidaDTO da API. */
export interface Horario {
  idHorario: number;
  idUnidade: number;
  dtHorario: string; // ISO (a API manda sem fuso, no horário local)
  nrDuracaoMinuto: number;
  // TODO: aguardando a API Java (flOcupado no HorarioSaidaDTO)
  flOcupado?: boolean;
}

/**
 * Forma de acesso do cidadão: conta com senha no app, cadastro feito no balcão (sem senha)
 * ou conta gov.br. GOVBR já existe no banco (carga de teste), mas o login pelo gov.br está previsto
 * e ainda não existe: sem senha, POST /cidadaos/login devolve 401 para essas pessoas.
 */
export type TipoAcesso = "SENHA" | "BALCAO" | "GOVBR";

/** Cadastro do cidadão. CidadaoSaidaDTO da API. CNS = Cartão Nacional de Saúde (Cartão SUS, 15 números). */
export interface Cidadao {
  idCidadao: number;
  nmCidadao: string;
  nrCns: string;
  /** CPF é opcional no cadastro. */
  nrCpf?: string | null;
  dtNascimento: string; // aaaa-mm-dd
  dsSexo: "F" | "M";
  /** Celular, telefone de recado e CEP: só números. */
  nrCelular: string;
  nmContatoRecado: string;
  nrContatoRecado: string;
  nrCep: string;
  tpAcesso: TipoAcesso;
}

/** Corpo do POST /cidadaos (CidadaoEntradaDTO): senha só quando tpAcesso for SENHA. */
export type CidadaoEntrada = Omit<Cidadao, "idCidadao"> & { senha?: string };

/**
 * Corpo do PUT /cidadaos/{id}: só o que o app deixa editar.
 * Regra RF27: Cartão SUS, nome, nascimento e sexo não mudam pelo app (isso é com a recepção).
 */
export type CidadaoAtualizacao = Pick<Cidadao, "nrCelular" | "nmContatoRecado" | "nrContatoRecado" | "nrCep">;

/** Corpo do POST /cidadaos/login. */
export interface LoginEntrada {
  nrCns: string;
  senha: string;
}

export type StatusConsulta = "AGENDADA" | "CONFIRMADA" | "LIBERADA" | "REALIZADA" | "FALTA";
export type CanalConfirmacao = "APP" | "TELEFONE" | "PRESENCIAL";
export type RiscoFalta = "BAIXO" | "ALTO";

/** Consulta agendada numa UBS, com o risco de falta calculado pelo Modelo 1. ConsultaSaidaDTO da API. */
export interface Consulta {
  idConsulta: number;
  nmUnidade: string;
  dtHorario: string;
  nmCidadao: string;
  dsStatus: StatusConsulta;
  // TODO: aguardando a API Java (campos pedidos no ConsultaSaidaDTO)
  idHorario?: number;
  idCidadao?: number;
  idOrientacao?: number | null;
  dtAgendamento?: string;
  dtConfirmacao?: string | null;
  dsCanalConfirmacao?: CanalConfirmacao | null;
  vlProbFalta?: number | null;
  dsRiscoFalta?: RiscoFalta | null;
}

/** Corpo do POST /consultas (ConsultaEntradaDTO). */
export interface ConsultaEntrada {
  idHorario: number;
  idCidadao: number;
  // TODO: aguardando a API Java (campos opcionais pedidos no ConsultaEntradaDTO)
  idOrientacao?: number | null;
  vlProbFalta?: number;
  dsRiscoFalta?: RiscoFalta;
}

/** Corpo do PUT /consultas/{id}/status: confirmar, cancelar (LIBERADA), presença (REALIZADA) ou falta (FALTA). */
export interface StatusConsultaEntrada {
  dsStatus: StatusConsulta;
  /** Só quando o status for CONFIRMADA. */
  dsCanalConfirmacao?: CanalConfirmacao;
}

/** Pessoa aguardando encaixe na lista do dia de uma UBS (só no front por enquanto). */
export interface EntradaListaDoDia {
  idEntrada: number;
  idCidadao: number | null;
  /** Orientação que levou à lista (ACM_LISTA_DIA.id_orientacao, NOT NULL). */
  idOrientacao: number;
  idUnidade: number;
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

/** Oferta de vaga liberada feita ao primeiro da lista do dia (só no front). */
export interface OfertaVaga {
  idOferta: number;
  idHorario: number;
  idUnidade: number;
  idEntrada: number;
  nmCidadao: string;
  dtCriacao: string; // ISO
  status: StatusOferta;
}

/** Formato de erro devolvido pela API Java (ErroDTO). A mensagem vem no campo "mensagem". */
export interface ErroDTO {
  status: number;
  mensagem: string;
}

export type CodigoDoencaBase = "DIABETES" | "HIPERTENSAO" | "PULMAO" | "CORACAO" | "RINS" | "IMUNIDADE" | "OUTRA";
export type TipoSanguineo = "A+" | "A-" | "B+" | "B-" | "AB+" | "AB-" | "O+" | "O-" | "NAO_SEI" | "";

export interface MedicamentoContinuo {
  nmMedicamento: string;
  dsDose: string;
}

/** Ficha de saúde opcional do cidadão (dado sensível — LGPD, art. 11). Prévia: sempre demonstração. */
export interface FichaSaude {
  idCidadao: number;
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
  idCidadao: number;
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
export interface PrevisaoFalta {
  vlProbFalta: number;
  dsRiscoFalta: RiscoFalta;
}

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
