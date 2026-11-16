/**
 * Página: Balcão (aba Recepção UBS → Balcão, /simulador/recepcao/balcao)
 * Atendimento de quem chega à UBS, por duas entradas: o código da orientação feita no app ou a
 * orientação feita ali mesmo. Verde/azul segue para o atendimento (cadastro, agendar ou lista do dia);
 * vermelho, laranja e amarelo são encaminhados (SAMU, pronto-socorro ou UPA indicada).
 * Veio do protótipo: src/pages/recepcao/Balcao.tsx.
 * Endpoints: GET /unidades (API Java, UPA indicada); as partes do atendimento chamam os seus.
 * Estados: carregando, erro e vazio na busca da UPA; cada parte trata os próprios estados.
 */
import { useCallback, useState } from 'react';
import { FiAlertCircle, FiClipboard, FiHash, FiMapPin, FiPhone, FiPhoneCall, FiRotateCcw } from 'react-icons/fi';
import EstadoVazio from '../../../components/EstadoVazio';
import Loading from '../../../components/Loading';
import MensagemErro from '../../../components/MensagemErro';
import { BOTAO_CONTORNO, BOTAO_EMERGENCIA, BOTAO_PRIMARIO } from '../../../components/celular/classes';
import ResumoOrientacao from '../../../components/recepcao/ResumoOrientacao';
import { useSimulador } from '../../../context/useSimulador';
import { useCarregar } from '../../../hooks/useCarregar';
import { listarUnidades } from '../../../services/api';
import type { OrientacaoBalcao } from '../../../services/balcao';
import { upaMaisProxima } from '../../../services/orientacao';
import { formatarCep, formatarTelefone } from '../../../utils/formatadores';
import BalcaoAtendimento from './BalcaoAtendimento';
import BalcaoCodigo from './BalcaoCodigo';
import BalcaoQuestionario from './BalcaoQuestionario';

/** Passos do balcão. */
type Etapa =
  | { tipo: 'INICIO' }
  | { tipo: 'CODIGO' }
  | { tipo: 'QUESTIONARIO' }
  | { tipo: 'ENCAMINHAR'; dados: OrientacaoBalcao }
  | { tipo: 'SEGUIR'; dados: OrientacaoBalcao };

/** UPA mais próxima da UBS (para o encaminhamento amarelo). GET /unidades. */
function UpaIndicada({ nrCep }: { nrCep: string }) {
  const { dados, carregando, erro, recarregar } = useCarregar(async () => upaMaisProxima(await listarUnidades('UPA'), nrCep), [nrCep]);
  if (carregando) return <Loading />;
  if (erro) return <MensagemErro mensagem={erro} onRetry={recarregar} />;
  if (!dados) return <EstadoVazio mensagem="Nenhuma UPA encontrada." />;
  return (
    <section className="rounded-xl border border-borda bg-branco p-4 shadow-leve">
      <h3 className="text-lg font-extrabold">{dados.nmUnidade}</h3>
      <p className="flex items-start gap-2 text-textoSuave"><FiMapPin className="mt-1 shrink-0" aria-hidden />{dados.dsEndereco} · CEP {formatarCep(dados.nrCep)}</p>
      <p className="flex min-h-12 items-center gap-2 font-bold text-primaria"><FiPhone aria-hidden /> {formatarTelefone(dados.nrTelefone)}</p>
    </section>
  );
}

/** Vermelho, laranja ou amarelo: mostra o destino e não segue para o agendamento. */
function Encaminhamento({ dados, nrCep }: { dados: OrientacaoBalcao; nrCep: string }) {
  const { orientacao, sinais } = dados;
  const ligar = <a href="tel:192" className={BOTAO_EMERGENCIA}><FiPhoneCall aria-hidden /> Ligar para o 192</a>;
  return (
    <div className="flex flex-col gap-4">
      <ResumoOrientacao orientacao={orientacao} />
      {orientacao.flElevadaModelo && (
        <p className="flex items-start gap-2 rounded-xl bg-mentaSuave p-3 font-semibold">
          <FiAlertCircle className="mt-1 shrink-0" aria-hidden /> A verificação adicional de urgência (IA) elevou a cor para amarelo.
        </p>
      )}
      {sinais.length > 0 && (
        <div>
          <h3 className="font-bold">Sinais marcados</h3>
          <ul className="list-disc pl-6">{sinais.map((s) => <li key={s}>{s}</li>)}</ul>
        </div>
      )}
      {orientacao.dsCor === 'VERMELHO' && <><h2 className="text-xl font-extrabold">Acione o SAMU 192 agora</h2>{ligar}</>}
      {orientacao.dsCor === 'LARANJA' && (
        <>
          <h2 className="text-xl font-extrabold">Encaminhe a um pronto-socorro agora</h2>
          <p>Se não houver como chegar com segurança, ou se piorar, acione o SAMU 192.</p>
          {ligar}
        </>
      )}
      {orientacao.dsCor === 'AMARELO' && (
        <>
          <h2 className="text-xl font-extrabold">Encaminhe para a UPA</h2>
          <UpaIndicada nrCep={nrCep} />
          <p className="font-bold">Se piorar, acione o SAMU 192.</p>
        </>
      )}
      <p className="text-sm text-textoSuave">Este atendimento não segue para o agendamento na UBS.</p>
    </div>
  );
}

/** Tela Balcão da recepção. */
export default function Balcao() {
  const { estado } = useSimulador();
  const idUnidade = estado.idUnidadeRecepcao;
  const unidade = estado.unidades.find((u) => u.idUnidade === idUnidade);
  const nrCep = unidade?.nrCep ?? '';
  const [etapa, setEtapa] = useState<Etapa>({ tipo: 'INICIO' });

  /** Regra: verde/azul segue para o atendimento; as outras cores são encaminhadas. */
  const concluir = useCallback((dados: OrientacaoBalcao) => {
    const ubs = dados.orientacao.dsCor === 'VERDE' || dados.orientacao.dsCor === 'AZUL';
    setEtapa({ tipo: ubs ? 'SEGUIR' : 'ENCAMINHAR', dados });
  }, []);

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-extrabold text-primaria">Balcão — {unidade?.nmUnidade}</h1>

      {etapa.tipo === 'INICIO' && (
        <div className="grid gap-3 md:grid-cols-2">
          <button type="button" onClick={() => setEtapa({ tipo: 'CODIGO' })} className={`${BOTAO_PRIMARIO} min-h-16 cursor-pointer text-lg`}>
            <FiHash aria-hidden /> Tem código
          </button>
          <button type="button" onClick={() => setEtapa({ tipo: 'QUESTIONARIO' })}
            className="flex min-h-16 cursor-pointer items-center justify-center gap-2 rounded-xl border-2 border-primaria bg-branco px-5 text-lg font-bold text-primaria shadow-leve hover:bg-mentaSuave">
            <FiClipboard aria-hidden /> Fazer a orientação aqui
          </button>
          <p className="text-sm text-textoSuave md:col-span-2">Para agendar sem orientação, use "Agendar para quem chegou" na Agenda.</p>
        </div>
      )}

      {etapa.tipo === 'CODIGO' && <BalcaoCodigo onSeguir={concluir} onFazerAqui={() => setEtapa({ tipo: 'QUESTIONARIO' })} />}
      {etapa.tipo === 'QUESTIONARIO' && <BalcaoQuestionario nrCep={nrCep} onConcluir={concluir} />}
      {etapa.tipo === 'ENCAMINHAR' && <Encaminhamento dados={etapa.dados} nrCep={nrCep} />}
      {etapa.tipo === 'SEGUIR' && (
        <>
          <ResumoOrientacao orientacao={etapa.dados.orientacao} />
          <BalcaoAtendimento dados={etapa.dados} idUnidade={idUnidade} nrCep={nrCep} />
        </>
      )}

      {etapa.tipo !== 'INICIO' && (
        <button type="button" onClick={() => setEtapa({ tipo: 'INICIO' })} className={`${BOTAO_CONTORNO} cursor-pointer`}>
          <FiRotateCcw aria-hidden /> Novo atendimento
        </button>
      )}
    </div>
  );
}
