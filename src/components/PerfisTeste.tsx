import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiChevronDown } from 'react-icons/fi';
import { useSimulador } from '../context/useSimulador';
import { SENHA_TESTE } from '../data/contaDemo';
import { CNS_BALCAO, PERFIS_CIDADAO } from '../data/perfisTeste';
import { entrar } from '../services/api';
import { BASE_CELULAR } from '../services/navegacao';
import { mensagemDoErro } from '../utils/erros';

/**
 * Painel "Perfis para testar" (bloco que abre e fecha), no formato do simulador do Lobo-guará.
 * Cidadão: contas com senha e o botão "Entrar →", que faz o mesmo POST /cidadaos/login da tela Entrar
 * e leva ao Início do celular. Recepção: Cartões SUS para digitar no balcão, sem botão de entrar.
 * Funciona nos dois modos: no demonstração, as contas estão no mock; com a API, na carga do banco.
 */
export default function PerfisTeste() {
  const { estado, definirCidadaoAtual } = useSimulador();
  const navigate = useNavigate();
  const [entrando, setEntrando] = useState<number | null>(null);
  const [erro, setErro] = useState('');

  /** Login rápido com a senha de teste; com sucesso, guarda a conta no Context e abre o Início do celular. */
  const entrarComo = async (idCidadao: number, nrCns: string) => {
    setErro('');
    setEntrando(idCidadao);
    try {
      const cidadao = await entrar(nrCns, SENHA_TESTE);
      definirCidadaoAtual(cidadao);
      navigate(`${BASE_CELULAR}/inicio`);
    } catch (e) {
      setErro(mensagemDoErro(e));
    } finally {
      setEntrando(null);
    }
  };

  return (
    <details className="group rounded-xl border border-borda bg-branco p-4 shadow-leve">
      <summary className="flex min-h-12 cursor-pointer list-none items-center justify-between gap-3 [&::-webkit-details-marker]:hidden">
        <span>
          <span className="block text-sm font-extrabold uppercase tracking-wide text-primaria">Perfis para testar</span>
          <span className="mt-1 block text-sm text-textoSuave">
            {PERFIS_CIDADAO.length} contas · senha <strong className="text-texto">{SENHA_TESTE}</strong>
          </span>
        </span>
        <FiChevronDown aria-hidden className="shrink-0 text-xl text-primaria transition-transform duration-300 group-open:rotate-180" />
      </summary>

      <h3 className="mt-3 text-sm font-bold text-textoSuave">Cidadão (celular)</h3>
      <ul className="mt-1">
        {PERFIS_CIDADAO.map((perfil) => {
          const atual = estado.idCidadaoAtual === perfil.idCidadao;
          return (
            <li
              key={perfil.idCidadao}
              className={`flex items-center justify-between gap-3 border-t py-2.5 first:border-t-0 ${
                atual ? 'rounded-lg border-transparent bg-mentaSuave px-3' : 'border-borda px-1'
              }`}
            >
              <span className="min-w-0">
                <span className="block font-bold text-texto">{perfil.nmCidadao}</span>
                <span className="block text-sm text-textoSuave">{perfil.demonstra}</span>
                <span className="block text-xs text-textoSuave">Cartão SUS {perfil.nrCns}</span>
              </span>
              {atual ? (
                <span className="shrink-0 text-sm font-bold text-primaria">Você está aqui</span>
              ) : (
                <button
                  type="button"
                  onClick={() => entrarComo(perfil.idCidadao, perfil.nrCns)}
                  disabled={entrando !== null}
                  aria-label={`Entrar como ${perfil.nmCidadao}`}
                  className="min-h-10 shrink-0 cursor-pointer rounded-lg px-2 font-bold text-primaria hover:bg-mentaSuave disabled:cursor-wait disabled:opacity-50"
                >
                  {entrando === perfil.idCidadao ? 'Entrando…' : 'Entrar →'}
                </button>
              )}
            </li>
          );
        })}
      </ul>

      <h3 className="mt-4 text-sm font-bold text-textoSuave">Recepção (buscar no balcão)</h3>
      <ul className="mt-1">
        {CNS_BALCAO.map((item) => (
          <li key={item.nrCns} className="border-t border-borda px-1 py-2.5 first:border-t-0">
            <span className="block font-bold text-texto">{item.nmCidadao}</span>
            <span className="block text-sm text-textoSuave">{item.demonstra}</span>
            <span className="block text-xs text-textoSuave">Cartão SUS {item.nrCns}</span>
          </li>
        ))}
      </ul>

      <p className="mt-2 text-xs text-textoSuave">Também dá para criar uma conta nova pelo celular.</p>

      {erro && (
        <p role="alert" className="mt-3 rounded-lg border border-gravidade-vermelho bg-branco px-3 py-2 text-sm font-semibold text-gravidade-vermelho">
          {erro}
        </p>
      )}
    </details>
  );
}
