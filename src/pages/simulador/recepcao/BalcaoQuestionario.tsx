/**
 * Parte do Balcão: a recepção faz a orientação ali mesmo, com a pessoa (mesmo questionário do app).
 * O estado é local: não usa a ficha de saúde e não mexe na orientação em andamento do celular.
 * Veio do protótipo: src/pages/recepcao/BalcaoQuestionario.tsx.
 * Endpoints: POST /verificar-urgencia (API Flask, só em verde/azul) e a orientação salva (demonstração).
 * Estados: escolha da queixa, pergunta, encerramentos (menor de idade, poucos sintomas, sugerir gripal),
 * "verificação adicional" (carregando) e erro com "Tentar novamente".
 */
import { useEffect, useRef, useState, type ReactNode } from 'react';
import { FiArrowLeft, FiPhoneCall } from 'react-icons/fi';
import Loading from '../../../components/Loading';
import MensagemErro from '../../../components/MensagemErro';
import { BOTAO_EMERGENCIA, BOTAO_PRIMARIO } from '../../../components/celular/classes';
import PerguntaAtual, { BotaoPerguntaAnterior } from '../../../components/orientacao/PerguntaAtual';
import { obterQueixa, queixas } from '../../../data/queixas';
import { buscarOrientacao } from '../../../services/api';
import type { OrientacaoBalcao } from '../../../services/balcao';
import { concluirOrientacao } from '../../../services/orientacao';
import { iniciarQuestionario, proximoPasso, responderNoQuestionario, trocarQueixaNoQuestionario, voltarNoQuestionario } from '../../../services/regrasOrientacao';
import type { CodigoQueixa, OrientacaoEmAndamento } from '../../../types/orientacao';
import { mensagemDoErro } from '../../../utils/erros';

/** Caixa de encerramento antes do resultado. */
function Encerramento({ titulo, children }: { titulo: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-4 rounded-xl border border-borda bg-branco p-4 shadow-leve">
      <h2 className="text-xl font-extrabold text-primaria">{titulo}</h2>
      {children}
    </div>
  );
}

interface BalcaoQuestionarioProps {
  /** CEP da UBS (usado para indicar a UPA mais próxima, se for amarelo). */
  nrCep: string;
  onConcluir: (dados: OrientacaoBalcao) => void;
}

/** Questionário de orientação feito no balcão. */
export default function BalcaoQuestionario({ nrCep, onConcluir }: BalcaoQuestionarioProps) {
  const [atual, setAtual] = useState<OrientacaoEmAndamento | null>(null);
  const [escolhendo, setEscolhendo] = useState(true);
  const [erro, setErro] = useState<string | null>(null);
  const [tentativa, setTentativa] = useState(0);
  const rodando = useRef(false);
  const passo = atual && !escolhendo ? proximoPasso(atual.codigoQueixa, atual.respostas) : null;

  /** Primeira escolha inicia; as seguintes trocam a queixa mantendo o perfil. */
  const escolher = (codigo: CodigoQueixa) => {
    setAtual((o) => (o ? trocarQueixaNoQuestionario(o, codigo) : iniciarQuestionario(codigo, nrCep)));
    setEscolhendo(false);
  };

  // Quando as regras chegam à cor: mesmas regras + verificação de IA (só eleva) + salvar, como no app.
  const chegouAoResultado = passo?.tipo === 'RESULTADO';
  useEffect(() => {
    if (!chegouAoResultado || !atual || rodando.current) return;
    rodando.current = true;
    concluirOrientacao(atual.codigoQueixa, atual.respostas)
      .then(async (res) => onConcluir({ orientacao: await buscarOrientacao(res.idOrientacao), sinais: res.sinaisMarcados }))
      .catch((e) => {
        setErro(mensagemDoErro(e));
        rodando.current = false;
      });
  }, [chegouAoResultado, atual, onConcluir, tentativa]);

  if (escolhendo || !atual || !passo) {
    return (
      <div className="flex flex-col gap-3">
        <h2 className="text-xl font-extrabold">Qual a queixa principal?</h2>
        {atual && <p className="text-sm text-textoSuave">As respostas do perfil (idade, sexo, gestação e dor) são mantidas.</p>}
        <div className="grid gap-2 md:grid-cols-2">
          {queixas.map((q) => (
            <button key={q.codigo} type="button" onClick={() => escolher(q.codigo)}
              className="flex min-h-12 w-full cursor-pointer items-center rounded-xl border-2 border-borda bg-branco px-4 text-left text-lg font-bold shadow-leve hover:border-primaria">
              {q.nmQueixa}
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5">
      <p className="text-base font-bold text-textoSuave">{obterQueixa(atual.codigoQueixa).nmQueixa} · sem ficha de saúde</p>

      {passo.tipo === 'PERGUNTA' && (
        <PerguntaAtual pergunta={passo.pergunta} progresso={passo.progresso} respostas={atual.respostas}
          onResponder={(c, v) => setAtual((o) => o && responderNoQuestionario(o, c, v))} />
      )}

      {passo.tipo === 'RESULTADO' &&
        (erro ? (
          <MensagemErro mensagem={erro} onRetry={() => { setErro(null); setTentativa((t) => t + 1); }} />
        ) : (
          <Loading />
        ))}

      {passo.tipo === 'MENOR_IDADE' && (
        <Encerramento titulo="Orientação só para adultos">
          <p>A orientação do Acolhe+ é só para adultos. Encaminhe para o acolhimento da UBS.</p>
          <p className="font-bold">Em caso de risco, acione o SAMU 192.</p>
          <a href="tel:192" className={BOTAO_EMERGENCIA}><FiPhoneCall aria-hidden /> Ligar para o 192</a>
        </Encerramento>
      )}

      {passo.tipo === 'POUCOS_SINTOMAS' && (
        <Encerramento titulo="Pode não ser síndrome gripal">
          <p>Com menos de 2 sintomas, escolha outra queixa.</p>
          <button type="button" onClick={() => setEscolhendo(true)} className={`${BOTAO_PRIMARIO} cursor-pointer`}>Escolher outra queixa</button>
        </Encerramento>
      )}

      {passo.tipo === 'SUGERIR_GRIPAL' && (
        <Encerramento titulo="Parece síndrome gripal">
          <p>Dor de garganta com tosse ou coriza é melhor avaliada no fluxo de síndrome gripal.</p>
          <button type="button" onClick={() => escolher('GRIPAL')} className={`${BOTAO_PRIMARIO} cursor-pointer`}>Ir para síndrome gripal</button>
        </Encerramento>
      )}

      {passo.tipo !== 'RESULTADO' &&
        (atual.ordem.length > 0 ? (
          <BotaoPerguntaAnterior onVoltar={() => setAtual((o) => o && voltarNoQuestionario(o))} />
        ) : (
          <button type="button" onClick={() => setEscolhendo(true)} className="flex min-h-12 cursor-pointer items-center gap-2 font-bold text-primaria">
            <FiArrowLeft aria-hidden /> Trocar a queixa
          </button>
        ))}
    </div>
  );
}
