/**
 * Parte do Balcão: depois de uma orientação verde ou azul, identifica a pessoa pelo Cartão SUS,
 * confere ou faz o cadastro (sem senha), vincula a orientação e agenda ou coloca na lista do dia.
 * Veio do protótipo: src/pages/recepcao/BalcaoAtendimento.tsx.
 * Endpoints: GET /cidadaos?cns=, POST /cidadaos, PUT /cidadaos/{id}, GET /unidades/{id}/horarios e
 * POST /consultas (API Java) + POST /prever-falta (API Flask). Vincular orientação e lista do dia: demonstração.
 * Estados: "Buscando...", código de outra pessoa (bloqueado), cadastro novo ou existente, carregando
 * horários, sem horário livre (lista do dia), "Agendando..." e erro.
 */
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { FiCalendar, FiCheckCircle, FiList, FiSearch } from 'react-icons/fi';
import CampoFormulario from '../../../components/CampoFormulario';
import Loading from '../../../components/Loading';
import MensagemErro from '../../../components/MensagemErro';
import { BOTAO_CONTORNO, BOTAO_PRIMARIO } from '../../../components/celular/classes';
import FormularioCidadao, { type DadosCidadao } from '../../../components/celular/FormularioCidadao';
import { useSimulador } from '../../../context/useSimulador';
import { useCarregar } from '../../../hooks/useCarregar';
import { fmtDiaHora } from '../../../lib/datas';
import { agora } from '../../../lib/relogio';
import {
  agendarConsulta, atualizarCidadao, buscarCidadaoPorCns, cadastrarCidadao, incluirNaListaDoDia, listarHorarios, vincularOrientacao,
} from '../../../services/api';
import { horariosLivresBalcao, podeVincular, type OrientacaoBalcao } from '../../../services/balcao';
import { listaDoDiaAberta, MENSAGEM_LISTA_SO_DIA_UTIL, posicaoNaFila } from '../../../services/regrasAgendamento';
import type { Cidadao } from '../../../types';
import { mensagemDoErro } from '../../../utils/erros';
import { regrasCartaoSus } from '../../../utils/validacoes';

/** Passos do atendimento. */
type Etapa =
  | { tipo: 'CNS' }
  | { tipo: 'BLOQUEADO' }
  | { tipo: 'CADASTRO'; nrCns: string; existente: Cidadao | null }
  | { tipo: 'DESTINO'; cidadao: Cidadao }
  | { tipo: 'AGENDADO'; cidadao: Cidadao; dtHorario: string }
  | { tipo: 'NA_LISTA'; cidadao: Cidadao; idEntrada: number };

interface BalcaoAtendimentoProps {
  dados: OrientacaoBalcao;
  idUnidade: number;
  nrCep: string;
}

/** Atendimento no balcão depois da orientação verde ou azul. */
export default function BalcaoAtendimento({ dados, idUnidade, nrCep }: BalcaoAtendimentoProps) {
  const { estado, obterEstado } = useSimulador();
  const { orientacao } = dados;
  const [etapa, setEtapa] = useState<Etapa>({ tipo: 'CNS' });
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [idHorario, setIdHorario] = useState<number | null>(null);
  const { register, handleSubmit, formState: { errors } } = useForm<{ nrCns: string }>();

  // Horários futuros livres da UBS, sem oferta pendente; sugere o mais próximo.
  const { dados: horarios, carregando, erro: erroHorarios, recarregar } = useCarregar(() => listarHorarios(idUnidade), [idUnidade, estado.horarios]);
  const livres = horariosLivresBalcao(horarios ?? [], estado.ofertas, idUnidade, agora());
  const escolhido = livres.find((h) => h.idHorario === idHorario) ?? livres[0];

  /** Executa um passo mostrando "enviando" e o erro, se houver. */
  const executar = async (passo: () => Promise<void>) => {
    setEnviando(true);
    setErro(null);
    try {
      await passo();
    } catch (e) {
      setErro(mensagemDoErro(e));
    } finally {
      setEnviando(false);
    }
  };

  /** Busca pelo Cartão SUS. Regra: orientação vinculada a outra pessoa bloqueia o atendimento. */
  const buscar = handleSubmit(({ nrCns }) => executar(async () => {
    const existente = await buscarCidadaoPorCns(nrCns);
    const atual = obterEstado().orientacoes.find((o) => o.idOrientacao === orientacao.idOrientacao) ?? orientacao;
    const bloqueada = existente ? !podeVincular(atual, existente.idCidadao) : atual.idCidadao != null;
    setEtapa(bloqueada ? { tipo: 'BLOQUEADO' } : { tipo: 'CADASTRO', nrCns: nrCns.replace(/\D/g, ''), existente });
  }));

  /** Confere (só contato) ou cria o cadastro de balcão (sem senha) e vincula a orientação. */
  const salvarCadastro = (form: DadosCidadao, existente: Cidadao | null) => executar(async () => {
    const cidadao = existente
      ? await atualizarCidadao(existente.idCidadao, {
        nrCelular: form.nrCelular, nmContatoRecado: form.nmContatoRecado, nrContatoRecado: form.nrContatoRecado, nrCep: existente.nrCep,
      })
      : await cadastrarCidadao(form);
    await vincularOrientacao(orientacao.idOrientacao, cidadao.idCidadao);
    setEtapa({ tipo: 'DESTINO', cidadao });
  });

  const agendar = (cidadao: Cidadao) => executar(async () => {
    if (!escolhido) return;
    const consulta = await agendarConsulta({ horario: escolhido, cidadao, idOrientacao: orientacao.idOrientacao });
    setEtapa({ tipo: 'AGENDADO', cidadao, dtHorario: consulta.dtHorario });
  });

  const colocarNaLista = (cidadao: Cidadao) => executar(async () => {
    const dsCor = orientacao.dsCor === 'AZUL' ? 'AZUL' : 'VERDE';
    const entrada = await incluirNaListaDoDia({ idUnidade, cidadao, idOrientacao: orientacao.idOrientacao, dsCor });
    setEtapa({ tipo: 'NA_LISTA', cidadao, idEntrada: entrada.idEntrada });
  });

  const nomeCor = orientacao.dsCor === 'AZUL' ? 'Azul' : 'Verde';

  return (
    <section className="flex flex-col gap-4">
      {erro && <MensagemErro mensagem={erro} />}

      {etapa.tipo === 'CNS' && (
        <form onSubmit={buscar} className="flex flex-col gap-3" noValidate>
          <h2 className="text-xl font-extrabold">Identificar o cidadão</h2>
          <CampoFormulario id="cnsBusca" label="Cartão SUS do cidadão (15 números)" placeholder="000000000000000" numerico
            erro={errors.nrCns} registro={register('nrCns', regrasCartaoSus)} />
          <button type="submit" disabled={enviando} className={`${BOTAO_PRIMARIO} cursor-pointer disabled:opacity-60`}>
            <FiSearch aria-hidden /> {enviando ? 'Buscando...' : 'Buscar cadastro'}
          </button>
        </form>
      )}

      {etapa.tipo === 'BLOQUEADO' && (
        <div className="rounded-xl bg-mentaSuave p-3 text-primaria" role="alert">
          <p className="font-bold">Código já utilizado.</p>
          <p>Esta orientação está vinculada a outro cidadão.</p>
        </div>
      )}

      {etapa.tipo === 'CADASTRO' && (
        <div className="flex flex-col gap-3">
          <h2 className="text-xl font-extrabold">{etapa.existente ? 'Conferir cadastro' : 'Cadastro de balcão'}</h2>
          <p className="text-base text-textoSuave">
            {etapa.existente
              ? 'Confira com o cidadão o celular e o contato de recado.'
              : 'Sem cadastro com este Cartão SUS. O cadastro é feito sem senha; o cidadão pode criar a conta depois no app.'}
          </p>
          <FormularioCidadao
            key={etapa.nrCns}
            celularOpcional
            identificacaoSomenteLeitura={Boolean(etapa.existente)}
            nrCep={nrCep}
            valoresIniciais={etapa.existente ?? { nrCns: etapa.nrCns }}
            aoEnviar={(d) => void salvarCadastro(d, etapa.existente)}
            textoBotao={etapa.existente ? 'Confirmar dados' : 'Cadastrar'}
            textoEnviando="Salvando..."
            enviando={enviando}
          />
          <button type="button" onClick={() => setEtapa({ tipo: 'CNS' })} className={`${BOTAO_CONTORNO} cursor-pointer`}>Buscar outro Cartão SUS</button>
        </div>
      )}

      {etapa.tipo === 'DESTINO' && (
        <div className="flex flex-col gap-3">
          <p className="font-semibold">Orientação {orientacao.idOrientacao} vinculada a {etapa.cidadao.nmCidadao}.</p>
          {carregando && <Loading />}
          {erroHorarios && <MensagemErro mensagem={erroHorarios} onRetry={recarregar} />}
          {!carregando && !erroHorarios && escolhido && (
            <>
              <div className="flex flex-col gap-1">
                <label htmlFor="horarioBalcao" className="font-semibold">Horário livre (sugerido: o mais próximo)</label>
                <select id="horarioBalcao" value={escolhido.idHorario} onChange={(e) => setIdHorario(Number(e.target.value))}
                  className="min-h-12 rounded-xl border border-borda bg-branco px-4 outline-none focus:ring-2 focus:ring-primaria">
                  {livres.map((h) => <option key={h.idHorario} value={h.idHorario}>{fmtDiaHora(h.dtHorario)}</option>)}
                </select>
              </div>
              <button type="button" onClick={() => void agendar(etapa.cidadao)} disabled={enviando} className={`${BOTAO_PRIMARIO} cursor-pointer disabled:opacity-60`}>
                <FiCalendar aria-hidden /> {enviando ? 'Agendando...' : 'Agendar'}
              </button>
            </>
          )}
          {!carregando && !erroHorarios && !escolhido && (
            <>
              <p className="rounded-xl bg-mentaSuave p-3 font-semibold text-textoSuave">Sem horário livre nesta UBS.</p>
              {listaDoDiaAberta(agora()) ? (
                <button type="button" onClick={() => void colocarNaLista(etapa.cidadao)} disabled={enviando} className={`${BOTAO_PRIMARIO} cursor-pointer disabled:opacity-60`}>
                  <FiList aria-hidden /> {enviando ? 'Aguarde...' : `Colocar na lista do dia (${nomeCor})`}
                </button>
              ) : (
                <p className="rounded-xl bg-mentaSuave p-3 font-semibold text-textoSuave" role="status">{MENSAGEM_LISTA_SO_DIA_UTIL}</p>
              )}
            </>
          )}
        </div>
      )}

      {etapa.tipo === 'AGENDADO' && (
        <div className="flex flex-col gap-2 rounded-xl border-2 border-primaria bg-branco p-4" role="status">
          <p className="flex items-center gap-2 text-lg font-extrabold text-primaria"><FiCheckCircle aria-hidden /> Consulta agendada</p>
          <p>{etapa.cidadao.nmCidadao} · {fmtDiaHora(etapa.dtHorario)}</p>
          <p className="text-sm text-textoSuave">Quando precisar de confirmação, ela aparece na aba Pendentes (telefone ou presencial).</p>
        </div>
      )}

      {etapa.tipo === 'NA_LISTA' && (
        <div className="flex flex-col gap-2 rounded-xl border-2 border-primaria bg-branco p-4" role="status">
          <p className="flex items-center gap-2 text-lg font-extrabold text-primaria"><FiCheckCircle aria-hidden /> Na lista do dia</p>
          <p>
            {etapa.cidadao.nmCidadao} · {posicaoNaFila(estado.listaDoDia.filter((x) => x.idUnidade === idUnidade), etapa.idEntrada)}º da fila ({nomeCor})
          </p>
          <p className="text-sm text-textoSuave">Quando surgir vaga, ofereça pela aba Lista do dia e registre a resposta.</p>
        </div>
      )}
    </section>
  );
}
