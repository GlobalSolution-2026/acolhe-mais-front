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
