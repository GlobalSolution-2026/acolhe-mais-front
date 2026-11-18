/**
 * Contexto do simulador (Context API). Fica separado do Provider porque o React Refresh
 * só aceita componentes nos arquivos .tsx; o hook useSimulador() está em useSimulador.ts.
 */
import { createContext } from "react";
import type { Consulta, EntradaListaDoDia, Horario } from "../types";
import type { ResumoSimulacao } from "../services/simulacao";
import type { CodigoQueixa, LocalOrientacao, Resposta, ResultadoFinal } from "../types/orientacao";
import type { EstadoSimulador } from "./estadoSimulador";

/** O que o SimuladorProvider entrega para as telas. */
export interface SimuladorValor {
  /** Estado atual do mock (modo demonstração). */
  estado: EstadoSimulador;
  /** Leitura do estado mais recente fora do render (usada pelos serviços). */
  obterEstado: () => EstadoSimulador;
  /** Altera o estado a partir do atual (as regras puras recebem o estado e devolvem um novo). */
  atualizarEstado: (fn: (atual: EstadoSimulador) => EstadoSimulador) => void;
  /** Volta tudo aos dados de exemplo (botão "Reiniciar demonstração"). */
  reiniciarDemonstracao: () => void;
  /** Sobe quando os feriados da BrasilAPI chegam (só para as telas recalcularem os dias úteis). */
  versaoFeriados: number;
  /** Começa uma orientação nova com a queixa escolhida, o CEP e o endereço (tela Início). */
  iniciarOrientacao: (codigoQueixa: CodigoQueixa, nrCep: string, local?: LocalOrientacao) => void;
  /** Grava a resposta de uma pergunta da orientação. */
  responder: (codigo: string, valor: Resposta) => void;
  /** Desfaz a última resposta ("Pergunta anterior"). */
  voltarPergunta: () => void;
  /** Troca a queixa mantendo as respostas do perfil (ex.: garganta com tosse → síndrome gripal). */
  trocarQueixa: (codigoQueixa: CodigoQueixa) => void;
  /** Guarda o resultado final (cor, destino e código da orientação). */
  definirResultado: (resultado: ResultadoFinal) => void;
  /** Guarda o CEP informado depois do Início (no Resultado ou nas UBS próximas), quando a pessoa pulou o CEP. */
  informarCepOrientacao: (nrCep: string) => void;
  /**
   * Guarda quem entrou no celular (login ou conta nova) e vincula a entrada da lista do dia feita sem login.
   * nmCidadao vem do cadastro devolvido pela API (com a API ligada, o mock pode não ter esta pessoa).
   */
  definirCidadaoAtual: (idCidadao: number, nmCidadao?: string) => void;
  /** Sai da conta no celular. */
  sair: () => void;
  /** Coloca o cidadão do celular na lista do dia da UBS (demonstração); nmCidadao vem do cadastro da API. */
  entrarNaListaDoDia: (idUnidade: number, dsCor: EntradaListaDoDia["dsCor"], idOrientacao: number, nmCidadao?: string) => void;
  /** Resposta do cidadão a uma oferta de vaga (demonstração). Recusada/vencida: a vaga vai para o próximo. */
  responderOferta: (idOferta: number, resposta: "ACEITA" | "RECUSADA" | "EXPIRADA") => void;
  /** Troca a UBS mostrada no painel da recepção. */
  selecionarUnidadeRecepcao: (idUnidade: number) => void;
  /**
   * A recepção oferece um horário livre de hoje ao primeiro da lista do dia (demonstração).
   * Horário e consultas vêm da tela (API ou mock), não do estado do mock.
   */
  oferecerVaga: (horario: Horario, consultas: Consulta[]) => void;
  /** DEMONSTRAÇÃO: faz o prazo de confirmação passar e libera as consultas não confirmadas. */
  simularPassagemPrazo: () => ResumoSimulacao;
  /** DEMONSTRAÇÃO: vence agora todas as ofertas de vaga pendentes. */
  vencerPrazoOfertas: () => void;
  /** DEMONSTRAÇÃO: encerra o dia; quem não foi encaixado ganha prioridade no próximo. */
  encerrarDia: () => void;
}

export const SimuladorContext = createContext<SimuladorValor | null>(null);
