/**
 * Serviços da API Java do Acolhe+ (Spring Boot, VITE_API_URL).
 *
 * Cada função corresponde a um endpoint planejado e tem dois caminhos:
 * - com VITE_API_URL definida → fetch real (requisitar);
 * - sem a variável → modo demonstração: lê e altera o estado do mock (SimuladorContext)
 *   e espera 400 ms para imitar a rede (simular).
 * Ligar a API de verdade é só configurar a variável de ambiente.
 *
 * As funções marcadas com "DEMONSTRAÇÃO: não existe na API Java" ficam sempre no mock
 * (lista do dia, oferta de vaga, orientação salva, balcão e ficha de saúde).
 */
import type { CanalConfirmacao, Cidadao, CidadaoEntrada, Consulta, EntradaListaDoDia, FichaSaude, Horario, Unidade } from "../types";
import type { Orientacao } from "../types/orientacao";
import type { EstadoSimulador } from "../context/estadoSimulador";
import { agora } from "../lib/relogio";
import { podeVincular } from "./balcao";
import { ErroApi, falhar, requisitar, simular } from "./http";
import { montarEntradaPrevisao, preverFaltaSemTravar } from "./ia";
import { acoesPresenca, listaDoDiaAberta, MENSAGEM_LISTA_SO_DIA_UTIL, podeCancelar, segundosRestantesOferta } from "./regrasAgendamento";
import { liberarConsulta } from "./simulacao";

/** URL da API Java; vazia = modo demonstração. */
export const API_URL: string | undefined = import.meta.env.VITE_API_URL || undefined;

/* ---------- Ligação com o estado do mock (modo demonstração) ---------- */

/** Acesso ao estado do SimuladorContext, sem precisar de hook (os serviços não são componentes). */
interface Store {
  obterEstado: () => EstadoSimulador;
  atualizarEstado: (fn: (atual: EstadoSimulador) => EstadoSimulador) => void;
}

let store: Store | null = null;

/** Liga os serviços ao estado do SimuladorContext. Chamado pelo SimuladorProvider. */
export function conectarStore(novo: Store | null): void {
  store = novo;
}

/** Devolve o estado do mock; erro 500 se o simulador ainda não estiver montado. */
function obterStore(): Store {
  if (!store) falhar({ status: 500, erro: "O simulador ainda não foi carregado." });
  return store;
}

/** Próximo código livre de uma lista (imita o id gerado pelo banco). */
function proximoCodigo(codigos: number[]): number {
  return Math.max(0, ...codigos) + 1;
}

/* ---------- Unidade ---------- */

/**
 * GET /unidades — API Java
 * Lista as unidades. Usada no Cidadão (UBS próximas e UPA) e na Recepção (seleção da UBS).
 * O filtro por tipo (UBS/UPA) é feito no front.
 * Erros esperados: 500.
 */
export async function listarUnidades(tipo?: Unidade["tpUnidade"]): Promise<Unidade[]> {
  const filtrar = (unidades: Unidade[]) => (tipo ? unidades.filter((u) => u.tpUnidade === tipo) : unidades);
  if (API_URL) {
    const resposta = await requisitar(`${API_URL}/unidades`, "JAVA");
    return filtrar(await resposta.json());
  }
  // Modo demonstração: dados do mock guardados no Context
  return simular("GET", "/unidades", "JAVA", () => filtrar(obterStore().obterEstado().unidades));
}

/**
 * GET /unidades/{cdUnidade} — API Java
 * Busca uma unidade. Usada no topo da tela de horários do celular.
 * Erros esperados: 404 (unidade não existe).
 */
export async function buscarUnidade(cdUnidade: number): Promise<Unidade> {
  if (API_URL) {
    const resposta = await requisitar(`${API_URL}/unidades/${cdUnidade}`, "JAVA");
    return resposta.json();
  }
  return simular("GET", `/unidades/${cdUnidade}`, "JAVA", () => {
    const unidade = obterStore().obterEstado().unidades.find((u) => u.cdUnidade === cdUnidade);
    if (!unidade) falhar({ status: 404, erro: "Unidade não encontrada." });
    return unidade;
  });
}

/* ---------- Horário ---------- */

/**
 * GET /unidades/{cdUnidade}/horarios — API Java
 * Lista os horários de uma UBS. Usada na tela "Horários" do celular e na agenda da Recepção.
 * Erros esperados: 404 (unidade não existe).
 */
export async function listarHorarios(cdUnidade: number): Promise<Horario[]> {
  if (API_URL) {
    const resposta = await requisitar(`${API_URL}/unidades/${cdUnidade}/horarios`, "JAVA");
    return resposta.json();
  }
  return simular("GET", `/unidades/${cdUnidade}/horarios`, "JAVA", () => {
    const { unidades, horarios } = obterStore().obterEstado();
    if (!unidades.some((u) => u.cdUnidade === cdUnidade)) falhar({ status: 404, erro: "Unidade não encontrada." });
    return horarios.filter((h) => h.cdUnidade === cdUnidade);
  });
}

/* ---------- Cidadão ---------- */

/**
 * POST /cidadaos — API Java
 * Cadastra um cidadão sem senha. Usada no balcão da Recepção.
 * Erros esperados: 400 (dados inválidos), 409 (CNS já cadastrado).
 */
export async function cadastrarCidadao(dados: CidadaoEntrada): Promise<Cidadao> {
  if (API_URL) {
    const resposta = await requisitar(`${API_URL}/cidadaos`, "JAVA", { method: "POST", body: JSON.stringify(dados) });
    return resposta.json();
  }
  return simular("POST", "/cidadaos", "JAVA", () => cadastrarNoMock(dados), 201);
}

/** Grava um cidadão novo no mock (regra: o CNS é único). */
function cadastrarNoMock(dados: CidadaoEntrada): Cidadao {
  const s = obterStore();
  if (s.obterEstado().cidadaos.some((c) => c.nrCns === dados.nrCns)) falhar({ status: 409, erro: "Já existe cadastro com este Cartão SUS." });
  const novo: Cidadao = { ...dados, cdCidadao: proximoCodigo(s.obterEstado().cidadaos.map((c) => c.cdCidadao)) };
  s.atualizarEstado((e) => ({ ...e, cidadaos: [...e.cidadaos, novo] }));
  return novo;
}

/**
 * POST /cidadaos (com senha) — API Java
 * Cria a conta do cidadão no app. Usada na tela "Criar conta" do celular.
 * Regra RN21: quem foi cadastrado no balcão (sem senha) pode criar a conta com o mesmo Cartão SUS;
 * a conta completa esse cadastro e mantém as consultas já marcadas.
 * Erros esperados: 400 (senha curta ou dados inválidos), 409 (já existe conta com este CNS).
 */
// TODO: conferir com a API Java se a senha vai no próprio POST /cidadaos (campo dsSenha).
export async function criarConta(dados: CidadaoEntrada, dsSenha: string): Promise<Cidadao> {
  if (API_URL) {
    const resposta = await requisitar(`${API_URL}/cidadaos`, "JAVA", { method: "POST", body: JSON.stringify({ ...dados, dsSenha }) });
    return resposta.json();
  }
  return simular("POST", "/cidadaos", "JAVA", () => {
    if (dsSenha.length < 6) falhar({ status: 400, erro: "A senha precisa ter pelo menos 6 caracteres." });
    const s = obterStore();
    const { cidadaos, credenciais } = s.obterEstado();
    const existente = cidadaos.find((c) => c.nrCns === dados.nrCns);
    if (existente && credenciais.some((c) => c.cdCidadao === existente.cdCidadao)) {
      falhar({ status: 409, erro: "Já existe conta com este Cartão SUS. Use Entrar." });
    }
    // RN21: cadastro do balcão sem senha → completa o cadastro (mesmo código, consultas mantidas).
    const cidadao: Cidadao = existente ? { ...dados, cdCidadao: existente.cdCidadao } : cadastrarNoMock(dados);
    s.atualizarEstado((e) => ({
      ...e,
      cidadaos: e.cidadaos.map((c) => (c.cdCidadao === cidadao.cdCidadao ? cidadao : c)),
      credenciais: [...e.credenciais, { cdCidadao: cidadao.cdCidadao, dsSenha }],
    }));
    return cidadao;
  }, 201);
}

/**
 * GET /cidadaos?cns={nrCns} — API Java
 * Busca o cidadão pelo Cartão SUS. Usada no balcão da Recepção.
 * @returns o cadastro, ou null quando a API responde 404 (não cadastrado)
 */
export async function buscarCidadaoPorCns(nrCns: string): Promise<Cidadao | null> {
  const cns = nrCns.replace(/\D/g, "");
  try {
    if (API_URL) {
      const resposta = await requisitar(`${API_URL}/cidadaos?cns=${cns}`, "JAVA");
      return await resposta.json();
    }
    return await simular("GET", `/cidadaos?cns=${cns}`, "JAVA", () => {
      const cidadao = obterStore().obterEstado().cidadaos.find((c) => c.nrCns === cns);
      if (!cidadao) falhar({ status: 404, erro: "Cidadão não cadastrado." });
      return cidadao;
    });
  } catch (erro) {
    // 404 não é erro para a tela: significa "ainda não tem cadastro" (o balcão oferece cadastrar).
    if (erro instanceof ErroApi && erro.status === 404) return null;
    throw erro;
  }
}

export interface OpcoesAtualizarCidadao {
  /**
   * Regra RF27 (perfil e agendamento no app): o cidadão só altera celular e contato de recado.
   * CNS, nascimento, nome e sexo ficam como estão no cadastro, mesmo que cheguem valores diferentes.
   * Sem a opção (balcão da recepção), o cadastro é atualizado por inteiro.
   */
  manterIdentificacao?: boolean;
  /** Cadastro atual (obrigatório com a API real e manterIdentificacao, de onde vêm os 4 campos protegidos). */
  cadastroAtual?: Cidadao;
}

/** Regra RF27: copia do cadastro atual os quatro campos de identificação. */
function protegerIdentificacao(dados: CidadaoEntrada, atual: Cidadao): Cidadao {
  return { ...dados, cdCidadao: atual.cdCidadao, nrCns: atual.nrCns, dtNascimento: atual.dtNascimento, nmCidadao: atual.nmCidadao, dsSexo: atual.dsSexo };
}

/**
 * PUT /cidadaos/{cdCidadao} — API Java
 * Atualiza o cadastro. Usada em "Editar perfil" (cidadão, com manterIdentificacao) e no balcão (recepção).
 * Erros esperados: 400 (dados inválidos), 404 (cadastro não existe).
 */
export async function atualizarCidadao(cdCidadao: number, dados: CidadaoEntrada, opcoes: OpcoesAtualizarCidadao = {}): Promise<Cidadao> {
  if (API_URL) {
    if (opcoes.manterIdentificacao && !opcoes.cadastroAtual) falhar({ status: 400, erro: "Cadastro atual não informado." });
    const corpo = opcoes.manterIdentificacao && opcoes.cadastroAtual ? protegerIdentificacao(dados, opcoes.cadastroAtual) : { ...dados, cdCidadao };
    const resposta = await requisitar(`${API_URL}/cidadaos/${cdCidadao}`, "JAVA", { method: "PUT", body: JSON.stringify(corpo) });
    return resposta.json();
  }
  return simular("PUT", `/cidadaos/${cdCidadao}`, "JAVA", () => {
    const s = obterStore();
    const atual = s.obterEstado().cidadaos.find((c) => c.cdCidadao === cdCidadao);
    if (!atual) falhar({ status: 404, erro: "Cadastro não encontrado." });
    const atualizado = opcoes.manterIdentificacao ? protegerIdentificacao(dados, atual) : { ...dados, cdCidadao };
    s.atualizarEstado((e) => ({ ...e, cidadaos: e.cidadaos.map((c) => (c.cdCidadao === cdCidadao ? atualizado : c)) }));
    return atualizado;
  });
}

/* ---------- Login ---------- */

/**
 * POST /auth/entrar — API Java
 * Entra com Cartão SUS (15 números) e senha. Usada na tela "Entrar" do celular.
 * Se o endpoint não existir na API, fica em demonstração com a conta de exemplo (data/contaDemo.ts).
 * Erros esperados: 401 (CNS ou senha incorretos).
 */
export async function entrar(nrCns: string, dsSenha: string): Promise<Cidadao> {
  const cns = nrCns.replace(/\D/g, "");
  if (API_URL) {
    const resposta = await requisitar(`${API_URL}/auth/entrar`, "JAVA", { method: "POST", body: JSON.stringify({ nrCns: cns, dsSenha }) });
    return resposta.json();
  }
  return simular("POST", "/auth/entrar", "JAVA", () => {
    const { cidadaos, credenciais } = obterStore().obterEstado();
    const cidadao = cidadaos.find((c) => c.nrCns === cns);
    const credencial = cidadao && credenciais.find((c) => c.cdCidadao === cidadao.cdCidadao);
    // Mesma mensagem para CNS e senha errados: não revela quem tem conta.
    if (!cidadao || !credencial || credencial.dsSenha !== dsSenha) falhar({ status: 401, erro: "Cartão SUS ou senha incorretos." });
    return cidadao;
  });
}

/* ---------- Consulta ---------- */

/**
 * GET /consultas — API Java
 * Lista as consultas. Usada em Minhas consultas (Cidadão) e na Agenda, Pendentes e Indicadores (Recepção).
 * Erros esperados: 500.
 */
export async function listarConsultas(): Promise<Consulta[]> {
  if (API_URL) {
    const resposta = await requisitar(`${API_URL}/consultas`, "JAVA");
    return resposta.json();
  }
  return simular("GET", "/consultas", "JAVA", () => obterStore().obterEstado().consultas);
}

/** Dados para agendar: o horário e o cadastro vêm inteiros porque a previsão de falta usa os dois. */
export interface AgendamentoEntrada {
  horario: Horario;
  cidadao: Cidadao;
  cdOrientacao: number | null;
  /** Oferta de vaga da lista do dia que está sendo aceita (só demonstração). */
  cdOferta?: number;
}

/**
 * POST /consultas — API Java (+ POST /prever-falta na API Flask)
 * Agenda uma consulta. Usada no "Agendar" do celular e no balcão da Recepção.
 * Antes de gravar, chama o Modelo 1 e grava vlProbFalta/dsRiscoFalta na consulta.
 * Erros esperados: 400, 404 (horário ou cidadão não existe), 409 (horário acabou de ser ocupado).
 */
// TODO: conferir com a API Java se vlProbFalta e dsRiscoFalta vão no corpo do POST /consultas.
export async function agendarConsulta(dados: AgendamentoEntrada): Promise<Consulta> {
  const { horario, cidadao, cdOrientacao } = dados;
  if (API_URL) {
    const consultas = await listarConsultas();
    const previsao = await preverFaltaSemTravar(montarEntradaPrevisao(horario, cidadao, consultas, agora()));
    const corpo = { cdHorario: horario.cdHorario, cdCidadao: cidadao.cdCidadao, cdOrientacao, ...previsao };
    const resposta = await requisitar(`${API_URL}/consultas`, "JAVA", { method: "POST", body: JSON.stringify(corpo) });
    return resposta.json();
  }
  return simular("POST", "/consultas", "JAVA", () => agendarNoMock(dados), 201);
}

/** Agenda no mock, com as mesmas validações planejadas para a API Java. */
async function agendarNoMock({ horario: escolhido, cidadao: informado, cdOrientacao, cdOferta }: AgendamentoEntrada): Promise<Consulta> {
  const s = obterStore();
  const e = s.obterEstado();
  const horario = e.horarios.find((h) => h.cdHorario === escolhido.cdHorario);
  if (!horario) falhar({ status: 404, erro: "Horário não encontrado." });
  if (horario.flOcupado) falhar({ status: 409, erro: "Este horário acabou de ser ocupado. Escolha outro." });
  const cidadao = e.cidadaos.find((c) => c.cdCidadao === informado.cdCidadao);
  if (!cidadao) falhar({ status: 404, erro: "Cadastro não encontrado." });

  const previsao = await preverFaltaSemTravar(montarEntradaPrevisao(horario, cidadao, e.consultas, agora()));
  let consulta: Consulta | null = null;
  s.atualizarEstado((atual) => {
    // Confere de novo depois da previsão: outra pessoa pode ter pegado o horário nesse meio-tempo (409).
    if (atual.horarios.some((h) => h.cdHorario === horario.cdHorario && h.flOcupado)) {
      falhar({ status: 409, erro: "Este horário acabou de ser ocupado. Escolha outro." });
    }
    const oferta = atual.ofertas.find((o) => o.cdOferta === cdOferta && o.cdHorario === horario.cdHorario && o.status === "PENDENTE");
    const entrada = atual.listaDoDia.find((x) => x.cdEntrada === oferta?.cdEntrada);
    if (cdOferta && (!oferta || !entrada || entrada.cdCidadao !== cidadao.cdCidadao || segundosRestantesOferta(oferta, agora()) === 0)) {
      falhar({ status: 409, erro: "Esta oferta venceu ou foi repassada. Confira seus avisos." });
    }
    consulta = {
      cdConsulta: proximoCodigo(atual.consultas.map((c) => c.cdConsulta)),
      cdHorario: horario.cdHorario,
      cdCidadao: cidadao.cdCidadao,
      cdOrientacao,
      dtAgendamento: agora().toISOString(),
      dtConfirmacao: null,
      dsCanalConfirmacao: null,
      dsStatus: "AGENDADA",
      ...previsao,
      nmUnidade: atual.unidades.find((u) => u.cdUnidade === horario.cdUnidade)?.nmUnidade ?? "",
      dtHorario: horario.dtHorario,
    };
    return {
      ...atual,
      horarios: atual.horarios.map((h) => (h.cdHorario === horario.cdHorario ? { ...h, flOcupado: true } : h)),
      consultas: [...atual.consultas, consulta],
      // Aceitar a oferta tira a pessoa da lista do dia.
      ofertas: atual.ofertas.map((o) => (o.cdOferta === cdOferta ? { ...o, status: "ACEITA" as const } : o)),
      listaDoDia: atual.listaDoDia.map((x) => (x.cdEntrada === entrada?.cdEntrada ? { ...x, status: "ENCERRADA" as const } : x)),
    };
  });
  if (!consulta) falhar({ status: 500, erro: "Não foi possível agendar." });
  return consulta;
}

/** PUT /consultas/{cdConsulta} com a consulta inteira (usado por confirmar, cancelar e presença). */
async function atualizarConsultaReal(nova: Consulta): Promise<Consulta> {
  const resposta = await requisitar(`${API_URL}/consultas/${nova.cdConsulta}`, "JAVA", { method: "PUT", body: JSON.stringify(nova) });
  return resposta.json();
}

/** Troca a consulta no mock, conferindo se ela existe (404). */
function trocarConsultaNoMock(nova: Consulta): Consulta {
  const s = obterStore();
  if (!s.obterEstado().consultas.some((c) => c.cdConsulta === nova.cdConsulta)) falhar({ status: 404, erro: "Consulta não encontrada." });
  s.atualizarEstado((e) => ({ ...e, consultas: e.consultas.map((c) => (c.cdConsulta === nova.cdConsulta ? nova : c)) }));
  return nova;
}

/**
 * PUT /consultas/{cdConsulta} — API Java (dsStatus CONFIRMADA)
 * Confirma a presença. Usada em Minhas consultas (APP) e em Pendentes da Recepção (TELEFONE ou PRESENCIAL).
 * Erros esperados: 404, 409.
 */
export async function confirmarConsulta(consulta: Consulta, canal: CanalConfirmacao): Promise<Consulta> {
  const nova: Consulta = { ...consulta, dsStatus: "CONFIRMADA", dtConfirmacao: agora().toISOString(), dsCanalConfirmacao: canal };
  if (API_URL) return atualizarConsultaReal(nova);
  return simular("PUT", `/consultas/${consulta.cdConsulta}`, "JAVA", () => trocarConsultaNoMock(nova));
}

/**
 * PUT /consultas/{cdConsulta} — API Java (dsStatus LIBERADA)
 * Cancela a consulta ("Não vou poder ir" no celular, ou pela recepção).
 * Regra: só cancela consulta agendada ou confirmada que ainda não aconteceu. No modo demonstração,
 * o horário liberado é oferecido à lista do dia (mesma regra do prazo de confirmação).
 * Erros esperados: 404, 409 (não pode mais cancelar).
 */
export async function cancelarConsulta(consulta: Consulta): Promise<Consulta> {
  const nova: Consulta = { ...consulta, dsStatus: "LIBERADA" };
  if (API_URL) return atualizarConsultaReal(nova);
  return simular("PUT", `/consultas/${consulta.cdConsulta}`, "JAVA", () => {
    const s = obterStore();
    const atual = s.obterEstado().consultas.find((c) => c.cdConsulta === consulta.cdConsulta);
    if (!atual) falhar({ status: 404, erro: "Consulta não encontrada." });
    if (!podeCancelar(atual, agora())) falhar({ status: 409, erro: "Esta consulta não pode mais ser cancelada." });
    s.atualizarEstado((e) => liberarConsulta(e, consulta.cdConsulta, agora()).novoEstado);
    return nova;
  });
}

/**
 * PUT /consultas/{cdConsulta} — API Java (dsStatus REALIZADA ou FALTA)
 * Registra presença ou falta na Agenda da Recepção.
 * Regra: presença só no dia da consulta; falta só depois do horário.
 * Erros esperados: 404, 409 (fora do momento permitido).
 */
export async function registrarPresenca(consulta: Consulta, status: "REALIZADA" | "FALTA"): Promise<Consulta> {
  const nova: Consulta = { ...consulta, dsStatus: status };
  if (API_URL) return atualizarConsultaReal(nova);
  return simular("PUT", `/consultas/${consulta.cdConsulta}`, "JAVA", () => {
    const pode = acoesPresenca(consulta, agora());
    if (status === "REALIZADA" && !pode.presenca) falhar({ status: 409, erro: "A presença só pode ser registrada no dia da consulta." });
    if (status === "FALTA" && !pode.falta) falhar({ status: 409, erro: "A falta só pode ser registrada depois do horário da consulta." });
    return trocarConsultaNoMock(nova);
  });
}

/* ---------- Só no front (DEMONSTRAÇÃO) ---------- */

/**
 * Salva a orientação feita no celular ou no balcão (o número dela é o código que a pessoa mostra na recepção).
 */
// DEMONSTRAÇÃO: não existe na API Java
export async function salvarOrientacao(dados: Omit<Orientacao, "cdOrientacao" | "dtOrientacao">): Promise<Orientacao> {
  return simular("POST", "orientação salva (só no front)", "FRONT", () => {
    const s = obterStore();
    const nova: Orientacao = { ...dados, cdOrientacao: proximoCodigo(s.obterEstado().orientacoes.map((o) => o.cdOrientacao)), dtOrientacao: agora().toISOString() };
    s.atualizarEstado((e) => ({ ...e, orientacoes: [...e.orientacoes, nova] }));
    return nova;
  }, 201);
}

/** Busca a orientação pelo código digitado no balcão. Erro 404 se o código não existir. */
// DEMONSTRAÇÃO: não existe na API Java
export async function buscarOrientacao(cdOrientacao: number): Promise<Orientacao> {
  return simular("GET", `orientação ${cdOrientacao} (só no front)`, "FRONT", () => {
    const o = obterStore().obterEstado().orientacoes.find((x) => x.cdOrientacao === cdOrientacao);
    if (!o) falhar({ status: 404, erro: "Código não encontrado. Confira o número com o cidadão." });
    return o;
  });
}

/** Vincula ao cidadão a orientação feita sem login (balcão). Erro 409 se o código já for de outra pessoa. */
// DEMONSTRAÇÃO: não existe na API Java
export async function vincularOrientacao(cdOrientacao: number, cdCidadao: number): Promise<Orientacao> {
  return simular("PUT", `orientação ${cdOrientacao} (só no front)`, "FRONT", () => {
    const s = obterStore();
    const o = s.obterEstado().orientacoes.find((x) => x.cdOrientacao === cdOrientacao);
    if (!o) falhar({ status: 404, erro: "Código não encontrado." });
    if (!podeVincular(o, cdCidadao)) falhar({ status: 409, erro: "Código já utilizado." });
    const nova: Orientacao = { ...o, cdCidadao };
    s.atualizarEstado((e) => ({ ...e, orientacoes: e.orientacoes.map((x) => (x.cdOrientacao === cdOrientacao ? nova : x)) }));
    return nova;
  });
}

/**
 * A recepção coloca o cidadão na lista do dia da UBS.
 * Regras: só em dia útil; a mesma pessoa não entra duas vezes.
 */
// DEMONSTRAÇÃO: não existe na API Java
export async function incluirNaListaDoDia(dados: { cdUnidade: number; cdCidadao: number; cdOrientacao: number; dsCor: EntradaListaDoDia["dsCor"] }): Promise<EntradaListaDoDia> {
  return simular("POST", "lista do dia (só no front)", "FRONT", () => {
    const s = obterStore();
    const e = s.obterEstado();
    const cidadao = e.cidadaos.find((c) => c.cdCidadao === dados.cdCidadao);
    if (!cidadao) falhar({ status: 404, erro: "Cadastro não encontrado." });
    if (!listaDoDiaAberta(agora())) falhar({ status: 409, erro: MENSAGEM_LISTA_SO_DIA_UTIL });
    if (e.listaDoDia.some((x) => x.cdCidadao === dados.cdCidadao && x.status === "AGUARDANDO")) falhar({ status: 409, erro: "Este cidadão já está na lista do dia." });
    const entrada: EntradaListaDoDia = {
      cdEntrada: proximoCodigo(e.listaDoDia.map((x) => x.cdEntrada)),
      cdCidadao: dados.cdCidadao, cdOrientacao: dados.cdOrientacao, cdUnidade: dados.cdUnidade,
      nmCidadao: cidadao.nmCidadao, dsCor: dados.dsCor, dtEntrada: agora().toISOString(),
      flPrioridade: false, flCidadao: false, status: "AGUARDANDO",
    };
    s.atualizarEstado((atual) => ({ ...atual, listaDoDia: [...atual.listaDoDia, entrada] }));
    return entrada;
  }, 201);
}

/**
 * A recepção registra que a pessoa aceitou a vaga por telefone e agenda a consulta.
 * Regra: a oferta precisa estar pendente e dentro do prazo de 30 min.
 */
// DEMONSTRAÇÃO: não existe na API Java (o agendamento em si usa POST /consultas)
export async function aceitarOfertaPorTelefone(cdOferta: number): Promise<Consulta> {
  const e = obterStore().obterEstado();
  const oferta = e.ofertas.find((o) => o.cdOferta === cdOferta && o.status === "PENDENTE");
  const entrada = e.listaDoDia.find((x) => x.cdEntrada === oferta?.cdEntrada);
  const horario = e.horarios.find((h) => h.cdHorario === oferta?.cdHorario);
  const cidadao = e.cidadaos.find((c) => c.cdCidadao === entrada?.cdCidadao);
  if (!oferta || segundosRestantesOferta(oferta, agora()) === 0 || !entrada || !horario || !cidadao) {
    falhar({ status: 409, erro: "Oferta indisponível." });
  }
  return agendarConsulta({ horario, cidadao, cdOrientacao: entrada.cdOrientacao, cdOferta });
}

/** Ficha de saúde do cidadão (null se não tiver). Prévia – integração com o Meu SUS prevista. */
// DEMONSTRAÇÃO: não existe na API Java
export async function buscarFicha(cdCidadao: number): Promise<FichaSaude | null> {
  return simular("GET", "ficha de saúde (só no front)", "FRONT", () =>
    obterStore().obterEstado().fichas.find((f) => f.cdCidadao === cdCidadao) ?? null);
}

/**
 * Salva a ficha de saúde. Regra (LGPD, dado sensível): só salva com a autorização marcada.
 */
// DEMONSTRAÇÃO: não existe na API Java
export async function salvarFicha(ficha: Omit<FichaSaude, "dtAtualizacao">): Promise<FichaSaude> {
  return simular("PUT", "ficha de saúde (só no front)", "FRONT", () => {
    if (!ficha.flConsentimento) falhar({ status: 400, erro: "Marque a autorização (LGPD) para salvar a ficha." });
    const nova: FichaSaude = { ...ficha, dtAtualizacao: agora().toISOString() };
    obterStore().atualizarEstado((e) => ({ ...e, fichas: [...e.fichas.filter((f) => f.cdCidadao !== ficha.cdCidadao), nova] }));
    return nova;
  });
}

/** Apaga a ficha de saúde (direito de exclusão da LGPD). */
// DEMONSTRAÇÃO: não existe na API Java
export async function apagarFicha(cdCidadao: number): Promise<void> {
  return simular("DELETE", "ficha de saúde (só no front)", "FRONT", () => {
    obterStore().atualizarEstado((e) => ({ ...e, fichas: e.fichas.filter((f) => f.cdCidadao !== cdCidadao) }));
  });
}
