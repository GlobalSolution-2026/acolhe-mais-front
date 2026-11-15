/**
 * Navegação do celular do cidadão (veio do protótipo, services/navegacao.ts).
 * Define para onde o botão "voltar" do topo do celular leva em cada tela.
 */

/** Começo das rotas do celular dentro do simulador. */
export const BASE_CELULAR = "/simulador/cidadao";

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
