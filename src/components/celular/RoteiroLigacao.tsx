import { useState } from 'react';
import { enderecoParaLigacao } from '../../services/cep';
import type { LocalOrientacao } from '../../types/orientacao';

interface RoteiroLigacaoProps {
  /** CEP informado no Início (sem ele, a tela pede para dizer o endereço completo). */
  nrCep?: string;
  /** Endereço do ViaCEP, número e complemento digitados no Início. */
  local?: LocalOrientacao;
  /** Nome da queixa (quando a pessoa chegou aqui pela orientação). */
  nmQueixa?: string;
  /** Sinais marcados na orientação. */
  sinais?: string[];
}

/**
 * Roteiro da ligação para o SAMU 192: o que falar ao atendente.
 * Veio do protótipo (resultado vermelho, "O que falar na ligação"); é usado na Emergência e no resultado vermelho.
 */
export default function RoteiroLigacao({ nrCep, local = {}, nmQueixa, sinais = [] }: RoteiroLigacaoProps) {
  // Ponto de referência só fica na tela (ajuda a pessoa a lembrar na hora da ligação; não é salvo).
  const [referencia, setReferencia] = useState('');

  return (
    <section className="flex flex-col gap-3 rounded-xl border border-borda bg-branco p-4">
      <h2 className="text-lg font-extrabold text-primaria">O que falar na ligação</h2>
      <p>
        <strong>Endereço:</strong>{' '}
        {nrCep ? enderecoParaLigacao(nrCep, local) : 'diga a rua, o número, o bairro e a cidade.'}
      </p>
      <div className="flex flex-col gap-1">
        <label htmlFor="referencia" className="font-semibold">Ponto de referência</label>
        <input
          id="referencia"
          value={referencia}
          onChange={(e) => setReferencia(e.target.value.slice(0, 120))}
          placeholder="Ex.: perto da padaria"
          className="min-h-12 rounded-xl border border-borda bg-branco px-4 outline-none focus:ring-2 focus:ring-primaria"
        />
      </div>
      {nmQueixa ? (
        <p><strong>Queixa:</strong> {nmQueixa}</p>
      ) : (
        <p><strong>O que está acontecendo:</strong> conte o que a pessoa sente e desde quando.</p>
      )}
      {sinais.length > 0 && (
        <div>
          <h3 className="font-bold">Sinais marcados</h3>
          <ul className="list-disc pl-6">
            {sinais.map((s) => <li key={s}>{s}</li>)}
          </ul>
        </div>
      )}
      <div>
        <h3 className="font-bold">Recomendações</h3>
        <ul className="list-disc pl-6">
          <li>Mantenha a calma.</li>
          <li>Não desligue até o atendente liberar.</li>
          <li>Siga as orientações do médico regulador.</li>
        </ul>
      </div>
    </section>
  );
}
