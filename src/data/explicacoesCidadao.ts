/**
 * Textos do painel de explicação da aba Cidadão, um por tela do celular.
 * A aba escolhe o texto pela rota aberta (ex.: "inicio", "emergencia"); telas sem texto próprio usam o geral.
 */
import type { EndpointExplicado } from "../components/PainelExplicacao";

/** Conteúdo do PainelExplicacao de uma tela. */
export interface ExplicacaoTela {
  titulo: string;
  oQueFaz: string;
  regras: string[];
  endpoints: EndpointExplicado[];
}

/** Explicação geral do celular (telas ainda em construção). */
export const EXPLICACAO_CIDADAO: ExplicacaoTela = {
  titulo: "Cidadão",
  oQueFaz:
    "Simula o celular de quem usa o Acolhe+: responde perguntas sobre a queixa, recebe uma cor e um destino (SAMU, pronto-socorro, UPA ou UBS) e, nos casos verde e azul, agenda na UBS.",
  regras: [
    "A plataforma orienta, não faz diagnóstico.",
    "A verificação de urgência (IA) só pode elevar a cor, nunca baixar.",
    "Agendamento só em dias úteis, sem feriados nacionais.",
    "Nome, Cartão SUS, nascimento e sexo não mudam pelo app (RF27).",
  ],
  endpoints: [
    { metodo: "GET", rota: "/unidades", api: "JAVA" },
    { metodo: "GET", rota: "/unidades/{id}/horarios", api: "JAVA" },
    { metodo: "POST", rota: "/cidadaos", api: "JAVA" },
    { metodo: "POST", rota: "/cidadaos/login", api: "JAVA" },
    { metodo: "PUT", rota: "/cidadaos/{id}", api: "JAVA" },
    { metodo: "POST", rota: "/consultas", api: "JAVA" },
    { metodo: "PUT", rota: "/consultas/{id}/status", api: "JAVA" },
    { metodo: "POST", rota: "/verificar-urgencia", api: "FLASK" },
    { metodo: "POST", rota: "/prever-falta", api: "FLASK" },
    { metodo: "GET", rota: "/ws/{cep}/json/", api: "VIACEP" },
  ],
};

/** Explicações por tela do celular (chave = trecho da rota depois de /simulador/cidadao/). */
export const EXPLICACOES_TELAS: Record<string, ExplicacaoTela> = {
  inicio: {
    titulo: "Cidadão · Início",
    oQueFaz:
      "A pessoa informa o CEP e escolhe o que está sentindo entre 5 queixas. O ViaCEP completa o endereço, que depois aparece no roteiro da ligação para o SAMU e ajuda a achar a UPA e as UBS mais próximas.",
    regras: [
      "A orientação e a Emergência não pedem login.",
      "O CEP tem 8 números; o endereço do ViaCEP é só um complemento.",
      "Se o ViaCEP falhar ou não achar o CEP, a pessoa segue só com o CEP (a orientação nunca trava).",
      "Para emergência, o botão vermelho da barra leva direto ao SAMU 192, em qualquer tela.",
    ],
    endpoints: [{ metodo: "GET", rota: "/ws/{cep}/json/", api: "VIACEP" }],
  },
  orientacao: {
    titulo: "Cidadão · Orientação",
    oQueFaz:
      "Faz as perguntas uma por vez, começando pelo perfil (para quem é, idade, sexo, gestação) e pela dor de 0 a 10. As perguntas são inspiradas no Protocolo de Manchester, que classifica o atendimento por cores conforme a gravidade.",
    regras: [
      "A plataforma orienta, não faz diagnóstico.",
      "Os alarmes são conferidos do mais grave para o mais leve: o primeiro que bate define a cor e encerra as perguntas.",
      "\"Não sei\" vale como o pior caso (com poucas exceções).",
      "Só para maiores de 18 anos; dor de garganta com tosse ou coriza segue o fluxo de síndrome gripal.",
      "Com login e \"Para mim\", idade, sexo e doenças da ficha não são perguntados de novo (a tela avisa o que foi usado).",
    ],
    endpoints: [],
  },
  resultado: {
    titulo: "Cidadão · Resultado",
    oQueFaz:
      "Mostra a cor e o destino: vermelho → SAMU 192; laranja → pronto-socorro; amarelo → UPA mais próxima; verde e azul → UBS. Antes de mostrar verde ou azul, o Modelo 2 de IA confere se o caso pode ser urgente.",
    regras: [
      "Cores inspiradas no Protocolo de Manchester: vermelho (emergência), laranja (muito urgente), amarelo (urgente), verde e azul (pouco ou não urgente).",
      "O Modelo 2 só pode ELEVAR a cor (verde/azul → amarelo), nunca baixar. Quando eleva, a tela avisa.",
      "Se a API de IA falhar, a orientação segue com a cor das regras e mostra um aviso discreto (não pode travar).",
      "UPA e UBS indicadas pelo CEP (os 3 primeiros números indicam a região).",
      "O código da orientação vale só no dia, para mostrar na recepção da UBS.",
    ],
    endpoints: [
      { metodo: "POST", rota: "/verificar-urgencia", api: "FLASK" },
      { metodo: "GET", rota: "/unidades", api: "JAVA" },
      { metodo: "POST", rota: "orientação salva", api: "FRONT" },
    ],
  },
  emergencia: {
    titulo: "Cidadão · Emergência",
    oQueFaz:
      "Mostra o SAMU 192 com o botão de ligar e o roteiro do que falar na ligação (endereço, ponto de referência e o que está acontecendo). Quem está logado e tem ficha de saúde vê a ficha de emergência para mostrar ao socorro.",
    regras: [
      "Não pede login: em emergência, nenhum passo pode atrasar a ligação.",
      "O endereço vem do CEP informado no Início, quando houver.",
      "A ficha de saúde é uma prévia da integração com o Meu SUS (sempre demonstração).",
    ],
    endpoints: [],
  },
};

/**
 * Escolhe a explicação da tela aberta.
 * @param tela trecho da rota depois de /simulador/cidadao/ (ex.: "inicio")
 */
export function explicacaoDaTela(tela: string): ExplicacaoTela {
  return EXPLICACOES_TELAS[tela] ?? EXPLICACAO_CIDADAO;
}
