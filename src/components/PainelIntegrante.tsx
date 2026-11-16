import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { FiX } from 'react-icons/fi';

import type { Integrante } from '../types/institucional';
import AvatarIntegrante from './AvatarIntegrante';

/** Propriedades do painel lateral de perfil. */
interface PainelIntegranteProps {
  integrante: Integrante;
  /** Todos os integrantes, para a lista "Outros integrantes". */
  todos: Integrante[];
  /** Fecha o painel (a página volta para /integrantes). */
  onFechar: () => void;
}

/** Classe dos links externos (GitHub e LinkedIn) do painel. */
const BOTAO_LINK = 'inline-flex min-h-12 flex-1 items-center justify-center rounded-xl px-5 font-bold transition-colors';

/**
 * Painel lateral com o perfil de um integrante (rota /integrantes/:rm).
 * Acessibilidade: role="dialog" com aria-modal, título ligado por aria-labelledby
 * e foco no botão Fechar ao abrir. Esc e clique fora ficam na página.
 * No celular ocupa a tela toda; a partir de 640 px, uma coluna à direita.
 */
export default function PainelIntegrante({ integrante, todos, onFechar }: PainelIntegranteProps) {
  const { rm, nome, funcao, turma, foto, iniciais, disciplinas, contribuicoes, github, linkedin } = integrante;
  const botaoFechar = useRef<HTMLButtonElement>(null);
  const idTitulo = `titulo-integrante-${rm}`;

  // Leva o foco para o Fechar ao abrir ou ao trocar de perfil, para o teclado começar dentro do painel.
  useEffect(() => {
    botaoFechar.current?.focus();
  }, [rm]);

  return (
    <aside
      role="dialog"
      aria-modal="true"
      aria-labelledby={idTitulo}
      className="fixed inset-y-0 right-0 z-50 w-full bg-branco shadow-celular sm:max-w-md"
    >
      <div className="flex h-full flex-col gap-6 overflow-y-auto p-6 sm:p-8">
        <div className="flex items-start justify-between gap-4">
          <p className="text-sm font-bold text-textoSuave">Integrante</p>
          <button
            ref={botaoFechar}
            type="button"
            onClick={onFechar}
            aria-label="Fechar perfil"
            className="flex h-12 w-12 cursor-pointer items-center justify-center rounded-xl border border-borda text-primaria hover:bg-fundo"
          >
            <FiX className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>

        <div className="flex items-center gap-4">
          <AvatarIntegrante key={rm} nome={nome} foto={foto} iniciaisFixas={iniciais} />
          <div>
            <h2 id={idTitulo} className="text-2xl font-extrabold leading-tight text-primaria">
              {nome}
            </h2>
            <p className="mt-1 text-texto">{funcao}</p>
            <p className="text-sm text-textoSuave">
              RM {rm} · Turma {turma}
            </p>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-bold text-textoSuave">Disciplinas em que atuou</h3>
          <ul className="mt-2 flex flex-wrap gap-2 text-sm font-bold">
            {disciplinas.map((disciplina) => (
              <li key={disciplina} className="rounded-full bg-mentaSuave px-3 py-1 text-primaria">
                {disciplina}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-bold text-textoSuave">Contribuições no projeto</h3>
          <ul className="mt-2 flex flex-col gap-2">
            {contribuicoes.map(({ titulo, texto }) => (
              <li key={titulo} className="rounded-xl bg-fundo p-4">
                <p className="font-bold text-primaria">{titulo}</p>
                <p className="mt-1 text-texto">{texto}</p>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-auto flex flex-col gap-3 border-t border-borda pt-6 sm:flex-row">
          <a
            href={github}
            target="_blank"
            rel="noopener noreferrer"
            className={`${BOTAO_LINK} bg-primaria text-branco hover:bg-primariaEscura`}
          >
            GitHub
          </a>
          <a
            href={linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className={`${BOTAO_LINK} border-2 border-primaria text-primaria hover:bg-mentaSuave`}
          >
            LinkedIn
          </a>
        </div>

        <div>
          <h3 className="text-sm font-bold text-textoSuave">Outros integrantes</h3>
          <ul className="mt-2 flex flex-wrap gap-2">
            {todos.map((outro) => {
              const atual = outro.rm === rm;
              return (
                <li key={outro.rm}>
                  {/* replace: trocar de perfil não enche o histórico do navegador */}
                  <Link
                    to={`/integrantes/${outro.rm}`}
                    replace
                    aria-label={outro.nome}
                    aria-current={atual ? 'page' : undefined}
                    className={`block rounded-full ${atual ? 'ring-2 ring-primaria ring-offset-2' : 'opacity-80 hover:opacity-100 hover:ring-2 hover:ring-menta'}`}
                  >
                    <AvatarIntegrante key={outro.rm} nome={outro.nome}
                      foto={outro.foto}
                      iniciaisFixas={outro.iniciais}
                      tamanho="pequeno" />
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </aside>
  );
}
