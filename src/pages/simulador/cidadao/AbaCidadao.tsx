/**
 * Página: aba Cidadão (/simulador/cidadao)
 * Mostra o celular do cidadão no centro (moldura com topo, tela aberta e barra inferior) e, ao lado,
 * o painel "Perfis para testar" e o painel de explicação da tela que está aberta no celular.
 * Veio do protótipo: LayoutCidadao (as telas ficam em src/pages/simulador/cidadao).
 * Endpoints: os de cada tela do celular (listados no painel).
 * Estados: tratados em cada tela do celular.
 */
import { useLocation } from 'react-router-dom';
import Celular from '../../../components/celular/Celular';
import LayoutAba from '../../../components/LayoutAba';
import PainelExplicacao from '../../../components/PainelExplicacao';
import PerfisTeste from '../../../components/PerfisTeste';
import { chaveTelaCidadao, explicacaoDaTela } from '../../../data/explicacoesCidadao';
import { BASE_CELULAR } from '../../../services/navegacao';

/** Aba Cidadão: celular + painel que acompanha a tela aberta. */
export default function AbaCidadao() {
  const { pathname } = useLocation();
  // "/simulador/cidadao/perfil/editar" → "perfil/editar"
  const tela = pathname.slice(BASE_CELULAR.length + 1).replace(/\/$/, '');
  const explicacao = explicacaoDaTela(tela);

  return (
    <LayoutAba
      explicacao={
        <div className="flex flex-col gap-4">
          <PerfisTeste />
          <PainelExplicacao {...explicacao} tela={`cidadao/${chaveTelaCidadao(tela)}`} />
        </div>
      }
    >
      <Celular />
    </LayoutAba>
  );
}
