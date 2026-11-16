/**
 * Página: FAQ (rota "/faq", página institucional)
 * Perguntas frequentes em 4 grupos (orientação, agendamento, dados e uso pela UBS),
 * com atalhos para cada grupo e um acordeão em que só uma pergunta fica aberta por vez.
 * Veio da demonstração aprovada 04-faq.html (18 perguntas, base no documento de Software).
 * Endpoints: nenhum (textos fixos de src/data/faq.ts).
 * Estados: não chama API, então não tem carregando, erro ou vazio.
 */
import { useState } from 'react';

import AtalhosPagina from '../components/AtalhosPagina';
import Etiqueta from '../components/Etiqueta';
import ItemFaq from '../components/ItemFaq';
import LinkBotao from '../components/LinkBotao';
import { ATALHOS_FAQ, GRUPOS_FAQ } from '../data/faq';

/** Página FAQ. O estado guarda o id da pergunta aberta (null = todas fechadas). */
export default function Faq() {
  const [perguntaAberta, setPerguntaAberta] = useState<string | null>(null);

  /** Abre a pergunta clicada e fecha a anterior; clicar na que já está aberta fecha. */
  const alternarPergunta = (id: string) => {
    setPerguntaAberta((atual) => (atual === id ? null : id));
  };

  return (
    <>
      {/* 1. Abertura com atalhos para os grupos */}
      <section className="bg-branco">
        <div className="mx-auto flex max-w-6xl flex-col px-4 py-14 lg:px-6 lg:py-20">
          <Etiqueta>Dúvidas frequentes</Etiqueta>
          <h1 className="mt-5 max-w-3xl text-3xl font-extrabold leading-tight text-primaria sm:text-5xl">
            Perguntas frequentes
          </h1>
          <p className="mt-5 max-w-3xl text-lg leading-relaxed text-texto">
            Respostas curtas sobre a orientação, o agendamento, os seus dados e o uso pela UBS.
          </p>
          <AtalhosPagina atalhos={ATALHOS_FAQ} rotulo="Grupos de perguntas" />
        </div>
      </section>

      {/* 2. Perguntas em grupos */}
      <section className="border-t border-borda bg-fundo">
        <div className="mx-auto flex max-w-3xl flex-col gap-12 px-4 py-14">
          {GRUPOS_FAQ.map((grupo) => (
            <div key={grupo.id} id={grupo.id} className="scroll-mt-6">
              <h2 className="text-2xl font-extrabold text-primaria">{grupo.titulo}</h2>
              <div className="mt-4 flex flex-col gap-3">
                {grupo.perguntas.map((item) => (
                  <ItemFaq
                    key={item.id}
                    item={item}
                    aberto={perguntaAberta === item.id}
                    onAlternar={() => alternarPergunta(item.id)}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. Não encontrou? Leva ao Contato (não ao simulador) */}
      <section className="bg-branco">
        <div className="mx-auto max-w-3xl px-4 pb-16 pt-4">
          <div className="flex flex-col items-start gap-4 rounded-3xl bg-mentaSuave p-8 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-xl font-extrabold text-primaria">Não encontrou a sua dúvida?</h2>
              <p className="mt-1 text-texto">Escreva para a equipe do projeto.</p>
            </div>
            <LinkBotao para="/contato">Ir para Contato</LinkBotao>
          </div>
        </div>
      </section>
    </>
  );
}
