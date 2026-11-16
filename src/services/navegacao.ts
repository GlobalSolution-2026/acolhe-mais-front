/**
 * Navegação do celular do cidadão (veio do protótipo, services/navegacao.ts).
 * Define para onde o botão "voltar" do topo do celular leva em cada tela.
 */

/** Começo das rotas do celular dentro do simulador. */
export const BASE_CELULAR = "/simulador/cidadao";

/** Para onde voltar depois de entrar ou criar conta, além do agendamento ("" = Perfil). */
export type DestinoLogin = "" | "ficha" | "lista-do-dia";

/** Dados que o Entrar e o Criar conta recebem na URL (?horario=&oferta=&ubs=&destino=). */
export interface RetornoLogin {
  horario: number;
  oferta: number;
  ubs: number;
  destino: DestinoLogin;
}

/** Lê os parâmetros de retorno do login da URL (valores inválidos viram 0 ou ""). */
export function lerRetornoLogin(parametros: URLSearchParams): RetornoLogin {
  const destino = parametros.get("destino");
  return {
    horario: Number(parametros.get("horario")) || 0,
    oferta: Number(parametros.get("oferta")) || 0,
    ubs: Number(parametros.get("ubs")) || 0,
    destino: destino === "ficha" || destino === "lista-do-dia" ? destino : "",
  };
}

/** Monta a query string do retorno (só com o que foi preenchido). */
export function queryRetorno(r: Partial<RetornoLogin>): string {
  const p = new URLSearchParams();
  if (r.horario) p.set("horario", String(r.horario));
  if (r.oferta) p.set("oferta", String(r.oferta));
  if (r.ubs) p.set("ubs", String(r.ubs));
  if (r.destino) p.set("destino", r.destino);
  const texto = p.toString();
  return texto ? `?${texto}` : "";
}

/**
 * Para onde ir depois do login: agendamento (se veio dele) > ficha > lista do dia > perfil.
 * Veio do protótipo (destinoAposLogin).
 */
export function destinoAposLogin(r: RetornoLogin): string {
  if (r.horario) return `${BASE_CELULAR}/agendar${queryRetorno({ horario: r.horario, oferta: r.oferta, ubs: r.ubs })}`;
  if (r.destino === "ficha") return `${BASE_CELULAR}/perfil/ficha`;
  if (r.destino === "lista-do-dia") return `${BASE_CELULAR}/lista-do-dia`;
  return `${BASE_CELULAR}/perfil`;
}

/**
 * Tela "pai" de cada tela do celular (destino do botão voltar).
 * @param pathname rota atual (ex.: /simulador/cidadao/agendar)
 * @param idUnidade UBS do horário escolhido (o agendamento volta para os horários dela)
 * @returns a rota de volta, ou null quando a tela não tem voltar (Início, Consultas, Avisos, Perfil)
 */
export function rotaPai(pathname: string, idUnidade?: number): string | null {
  const caminho = pathname.replace(/\/$/, "");
  const tela = caminho.startsWith(BASE_CELULAR) ? caminho.slice(BASE_CELULAR.length) : caminho;
  switch (tela) {
    case "/orientacao":
    case "/resultado":
    case "/emergencia":
      return `${BASE_CELULAR}/inicio`;
    case "/ubs":
      return `${BASE_CELULAR}/resultado`;
    case "/agendar":
      return idUnidade ? `${BASE_CELULAR}/ubs/${idUnidade}` : `${BASE_CELULAR}/ubs`;
    case "/sucesso":
      return `${BASE_CELULAR}/consultas`;
    case "/lista-do-dia":
      return `${BASE_CELULAR}/ubs`;
    case "/perfil/editar":
    case "/perfil/ficha":
    case "/entrar":
    case "/criar-conta":
      return `${BASE_CELULAR}/perfil`;
    default:
      // /ubs/{idUnidade} volta para a lista de UBS
      return /^\/ubs\/[^/]+$/.test(tela) ? `${BASE_CELULAR}/ubs` : null;
  }
}
