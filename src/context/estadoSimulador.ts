/**
 * Estado do modo demonstração do simulador (o "banco de dados" de mentira do front).
 * Enquanto a API Java não estiver no ar, os serviços leem e alteram este estado,
 * que fica salvo no localStorage para sobreviver a um F5.
 */
import type { Cidadao, Consulta, CredencialCidadao, EntradaListaDoDia, FichaSaude, Horario, OfertaVaga, Unidade } from "../types";
import type { Orientacao, OrientacaoEmAndamento } from "../types/orientacao";
import { unidadesIniciais } from "../data/unidades";
import { gerarHorariosIniciais } from "../data/horarios";
import { gerarSemente } from "../data/consultasIniciais";
import { credenciaisIniciais, fichasIniciais } from "../data/contaDemo";
import { chaveDia } from "../lib/datas";
import { agora } from "../lib/relogio";

export interface EstadoSimulador {
  /** Dia (aaaa-mm-dd) em que a semente foi gerada: no dia seguinte, gera de novo. */
  dtSemente: string;
  versaoSemente: number;
  unidades: Unidade[];
  horarios: Horario[];
  cidadaos: Cidadao[];
  consultas: Consulta[];
  /** UBS escolhida na aba Recepção. */
  idUnidadeRecepcao: number;
  orientacoes: Orientacao[];
  /** Questionário em andamento no celular do cidadão. */
  orientacaoAtual: OrientacaoEmAndamento | null;
  listaDoDia: EntradaListaDoDia[];
  ofertas: OfertaVaga[];
  /** Cidadão logado no celular (null = sem login). */
  idCidadaoAtual: number | null;
  /** Senhas do modo demonstração (login por CNS + senha). */
  credenciais: CredencialCidadao[];
  /** Fichas de saúde (prévia, sempre demonstração). */
  fichas: FichaSaude[];
}

const CHAVE_STORAGE = "acolhe-plus:simulador";

/** Sobe quando o formato do estado muda: o estado salvo antigo é descartado. */
const VERSAO_SEMENTE = 3; // 2: nomes da API Java (id*), CEP e telefone só com números · 3: cidadãos 1 a 8 iguais à carga do banco

/**
 * Monta o estado inicial da demonstração a partir dos dados de exemplo (pasta data/).
 * Usa o relógio do app (lib/relogio), que em dia não útil simula o próximo dia útil.
 */
export function estadoInicial(): EstadoSimulador {
  const hoje = agora();
  const semente = gerarSemente(gerarHorariosIniciais(hoje), hoje);
  return {
    dtSemente: chaveDia(hoje.toISOString()),
    versaoSemente: VERSAO_SEMENTE,
    unidades: unidadesIniciais,
    horarios: semente.horarios,
    cidadaos: semente.cidadaos,
    consultas: semente.consultas,
    idUnidadeRecepcao: 1,
    orientacoes: semente.orientacoes,
    orientacaoAtual: null,
    listaDoDia: semente.listaDoDia,
    ofertas: [],
    idCidadaoAtual: null,
    credenciais: credenciaisIniciais,
    fichas: fichasIniciais(hoje),
  };
}

/**
 * Lê o estado salvo no localStorage.
 * Devolve null se não houver, se for de outra versão ou de outro dia (aí a demonstração recomeça).
 */
export function lerEstadoSalvo(): EstadoSimulador | null {
  try {
    const bruto = localStorage.getItem(CHAVE_STORAGE);
    if (!bruto) return null;
    const salvo = JSON.parse(bruto) as Partial<EstadoSimulador>;
    if (salvo.versaoSemente !== VERSAO_SEMENTE || salvo.dtSemente !== chaveDia(agora().toISOString())) return null;
    return { ...estadoInicial(), ...salvo };
  } catch {
    // localStorage bloqueado ou JSON corrompido: começa do zero.
    return null;
  }
}

/** Salva o estado no localStorage (se o navegador bloquear, a demonstração segue só na memória). */
export function salvarEstado(estado: EstadoSimulador): void {
  try {
    localStorage.setItem(CHAVE_STORAGE, JSON.stringify(estado));
  } catch {
    /* armazenamento indisponível */
  }
}
