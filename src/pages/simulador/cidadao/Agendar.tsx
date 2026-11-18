/**
 * Página: Agendar (aba Cidadão → celular, /simulador/cidadao/agendar?horario=&ubs=&oferta=)
 * Confirma o horário escolhido. A identificação aparece só para leitura (RF27) e a pessoa confere o celular
 * e o contato de recado. Exige login: sem login, vai para Entrar e volta para cá.
 * Se o cadastro estiver sem CEP (conta criada antes de o CEP ser pedido no cadastro), mostra o campo CEP,
 * obrigatório (já vem com o CEP do Início, se houver). Com CEP no cadastro, o campo não aparece.
 * Ao agendar, o serviço chama o Modelo 1 (risco de falta) e grava o risco na consulta.
 * Veio do protótipo: src/pages/cidadao/Agendar.tsx.
 * Endpoints: GET /cidadaos/{id}, GET /unidades/{id}, GET /unidades/{id}/horarios, PUT /cidadaos/{id},
 * POST /consultas (API Java) e POST /prever-falta (API Flask).
 * Estados: carregando, erro ao carregar, horário não encontrado (vazio), "Agendando..." com o botão
 * desabilitado e erro 409 com o atalho para escolher outro horário: horário acabou de ser ocupado ou
 * a pessoa já tem consulta no dia (cada um com a sua mensagem, vinda do serviço).
 * Regra: uma consulta ativa por pessoa por dia, em qualquer UBS (conferida no agendarConsulta, só no front).
 */
import { useState } from 'react';
import { Link, Navigate, useNavigate, useSearchParams } from 'react-router-dom';
import EstadoVazio from '../../../components/EstadoVazio';
import Loading from '../../../components/Loading';
import MensagemErro from '../../../components/MensagemErro';
import { BOTAO_CONTORNO, BOTAO_PRIMARIO } from '../../../components/celular/classes';
import FormularioCidadao, { type DadosCidadao } from '../../../components/celular/FormularioCidadao';
import { useSimulador } from '../../../context/useSimulador';
import { useAvisos } from '../../../hooks/useAvisos';
import { useCarregar } from '../../../hooks/useCarregar';
import { fmtDiaHora } from '../../../lib/datas';
import { agendarConsulta, atualizarCidadao, buscarCidadao, buscarUnidade, listarHorarios } from '../../../services/api';
import { ErroApi } from '../../../services/http';
import { BASE_CELULAR, lerRetornoLogin, queryRetorno } from '../../../services/navegacao';
import { mensagemDoErro } from '../../../utils/erros';

/** Tela Agendar do celular. */
export default function Agendar() {
  const { estado } = useSimulador();
  const navigate = useNavigate();
  const [parametros] = useSearchParams();
  const retorno = lerRetornoLogin(parametros);
  // A UBS vem na URL; se faltar (link antigo), procura o horário no mock da demonstração.
  const idUnidade = retorno.ubs || estado.horarios.find((h) => h.idHorario === retorno.horario)?.idUnidade || 0;
  const idCidadao = estado.idCidadaoAtual;

  // A consulta nova pode já entrar na janela de confirmação: o sino do celular busca de novo depois de agendar.
  const { recarregar: recarregarAvisos } = useAvisos();
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState<{ mensagem: string; ocupado: boolean } | null>(null);

  const { dados, carregando, erro: erroCarregar, recarregar } = useCarregar(async () => {
    if (idCidadao === null || !idUnidade) return null;
    const [cidadao, unidade, horarios] = await Promise.all([buscarCidadao(idCidadao), buscarUnidade(idUnidade), listarHorarios(idUnidade)]);
    return { cidadao, unidade, horario: horarios.find((h) => h.idHorario === retorno.horario) ?? null };
  }, [idCidadao, idUnidade, retorno.horario]);

  // Agendar exige login; depois de entrar, a tela de login volta para cá com os mesmos dados.
  if (idCidadao === null) {
    return <Navigate to={`${BASE_CELULAR}/entrar${queryRetorno({ horario: retorno.horario, oferta: retorno.oferta, ubs: idUnidade })}`} replace />;
  }
  if (carregando) return <Loading />;
  if (erroCarregar) return <MensagemErro mensagem={erroCarregar} onRetry={recarregar} />;
  if (!dados || !dados.horario) {
    return (
      <div className="flex flex-col gap-4">
        <EstadoVazio mensagem="Horário não encontrado. Escolha outro horário." />
        <Link to={`${BASE_CELULAR}/ubs`} className={BOTAO_PRIMARIO}>Ver UBS próximas</Link>
      </div>
    );
  }

  const { cidadao, unidade, horario } = dados;

  /** Atualiza o contato (RF27: só celular, recado e CEP) e agenda; sucesso vai para a tela Sucesso. */
  const aoEnviar = async (form: DadosCidadao) => {
    setEnviando(true);
    setErro(null);
    try {
      const atualizado = await atualizarCidadao(cidadao.idCidadao, {
        nrCelular: form.nrCelular,
        nmContatoRecado: form.nmContatoRecado,
        nrContatoRecado: form.nrContatoRecado,
        nrCep: form.nrCep,
      });
      const consulta = await agendarConsulta({
        horario,
        cidadao: atualizado,
        idOrientacao: estado.orientacaoAtual?.resultado?.idOrientacao ?? null,
        ...(retorno.oferta ? { idOferta: retorno.oferta } : {}),
      });
      recarregarAvisos();
      // A consulta vai junto na navegação (a tela Sucesso não precisa buscar de novo).
      navigate(`${BASE_CELULAR}/sucesso?consulta=${consulta.idConsulta}`, { state: { consulta }, replace: true });
    } catch (e) {
      // 409: o horário acabou de ser ocupado ou a pessoa já tem consulta neste dia.
      // A mensagem vem pronta do serviço; nos dois casos, a saída é escolher outro horário.
      setErro({ mensagem: mensagemDoErro(e), ocupado: e instanceof ErroApi && e.status === 409 });
      setEnviando(false);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-extrabold text-primaria">Seus dados para agendar</h1>
      <p className="rounded-xl bg-mentaSuave p-3 font-semibold">
        {unidade.nmUnidade} · {fmtDiaHora(horario.dtHorario, false)}
      </p>
      <p className="text-base text-textoSuave">Confira se o celular está certo: é por ele que avisamos a confirmação e as vagas.</p>
      {erro && (
        <div className="flex flex-col gap-2">
          <MensagemErro mensagem={erro.mensagem} />
          {erro.ocupado && (
            <Link to={`${BASE_CELULAR}/ubs/${unidade.idUnidade}`} className={BOTAO_CONTORNO}>Escolher outro horário</Link>
          )}
        </div>
      )}
      <FormularioCidadao
        valoresIniciais={cidadao}
        identificacaoSomenteLeitura
        // Regra: a API Java exige CEP com 8 números no PUT /cidadaos/{id}; sem CEP no cadastro, a pessoa informa aqui.
        pedirCep={!cidadao.nrCep}
        nrCep={estado.orientacaoAtual?.nrCep ?? ''}
        aoEnviar={(d) => void aoEnviar(d)}
        textoBotao="Confirmar agendamento"
        textoEnviando="Agendando..."
        enviando={enviando}
      />
    </div>
  );
}
