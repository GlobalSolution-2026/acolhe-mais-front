import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { endpointsDaTela } from '../data/endpointsApi';
import type { NomeApi } from '../types';
import BadgeMetodo from './BadgeMetodo';

interface PainelExplicacaoProps {
  /** Nome da tela (ex.: "Horários da UBS"). */
  titulo: string;
  /** O que a tela faz, em linguagem simples. */
  oQueFaz: ReactNode;
  /** Regras de negócio envolvidas (uma por item). */
  regras?: string[];
  /** Chave da tela em data/endpointsApi.ts (ex.: "cidadao/agendar"): os endpoints vêm de lá. */
  tela: string;
}

/** Nome de cada API como aparece no painel. */
const NOME_API: Record<NomeApi, string> = {
  JAVA: 'API Java',
  FLASK: 'API Flask (IA)',
  VIACEP: 'ViaCEP',
  FRONT: 'Só no front (demonstração)',
};

/**
 * Painel ao lado de cada aba do simulador (embaixo, no celular) explicando
 * o que a tela faz, as regras de negócio e o bloco "Endpoints desta tela".
 * Os endpoints saem da mesma lista da tabela da aba Status (endpointsDaTela), no formato do Lobo-guará.
 */
export default function PainelExplicacao({ titulo, oQueFaz, regras = [], tela }: PainelExplicacaoProps) {
  const endpoints = endpointsDaTela(tela);

  return (
    <aside className="flex flex-col gap-4 rounded-xl border border-borda bg-branco p-5 font-nunito text-texto shadow-leve">
      <h2 className="text-lg font-extrabold text-primaria">{titulo}</h2>

      <section>
        <h3 className="mb-1 text-sm font-bold uppercase tracking-wide text-textoSuave">O que esta tela faz</h3>
        <div className="leading-relaxed">{oQueFaz}</div>
      </section>

      {regras.length > 0 && (
        <section>
          <h3 className="mb-1 text-sm font-bold uppercase tracking-wide text-textoSuave">Regras de negócio</h3>
          <ul className="flex list-disc flex-col gap-1 pl-5">
            {regras.map((regra) => (
              <li key={regra}>{regra}</li>
            ))}
          </ul>
        </section>
      )}

      <section className="rounded-xl border border-menta bg-mentaSuave/60 p-4">
        <h3 className="text-sm font-bold uppercase tracking-wide text-primaria">
          {endpoints.length === 1 ? 'Endpoint desta tela' : 'Endpoints desta tela'}
        </h3>
        {endpoints.length === 0 ? (
          <p className="mt-1 text-sm text-textoSuave">Nenhuma chamada própria: a tela usa os dados já carregados.</p>
        ) : (
          <ul className="mt-2 flex flex-col gap-3">
            {endpoints.map((e) => (
              <li key={`${e.metodo} ${e.rota}`} className="flex flex-col gap-1">
                <p className="flex flex-wrap items-center gap-2">
                  <BadgeMetodo metodo={e.metodo} />
                  <code className="break-all font-mono text-sm">{e.rota}</code>
                  <span className="text-xs font-semibold text-textoSuave">{NOME_API[e.api]}</span>
                </p>
                <p className="text-sm text-textoSuave">{e.descricao}</p>
              </li>
            ))}
          </ul>
        )}
        {tela !== 'status' && (
          <Link to="/simulador/status" className="mt-3 inline-block text-sm font-bold text-primaria underline decoration-menta decoration-2 underline-offset-4">
            Ver o status das APIs
          </Link>
        )}
      </section>
    </aside>
  );
}
