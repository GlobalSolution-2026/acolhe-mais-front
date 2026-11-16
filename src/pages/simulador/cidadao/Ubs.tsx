/**
 * Página: UBS próximas (aba Cidadão → celular, /simulador/cidadao/ubs)
 * Lista as UBS em ordem de proximidade pelo CEP informado no Início, com o resultado da orientação no topo.
 * Cada UBS leva aos horários dela (rota com parâmetro ubs/:idUnidade).
 * Veio do protótipo: src/pages/cidadao/Ubs.tsx.
 * Endpoints: GET /unidades (API Java; o filtro UBS é feito no front).
 * Estados: carregando, erro (API fora do ar) e vazio (nenhuma UBS).
 */
import { useNavigate } from 'react-router-dom';
import CardUnidade from '../../../components/CardUnidade';
import EstadoVazio from '../../../components/EstadoVazio';
import Loading from '../../../components/Loading';
import MensagemErro from '../../../components/MensagemErro';
import SeloGravidade from '../../../components/SeloGravidade';
import { useSimulador } from '../../../context/useSimulador';
import { useCarregar } from '../../../hooks/useCarregar';
import { listarUnidades } from '../../../services/api';
import { BASE_CELULAR } from '../../../services/navegacao';
import { ordenarUbsPorCep } from '../../../services/orientacao';

/** Tela UBS próximas. */
export default function Ubs() {
  const { estado } = useSimulador();
  const navigate = useNavigate();
  const { dados: ubs, carregando, erro, recarregar } = useCarregar(() => listarUnidades('UBS'), []);

  // CEP do Início (ou do cadastro de quem está logado) define a ordem.
  const cadastro = estado.cidadaos.find((c) => c.idCidadao === estado.idCidadaoAtual);
  const cep = estado.orientacaoAtual?.nrCep || cadastro?.nrCep || '';
  const ordenadas = ubs ? ordenarUbsPorCep(ubs, cep) : [];
  const resultado = estado.orientacaoAtual?.resultado ?? null;

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-extrabold text-primaria">UBS próximas</h1>
      {resultado && (
        <div className="flex flex-col gap-1">
          <p className="text-base text-textoSuave">Resultado da sua orientação:</p>
          <SeloGravidade cor={resultado.dsCor} tamanho="pequeno" />
        </div>
      )}
      {carregando && <Loading />}
      {erro && <MensagemErro mensagem={erro} onRetry={recarregar} />}
      {!carregando && !erro && ordenadas.length === 0 && <EstadoVazio mensagem="Nenhuma UBS encontrada." />}
      {!erro &&
        ordenadas.map((u) => (
          <CardUnidade key={u.idUnidade} unidade={u} onVerHorarios={() => navigate(`${BASE_CELULAR}/ubs/${u.idUnidade}`)} />
        ))}
    </div>
  );
}
