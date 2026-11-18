/**
 * Página: Emergência (aba Cidadão → celular, /simulador/cidadao/emergencia)
 * Aberta pelo botão vermelho da barra inferior do celular, sem pedir login.
 * Mostra o SAMU 192 com o botão de ligar e o roteiro da ligação; para quem está logado e tem ficha
 * de saúde, a ficha de emergência (prévia); e o Disque-Intoxicação.
 * Veio do protótipo: src/pages/cidadao/Emergencia.tsx + o roteiro do resultado vermelho.
 * Endpoints: nenhum (os dados vêm do que já está no app: o cadastro guardado no login e a ficha pelo Cartão SUS).
 * Estados: com ou sem CEP informado no Início; com ou sem login/ficha.
 */
import { FiHeart, FiPhoneCall } from 'react-icons/fi';
import AvisoPrevia from '../../../components/AvisoPrevia';
import ResumoFicha from '../../../components/ResumoFicha';
import RoteiroLigacao from '../../../components/celular/RoteiroLigacao';
import { useSimulador } from '../../../context/useSimulador';

/** Tela Emergência do celular: SAMU 192, roteiro da ligação, ficha de emergência e Disque-Intoxicação. */
export default function Emergencia() {
  const { estado } = useSimulador();
  // Cadastro de quem entrou (veio da API no login), nunca o mock pelo id; ficha pelo Cartão SUS.
  // Leitura imediata, sem esperar a rede: é a tela de emergência.
  const cadastro = estado.cadastroAtual;
  const ficha = cadastro ? estado.fichas.find((f) => f.nrCns === cadastro.nrCns) : undefined;
  const orientacao = estado.orientacaoAtual;

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-extrabold text-primaria">Emergência</h1>

      <section className="rounded-xl border-2 border-gravidade-vermelho bg-branco p-4">
        <h2 className="text-xl font-extrabold">SAMU – 192</h2>
        <p className="mb-3 text-textoSuave">Risco de vida, falta de ar forte, desmaio, dor no peito.</p>
        {/* Link tel: abre o discador no celular de verdade */}
        <a
          href="tel:192"
          className="flex min-h-14 w-full items-center justify-center gap-2 rounded-xl bg-gravidade-vermelho px-5 text-xl font-extrabold text-branco shadow-leve"
        >
          <FiPhoneCall aria-hidden /> Ligar para o 192
        </a>
      </section>

      {/* Usa o CEP do Início, quando a pessoa já informou */}
      <RoteiroLigacao
        nrCep={orientacao?.nrCep || undefined}
        local={orientacao ?? {}}
      />

      {cadastro && ficha && (
        <section className="rounded-xl border-2 border-primaria bg-branco p-4" aria-label="Ficha de emergência">
          <h2 className="flex items-center gap-2 text-xl font-extrabold text-primaria">
            <FiHeart aria-hidden /> Ficha de emergência
          </h2>
          <AvisoPrevia className="mt-2" />
          <p className="my-3 text-textoSuave">Mostre ao SAMU ou a quem estiver socorrendo.</p>
          <p className="mb-3 text-lg font-extrabold">{cadastro.nmCidadao}</p>
          <ResumoFicha ficha={ficha} cidadao={cadastro} contato />
        </section>
      )}

      <section className="rounded-xl border border-borda bg-branco p-4">
        <h2 className="text-xl font-extrabold">Disque-Intoxicação</h2>
        <p className="mb-3 text-textoSuave">0800 722 6001 · gratuito, 24 horas. Para intoxicação ou envenenamento.</p>
        <a
          href="tel:08007226001"
          className="flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-primaria px-5 font-bold text-branco shadow-leve hover:bg-primariaEscura"
        >
          <FiPhoneCall aria-hidden /> Ligar para 0800 722 6001
        </a>
      </section>
    </div>
  );
}
