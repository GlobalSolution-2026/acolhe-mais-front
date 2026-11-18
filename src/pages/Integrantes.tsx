/**
 * Página: Integrantes (rotas "/integrantes" e "/integrantes/:rm", página institucional)
 * Lista os cinco integrantes em cartões. A rota com parâmetro /integrantes/:rm abre o painel
 * lateral com o perfil por cima da lista (fecha pelo ✕, com Esc ou clicando fora).
 * Veio da demonstração aprovada 06-integrantes.html, mantendo o painel que já existia na develop.
 * Endpoints: nenhum (dados fixos de src/data/integrantes.ts).
 * Estados: RM inexistente na URL mostra só a lista, sem painel.
 */
import { useCallback, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import CardIntegrante from '../components/CardIntegrante';
import Etiqueta from '../components/Etiqueta';
import PainelIntegrante from '../components/PainelIntegrante';
import { INTEGRANTES } from '../data/integrantes';

/** Página Integrantes. O RM da URL (useParams) decide qual perfil fica aberto. */
export default function Integrantes() {
  const { rm } = useParams<{ rm?: string }>();
  const navigate = useNavigate();
  const selecionado = INTEGRANTES.find((integrante) => integrante.rm === rm);

  /** Fecha o painel voltando para a lista. */
  const fecharPainel = useCallback(() => navigate('/integrantes'), [navigate]);

  // Título da aba com o nome de quem está aberto.
  useEffect(() => {
    document.title = selecionado ? `${selecionado.nome} | Acolhe+` : 'Integrantes | Acolhe+';
    return () => {
      document.title = 'Acolhe+';
    };
  }, [selecionado]);

  // Esc fecha o painel; o ouvinte só existe enquanto ele está aberto.
  useEffect(() => {
    if (!selecionado) return;
    const fecharComEsc = (evento: KeyboardEvent) => {
      if (evento.key === 'Escape') fecharPainel();
    };
    window.addEventListener('keydown', fecharComEsc);
    return () => window.removeEventListener('keydown', fecharComEsc);
  }, [selecionado, fecharPainel]);

  return (
    <>
      {/* Topo */}
      <section className="bg-branco">
        <div className="mx-auto flex max-w-6xl flex-col px-4 py-14 lg:px-6 lg:py-20">
          <Etiqueta>Integrantes</Etiqueta>
          <h1 className="mt-5 max-w-3xl text-3xl font-extrabold leading-tight text-primaria sm:text-5xl">
            Quem faz o Acolhe+
          </h1>
          <p className="mt-5 max-w-3xl text-lg leading-relaxed text-texto">
            Cinco estudantes de Análise e Desenvolvimento de Sistemas da FIAP. Cada um ficou à frente de uma parte da
            solução, e o resultado foi integrado na Global Solution 2026/2.
          </p>
        </div>
      </section>

      {/* Cartões */}
      <section className="border-t border-borda bg-fundo">
        <div className="mx-auto max-w-6xl px-4 py-14 lg:px-6">
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {INTEGRANTES.map((integrante) => (
              <CardIntegrante key={integrante.rm} integrante={integrante} />
            ))}
          </ul>
        </div>
      </section>

      {/* Painel lateral do perfil (/integrantes/:rm), com fundo escuro que fecha ao clicar */}
      {selecionado && (
        <>
          <div aria-hidden="true" onClick={fecharPainel} className="fixed inset-0 z-40 bg-primariaEscura/60" />
          <PainelIntegrante integrante={selecionado} todos={INTEGRANTES} onFechar={fecharPainel} />
        </>
      )}
    </>
  );
}
