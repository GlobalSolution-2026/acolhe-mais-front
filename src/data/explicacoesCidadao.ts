/**
 * Textos do painel de explicação da aba Cidadão, um por tela do celular.
 * A aba escolhe o texto pela rota aberta (ex.: "inicio", "emergencia"); telas sem texto próprio usam o geral.
 * Os endpoints de cada tela não ficam aqui: vêm da lista única em data/endpointsApi.ts (endpointsDaTela).
 */

/** Conteúdo do PainelExplicacao de uma tela. */
export interface ExplicacaoTela {
  titulo: string;
  oQueFaz: string;
  regras: string[];
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
};

/** Explicações por tela do celular (chave = trecho da rota depois de /simulador/cidadao/). */
export const EXPLICACOES_TELAS: Record<string, ExplicacaoTela> = {
  inicio: {
    titulo: "Cidadão · Início",
    oQueFaz:
      "A pessoa pode informar o CEP (opcional) e escolhe o que está sentindo entre 5 queixas. O ViaCEP completa o endereço, que depois aparece no roteiro da ligação para o SAMU e ajuda a achar a UPA e as UBS mais próximas.",
    regras: [
      "A orientação e a Emergência não pedem login.",
      "O CEP é opcional, para a orientação nunca travar (pode ser urgência). Se for digitado, precisa ter 8 números; o endereço do ViaCEP é só um complemento.",
      "Se o ViaCEP falhar ou não achar o CEP, a pessoa segue só com o CEP (a orientação nunca trava).",
      "Para emergência, o botão vermelho da barra leva direto ao SAMU 192, em qualquer tela.",
      "A legenda \"O que significam as cores?\" explica cada cor com número (1 = mais grave, 5 = menos grave), significado e destino.",
    ],
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
      "Idade e sexo vêm do cadastro que a API devolveu no login (guardado na sessão), nunca dos dados de exemplo.",
    ],
  },
  resultado: {
    titulo: "Cidadão · Resultado",
    oQueFaz:
      "Mostra a cor e o destino: vermelho → SAMU 192; laranja → pronto-socorro; amarelo → UPA mais próxima; verde e azul → UBS. Antes de mostrar verde ou azul, o Modelo 2 de IA confere se o caso pode ser urgente.",
    regras: [
      "Cores inspiradas no Protocolo de Manchester: vermelho (emergência), laranja (muito urgente), amarelo (urgente), verde e azul (pouco ou não urgente).",
      "Acessibilidade (WCAG 1.4.1): a cor nunca aparece sozinha. O selo mostra o número do nível (1 a 5) e o nome, e a legenda marca o resultado da pessoa.",
      "O Modelo 2 só pode ELEVAR a cor (verde/azul → amarelo), nunca baixar. Quando eleva, a tela avisa.",
      "Se a API de IA falhar, a orientação segue com a cor das regras e mostra um aviso discreto (não pode travar).",
      "UPA e UBS indicadas pelo CEP (os 3 primeiros números indicam a região).",
      "Sem CEP, a tela não indica a unidade “mais próxima” (seria um palpite): mostra a orientação e, depois, um campo para informar o CEP. No vermelho, o roteiro da ligação pede a rua e o bairro.",
      "O código da orientação vale só no dia, para mostrar na recepção da UBS.",
    ],
  },
  ubs: {
    titulo: "Cidadão · UBS próximas",
    oQueFaz:
      "Lista as UBS em ordem de proximidade pelo CEP do Início (ou do cadastro, com login). Cada UBS leva aos horários livres dela.",
    regras: [
      "A ordem usa os 3 primeiros números do CEP (região): mesma região primeiro.",
      "Sem nenhum CEP, a lista aparece sem ordem de distância e a tela pede o CEP para ordenar.",
      "A API devolve todas as unidades; o filtro UBS é feito no front.",
    ],
  },
  "ubs/:idUnidade": {
    titulo: "Cidadão · Horários da UBS",
    oQueFaz:
      "Mostra os horários livres da UBS por dia (rota com parâmetro: o id da UBS vem da URL). Escolher um horário leva ao Agendar. Sem horário livre, quem fez a orientação (verde ou azul) pode entrar na lista do dia.",
    regras: [
      "Agenda só em dias úteis, sem feriados nacionais, e só horários que ainda não passaram.",
      "Lista do dia: só para verde/azul e só em dia útil (demonstração: não existe na API Java).",
      "Uma consulta ativa por dia: com login, o dia em que a pessoa já tem consulta mostra o aviso “Você já tem consulta neste dia”.",
      "Mostra “Procure a urgência se...” com os sinais de piora da queixa.",
    ],
  },
  entrar: {
    titulo: "Cidadão · Entrar",
    oQueFaz:
      "Login com Cartão SUS (15 números) e senha. Depois de entrar, volta para onde a pessoa estava: agendamento, ficha, lista do dia ou perfil.",
    regras: [
      "A orientação e a Emergência não pedem login; agendar e ver consultas, sim.",
      "Mesma mensagem para Cartão SUS ou senha errados (não revela quem tem conta).",
      "Cadastro feito no balcão (sem senha) não entra: precisa criar a conta (RN21).",
      "Depois de entrar, o app guarda o cadastro devolvido pela API e o atualiza a cada consulta ou alteração do cadastro.",
      "“Entrar com gov.br” fica desativado até a adesão do município.",
    ],
  },
  "criar-conta": {
    titulo: "Cidadão · Criar conta",
    oQueFaz: "Cadastro com os dados do Cartão SUS, celular, contato de recado e senha. A pessoa já fica logada.",
    regras: [
      "Cartão SUS com 15 números, celular com DDD, nascimento no passado e senha com pelo menos 6 caracteres.",
      "RN21: quem foi cadastrado no balcão cria a conta com o mesmo Cartão SUS e mantém as consultas.",
      "Se o Cartão SUS já tem conta com senha, erro 409 e a tela pede para usar Entrar.",
    ],
  },
  agendar: {
    titulo: "Cidadão · Agendar",
    oQueFaz:
      "Confirma o horário escolhido. A pessoa confere o celular e o contato de recado; ao agendar, o Modelo 1 de IA calcula o risco de falta, que é gravado na consulta.",
    regras: [
      "RF27: nome, Cartão SUS, nascimento e sexo só para leitura (corrigir na recepção).",
      "409: se outra pessoa pegou o horário, a tela avisa e oferece escolher outro.",
      "Uma consulta ativa (agendada ou confirmada) por pessoa por dia, em qualquer UBS; canceladas, faltas e realizadas não contam. Regra só no front: a API Java ainda não valida.",
      "Risco ALTO a partir de 0,60. Se a API de IA falhar, a consulta fica com risco ALTO (o lado mais cuidadoso).",
    ],
  },
  sucesso: {
    titulo: "Cidadão · Consulta marcada",
    oQueFaz: "Mostra a UBS, a data e a hora e explica quando a confirmação de presença será pedida.",
    regras: [
      "Risco BAIXO: pedido de confirmação 2 dias úteis antes.",
      "Risco ALTO: 3 dias úteis antes, com lembrete adicional.",
      "Prazo final: 1 dia útil antes; quem não confirma tem o horário liberado para a lista do dia.",
    ],
  },
  "lista-do-dia": {
    titulo: "Cidadão · Lista do dia",
    oQueFaz: "Mostra a posição na fila de quem foi à UBS sem horário e espera uma vaga liberada por falta ou cancelamento.",
    regras: [
      "Ordem: quem ficou do dia anterior (prioridade), depois verde antes de azul, depois ordem de chegada.",
      "A entrada é buscada pela conta logada; a feita sem login passa para a conta ao entrar.",
      "Demonstração: a lista do dia ainda não existe na API Java.",
    ],
  },
  consultas: {
    titulo: "Cidadão · Minhas consultas",
    oQueFaz: "Lista as consultas de quem está logado, com o prazo de confirmação, “Confirmar presença” e “Não vou poder ir”.",
    regras: [
      "Confirmar só na janela: de 2 (ou 3, risco ALTO) dias úteis antes até 1 dia útil antes.",
      "“Não vou poder ir” libera o horário (status LIBERADA) para a lista do dia.",
      "Só cancela consulta agendada ou confirmada que ainda não aconteceu.",
    ],
  },
  avisos: {
    titulo: "Cidadão · Avisos",
    oQueFaz: "Mostra os pedidos de confirmação das consultas e as ofertas de vaga da lista do dia, com o tempo para aceitar.",
    regras: [
      "A oferta vale 30 minutos (na demonstração, cada minuto dura 10 segundos).",
      "Recusada ou vencida, a vaga vai para o próximo da fila.",
      "O sino do topo conta os pedidos de confirmação e as ofertas.",
    ],
  },
  perfil: {
    titulo: "Cidadão · Perfil",
    oQueFaz: "Mostra o cadastro de quem está logado, a ficha de saúde (prévia) e o botão Sair.",
    regras: [
      "Sem login, convida a entrar ou criar conta (a orientação funciona sem conta).",
      "A ficha de saúde é uma prévia da integração com o Meu SUS (demonstração).",
    ],
  },
  "perfil/editar": {
    titulo: "Cidadão · Editar perfil",
    oQueFaz: "A pessoa atualiza celular, contato de recado e CEP.",
    regras: [
      "RF27: nome, Cartão SUS, nascimento e sexo só para leitura; para corrigir, procurar a recepção da UBS.",
      "O PUT leva só os campos editáveis (CidadaoAtualizacaoDTO da API Java).",
    ],
  },
  "perfil/ficha": {
    titulo: "Cidadão · Ficha de saúde",
    oQueFaz:
      "Ficha opcional com doenças de base, remédios de uso contínuo, alergias e tipo sanguíneo. Aparece na Emergência e evita perguntas repetidas na orientação.",
    regras: [
      "Dado sensível (LGPD, art. 11): só salva com a autorização marcada, e a pessoa pode apagar.",
      "Prévia da integração com o Meu SUS: fica só no front (demonstração).",
      "A ficha fica ligada ao Cartão SUS (único por pessoa), e não ao id: assim nunca aparece para outra conta.",
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
  },
};

/**
 * Chave da tela do celular: "ubs/3" vira a rota com parâmetro "ubs/:idUnidade".
 * @param tela trecho da rota depois de /simulador/cidadao/ (ex.: "inicio", "ubs/3")
 */
export function chaveTelaCidadao(tela: string): string {
  return /^ubs\/[^/]+$/.test(tela) ? "ubs/:idUnidade" : tela;
}

/**
 * Escolhe a explicação da tela aberta.
 * @param tela trecho da rota depois de /simulador/cidadao/ (ex.: "inicio")
 */
export function explicacaoDaTela(tela: string): ExplicacaoTela {
  return EXPLICACOES_TELAS[chaveTelaCidadao(tela)] ?? EXPLICACAO_CIDADAO;
}
