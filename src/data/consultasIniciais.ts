/**
 * Semente da demonstração: cidadãos, consultas, orientações e lista do dia de exemplo.
 * Gera uma agenda realista (consultas passadas, de hoje e futuras, com faltas e confirmações)
 * para as abas Cidadão, Recepção e IA terem o que mostrar sem a API Java.
 */
import type { Cidadao, Consulta, EntradaListaDoDia, Horario, TipoAcesso } from "../types";
import type { Orientacao } from "../types/orientacao";
import { unidadesIniciais } from "./unidades";
import { CONTA_DEMO } from "./contaDemo";
import { CONFIRMACAO_RISCO_BAIXO_DIAS_UTEIS, PRAZO_FINAL_CONFIRMACAO_DIAS_UTEIS } from "./configuracoes";
import { chaveDia, subtrairDiasUteis } from "../lib/datas";
import { classificarRiscoFalta, inicioPedidoConfirmacao, prazoConfirmacao } from "../services/regrasAgendamento";

/**
 * Cidadãos 1 a 8: os mesmos da carga de teste do banco (Acolhe DML.sql), na mesma ordem dos ids.
 * Assim, Cartão SUS, CPF e forma de acesso batem no modo demonstração e com a API Java ligada.
 * Celular, contato de recado, CEP, sexo e nascimento também batem (gerados abaixo).
 */
const CIDADAOS_DA_CARGA: { nrCns: string; tpAcesso: TipoAcesso; nrCpf: string | null }[] = [
  { nrCns: CONTA_DEMO.nrCns, tpAcesso: "SENHA", nrCpf: null }, // 1 Maria Silva (conta demo)
  { nrCns: "222333344445555", tpAcesso: "GOVBR", nrCpf: "10000000002" }, // 2 João Souza
  { nrCns: "333444455556666", tpAcesso: "BALCAO", nrCpf: null }, // 3 Sebastiana Ramos (sem contato)
  { nrCns: "444555566667777", tpAcesso: "SENHA", nrCpf: null }, // 4 Pedro Lima
  { nrCns: "555666677778888", tpAcesso: "GOVBR", nrCpf: "10000000005" }, // 5 Ana Beatriz (com recado)
  { nrCns: "666777788889999", tpAcesso: "SENHA", nrCpf: null }, // 6 Carlos Nunes
  { nrCns: "700000000000006", tpAcesso: "BALCAO", nrCpf: null }, // 7 Juliana Santos (só recado)
  { nrCns: "700000000000007", tpAcesso: "GOVBR", nrCpf: "10000000008" }, // 8 José Oliveira
];

/**
 * Deixa o histórico sorteado coerente com o painel "Perfis para testar" (data/perfisTeste.ts),
 * como na carga do banco: Pedro (4) sem faltas e com risco BAIXO; Carlos (6) com consultas confirmadas.
 * Altera a lista recebida (as consultas acabaram de ser criadas pela semente).
 * @param consultas consultas geradas pela semente
 * @param now "agora" da demonstração, em milissegundos
 */
function ajustarPerfisTeste(consultas: Consulta[], now: number): void {
  for (const c of consultas) {
    if (c.idCidadao === 4) {
      // Pedro: falta vira presença e a probabilidade cai abaixo do limiar 0,60 (risco BAIXO).
      if (c.dsStatus === "FALTA") c.dsStatus = "REALIZADA";
      const prob = Number(Math.min((c.vlProbFalta ?? 0.3) * 0.5, 0.45).toFixed(2));
      c.vlProbFalta = prob;
      c.dsRiscoFalta = classificarRiscoFalta(prob);
    }
    if (c.idCidadao === 6 && c.dsStatus === "AGENDADA") {
      // Carlos: as consultas que já estão no prazo de confirmação aparecem confirmadas pelo app.
      const inicio = inicioPedidoConfirmacao(c)?.getTime();
      const prazo = prazoConfirmacao(c)?.getTime();
      if (inicio !== undefined && prazo !== undefined && inicio <= now && now <= prazo) {
        c.dsStatus = "CONFIRMADA";
        c.dtConfirmacao = new Date(Math.max(inicio, now - 30 * 60_000)).toISOString();
        c.dsCanalConfirmacao = "APP";
      }
    }
  }
}

export interface Semente {
  cidadaos: Cidadao[];
  consultas: Consulta[];
  orientacoes: Orientacao[];
  horarios: Horario[];
  listaDoDia: EntradaListaDoDia[];
}

/** PRNG com semente fixa; a sequência é independente do relógio. */
function aleatorio() {
  let s = 20261105;
  return () => { s = (Math.imul(s, 1664525) + 1013904223) >>> 0; return s / 4294967296; };
}

/**
 * Gera os dados de exemplo a partir dos horários e do "agora" da demonstração.
 * @param horariosBase horários gerados por gerarHorariosIniciais
 * @param agora momento de referência (passado = consultas encerradas; futuro = agendadas)
 * @returns cidadãos, consultas, orientações, horários (com flOcupado) e lista do dia
 */
export function gerarSemente(horariosBase: Horario[], agora: Date = new Date()): Semente {
  const rand = aleatorio();
  const H = 3_600_000, DIA = 24 * H, now = agora.getTime();
  const nomesBase = ["Maria Silva", "João Souza", "Sebastiana Ramos", "Pedro Lima", "Ana Beatriz", "Carlos Nunes", "Juliana Santos", "José Oliveira", "Mariana Costa", "Paulo Almeida", "Luciana Pereira", "Antonio Rodrigues", "Camila Ferreira", "Francisco Gomes", "Patricia Ribeiro", "Lucas Martins", "Fernanda Carvalho", "Rafael Barbosa", "Renata Rocha", "Marcos Dias", "Adriana Mendes", "Bruno Azevedo", "Sandra Cardoso", "Eduardo Teixeira", "Beatriz Moreira", "Ricardo Correia", "Claudia Batista", "Gabriel Melo", "Helena Freitas", "Diego Fernandes"];
  const nomes = [...nomesBase, ...Array.from({ length: 50 }, (_, i) => {
    const primeiros = ["Alice", "André", "Cristina", "Daniel", "Elisa", "Felipe", "Isabel", "Leonardo", "Marta", "Vinícius"];
    const sobrenomes = ["Macedo", "Duarte", "Vieira", "Barros", "Monteiro"];
    return `${primeiros[i % 10]} ${sobrenomes[Math.floor(i / 10)]}`;
  })];
  const semContatoIds = [3, 27, 29, 33, 37, 39, 43, 47];
  const recadoIds = [7, 9, 11, 13, 15, 17, 31, 35, 41, 45, 49, 51, 55];
  // Telefones só com números (como a API Java guarda: VARCHAR2(11)); a tela formata.
  const telefone = (prefixo: string, i: number) => `119${prefixo}${String(i + 1).padStart(4, "0")}`;
  // DEMONSTRAÇÃO: os cidadãos 1 a 8 usam o CNS da carga do banco (CIDADAOS_DA_CARGA).
  // Do 9 em diante, os CNS de exemplo começam com 0 (nenhum CNS real começa assim) e não seguem padrão de teclado,
  // para que uma conta nova não caia por engano num cadastro da semente (RN21) e herde as consultas dele.
  const cnsExemplo = (i: number) => CIDADAOS_DA_CARGA[i]?.nrCns ?? `09${String(i + 1).padStart(13, "0")}`;
  // Nascimentos dos 8 cidadãos da carga do banco; os demais são sorteados.
  const datasOriginais = ["1958-03-12", "1990-07-01", "1949-11-25", "1985-01-30", "2001-05-14", "1976-09-08", "1993-04-22", "1968-10-03"];
  const cidadaos = nomes.map((nmCidadao, i): Cidadao => {
    const idade = 18 + Math.floor(rand() * 68);
    const nascimento = new Date(agora); nascimento.setFullYear(nascimento.getFullYear() - idade);
    const semContato = semContatoIds.includes(i + 1);
    const recado = recadoIds.includes(i + 1);
    const unidade = unidadesIniciais[i % 3];
    return { idCidadao: i + 1, nmCidadao, nrCns: cnsExemplo(i), dtNascimento: datasOriginais[i] ?? chaveDia(nascimento.toISOString()), dsSexo: i % 2 === 0 ? "F" : "M", nrCelular: semContato || recado ? "" : telefone("8888", i), nmContatoRecado: recado || i === 4 ? "Contato da família" : "", nrContatoRecado: recado || i === 4 ? telefone("7777", i) : "", nrCep: unidade?.nrCep ?? "04010100",
      // 1 a 8: CPF e acesso da carga do banco (SENHA, BALCAO ou GOVBR).
      // Do 9 em diante: cadastrados no balcão, sem senha (RN21: podem criar a conta depois).
      nrCpf: CIDADAOS_DA_CARGA[i]?.nrCpf ?? null, tpAcesso: CIDADAOS_DA_CARGA[i]?.tpAcesso ?? "BALCAO" };
  });
  const consultas: Consulta[] = [], orientacoes: Orientacao[] = [];
  const horarios = horariosBase.map((h) => ({ ...h, flOcupado: false }));
  const hoje = chaveDia(agora.toISOString());
  // Reservar pessoas para a lista de hoje: elas não recebem consultas hoje.
  const filaIds = [19, 20, 21, 22, 23, 24, 25, 26, 28, 30, 7, 8];
  const naJanela = (dtHorario: string) =>
    subtrairDiasUteis(new Date(dtHorario), CONFIRMACAO_RISCO_BAIXO_DIAS_UTEIS).getTime() <= now && !prazoPassou(dtHorario);
  const prazoPassou = (dtHorario: string) => subtrairDiasUteis(new Date(dtHorario), PRAZO_FINAL_CONFIRMACAO_DIAS_UTEIS).getTime() < now;
  // Reservar quatro exemplos na janela por UBS, com ambos riscos e tipos de contato.
  const exemplos = new Map<number, { id: number; alto: boolean }>();
  for (const unidade of [1, 2, 3]) {
    // Janela do risco BAIXO (de 2 dias úteis antes até 1 dia útil antes); vale também para o ALTO.
    const slots = horarios.filter((h) => h.idUnidade === unidade && naJanela(h.dtHorario)).slice(0, 4);
    const ids = unidade === 1 ? [3, 33, 1, 4] : unidade === 2 ? [27, 37, 2, 5] : [29, 39, 6, 9];
    slots.forEach((h, i) => exemplos.set(h.idHorario, { id: ids[i] ?? 1, alto: i % 2 === 0 }));
  }
  const reservados = new Set([...exemplos].map(([id, e]) => `${e.id}:${chaveDia(horarios.find((h) => h.idHorario === id)?.dtHorario ?? agora.toISOString())}`));
  const ativosDia = new Set<string>();
  const livresHoje = new Set(horarios.filter((h) => h.idUnidade === 1 && chaveDia(h.dtHorario) === hoje && new Date(h.dtHorario).getTime() >= now + H).slice(-2).map((h) => h.idHorario));

  const criar = (h: Horario, idCidadao: number, status: Consulta["dsStatus"], alto: boolean, curta = false, anterior?: number) => {
    const t = new Date(h.dtHorario).getTime();
    const antecedencia = curta ? Math.min(12 * H, Math.max(1, t - now + H)) : alto ? (8 + rand() * 5) * DIA : (3 + rand() * 3) * DIA;
    const agendamento = anterior ?? Math.min(now - 1000, t - antecedencia);
    const riscoAlto = t - agendamento >= 7 * DIA;
    let idOrientacao: number | null = null;
    if (rand() < .3) {
      idOrientacao = orientacoes.length + 1;
      orientacoes.push({ idOrientacao, idCidadao, idQueixa: 1 + Math.floor(rand() * 5), dsCor: rand() < .5 ? "VERDE" : "AZUL", dsDestino: "UBS", nrDor: Math.floor(rand() * 5), flElevadaModelo: false, dtOrientacao: new Date(agendamento - H).toISOString() });
    }
    // Faixas do Modelo 1: alto 0,60–0,95; baixo 0,05–0,59. O risco sai do limiar.
    const prob = Number((riscoAlto ? .6 + rand() * .35 : .05 + rand() * .54).toFixed(2));
    const c: Consulta = { idConsulta: consultas.length + 1, idHorario: h.idHorario, idCidadao, idOrientacao, dtAgendamento: new Date(agendamento).toISOString(), dtHorario: h.dtHorario, dtConfirmacao: null, dsCanalConfirmacao: null, dsStatus: status, dsRiscoFalta: classificarRiscoFalta(prob), vlProbFalta: prob, nmUnidade: unidadesIniciais.find((u) => u.idUnidade === h.idUnidade)?.nmUnidade ?? "UBS", nmCidadao: cidadaos.find((p) => p.idCidadao === idCidadao)?.nmCidadao ?? "" };
    if (status === "CONFIRMADA" || status === "REALIZADA") {
      const inicio = inicioPedidoConfirmacao(c)?.getTime();
      const prazo = prazoConfirmacao(c)?.getTime();
      if (inicio !== undefined && prazo !== undefined) {
        const min = Math.max(inicio, agendamento + 1000), max = Math.min(prazo, now - 1000);
        if (max >= min) { c.dtConfirmacao = new Date(min + rand() * (max - min)).toISOString(); c.dsCanalConfirmacao = (["APP", "TELEFONE", "PRESENCIAL"] as const)[c.idConsulta % 3] ?? "APP"; }
      }
    }
    if (c.dsStatus === "CONFIRMADA" && !c.dtConfirmacao) c.dsStatus = "AGENDADA";
    consultas.push(c); return c;
  };

  let reutilizadas = 0;
  for (const h of horarios) {
    const t = new Date(h.dtHorario).getTime(), delta = t - now;
    const exemplo = exemplos.get(h.idHorario);
    const liberarPassada = delta < 0 && reutilizadas < 6 && h.idUnidade === 1;
    const ocupar = !livresHoje.has(h.idHorario) && (exemplo || liberarPassada || rand() < (delta < 0 ? .9 : prazoPassou(h.dtHorario) ? .96 : .85));
    if (!ocupar) continue;
    let candidatos = cidadaos.filter((c) => chaveDia(h.dtHorario) !== hoje || !filaIds.includes(c.idCidadao));
    const dia = chaveDia(h.dtHorario);
    candidatos = candidatos.filter((c) => !ativosDia.has(`${c.idCidadao}:${dia}`) && !reservados.has(`${c.idCidadao}:${dia}`));
    const pessoa = candidatos[Math.floor(rand() * candidatos.length)];
    if (!pessoa) continue;
    const id = exemplo?.id ?? pessoa.idCidadao;
    const alto = exemplo?.alto ?? rand() < .45;
    const curta = delta >= 0 && prazoPassou(h.dtHorario) && rand() < .15;
    const status: Consulta["dsStatus"] = exemplo ? "AGENDADA" : delta < 0 ? (rand() < (alto ? .32 : .13) ? "FALTA" : "REALIZADA") : prazoPassou(h.dtHorario) ? (curta ? "AGENDADA" : "CONFIRMADA") : naJanela(h.dtHorario) ? (rand() < .65 ? "AGENDADA" : "CONFIRMADA") : "AGENDADA";
    if (liberarPassada) {
      const perdida = criar(h, id, "LIBERADA", true);
      if (reutilizadas < 4) {
        const outro = candidatos.find((c) => c.idCidadao !== id);
        if (outro) {
          criar(h, outro.idCidadao, "REALIZADA", false, false, new Date(perdida.dtAgendamento ?? agora).getTime() + DIA);
          ativosDia.add(`${outro.idCidadao}:${dia}`);
          h.flOcupado = true;
        }
      }
      reutilizadas++;
    } else {
      criar(h, id, status, alto, curta);
      ativosDia.add(`${id}:${dia}`);
      h.flOcupado = true;
    }
  }
  ajustarPerfisTeste(consultas, now);
  const inicioEntrada = new Date(agora); inicioEntrada.setHours(7, 0, 0, 0);
  const fimEntrada = new Date(agora); fimEntrada.setHours(17, 0, 0, 0);
  const limiteEntrada = agora < inicioEntrada || agora > fimEntrada ? fimEntrada.getTime() : now;
  const listaDoDia = filaIds.map((id, i): EntradaListaDoDia => {
    const dsCor = i % 2 === 0 ? "VERDE" : "AZUL";
    const dtEntrada = new Date(inicioEntrada.getTime() + (limiteEntrada - inicioEntrada.getTime()) * (i + 1) / 14).toISOString();
    const idOrientacao = orientacoes.length + 1;
    orientacoes.push({ idOrientacao, idCidadao: id, idQueixa: 1 + (i % 5), dsCor, dsDestino: "UBS", nrDor: i % 5, flElevadaModelo: false, dtOrientacao: new Date(new Date(dtEntrada).getTime() - 10 * 60_000).toISOString() });
    return { idEntrada: i + 1, idCidadao: id, idOrientacao, idUnidade: Math.floor(i / 4) + 1, nmCidadao: cidadaos.find((c) => c.idCidadao === id)?.nmCidadao ?? "Paciente", dsCor, dtEntrada, flPrioridade: i % 4 === 0, flCidadao: false, status: "AGUARDANDO" };
  });
  return { cidadaos, consultas, orientacoes, horarios, listaDoDia };
}
