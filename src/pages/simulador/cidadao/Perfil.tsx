/**
 * Página: Perfil (aba Cidadão → celular, /simulador/cidadao/perfil)
 * Sem login: convida a entrar ou criar conta (a orientação funciona sem conta).
 * Com login: dados do cadastro, atalho para editar, resumo da ficha de saúde (prévia) e Sair.
 * Veio do protótipo: src/pages/cidadao/Perfil.tsx.
 * Endpoints: GET /cidadaos/{id} (API Java). Ficha de saúde: só no front (prévia, demonstração).
 * Estados: sem login, carregando, erro e ficha vazia.
 */
import { Link } from 'react-router-dom';
import { FiEdit2, FiHeart, FiLogOut, FiSmartphone } from 'react-icons/fi';
import AvisoPrevia from '../../../components/AvisoPrevia';
import Loading from '../../../components/Loading';
import MensagemErro from '../../../components/MensagemErro';
import ResumoFicha from '../../../components/ResumoFicha';
import { BOTAO_CONTORNO } from '../../../components/celular/classes';
import PedirLogin from '../../../components/celular/PedirLogin';
import { useSimulador } from '../../../context/useSimulador';
import { useCarregar } from '../../../hooks/useCarregar';
import { fmtDiaHora } from '../../../lib/datas';
import { buscarCidadao, buscarFicha } from '../../../services/api';
import { BASE_CELULAR } from '../../../services/navegacao';
import { formatarCns, formatarTelefone } from '../../../utils/formatadores';

/** Uma linha do cadastro: rótulo pequeno em cima e valor em destaque. */
function Linha({ rotulo, valor }: { rotulo: string; valor: string }) {
  return (
    <p>
      <span className="block text-sm font-semibold text-textoSuave">{rotulo}</span>
      <span className="font-bold">{valor || '—'}</span>
    </p>
  );
}

/** Tela Perfil do celular. */
export default function Perfil() {
  const { estado, sair } = useSimulador();
  const idCidadao = estado.idCidadaoAtual;

  // Cadastro (API Java) e ficha de saúde (prévia, só no front) juntos.
  const { dados, carregando, erro, recarregar } = useCarregar(async () => {
    if (idCidadao === null) return null;
    const [cidadao, ficha] = await Promise.all([buscarCidadao(idCidadao), buscarFicha(idCidadao)]);
    return { cidadao, ficha };
  }, [idCidadao, estado.cidadaos, estado.fichas]);

  if (idCidadao === null) {
    return (
      <div className="flex flex-col gap-4">
        <h1 className="text-2xl font-extrabold text-primaria">Perfil</h1>
        <PedirLogin mensagem="Entre para agendar consultas e guardar sua ficha de saúde. A orientação funciona sem conta." />
      </div>
    );
  }
  if (carregando) return <Loading />;
  if (erro || !dados) return <MensagemErro mensagem={erro ?? 'Não foi possível carregar o cadastro.'} onRetry={recarregar} />;

  const { cidadao, ficha } = dados;
  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-extrabold text-primaria">Perfil</h1>
      <section className="flex flex-col gap-3 rounded-xl border border-borda bg-branco p-4 shadow-leve">
        <Linha rotulo="Nome" valor={cidadao.nmCidadao} />
        <Linha rotulo="Cartão SUS" valor={formatarCns(cidadao.nrCns)} />
        <Linha rotulo="Celular" valor={cidadao.nrCelular ? formatarTelefone(cidadao.nrCelular) : ''} />
        <Linha
          rotulo="Contato de recado"
          valor={cidadao.nmContatoRecado ? `${cidadao.nmContatoRecado} · ${formatarTelefone(cidadao.nrContatoRecado)}` : ''}
        />
        <Link to={`${BASE_CELULAR}/perfil/editar`} className={BOTAO_CONTORNO}>
          <FiEdit2 aria-hidden /> Editar dados
        </Link>
      </section>

      <p className="flex items-start gap-2 rounded-xl bg-mentaSuave p-3 font-semibold">
        <FiSmartphone className="mt-1 shrink-0" aria-hidden />
        Confira seu celular: é por ele que avisamos a confirmação e as vagas.
      </p>

      <section className="flex flex-col gap-3 rounded-xl border border-borda bg-branco p-4 shadow-leve">
        <h2 className="flex items-center gap-2 text-lg font-extrabold text-primaria"><FiHeart aria-hidden /> Ficha de saúde</h2>
        <AvisoPrevia />
        {ficha ? (
          <>
            <ResumoFicha ficha={ficha} cidadao={cidadao} />
            <p className="text-sm text-textoSuave">Última atualização: {fmtDiaHora(ficha.dtAtualizacao, false)}</p>
          </>
        ) : (
          <p className="text-textoSuave">Opcional. Ajuda quem for socorrer você numa emergência.</p>
        )}
        <Link to={`${BASE_CELULAR}/perfil/ficha`} className={BOTAO_CONTORNO}>
          <FiEdit2 aria-hidden /> {ficha ? 'Editar' : 'Preencher ficha'}
        </Link>
      </section>

      <button type="button" onClick={sair} className={`${BOTAO_CONTORNO} cursor-pointer`}>
        <FiLogOut aria-hidden /> Sair
      </button>
    </div>
  );
}
