/**
 * Página: Lista do dia (aba Recepção UBS → Lista do dia, /simulador/recepcao/lista-do-dia)
 * Fila de quem foi à UBS sem horário. Quando há um horário livre de hoje com antecedência suficiente,
 * a recepção oferece a vaga ao primeiro da fila e acompanha o prazo; para quem não usa o app,
 * registra "Aceitou por telefone" (agenda) ou "Recusou" (a vaga vai para o próximo).
 * Veio do protótipo: src/pages/recepcao/ListaDoDia.tsx.
 * Endpoints: GET /unidades/{id}/horarios e GET /consultas (API Java, para achar a vaga livre de hoje),
 * POST /consultas (API Java, ao aceitar por telefone). DEMONSTRAÇÃO: lista do dia e ofertas
 * não existem na API Java; ficam no front, mas usam os horários e as consultas que vieram da API.
 * Estados: lista fechada (dia não útil), carregando, erro, vazio (ninguém na fila), sem vaga para oferecer e "Aguarde...".
 */
import { useEffect, useState } from 'react';
import { FiSend } from 'react-icons/fi';
import EstadoVazio from '../../../components/EstadoVazio';
import Loading from '../../../components/Loading';
import MensagemErro from '../../../components/MensagemErro';
import SeloDemonstracao from '../../../components/SeloDemonstracao';
import { BOTAO_CONTORNO, BOTAO_PRIMARIO } from '../../../components/celular/classes';
import SeloOrientacaoHoje from '../../../components/recepcao/SeloOrientacaoHoje';
import { useSimulador } from '../../../context/useSimulador';
import { chaveDia, fmtDiaHora, fmtHora } from '../../../lib/datas';
import { agora } from '../../../lib/relogio';
import { useCarregar } from '../../../hooks/useCarregar';
import { aceitarOfertaPorTelefone, listarConsultas, listarHorarios } from '../../../services/api';
import {
  consultaNoDia, escolherDestinatarioOferta, horarioOferecivel, listaDoDiaAberta, MENSAGEM_LISTA_SO_DIA_UTIL,
  ordenarListaDoDia, tempoRestanteOferta,
} from '../../../services/regrasAgendamento';
import { mensagemDoErro } from '../../../utils/erros';

/** Tela Lista do dia da recepção. */
export default function ListaDoDiaRecepcao() {
  const { estado, oferecerVaga, responderOferta } = useSimulador();
  const idUnidade = estado.idUnidadeRecepcao;
  // Relógio da tela: atualiza a cada segundo para o tempo das ofertas andar.
  const [instante, setInstante] = useState(() => agora());
  const [erro, setErro] = useState<string | null>(null);
  const [aceitando, setAceitando] = useState(false);
  useEffect(() => {
    const relogio = setInterval(() => setInstante(agora()), 1000);
    return () => clearInterval(relogio);
  }, []);

  // Horários e consultas da UBS: da API quando ligada (a vaga oferecida precisa existir no banco), senão do mock.
  const { dados, carregando, erro: erroCarregar, recarregar } = useCarregar(
    async () => {
      const [horarios, consultas] = await Promise.all([listarHorarios(idUnidade), listarConsultas()]);
      return { horarios, consultas };
    },
    [idUnidade, estado.horarios, estado.consultas],
  );

  const descricao = 'A lista do dia e as ofertas de vaga ainda não existem na API Java.';
  if (!listaDoDiaAberta(instante)) {
    return (
      <div className="flex flex-col gap-4">
        <SeloDemonstracao descricao={descricao} />
        <h1 className="text-2xl font-extrabold text-primaria">Lista do dia</h1>
        <p className="rounded-xl bg-mentaSuave p-3 font-semibold text-textoSuave" role="status">{MENSAGEM_LISTA_SO_DIA_UTIL}</p>
      </div>
    );
  }

  if (carregando) return <Loading />;
  if (erroCarregar || !dados) {
    return <MensagemErro mensagem={erroCarregar ?? 'Não foi possível carregar os horários da UBS.'} onRetry={recarregar} />;
  }

  const fila = ordenarListaDoDia(estado.listaDoDia.filter((e) => e.idUnidade === idUnidade));
  const ofertas = estado.ofertas.filter((o) => o.idUnidade === idUnidade && o.status === 'PENDENTE');
  const hoje = chaveDia(instante.toISOString());

  // Regra: vaga oferecível = horário livre de hoje, daqui a pelo menos 60 min, sem oferta pendente
  // e com alguém na fila que possa recebê-la (sem consulta hoje e que não perdeu esse horário).
  const vaga = dados.horarios
    .filter((h) => {
      if (h.idUnidade !== idUnidade || !horarioOferecivel(h, estado.ofertas, instante)) return false;
      const perdeu = [...dados.consultas].reverse().find((c) => c.idHorario === h.idHorario && c.dsStatus === 'LIBERADA')?.idCidadao ?? null;
      return escolherDestinatarioOferta(fila, estado.ofertas, h, perdeu, dados.consultas) !== undefined;
    })
    .sort((a, b) => a.dtHorario.localeCompare(b.dtHorario))[0];

  /** "Aceitou por telefone": agenda a consulta para a pessoa da oferta. */
  const aceitar = async (idOferta: number) => {
    setAceitando(true);
    setErro(null);
    try {
      await aceitarOfertaPorTelefone(idOferta);
      // Com a API, o horário agora está ocupado no banco: busca de novo.
      recarregar();
    } catch (e) {
      setErro(mensagemDoErro(e));
    } finally {
      setAceitando(false);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <SeloDemonstracao descricao={descricao} />
      <h1 className="text-2xl font-extrabold text-primaria">Lista do dia</h1>
      {erro && <MensagemErro mensagem={erro} />}

      {ofertas.length > 0 && (
        <section className="flex flex-col gap-3">
          <h2 className="font-extrabold">Ofertas em andamento</h2>
          {ofertas.map((o) => {
            const entrada = estado.listaDoDia.find((e) => e.idEntrada === o.idEntrada);
            return (
              <article key={o.idOferta} className="flex flex-col gap-1 rounded-xl border-2 border-primaria bg-branco p-4">
                <p className="font-bold">{o.nmCidadao}</p>
                <p>{fmtDiaHora(o.dtHorario)}</p>
                <p role="timer" className="font-semibold text-primaria">Tempo restante: {tempoRestanteOferta(o, instante)}</p>
                {/* Quem usa o app responde no aviso; para os outros, a recepção registra a resposta. */}
                {entrada?.flCidadao ? (
                  <p className="text-sm text-textoSuave">A pessoa responde pelo aviso no app.</p>
                ) : (
                  <div className="mt-2 grid gap-2 md:grid-cols-2">
                    <button type="button" disabled={aceitando} onClick={() => void aceitar(o.idOferta)} className={`${BOTAO_PRIMARIO} cursor-pointer disabled:opacity-60`}>
                      {aceitando ? 'Aguarde...' : 'Aceitou por telefone'}
                    </button>
                    <button type="button" disabled={aceitando} onClick={() => responderOferta(o.idOferta, 'RECUSADA')} className={`${BOTAO_CONTORNO} cursor-pointer`}>
                      Recusou
                    </button>
                  </div>
                )}
              </article>
            );
          })}
        </section>
      )}

      {fila.length === 0 && <EstadoVazio mensagem="Ninguém aguardando encaixe hoje." />}
      {fila.map((e, i) => {
        const consultaHoje = consultaNoDia(dados.consultas, e.idCidadao, hoje);
        const orientacao = estado.orientacoes.find((o) => o.idOrientacao === e.idOrientacao);
        return (
          <article key={e.idEntrada} className="flex items-center gap-3 rounded-xl border border-borda bg-branco p-4 shadow-leve">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-mentaSuave text-lg font-extrabold text-primaria">{i + 1}º</span>
            <div className="min-w-0 flex-1">
              <p className="font-bold">{e.nmCidadao}</p>
              <p className="text-sm text-textoSuave">Entrou às {fmtHora(e.dtEntrada)}{e.flPrioridade ? ' · prioridade de ontem' : ''}</p>
              {consultaHoje && (
                <div className="mt-1 flex flex-col gap-1">
                  {orientacao && <SeloOrientacaoHoje orientacao={orientacao} hoje={hoje} />}
                  <p className="text-sm text-textoSuave">Consulta hoje às {fmtHora(consultaHoje.dtHorario)}: não recebe oferta de vaga de hoje.</p>
                </div>
              )}
            </div>
            {/* Cor de gravidade com o nome escrito (não só a cor) */}
            <span className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-bold text-branco ${e.dsCor === 'VERDE' ? 'bg-gravidade-verde' : 'bg-gravidade-azul'}`}>
              {e.dsCor === 'VERDE' ? 'Verde' : 'Azul'}
            </span>
          </article>
        );
      })}

      {fila.length > 0 && vaga && (
        <div>
          <button type="button" onClick={() => oferecerVaga(vaga, dados.consultas)} className={`${BOTAO_PRIMARIO} w-full cursor-pointer`}>
            <FiSend aria-hidden /> Oferecer vaga de {fmtDiaHora(vaga.dtHorario, false)}
          </button>
          <p className="mt-1 text-sm text-textoSuave">A pessoa tem 30 minutos para aceitar (na demonstração, 1 minuto = 10 segundos).</p>
        </div>
      )}
      {fila.length > 0 && !vaga && (
        <p className="rounded-xl bg-mentaSuave p-3 text-sm font-semibold text-textoSuave">
          Nenhum horário livre com antecedência suficiente para oferecer agora.
        </p>
      )}
    </div>
  );
}
