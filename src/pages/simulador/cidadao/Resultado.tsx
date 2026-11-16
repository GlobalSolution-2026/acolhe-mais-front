/**
 * Página: Resultado da orientação (aba Cidadão → celular, /simulador/cidadao/resultado)
 * Mostra a cor e o destino: vermelho → SAMU 192 (com o roteiro da ligação); laranja → pronto-socorro;
 * amarelo → UPA mais próxima; verde/azul → UBS ("O que fazer até a consulta", "Procure a urgência se...",
 * horários nas UBS e o código para mostrar na recepção).
 * Antes de mostrar verde ou azul, chama a verificação de urgência (Modelo 2), que só pode elevar para amarelo.
 * Veio do protótipo: src/pages/cidadao/Resultado.tsx.
 * Endpoints: POST /verificar-urgencia (API Flask, só em verde/azul), GET /unidades (API Java, UPA e UBS indicadas)
 * e a orientação salva (só no front, demonstração).
 * Estados: concluindo (carregando), erro ao salvar (tentar de novo), sem orientação (vazio),
 * carregando/erro/vazio na busca da UPA e da UBS, e aviso discreto quando a verificação de IA falha.
 */
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { FiAlertCircle, FiCalendar, FiExternalLink, FiHash, FiInfo, FiMapPin, FiPhone, FiPhoneCall } from 'react-icons/fi';
import EstadoVazio from '../../../components/EstadoVazio';
import LegendaCores from '../../../components/LegendaCores';
import Loading from '../../../components/Loading';
import MensagemErro from '../../../components/MensagemErro';
import SeloGravidade from '../../../components/SeloGravidade';
import RoteiroLigacao from '../../../components/celular/RoteiroLigacao';
import { BOTAO_CONTORNO, BOTAO_EMERGENCIA, BOTAO_PRIMARIO } from '../../../components/celular/classes';
import { useSimulador } from '../../../context/useSimulador';
import { orientacoesUbs } from '../../../data/orientacoesUbs';
import { obterQueixa } from '../../../data/queixas';
import { agora } from '../../../lib/relogio';
import { listarUnidades } from '../../../services/api';
import { respostasEfetivas } from '../../../services/fichaOrientacao';
import { BASE_CELULAR } from '../../../services/navegacao';
import { concluirOrientacao, ordenarUbsPorCep, upaMaisProxima } from '../../../services/orientacao';
import type { Unidade } from '../../../types';
import type { OrientacaoEmAndamento, ResultadoFinal } from '../../../types/orientacao';
import { mensagemDoErro } from '../../../utils/erros';
import { formatarCep, formatarTelefone } from '../../../utils/formatadores';

/** Lista dos sinais que levaram à cor (vazia = não mostra nada). */
function ListaSinais({ sinais }: { sinais: string[] }) {
  if (sinais.length === 0) return null;
  return (
    <div>
      <h3 className="font-bold">Sinais marcados</h3>
      <ul className="list-disc pl-6">
        {sinais.map((s) => <li key={s}>{s}</li>)}
      </ul>
    </div>
  );
}

/** Nome, endereço e telefone (com link para ligar) de uma unidade indicada. */
function DadosUnidade({ unidade }: { unidade: Unidade }) {
  return (
    <>
      <h3 className="text-lg font-extrabold">{unidade.nmUnidade}</h3>
      <p className="flex items-start gap-2 text-textoSuave">
        <FiMapPin className="mt-1 shrink-0" aria-hidden />
        {unidade.dsEndereco} · CEP {formatarCep(unidade.nrCep)}
      </p>
      <a href={`tel:${unidade.nrTelefone.replace(/\D/g, '')}`} className="flex min-h-12 items-center gap-2 font-bold text-primaria">
        <FiPhone aria-hidden /> {formatarTelefone(unidade.nrTelefone)}
      </a>
    </>
  );
}

/**
 * Busca as unidades de um tipo e escolhe a indicada pelo CEP (com carregando, erro e tentar de novo).
 * GET /unidades (API Java).
 */
function useUnidadeIndicada(tipo: Unidade['tpUnidade'], escolher: (unidades: Unidade[]) => Unidade | null) {
  const [unidade, setUnidade] = useState<Unidade | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);
  // Muda a cada "Tentar novamente" para o efeito buscar de novo.
  const [tentativa, setTentativa] = useState(0);

  useEffect(() => {
    // ativo = false quando a tela fecha: a resposta que chegar depois é ignorada.
    let ativo = true;
    listarUnidades(tipo)
      .then((unidades) => {
        if (!ativo) return;
        setUnidade(escolher(unidades));
        setErro(null);
      })
      .catch((e) => {
        if (ativo) setErro(mensagemDoErro(e));
      })
      .finally(() => {
        if (ativo) setCarregando(false);
      });
    return () => {
      ativo = false;
    };
  }, [tipo, escolher, tentativa]);

  /** Botão "Tentar novamente" da MensagemErro. */
  const tentarDeNovo = () => {
    setCarregando(true);
    setErro(null);
    setTentativa((t) => t + 1);
  };

  return { unidade, carregando, erro, tentarDeNovo };
}

/** Vermelho: ligar já para o SAMU 192, com o roteiro do que falar. */
function Vermelho({ atual, res }: { atual: OrientacaoEmAndamento; res: ResultadoFinal }) {
  return (
    <>
      <h1 className="text-2xl font-extrabold">Ligue agora para o SAMU 192</h1>
      <a href="tel:192" className={`${BOTAO_EMERGENCIA} min-h-14 text-xl`}>
        <FiPhoneCall aria-hidden /> Ligar para o 192
      </a>
      <RoteiroLigacao nrCep={atual.nrCep} local={atual} nmQueixa={obterQueixa(atual.codigoQueixa).nmQueixa} sinais={res.sinaisMarcados} />
    </>
  );
}

/** Laranja: ir ao pronto-socorro de um hospital público ou que atenda pelo SUS. */
function Laranja({ res }: { res: ResultadoFinal }) {
  return (
    <>
      <h1 className="text-2xl font-extrabold">Vá ao pronto-socorro de um hospital público ou que atenda pelo SUS</h1>
      <ListaSinais sinais={res.sinaisMarcados} />
      <a href="https://buscasaude.prefeitura.sp.gov.br/" target="_blank" rel="noopener noreferrer" className={BOTAO_CONTORNO}>
        <FiExternalLink aria-hidden /> Ver prontos-socorros no Busca Saúde
        <span className="sr-only"> (abre em nova aba)</span>
      </a>
      <p className="rounded-xl bg-mentaSuave p-4 font-extrabold text-primaria">
        Se não tiver como chegar com segurança, ou se piorar no caminho, ligue 192
      </p>
      <a href="tel:192" className={BOTAO_PRIMARIO}>
        <FiPhoneCall aria-hidden /> Ligar para o 192
      </a>
    </>
  );
}

/** Amarelo: procurar a UPA mais próxima do CEP. Mostra quando a cor foi elevada pela IA. */
function Amarelo({ atual, res }: { atual: OrientacaoEmAndamento; res: ResultadoFinal }) {
  const escolher = useCallback((upas: Unidade[]) => upaMaisProxima(upas, atual.nrCep), [atual.nrCep]);
  const { unidade: upa, carregando, erro, tentarDeNovo } = useUnidadeIndicada('UPA', escolher);

  return (
    <>
      <h1 className="text-2xl font-extrabold">Procure uma UPA</h1>
      {/* Regra: o Modelo 2 só eleva a cor. Aqui as regras deram verde/azul e a IA subiu para amarelo. */}
      {res.flElevadaModelo && (
        <p className="flex items-start gap-2 rounded-xl border-2 border-gravidade-amarelo bg-branco p-3 font-semibold">
          <FiAlertCircle className="mt-1 shrink-0" aria-hidden />
          Pelas respostas, o caso seria atendido na UBS, mas a verificação adicional de urgência indicou atenção.
          Por segurança, a cor subiu para amarelo: procure a UPA.
        </p>
      )}
      {carregando && <Loading />}
      {erro && <MensagemErro mensagem={erro} onRetry={tentarDeNovo} />}
      {!carregando && !erro && !upa && <EstadoVazio mensagem="Nenhuma UPA encontrada." />}
      {!carregando && !erro && upa && (
        <section className="rounded-xl border border-borda bg-branco p-4 shadow-leve">
          <DadosUnidade unidade={upa} />
        </section>
      )}
      <ListaSinais sinais={res.sinaisMarcados} />
      <p className="font-bold">Se piorar, ligue 192.</p>
    </>
  );
}

/** Código para apresentar na recepção (vale só hoje; funciona sem login) + UBS indicada pelo CEP. */
function CodigoParaUbs({ atual, idOrientacao }: { atual: OrientacaoEmAndamento; idOrientacao: number }) {
  const escolher = useCallback((ubs: Unidade[]) => ordenarUbsPorCep(ubs, atual.nrCep)[0] ?? null, [atual.nrCep]);
  const { unidade: ubs, carregando, erro, tentarDeNovo } = useUnidadeIndicada('UBS', escolher);

  return (
    <section className="flex flex-col gap-3 rounded-xl border-2 border-primaria bg-branco p-4" aria-live="polite">
      <h2 className="text-lg font-extrabold text-primaria">Mostre este código na recepção</h2>
      <p className="flex items-center gap-2 text-4xl font-extrabold tracking-wider">
        <FiHash aria-hidden /> <span aria-label={`Código ${idOrientacao}`}>{idOrientacao}</span>
      </p>
      <p className="text-base text-textoSuave">O código vale só para hoje. Leve o Cartão SUS.</p>
      {carregando && <Loading />}
      {erro && <MensagemErro mensagem={erro} onRetry={tentarDeNovo} />}
      {!carregando && !erro && !ubs && <EstadoVazio mensagem="Nenhuma UBS encontrada." />}
      {!carregando && !erro && ubs && (
        <div>
          <p className="text-sm font-bold text-textoSuave">UBS indicada</p>
          <DadosUnidade unidade={ubs} />
        </div>
      )}
    </section>
  );
}

/** Verde ou azul: UBS, com os cuidados até a consulta e os sinais para procurar a urgência. */
function Ubs({ atual, res }: { atual: OrientacaoEmAndamento; res: ResultadoFinal }) {
  const textos = orientacoesUbs[atual.codigoQueixa];
  const [prefereIr, setPrefereIr] = useState(false);
  return (
    <>
      <h1 className="text-2xl font-extrabold">Procure a UBS</h1>
      {/* Aviso discreto: a verificação de IA falhou e o resultado ficou só com as regras */}
      {res.flVerificacaoIndisponivel && (
        <p className="flex items-start gap-2 text-sm text-textoSuave" role="note">
          <FiInfo className="mt-0.5 shrink-0" aria-hidden />
          A verificação adicional não está disponível agora. O resultado segue as suas respostas.
        </p>
      )}
      <section className="rounded-xl bg-mentaSuave p-4">
        <h2 className="mb-1 font-extrabold text-primaria">O que fazer até a consulta</h2>
        <ul className="list-disc pl-6">
          {textos.cuidados.map((c) => <li key={c}>{c}</li>)}
        </ul>
      </section>
      <section className="rounded-xl border border-borda bg-branco p-4">
        <h2 className="mb-1 font-extrabold text-primaria">Procure a urgência se...</h2>
        <ul className="list-disc pl-6">
          {textos.procureUrgencia.map((c) => <li key={c}>{c}</li>)}
        </ul>
      </section>
      <Link to={`${BASE_CELULAR}/ubs`} className={BOTAO_PRIMARIO}>
        <FiCalendar aria-hidden /> Ver horários nas UBS próximas
      </Link>
      {prefereIr ? (
        <CodigoParaUbs atual={atual} idOrientacao={res.idOrientacao} />
      ) : (
        <button type="button" onClick={() => setPrefereIr(true)} className={`${BOTAO_CONTORNO} cursor-pointer`}>
          <FiMapPin aria-hidden /> Prefiro ir à UBS
        </button>
      )}
    </>
  );
}

/** Tela de resultado: conclui a orientação (regras + IA + salvar) e mostra o destino. */
export default function Resultado() {
  const { estado, definirResultado } = useSimulador();
  const { orientacaoAtual: atual, cidadaos, idCidadaoAtual, fichas } = estado;
  const [erro, setErro] = useState<string | null>(null);
  // Muda a cada "Tentar novamente" para o efeito concluir de novo.
  const [tentativa, setTentativa] = useState(0);
  // Evita concluir duas vezes ao mesmo tempo (o efeito pode rodar de novo antes de terminar).
  const rodando = useRef(false);

  // Mesmas respostas efetivas da tela de Orientação (digitadas + cadastro/ficha).
  const respostas = useMemo(
    () => respostasEfetivas({ orientacaoAtual: atual, cidadaos, idCidadaoAtual, fichas }, agora())?.respostas,
    [atual, cidadaos, idCidadaoAtual, fichas],
  );

  // Conclui a orientação uma vez (regras + verificação de IA + salvar), se ainda não tem resultado.
  useEffect(() => {
    if (!atual || !respostas || atual.resultado || rodando.current) return;
    rodando.current = true;
    // "Para mim" com login: a orientação fica vinculada ao cadastro (lembrete para a equipe da UBS).
    const vinculo = respostas['PF1'] === 'PARA_MIM' ? idCidadaoAtual : null;
    concluirOrientacao(atual.codigoQueixa, respostas, vinculo)
      .then(definirResultado)
      .catch((e) => setErro(mensagemDoErro(e)))
      .finally(() => {
        rodando.current = false;
      });
  }, [atual, respostas, definirResultado, idCidadaoAtual, tentativa]);

  if (!atual) {
    return (
      <div className="flex flex-col gap-4">
        <EstadoVazio mensagem="Nenhuma orientação feita ainda." />
        <Link to={`${BASE_CELULAR}/inicio`} className={BOTAO_PRIMARIO}>Voltar ao início</Link>
      </div>
    );
  }
  if (erro) {
    return (
      <MensagemErro
        mensagem={erro}
        onRetry={() => {
          setErro(null);
          setTentativa((t) => t + 1);
        }}
      />
    );
  }
  const res = atual.resultado;
  if (!res) return <Loading />;

  return (
    <div className="flex flex-col gap-4">
      <SeloGravidade cor={res.dsCor} />
      <LegendaCores destaque={res.dsCor} />
      {res.dsCor === 'VERMELHO' && <Vermelho atual={atual} res={res} />}
      {res.dsCor === 'LARANJA' && <Laranja res={res} />}
      {res.dsCor === 'AMARELO' && <Amarelo atual={atual} res={res} />}
      {(res.dsCor === 'VERDE' || res.dsCor === 'AZUL') && <Ubs atual={atual} res={res} />}
      <p className="text-sm text-textoSuave">
        O Acolhe+ orienta, mas não faz diagnóstico nem substitui a avaliação de profissionais de saúde.
      </p>
      <Link to={`${BASE_CELULAR}/inicio`} className={BOTAO_CONTORNO}>Voltar ao início</Link>
    </div>
  );
}
