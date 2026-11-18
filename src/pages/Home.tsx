/**
 * Página: Home (rota "/", página institucional)
 * Apresenta o Acolhe+: o topo com a queixa girando no título e os números do problema,
 * como funciona a orientação (3 passos e o significado das cores) e para quem é a solução.
 * Veio da demonstração aprovada 01-home.html (direção A, serviço público, sem imagem).
 * Endpoints: nenhum (textos fixos de src/data/home.ts e cores de src/data/cores.ts).
 * Estados: não chama API, então não tem carregando, erro ou vazio.
 */
import Etiqueta from '../components/Etiqueta';
import LinkBotao from '../components/LinkBotao';
import QuadroCores from '../components/QuadroCores';
import QueixaGirando from '../components/QueixaGirando';
import { NUMEROS_PROBLEMA, PASSOS_ORIENTACAO, PUBLICOS, QUEIXAS_HOME } from '../data/home';

/**
 * Home do site. Só dois caminhos levam ao simulador: o item "Simulador" do menu
 * e o botão "Fazer a orientação" do topo.
 */
export default function Home() {
  return (
    <>
      {/* 1. Topo: título com a queixa girando e, ao lado, os números do problema */}
      <section className="bg-branco">
        <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 py-14 lg:grid-cols-2 lg:px-6 lg:py-20">
          <div className="flex flex-col gap-6">
            <Etiqueta>A pessoa certa, no lugar certo, na vaga que ia sobrar.</Etiqueta>
            <h1 className="text-3xl font-extrabold leading-tight text-primaria sm:text-5xl">
              Saiba onde buscar atendimento no SUS para
              <QueixaGirando queixas={QUEIXAS_HOME} />
            </h1>
            <p className="text-lg leading-relaxed text-texto">
              Responda a perguntas curtas e veja se o caso é para o SAMU, o pronto-socorro, a UPA ou a UBS. Quando
              dá para cuidar na UBS, o Acolhe+ mostra os horários livres, inclusive os que ficariam vazios por falta.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row">
              <LinkBotao para="/simulador">Fazer a orientação</LinkBotao>
              <LinkBotao para="/solucao" variante="secundario">
                Entender a solução
              </LinkBotao>
            </div>
            {/* Regra: a plataforma orienta, não faz diagnóstico. */}
            <p className="text-sm text-textoSuave">
              A orientação não faz diagnóstico e não substitui a avaliação de um profissional de saúde.
            </p>
          </div>

          <dl className="flex flex-col divide-y divide-borda rounded-3xl border border-borda bg-fundo px-6">
            {NUMEROS_PROBLEMA.map(({ valor, texto, fonte }) => (
              <div key={valor} className="py-5">
                <dt className="text-4xl font-extrabold text-primaria">{valor}</dt>
                <dd className="mt-1 text-texto">{texto}</dd>
                <dd className="text-sm text-textoSuave">{fonte}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* 2. Como funciona a orientação: 3 passos e o significado das cores */}
      <section className="bg-branco">
        <div className="mx-auto max-w-6xl px-4 py-14 lg:px-6">
          <h2 className="text-2xl font-extrabold text-primaria sm:text-3xl">Como funciona a orientação</h2>
          <ol className="mt-8 grid gap-6 md:grid-cols-3">
            {PASSOS_ORIENTACAO.map(({ titulo, texto }, i) => (
              <li key={titulo} className="flex flex-col gap-3">
                <span
                  aria-hidden="true"
                  className="flex h-11 w-11 items-center justify-center rounded-full bg-menta text-lg font-extrabold text-primariaEscura"
                >
                  {i + 1}
                </span>
                <h3 className="text-xl font-bold text-primaria">{titulo}</h3>
                <p className="text-texto">{texto}</p>
              </li>
            ))}
          </ol>
          <div className="mt-12">
            <QuadroCores />
          </div>
        </div>
      </section>

      {/* 3. Para quem é */}
      <section className="bg-mentaSuave">
        <div className="mx-auto max-w-6xl px-4 py-14 lg:px-6">
          <h2 className="text-2xl font-extrabold text-primaria sm:text-3xl">Para quem é</h2>
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {PUBLICOS.map(({ titulo, texto }) => (
              <div key={titulo} className="rounded-2xl bg-branco p-6 shadow-leve">
                <h3 className="text-xl font-bold text-primaria">{titulo}</h3>
                <p className="mt-2 text-texto">{texto}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
