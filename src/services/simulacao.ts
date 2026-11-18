/**
 * Simulações do modo demonstração (funções puras sobre o estado do simulador; vieram do protótipo).
 * Liberação de horários, oferta de vaga à lista do dia e o botão "Simular prazo" da recepção.
 * DEMONSTRAÇÃO: não existe na API Java.
 */
import { chaveDia, proximosDiasAtendimento } from "../lib/datas";
import type { EstadoSimulador } from "../context/estadoSimulador";
import type { Consulta, Horario } from "../types";
import { escolherDestinatarioOferta, horarioOferecivel, dispensadaConfirmacao, temContatoValido, segundosRestantesOferta } from "./regrasAgendamento";

export interface ResumoSimulacao {
  consultasLiberadas: number;
  vagasOferecidas: number;
  vagasDeVoltaNaAgenda: number;
  mantidasSemContato: number;
}

/**
 * Oferece um horário livre ao próximo da lista do dia. A mesma seleção vale para a oferta manual,
 * automática e para o repasse.
 * O horário e as consultas vêm de quem chama: com a API ligada, são os do banco (a lista e as ofertas
 * continuam só no front); no modo demonstração, os do mock.
 * @param horario horário a oferecer (precisa estar livre, hoje e com antecedência)
 * @param consultas consultas usadas para achar quem perdeu o horário e quem já tem consulta hoje
 */
export function oferecerHorario(estado: EstadoSimulador, horario: Horario, agora: Date, consultas: Consulta[] = estado.consultas): EstadoSimulador {
  const h = horario;
  if (!horarioOferecivel(h, estado.ofertas, agora)) return estado;
  const perdida = [...consultas].reverse().find((c) => c.idHorario === h.idHorario && c.dsStatus === "LIBERADA");
  const entrada = escolherDestinatarioOferta(estado.listaDoDia.filter((e) => e.idUnidade === h.idUnidade), estado.ofertas, h, perdida?.idCidadao ?? null, consultas);
  if (!entrada) return estado;
  return { ...estado, ofertas: [...estado.ofertas, { idOferta: Math.max(0, ...estado.ofertas.map((o) => o.idOferta)) + 1, idHorario: h.idHorario, idUnidade: h.idUnidade, dtHorario: h.dtHorario, idEntrada: entrada.idEntrada, nmCidadao: entrada.nmCidadao, dtCriacao: agora.toISOString(), status: "PENDENTE" }] };
}

/**
 * Encerra uma oferta de vaga. Aceita: a pessoa sai da lista do dia.
 * Recusada ou vencida: a mesma vaga é oferecida ao próximo da fila.
 */
export function finalizarOferta(estado: EstadoSimulador, idOferta: number, resposta: "ACEITA" | "RECUSADA" | "EXPIRADA", agora: Date): EstadoSimulador {
  const oferta = estado.ofertas.find((o) => o.idOferta === idOferta && o.status === "PENDENTE");
  if (!oferta) return estado;
  const novo: EstadoSimulador = { ...estado, ofertas: estado.ofertas.map((o) => o.idOferta === idOferta ? { ...o, status: resposta } : o), listaDoDia: resposta === "ACEITA" ? estado.listaDoDia.map((e) => e.idEntrada === oferta.idEntrada ? { ...e, status: "ENCERRADA" } : e) : estado.listaDoDia };
  if (resposta === "ACEITA") return novo;
  // Repasse: usa a cópia do horário guardada na oferta (o horário pode ser da API, não do mock).
  const horario: Horario = { idHorario: oferta.idHorario, idUnidade: oferta.idUnidade, dtHorario: oferta.dtHorario, nrDuracaoMinuto: 0, flOcupado: false };
  return oferecerHorario(novo, horario, agora);
}

/**
 * Vence as ofertas cujo prazo de 30 min acabou (e repassa a vaga).
 * @param todas true = vence todas as pendentes (botão de demonstração)
 */
export function vencerOfertas(estado: EstadoSimulador, agora: Date, todas = false): EstadoSimulador {
  // Usar o conjunto inicial: novas ofertas não expiram no mesmo clique.
  return estado.ofertas.filter((o) => o.status === "PENDENTE" && (todas || segundosRestantesOferta(o, agora) === 0))
    .reduce((e, o) => finalizarOferta(e, o.idOferta, "EXPIRADA", agora), estado);
}

/**
 * Fonte única da liberação de um horário: a consulta vira LIBERADA, o horário volta a ficar livre
 * e, com antecedência suficiente e alguém aguardando, é oferecido à lista do dia (oferecerHorario).
 * Usada pelo prazo de confirmação (simularPrazo) e pelo cancelamento.
 */
export function liberarConsulta(estado: EstadoSimulador, idConsulta: number, agora: Date): { novoEstado: EstadoSimulador; oferecida: boolean } {
  const c = estado.consultas.find((x) => x.idConsulta === idConsulta);
  if (!c) return { novoEstado: estado, oferecida: false };
  const liberado: EstadoSimulador = {
    ...estado,
    consultas: estado.consultas.map((x) => (x.idConsulta === idConsulta ? { ...x, dsStatus: "LIBERADA" } : x)),
    horarios: estado.horarios.map((h) => (h.idHorario === c.idHorario ? { ...h, flOcupado: false } : h)),
  };
  const horario = liberado.horarios.find((h) => h.idHorario === c.idHorario);
  if (!horario) return { novoEstado: liberado, oferecida: false };
  const oferecido = oferecerHorario(liberado, horario, agora);
  return { novoEstado: oferecido, oferecida: oferecido !== liberado };
}

/** Avança apenas o prazo das consultas no alcance, mantendo o relógio das vagas real. */
export function simularPrazo(estado: EstadoSimulador, agora: Date): { novoEstado: EstadoSimulador; resumo: ResumoSimulacao } {
  const resumo: ResumoSimulacao = { consultasLiberadas: 0, vagasOferecidas: 0, vagasDeVoltaNaAgenda: 0, mantidasSemContato: 0 };
  const dias = proximosDiasAtendimento(estado.horarios, estado.idUnidadeRecepcao, agora);
  const alvo = estado.consultas.filter((c) => {
    const t = new Date(c.dtHorario).getTime();
    const unidade = estado.horarios.find((h) => h.idHorario === c.idHorario)?.idUnidade;
    return c.dsStatus === "AGENDADA" && !dispensadaConfirmacao(c) &&
      ((unidade === estado.idUnidadeRecepcao && t >= agora.getTime() && dias.includes(chaveDia(c.dtHorario))) || c.idCidadao === estado.idCidadaoAtual);
  });
  let novoEstado = estado;
  for (const c of alvo) {
    const cidadao = estado.cidadaos.find((p) => p.idCidadao === c.idCidadao);
    if (!cidadao || !temContatoValido(cidadao)) { resumo.mantidasSemContato++; continue; }
    const { novoEstado: liberado, oferecida } = liberarConsulta(novoEstado, c.idConsulta, agora);
    resumo.consultasLiberadas++;
    if (oferecida) resumo.vagasOferecidas++; else resumo.vagasDeVoltaNaAgenda++;
    novoEstado = liberado;
  }
  return { novoEstado, resumo };
}
