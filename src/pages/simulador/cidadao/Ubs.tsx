/**
 * Página: UBS próximas (aba Cidadão → celular, /simulador/cidadao/ubs)
 * Lista as UBS em ordem de proximidade pelo CEP informado no Início (ou, sem ele, pelo CEP do cadastro de quem
 * está logado), com o resultado da orientação no topo.
 * Cada UBS leva aos horários dela (rota com parâmetro ubs/:idUnidade).
 * Veio do protótipo: src/pages/cidadao/Ubs.tsx.
 * Endpoints: GET /unidades (API Java; o filtro UBS é feito no front) e GET /cidadaos/{id} (API Java, só com login
 * e sem CEP do Início).
 * Estados: carregando, erro (API fora do ar) e vazio (nenhuma UBS). Se o cadastro não carregar, a lista aparece
 * mesmo assim, sem ordenar pelo CEP.
 */
import { useNavigate } from 'react-router-dom';
import CardUnidade from '../../../components/CardUnidade';
import EstadoVazio from '../../../components/EstadoVazio';
import Loading from '../../../components/Loading';
import MensagemErro from '../../../components/MensagemErro';
import SeloGravidade from '../../../components/SeloGravidade';
import { useSimulador } from '../../../context/useSimulador';
import { useCarregar } from '../../../hooks/useCarregar';
import { buscarCidadao, listarUnidades } from '../../../services/api';
import { BASE_CELULAR } from '../../../services/navegacao';
import { ordenarUbsPorCep } from '../../../services/orientacao';

/** Tela UBS próximas. */
export default function Ubs() {
  const { estado } = useSimulador();
  const navigate = useNavigate();
  const idCidadao = estado.idCidadaoAtual;
  const cepInicio = estado.orientacaoAtual?.nrCep || '';

  // Regra: o CEP do Início define a ordem; sem ele, vale o CEP do cadastro de quem está logado.
  // O cadastro vem da API (buscarCidadao), e não do mock, para não pegar o CEP de uma pessoa de exemplo com o mesmo id.
  const { dados, carregando, erro, recarregar } = useCarregar(async () => {
    const [ubs, cadastro] = await Promise.all([
      listarUnidades('UBS'),
      // Falha ao buscar o cadastro não impede a lista: só fica sem ordenar pelo CEP.
      !cepInicio && idCidadao !== null ? buscarCidadao(idCidadao).catch(() => null) : Promise.resolve(null),
    ]);
    return { ubs, cepCadastro: cadastro?.nrCep ?? '' };
  }, [cepInicio, idCidadao]);

  const cep = cepInicio || dados?.cepCadastro || '';
  const ordenadas = dados ? ordenarUbsPorCep(dados.ubs, cep) : [];
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
