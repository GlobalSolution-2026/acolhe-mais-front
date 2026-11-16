/**
 * Página: Horários da UBS (aba Cidadão → celular, /simulador/cidadao/ubs/:idUnidade)
 * Mostra os horários livres de uma UBS agrupados por dia e o bloco "Procure a urgência se...".
 * Escolher um horário leva ao Agendar. Sem horário livre (ou por escolha), dá para entrar na lista do dia.
 * Veio do protótipo: src/pages/cidadao/HorariosUbs.tsx.
 * Endpoints: GET /unidades/{idUnidade} e GET /unidades/{idUnidade}/horarios (API Java).
 * Estados: carregando (Render acorda devagar), erro (API fora/404), vazio (sem horário livre).
 * Regras: agenda só em dias úteis (sem feriados); a lista do dia é só para verde/azul e só em dia útil.
 */
import { Link, useNavigate, useParams } from 'react-router-dom';
import { FiList } from 'react-icons/fi';
import CardHorario from '../../../components/CardHorario';
import EstadoVazio from '../../../components/EstadoVazio';
import Loading from '../../../components/Loading';
import MensagemErro from '../../../components/MensagemErro';
import SeloDemonstracao from '../../../components/SeloDemonstracao';
import { BOTAO_CONTORNO, BOTAO_PRIMARIO } from '../../../components/celular/classes';
import { useSimulador } from '../../../context/useSimulador';
import { orientacoesUbs } from '../../../data/orientacoesUbs';
import { useCarregar } from '../../../hooks/useCarregar';
import { useEntrarNaListaDoDia } from '../../../hooks/useEntrarNaListaDoDia';
import { chaveDia, isDiaUtil, rotuloDia } from '../../../lib/datas';
import { agora } from '../../../lib/relogio';
import { buscarUnidade, listarHorarios } from '../../../services/api';
import { BASE_CELULAR, queryRetorno } from '../../../services/navegacao';
import { listaDoDiaAberta } from '../../../services/regrasAgendamento';
import type { Horario, Unidade } from '../../../types';

/** Tela de horários livres de uma UBS. */
export default function HorariosUbs() {
  const { idUnidade: parametro } = useParams();
  const idUnidade = Number(parametro);
  const { estado } = useSimulador();
  const navigate = useNavigate();
  const entrarNaLista = useEntrarNaListaDoDia();

  // Busca a UBS e os horários juntos; no modo demonstração, busca de novo quando a agenda do mock muda.
  const { dados, carregando, erro, recarregar } = useCarregar(
    async (): Promise<{ unidade: Unidade; horarios: Horario[] }> => {
      const [unidade, horarios] = await Promise.all([buscarUnidade(idUnidade), listarHorarios(idUnidade)]);
      return { unidade, horarios };
    },
    [idUnidade, estado.horarios],
  );

  const hoje = agora();
  // Regra: só horário livre, em dia útil e que ainda não passou.
  const livres = (dados?.horarios ?? [])
    .filter((h) => !h.flOcupado && isDiaUtil(new Date(h.dtHorario)) && new Date(h.dtHorario).getTime() > hoje.getTime())
    .sort((a, b) => a.dtHorario.localeCompare(b.dtHorario));
  const dias = [...new Set(livres.map((h) => chaveDia(h.dtHorario)))];

  const atual = estado.orientacaoAtual;
  const podeEntrarNaLista = atual?.resultado?.dsCor === 'VERDE' || atual?.resultado?.dsCor === 'AZUL';
  const listaAberta = listaDoDiaAberta(hoje);

  /** Entra na lista do dia; sem login, vai para Entrar e volta para a lista desta UBS. */
  const aoEntrarNaLista = () => {
    if (estado.idCidadaoAtual === null) {
      navigate(`${BASE_CELULAR}/entrar${queryRetorno({ destino: 'lista-do-dia', ubs: idUnidade })}`);
      return;
    }
    if (entrarNaLista(idUnidade)) navigate(`${BASE_CELULAR}/lista-do-dia`);
  };

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-extrabold text-primaria">{dados?.unidade.nmUnidade ?? 'Horários da UBS'}</h1>
      {carregando && <Loading />}
      {erro && <MensagemErro mensagem={erro} onRetry={recarregar} />}

      {!carregando && !erro && livres.length === 0 && (
        <>
          <EstadoVazio mensagem="Nenhum horário livre nesta UBS." />
          {!listaAberta ? (
            <p className="rounded-xl bg-mentaSuave p-3 font-semibold" role="status">
              A lista do dia funciona só em dias úteis. Volte em um dia útil ou escolha outra UBS.
            </p>
          ) : podeEntrarNaLista ? (
            <button type="button" onClick={aoEntrarNaLista} className={`${BOTAO_PRIMARIO} cursor-pointer`}>
              <FiList aria-hidden /> Entrar na lista do dia
            </button>
          ) : (
            <Link to={`${BASE_CELULAR}/inicio`} className={BOTAO_CONTORNO}>Fazer a orientação para entrar na lista</Link>
          )}
        </>
      )}

      {!erro &&
        dias.map((dia) => {
          const doDia = livres.filter((h) => chaveDia(h.dtHorario) === dia);
          return (
            <section key={dia}>
              <h2 className="mb-2 font-extrabold">{rotuloDia(doDia[0].dtHorario, true, hoje)}</h2>
              <div className="grid grid-cols-3 gap-2">
                {doDia.map((h) => (
                  <CardHorario
                    key={h.idHorario}
                    horario={h}
                    onSelecionar={(sel) => navigate(`${BASE_CELULAR}/agendar${queryRetorno({ horario: sel.idHorario, ubs: idUnidade })}`)}
                  />
                ))}
              </div>
            </section>
          );
        })}

      {!carregando && !erro && livres.length > 0 && listaAberta && podeEntrarNaLista && (
        <div className="flex flex-col gap-2">
          <SeloDemonstracao />
          <button type="button" onClick={aoEntrarNaLista} className={`${BOTAO_CONTORNO} cursor-pointer`}>
            <FiList aria-hidden /> Prefiro entrar na lista do dia
          </button>
        </div>
      )}

      {/* Sinais de piora da queixa da orientação (texto do protótipo) */}
      {atual?.resultado && (
        <section className="rounded-xl border border-borda bg-branco p-4">
          <h2 className="mb-1 font-extrabold text-primaria">Procure a urgência se...</h2>
          <ul className="list-disc pl-6">
            {orientacoesUbs[atual.codigoQueixa].procureUrgencia.map((s) => <li key={s}>{s}</li>)}
          </ul>
        </section>
      )}
    </div>
  );
}
