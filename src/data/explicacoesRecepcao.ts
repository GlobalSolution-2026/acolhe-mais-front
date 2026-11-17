/**
 * Textos do painel de explicação da aba Recepção UBS, um por aba interna.
 * A aba escolhe o texto pela rota aberta (ex.: "agenda", "pendentes").
 */
import type { ExplicacaoTela } from "./explicacoesCidadao";

/** Explicações por aba interna da recepção (chave = trecho da rota depois de /simulador/recepcao/). */
const EXPLICACOES: Record<string, ExplicacaoTela> = {
  agenda: {
    titulo: "Recepção · Agenda do dia",
    oQueFaz:
      "Mostra os horários da UBS no dia escolhido, com quem está marcado, o risco de falta (Modelo 1) e os botões de presença e falta. Também permite agendar na hora para quem chegou sem celular.",
    regras: [
      "Presença só no dia da consulta; falta só depois do horário.",
      "Risco ALTO a partir de 60% de probabilidade de falta.",
      "Selo \"Fez orientação hoje\": lembra a equipe de que a pessoa procurou ajuda pelo app.",
      "Quem chega sem celular é cadastrado no balcão (sem senha) e pode criar a conta depois (RN21).",
    ],
    endpoints: [
      { metodo: "GET", rota: "/unidades/{id}/horarios", api: "JAVA" },
      { metodo: "GET", rota: "/consultas", api: "JAVA" },
      { metodo: "PUT", rota: "/consultas/{id}/status", api: "JAVA" },
      { metodo: "POST", rota: "/cidadaos", api: "JAVA" },
      { metodo: "POST", rota: "/consultas", api: "JAVA" },
    ],
  },
  balcao: {
    titulo: "Recepção · Balcão",
    oQueFaz:
      "Atende quem chega à UBS: pelo código da orientação feita no app ou fazendo a orientação ali mesmo. Verde ou azul segue para o agendamento ou para a lista do dia; vermelho, laranja e amarelo são encaminhados.",
    regras: [
      "O código vale só no dia da orientação e só uma vez (código já usado ou de outra pessoa é bloqueado).",
      "Busca o cidadão pelo Cartão SUS; sem cadastro, cadastra sem senha.",
      "Sem horário livre, a pessoa entra na lista do dia (só em dia útil).",
      "A orientação no balcão usa as mesmas regras e a mesma verificação de IA do app (só eleva).",
    ],
    endpoints: [
      { metodo: "GET", rota: "/cidadaos?cns={nrCns}", api: "JAVA" },
      { metodo: "POST", rota: "/cidadaos", api: "JAVA" },
      { metodo: "PUT", rota: "/cidadaos/{id}", api: "JAVA" },
      { metodo: "GET", rota: "/unidades/{id}/horarios", api: "JAVA" },
      { metodo: "POST", rota: "/consultas", api: "JAVA" },
      { metodo: "POST", rota: "/verificar-urgencia", api: "FLASK" },
      { metodo: "GET", rota: "orientação pelo código", api: "FRONT" },
      { metodo: "POST", rota: "lista do dia", api: "FRONT" },
    ],
  },
  pendentes: {
    titulo: "Recepção · Pendentes",
    oQueFaz:
      "Lista as consultas que precisam de confirmação, com o risco de falta, o prazo e os contatos. A recepção registra a confirmação por telefone ou presencial, ou o cancelamento.",
    regras: [
      "Ordem: prazo vencido sem contato primeiro; depois risco ALTO; depois o prazo mais próximo.",
      "Risco BAIXO: pedido 2 dias úteis antes; ALTO: 3 dias úteis antes, com lembrete; prazo final 1 dia útil antes.",
      "Paciente sem celular e sem recado não tem a vaga liberada automaticamente.",
    ],
    endpoints: [
      { metodo: "GET", rota: "/consultas", api: "JAVA" },
      { metodo: "GET", rota: "/unidades/{id}/horarios", api: "JAVA" },
      { metodo: "PUT", rota: "/consultas/{id}/status", api: "JAVA" },
    ],
  },
  "lista-do-dia": {
    titulo: "Recepção · Lista do dia",
    oQueFaz:
      "Mostra quem foi à UBS sem horário e espera uma vaga. Quando um horário de hoje é liberado, a recepção oferece a vaga ao primeiro da fila e registra a resposta.",
    regras: [
      "Ordem: prioridade (ficou de ontem), depois verde antes de azul, depois ordem de chegada.",
      "A vaga precisa começar daqui a pelo menos 60 minutos; a pessoa tem 30 minutos para aceitar.",
      "Recusada ou vencida, a vaga vai para o próximo; quem já tem consulta hoje não recebe oferta.",
      "Demonstração: a lista do dia ainda não existe na API Java. A vaga oferecida e o agendamento usam os horários e as consultas da API.",
    ],
    endpoints: [
      { metodo: "GET", rota: "lista do dia e ofertas", api: "FRONT" },
      { metodo: "GET", rota: "/unidades/{id}/horarios", api: "JAVA" },
      { metodo: "GET", rota: "/consultas", api: "JAVA" },
      { metodo: "GET", rota: "/cidadaos/{id}", api: "JAVA" },
      { metodo: "POST", rota: "/consultas", api: "JAVA" },
    ],
  },
  indicadores: {
    titulo: "Recepção · Indicadores",
    oQueFaz: "Indicadores da UBS para a gestão acompanhar o efeito do Acolhe+ sobre as faltas (Tabela 5 do texto do projeto).",
    regras: [
      "Taxa de absenteísmo: faltas ÷ consultas que já aconteceram.",
      "Reaproveitamento: horários liberados que foram ocupados de novo ÷ horários liberados.",
      "Não encaixados: pessoas ainda aguardando na lista do dia (sem contar quem já tem consulta hoje).",
      "Tempo até a consulta: média de dias entre o agendamento e a data da consulta.",
    ],
    endpoints: [
      { metodo: "GET", rota: "/consultas", api: "JAVA" },
      { metodo: "GET", rota: "/unidades/{id}/horarios", api: "JAVA" },
    ],
  },
};

/** Escolhe a explicação da aba interna aberta (sem aba, usa a Agenda). */
export function explicacaoRecepcao(tela: string): ExplicacaoTela {
  return EXPLICACOES[tela] ?? EXPLICACOES.agenda;
}
