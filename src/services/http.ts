/**
 * Base de todas as chamadas do front (API Java, API Flask e ViaCEP).
 *
 * - requisitar(): chama o fetch real, mede o tempo, registra no painel de requisições
 *   (aba Status das APIs) e, se a resposta não for ok, lê a mensagem de erro (ErroDTO da Java ou { erro } da Flask) e lança o erro.
 *   Assim a página só precisa mostrar a mensagem.
 * - simular(): o mesmo para o modo demonstração (quando a variável de ambiente está vazia):
 *   espera 400 ms para imitar a rede, executa a função do mock e registra a chamada como "demonstração".
 *
 * Fica num arquivo separado porque api.ts (Java) e ia.ts (Flask) usam as duas funções,
 * e o agendamento em api.ts também chama a previsão de falta de ia.ts.
 */
import type { ErroDTO, MetodoHttp, NomeApi, Requisicao } from "../types";

/** Erro de API com o código HTTP (ex.: 409 horário ocupado), para a tela decidir o que mostrar. */
export class ErroApi extends Error {
  status: number;

  constructor(mensagem: string, status: number) {
    super(mensagem);
    this.name = "ErroApi";
    this.status = status;
  }
}

/** Lança um ErroApi no formato do ErroDTO da API Java (usado pelos mocks). */
export function falhar(erro: ErroDTO): never {
  throw new ErroApi(erro.mensagem, erro.status);
}

/** Espera alguns milissegundos (simula o tempo de rede no modo demonstração). */
export function esperar(ms = 400): Promise<void> {
  return new Promise((resolver) => setTimeout(resolver, ms));
}

/* ---------- Ligação com o painel de requisições ---------- */

type DadosRequisicao = Omit<Requisicao, "id" | "dtRequisicao">;
let registrarNoPainel: ((dados: DadosRequisicao) => void) | null = null;

/**
 * Liga o serviço ao RequisicoesContext: toda chamada passa a aparecer no painel.
 * Chamado pelo RequisicoesProvider.
 */
export function conectarPainelRequisicoes(registrar: ((dados: DadosRequisicao) => void) | null): void {
  registrarNoPainel = registrar;
}

/** Registra a chamada no painel (se o painel estiver montado). */
function registrar(dados: DadosRequisicao): void {
  registrarNoPainel?.(dados);
}

/** Tira o domínio da URL para o painel mostrar só a rota (ex.: /unidades/1/horarios). */
function rotaDaUrl(url: string): string {
  try {
    const u = new URL(url);
    return u.pathname + u.search;
  } catch {
    return url;
  }
}

/**
 * Faz uma chamada real com a Fetch API.
 * @param url endereço completo (ex.: `${API_URL}/unidades`)
 * @param api qual API é (para o painel de requisições)
 * @param opcoes método e corpo; com corpo, o Content-Type JSON é colocado aqui
 * @returns a Response já conferida (resposta.ok)
 * @throws ErroApi com a mensagem do ErroDTO; TypeError quando não há conexão
 */
export async function requisitar(url: string, api: NomeApi, opcoes: RequestInit = {}): Promise<Response> {
  const metodo = (opcoes.method ?? "GET").toUpperCase() as MetodoHttp;
  const rota = rotaDaUrl(url);
  const inicio = performance.now();
  // Só manda Content-Type quando há corpo: num GET ele faria o navegador pedir permissão (CORS) antes.
  const headers = opcoes.body ? { "Content-Type": "application/json", ...opcoes.headers } : opcoes.headers;

  let resposta: Response;
  try {
    resposta = await fetch(url, { ...opcoes, headers });
  } catch (erro) {
    // Sem resposta (API fora do ar, sem internet ou CORS): status null no painel.
    registrar({ metodo, rota, api, status: null, tempoMs: Math.round(performance.now() - inicio), demonstracao: false });
    throw erro;
  }

  registrar({ metodo, rota, api, status: resposta.status, tempoMs: Math.round(performance.now() - inicio), demonstracao: false });

  if (!resposta.ok) {
    // A API Java devolve o ErroDTO { status, mensagem } e a API Flask devolve { erro }.
    // Se o corpo não tiver nenhum dos dois (ou não for JSON), usa uma mensagem genérica.
    const corpo = (await resposta.json().catch(() => null)) as (Partial<ErroDTO> & { erro?: string }) | null;
    throw new ErroApi(corpo?.mensagem ?? corpo?.erro ?? `Erro ${resposta.status} ao chamar ${rota}.`, resposta.status);
  }
  return resposta;
}

/**
 * Executa uma chamada no modo demonstração (sem API): espera, roda o mock e registra no painel.
 * @param metodo e rota: o endpoint planejado que este mock imita
 * @param executar função que lê/altera o estado do mock e devolve a resposta
 * @param statusSucesso código mostrado no painel quando dá certo (201 nos POST que criam)
 */
export async function simular<T>(
  metodo: MetodoHttp,
  rota: string,
  api: NomeApi,
  executar: () => T | Promise<T>,
  statusSucesso = 200,
): Promise<T> {
  const inicio = performance.now();
  await esperar();
  try {
    const resultado = await executar();
    registrar({ metodo, rota, api, status: statusSucesso, tempoMs: Math.round(performance.now() - inicio), demonstracao: true });
    return resultado;
  } catch (erro) {
    const status = erro instanceof ErroApi ? erro.status : 500;
    registrar({ metodo, rota, api, status, tempoMs: Math.round(performance.now() - inicio), demonstracao: true });
    throw erro;
  }
}
