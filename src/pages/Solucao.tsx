/**
 * Página: Solução (rota "/solucao", página da solução)
 * Explica como o Acolhe+ funciona: orientação, agendamento e lista do dia, confirmação,
 * impacto esperado (hipóteses e indicadores), tecnologia, modelo de negócio e limites.
 * Veio da demonstração aprovada 03-solucao.html, com a seção "Impacto esperado" dentro da página.
 * Endpoints: nenhum (textos fixos de src/data/solucao.ts e cores de src/data/cores.ts).
 * Estados: não chama API, então não tem carregando, erro ou vazio.
 */
import AtalhosPagina from '../components/AtalhosPagina';
import Etiqueta from '../components/Etiqueta';
import LinkBotao from '../components/LinkBotao';
import ListaIndicadores from '../components/ListaIndicadores';
import ResultadoCores from '../components/ResultadoCores';
import {
  ATALHOS_SOLUCAO,
  BENEFICIOS,
  CAMADAS,
  ETAPAS_LISTA_DO_DIA,
  ETIQUETAS_NEGOCIO,
  INDICADORES,
  LIMITES,
  MEDICAO,
  MODELO_NEGOCIO,
  PASSOS_SOLUCAO,
  PRAZOS_CONFIRMACAO,
  REGRAS_CONFIRMACAO,
  RESULTADOS_COR,
} from '../data/solucao';

/** Classe do título das seções numeradas. */
const TITULO_SECAO = 'text-2xl font-extrabold text-primaria sm:text-3xl';

/** Letras das etapas da lista do dia (a, b, c, d). */
const LETRAS = 'abcdefgh';

/**
 * Página Solução. Único caminho para o simulador: o botão "Ver no simulador", no fim.
 * As seções com id recebem scroll-mt-6 para o título não ficar colado no topo ao usar os atalhos.
 */
export default function Solucao() {
  return (
    <>
      {/* Abertura com os atalhos para as seções */}
      <section className="bg-branco">
        <div className="mx-auto flex max-w-6xl flex-col px-4 py-14 lg:px-6 lg:py-20">
          <Etiqueta>A solução</Etiqueta>
          <h1 className="mt-5 max-w-3xl text-3xl font-extrabold leading-tight text-primaria sm:text-5xl">
            Como o Acolhe+ funciona
          </h1>
          <p className="mt-5 max-w-3xl text-lg leading-relaxed text-texto">
            Uma plataforma com duas frentes: o aplicativo do cidadão, que orienta e agenda, e o painel da recepção da
            UBS, que confirma as consultas e oferece as vagas liberadas.
          </p>
          <AtalhosPagina atalhos={ATALHOS_SOLUCAO} />
        </div>
      </section>

      {/* 1. Orientação: do sintoma ao serviço certo */}
      <section id="orientacao" className="scroll-mt-6 border-y border-borda bg-fundo">
        <div className="mx-auto max-w-6xl px-4 py-14 lg:px-6">
          <h2 className={TITULO_SECAO}>1. Orientação: do sintoma ao serviço certo</h2>
          <p className="mt-3 max-w-3xl text-texto">
            A orientação é feita sem login. A lógica é inspirada no Sistema Manchester, que liga cada nível de gravidade
            a uma cor.
          </p>

          <ol className="mt-8 grid gap-4 lg:grid-cols-[1fr_1fr_1.3fr] lg:items-stretch">
            {PASSOS_SOLUCAO.map(({ titulo, texto }, i) => (
              <li key={titulo} className="rounded-2xl border border-borda bg-branco p-6 shadow-leve">
                <span
                  aria-hidden="true"
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-menta font-extrabold text-primariaEscura"
                >
                  {i + 1}
                </span>
                <h3 className="mt-3 text-lg font-bold text-primaria">{titulo}</h3>
                <p className="mt-1 text-texto">{texto}</p>
              </li>
            ))}
            <li className="rounded-2xl border border-borda bg-branco p-6 shadow-leve">
              <span
                aria-hidden="true"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-menta font-extrabold text-primariaEscura"
              >
                {PASSOS_SOLUCAO.length + 1}
              </span>
              <h3 className="mt-3 text-lg font-bold text-primaria">Resultado</h3>
              <ResultadoCores resultados={RESULTADOS_COR} />
            </li>
          </ol>

          <div className="mt-4 grid gap-4 md:grid-cols-2">
            {/* Regra: a emergência não passa pelo questionário nem pede login. */}
            <div className="rounded-2xl border-2 border-gravidade-vermelho bg-branco p-6">
              <h3 className="text-lg font-bold text-gravidade-vermelho">Caminho direto de emergência</h3>
              <p className="mt-1 text-texto">
                Em qualquer tela, sem questionário: SAMU 192 com o roteiro da ligação e Disque-Intoxicação (0800 722
                6001), gratuito e 24 horas.
              </p>
            </div>
            <div className="rounded-2xl border border-borda bg-branco p-6">
              <h3 className="text-lg font-bold text-primaria">Prefere ir à UBS?</h3>
              <p className="mt-1 text-texto">
                A pessoa recebe um código válido no mesmo dia. Na recepção, a orientação é recuperada sem refazer as
                perguntas.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Agendamento e lista do dia */}
      <section id="vagas" className="scroll-mt-6 bg-branco">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 lg:grid-cols-2 lg:px-6">
          <div className="flex flex-col gap-4">
            <h2 className={TITULO_SECAO}>2. Agendamento e lista do dia</h2>
            <p className="text-texto">
              Nos casos verdes e azuis, a pessoa vê os horários livres nas UBS próximas, inclusive os liberados por
              cancelamento ou falta de confirmação. O login com Cartão SUS (CNS) e senha só é pedido nesse momento.
            </p>
            <p className="text-texto">
              Sem horário livre, ela entra na <strong>lista do dia</strong> de uma UBS próxima. A lista funciona só nos
              dias úteis e segue a cor da orientação (verde antes de azul) e a ordem de chegada.
            </p>
          </div>
          <ol className="flex flex-col gap-3">
            {ETAPAS_LISTA_DO_DIA.map((etapa, i) => {
              // A última etapa (prioridade no dia seguinte) fica em destaque.
              const ultima = i === ETAPAS_LISTA_DO_DIA.length - 1;
              return (
                <li
                  key={etapa}
                  className={`flex gap-4 rounded-2xl p-4 ${ultima ? 'border-2 border-menta bg-mentaSuave' : 'border border-borda bg-fundo'}`}
                >
                  <span aria-hidden="true" className="font-extrabold text-primaria">
                    {LETRAS[i]}
                  </span>
                  <p className="text-texto">{etapa}</p>
                </li>
              );
            })}
          </ol>
        </div>
      </section>

      {/* 3. Confirmação e liberação de horários */}
      <section id="confirmacao" className="scroll-mt-6 bg-mentaSuave">
        <div className="mx-auto max-w-6xl px-4 py-14 lg:px-6">
          <h2 className={TITULO_SECAO}>3. Confirmação e liberação de horários</h2>
          <p className="mt-3 max-w-3xl text-texto">
            Depois do agendamento, um modelo de aprendizado de máquina estima o risco de falta. Esse risco só antecipa a
            confirmação: ele nunca tira a vaga de ninguém.
          </p>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {PRAZOS_CONFIRMACAO.map(({ rotulo, valor, texto }) => (
              <div key={rotulo} className="rounded-2xl bg-branco p-6 shadow-leve">
                <p className="text-sm font-bold text-textoSuave">{rotulo}</p>
                <p className="mt-1 text-2xl font-extrabold text-primaria">{valor}</p>
                <p className="mt-1 text-texto">{texto}</p>
              </div>
            ))}
          </div>
          <ul className="mt-6 grid gap-3 text-texto md:grid-cols-3">
            {REGRAS_CONFIRMACAO.map((regra) => (
              <li key={regra} className="rounded-2xl bg-branco/60 p-4">
                {regra}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Sem celular também funciona (atendimento no balcão da recepção) */}
      <section className="bg-branco">
        <div className="mx-auto max-w-6xl px-4 py-14 lg:px-6">
          <div className="grid gap-6 rounded-3xl bg-primaria p-8 text-branco md:grid-cols-[1fr_2fr] md:items-center">
            <h2 className="text-2xl font-extrabold">Sem celular também funciona</h2>
            <p className="text-branco/90">
              A recepção da UBS faz a orientação, o cadastro (sem senha e sem exigir telefone), o agendamento e as
              ofertas de vaga no balcão. A cada agendamento, o telefone é conferido e é possível cadastrar um contato de
              recado.
            </p>
          </div>
        </div>
      </section>

      {/* 4. Impacto esperado (hipóteses) e como será medido */}
      <section id="impacto" className="scroll-mt-6 bg-mentaSuave">
        <div className="mx-auto max-w-6xl px-4 py-14 lg:px-6">
          <h2 className={TITULO_SECAO}>4. Impacto esperado</h2>
          <p className="mt-3 max-w-3xl text-texto">
            Os benefícios abaixo são hipóteses. Eles só podem ser confirmados com um teste piloto, comparando os
            indicadores antes e depois da implantação.
          </p>
          <div className="mt-8 grid gap-4 md:grid-cols-2">
            {BENEFICIOS.map(({ titulo, itens }) => (
              <div key={titulo} className="rounded-2xl bg-branco p-6 shadow-leve">
                <h3 className="text-lg font-bold text-primaria">{titulo}</h3>
                <ul className="mt-3 flex list-disc flex-col gap-2 pl-5 text-texto">
                  {itens.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <p className="mt-4 max-w-3xl text-sm text-textoSuave">
            Experiências de confirmação e redistribuição de vagas mostram ganhos modestos, mas mensuráveis: em uma
            unidade de São Paulo, o absenteísmo caiu 2 pontos percentuais.
          </p>

          <h3 className="mt-10 text-xl font-bold text-primaria">Como o impacto será medido</h3>
          <ListaIndicadores indicadores={INDICADORES} />
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {MEDICAO.map(({ rotulo, texto }) => (
              <div key={rotulo} className="rounded-2xl border-2 border-primaria bg-branco p-5">
                <p className="font-bold text-primaria">{rotulo}</p>
                <p className="mt-1 text-texto">{texto}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Tecnologia (camadas da Tabela 5) */}
      <section id="tecnologia" className="scroll-mt-6 border-y border-borda bg-fundo">
        <div className="mx-auto max-w-6xl px-4 py-14 lg:px-6">
          <h2 className={TITULO_SECAO}>5. Tecnologia</h2>
          <p className="mt-3 max-w-3xl text-texto">
            Quatro camadas, com as tecnologias trabalhadas nas disciplinas do curso, e uma aplicação à parte para testar
            a rotina da recepção.
          </p>
          <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {CAMADAS.map(({ rotulo, valor, texto }) => (
              <div key={rotulo} className="rounded-2xl border border-borda bg-branco p-6">
                <p className="text-sm font-bold text-textoSuave">{rotulo}</p>
                <p className="mt-1 font-bold text-primaria">{valor}</p>
                <p className="mt-2 text-texto">{texto}</p>
              </div>
            ))}
            <div className="rounded-2xl border-2 border-menta bg-mentaSuave p-6">
              <p className="text-sm font-bold text-primaria">Indicadores no painel</p>
              <p className="mt-2 text-texto">
                Taxa de absenteísmo, reaproveitamento de horários, comparecimento após orientação e pessoas não
                encaixadas, por UBS.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Modelo de negócio (B2G) */}
      <section id="negocio" className="scroll-mt-6 bg-branco">
        <div className="mx-auto max-w-6xl px-4 py-14 lg:px-6">
          <h2 className={TITULO_SECAO}>6. Modelo de negócio</h2>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {MODELO_NEGOCIO.map(({ rotulo, texto }) => (
              <div key={rotulo} className="rounded-2xl border border-borda p-6">
                <p className="text-sm font-bold text-textoSuave">{rotulo}</p>
                <p className="mt-2 text-texto">{texto}</p>
              </div>
            ))}
          </div>
          <ul className="mt-4 flex flex-wrap gap-2 text-sm font-bold">
            {ETIQUETAS_NEGOCIO.map((etiqueta) => (
              <li key={etiqueta} className="rounded-full bg-mentaSuave px-3 py-1 text-primaria">
                {etiqueta}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* 7. O que o Acolhe+ não faz */}
      <section id="limites" className="scroll-mt-6 border-t border-borda bg-fundo">
        <div className="mx-auto max-w-6xl px-4 py-14 lg:px-6">
          <h2 className={TITULO_SECAO}>7. O que o Acolhe+ não faz</h2>
          <ul className="mt-6 grid gap-3 md:grid-cols-2">
            {LIMITES.map(({ destaque, texto }) => (
              <li key={destaque} className="rounded-2xl border border-borda bg-branco p-5 text-texto">
                <strong className="text-primaria">{destaque}</strong> {texto}
              </li>
            ))}
          </ul>
          <div className="mt-8">
            <LinkBotao para="/simulador">Ver no simulador</LinkBotao>
          </div>
        </div>
      </section>
    </>
  );
}
