/**
 * Lista única dos endpoints que o simulador chama, agrupados por controller, com as telas que chamam cada um
 * (mesmo formato do simulador do Lobo-guará). É a fonte da tabela da aba Status das APIs e do bloco
 * "Endpoints desta tela" do PainelExplicacao. Todos os da API Java já existem (branch main).
 *
 * Chave da tela = rota dentro de /simulador:
 * - Cidadão: "cidadao/" + a chave de explicacoesCidadao.ts (ex.: "cidadao/inicio", "cidadao/ubs/:idUnidade");
 * - Recepção: "recepcao/" + a chave de explicacoesRecepcao.ts (ex.: "recepcao/agenda");
 * - "ia-risco-falta", "ia-urgencia" e "status".
 * O prefixo separa telas com o mesmo nome nas duas abas (ex.: lista do dia do cidadão e da recepção).
 */
import type { MetodoHttp, NomeApi } from "../types";

/** Um endpoint na lista. */
export interface EndpointDocumentado {
  metodo: MetodoHttp;
  rota: string;
  /** O que o endpoint faz no simulador, em uma frase curta. */
  descricao: string;
  /** Telas do simulador que chamam este endpoint (chaves descritas no topo do arquivo). */
  telas: string[];
}

/** Um grupo da tabela (controller da API Java, API Flask, ViaCEP ou "Só no front"). */
export interface GrupoEndpoints {
  nome: string;
  api: NomeApi;
  endpoints: EndpointDocumentado[];
}

/** Endpoint com a API dele, como o PainelExplicacao mostra. */
export type EndpointDaTela = EndpointDocumentado & { api: NomeApi };

/** Abas internas da Recepção: todas chamam GET /unidades para montar o seletor de UBS. */
const TELAS_RECEPCAO = ["recepcao/agenda", "recepcao/balcao", "recepcao/pendentes", "recepcao/lista-do-dia", "recepcao/indicadores"];

export const GRUPOS_ENDPOINTS: GrupoEndpoints[] = [
  {
    nome: "Unidade",
    api: "JAVA",
    endpoints: [
      {
        metodo: "GET", rota: "/unidades",
        descricao: "Lista as unidades: UBS próximas, UPA indicada e seletor de UBS da recepção (o filtro UBS/UPA é no front).",
        telas: ["cidadao/resultado", "cidadao/ubs", ...TELAS_RECEPCAO, "status"],
      },
      {
        metodo: "GET", rota: "/unidades/{id}",
        descricao: "Busca a UBS escolhida, para o nome no topo dos horários e no Agendar (404 se não existir).",
        telas: ["cidadao/ubs/:idUnidade", "cidadao/agendar"],
      },
    ],
  },
  {
    nome: "Horário",
    api: "JAVA",
    endpoints: [
      {
        metodo: "GET", rota: "/unidades/{id}/horarios",
        descricao: "Lista os horários da UBS, com flOcupado (livre ou ocupado).",
        telas: ["cidadao/ubs/:idUnidade", "cidadao/agendar", "recepcao/agenda", "recepcao/balcao", "recepcao/pendentes", "recepcao/lista-do-dia", "recepcao/indicadores"],
      },
    ],
  },
  {
    nome: "Cidadão",
    api: "JAVA",
    endpoints: [
      {
        metodo: "POST", rota: "/cidadaos",
        descricao: "Cadastra: conta com senha (Criar conta) ou cadastro sem senha no balcão. RN21: conta com o CNS de um cadastro do balcão completa esse cadastro; 409 se o Cartão SUS já tem conta.",
        telas: ["cidadao/criar-conta", "recepcao/agenda", "recepcao/balcao"],
      },
      {
        metodo: "GET", rota: "/cidadaos/{id}",
        descricao: "Busca o cadastro de quem está logado (ou de quem aceitou a vaga por telefone).",
        telas: ["cidadao/ubs/:idUnidade", "cidadao/agendar", "cidadao/perfil", "cidadao/perfil/editar", "recepcao/lista-do-dia"],
      },
      {
        metodo: "GET", rota: "/cidadaos?cns={nrCns}",
        descricao: "Busca pelo Cartão SUS; 404 quer dizer sem cadastro, e o balcão oferece cadastrar.",
        telas: ["recepcao/agenda", "recepcao/balcao"],
      },
      {
        metodo: "PUT", rota: "/cidadaos/{id}",
        descricao: "Atualiza só celular, contato de recado e CEP (RF27: identificação só na recepção).",
        telas: ["cidadao/agendar", "cidadao/perfil/editar", "recepcao/balcao"],
      },
    ],
  },
  {
    nome: "Consulta",
    api: "JAVA",
    endpoints: [
      {
        metodo: "GET", rota: "/consultas",
        descricao: "Lista as consultas; o front filtra por cidadão ou por UBS (também alimenta a previsão de falta ao agendar).",
        telas: ["cidadao/agendar", "cidadao/consultas", "cidadao/avisos", "recepcao/agenda", "recepcao/balcao", "recepcao/pendentes", "recepcao/lista-do-dia", "recepcao/indicadores"],
      },
      {
        metodo: "POST", rota: "/consultas",
        descricao: "Agenda no horário escolhido, com o risco de falta; 409 se o horário acabou de ser ocupado.",
        telas: ["cidadao/agendar", "recepcao/agenda", "recepcao/balcao", "recepcao/lista-do-dia"],
      },
      {
        metodo: "PUT", rota: "/consultas/{id}/status",
        descricao: "Muda o status: confirmar, cancelar (LIBERADA), presença (REALIZADA) ou falta (FALTA).",
        telas: ["cidadao/consultas", "cidadao/avisos", "recepcao/agenda", "recepcao/pendentes"],
      },
    ],
  },
  {
    nome: "Auth",
    api: "JAVA",
    endpoints: [
      {
        metodo: "POST", rota: "/cidadaos/login",
        descricao: "Entra com Cartão SUS e senha; 401 se não confere ou se o cadastro não tem senha.",
        telas: ["cidadao/entrar"],
      },
    ],
  },
  {
    nome: "IA (Flask)",
    api: "FLASK",
    endpoints: [
      { metodo: "GET", rota: "/status", descricao: "Confere se a API de IA está no ar e quais modelos estão carregados.", telas: ["status"] },
      {
        metodo: "POST", rota: "/prever-falta",
        descricao: "Modelo 1: pontuação de risco de falta (0 a 1) e risco alto/baixo, gravados na consulta ao agendar (risco ALTO a partir de 0,60).",
        telas: ["cidadao/agendar", "recepcao/agenda", "recepcao/balcao", "recepcao/lista-do-dia", "ia-risco-falta"],
      },
      {
        metodo: "POST", rota: "/verificar-urgencia",
        descricao: "Modelo 2: pontuação de urgência (0 a 1) e se o caso verde ou azul é urgente (limiar 0,30); só eleva a cor.",
        telas: ["cidadao/resultado", "recepcao/balcao", "ia-urgencia"],
      },
    ],
  },
  {
    nome: "ViaCEP",
    api: "VIACEP",
    endpoints: [
      {
        metodo: "GET", rota: "/ws/{cep}/json/",
        descricao: "Completa o endereço pelo CEP; se falhar, a pessoa segue só com o CEP.",
        telas: ["cidadao/inicio", "status"],
      },
    ],
  },
  {
    // DEMONSTRAÇÃO: não existe na API Java. Ficam aqui para mostrar o que ainda não usa a API.
    nome: "Só no front (demonstração)",
    api: "FRONT",
    endpoints: [
      {
        metodo: "POST", rota: "orientação salva",
        descricao: "Guarda a orientação e gera o código que a pessoa mostra na recepção.",
        telas: ["cidadao/resultado", "recepcao/balcao"],
      },
      {
        metodo: "GET", rota: "orientação pelo código",
        descricao: "Recupera no balcão a orientação feita no app (código válido só no dia).",
        telas: ["recepcao/balcao"],
      },
      {
        metodo: "PUT", rota: "vincular orientação",
        descricao: "Liga ao cadastro a orientação feita sem login.",
        telas: ["recepcao/balcao"],
      },
      {
        metodo: "GET", rota: "lista do dia",
        descricao: "Fila de quem foi à UBS sem horário, na ordem de prioridade.",
        telas: ["cidadao/lista-do-dia", "recepcao/lista-do-dia"],
      },
      {
        metodo: "POST", rota: "lista do dia",
        descricao: "Coloca a pessoa na fila (só verde ou azul, só em dia útil).",
        telas: ["cidadao/ubs/:idUnidade", "recepcao/balcao"],
      },
      {
        metodo: "GET", rota: "ofertas de vaga",
        descricao: "Ofertas de vaga liberada, com 30 minutos para aceitar.",
        telas: ["cidadao/avisos", "recepcao/lista-do-dia"],
      },
      {
        metodo: "PUT", rota: "ofertas de vaga",
        descricao: "Aceita, recusa ou repassa a oferta ao próximo da fila.",
        telas: ["cidadao/avisos", "cidadao/agendar", "recepcao/lista-do-dia"],
      },
      {
        metodo: "GET", rota: "ficha de saúde",
        descricao: "Prévia da ficha de saúde (integração com o Meu SUS prevista).",
        telas: ["cidadao/perfil", "cidadao/perfil/ficha"],
      },
      {
        metodo: "PUT", rota: "ficha de saúde",
        descricao: "Salva a ficha, só com a autorização da LGPD marcada.",
        telas: ["cidadao/perfil/ficha"],
      },
      {
        metodo: "DELETE", rota: "ficha de saúde",
        descricao: "Apaga a ficha (direito de exclusão da LGPD).",
        telas: ["cidadao/perfil/ficha"],
      },
    ],
  },
];

/**
 * Endpoints chamados por uma tela, na ordem da lista (API Java, Flask, ViaCEP e, por último, só no front).
 * @param tela chave da tela (ex.: "cidadao/agendar", "recepcao/balcao", "ia-urgencia")
 */
export function endpointsDaTela(tela: string): EndpointDaTela[] {
  return GRUPOS_ENDPOINTS.flatMap((grupo) =>
    grupo.endpoints.filter((e) => e.telas.includes(tela)).map((e) => ({ ...e, api: grupo.api })),
  );
}
