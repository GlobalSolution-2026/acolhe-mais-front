/**
 * Página: Sobre (rota "/sobre", página institucional)
 * Explica o problema que o Acolhe+ ataca: casos leves lotando as urgências e horários da UBS
 * vazios por falta. Mostra como o SUS se organiza, os números das duas pontas, por que o projeto
 * começa por São Paulo e o que já existe no mercado.
 * Veio da demonstração aprovada 02-sobre.html.
 * Endpoints: nenhum (textos fixos de src/data/sobre.ts).
 * Estados: não chama API, então não tem carregando, erro ou vazio.
 */
import Etiqueta from '../components/Etiqueta';
import ListaAlternativas from '../components/ListaAlternativas';
import {
  ACOLHE_COMPARACAO,
  ALTERNATIVAS,
  FONTES_SOBRE,
  NUMEROS_SAO_PAULO,
  PONTAS_PROBLEMA,
  SERVICOS_SUS,
} from '../data/sobre';

/** Página Sobre, na ordem das seções aprovadas na demonstração. */
export default function Sobre() {
  return (
    <>
      {/* 1. Abertura */}
      <section className="bg-branco">
        <div className="mx-auto flex max-w-6xl flex-col px-4 py-14 lg:px-6 lg:py-20">
          <Etiqueta>Sobre o projeto</Etiqueta>
          <h1 className="mt-5 max-w-3xl text-3xl font-extrabold leading-tight text-primaria sm:text-5xl">
            Duas pontas de um mesmo problema
          </h1>
          <p className="mt-5 max-w-3xl text-lg leading-relaxed text-texto">
            Casos leves lotam as urgências enquanto horários da UBS ficam vazios porque o paciente faltou. O Acolhe+
            nasceu para ligar essas duas pontas: quem precisa de atendimento e a vaga que ia sobrar.
          </p>
        </div>
      </section>

      {/* 2. Como o SUS organiza o atendimento */}
      <section className="border-y border-borda bg-fundo">
        <div className="mx-auto max-w-6xl px-4 py-14 lg:px-6">
          <h2 className="text-2xl font-extrabold text-primaria sm:text-3xl">Como o SUS organiza o atendimento</h2>
          <p className="mt-3 max-w-3xl text-texto">
            O SUS é dividido por nível de complexidade. Cada serviço cuida de um tipo de situação, e é essa
            organização que define para onde a pessoa deve ir.
          </p>
          <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {SERVICOS_SUS.map(({ nivel, titulo, texto }) => (
              <div key={titulo} className="rounded-2xl border border-borda bg-branco p-6 shadow-leve">
                <p className="text-sm font-bold text-textoSuave">{nivel}</p>
                <h3 className="mt-1 text-xl font-bold text-primaria">{titulo}</h3>
                <p className="mt-2 text-texto">{texto}</p>
              </div>
            ))}
          </div>
          <div className="mt-6 rounded-2xl border-2 border-menta bg-mentaSuave p-6">
            <h3 className="text-lg font-bold text-primaria">E a Estratégia Saúde da Família?</h3>
            <p className="mt-2 text-texto">
              É o modelo prioritário da Atenção Primária. Cada equipe cuida de 2.000 a 3.500 pessoas de um território,
              e o agente comunitário de saúde orienta as famílias sobre onde buscar atendimento. Só que a cobertura é
              desigual: em 2021, cerca de <strong>72,7 milhões de pessoas</strong> não tinham uma equipe de
              referência, a maioria em cidades grandes.
            </p>
          </div>
        </div>
      </section>

      {/* 3. O problema: as duas pontas e a oportunidade */}
      <section className="bg-branco">
        <div className="mx-auto max-w-6xl px-4 py-14 lg:px-6">
          <h2 className="text-2xl font-extrabold text-primaria sm:text-3xl">O problema</h2>
          <div className="mt-8 grid gap-6 lg:grid-cols-2">
            {PONTAS_PROBLEMA.map(({ rotulo, titulo, texto, numeros }) => (
              <div key={rotulo} className="flex flex-col gap-4 rounded-2xl border border-borda bg-fundo p-6">
                <p className="text-sm font-bold text-textoSuave">{rotulo}</p>
                <h3 className="text-xl font-bold text-primaria">{titulo}</h3>
                <p className="text-texto">{texto}</p>
                <ul className="flex flex-col gap-3">
                  {numeros.map(({ valor, texto: textoNumero }) => (
                    <li key={valor} className="flex items-baseline gap-3">
                      <span className="w-20 shrink-0 text-2xl font-extrabold text-primaria">{valor}</span>
                      <span className="text-texto">{textoNumero}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="mt-6 rounded-2xl bg-primaria p-6 text-branco">
            <h3 className="text-lg font-bold text-menta">A oportunidade</h3>
            <p className="mt-2">
              Confirmar as consultas com antecedência e redistribuir os horários reduz as faltas. Em uma unidade de São
              Paulo, o absenteísmo caiu de 21% para 19%, o que rendeu 560 consultas a mais. O Acolhe+ leva essa ideia
              um passo adiante: a vaga liberada é oferecida a quem foi orientado a procurar a UBS, em vez de ir à UPA.
            </p>
          </div>
        </div>
      </section>

      {/* 4. Por que São Paulo (cenário A; o cenário B, Minas Gerais, fica para uma etapa seguinte) */}
      <section className="bg-mentaSuave">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 lg:grid-cols-2 lg:px-6">
          <div className="flex flex-col gap-4">
            <h2 className="text-2xl font-extrabold text-primaria sm:text-3xl">Por que começamos por São Paulo</h2>
            <p className="text-texto">
              O projeto parte das cidades grandes com pouca cobertura da Saúde da Família. Nelas, muita gente não tem
              uma equipe que acompanhe o seu histórico e diga para onde ir quando aparece um problema de saúde. São
              Paulo é o exemplo usado como referência.
            </p>
            <p className="text-texto">
              Em cidades onde a Saúde da Família cobre quase toda a população, como em grande parte de Minas Gerais, o
              Acolhe+ pode encaminhar a pessoa para a própria equipe. Essa adaptação está prevista para uma etapa
              seguinte.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {NUMEROS_SAO_PAULO.map(({ valor, texto }) => (
              <div key={valor} className="rounded-2xl bg-branco p-6 shadow-leve">
                <p className="text-3xl font-extrabold text-primaria">{valor}</p>
                <p className="mt-1 text-texto">{texto}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. O que já existe */}
      <section className="bg-branco">
        <div className="mx-auto max-w-6xl px-4 py-14 lg:px-6">
          <h2 className="text-2xl font-extrabold text-primaria sm:text-3xl">O que já existe</h2>
          <p className="mt-3 max-w-3xl text-texto">
            Cada alternativa resolve uma parte do problema. Os sistemas públicos agendam, mas não dizem onde ir. Os
            serviços de orientação informam, mas não agendam.
          </p>
          <ListaAlternativas alternativas={ALTERNATIVAS} acolhe={ACOLHE_COMPARACAO} />
          <p className="mt-6 max-w-3xl text-texto">
            O Acolhe+ é uma <strong>inovação incremental</strong>: não substitui a UBS, a UPA nem o sistema de
            agendamento da prefeitura. Ele melhora processos que a rede já faz e foi pensado para se integrar ao Agenda
            Fácil.
          </p>
        </div>
      </section>

      {/* 6. Fontes (fechadas por padrão, para não pesar a leitura) */}
      <section className="border-t border-borda bg-fundo">
        <div className="mx-auto max-w-6xl px-4 py-10 lg:px-6">
          <details>
            <summary className="min-h-12 cursor-pointer content-center font-bold text-primaria">
              Fontes dos dados desta página
            </summary>
            <p className="mt-3 text-sm text-textoSuave">Referências completas no documento do projeto.</p>
            <ul className="mt-2 flex flex-col gap-1 text-sm text-textoSuave">
              {FONTES_SOBRE.map((fonte) => (
                <li key={fonte}>{fonte}</li>
              ))}
            </ul>
          </details>
        </div>
      </section>
    </>
  );
}
