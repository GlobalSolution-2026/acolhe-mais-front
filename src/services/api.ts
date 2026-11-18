/**
 * Serviços da API Java do Acolhe+ (Spring Boot, VITE_API_URL).
 * Repositório da API: GlobalSolution-2026/Acolhe-Mais-Java. Os nomes dos campos seguem os DTOs dela.
 *
 * Cada função corresponde a um endpoint e tem dois caminhos:
 * - com VITE_API_URL definida → fetch real (requisitar);
 * - sem a variável → modo demonstração: lê e altera o estado do mock (SimuladorContext)
 *   e espera 400 ms para imitar a rede (simular).
 * Ligar a API de verdade é só configurar a variável de ambiente.
 *
 * RN21 (cadastro do balcão vira conta com senha): a API Java já faz no POST /cidadaos. Com tpAcesso SENHA
 * e um CNS cadastrado como BALCAO, ela completa o cadastro (mesmo idCidadao, consultas mantidas) e devolve 201.
 * O modo demonstração segue a mesma regra.
 *
 * As funções marcadas com "DEMONSTRAÇÃO: não existe na API Java" ficam sempre no mock
 * (lista do dia, oferta de vaga, orientação salva, balcão e ficha de saúde).
 */
import type {
  CanalConfirmacao, Cidadao, CidadaoAtualizacao, CidadaoEntrada, Consulta, ConsultaEntrada,
  EntradaListaDoDia, FichaSaude, Horario, LoginEntrada, StatusConsultaEntrada, Unidade,
} from "../types";
import type { Orientacao } from "../types/orientacao";
import type { EstadoSimulador } from "../context/estadoSimulador";
import { chaveDia } from "../lib/datas";
import { agora } from "../lib/relogio";
import { podeVincular } from "./balcao";
import { ErroApi, falhar, requisitar, simular } from "./http";
import { montarEntradaPrevisao, preverFaltaSemTravar } from "./ia";
import {
  acoesPresenca, consultaNoDia, listaDoDiaAberta, MENSAGEM_LISTA_SO_DIA_UTIL, podeCancelar, segundosRestantesOferta,
} from "./regrasAgendamento";
import { finalizarOferta, liberarConsulta } from "./simulacao";

/** URL da API Java; vazia = modo demonstração. */
export const API_URL: string | undefined = import.meta.env.VITE_API_URL || undefined;

/** Mensagem do 409 quando a oferta de vaga da lista do dia venceu ou foi repassada. */
const MENSAGEM_OFERTA_VENCIDA = "Esta oferta venceu ou foi repassada. Confira seus avisos.";

/** Mensagem do 409 no Criar conta: o Cartão SUS já tem conta com senha (a mesma no mock e na API real). */
export const MENSAGEM_CONTA_EXISTENTE = "Já existe conta com este Cartão SUS. Use Entrar.";

/** Mensagem do 409 ao agendar (a mesma no mock e na API real, para a tela não depender do texto da API). */
export const MENSAGEM_HORARIO_OCUPADO = "Este horário acabou de ser ocupado. Escolha outro.";

/** Mensagem do 409 ao agendar quando a pessoa já tem consulta ativa no mesmo dia (a mesma no mock e com a API ligada). */
export const MENSAGEM_CONSULTA_NO_DIA = "Você já tem consulta marcada neste dia. Escolha outro dia.";

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
  if (!store) falhar({ status: 500, mensagem: "O simulador ainda não foi carregado." });
  return store;
}

/** Próximo id livre de uma lista (imita a sequence do banco Oracle). */
function proximoId(ids: number[]): number {
  return Math.max(0, ...ids) + 1;
}

/** Tira máscara (pontos, hífens, parênteses): CNS, CPF, CEP e telefones vão só com números para a API. */
function soNumeros(texto: string | null | undefined): string {
  return (texto ?? "").replace(/\D/g, "");
}

/**
 * Converte o CidadaoSaidaDTO para o tipo do front: campos opcionais que a API devolve como null viram "".
 * Assim as regras (ex.: temContatoValido) não precisam tratar null em todo lugar.
 */
function converterCidadao(json: Cidadao): Cidadao {
  return {
    ...json,
    nrCelular: json.nrCelular ?? "",
    nmContatoRecado: json.nmContatoRecado ?? "",
    nrContatoRecado: json.nrContatoRecado ?? "",
    nrCep: json.nrCep ?? "",
  };
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
 * GET /unidades/{idUnidade} — API Java
 * Busca uma unidade. Usada no topo da tela de horários do celular.
 * Erros esperados: 404 (unidade não existe).
 */
export async function buscarUnidade(idUnidade: number): Promise<Unidade> {
  if (API_URL) {
    const resposta = await requisitar(`${API_URL}/unidades/${idUnidade}`, "JAVA");
    return resposta.json();
  }
  return simular("GET", `/unidades/${idUnidade}`, "JAVA", () => {
    const unidade = obterStore().obterEstado().unidades.find((u) => u.idUnidade === idUnidade);
    if (!unidade) falhar({ status: 404, mensagem: "Unidade não encontrada" });
    return unidade;
  });
}

/* ---------- Horário ---------- */

/**
 * GET /unidades/{idUnidade}/horarios — API Java
 * Lista os horários de uma UBS. Usada na tela "Horários" do celular e na agenda da Recepção.
 * Erros esperados: 404 (unidade não existe).
 */
export async function listarHorarios(idUnidade: number): Promise<Horario[]> {
  if (API_URL) {
    const resposta = await requisitar(`${API_URL}/unidades/${idUnidade}/horarios`, "JAVA");
    return resposta.json();
  }
  return simular("GET", `/unidades/${idUnidade}/horarios`, "JAVA", () => {
    const { unidades, horarios } = obterStore().obterEstado();
    if (!unidades.some((u) => u.idUnidade === idUnidade)) falhar({ status: 404, mensagem: "Unidade não encontrada" });
    return horarios.filter((h) => h.idUnidade === idUnidade);
  });
}

/* ---------- Cidadão ---------- */

/**
 * Corpo do POST /cidadaos com CNS, CPF, CEP e telefones só com números.
 * A senha só vai quando tpAcesso é SENHA. No BALCAO o campo fica de fora do JSON: o CidadaoEntradaDTO
 * tem @Size(min = 6) na senha, então "senha": "" daria 400; sem o campo (ou com null) a API aceita.
 */
function corpoCidadao({ senha, ...dados }: CidadaoEntrada): CidadaoEntrada {
  return {
    ...dados,
    ...(dados.tpAcesso === "SENHA" ? { senha } : {}),
    nrCns: soNumeros(dados.nrCns),
    nrCpf: dados.nrCpf ? soNumeros(dados.nrCpf) : null,
    nrCelular: soNumeros(dados.nrCelular),
    nrContatoRecado: soNumeros(dados.nrContatoRecado),
    nrCep: soNumeros(dados.nrCep),
  };
}

/**
 * POST /cidadaos — API Java (tpAcesso BALCAO, sem senha)
 * Cadastra um cidadão no balcão da Recepção.
 * Erros esperados: 400 (dados inválidos), 409 (CNS ou CPF já cadastrado).
 * O corpo vai sem o campo senha (ver corpoCidadao).
 */
export async function cadastrarCidadao(dados: Omit<CidadaoEntrada, "tpAcesso" | "senha">): Promise<Cidadao> {
  const corpo = corpoCidadao({ ...dados, tpAcesso: "BALCAO" });
  if (API_URL) {
    const resposta = await requisitar(`${API_URL}/cidadaos`, "JAVA", { method: "POST", body: JSON.stringify(corpo) });
    return converterCidadao(await resposta.json());
  }
  return simular("POST", "/cidadaos", "JAVA", () => cadastrarNoMock(corpo), 201);
}

/** Grava um cidadão novo no mock (regra: o CNS é único → 409). A senha fica só nas credenciais do mock. */
function cadastrarNoMock({ senha, ...dados }: CidadaoEntrada): Cidadao {
  const s = obterStore();
  if (s.obterEstado().cidadaos.some((c) => c.nrCns === dados.nrCns)) falhar({ status: 409, mensagem: "Já existe um cidadão com este CNS" });
  const novo: Cidadao = { ...dados, idCidadao: proximoId(s.obterEstado().cidadaos.map((c) => c.idCidadao)) };
  s.atualizarEstado((e) => ({
    ...e,
    cidadaos: [...e.cidadaos, novo],
    credenciais: senha ? [...e.credenciais, { idCidadao: novo.idCidadao, dsSenha: senha }] : e.credenciais,
  }));
  return novo;
}

/**
 * POST /cidadaos — API Java (tpAcesso SENHA, com senha)
 * Cria a conta do cidadão no app. Usada na tela "Criar conta" do celular.
 * Regra RN21: quem foi cadastrado no balcão (tpAcesso BALCAO, sem senha) pode criar a conta com o mesmo
 * Cartão SUS; a conta completa esse cadastro e mantém as consultas já marcadas.
 * Erros esperados: 400 (senha curta ou dados inválidos), 409 (já existe conta com este CNS).
 */
// RN21 com a API real: quem faz é a API Java (CidadaoService.criar). Se o CNS é de um cadastro BALCAO,
// ela devolve 201 com o mesmo idCidadao, e a tela usa essa resposta como num cadastro novo.
// Se o CNS já tem senha (ou é GOVBR), devolve 409; a tela mostra MENSAGEM_CONTA_EXISTENTE.
export async function criarConta(dados: Omit<CidadaoEntrada, "tpAcesso" | "senha">, senha: string): Promise<Cidadao> {
  const corpo = corpoCidadao({ ...dados, tpAcesso: "SENHA", senha });
  if (API_URL) {
    try {
      const resposta = await requisitar(`${API_URL}/cidadaos`, "JAVA", { method: "POST", body: JSON.stringify(corpo) });
      return converterCidadao(await resposta.json());
    } catch (erro) {
      // 409: a API diz "Já existe um cidadão com este CNS"; a tela troca pelo texto que manda usar Entrar.
      // O Criar conta não envia CPF, então aqui o 409 só pode ser do CNS.
      if (erro instanceof ErroApi && erro.status === 409) throw new ErroApi(MENSAGEM_CONTA_EXISTENTE, 409);
      throw erro;
    }
  }
  return simular("POST", "/cidadaos", "JAVA", () => {
    if (senha.length < 6) falhar({ status: 400, mensagem: "A senha precisa ter pelo menos 6 caracteres" });
    const s = obterStore();
    const existente = s.obterEstado().cidadaos.find((c) => c.nrCns === corpo.nrCns);
    if (!existente) return cadastrarNoMock(corpo);
    if (existente.tpAcesso === "SENHA") falhar({ status: 409, mensagem: MENSAGEM_CONTA_EXISTENTE });
    // GOVBR já é uma conta (pelo gov.br): a RN21 vale só para o cadastro do balcão.
    if (existente.tpAcesso === "GOVBR") falhar({ status: 409, mensagem: "Este Cartão SUS já tem conta pelo gov.br. O acesso pelo gov.br ainda não está disponível." });
    // RN21: cadastro do balcão → vira conta com senha (mesmo id, consultas mantidas).
    const { senha: _senha, ...semSenha } = corpo;
    void _senha;
    const cidadao: Cidadao = { ...semSenha, idCidadao: existente.idCidadao };
    s.atualizarEstado((e) => ({
      ...e,
      cidadaos: e.cidadaos.map((c) => (c.idCidadao === cidadao.idCidadao ? cidadao : c)),
      credenciais: [...e.credenciais, { idCidadao: cidadao.idCidadao, dsSenha: senha }],
    }));
    return cidadao;
  }, 201);
}

/**
 * GET /cidadaos/{idCidadao} — API Java
 * Busca o cadastro. Usada no Perfil do celular (dados atualizados depois do login).
 * Erros esperados: 404 (cidadão não existe).
 */
export async function buscarCidadao(idCidadao: number): Promise<Cidadao> {
  if (API_URL) {
    const resposta = await requisitar(`${API_URL}/cidadaos/${idCidadao}`, "JAVA");
    return sincronizarCadastroAtual(converterCidadao(await resposta.json()));
  }
  return simular("GET", `/cidadaos/${idCidadao}`, "JAVA", () => {
    const cidadao = obterStore().obterEstado().cidadaos.find((c) => c.idCidadao === idCidadao);
    if (!cidadao) falhar({ status: 404, mensagem: "Cidadão não encontrado" });
    return sincronizarCadastroAtual(cidadao);
  });
}

/**
 * Se o cadastro recebido é de quem está logado, troca o cadastro guardado no Context (cadastroAtual).
 * Assim, o que a API devolve num GET ou PUT do cadastro (ex.: celular novo, mudança feita no balcão)
 * chega à orientação, à Emergência e à Ficha sem precisar entrar de novo.
 * @returns o próprio cadastro, para encadear no return
 */
function sincronizarCadastroAtual(cidadao: Cidadao): Cidadao {
  store?.atualizarEstado((e) => (e.idCidadaoAtual === cidadao.idCidadao ? { ...e, cadastroAtual: cidadao } : e));
  return cidadao;
}

/**
 * GET /cidadaos?cns={nrCns} — API Java
 * Busca o cidadão pelo Cartão SUS (filtro ?cns= da API, que devolve um cadastro só). Usada no balcão da Recepção.
 * @returns o cadastro, ou null quando não existe (404)
 */
export async function buscarCidadaoPorCns(nrCns: string): Promise<Cidadao | null> {
  const cns = soNumeros(nrCns);
  try {
    if (API_URL) {
      const resposta = await requisitar(`${API_URL}/cidadaos?cns=${cns}`, "JAVA");
      return converterCidadao(await resposta.json());
    }
    return await simular("GET", `/cidadaos?cns=${cns}`, "JAVA", () => {
      const cidadao = obterStore().obterEstado().cidadaos.find((c) => c.nrCns === cns);
      if (!cidadao) falhar({ status: 404, mensagem: "Cidadão não encontrado" });
      return cidadao;
    });
  } catch (erro) {
    // 404 não é erro para a tela: significa "ainda não tem cadastro" (o balcão oferece cadastrar).
    if (erro instanceof ErroApi && erro.status === 404) return null;
    throw erro;
  }
}

/**
 * PUT /cidadaos/{idCidadao} — API Java
 * Atualiza o contato do cidadão. Usada em "Editar perfil" e no Agendar.
 * Regra RF27: pelo app só mudam celular, contato de recado e CEP; Cartão SUS, nome, nascimento e sexo
 * ficam como estão (o corpo nem leva esses campos).
 * Erros esperados: 400 (dados inválidos), 404 (cadastro não existe).
 */
export async function atualizarCidadao(idCidadao: number, dados: CidadaoAtualizacao): Promise<Cidadao> {
  const corpo: CidadaoAtualizacao = {
    nrCelular: soNumeros(dados.nrCelular),
    nmContatoRecado: dados.nmContatoRecado,
    nrContatoRecado: soNumeros(dados.nrContatoRecado),
    nrCep: soNumeros(dados.nrCep),
  };
  if (API_URL) {
    const resposta = await requisitar(`${API_URL}/cidadaos/${idCidadao}`, "JAVA", { method: "PUT", body: JSON.stringify(corpo) });
    return sincronizarCadastroAtual(converterCidadao(await resposta.json()));
  }
  return simular("PUT", `/cidadaos/${idCidadao}`, "JAVA", () => {
    const s = obterStore();
    const atual = s.obterEstado().cidadaos.find((c) => c.idCidadao === idCidadao);
    if (!atual) falhar({ status: 404, mensagem: "Cidadão não encontrado" });
    const atualizado: Cidadao = { ...atual, ...corpo };
    s.atualizarEstado((e) => ({ ...e, cidadaos: e.cidadaos.map((c) => (c.idCidadao === idCidadao ? atualizado : c)) }));
    return sincronizarCadastroAtual(atualizado);
  });
}

/**
 * POST /cidadaos/login — API Java
 * Entra com Cartão SUS (15 números) e senha. Usada na tela "Entrar" do celular e no painel "Perfis para testar".
 * No modo demonstração, as contas com senha são as de data/contaDemo.ts (as mesmas da carga do banco).
 * Erros esperados: 401 (CNS ou senha incorretos, ou cadastro sem senha: BALCAO ou GOVBR).
 */
export async function entrar(nrCns: string, senha: string): Promise<Cidadao> {
  const corpo: LoginEntrada = { nrCns: soNumeros(nrCns), senha };
  if (API_URL) {
    const resposta = await requisitar(`${API_URL}/cidadaos/login`, "JAVA", { method: "POST", body: JSON.stringify(corpo) });
    return converterCidadao(await resposta.json());
  }
  return simular("POST", "/cidadaos/login", "JAVA", () => {
    const { cidadaos, credenciais } = obterStore().obterEstado();
    const cidadao = cidadaos.find((c) => c.nrCns === corpo.nrCns);
    const credencial = cidadao && credenciais.find((c) => c.idCidadao === cidadao.idCidadao);
    // Mesma mensagem para CNS e senha errados: não revela quem tem conta.
    if (!cidadao || cidadao.tpAcesso !== "SENHA" || !credencial || credencial.dsSenha !== senha) {
      falhar({ status: 401, mensagem: "Cartão SUS ou senha incorretos." });
    }
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
  idOrientacao: number | null;
  /** Oferta de vaga da lista do dia que está sendo aceita (só demonstração). */
  idOferta?: number;
}

/**
 * POST /consultas — API Java (+ POST /prever-falta na API Flask)
 * Agenda uma consulta. Usada no "Agendar" do celular e no balcão da Recepção.
 * Também usada na Agenda da Recepção (quem chegou sem horário).
 * Antes de gravar, chama o Modelo 1 e manda vlProbFalta/dsRiscoFalta no corpo.
 * Regra: uma consulta ativa (AGENDADA ou CONFIRMADA) por pessoa por dia, em qualquer UBS; LIBERADA, FALTA e
 * REALIZADA não contam. Regra só no front (limitação desta versão): a API Java ainda não valida.
 * Erros esperados: 400, 404 (horário ou cidadão não existe), 409 (horário acabou de ser ocupado ou
 * a pessoa já tem consulta no dia: MENSAGEM_CONSULTA_NO_DIA).
 */
export async function agendarConsulta(dados: AgendamentoEntrada): Promise<Consulta> {
  const { horario, cidadao } = dados;
  if (API_URL) {
    const consultas = await listarConsultas();
    // Uma consulta por dia: confere antes da previsão e fora do try/catch abaixo,
    // para a mensagem não ser trocada pela de horário ocupado.
    conferirConsultaNoDia(consultas, cidadao.idCidadao, horario.dtHorario);
    const previsao = await preverFaltaSemTravar(montarEntradaPrevisao(horario, cidadao, consultas, agora()));
    // idOrientacao vai null: a orientação ainda só existe no front (demonstração), com o número do mock.
    // O banco só tem as orientações 1 a 5 da carga de teste; mandar o número do mock quebraria a FK
    // com ACM_ORIENTACAO e a API devolveria 400. Quando a orientação for salva na API, enviar o id dela.
    const corpo: ConsultaEntrada = { idHorario: horario.idHorario, idCidadao: cidadao.idCidadao, idOrientacao: null, vlProbFalta: previsao.vlProbFalta, dsRiscoFalta: previsao.dsRiscoFalta };
    // Oferta da lista do dia (só no front): confere antes de gravar, como no modo demonstração.
    if (dados.idOferta && !ofertaValida(obterStore().obterEstado(), dados.idOferta, horario.idHorario, cidadao.idCidadao)) {
      falhar({ status: 409, mensagem: MENSAGEM_OFERTA_VENCIDA });
    }
    try {
      const resposta = await requisitar(`${API_URL}/consultas`, "JAVA", { method: "POST", body: JSON.stringify(corpo) });
      const consulta: Consulta = await resposta.json();
      // DEMONSTRAÇÃO: a consulta foi gravada na API; a oferta vira ACEITA e a pessoa sai da lista do dia no front.
      const idOferta = dados.idOferta;
      if (idOferta) obterStore().atualizarEstado((e) => finalizarOferta(e, idOferta, "ACEITA", agora()));
      return consulta;
    } catch (erro) {
      // 409: a tela mostra sempre o mesmo texto, qualquer que seja o da API.
      if (erro instanceof ErroApi && erro.status === 409) throw new ErroApi(MENSAGEM_HORARIO_OCUPADO, 409);
      throw erro;
    }
  }
  return simular("POST", "/consultas", "JAVA", () => agendarNoMock(dados), 201);
}

/**
 * A oferta ainda pode ser aceita: está pendente, dentro dos 30 min, é deste horário
 * e a entrada da lista do dia é deste cidadão.
 */
function ofertaValida(e: EstadoSimulador, idOferta: number, idHorario: number, idCidadao: number): boolean {
  const oferta = e.ofertas.find((o) => o.idOferta === idOferta && o.idHorario === idHorario && o.status === "PENDENTE");
  const entrada = e.listaDoDia.find((x) => x.idEntrada === oferta?.idEntrada);
  return !!oferta && !!entrada && entrada.idCidadao === idCidadao && segundosRestantesOferta(oferta, agora()) > 0;
}

/**
 * Regra: a pessoa não pode ter duas consultas ativas (AGENDADA ou CONFIRMADA) no mesmo dia, em nenhuma UBS.
 * Usa a mesma consultaNoDia da lista do dia. Regra só no front: a API Java ainda não valida.
 * @param consultas consultas da API (ou do mock, no modo demonstração)
 * @param idCidadao quem está sendo agendado
 * @param dtHorario data e hora do horário escolhido
 * @throws ErroApi 409 com MENSAGEM_CONSULTA_NO_DIA quando já existe consulta ativa no dia
 */
function conferirConsultaNoDia(consultas: Consulta[], idCidadao: number, dtHorario: string): void {
  if (consultaNoDia(consultas, idCidadao, chaveDia(dtHorario))) falhar({ status: 409, mensagem: MENSAGEM_CONSULTA_NO_DIA });
}

/** Agenda no mock, com as mesmas validações da API Java (404 e 409) e a regra de uma consulta por dia. */
async function agendarNoMock({ horario: escolhido, cidadao: informado, idOrientacao, idOferta }: AgendamentoEntrada): Promise<Consulta> {
  const s = obterStore();
  const e = s.obterEstado();
  const horario = e.horarios.find((h) => h.idHorario === escolhido.idHorario);
  if (!horario) falhar({ status: 404, mensagem: "Horário não encontrado" });
  if (horario.flOcupado) falhar({ status: 409, mensagem: MENSAGEM_HORARIO_OCUPADO });
  const cidadao = e.cidadaos.find((c) => c.idCidadao === informado.idCidadao);
  if (!cidadao) falhar({ status: 404, mensagem: "Cidadão não encontrado" });
  // Uma consulta por dia: confere antes de chamar a previsão e de gravar.
  conferirConsultaNoDia(e.consultas, cidadao.idCidadao, horario.dtHorario);

  const previsao = await preverFaltaSemTravar(montarEntradaPrevisao(horario, cidadao, e.consultas, agora()));
  const unidade = e.unidades.find((u) => u.idUnidade === horario.idUnidade);
  const nova: Consulta = {
    idConsulta: 0, // definido abaixo, junto com a gravação
    nmUnidade: unidade?.nmUnidade ?? "",
    dtHorario: horario.dtHorario,
    nmCidadao: cidadao.nmCidadao,
    dsStatus: "AGENDADA",
    idHorario: horario.idHorario,
    idCidadao: cidadao.idCidadao,
    idOrientacao,
    dtAgendamento: agora().toISOString(),
    dtConfirmacao: null,
    dsCanalConfirmacao: null,
    ...previsao,
  };
  s.atualizarEstado((atual) => {
    // Confere de novo depois da previsão: outra pessoa pode ter pegado o horário nesse meio-tempo (409).
    if (atual.horarios.some((h) => h.idHorario === horario.idHorario && h.flOcupado)) {
      falhar({ status: 409, mensagem: MENSAGEM_HORARIO_OCUPADO });
    }
    // E a consulta no dia também (outra aba pode ter agendado a mesma pessoa nesse meio-tempo).
    conferirConsultaNoDia(atual.consultas, cidadao.idCidadao, horario.dtHorario);
    const oferta = atual.ofertas.find((o) => o.idOferta === idOferta && o.idHorario === horario.idHorario && o.status === "PENDENTE");
    const entrada = atual.listaDoDia.find((x) => x.idEntrada === oferta?.idEntrada);
    if (idOferta && !ofertaValida(atual, idOferta, horario.idHorario, cidadao.idCidadao)) {
      falhar({ status: 409, mensagem: MENSAGEM_OFERTA_VENCIDA });
    }
    nova.idConsulta = proximoId(atual.consultas.map((c) => c.idConsulta));
    return {
      ...atual,
      horarios: atual.horarios.map((h) => (h.idHorario === horario.idHorario ? { ...h, flOcupado: true } : h)),
      consultas: [...atual.consultas, nova],
      // Aceitar a oferta tira a pessoa da lista do dia.
      ofertas: atual.ofertas.map((o) => (o.idOferta === idOferta ? { ...o, status: "ACEITA" as const } : o)),
      listaDoDia: atual.listaDoDia.map((x) => (x.idEntrada === entrada?.idEntrada ? { ...x, status: "ENCERRADA" as const } : x)),
    };
  });
  return nova;
}

/**
 * PUT /consultas/{idConsulta}/status — API Java
 * Troca o status da consulta (usado por confirmar, cancelar e presença/falta).
 * Erros esperados: 400 (status inválido), 404, 409.
 */
async function mudarStatusReal(idConsulta: number, corpo: StatusConsultaEntrada): Promise<Consulta> {
  const resposta = await requisitar(`${API_URL}/consultas/${idConsulta}/status`, "JAVA", { method: "PUT", body: JSON.stringify(corpo) });
  return resposta.json();
}

/** Troca a consulta no mock, conferindo se ela existe (404). */
function trocarConsultaNoMock(nova: Consulta): Consulta {
  const s = obterStore();
  if (!s.obterEstado().consultas.some((c) => c.idConsulta === nova.idConsulta)) falhar({ status: 404, mensagem: "Consulta não encontrada" });
  s.atualizarEstado((e) => ({ ...e, consultas: e.consultas.map((c) => (c.idConsulta === nova.idConsulta ? nova : c)) }));
  return nova;
}

/**
 * PUT /consultas/{idConsulta}/status — API Java (dsStatus CONFIRMADA)
 * Confirma a presença. Usada em Minhas consultas (APP) e em Pendentes da Recepção (TELEFONE ou PRESENCIAL).
 * A API grava dtConfirmacao com a data e hora atuais.
 * Erros esperados: 404, 409.
 */
export async function confirmarConsulta(consulta: Consulta, canal: CanalConfirmacao): Promise<Consulta> {
  if (API_URL) return mudarStatusReal(consulta.idConsulta, { dsStatus: "CONFIRMADA", dsCanalConfirmacao: canal });
  const nova: Consulta = { ...consulta, dsStatus: "CONFIRMADA", dtConfirmacao: agora().toISOString(), dsCanalConfirmacao: canal };
  return simular("PUT", `/consultas/${consulta.idConsulta}/status`, "JAVA", () => trocarConsultaNoMock(nova));
}

/**
 * PUT /consultas/{idConsulta}/status — API Java (dsStatus LIBERADA)
 * Cancela a consulta ("Não vou poder ir" no celular, ou pela recepção).
 * Regra: só cancela consulta agendada ou confirmada que ainda não aconteceu. No modo demonstração,
 * o horário liberado é oferecido à lista do dia (mesma regra do prazo de confirmação).
 * Erros esperados: 404, 409 (não pode mais cancelar).
 */
export async function cancelarConsulta(consulta: Consulta): Promise<Consulta> {
  if (API_URL) return mudarStatusReal(consulta.idConsulta, { dsStatus: "LIBERADA" });
  return simular("PUT", `/consultas/${consulta.idConsulta}/status`, "JAVA", () => {
    const s = obterStore();
    const atual = s.obterEstado().consultas.find((c) => c.idConsulta === consulta.idConsulta);
    if (!atual) falhar({ status: 404, mensagem: "Consulta não encontrada" });
    if (!podeCancelar(atual, agora())) falhar({ status: 409, mensagem: "Esta consulta não pode mais ser cancelada." });
    s.atualizarEstado((e) => liberarConsulta(e, consulta.idConsulta, agora()).novoEstado);
    return { ...atual, dsStatus: "LIBERADA" as const };
  });
}

/**
 * PUT /consultas/{idConsulta}/status — API Java (dsStatus REALIZADA ou FALTA)
 * Registra presença ou falta na Agenda da Recepção.
 * Regra: presença só no dia da consulta; falta só depois do horário.
 * Erros esperados: 404, 409 (fora do momento permitido).
 */
export async function registrarPresenca(consulta: Consulta, status: "REALIZADA" | "FALTA"): Promise<Consulta> {
  if (API_URL) return mudarStatusReal(consulta.idConsulta, { dsStatus: status });
  return simular("PUT", `/consultas/${consulta.idConsulta}/status`, "JAVA", () => {
    const pode = acoesPresenca(consulta, agora());
    if (status === "REALIZADA" && !pode.presenca) falhar({ status: 409, mensagem: "A presença só pode ser registrada no dia da consulta." });
    if (status === "FALTA" && !pode.falta) falhar({ status: 409, mensagem: "A falta só pode ser registrada depois do horário da consulta." });
    return trocarConsultaNoMock({ ...consulta, dsStatus: status });
  });
}

/* ---------- Só no front (DEMONSTRAÇÃO) ---------- */

/**
 * Salva a orientação feita no celular ou no balcão (o número dela é o código que a pessoa mostra na recepção).
 */
// DEMONSTRAÇÃO: não existe na API Java
export async function salvarOrientacao(dados: Omit<Orientacao, "idOrientacao" | "dtOrientacao">): Promise<Orientacao> {
  return simular("POST", "orientação salva (só no front)", "FRONT", () => {
    const s = obterStore();
    const nova: Orientacao = { ...dados, idOrientacao: proximoId(s.obterEstado().orientacoes.map((o) => o.idOrientacao)), dtOrientacao: agora().toISOString() };
    s.atualizarEstado((e) => ({ ...e, orientacoes: [...e.orientacoes, nova] }));
    return nova;
  }, 201);
}

/** Busca a orientação pelo código digitado no balcão. Erro 404 se o código não existir. */
// DEMONSTRAÇÃO: não existe na API Java
export async function buscarOrientacao(idOrientacao: number): Promise<Orientacao> {
  return simular("GET", `orientação ${idOrientacao} (só no front)`, "FRONT", () => {
    const o = obterStore().obterEstado().orientacoes.find((x) => x.idOrientacao === idOrientacao);
    if (!o) falhar({ status: 404, mensagem: "Código não encontrado. Confira o número com o cidadão." });
    return o;
  });
}

/** Vincula ao cidadão a orientação feita sem login (balcão). Erro 409 se o código já for de outra pessoa. */
// DEMONSTRAÇÃO: não existe na API Java
export async function vincularOrientacao(idOrientacao: number, idCidadao: number): Promise<Orientacao> {
  return simular("PUT", `orientação ${idOrientacao} (só no front)`, "FRONT", () => {
    const s = obterStore();
    const o = s.obterEstado().orientacoes.find((x) => x.idOrientacao === idOrientacao);
    if (!o) falhar({ status: 404, mensagem: "Código não encontrado." });
    if (!podeVincular(o, idCidadao)) falhar({ status: 409, mensagem: "Código já utilizado." });
    const nova: Orientacao = { ...o, idCidadao };
    s.atualizarEstado((e) => ({ ...e, orientacoes: e.orientacoes.map((x) => (x.idOrientacao === idOrientacao ? nova : x)) }));
    return nova;
  });
}

/**
 * A recepção coloca o cidadão na lista do dia da UBS.
 * O cidadão vem de quem chama (busca ou cadastro no balcão, pela API ou pelo mock): com a API ligada,
 * a pessoa pode não existir no mock, então a função não o procura lá.
 * Regras: só em dia útil; a mesma pessoa não entra duas vezes.
 */
// DEMONSTRAÇÃO: não existe na API Java
export async function incluirNaListaDoDia(dados: {
  idUnidade: number; cidadao: Pick<Cidadao, "idCidadao" | "nmCidadao">; idOrientacao: number; dsCor: EntradaListaDoDia["dsCor"];
}): Promise<EntradaListaDoDia> {
  const { cidadao } = dados;
  return simular("POST", "lista do dia (só no front)", "FRONT", () => {
    const s = obterStore();
    const e = s.obterEstado();
    if (!listaDoDiaAberta(agora())) falhar({ status: 409, mensagem: MENSAGEM_LISTA_SO_DIA_UTIL });
    if (e.listaDoDia.some((x) => x.idCidadao === cidadao.idCidadao && x.status === "AGUARDANDO")) falhar({ status: 409, mensagem: "Este cidadão já está na lista do dia." });
    const entrada: EntradaListaDoDia = {
      idEntrada: proximoId(e.listaDoDia.map((x) => x.idEntrada)),
      idCidadao: cidadao.idCidadao, idOrientacao: dados.idOrientacao, idUnidade: dados.idUnidade,
      nmCidadao: cidadao.nmCidadao, dsCor: dados.dsCor, dtEntrada: agora().toISOString(),
      flPrioridade: false, flCidadao: false, status: "AGUARDANDO",
    };
    s.atualizarEstado((atual) => ({ ...atual, listaDoDia: [...atual.listaDoDia, entrada] }));
    return entrada;
  }, 201);
}

/**
 * A recepção registra que a pessoa aceitou a vaga por telefone e agenda a consulta.
 * A oferta e a entrada da lista ficam no front; o cidadão e o horário vêm de GET /cidadaos/{id}
 * e GET /unidades/{id}/horarios (da API quando ligada), para o POST /consultas usar dados do banco.
 * Regra: a oferta precisa estar pendente e dentro do prazo de 30 min.
 */
// DEMONSTRAÇÃO: não existe na API Java (o agendamento em si usa POST /consultas)
export async function aceitarOfertaPorTelefone(idOferta: number): Promise<Consulta> {
  const e = obterStore().obterEstado();
  const oferta = e.ofertas.find((o) => o.idOferta === idOferta && o.status === "PENDENTE");
  const entrada = e.listaDoDia.find((x) => x.idEntrada === oferta?.idEntrada);
  if (!oferta || segundosRestantesOferta(oferta, agora()) === 0 || !entrada || entrada.idCidadao === null) {
    falhar({ status: 409, mensagem: "Oferta indisponível." });
  }
  const [cidadao, horarios] = await Promise.all([buscarCidadao(entrada.idCidadao), listarHorarios(oferta.idUnidade)]);
  const horario = horarios.find((h) => h.idHorario === oferta.idHorario);
  if (!horario) falhar({ status: 409, mensagem: "Oferta indisponível." });
  return agendarConsulta({ horario, cidadao, idOrientacao: entrada.idOrientacao, idOferta });
}

/**
 * Ficha de saúde do cidadão (null se não tiver). Prévia – integração com o Meu SUS prevista.
 * A ficha é procurada pelo Cartão SUS, e não pelo id: com a API ligada, o id de uma conta nova
 * pode ser o mesmo de uma pessoa de exemplo, e a ficha dela apareceria para outra pessoa.
 * @param nrCns Cartão SUS de quem está logado (cadastro devolvido pela API)
 */
// DEMONSTRAÇÃO: não existe na API Java
export async function buscarFicha(nrCns: string): Promise<FichaSaude | null> {
  return simular("GET", "ficha de saúde (só no front)", "FRONT", () =>
    obterStore().obterEstado().fichas.find((f) => f.nrCns === soNumeros(nrCns)) ?? null);
}

/**
 * Salva a ficha de saúde. Regra (LGPD, dado sensível): só salva com a autorização marcada.
 */
// DEMONSTRAÇÃO: não existe na API Java
export async function salvarFicha(ficha: Omit<FichaSaude, "dtAtualizacao">): Promise<FichaSaude> {
  return simular("PUT", "ficha de saúde (só no front)", "FRONT", () => {
    if (!ficha.flConsentimento) falhar({ status: 400, mensagem: "Marque a autorização (LGPD) para salvar a ficha." });
    const nova: FichaSaude = { ...ficha, nrCns: soNumeros(ficha.nrCns), dtAtualizacao: agora().toISOString() };
    obterStore().atualizarEstado((e) => ({ ...e, fichas: [...e.fichas.filter((f) => f.nrCns !== nova.nrCns), nova] }));
    return nova;
  });
}

/** Apaga a ficha de saúde (direito de exclusão da LGPD). */
// DEMONSTRAÇÃO: não existe na API Java
export async function apagarFicha(nrCns: string): Promise<void> {
  return simular("DELETE", "ficha de saúde (só no front)", "FRONT", () => {
    obterStore().atualizarEstado((e) => ({ ...e, fichas: e.fichas.filter((f) => f.nrCns !== soNumeros(nrCns)) }));
  });
}
