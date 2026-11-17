/**
 * Página: Avisos (aba Cidadão → celular, /simulador/cidadao/avisos)
 * Mostra as ofertas de vaga da lista do dia (com o tempo para aceitar) e os pedidos de confirmação
 * das consultas de quem está logado.
 * Veio do protótipo: src/pages/cidadao/Avisos.tsx.
 * Endpoints: GET /consultas e PUT /consultas/{id}/status (API Java). Ofertas de vaga: só no front (demonstração).
 * Estados: carregando, erro, vazio (nenhum aviso) e "Confirmando...".
 * Regra: a oferta vale 30 min (na demonstração, cada minuto dura 10 s); recusada ou vencida, vai para o próximo da fila.
 */
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiCheck, FiX } from 'react-icons/fi';
import EstadoVazio from '../../../components/EstadoVazio';
import Loading from '../../../components/Loading';
import MensagemErro from '../../../components/MensagemErro';
import SeloDemonstracao from '../../../components/SeloDemonstracao';
import { BOTAO_CONTORNO, BOTAO_PRIMARIO } from '../../../components/celular/classes';
import { useSimulador } from '../../../context/useSimulador';
import { useCarregar } from '../../../hooks/useCarregar';
import { fmtDiaHora } from '../../../lib/datas';
import { agora } from '../../../lib/relogio';
import { confirmarConsulta, listarConsultas } from '../../../services/api';
import { BASE_CELULAR, queryRetorno } from '../../../services/navegacao';
import { ofertasDoCidadao, prazoConfirmacao, precisaConfirmar, tempoRestanteOferta } from '../../../services/regrasAgendamento';
import type { OfertaVaga } from '../../../types';
import { mensagemDoErro } from '../../../utils/erros';

/** Card de uma oferta de vaga, com o cronômetro do prazo para aceitar. */
function CardOferta({ oferta }: { oferta: OfertaVaga }) {
  const { estado, responderOferta } = useSimulador();
  const navigate = useNavigate();
  // Relógio da tela: atualiza a cada segundo para o cronômetro andar.
  const [instante, setInstante] = useState(() => agora());
  useEffect(() => {
    const relogio = setInterval(() => setInstante(agora()), 1000);
    return () => clearInterval(relogio);
  }, []);
  const unidade = estado.unidades.find((u) => u.idUnidade === oferta.idUnidade);

  return (
    <article className="flex flex-col gap-2 rounded-xl border-2 border-primaria bg-branco p-4 shadow-leve">
      <p className="font-extrabold text-primaria">Vaga liberada na {unidade?.nmUnidade ?? 'UBS'}!</p>
      {/* Data copiada na oferta: o horário pode ser da API, não do mock. */}
      <p className="font-semibold">{fmtDiaHora(oferta.dtHorario)}</p>
      <p className="font-bold text-primaria" role="timer">Você tem {tempoRestanteOferta(oferta, instante)} para aceitar.</p>
      <div className="grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={() => navigate(`${BASE_CELULAR}/agendar${queryRetorno({ horario: oferta.idHorario, oferta: oferta.idOferta, ubs: oferta.idUnidade })}`)}
          className={`${BOTAO_PRIMARIO} cursor-pointer`}
        >
          <FiCheck aria-hidden /> Aceitar
        </button>
        <button type="button" onClick={() => responderOferta(oferta.idOferta, 'RECUSADA')} className={`${BOTAO_CONTORNO} cursor-pointer`}>
          <FiX aria-hidden /> Recusar
        </button>
      </div>
    </article>
  );
}

/** Tela Avisos do celular. */
export default function Avisos() {
  const { estado } = useSimulador();
  const idCidadao = estado.idCidadaoAtual;
  const [confirmando, setConfirmando] = useState(false);
  const [erroAcao, setErroAcao] = useState<string | null>(null);

  // Pedidos de confirmação: consultas de quem está logado que estão na janela de confirmação.
  const { dados, carregando, erro, recarregar } = useCarregar(
    async () => (idCidadao === null ? [] : (await listarConsultas()).filter((c) => c.idCidadao === idCidadao && precisaConfirmar(c, agora()))),
    [idCidadao, estado.consultas],
  );
  // Ofertas da lista do dia buscadas pela conta (ou pela entrada feita sem login).
  const ofertas = ofertasDoCidadao(estado.ofertas, estado.listaDoDia, idCidadao);
  const confirmacoes = dados ?? [];

  /** Confirma a presença pelo app e atualiza a lista. */
  const confirmar = async (idConsulta: number) => {
    const consulta = confirmacoes.find((c) => c.idConsulta === idConsulta);
    if (!consulta) return;
    setConfirmando(true);
    setErroAcao(null);
    try {
      await confirmarConsulta(consulta, 'APP');
      recarregar();
    } catch (e) {
      setErroAcao(mensagemDoErro(e));
    } finally {
      setConfirmando(false);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-extrabold text-primaria">Avisos</h1>
      {carregando && <Loading />}
      {erro && <MensagemErro mensagem={erro} onRetry={recarregar} />}
      {erroAcao && <MensagemErro mensagem={erroAcao} />}
      {!carregando && !erro && ofertas.length === 0 && confirmacoes.length === 0 && <EstadoVazio mensagem="Nenhum aviso no momento." />}

      {ofertas.length > 0 && <SeloDemonstracao descricao="A oferta de vaga da lista do dia ainda não existe na API Java." />}
      {ofertas.map((o) => <CardOferta key={o.idOferta} oferta={o} />)}

      {confirmacoes.map((c) => {
        const prazo = prazoConfirmacao(c);
        return (
          <article key={c.idConsulta} className="flex flex-col gap-2 rounded-xl border border-borda bg-branco p-4 shadow-leve">
            <p className="font-extrabold">Confirme sua consulta na {c.nmUnidade}</p>
            <p className="font-semibold">{fmtDiaHora(c.dtHorario)}</p>
            {prazo && <p className="text-sm font-semibold text-primaria">Prazo: até {fmtDiaHora(prazo.toISOString(), false)}.</p>}
            <button type="button" onClick={() => void confirmar(c.idConsulta)} disabled={confirmando} className={`${BOTAO_PRIMARIO} cursor-pointer disabled:opacity-60`}>
              <FiCheck aria-hidden /> {confirmando ? 'Confirmando...' : 'Confirmar presença'}
            </button>
          </article>
        );
      })}
    </div>
  );
}
