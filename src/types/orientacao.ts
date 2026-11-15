/**
 * Tipos da orientação (vieram do protótipo do grupo).
 * A orientação usa cores inspiradas no Protocolo de Manchester: cada cor leva a um destino
 * (vermelho → SAMU, laranja → pronto-socorro, amarelo → UPA, verde/azul → UBS).
 */
export type CodigoQueixa = "GRIPAL" | "GARGANTA" | "DIARREIA" | "CABECA" | "URINA";
export type Cor = "VERMELHO" | "LARANJA" | "AMARELO" | "VERDE" | "AZUL";
export type Destino = "SAMU" | "PRONTO_SOCORRO" | "UPA" | "UBS";

export type BlocoPergunta = "PERFIL" | "ENTRADA" | "ALARME" | "LARANJA" | "URGENCIA" | "CLASSIFICACAO";
export type TipoResposta = "SIM_NAO" | "SIM_NAO_NAOSEI" | "NUMERO" | "ESCALA_DOR" | "MULTIPLA" | "OPCOES";

/** Valor de uma resposta: "SIM" | "NAO" | "NAO_SEI" | valor de opção, número ou lista (múltipla). */
export type Resposta = string | number | string[];
export type Respostas = Record<string, Resposta>;

export type CondicaoExibicao =
  | { tipo: "IDADE_MIN"; valor: number }
  | { tipo: "IDADE_MAX"; valor: number }
  | { tipo: "DOR_MIN"; valor: number }
  | { tipo: "RESPOSTA_EM"; codigo: string; valores: string[] }
  | { tipo: "RESPOSTA_DIFERENTE"; codigo: string; valor: string }
  | { tipo: "TODAS"; condicoes: CondicaoExibicao[] };

export interface Opcao {
  valor: string;
  rotulo: string;
  /** Texto na lista de sinais (perguntas de marcar); sem ele, usa o rótulo. */
  sinal?: string;
}

export interface Pergunta {
  idPergunta: number;
  idQueixa: number | null;
  codigo: string;
  dsPergunta: string;
  nrOrdem: number;
  bloco: BlocoPergunta;
  tipoResposta: TipoResposta;
  opcoes?: Opcao[];
  dsCorSeSim: Cor | null;
  dsRespostaAlarme?: "SIM" | "NAO";
  condicaoExibicao?: CondicaoExibicao;
  /** Texto curto usado na lista de sinais marcados. */
  dsSinal?: string;
}

export interface Queixa {
  idQueixa: number;
  codigo: CodigoQueixa;
  nmQueixa: string;
}

export interface ResultadoOrientacao {
  dsCor: Cor;
  dsDestino: Destino;
  sinaisMarcados: string[];
}

export interface Orientacao {
  idOrientacao: number;
  idQueixa: number;
  dsCor: Cor;
  dsDestino: Destino;
  nrDor: number | null;
  flElevadaModelo: boolean;
  dtOrientacao: string;
  /** Cidadão vinculado (orientação feita sem login fica null até o balcão vincular). */
  idCidadao?: number | null;
}

/** Resultado mostrado na tela: cor das regras + verificação de IA + código da orientação salva. */
export interface ResultadoFinal extends ResultadoOrientacao {
  idOrientacao: number;
  nrDor: number | null;
  /** true quando a verificação de urgência (Modelo 2) elevou verde/azul para amarelo. */
  flElevadaModelo: boolean;
  /** true quando a verificação de urgência falhou e o resultado ficou só com as regras (aviso discreto). */
  flVerificacaoIndisponivel: boolean;
}

export interface EnderecoCep {
  dsLogradouro: string;
  dsBairro: string;
  nmCidade: string;
  sgUf: string;
}

export interface OrientacaoEmAndamento {
  /** Código da queixa escolhida (ex.: "GRIPAL"), não o id numérico. */
  codigoQueixa: CodigoQueixa;
  nrCep: string;
  /** Dados do ViaCEP; ausentes se a consulta falhou (o CEP sozinho basta). */
  endereco?: EnderecoCep | null;
  nrEndereco?: string;
  dsComplemento?: string;
  respostas: Respostas;
  ordem: string[];
  resultado: ResultadoFinal | null;
}

export type LocalOrientacao = Pick<OrientacaoEmAndamento, "endereco" | "nrEndereco" | "dsComplemento">;

/**
 * Entrada do Modelo 2 (verificação de urgência), enviada em POST /verificar-urgencia.
 * Só entram dados que o cidadão consegue informar. Trauma só é perguntado na dor de cabeça
 * (nas outras queixas vai false); a dor (0–10) é perguntada em todas.
 */
export interface VerificacaoUrgenciaEntrada {
  idade: number;
  sexo: "F" | "M" | null;
  trauma: boolean;
  nrDor: number;
  estadoMentalAlerta: boolean;
}
