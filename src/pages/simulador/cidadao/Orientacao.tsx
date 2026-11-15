/**
 * Página: Orientação (aba Cidadão → celular, /simulador/cidadao/orientacao)
 * Faz as perguntas uma por vez (Sim/Não, Sim/Não/Não sei, número, escala de dor e múltipla escolha),
 * começando pelo perfil (para quem é, idade, sexo, gestação) e pela dor. Quando as regras já têm
 * a cor, vai para o Resultado.
 * Veio do protótipo: src/pages/cidadao/Orientacao.tsx.
 * Endpoints: nenhum (as regras rodam no front: data/perguntas.ts + services/regrasOrientacao.ts).
 * Estados: sem orientação em andamento (vazio), pergunta, menor de 18 anos, poucos sintomas de gripe
 * e sugestão de trocar dor de garganta por síndrome gripal.
 */
import type { ReactNode } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { FiAlertTriangle, FiInfo } from 'react-icons/fi';
import AvisoPrevia from '../../../components/AvisoPrevia';
import EstadoVazio from '../../../components/EstadoVazio';
import { BOTAO_CONTORNO, BOTAO_EMERGENCIA, BOTAO_PRIMARIO } from '../../../components/celular/classes';
import PerguntaAtual, { BotaoPerguntaAnterior } from '../../../components/orientacao/PerguntaAtual';
import { useSimulador } from '../../../context/useSimulador';
import { obterQueixa } from '../../../data/queixas';
import { agora } from '../../../lib/relogio';
import { respostasEfetivas, textoAvisoFicha, usouFicha } from '../../../services/fichaOrientacao';
import { BASE_CELULAR } from '../../../services/navegacao';
import { proximoPasso } from '../../../services/regrasOrientacao';

/** Caixa usada quando a orientação termina antes do resultado (menor de idade, poucos sintomas...). */
function Encerramento({ titulo, children }: { titulo: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-4 rounded-xl border border-borda bg-branco p-4 shadow-leve">
      <h2 className="text-xl font-extrabold text-primaria">{titulo}</h2>
      {children}
    </div>
  );
}

/** Tela de perguntas da orientação. */
export default function Orientacao() {
  const { estado, responder, voltarPergunta, trocarQueixa } = useSimulador();
  const atual = estado.orientacaoAtual;
  // Respostas digitadas + as que vêm do cadastro e da ficha (só quando a orientação é "Para mim" e há login).
  const efetivas = respostasEfetivas(estado, agora());
  const passo = atual && efetivas ? proximoPasso(atual.codigoQueixa, efetivas.respostas) : null;

  if (!atual || !efetivas || !passo) {
    return (
      <div className="flex flex-col gap-4">
        <EstadoVazio mensagem="Nenhuma orientação em andamento." />
        <Link to={`${BASE_CELULAR}/inicio`} className={BOTAO_PRIMARIO}>Escolher o que estou sentindo</Link>
      </div>
    );
  }

  // As regras já chegaram a uma cor: mostra o resultado (replace: o "voltar" do navegador não volta aqui).
  if (passo.tipo === 'RESULTADO') return <Navigate to={`${BASE_CELULAR}/resultado`} replace />;

  return (
    <div className="flex flex-col gap-5">
      <p className="text-base font-bold text-textoSuave">{obterQueixa(atual.codigoQueixa).nmQueixa}</p>

      {/* Transparência: avisa o que foi tirado do cadastro e da ficha */}
      {efetivas.usados.length > 0 && (
        <div className="-mt-3 flex flex-col gap-1">
          <p className="flex items-start gap-2 text-sm text-textoSuave">
            <FiInfo className="mt-0.5 shrink-0" aria-hidden /> {textoAvisoFicha(efetivas.usados)}
          </p>
          {usouFicha(efetivas.usados) && <AvisoPrevia />}
        </div>
      )}

      {passo.tipo === 'PERGUNTA' && (
        <PerguntaAtual pergunta={passo.pergunta} progresso={passo.progresso} respostas={efetivas.respostas} onResponder={responder} />
      )}

      {/* Regra: a orientação é só para adultos */}
      {passo.tipo === 'MENOR_IDADE' && (
        <Encerramento titulo="Esta orientação é para adultos">
          <p>Para menores de 18 anos, procure a UBS mais próxima. Em caso de risco, ligue para o SAMU.</p>
          <Link to={`${BASE_CELULAR}/emergencia`} className={BOTAO_EMERGENCIA}>
            <FiAlertTriangle aria-hidden /> Emergência
          </Link>
          <Link to={`${BASE_CELULAR}/inicio`} className={BOTAO_CONTORNO}>Voltar ao início</Link>
        </Encerramento>
      )}

      {/* Regra: síndrome gripal precisa de pelo menos 2 sintomas */}
      {passo.tipo === 'POUCOS_SINTOMAS' && (
        <Encerramento titulo="Pode não ser síndrome gripal">
          <p>Com menos de 2 sintomas, escolha outra queixa ou procure a UBS.</p>
          <Link to={`${BASE_CELULAR}/inicio`} className={BOTAO_PRIMARIO}>Escolher outra queixa</Link>
        </Encerramento>
      )}

      {/* Regra: dor de garganta com tosse ou coriza segue o fluxo de síndrome gripal */}
      {passo.tipo === 'SUGERIR_GRIPAL' && (
        <Encerramento titulo="Parece síndrome gripal">
          <p>Dor de garganta com tosse ou coriza é melhor avaliada no fluxo de síndrome gripal.</p>
          <button type="button" onClick={() => trocarQueixa('GRIPAL')} className={`${BOTAO_PRIMARIO} cursor-pointer`}>
            Ir para síndrome gripal
          </button>
        </Encerramento>
      )}

      {atual.ordem.length > 0 && <BotaoPerguntaAnterior onVoltar={voltarPergunta} />}
    </div>
  );
}
